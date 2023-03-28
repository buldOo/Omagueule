import React from 'react';
import { WechatOutlined, SettingOutlined, TeamOutlined, LogoutOutlined }  from '@ant-design/icons';
import '../assets/scss/sidebar.scss'



const Sidebar = () => {
    return (
        <div className="sidebar">

            <div className="action">
                <div className="item-side-bar Chat">
                    <WechatOutlined className="icon-ant" />
                </div>

                <div className="item-side-bar Users">
                    <TeamOutlined className="icon-ant"/>
                </div>

                <div className="item-side-bar Omagueule">
                    <SettingOutlined className="icon-ant" />
                </div>
            </div>

            <div className="logout">
                <LogoutOutlined className="icon-ant"/>
            </div>

            
            
        </div>
    )
};


export default Sidebar;