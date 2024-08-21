const Winner = ({ winner, reset, goToMainMenu }) => {

  winner === -1 ? winner = -1 : winner === 1 ? winner ='Red': winner = 'Yellow'  
  return (
    <div className="winner-overlay" style={{width:'216%', height:'500%',borderRadius:0}}>
    <div className="winner-popup">
      <div className="popup-content ">
        {winner === -1 ? (
          <h2>It's a tie!</h2>
        ) : (
          <h2>{winner} Player wins!</h2>
        )}
        <button onClick={reset}>Play Again</button>
        <button onClick={goToMainMenu}>Main Menu</button>
      </div>
    </div>
    </div>
  );
};

export default Winner;