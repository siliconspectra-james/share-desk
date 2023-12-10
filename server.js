import express from 'express';
import http from 'http';
import { Server as SocketIO } from "socket.io";
import { Command } from 'commander';
import * as url from 'url';


const app = express();
const httpServer = http.createServer(app);
const io = new SocketIO(httpServer);
const room = 'room';
const rootPath = url.fileURLToPath(new URL('.', import.meta.url));
const port = process.env.PORT || 3000

app.use(express.static('public'));
app.get('/streamer', (req, res) => {
    res.sendFile(rootPath + 'public/streamer.html');
});
app.get('/receiver', (req, res) => {
    res.sendFile(rootPath + 'public/receiver.html');
});

app.get('/', (req, res) => {
    res.sendFile(rootPath + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('join-receiver', () => {
        socket.join(room);
        socket.on('disconnect', () => {
            socket.to(room).emit('receiver-disconnected');
        });
    });

    socket.on('join-streamer', () => {
        socket.join(room);
        socket.on('disconnect', () => {
            socket.to(room).emit('streamer-disconnected');
        });
    });

    socket.on('screen-sharing-stopped', () => {
        socket.to(room).emit('remove-video');
    });
});

httpServer.listen(port);

