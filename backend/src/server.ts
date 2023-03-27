/* eslint-disable no-console */
import * as http from 'http'
import * as admin from 'firebase-admin'
import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import * as creds from './creds.json'
import { IMessage } from './models'

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
  cors: { origin: '*' },
})

io.on('connection', (socket) => {
  socket.on('join-room', (roomId: string, userId: string) => {
    console.log('joining', roomId)
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)
  })
})

server.listen(3000, () => {
  console.log('listening on 3000')
})
