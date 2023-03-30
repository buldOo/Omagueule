import { useState, useEffect, useRef } from 'react';
import '../assets/scss/home.scss';
import { IUser } from '../models';
import Peer from 'peerjs';
import io from 'socket.io-client';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import VideoPlayer from '../components/videoPlayer';
import Chat from '../components/chat';

const BACK_URL = 'http://localhost:3000';
//const BACK_URL = '10.57.32.17:3000';
const socket = io(BACK_URL);

function Home() {
  const [currentUser, setCurrentUser] = useState<IUser>()
  const [remoteUser, setRemoteUser] = useState<IUser>()

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

        socket.on('user-connected', (remoteUser: IUser) => {
          console.log('remote user id', remoteUser.id);
          setRemoteUser(remoteUser)
          // connect to remote user
          const call = peer.call(remoteUser.id, stream)
          call.on('stream', remoteStream =>
            remoteUserVideoRef.current!.srcObject = remoteStream
          )
        })
      })
  }, [])

  socket.on('no-room-available', (userId: string) => console.log('no room available for user', userId))

  const currentUserData = {
    videoRef: currentUserVideoRef,
    user: currentUser,
    helperText: 'En attente de votre flux vidéo...'
  }
  const remoteUserData = {
    videoRef: remoteUserVideoRef,
    user: remoteUser,
    helperText: 'En attente d\'un autre utilisateur...'
  }

  return (
    <div className="Home">
      <Sidebar />
      <div className="content">
        <VideoPlayer
          remoteUserData={remoteUserData}
          currentUserData={currentUserData}
          socket={socket}
        />
        <Chat socket={socket} currentUser={currentUser} />
      </div>
    </div>
  );
};

export default Home;
