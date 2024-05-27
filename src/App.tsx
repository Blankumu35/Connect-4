import React from 'react';
import Board from './components/Board';
import DropZone from './components/Dropzone'
import './App.css';

const App = () => {
  return (
    <div className="App">
    <DropZone />
      <Board />
    </div>
  );
};

export default App;