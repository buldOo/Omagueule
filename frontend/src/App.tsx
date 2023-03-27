import io from 'socket.io-client';
import '../src/assets/scss/index.scss';

const socket = io('http://localhost:3000');

const App = () => {
  const sendMessage = () => {
    socket.emit('message', { message: 'Hello' });
  }
  
  
  return (
    <div className="landing">
      <div className="background"></div>
      <div className="form-container">
        <div className="form">
          <form action="#">
            <div>
              <h2>Votre petit nom</h2>
              <input type="text" name="name"/>
            </div>
            <button type="submit">Let's chat !</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
