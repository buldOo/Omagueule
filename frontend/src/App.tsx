import io from 'socket.io-client';
import '../src/assets/scss/index.scss';
import Home from './pages/home';

const socket = io('http://localhost:3000');

const App = () => {
  const sendMessage = () => {
    socket.emit('message', { message: 'Hello' });
  }
  
  
  return (
    <div className="App">
      <Home />
    </div>
  );
};

export default App;
