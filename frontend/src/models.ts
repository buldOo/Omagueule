export interface IMessage {
  user: IUser,
  body: string
}
export interface IUser {
  id: string
  name: string
}