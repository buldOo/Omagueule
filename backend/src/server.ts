import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

interface User {
  id: string;
  name: string;
}

interface Room {
  id: string;
  name: string;
  users: User[];
  messages: { user: string, message: string }[];
}

let rooms: Room[] = [];

function getRoomById(id: string): Room | undefined {
  return rooms.find(room => room.id === id);
}

function getUserById(room: Room, id: string): User | undefined {
  return room.users.find(user => user.id === id);
}

io.on('connection', (socket: Socket) => {
  console.log('A user connected');

  socket.on('join-room', ({ roomId, username }) => {
    console.log('A user joined room', roomId, username);
    
    socket.join(roomId);

    let room = getRoomById(roomId);
    if (!room) {
      room = { id: roomId, name: roomId, users: [], messages: [] };
      rooms.push(room);
    }

    const user: User = { id: socket.id, name: username };
    room.users.push(user);

    io.to(roomId).emit('user joined', { room, user });
  });

  socket.on('leave-room', ({ roomId }) => {
    const room = getRoomById(roomId);
    if (room) {
      const user = getUserById(room, socket.id);
      if (user) {
        room.users = room.users.filter(u => u.id !== socket.id);
        io.to(roomId).emit('user left', { room, user });
      }
    }

    socket.leave(roomId);
  });

  socket.on('get-rooms', () => {
    socket.emit('rooms', rooms);
    console.log('rooms', rooms);
  });

  socket.on('get-room-users', ({ roomId }) => {
    const room = getRoomById(roomId);
    if (room) {
      socket.emit('room users', room.users);
      console.log('room users', room.users);
    }
  });

  socket.on('get-room-messages', ({ roomId }) => {
    const room = getRoomById(roomId);
    if (room) {
      socket.emit('room messages', room.messages);
    // loop through the messages and log them by property
      room.messages.forEach(message => {
        console.log(`message.user: ${message.user}, message.message: ${message.message}`);
      } );
    }
  });

  socket.on('message', ({ roomId, message }) => {
    const room = getRoomById(roomId);
    if (room) {
      const user = getUserById(room, socket.id);
      if (user) {
        const chatMessage = { user: user.name, message };
        room.messages.push(chatMessage);
        console.log(message);
        io.to(roomId).emit('chat message', { room, message: chatMessage });
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');

    rooms.forEach(room => {
      const user = getUserById(room, socket.id);
      if (user) {
        room.users = room.users.filter(u => u.id !== socket.id);
        io.to(room.id).emit('user left', { room, user });
      }
    });
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
