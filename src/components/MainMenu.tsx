import { useState } from 'react';

const MainMenu = ({ onSelectMode, onJoinLobby }) => {
  const [playerName, setPlayerName] = useState('');

  const handleModeSelect = (mode) => {

    if (mode === 'online') {
      if (playerName.trim() === '') {
      alert('Please enter your name.');
      return;
    }
      onJoinLobby(playerName);
    } else {
      onSelectMode(mode);
    }
  };

  return (
    <div className="menu-container">
      <h1>Connect 4</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button className='menu-button' onClick={() => handleModeSelect('single')}>Single Player</button>
      <button className='menu-button' onClick={() => handleModeSelect('multi')}>Local Multiplayer</button>
      <button className='menu-button' onClick={() => handleModeSelect('online')}>Online Multiplayer</button>
    </div>
  );
};

export default MainMenu;