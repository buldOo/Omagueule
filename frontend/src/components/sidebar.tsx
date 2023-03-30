import { WechatOutlined, SettingOutlined, TeamOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../assets/scss/sidebar.scss'

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">

      <div className="action">
        <div className="item-side-bar Chat">
          <WechatOutlined className="icon-ant" />
        </div>

        <div className="item-side-bar Users">
          <TeamOutlined className="icon-ant" />
        </div>

        <div className="item-side-bar Omagueule">
          <SettingOutlined className="icon-ant" />
        </div>
      </div>

      <div className="logout" onClick={() => navigate('/onboarding')}>
        <LogoutOutlined className="icon-ant" />
      </div>
    </div>
  )
};


export default Sidebar;