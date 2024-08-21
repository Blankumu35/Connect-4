import { useState } from 'react';
import DropZone from './components/Dropzone';
import MainMenu from './components/MainMenu';
import Lobby from './Lobby';
import Board from './components/Board'
import './App.css';

const App = () => {
  const [gameMode, setGameMode] = useState(null); // null, 'single', 'multi', 'online'
  const [playerName, setPlayerName] = useState('');
  const [gameData, setGameData] = useState(null);

  const goToMainMenu = () => {
    setGameMode(null);
  };

  const handleGameStart = (data) => {
    setGameData(data);
    setGameMode('online');
  };

  const handleJoinLobby = (name) => {
    setPlayerName(name);
    setGameMode('lobby');
  };

  return (
    <div className="app">
      {gameMode === null && <MainMenu onSelectMode={setGameMode} onJoinLobby={handleJoinLobby} />}
      {gameMode === 'lobby' && <Lobby playerName={playerName} onGameStart={handleGameStart} />}
      {gameMode === 'single' &&<> <DropZone goToMainMenu={goToMainMenu} isSinglePlayer /><Board /> </>}
      {gameMode === 'multi' && <><DropZone goToMainMenu={goToMainMenu} isSinglePlayer={false} /><Board /> </>}
      {gameMode === 'online' &&<> <DropZone goToMainMenu={goToMainMenu} isSinglePlayer={false} gameData={gameData} /><Board /> </>}
    </div>
  );
};

export default App;