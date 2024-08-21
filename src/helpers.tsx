export const getAICol = (dropped) => {
  const cols = 7;
  const availableCols = [];
  for (let col = 0; col < cols; col++) {
    if (!dropped.some(d => d.y === col && d.x === 0)) {
      availableCols.push(col);
    }
  }
  return availableCols[Math.floor(Math.random() * availableCols.length)];
};

const cols = 7;
const rows = 6;

const getValidColumns = (board) => {
  const validCols = [];
  for (let col = 0; col < cols; col++) {
    if (!board.some(d => d.y === col && d.x === 0)) {
      validCols.push(col);
    }
  }
  return validCols;
};

const getAvailableRow = (board, col) => {
  for (let row = rows - 1; row >= 0; row--) {
    if (!board.find(d => d.x === row && d.y === col)) {
      return row;
    }
  }
  return -1; // Column is full
};

const checkWinningMove = (board, player) => {
  // Check horizontal, vertical, and diagonal for winning move
  // This function can be similar to the `findWinner` logic
  // Return true if a winning move is found for the player
  // This is a simplified version for demonstration purposes
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols - 3; col++) {
      if (board.filter(d => d.player === player && d.x === row && d.y >= col && d.y <= col + 3).length === 4) {
        return true;
      }
    }
  }
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows - 3; row++) {
      if (board.filter(d => d.player === player && d.y === col && d.x >= row && d.x <= row + 3).length === 4) {
        return true;
      }
    }
  }
  for (let row = 0; row < rows - 3; row++) {
    for (let col = 0; col < cols - 3; col++) {
      if (board.filter(d => d.player === player && d.x >= row && d.x <= row + 3 && d.y >= col && d.y <= col + 3 && d.x - d.y === row - col).length === 4) {
        return true;
      }
    }
    for (let col = 3; col < cols; col++) {
      if (board.filter(d => d.player === player && d.x >= row && d.x <= row + 3 && d.y <= col && d.y >= col - 3 && d.x + d.y === row + col).length === 4) {
        return true;
      }
    }
  }
  return false;
};

const minimax = (board, depth, isMaximizing, alpha, beta) => {
  const validColumns = getValidColumns(board);
  if (depth === 0 || validColumns.length === 0) {
    return { column: null, score: 0 };
  }

  if (checkWinningMove(board, 2)) {
    return { column: null, score: 100000 };
  } else if (checkWinningMove(board, 1)) {
    return { column: null, score: -100000 };
  }

  if (isMaximizing) {
    let value = -Infinity;
    let column = validColumns[Math.floor(Math.random() * validColumns.length)];
    for (const col of validColumns) {
      const row = getAvailableRow(board, col);
      const newBoard = [...board, { x: row, y: col, player: 2 }];
      const newScore = minimax(newBoard, depth - 1, false, alpha, beta).score;
      if (newScore > value) {
        value = newScore;
        column = col;
      }
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return { column, score: value };
  } else {
    let value = Infinity;
    let column = validColumns[Math.floor(Math.random() * validColumns.length)];
    for (const col of validColumns) {
      const row = getAvailableRow(board, col);
      const newBoard = [...board, { x: row, y: col, player: 1 }];
      const newScore = minimax(newBoard, depth - 1, true, alpha, beta).score;
      if (newScore < value) {
        value = newScore;
        column = col;
      }
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    return { column, score: value };
  }
};

export const getHardAICol = (board) => {
  return minimax(board, 5, true, -Infinity, Infinity).column;
};