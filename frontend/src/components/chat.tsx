import React, { useState, useEffect } from 'react';
import Loading from './loading';
import { LoadingOutlined, SmileOutlined }  from '@ant-design/icons';
import { message } from 'antd';
import '../assets/scss/chat.scss'



function Chat() {
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // simulation d'un chargement de 3 secondes
  }, []);

  if (isLoading) {
    return <Loading />;
  }


  return <div className="ChatMessage">
        <div className="Message">
            <h1>Message</h1>

            <div className="List-message">
                <div className="message">
                    <p className="user1">Salut user 1</p>
                    <p className="user2">Salut user 2 pd !</p>
                </div>
                <div className="send-message">
                    <input className="input-send" type="text" placeholder="Message" />
                    <button className="btn btn-send">Send</button>
                </div>
            
            </div>
    
      
        </div>
    </div>;
}

export default Chat;