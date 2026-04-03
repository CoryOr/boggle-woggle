import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import GameBoard from "../components/GameBoard/GameBoard";
import "../components/GameBoard/GameBoard.css";
import { CurrentGameContext } from "../contexts/CurrentGameContext/CurrentGameContext";
import Timer from "../components/Timer/Timer";
import GameFinished from "../components/GameFinished/GameFinished";
import WordInput from "../components/WordInput/WordInput";
import CurrentScore from "../components/CurrentScore/CurrentScore";
import LoadingIcon from "../components/LoadingIcon/LoadingIcon";

/**
 * A hub file for all of our game logic. Currently holds only single player information, but will
 * be extended to multiplayer in the future.
 *
 * @returns the GamePage jsx
 */
export default function GamePage() {
  const nav = useNavigate();
  const {
    board,
    score,
    setScore,
    timeLeft,
    setTimeLeft,
    foundWords,
    isLoading,
  } = useContext(CurrentGameContext);

  console.log("Current words found:" + foundWords); // NOTE: THIS IS JUST HERE TO PASS LINTING

  const goHome = () => {
    nav("/");
  };

  const updateScore = (points) => {
    setScore(score + points);
  };

  return (
    <div className="game-page-container">
      {timeLeft === 0 ? (
        <GameFinished onGoHome={goHome} />
      ) : (
        <>
          {isLoading ? (
            <LoadingIcon />
          ) : (
            <>
              <p className="game-page-text title">
                DRAG OR TYPE LETTERS TO PLAY!
              </p>
              <Timer timeLeft={timeLeft} />
              <CurrentScore score={score} />
              <WordInput updateScore={updateScore} />
              <GameBoard board={board} updateScore={updateScore} />
              <button
                className="btn quit-btn"
                onClick={() => setTimeLeft(0)}
              >
                QUIT
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
