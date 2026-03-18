import LetterTile from "./LetterTile";
import "./GameBoard.css";

/**
 * Renders the game board by fetching a new board from the API. Displays each letter
 * in a designated LetterTile
 *
 * @returns a grid of LetterTile components that represent the game board
 */
const GameBoard = ({ board }) => {
  return (
    <>
      <div id="gameboard">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="gameboard-row">
              {row.map((letter, colIndex) => (
                <LetterTile letter={letter} key={colIndex} />
              ))}
            </div>
          ))}
        </div>
    </>
  );
};

export default GameBoard;
