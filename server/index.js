const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { start } = require('repl');

// Router
const router = express.Router();

let alreadyRestarted;
const restartGame = router.post('/', async (req, res) => {
  if (!alreadyRestarted) startEmmiting(randomArr);

  alreadyRestarted = true;

  console.log('Game Restarted');
  res.status(201).send('Restarted');
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/restart', restartGame);

// Creating a server
const server = http.createServer(app);

// To work with socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
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
    console.log(randomArr[index]);
    index++;
  }, 2000);
}

// Stop Emmiting
function stopEmitting() {
  clearInterval(intervalId);
  intervalId = null;
}

// Connecting frontend and backend
let alreadyEmmiting;
let socketIds = [];
const users = new Map();

io.on('connection', socket => {
  console.log(`User connected: ${socket.id}`);

  //Start emmiting when the user enters or the connection started
  if (!alreadyEmmiting) startEmmiting(randomArr);

  // Identifing users with custom id
  socket.on('register', userId => {
    users.set(socket.id, { userId });
    console.log(`Registered user ${userId} with socket ${socket.id}`);
  });
  alreadyEmmiting = true;

  // Listening on the event from frontend
  socket.on('send_message', data => {
    console.log(data);
    stopEmitting();
    alreadyEmmiting = false;
    socket.broadcast.emit('game_ended', data);
  });
});

// Starting the server on port 3001
server.listen(3001, () => {
  console.log('SERVER IS RUNNING ON PORT 3001 ....');
});
