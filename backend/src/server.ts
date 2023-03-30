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

// initialize rooms
let rooms: IRoom[] = createRooms()
console.log(rooms);

io.on('connection', (socket: Socket) => {
  socket.on('join-room', (user: IUser) => joinRoom(socket, user))
  socket.on('get-room-messages', (userId: string) => sendRoomMessages(socket, userId))
  socket.on('message', (message: IMessage) => createMessage(message))
});

const joinRoom = (socket: Socket, user: IUser) => {
  const room = getRoomForUser(rooms)

  if (!room) {
    console.log('no room available for user', user.id)
    return socket.emit('no-room-available', user.id)
    // TOOD create a new room and add user to it
  }
  // update rooms
  rooms = addUserToRoom(rooms, room.id, user)
  console.log(rooms);

  console.log(`user ${user.id} joining room ${room.id}`)
  socket.join(room.id)
  socket.to(room.id).emit('user-connected', user)

  socket.on('disconnect', () => disconnect(socket, room, user))
}

const disconnect = (socket: Socket, room: IRoom, user: IUser) => {
  // update rooms
  rooms = removeUserFromRoom(rooms, room.id, user)
  console.log(rooms);

  console.log(`user ${user.id} disconnected from room ${room.id}`)
  socket.to(room.id).emit('user-disconnected', user.id)
}

const sendRoomMessages = (socket: Socket, userId: string) => {
  const room = getUserRoom(rooms, userId)
  if (!room) return

  socket.emit('room-messages', room.messages)
}

const createMessage = (message: IMessage) => {
  const room = getUserRoom(rooms, message.user.id);
  if (!room) return

  const user = getUserById(room, message.user.id);
  if (!user) return

  const chatMessage: IMessage = { user, body: message.body };

  // update rooms
  rooms = addMessageToRoom(rooms, room.id, chatMessage)
  console.log(rooms);

  io.to(room.id).emit('chat-message', [...room.messages, message]);
}


server.listen(3000, () =>
  console.log('Server listening on port 3000')
);
