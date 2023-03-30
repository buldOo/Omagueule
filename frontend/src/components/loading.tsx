import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import '../assets/scss/loading.scss'


const Loading = () => {
  return (
    <div className="loading">
      <LoadingOutlined className='loading-icon' />
    </div>
  )
};


export default Loading;