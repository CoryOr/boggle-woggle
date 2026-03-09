import { useEffect, useState } from "react";
import LetterTile from "./LetterTile";
import "./GameBoard.css";

const GameBoard = () => {
  const [board, setBoard] = useState(undefined);

  useEffect(() => {
    fetch("/api/board/new")
    .then(res => res.json())
    .then(data => {
        setBoard(data.board);
    })
    .catch(err => console.error(err));;
  }, []);

  return (
    <>
        {board && (
        <div id="gameboard">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="gameboard-row">
              {row.map((letter, colIndex) => (
                <LetterTile letter={letter} key={colIndex} />
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default GameBoard;