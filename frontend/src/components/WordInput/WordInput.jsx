import { useState } from "react";
import "./WordInput.css";

export default function WordInput() {
  const [currentGuess, setCurrentGuess] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const guess = currentGuess.toLowerCase(); // Note: no need to trim since onChange for input component doesn't allow anything other than letters

      fetch("/api/game/guess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guess }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch((err) => console.error("Error submitting guess:", err));

      setCurrentGuess("");
    }
  };

  return (
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
        }}
        onKeyDown={(e) => handleKeyPress(e)}
        spellCheck={false}
        className="word-input"
      />
    </div>
  );
}
