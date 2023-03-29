import { MAX_USERS_PER_ROOM, NUMBERS_OF_ROOMS } from "./constants";
import { IMessage, IRoom, IUser } from "./models";

export const createRooms = (): IRoom[] =>
  Array.from({ length: NUMBERS_OF_ROOMS }, (_, i) => ({
    id: `room-${i + 1}`,
    users: [],
    messages: []
  }))

export const getRoomForUser = (rooms: IRoom[]): IRoom | undefined =>
  rooms.find(room => room.users.length < MAX_USERS_PER_ROOM)

export const addUserToRoom = (rooms: IRoom[], roomId: string, user: IUser): IRoom[] =>
  rooms.map(room => {
    if (room.id === roomId) {
      return { ...room, users: [...room.users, user] }
    }
    return room
  })

export const removeUserFromRoom = (rooms: IRoom[], roomId: string, user: IUser): IRoom[] =>
  rooms.map(room => {
    if (room.id === roomId) {
      return { ...room, users: room.users.filter(u => u.id !== user.id) }
    }
    return room
  })

export const addMessageToRoom = (rooms: IRoom[], roomId: string, message: IMessage): IRoom[] =>
  rooms.map(room => {
    if (room.id === roomId) {
      return { ...room, messages: [...room.messages, message] }
    }
    return room
  })

export const getRoomById = (rooms: IRoom[], id: string): IRoom | undefined =>
  rooms.find(room => room.id === id)

export const getUserRoom = (rooms: IRoom[], userId: string): IRoom | undefined =>
  rooms.find(room => room.users.find(user => user.id === userId))

export const getUserById = (room: IRoom, id: string): IUser | undefined =>
  room.users.find(user => user.id === id)