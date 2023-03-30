import React, { useState, useEffect } from 'react';
import Loading from './loading';
import { LoadingOutlined, SmileOutlined }  from '@ant-design/icons';
import { message } from 'antd';
import '../assets/scss/chat.scss'
import { IUser, IMessage } from '../models';
import { Socket } from 'socket.io-client';

interface IChatProps {
  socket: Socket;
  currentUser?: IUser
}


function Chat({socket, currentUser}: IChatProps) {
    const [typingMessage, setTypingMessage] = useState('');
    const [messages, setMessages] = useState<IMessage[]>([])


    socket.on('room-messages', (messages: IMessage[]) => setMessages(messages))
    socket.on('chat-message', (messages: IMessage[]) => setMessages(messages))
  

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


  return <div className="ChatMessage">
        <div className="Message">
            <h1>Message</h1>

            <div className="List-message">
                {messages.map((message, index) => (
                  <div className="message" key={index}>
                    <p>{message.user.name} :</p>
                    <p>{message.body}</p>
                  </div>
                ))}
                <div className="send-message">
                    <input className="input-send" type="text" value={typingMessage} onChange={e =>setTypingMessage(e.target.value)} placeholder="Message" />
                    <button onClick={sendMessage} className="btn btn-send">Send</button>
                </div>           
            </div>
    
      
        </div>
    </div>;
}


export default Chat;