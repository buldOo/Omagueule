import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';

const BACK_URL = 'http://localhost:3000';
const socket = io(BACK_URL);

const App = () => {
  const ROMM_ID = 'room-1679927673915';

  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const remoteUserVideoRef = useRef<HTMLVideoElement>(null);

  const peer = new Peer()

  useEffect(() => {
    peer.on('open', currentUserId => {
      // join the room when the page loads
      socket.emit('join-room', ROMM_ID, currentUserId)
      console.log('current user', currentUserId)
    })
  }, [])

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
