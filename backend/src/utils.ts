import { MAX_USERS_PER_ROOM, NUMBERS_OF_ROOMS } from "./constants";
import { IRoom } from "./models";

export const createRooms = (): IRoom[] =>
  Array.from({ length: NUMBERS_OF_ROOMS }, (_, i) => ({
    id: `room-${i + 1}`,
    users: [],
  }))

export const getRoomForUser = (rooms: IRoom[], userId: string): IRoom | undefined =>
  rooms.find(room => room.users.length < MAX_USERS_PER_ROOM)

export const addUserToRoom = (rooms: IRoom[], roomId: string, userId: string): IRoom[] =>
  rooms.map(room => {
    if (room.id === roomId) {
      return { ...room, users: [...room.users, userId] }
    }
    return room
  })

export const removeUserFromRoom = (rooms: IRoom[], roomId: string, userId: string): IRoom[] =>
  rooms.map(room => {
    if (room.id === roomId) {
      return { ...room, users: room.users.filter(user => user !== userId) }
    }
    return room
  })
