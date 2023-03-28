import React from 'react';
import SideBar from '../components/sidebar';
import { LoadingOutlined, SmileOutlined }  from '@ant-design/icons';
import '../assets/scss/home.scss';

const Home = () => {
    
    return (
      <div className="Home">
        <SideBar />
        <div className="content">
          <LoadingOutlined className='loading'/>
        </div>
      </div>
    );
  };
  
  export default Home;
  