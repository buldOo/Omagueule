import React from 'react';
import SideBar from '../components/sidebar';
import { LoadingOutlined, SmileOutlined }  from '@ant-design/icons';
import '../assets/scss/home.scss';
import VideoPlayer from '../components/videoPlayer';
import Chat from '../components/chat';

const Home = () => {
    
    return (
      <div className="Home">
        <SideBar />
        <div className="content">
           <VideoPlayer />
           <Chat />
        </div>
      </div>
    );
  };
  
  export default Home;
  