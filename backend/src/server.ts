/* eslint-disable no-console */
import * as http from 'http'
import * as admin from 'firebase-admin'
import express from 'express'
import cors from 'cors'
import { Server, Socket } from 'socket.io'
import * as creds from './creds.json'
import { IRoom } from './models'
import { addUserToRoom, createRooms, getRoomForUser, removeUserFromRoom } from './utils'

admin.initializeApp({
  credential: admin.credential.cert(creds as admin.ServiceAccount),
  databaseURL: 'https://ohmagueule-e01fc-default-rtdb.europe-west1.firebasedatabase.app',
})

const db = admin.database()

const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: '*' }
})

// initialize rooms
let rooms: IRoom[] = createRooms()
console.log(rooms);


io.on('connection', (socket: Socket) => {
  socket.on('join-room', (userId: string) => joinRoom(socket, userId))
})

const joinRoom = (socket: Socket, userId: string) => {
  const room = getRoomForUser(rooms, userId)

  if (!room) {
    console.log('no room available for user', userId)
    return socket.emit('no-room-available', userId)
  }

  // update rooms
  rooms = addUserToRoom(rooms, room.id, userId)
  console.log(rooms);

  console.log(`user ${userId} joining room ${room.id}`)
  socket.join(room.id)
  socket.to(room.id).emit('user-connected', userId)

  socket.on('disconnect', () => disconnect(socket, room, userId))
}

const disconnect = (socket: Socket, room: IRoom, userId: string) => {
  // update rooms
  rooms = removeUserFromRoom(rooms, room.id, userId)
  console.log(rooms);

  console.log(`user ${userId} disconnected from room ${room.id}`)
  socket.to(room.id).emit('user-disconnected', userId)
}

server.listen(3000, () => {
  console.log('listening on 3000')
})