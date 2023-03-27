import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';

const socket = io('http://localhost:3000');

const App = () => {
  const ROMM_ID = 'room-1679927673915';

  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const remoteUserVideoRef = useRef<HTMLVideoElement>(null);


  const peer = new Peer()

  const connectToRemoteUser = (userId: string, stream: MediaStream) => {
    const call = peer.call(userId, stream)
    call.on('stream', remoteStream =>
      remoteUserVideoRef.current!.srcObject = remoteStream
    )
  }

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        currentUserVideoRef.current!.srcObject = stream

        peer.on('call', call => {
          call.answer(stream)
          call.on('stream', remoteStream =>
            remoteUserVideoRef.current!.srcObject = remoteStream
          );
        })

        socket.on('user-connected', (userId: string) => {
          console.log('remote user id', userId);
          connectToRemoteUser(userId, stream)
        })
      })
  }, [])

  useEffect(() => {
    peer.on('open', id => {
      socket.emit('join-room', ROMM_ID, id)
      console.log('current user', id)
    })
  }, [])

  return (
    <div className="App" style={{ display: 'flex' }}>
      <div>
        <p>moi</p>
        <video autoPlay={true} ref={currentUserVideoRef} muted style={{ width: '60%' }} />
      </div>
      <div>
        <p>lui</p>
        <video autoPlay={true} ref={remoteUserVideoRef} muted style={{ width: '60%' }} />
      </div>
    </div>
  );
};

export default App;
