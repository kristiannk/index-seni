const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

let lastState = null;

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('state', (data) => {
    lastState = data;
    socket.broadcast.emit('state', data);
  });

  socket.on('request-state', () => {
    if (lastState) {
      socket.emit('state', lastState);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
