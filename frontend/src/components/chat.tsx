import React, { useEffect, useState } from 'react';
import '../assets/scss/chat.scss'
import { IUser, IMessage } from '../models';
import { Socket } from 'socket.io-client';
import ChatMessage from './ChatMessage';

interface IChatProps {
  socket: Socket;
  currentUser?: IUser
}

function Chat({ socket, currentUser }: IChatProps) {
  const [typingMessage, setTypingMessage] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([])

  const listMessageRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // scroll to the bottom of the list
    listMessageRef.current?.scrollTo(0, listMessageRef.current.scrollHeight);
  }, [messages])

  socket.on('room-messages', (messages: IMessage[]) => setMessages(messages))
  socket.on('new-room-messages', (messages: IMessage[]) => setMessages(messages))
  socket.on('chat-message', (messages: IMessage[]) => setMessages(messages))

  const sendMessage = () => {
    if (!currentUser) return;
    const message: IMessage = {
      user: {
        id: currentUser.id,
        name: currentUser.name,
      },
      body: typingMessage,
    }
    socket.emit('message', message);

    // reset the input
    setTypingMessage('');
  }

  return <div className="ChatMessage">
    <div className="Message">
      <h1>Messages</h1>

      {messages.length === 0 && <div className="no-message">Aucun message</div>}

      <div className='List-message-container' ref={listMessageRef}>
        <div className="List-message">
          {messages.map((message, index) =>
            <ChatMessage key={index} message={message} curentUser={currentUser} />
          )}
        </div>
      </div>

      <div className="send-message">
        <input
          type="text"
          className="input-send"
          placeholder="Message"
          value={typingMessage}
          onChange={e => setTypingMessage(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && typingMessage !== '' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className={`btn btn-send ${typingMessage === '' ? 'disabled' : ''}`}
          disabled={typingMessage === ''}
        >
          Envoyer
        </button>
      </div>

    </div>
  </div>;
}

export default Chat;