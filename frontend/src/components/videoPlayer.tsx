import Video from './Video';
import { IUserData } from '../models';
import '../assets/scss/videoplayer.scss'
import { Socket } from 'socket.io-client';

interface IVideoPlayerProps {
  socket: Socket;
  currentUserData: IUserData;
  remoteUserData: IUserData;
}

function VideoPlayer({ currentUserData, remoteUserData, socket }: IVideoPlayerProps) {

  const handleClick = () => {
    if (!currentUserData.user) return
    socket.emit('change-room', currentUserData.user)
  }

  socket.on('user-disconnected', () => remoteUserData.videoRef.current!.srcObject = null)

  return <div className="videoPlayer">

    <div className="head">
      <h1>Chat Video</h1>
    </div>

    <div className="video-group">
      <Video
        userData={currentUserData}
        socket={socket}
      />
      <Video
        userData={remoteUserData}
        socket={socket}
      />
    </div>

    <div className="find-user">
      <button className="btn-change" onClick={handleClick}>Changer de gueule</button>
    </div>
  </div>;
}

export default VideoPlayer;