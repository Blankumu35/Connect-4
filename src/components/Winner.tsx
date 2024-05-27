const Winner = ({winner,reset}) => {
    return <p>Player {winner} has won

            <button onClick={reset}>Play Again</button>
            </p>
}

export default Winner;