const path = require("path");
const express = require("express");
const app = express();
const server = require("http").createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST"],
        transports: ["polling", "websocket"],
    },
    allowEIO3: true,
    path: "/api/socket/",
});

const port = process.env.PORT || 3001;

app.use('/static', express.static(path.join(__dirname, 'src/public')))
app.use('/static_web', express.static(path.join(__dirname, 'src_web/public')))

app.get("/service", function (req, res) {
    console.log('service')
    res.sendFile(path.join(__dirname, './src/index.html'));
});

app.get("/main", function (req, res) {
    console.log('main')
    res.sendFile(path.join(__dirname, './src_web/index.html'));
});

server.listen(port);
let serviceSocketId = null;
let webSocketId = null;

io.on("connection", (socket) => {
    console.log("connect");
    socket.on("init_service", (message) => {
        serviceSocketId = socket.id;
    });
    socket.on("init_web", (message) => {
        webSocketId = socket.id;
    });
    socket.on("message_from_service", (message) => {
        console.log('message_from_service', message);
        socket.to(webSocketId).emit("signal_to_web", message);
    });

    socket.on("message_from_web", (message) => {
        console.log('message_from_web', message);
        socket.to(serviceSocketId).emit("signal_to_service", message);
    });
});
