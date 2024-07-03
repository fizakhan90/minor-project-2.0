import { io } from "socket.io-client";
//import Peer from "../../node_modules/simple-peer/index.js";

const socket = io('http://localhost:3001', {
    path: '/api/socket/',
});
let config = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};
const peer = new RTCPeerConnection(config);

async function showDevices() {
    let devices = (await navigator.mediaDevices.enumerateDevices()).filter(i => i.kind == 'videoinput')
    console.log('showDevices', devices[0].kind)
}
socket.on('connect', () => {
    console.log('Connected');
    //showDevices();
    socket.emit('init_service');

    socket.on('signal_to_service', async (message) => {
        console.log('signal from web', message);
        if (message.offer) {
            await peer.setRemoteDescription(new RTCSessionDescription(message.offer));
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            socket.emit('message_from_service', { answer });

            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                console.log('stream added', stream);
                peer.addStream(stream);
            });
        }
        if (message.answer) {
            await peer.setRemoteDescription(message.answer);
        }
        if (message.iceCandidate) {
            await peer.addIceCandidate(message.iceCandidate);
        }
    });
})

peer.onicecandidate = (event) => {
    console.log('candidate');
    socket.emit("message_from_service", { iceCandidate: event.candidate });
};

// peer.on('signal', (data) => {
//     console.log('signal to web');
//     socket.emit('message_from_service', data);
// });
