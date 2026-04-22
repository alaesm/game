import { io } from 'socket.io-client';

// Create socket instance with error handling

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const socket = io(API_URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Add connection status logging
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

export const createRoom = (roomId: string, username: string) => {
  socket.emit('create_room', { room_id: roomId, username });
};

export const joinRoom = (roomId: string, username: string) => {
  console.log('Joining room:', { roomId, username });
  socket.emit('join_room', { room_id: roomId, username });
};

export const makeMove = (roomId: string, username: string, action: [number, number]) => {
  console.log('Making move:', { roomId, username, action });
  socket.emit('make_move', { room_id: roomId, username, action });
};

export const resetGame = (roomId: string) => {
  console.log('Resetting game:', { roomId });
  socket.emit('reset_game', { room_id: roomId });
};

export const leavingRoomGame = (roomId: string) => {
  console.log('Leave the room:', { roomId });
  socket.emit('reset_game', { room_id: roomId });
};