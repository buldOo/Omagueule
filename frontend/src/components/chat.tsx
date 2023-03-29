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


  return <div className="Chat">
        <div className="Message">
            <h1>Message</h1>

            <div className="List-message">
                <div className="message">
                    <p>Salut</p>
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