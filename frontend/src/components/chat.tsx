import React, { useState, useEffect } from 'react';
import { LoadingOutlined, SmileOutlined }  from '@ant-design/icons';
import '../assets/scss/videoplayer.scss'
import Loading from './loading';


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
           
        </div>
    
      
    </div>;
}

export default Chat;