const config = require('./auth');
const { auth } = require('express-openid-connect');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require("socket.io");

const io = socketio(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

app.get('/', (req, res) => {
    res.send('boom')
});

io.on('connection', (socket) => {
    // console.log(socket)
    // console.log('a user connected', socket.request._query);
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', message)
    })
    socket.on('user-wave', message => {
        console.log('waving.....', message)
        socket.broadcast.emit('user-online', message)
    })
    socket.broadcast.emit('user-online', socket.request._query)
});

io.on('disconnect', socket => {
    console.log('a user disconnected')
})

server.listen(5000, () => {
    console.log('listening on *:5000');
});