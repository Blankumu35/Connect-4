const Winner = ({winner,reset}) => {
    return <p>player {winner} has won

            <button onClick={reset}>Play Again</button>
            </p>
}

export default Winner;