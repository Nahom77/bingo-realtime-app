// socket.ts
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'https://bingo-game-by-nahom-a5271bb57d5f.herokuapp.com/';

const socket: Socket = io(SOCKET_URL, { autoConnect: false });

export default socket;
