/* eslint-disable no-console */
import * as http from 'http'
import express from 'express'
import cors from 'cors'
import { Server, Socket } from 'socket.io'
import { IMessage, IRoom, IUser } from './models'
import { addMessageToRoom, addUserToRoom, createRooms, getRoomById, getRoomForUser, getUserById, getUserRoom, removeUserFromRoom } from './utils'

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

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

// initialize rooms
let rooms: IRoom[] = createRooms()
console.log(rooms);



io.on('connection', (socket: Socket) => {
  socket.on('join-room', (user: IUser) => joinRoom(socket, user))

  /* socket.on('leave-room', ({ roomId }) => {
    const room = getRoomById(roomId);
    if (room) {
      const user = getUserById(room, socket.id);
      if (user) {
        room.users = room.users.filter(u => u.id !== socket.id);
        io.to(roomId).emit('user left', { room, user });
      }
    }

    socket.leave(roomId); */

  socket.on('get-rooms', () => {
    socket.emit('rooms', rooms);
    console.log('rooms', rooms);
  });


  socket.on('get-room-messages', (userId: string) => {
    const room = getUserRoom(rooms, userId);
    if (room) {
      socket.emit('room messages', room.messages);
      // loop through the messages and log them by property
      room.messages.forEach(message => {
        console.log(`message.user: ${message.userId}, message: ${message.body}`);
      });
    }
  });

  socket.on('message', (message: IMessage) => {
    const room = getUserRoom(rooms, message.userId);
    if (!room) return

    const user = getUserById(room, message.userId);
    if (!user) return

    const chatMessage: IMessage = { userId: user.id, body: message.body };

    // update rooms
    addMessageToRoom(rooms, room.id, chatMessage)
    console.log(rooms);

    io.to(room.id).emit('chat-message', { room, message: chatMessage });
  });
});

const joinRoom = (socket: Socket, user: IUser) => {
  const room = getRoomForUser(rooms)

  if (!room) {
    console.log('no room available for user', user.id)
    return socket.emit('no-room-available', user.id)
    // create a new room and add user to it
  }

  // update rooms
  rooms = addUserToRoom(rooms, room.id, user)
  console.log(rooms);

  console.log(`user ${user.id} joining room ${room.id}`)
  socket.join(room.id)
  socket.to(room.id).emit('user-connected', user.id)

  socket.on('disconnect', () => disconnect(socket, room, user))
}

const disconnect = (socket: Socket, room: IRoom, user: IUser) => {
  // update rooms
  rooms = removeUserFromRoom(rooms, room.id, user)
  console.log(rooms);

  console.log(`user ${user.id} disconnected from room ${room.id}`)
  socket.to(room.id).emit('user-disconnected', user.id)
}

server.listen(3000, () =>
  console.log('Server listening on port 3000')
);
