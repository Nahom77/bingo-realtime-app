const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { start } = require('repl');

const users = new Map();

// Router
const router = express.Router();

// let alreadyRestarted;
let alreadyEmmiting;
const restartGame = router.post('/', async (req, res) => {
  if (!alreadyEmmiting) startEmmiting(randomArr);

  alreadyEmmiting = true;

  console.log('Game Restarted');
  res.status(201).send('Restarted');
});

// Middlewares
require('./prod')(app);
app.use(cors());
app.use(express.json());
app.use('/restart', restartGame);

// Creating a server
const server = http.createServer(app);

// To work with socket.io
const io = new Server(server, {
  cors: {
    origin: 'https://bingo-game-by-nahom.vercel.app',
    methods: ['GET', 'POST'],
  },
});

// Generating unique random 75 numbers
const UniqueNums = new Set();
while (UniqueNums.size < 75) {
  const num = Math.floor(Math.random() * 75) + 1;
  UniqueNums.add(num);
}

const randomArr = Array.from(UniqueNums);

let intervalId = null;
function startEmmiting(randomArr) {
  // Emmiting random number every 5 second
  let index = 0;

  intervalId = setInterval(() => {
    io.emit('receive_message', {
      num: randomArr[index],
      allDrawnNumbers: randomArr.slice(0, index + 1),
    });
    console.log(index, randomArr[index]);
    index = (index + 1) % 75;
  }, 5000);
}

// Stop Emmiting
function stopEmitting() {
  clearInterval(intervalId);
  intervalId = null;
}

// Connecting frontend and backend

io.on('connection', socket => {
  console.log(`User connected: ${socket.id}`);

  // Registering a user to a map
  users.set(socket.id, socket.id);
  // console.log(`Registered user ${userId} with socket ${socket.id}`);

  //Start emmiting when the user enters or the connection started
  if (!alreadyEmmiting && users.size > 0) startEmmiting(randomArr);
  console.log(users.size);

  alreadyEmmiting = true;

  // Listening on the event from frontend
  socket.on('send_message', data => {
    console.log(data);
    stopEmitting();
    alreadyEmmiting = false;
    // alreadyRestarted = false;
    socket.broadcast.emit('game_ended', data);
  });

  // Stopping the interval when disconnected
  socket.on('disconnect', () => {
    users.delete(socket.id); // To delete a user when he disconnects

    if (users.size === 0) stopEmitting();
    alreadyEmmiting = false; // Clean up interval on disconnect
    console.log(`User disconnected: ${socket.id}`);
    console.log(users);
  });
});

// Starting the server on port 3001
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log('SERVER IS RUNNING ON PORT 3001 ....');
});
