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
  const { board, score, timeLeft, foundWords, isLoading } =
    useContext(CurrentGameContext);

  const goHome = () => {
    nav("/");
  };

  return (
    <div className="game-page-container">
      <p className="game-page-text title">DRAG OR TYPE LETTERS TO PLAY!</p>
      <div className="timer-container">
        <FaHourglass size="3rem" />
        <p className="game-page-text">2:52</p>
      </div>
      <div className="score-container">
        <p className="game-page-text">Score: 0</p>
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
  );
}
