import { IUserData } from "../models"
import '../assets/scss/videoplayer.scss'
import { useState } from "react"
import { Socket } from "socket.io-client";

interface IVideoProps {
  userData: IUserData;
  socket: Socket;
}

const Video = ({ userData, socket }: IVideoProps) => {
  const [showUsername, setShowUsername] = useState<boolean>(false)

  return <div
    className="video-container"
    onMouseEnter={() => setShowUsername(true)}
    onMouseLeave={() => setShowUsername(false)}
  >
    <div className="helper-text"><p>{userData.helperText}</p></div>
    {showUsername && userData.user && <div className="hover-container"><p>{userData.user.name}</p></div>}
    <video className="video" autoPlay={true} ref={userData.videoRef} />
  </div>
}

export default Video