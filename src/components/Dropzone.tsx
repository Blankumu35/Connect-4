import { useEffect, useState} from 'react'
import './DropZone.css'
import { size, rows, cols } from '../constants/constants'
import Coin from './Coin'
import Winner from './Winner'

const DropZone = () => {
    const [turn, setTurn] = useState(1);
    const [winner, setWinner] = useState(0);
    const [dropped, setDropped] = useState([]); 

    const findWinner = () => {
        const player1 =dropped.filter(d => d.player === 1)
            player1.forEach(({x,y}) => {
                if (player1.find(m => x === m.x + 1 && y ===m.y) &&
                    player1.find(m => x === m.x + 2 && y ===m.y) &&
                    player1.find(m => x === m.x + 3 && y ===m.y)
                    )
                    setWinner(1)
                    if (player1.find(m => x === m.x && y ===m.y + 1) &&
                    player1.find(m => x === m.x && y ===m.y + 2) &&
                    player1.find(m => x === m.x && y ===m.y + 3)
                    )
                    setWinner(1)
                    if (player1.find(m => x === m.x + 1 && y ===m.y + 1) &&
                    player1.find(m => x === m.x + 2 && y ===m.y + 2) &&
                    player1.find(m => x === m.x + 3 && y ===m.y + 3)
                    )
                    setWinner(1)
                    if (player1.find(m => x === m.x + 1 && y ===m.y - 1) &&
                    player1.find(m => x === m.x + 2 && y ===m.y - 2) &&
                    player1.find(m => x === m.x + 3 && y ===m.y - 3)
                    )
                    setWinner(1)
            }



                    const player2 =dropped.filter(d => d.player === 1)
                    player2.forEach(({x,y}) => {
                if (player2.find(m => x === m.x + 1 && y ===m.y) &&
                    player2.find(m => x === m.x + 2 && y ===m.y) &&
                    player2.find(m => x === m.x + 3 && y ===m.y)
                    )
                    setWinner(2)
                    if (player2.find(m => x === m.x && y ===m.y + 1) &&
                    player2.find(m => x === m.x && y ===m.y + 2) &&
                    player2.find(m => x === m.x && y ===m.y + 3)
                    )
                    setWinner(2)
                    if (player2.find(m => x === m.x + 1 && y ===m.y + 1) &&
                    player2.find(m => x === m.x + 2 && y ===m.y + 2) &&
                    player2.find(m => x === m.x + 3 && y ===m.y + 3)
                    )
                    setWinner(2)
                    if (player2.find(m => x === m.x + 1 && y ===m.y - 1) &&
                    player2.find(m => x === m.x + 2 && y ===m.y - 2) &&
                    player2.find(m => x === m.x + 3 && y ===m.y - 3)
                    )
                    setWinner(2)
            })
    }


    const reset = () => {
      setTurn(1);
      setDropped([]);
      setWinner(0);
    }

    useEffect(() => {
        if(dropped.length === rows*cols)
            setWinner(-1);
            findWinner();
    },[dropped.length])

    useEffect(() => console.log(winner),[winner]);

    return <div className='drop-zone'>
        {dropped.map((m,i) =>
            <div key={i}
                className={`p${m.player}`}
                style={{transform: `translate(${m.y*size}px,${m.x*size+150}px)`}}
                />
        )}

        {
            winner > 0
            ? <Winner winner={winner} reset={reset}/>
            : <Coin
                    turn = {turn}
                    dropped = {dropped}
                    setDropped = {setDropped}
                    setTurn = {setTurn}
                    />
        }
    
    </div>


}

export default DropZone;