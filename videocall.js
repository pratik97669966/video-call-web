
let localStream;
let currentCamera = 0;
let videoDevices = [];

navigator.mediaDevices.enumerateDevices().then(devices => {
    videoDevices = devices.filter(device => device.kind === 'videoinput');
});

async function startStream() {
    const constraints = {
        video: { deviceId: videoDevices[currentCamera]?.deviceId || undefined },
        audio: true
    };

    localStream = await navigator.mediaDevices.getUserMedia(constraints);
    const video = document.querySelector('video');
    video.srcObject = localStream;
    video.play();
}

document.getElementById("flip-camera").onclick = async () => {
    currentCamera = (currentCamera + 1) % videoDevices.length;
    if (localStream) localStream.getTracks().forEach(track => track.stop());
    await startStream();
};

// Toggle Camera
document.getElementById("toggle-camera").onclick = () => {
    const btn = document.getElementById("toggle-camera");
    const videoTrack = localStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    btn.textContent = videoTrack.enabled ? "📷" : "🚫";
};

// Toggle Blur
document.getElementById("toggle-blur").onclick = () => {
    const btn = document.getElementById("toggle-blur");
    const video = document.querySelector("video");
    const isBlurred = video.classList.toggle("blurred");
    btn.textContent = isBlurred ? "❌" : "🌀";
};


let localVideo = document.getElementById("local-video")
let remoteVideo = document.getElementById("remote-video")

localVideo.style.opacity = 0
remoteVideo.style.opacity = 0

localVideo.onplaying = () => { localVideo.style.opacity = 1 }
remoteVideo.onplaying = () => { remoteVideo.style.opacity = 1 }


let peer
function init(userId) {
    peer = new Peer(userId, {
        host: '0.peerjs.com', secure: true, port: 443,
        config: {
            iceServers: [
                { url: "stun:stun.l.google.com:19302" },
                {
                    url: "turn:relay1.expressturn.com:3478",
                    username: "efVUZD5UTACRXVRWPZ",
                    credential: "8sySd3wS5s4NU2mR",
                },
            ],
        },
    })
    peer.on('open', () => {
        Android.onPeerConnected()
    })

    listen()
}

function listen() {
    peer.on('call', (call) => {

        navigator.getUserMedia({
            audio: true,
            video: true
        }, (stream) => {
            localVideo.srcObject = stream
            localStream = stream

            call.answer(stream)
            call.on('stream', (remoteStream) => {
                remoteVideo.srcObject = remoteStream

                remoteVideo.className = "primary-video"
                localVideo.className = "secondary-video"

            })

        })

    })
}

function startCall(otherUserId) {
    navigator.getUserMedia({
        audio: true,
        video: true
    }, (stream) => {

        localVideo.srcObject = stream
        localStream = stream

        const call = peer.call(otherUserId, stream)
        call.on('stream', (remoteStream) => {
            remoteVideo.srcObject = remoteStream

            remoteVideo.className = "primary-video"
            localVideo.className = "secondary-video"
        })

    })
}
function voiceCall(b) {
    if (b == "true") {
        localStream.getVideoTracks()[0].enabled = true
    } else {
        localStream.getVideoTracks()[0].enabled = false
    }
}
function toggleVideo(b) {
    if (b == "true") {
        localStream.getVideoTracks()[0].enabled = true
    } else {
        localStream.getVideoTracks()[0].enabled = false
    }
}

function toggleAudio(b) {
    if (b == "true") {
        localStream.getAudioTracks()[0].enabled = true
    } else {
        localStream.getAudioTracks()[0].enabled = false
    }
}

