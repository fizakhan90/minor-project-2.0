const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);

const { Server } = require('socket.io');

const io = new Server(server, {
    cors: {
        origin: true,
        methods: ['GET', 'POST'],
        transports: ['polling', 'websocket'],
    },
    allowEIO3: true,
    path: '/api/socket/'
});

const port = process.env.PORT || 3001;

app.use('/static', express.static(path.join(__dirname, '../fe/build/static')))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../fe/build/index.html'));
});

server.listen(port);

io.on('connection', (socket) => {
    console.log('connect')
    socket.on('message_from_client', (message) => {
        console.log('got message', message)
    });
});


