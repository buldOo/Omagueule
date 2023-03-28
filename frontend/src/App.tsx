import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';
import { IMessage, IUser } from './models';

const BACK_URL = 'http://localhost:3000';
// const BACK_URL = '10.57.29.242:3000';

const socket = io(BACK_URL);

const App = () => {
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const remoteUserVideoRef = useRef<HTMLVideoElement>(null);

  const [currentUser, setCurrentUser] = useState<IUser>()
  const [remoteUser, setRemoteUser] = useState<IUser>()

  const [messages, setMessages] = useState<IMessage[]>([])
  const [typingMessage, setTypingMessage] = useState('')

  const peer = new Peer()

  useEffect(() => {
    peer.on('open', currentUserId => {
      const newUser: IUser = {
        id: currentUserId,
        name: 'user 1',
      }
      // join the room when the page loads
      socket.emit('join-room', newUser)
      setCurrentUser(newUser)
      console.log('current user', currentUserId)

      // get room messages
      socket.emit('get-room-messages', currentUserId);
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
          setRemoteUser(remoteUser)
          // connect to remote user
          const call = peer.call(remoteUserId, stream)
          call.on('stream', remoteStream =>
            remoteUserVideoRef.current!.srcObject = remoteStream
          )
        })
      })
  }, [])

  socket.on('room-messages', (messages: IMessage[]) => setMessages(messages))
  socket.on('chat-message', (messages: IMessage[]) => setMessages(messages))

  socket.on('no-room-available', (userId: string) => {
    console.log('no room available for user', userId)
  })

  socket.on('user-disconnected', (userId: string) => {
    console.log('user disconnected', userId)
  })

  const sendMessage = () => {
    const message: IMessage = {
      user: {
        id: currentUser?.id ?? '',
        name: currentUser?.name ?? '',
      },
      body: typingMessage,
    }
    socket.emit('message', message);
  }

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

      <div>
        <div>
          <input type="text" value={typingMessage} onChange={e => setTypingMessage(e.target.value)} />
          <button onClick={sendMessage}>Send</button>
        </div>
        <div>
          {messages.map((message, index) => (
            <div key={index}>
              <p>{message.user.name} :</p>
              <p>{message.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
