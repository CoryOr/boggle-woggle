/**
 * GamePage.jsx
 *
 * The main game interface for playing Boggle.
 *
 * Features:
 * - Allows users to select between Single Player and Multiplayer modes
 * - Renders the GameBoard component for active gameplay
 * - Includes timer, score tracking, and word input UI
 *
 * Author(s): Pranab Adhikari / Boggle Woggle (t_3c)
 */

import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { FaHourglass } from "react-icons/fa";
import { useState, useRef, useContext } from "react";
import GameBoard from "../components/GameBoard/GameBoard";
import "../components/GameBoard/GameBoard.css";
import { CurrentGameContext } from "../contexts/CurrentGameContext";

/**
 * The game page that users will play on. It includes a couple of general labels for now.
 * Allows users to select a game mode before starting. The main game logic is
 * currently handled in the GameBoard component.
 * * @returns the page that a user will play a game on.
 * * TODOS:
 * - Update timer to actually be functional
 * - Add word validation
 */
export default function GamePage() {
  const nav = useNavigate();
  const [currentGuess, setCurrentGuess] = useState("");
  const wordInputRef = useRef(null);
  const [mode, setMode] = useState(null);
  const { board, score, timeLeft, foundWords, isLoading, setIsLoading } =
    useContext(CurrentGameContext);

  const goHome = () => {
    nav("/");
  };

  console.log("Current words found:" + foundWords);

  return (
    <>
      {isLoading ? (
        <div>
          <h1 className="title">
            Select Game Mode
          </h1>

          <div className="mode-buttons">
            <button className="navButton" onClick={() => setMode("single")}>
              Single Player
            </button>
            <button className="navButton" onClick={() => setMode("multi")}>
              Multiplayer
            </button>
          </div>

          {mode === "single" && (
            <div>
              <p className="game-page-text">Mode: Single Player Selected</p>
              <button className="navButton" onClick={() => setIsLoading(false)}>
                START GAME
              </button>
            </div>
          )}

          {mode === "multi" && (
            <p className="game-page-text">Multiplayer Mode is coming soon!</p>
          )}

          <button className="navButton" onClick={goHome}>
            Go Back
          </button>
        </div>
      ) : (
        <div className="game-page-container">
          <p className="game-page-text title">DRAG OR TYPE LETTERS TO PLAY!</p>
          <div className="timer-container">
            <FaHourglass size="3rem" />
            <p className="game-page-text">{timeLeft}</p>
          </div>
          <div className="score-container">
            <p className="game-page-text">Score: {score}</p>
          </div>
          <div className="word-input-container">
            <label htmlFor="word-input" className="game-page-text">
              WORD:
            </label>
            <input
              ref={wordInputRef}
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value)}
              spellCheck={false}
              className="word-input"
            />
          </div>
          <GameBoard board={board} />
          <button className="navButton" onClick={goHome}>
            Go back
          </button>
        </div>
      )}
    </>
  );
}
