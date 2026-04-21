/**
 * WordInput.jsx
 *
 * This component provides the text input field where players can type their word guesses.
 * It connects to the global CurrentGameContext to share state with the GameBoard,
 * ensuring that dragging tiles and typing text stay perfectly in sync.
 *
 * Author(s): Pranab Adhikari / Boggle Woggle (t_3c)
 */

import { useContext } from "react";
import { CurrentGameContext } from "../../contexts/CurrentGameContext/CurrentGameContext.jsx";
import { AudioContext } from "../../contexts/AudioContext/AudioContextContext";
import "./WordInput.css";

export default function WordInput({ updateScore }) {
  const {
    gameId,
    setFoundWords,
    foundWords,
    currentGuess,
    setCurrentGuess,
    invalidWord,
    setInvalidWord,
  } = useContext(CurrentGameContext);

  const { playSfx } = useContext(AudioContext);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const guess = currentGuess.toLowerCase();

      if (!guess.trim()) {
        return;
      }

      if (foundWords.has(guess)) {
        setInvalidWord(currentGuess);
        setCurrentGuess("");
        playSfx("/sounds/invalid.wav");
        return;
      }

      fetch("/api/game/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, guess }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            updateScore(data.score);
            setFoundWords((prev) => new Set(prev).add(guess));
            setInvalidWord(null);
            playSfx("/sounds/valid.wav");
          } else {
            setInvalidWord(currentGuess);
            playSfx("/sounds/invalid.wav");
          }
        })
        .catch((err) => console.error("Error submitting guess:", err));

      setCurrentGuess("");
    }
  };

  return (
    <>
      <div className="word-input-container">
        <label htmlFor="word-input" className="word-input-label">
          WORD:
        </label>
        <input
          id="word-input"
          value={currentGuess}
          onChange={(e) => {
            const lettersOnly = e.target.value.replace(/[^a-zA-Z]/g, "");
            setCurrentGuess(lettersOnly.toUpperCase());

            if (lettersOnly.length > 0) {
              setInvalidWord(null);
            }
          }}
          onKeyDown={handleKeyPress}
          spellCheck={false}
          autoComplete="off"
          className="word-input"
        />
      </div>

      <div className="invalid-word-container">
        {invalidWord && (
          <p className="invalid-word-text">
            {invalidWord} not found or already guessed
          </p>
        )}
      </div>
    </>
  );
}