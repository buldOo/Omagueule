export interface IUser {
  id: string
  name: string
}

export interface IRoom {
  id: string
  users: IUser[]
  messages: IMessage[]
}

export interface IMessage {
  userId: string,
  body: string
}