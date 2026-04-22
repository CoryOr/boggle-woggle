/**
 * GameFinished.jsx
 *
 * This file contains the GameFinished code displayed to the screen after the timer runs out in GamePage.jsx
 *
 * @author Luke Defrance, Alexander Ordonez
 */

import "./GameFinished.css";
import { useContext, useEffect } from "react";
import { CurrentGameContext } from "../../contexts/CurrentGameContext/CurrentGameContext";
import { AudioContext } from "../../contexts/AudioContext/AudioContextContext";

export default function GameFinished({ onGoHome }) {
  const { foundWords, score } = useContext(CurrentGameContext);
  const { playSfx } = useContext(AudioContext);
  const wordList = [...foundWords].sort();

  useEffect(() => {
    playSfx("/sounds/Winner.mp3");
  }, [playSfx]);

  return (
    <div className="game-finished-container">
      <h1 className="game-finished-title">Game Over</h1>

      <p className="gf-stat">Final score: {score} points!</p>
      <p className="gf-stat">{wordList.length} words found</p>

      <div className="gf-words-card">
        {wordList.length === 0 ? (
          <p className="gf-no-words">No words found this round.</p>
        ) : (
          <ul className="gf-word-list">
            {wordList.map((word) => (
              <li key={word} className="gf-word-item">
                {word}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        className="gf-home-button"
        onClick={() => {
          playSfx("/sounds/click.wav");
          onGoHome();
        }}
      >
        Go Home
      </button>
    </div>
  );
}