/* eslint-disable no-console */
import * as http from 'http'
import express from 'express'
import cors from 'cors'
import { Server, Socket } from 'socket.io'
import { IMessage, IRoom, IUser } from './models'
import { addMessageToRoom, addUserToRoom, createRoom, getRemoteUser, getRoomForUser, getUserById, getUserRoom, removeUserFromRoom } from './utils'
import { SERVER_PORT } from './constants'

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// initialize rooms
let rooms: IRoom[] = [createRoom()]
console.log(rooms);

io.on('connection', (socket: Socket) => {
  socket.on('join-room', (user: IUser) => joinRoom(socket, user))
  socket.on('get-remote-user', (userId: string) => sendRemoteUser(socket, userId))
  socket.on('get-room-messages', (userId: string) => sendRoomMessages(socket, userId))
  socket.on('message', (message: IMessage) => createMessage(message))
  socket.on('change-room', (user: IUser) => changeRoom(socket, user))
});

const joinRoom = (socket: Socket, user: IUser) => {
  const room = getRoomForUser(rooms)

  if (room) {
    // update rooms by adding user to it
    rooms = addUserToRoom(rooms, room.id, user)
    console.log(rooms);

    console.log(`user ${user.id} joining room ${room.id}`)
    socket.join(room.id)
    socket.to(room.id).emit('user-connected', user)

    socket.on('disconnect', () => disconnect(socket, room, user))
  } else {
    // create a new room and add user to it
    rooms = [...rooms, createRoom()]
    console.log(rooms);

    joinRoom(socket, user)
  }
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

const sendRemoteUser = (socket: Socket, userId: string) => {
  const room = getUserRoom(rooms, userId)
  if (!room) return

  const user = getRemoteUser(room, userId)
  if (!user) return

  socket.emit('remote-user', user)
}

const changeRoom = (socket: Socket, user: IUser) => {
  // find a new room
  const previousRoom = getUserRoom(rooms, user.id)
  const newRoom = getRoomForUser(rooms)

  if (!previousRoom) return
  if (newRoom) {
    // update rooms
    rooms = addUserToRoom(rooms, newRoom.id, user)
    rooms = removeUserFromRoom(rooms, previousRoom.id, user)
    console.log(rooms);

    joinNewRoom(socket, user, newRoom)
  } else {
    // create a new room and add user to it
    const createdRoom: IRoom = createRoom()

    rooms = [...rooms, createdRoom]
    rooms = addUserToRoom(rooms, createdRoom.id, user)
    rooms = removeUserFromRoom(rooms, previousRoom.id, user)
    console.log(rooms);

    joinNewRoom(socket, user, createdRoom)
  }
  // notify previous room that user has left
  socket.to(previousRoom.id).emit('user-disconnected', user.id)
}

const joinNewRoom = (socket: Socket, user: IUser, room: IRoom) => {
  console.log(`user ${user.id} joining room ${room.id}`)
  socket.join(room.id)
  socket.to(room.id).emit('user-connected', user)

  // send new room data 
  socket.emit('new-remote-user', getRemoteUser(room, user.id))
  socket.emit('new-room-messages', room.messages)
}

server.listen(SERVER_PORT, () =>
  console.log('Server listening on port 3000')
);
