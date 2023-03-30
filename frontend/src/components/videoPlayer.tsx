import React from 'react';
import '../assets/scss/videoplayer.scss'
import Peer from 'peerjs';
import { Socket } from 'socket.io-client';

interface IVideoPlayerProps {
  socket: Socket;
  remoteUserVideoRef: React.RefObject<HTMLVideoElement>;
  currentUserVideoRef: React.RefObject<HTMLVideoElement>;
}

function VideoPlayer({ remoteUserVideoRef, currentUserVideoRef }: IVideoPlayerProps) {

  return <div className="videoPlayer">

    <div className="head">
      <h1>Chat Video</h1>
    </div>

    <div className="video-group">
      <video className="video" autoPlay={true} ref={currentUserVideoRef} muted />
      <video className="video" autoPlay={true} ref={remoteUserVideoRef} muted />
    </div>

    <div className="find-user">
      <button className="btn-change">Changer de Gueule</button>
    </div>
  </div>;
}

export default VideoPlayer;