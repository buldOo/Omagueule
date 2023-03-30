import React, { useState, useEffect, useRef } from 'react';
import { LoadingOutlined, SmileOutlined }  from '@ant-design/icons';
import '../assets/scss/videoplayer.scss'
import Loading from './loading';
import { message } from 'antd';
import Peer from 'peerjs';
import { Socket } from 'socket.io-client';


interface IVideoPlayerProps {
  socket: Socket;
}


function VideoPlayer( {socket}:IVideoPlayerProps ) {



  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const remoteUserVideoRef = useRef<HTMLVideoElement>(null);
  
  const peer = new Peer()


  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        // display current user video
        currentUserVideoRef.current!.srcObject = stream

        peer.on('call', call => {
          call.answer(stream)
          call.on('stream', remoteStream =>
            remoteUserVideoRef.current!.srcObject = remoteStream
          );
        })

        socket.on('user-connected', (remoteUserId: string) => {
          console.log('remote user id', remoteUserId);
          // connect to remote user
          const call = peer.call(remoteUserId, stream)
          call.on('stream', remoteStream =>
            remoteUserVideoRef.current!.srcObject = remoteStream
          )
        })
      })
  }, [])

  return <div className="videoPlayer">

      
      <div className="head">
        <h1>Chat Video</h1>
      </div>
      
      <div className="video-group">
        <video className="video" autoPlay={true} ref={currentUserVideoRef} muted />
        <video className="video" autoPlay={true} ref={currentUserVideoRef} muted />

      </div>

      <div className="find-user">
        <button className="btn-change">Changer de Gueule</button>
      </div>


    </div>;
}

export default VideoPlayer;