const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let onlineUsers = [];

app.use(express.static(__dirname + '/public'));

// Listen for connection event from client
io.on('connection', (socket) => {
    console.log('User connected');
    // Update online users list
    socket.on('user joined', (username) => {
      if (onlineUsers.indexOf(username) === -1) {
        onlineUsers.push(username);
        socket.username = username;
        console.log('User joined: ',username);
        io.emit('update userlist', onlineUsers);
      }
    })
    // Listen for the 'chatMessage' event from the client
    socket.on('chatMessage', (message) => {
        // Emit the 'chatMessage' event to all connected clients
        io.emit('chatMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
