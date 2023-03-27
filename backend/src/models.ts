export interface IUser {
  id: string
  name: string
  roomId: string
}

export interface IRoom {
  id: string
  name: string
  users: string[]
  messages: IMessage[]
}

export interface IMessage {
  message: string
}