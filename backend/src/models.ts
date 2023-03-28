export interface IUser {
  id: string
  name: string
  roomId: string
}

export interface IRoom {
  id: string
  users: string[]
}

export interface IMessage {
  message: string
}