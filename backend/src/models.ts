export interface User {
  id: string
  name: string
  roomId: string
}

export interface Room {
  id: string
  name: string
  users: string[]
  messages: Message[]
}

export interface Message {
  userId: string,
  message: string
}