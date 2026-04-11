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
import FoundWordsSidebar from "../components/FoundWordsSidebar/FoundWordsSidebar";

/**
 * A hub file for all of our game logic. Currently holds single player information,
 * but will be extended to multiplayer in the future. Coordinates the layout between
 * the game board, inputs, timers, and the sidebar.
 *
 * @component
 * @returns {JSX.Element} The rendered GamePage UI.
 */
export default function GamePage() {
  const nav = useNavigate();

  // Pull necessary global state for the main hub logic
  const {
    board,
    score,
    setScore,
    timeLeft,
    setTimeLeft,
    isLoading,
  } = useContext(CurrentGameContext);

  /**
   * Navigates the user back to the home screen.
   */
  const goHome = () => {
    nav("/");
  };

  /**
   * Callback to increase the user's score upon a valid guess.
   * @param {number} points - The points to add to the current score.
   */
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
                  <div className="game-layout-wrapper">

                    {/* Left Side: The Main Game Board & Input */}
                    <div className="game-center-column">
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
                    </div>

                    {/* Right Side: The Found Words Sidebar */}
                    <div className="game-right-column">
                      <FoundWordsSidebar />
                    </div>

                  </div>
              )}
            </>
        )}
      </div>
  );
}