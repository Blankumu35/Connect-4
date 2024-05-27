import { useEffect, useState } from "react"

const Coin = ({turn,dropped,setDropped,setTurn}) => {

    const [column,setColumn] = useState(5);
    const [row, setRow] = useState();

    const handleKeyDown = (e: { keyCode: number; }) => {
        if(e.keyCode === 37 && column > 0){
            setColumn(column-1);
        }
        else if(e.keyCode === 39 && column < 6){
            setColumn(column+1);
        }
        else if(e.keyCode === 32 || e.keyCode == 13){
            if (dropped.find(drop => drop.x === 0 && drop.y === column || 0)){ // check if a column is full
                return
            }
            const length = 5 - dropped.filter(drop => drop.y === (column || 0)).length
            setRow(length);
            setTimeout(() => {
                setDropped([
                    ...dropped,
                    {x: length, y:column || 0, player: turn}
                ])
                setTurn(turn === 1 ? 2:1)
            }, 500)
        }
    }

        useEffect(() => {
            setColumn(0);
            setRow();
        },[turn])

        useEffect(() => {
            document.addEventListener('keyup',handleKeyDown,false)

            return () => document.removeEventListener('keyup',handleKeyDown)
        })

        return <div className={`active p${turn} column-${column|| '-'} row-${row===undefined ? '-': row}`} />

    }
    export default Coin;

