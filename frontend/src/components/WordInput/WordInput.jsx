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
import { CurrentGameContext } from "../../contexts/CurrentGameContext/CurrentGameContext";
import "./WordInput.css";

/**
 * Renders the word input field and handles API submission for typed guesses.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.updateScore - Callback function to update the game score when a valid word is submitted.
 * @returns {JSX.Element} The text input UI and the reserved space for error messages.
 */
export default function WordInput({ updateScore }) {
    // Pull in the global game state so typing and dragging share the same data
    const {
        gameId,
        setFoundWords,
        foundWords,
        currentGuess,
        setCurrentGuess,
        invalidWord,
        setInvalidWord
    } = useContext(CurrentGameContext);

    /**
     * Handles keyboard events inside the input field.
     * Listens specifically for the "Enter" key to submit the current guess to the backend API.
     *
     * @param {Event} e - The keyboard event triggered by the user.
     */
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            const guess = currentGuess.toLowerCase();

            // Check if the word was already found before asking the server
            if (foundWords.has(guess)) {
                setInvalidWord(currentGuess);
                setCurrentGuess("");
                return;
            }

            // Send the guess to the Spring Boot backend to verify against the dictionary
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
                        setInvalidWord(null); // Clear any existing error messages on a successful guess
                    } else {
                        setInvalidWord(currentGuess); // Display the invalid word to the user
                    }
                })
                .catch((err) => console.error("Error submitting guess:", err));

            // Instantly clear the input box so the UI feels responsive while the fetch happens
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
                        // Use regex to strip out numbers and special characters, leaving only letters
                        const lettersOnly = e.target.value.replace(/[^a-zA-Z]/g, "");
                        setCurrentGuess(lettersOnly.toUpperCase());

                        // Hide the "invalid word" message the moment the user starts typing a new word
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

            {/* This container has a fixed height in WordInput.css.
        It prevents the GameBoard from jumping down when an error message appears. 
      */}
            <div className="invalid-word-container">
                {invalidWord && <p className="invalid-word-text">{invalidWord} not found or already guessed</p>}
            </div>
        </>
    );
}