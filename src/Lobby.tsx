import { useState } from 'react';
import { io } from 'socket.io-client';
import './App.css'

const socket = io('http://localhost:4000'); // Adjust the URL as needed

const Lobby = ({ playerName, onGameStart }) => {
  const [gameId, setGameId] = useState('');
  const [isGameCreated, setIsGameCreated] = useState(false);

  const handleCreateGame = () => {
    const newGameId = Math.random().toString(36).substr(2, 9);
    socket.emit('createGame', { gameId: newGameId, playerName });
    setGameId(newGameId);
    setIsGameCreated(true);

    socket.on('gameCreated', (gameData) => {
      onGameStart(gameData);
    });
  };

  const handleJoinGame = () => {
    socket.emit('joinGame', { gameId, playerName });

    socket.on('gameJoined', (gameData) => {
      onGameStart(gameData);
    });

    socket.on('error', (message) => {
      alert(message);
    });
  };

  return (
    <div className="menu-container">
      {isGameCreated ? (
        <div>
          <h2>Game ID: {gameId}</h2>
          <p>Waiting for another player to join...</p>
        </div>
      ) : (
        <div className=''>
          <input
            type="text"
            placeholder="Enter Game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            style={{paddingTop:10, paddingBottom:10, paddingLeft:5, borderRadius:5}}
          />
          <div>
          <button className='menu-button' style={{marginRight:15}} onClick={handleCreateGame}>Create Game</button>
          <button className='menu-button' onClick={handleJoinGame}>Join Game</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lobby;