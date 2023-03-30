import { RefObject } from "react";

export interface IMessage {
  user: IUser,
  body: string
}
export interface IUser {
  id: string
  name: string
}
export interface IUserData {
  videoRef: RefObject<HTMLVideoElement>;
  user?: IUser;
  helperText: string;
}