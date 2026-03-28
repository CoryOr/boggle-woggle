import { useState, useContext } from "react";
import { CurrentGameContext } from "../../contexts/CurrentGameContext/CurrentGameContext";
import "./WordInput.css";

export default function WordInput({ updateScore }) {
  const [currentGuess, setCurrentGuess] = useState("");
  const [invalidWord, setInvalidWord] = useState(null);
  const { gameId, setFoundWords, foundWords } = useContext(CurrentGameContext);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const guess = currentGuess.toLowerCase(); // Note: no need to trim since onChange for input component doesn't allow anything other than letters

      if (foundWords.has(guess)) {
        setInvalidWord(currentGuess);
        setCurrentGuess("");
        return;
      }

      fetch("/api/game/guess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId, guess }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            updateScore(data.score);
            setFoundWords((prev) => new Set(prev).add(guess));
          } else {
            setInvalidWord(currentGuess);
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
          onKeyDown={(e) => handleKeyPress(e)}
          spellCheck={false}
          autoComplete="off"
          className="word-input"
        />
      </div>
      {invalidWord && <p>{invalidWord.toUpperCase()} not found or already guessed</p>}
    </>
  );
}
