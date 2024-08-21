const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://blankumu35:Xwrm8634@cluster0.df3styg.mongodb.net/Connect4');

const playerSchema = new mongoose.Schema({
  name: String,
  socketId: String
});

const gameSchema = new mongoose.Schema({
  gameId: String,
  players: [playerSchema],
  board: [[{ type: String, default: null }]],
  currentPlayer: String,
  winner: String
});

const Game = mongoose.model('Game', gameSchema);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('createGame', async (playerName) => {
    const gameId = Math.random().toString(36).substring(2, 9);
    const game = new Game({
      gameId,
      players: [{ name: playerName, socketId: socket.id }],
      board: Array(6).fill(null).map(() => Array(7).fill(null)),
      currentPlayer: 'Red'
    });
    await game.save();

    socket.join(gameId);
    socket.emit('gameCreated', { gameId, board: game.board, currentPlayer: game.currentPlayer });
  });

  socket.on('joinGame', async ({ gameId, playerName }) => {
    const game = await Game.findOne({ gameId });

    if (!game) {
      socket.emit('gameNotFound');
      return;
    }

    if (game.players.length < 2) {
      game.players.push({ name: playerName, socketId: socket.id });
      await game.save();

      socket.join(gameId);
      socket.emit('gameJoined', { gameId, board: game.board, currentPlayer: game.currentPlayer });
      io.to(gameId).emit('playerJoined', game.players.length);
    } else {
      socket.emit('gameFull');
    }
  });

  socket.on('makeMove', async ({ gameId, col }) => {
    const game = await Game.findOne({ gameId });
    if (!game) return;

    const row = game.board.findIndex(row => row[col] === null);
    if (row === -1) return;

    game.board[row][col] = game.currentPlayer;
    const winner = checkWin(game.board, row, col, game.currentPlayer);

    await game.save();

    io.to(gameId).emit('moveMade', { row, col, player: game.currentPlayer });

    if (winner) {
      game.winner = game.currentPlayer;
      await game.save();
      io.to(gameId).emit('gameOver', { winner: game.currentPlayer });
    } else {
      game.currentPlayer = game.currentPlayer === 'Red' ? 'Yellow' : 'Red';
      await game.save();
      io.to(gameId).emit('nextTurn', game.currentPlayer);
    }
  });

  socket.on('disconnect', async () => {
    console.log('Client disconnected');
    const games = await Game.find({ 'players.socketId': socket.id });
    for (const game of games) {
      game.players = game.players.filter(player => player.socketId !== socket.id);
      await game.save();
      if (game.players.length === 0) {
        await game.remove();
      } else {
        io.to(game.gameId).emit('playerLeft', game.players.length);
      }
    }
  });
});

const checkWin = (board, row, col, player) => {
  // Implement win checking logic (horizontal, vertical, diagonal)
  return false; // Placeholder
};

const port = 4000;
server.listen(port, () => console.log(`Listening on port ${port}`));