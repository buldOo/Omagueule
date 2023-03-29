import React, { useState, useEffect } from 'react';
import { LoadingOutlined, SmileOutlined }  from '@ant-design/icons';
import '../assets/scss/videoplayer.scss'
import Loading from './loading';


function VideoPlayer() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // simulation d'un chargement de 3 secondes
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return <div className="videoPlayer">

      
      <div className="head">
        <h1>Chat Video</h1>
      </div>
      
      <div className="video-group">
        <video className="video" src="https://www.w3schools.com/html/mov_bbb.mp4" controls></video>
        <video  className="video" src="https://www.w3schools.com/html/mov_bbb.mp4" controls></video>

      </div>

      <div className="find-user">
        <button className="btn-change">Changer de Gueule</button>
      </div>


    </div>;
}

export default VideoPlayer;