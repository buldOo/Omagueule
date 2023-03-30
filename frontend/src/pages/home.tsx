import { useState, useEffect, useRef } from 'react';
import SideBar from '../components/sidebar';
import '../assets/scss/home.scss';
import { IUser } from '../models';
import Peer from 'peerjs';
import io from 'socket.io-client';
import VideoPlayer from '../components/videoPlayer';
import Chat from '../components/chat';
import { useLocation, useNavigate } from 'react-router-dom';

const BACK_URL = 'http://localhost:3000';
//const BACK_URL = '10.57.32.17:3000';
const socket = io(BACK_URL);

function Home() {
  const [currentUser, setCurrentUser] = useState<IUser>()
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const remoteUserVideoRef = useRef<HTMLVideoElement>(null);

  const peer = new Peer()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!location.state) return navigate('/onboarding')
    const username = location.state.username

    peer.on('open', (currentUserId: string) => {
      const newUser: IUser = {
        id: currentUserId,
        name: username || 'Anonymous',
      }
      // join the room when the page loads
      socket.emit('join-room', newUser)
      setCurrentUser(newUser)
      console.log('current user', currentUserId)

      // get room messages
      socket.emit('get-room-messages', currentUserId);
    })

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
          call.on('stream', remoteStream => {
            console.log('ouais ouais');

            remoteUserVideoRef.current!.srcObject = remoteStream
          }
          )
        })
      })
  }, [])

  socket.on('no-room-available', (userId: string) => console.log('no room available for user', userId))
  socket.on('user-disconnected', (userId: string) => console.log('user disconnected', userId))

  return (
    <div className="Home">
      <SideBar />
      <div className="content">
        <VideoPlayer
          socket={socket}
          remoteUserVideoRef={remoteUserVideoRef}
          currentUserVideoRef={currentUserVideoRef}
        />
        <Chat socket={socket} currentUser={currentUser} />
      </div>
    </div>
  );
};

export default Home;
