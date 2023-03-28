import io from 'socket.io-client';
import '../src/assets/scss/index.scss';
import Home from './pages/home';

const socket = io('http://localhost:3000');

const App = () => {
  const sendMessage = () => {
    socket.emit('message', { message: 'Hello' });
  }
  
  
  return (
    <div className="landing">
      <div className="curtain">
        <img src="../src/assets/images/Ohmesgueul.png" alt=""/>
      </div>
      <div className="background"></div>
      <div className="form-container">
        <div className="form">
          <form action="#">
            <h2>Votre petit nom</h2>
            <div className="login_button">
              <input type="text" name="name" placeholder='Jean luc'/>
              <button type="submit">
                <img src="../src/assets/images/Send.png" alt=""/>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
