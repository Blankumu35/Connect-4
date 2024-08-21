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