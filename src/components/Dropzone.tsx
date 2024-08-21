import { useEffect, useState } from 'react';
import './DropZone.css';
import { size, rows, cols } from '../constants/constants';
import Coin from './Coin';
import Winner from './Winner';
import { io } from 'socket.io-client';
import { getHardAICol } from '../helpers'; // Import the AI move logic

const DropZone = ({ gameMode, goToMainMenu, isSinglePlayer, gameId, playerName }) => {
  const [turn, setTurn] = useState(1);
  const [winner, setWinner] = useState(0);
  const [dropped, setDropped] = useState([]);
  const [isAITurn, setIsAITurn] = useState(false);
  const [board, setBoard] = useState(Array(6).fill(null).map(() => Array(7).fill(null)));
  const [playerNumber, setPlayerNumber] = useState(null);



  const socket = io('http://localhost:4000'); // Adjust the URL based on your server address


  const findWinner = () => {
    const player1 = dropped.filter(d => d.player === 1);
    player1.forEach(({ x, y }) => {
      if (
        player1.find(m => x === m.x + 1 && y === m.y) &&
        player1.find(m => x === m.x + 2 && y === m.y) &&
        player1.find(m => x === m.x + 3 && y === m.y)
      ) setWinner(1);
      if (
        player1.find(m => x === m.x && y === m.y + 1) &&
        player1.find(m => x === m.x && y === m.y + 2) &&
        player1.find(m => x === m.x && y === m.y + 3)
      ) setWinner(1);
      if (
        player1.find(m => x === m.x + 1 && y === m.y + 1) &&
        player1.find(m => x === m.x + 2 && y === m.y + 2) &&
        player1.find(m => x === m.x + 3 && y === m.y + 3)
      ) setWinner(1);
      if (
        player1.find(m => x === m.x + 1 && y === m.y - 1) &&
        player1.find(m => x === m.x + 2 && y === m.y - 2) &&
        player1.find(m => x === m.x + 3 && y === m.y - 3)
      ) setWinner(1);
    });

    const player2 = dropped.filter(d => d.player === 2);
    player2.forEach(({ x, y }) => {
      if (
        player2.find(m => x === m.x + 1 && y === m.y) &&
        player2.find(m => x === m.x + 2 && y === m.y) &&
        player2.find(m => x === m.x + 3 && y === m.y)
      ) setWinner(2);
      if (
        player2.find(m => x === m.x && y === m.y + 1) &&
        player2.find(m => x === m.x && y === m.y + 2) &&
        player2.find(m => x === m.x && y === m.y + 3)
      ) setWinner(2);
      if (
        player2.find(m => x === m.x + 1 && y === m.y + 1) &&
        player2.find(m => x === m.x + 2 && y === m.y + 2) &&
        player2.find(m => x === m.x + 3 && y === m.y + 3)
      ) setWinner(2);
      if (
        player2.find(m => x === m.x + 1 && y === m.y - 1) &&
        player2.find(m => x === m.x + 2 && y === m.y - 2) &&
        player2.find(m => x === m.x + 3 && y === m.y - 3)
      ) setWinner(2);
    });
  };

  const reset = () => {
    setTurn(1);
    setDropped([]);
    setWinner(0);
    setIsAITurn(false);
  };

  const getAvailableRow = (board, col) => {
    for (let row = rows - 1; row >= 0; row--) {
      if (!board.find(d => d.x === row && d.y === col)) {
        return row;
      }
    }
    return -1; // Column is full
  };

  const handleAICell = (col) => {
    const row = getAvailableRow(dropped, col);
    if (row === -1) return;

    const newDrop = { x: row, y: col, player: 2 };
    setDropped(prevDropped => [...prevDropped, newDrop]);
    if (findWinner()) {
      setWinner(2);
    } else {
      setTurn(1);
      setIsAITurn(false);
    }
  };

  useEffect(() => {
    if (dropped.length === rows * cols) setWinner(-1);
    findWinner();
  }, [dropped]);

  useEffect(() => {
    if (isSinglePlayer && turn === 2 && !isAITurn && !winner) {
      setIsAITurn(true);
      const aiCol = getHardAICol(dropped);
      setTimeout(() => handleAICell(aiCol), 1000);
    }
  }, [turn, isSinglePlayer, isAITurn, winner, dropped]);


  useEffect(() => {
  if (gameMode === 'multiPlayer') {
    socket.emit('joinGame', { gameId, playerName });

    socket.on('gameJoined', ({ board, currentPlayer }) => {
      setBoard(board);
      setTurn(currentPlayer);
      setPlayerNumber(currentPlayer === 'Red' ? 1 : 2);
    });

    socket.on('playerJoined', (playersCount) => {
      console.log('Players in game:', playersCount);
    });

    socket.on('moveMade', ({ row, col, player }) => {
      const newBoard = [...board];
      newBoard[row][col] = player;
      setBoard(newBoard);
    });

    socket.on('nextTurn', (currentPlayer) => {
      setTurn(currentPlayer);
    });

    socket.on('gameOver', ({ winner }) => {
      setWinner(winner);
      // Display a popup or message indicating who won the game
      alert(`${winner} wins the game!`);
      // Optionally, offer to restart the game or return to the main menu
    });

    socket.on('playerLeft', (remainingPlayers) => {
      // Handle the case where a player leaves the game
      alert('The other player has left the game.');
      // You can redirect to the main menu or offer to start a new game
      goToMainMenu();
    });

    return () => {
      // Clean up event listeners on unmount or when the effect is re-run
      socket.off('gameJoined');
      socket.off('playerJoined');
      socket.off('moveMade');
      socket.off('nextTurn');
      socket.off('gameOver');
      socket.off('playerLeft');
    };
  }
}, [gameMode, gameId, playerName, board, goToMainMenu]);

  return (
    <div className="drop-zone">
      {dropped.map((m, i) => (
        <div
          key={i}
          className={`p${m.player}`}
          style={{ transform: `translate(${m.y * size}px,${m.x * size + 150}px)` }}
        />
      ))}

      {winner > 0 || winner === -1 ? (
        <Winner winner={winner} reset={reset} goToMainMenu={goToMainMenu} />
      ) : (
        !isAITurn && (
          <Coin turn={turn} dropped={dropped} setDropped={setDropped} setTurn={setTurn} />
        )
      )}
    </div>
  );
};

export default DropZone;