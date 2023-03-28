import io from 'socket.io-client';
const socket = io('http://localhost:3000');

const App = () => {

  const user1JoinRoom1 = () => {
    socket.emit('join-room', { roomId: 'room1', username: 'name1' });
  }

  const user2joinRoom1 = () => {
    socket.emit('join-room', { roomId: 'room1', username: 'name2' });
  }

  const getRooms = () => {
    socket.emit('get-rooms');
  }

  const getRoomUsers = () => {
    socket.emit('get-room-users', { roomId: 'room1' });
  }

  const sendMessage = () => {
    socket.emit('message', { roomId: 'room1',  message: 'Hello' });
  }

  const getRoomMessages = () => {
    socket.emit('get-room-messages', { roomId: 'room1' });
  }

  return (
    <div className="App">
      <p>Oh ma gueule</p>
      <button onClick={user1JoinRoom1}>join room</button>
      <button onClick={user2joinRoom1}>join room</button>
      <button onClick={getRooms}>get rooms</button>
      <button onClick={getRoomUsers}>get room users</button>
      <button onClick={sendMessage}>send message</button>
      <button onClick={getRoomMessages}>get room messages</button>
    </div>
  );
};

export default App;
