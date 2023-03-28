import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';

const BACK_URL = 'http://localhost:3000';
// const BACK_URL = '10.57.29.242:3000';

const socket = io(BACK_URL);

const App = () => {
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const remoteUserVideoRef = useRef<HTMLVideoElement>(null);

  const peer = new Peer()

  useEffect(() => {
    peer.on('open', currentUserId => {
      // join the room when the page loads
      socket.emit('join-room', currentUserId)
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

  const user1JoinRoom1 = () => {
    socket.emit('join-room', { roomId: 'room1', username: 'name1' });
  }

  const user2joinRoom1 = () => {
    socket.emit('join-room', { roomId: 'room1', username: 'name2' });
  }

  const getRooms = () => {
    socket.emit('get-rooms');
  }

  const getRoomUsers = () => {
    socket.emit('get-room-users', { roomId: 'room1' });
  }

  const sendMessage = () => {
    socket.emit('message', { roomId: 'room1', message: 'Hello' });
  }

  const getRoomMessages = () => {
    socket.emit('get-room-messages', { roomId: 'room1' });
  }

  socket.on('no-room-available', (userId: string) => {
    console.log('no room available for user', userId)
  })

  socket.on('user-disconnected', (userId: string) => {
    console.log('user disconnected', userId)
  })

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



      <p>Oh ma gueule</p>
      <button onClick={user1JoinRoom1}>join room</button>
      <button onClick={user2joinRoom1}>join room</button>
      <button onClick={getRooms}>get rooms</button>
      <button onClick={getRoomUsers}>get room users</button>
      <button onClick={sendMessage}>send message</button>
      <button onClick={getRoomMessages}>get room messages</button>
    </div>
  );
};

export default App;
