const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Middlewares
app.use(cors());

// Creating a server
const server = http.createServer(app);

// To work with socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Emmiting random number every 5 second

const UniqueNums = new Set();
while (UniqueNums.size < 75) {
  const num = Math.floor(Math.random() * 75) + 1;
  UniqueNums.add(num);
}

const randomArr = Array.from(UniqueNums);
let index = 0;

const emmitNumbers = setInterval(() => {
  io.emit('receive_message', {
    num: randomArr[index],
    allDrawnNumbers: randomArr.slice(0, index + 1),
  });
  index++;
}, 5000);

// Connecting frontend and backend
io.on('connection', socket => {
  console.log(`User connected: ${socket.id}`);

  // Listening on the event from frontend
  socket.on('send_message', data => {
    console.log(data);
    clearInterval(emmitNumbers);
    socket.broadcast.emit('game_ended', data);
  });
});

// Starting the server on port 3001
server.listen(3001, () => {
  console.log('SERVER IS RUNNING ON PORT 3001 ....');
});
