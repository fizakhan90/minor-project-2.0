import { io } from "socket.io-client";
//import * as Peer from 'simple-peer';

const socket = io('http://localhost:3001', {
    path: '/api/socket/',
});

let config = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

const peer = new RTCPeerConnection(config);

socket.on("signal_to_web", async (message) => {
    console.log('message from service', message)
    if (message.answer) {
        await peer.setRemoteDescription(message.answer);
    }

    if (message.iceCandidate) {
        console.log('add candidate');
        await peer.addIceCandidate(message.iceCandidate);
    }
});

peer.onicecandidate = (event) => {
    console.log('candidate');
    socket.emit("message_from_web", { iceCandidate: event.candidate });
};

peer.ontrack = (event) => {
    console.log('track added!!!', event.streams[0])
    const video = document.getElementById('localVideo');

    if (video) {
        video.srcObject = event.streams[0];
        video.play();
    }
};

const init = async () => {
    console.log('init');
    const offer = await peer.createOffer({ offerToReceiveVideo: true, });
    await peer.setLocalDescription(offer);

    socket.emit("message_from_web", { offer });
};


socket.on('connect', () => {
    console.log('web connected');
    socket.emit('init_web');
    init();
})

// peer.on('signal', (data) => {
//     console.log('signal to web');
//     socket.emit('message_from_web', data);
// });
// peer.on('stream', (stream) => {
//     console.log('stream added!!!', stream);
// });
// socket.on('signal_to_web', (data) => {
//     peer.signal(data);
// });