import io from 'socket.io-client';
const socket = io('http://localhost:3000');

const App = () => {
  const sendMessage = () => {
    socket.emit('message', { message: 'Hello' });
  }
  
  
  return (
    <div className="App">
      <p>Oh ma gueule</p>
      <button onClick={sendMessage}>send message</button>
    </div>
  );
};

export default App;
