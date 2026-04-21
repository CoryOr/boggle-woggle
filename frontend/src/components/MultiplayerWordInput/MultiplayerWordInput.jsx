/**
 * MultiplayerWordInput.jsx
 *
 * A multiplayer-specific version of WordInput. Publishes the guess through
 * the WebSocket so the server can validate it, update scores, and broadcast
 * the new state to all players.
 *
 * Keeps the same UI and UX as WordInput (same CSS, same keyboard behaviour)
 * so the game feels identical to single player.
 *
 * Author(s): Boggle Woggle (t_3c)
 */

import { useContext } from "react";
import { CurrentGameContext } from "../../contexts/CurrentGameContext/CurrentGameContext.jsx";
import socketService from "../../websocket/WebSocketService";
import "../WordInput/WordInput.css";

/**
 * @param {string} roomCode - The active room code, needed for the WebSocket publish.
 */
export default function MultiplayerWordInput({ roomCode }) {
    const {
        foundWords,
        setFoundWords,
        currentGuess,
        setCurrentGuess,
        invalidWord,
        setInvalidWord,
    } = useContext(CurrentGameContext);

    const handleKeyPress = (e) => {
        if (e.key !== "Enter") return;

        const guess = currentGuess.toLowerCase();

        if (foundWords.has(guess)) {
            setInvalidWord(currentGuess);
            setCurrentGuess("");
            return;
        }

        socketService.submitGuess(roomCode, guess);

        setCurrentGuess("");
        setInvalidWord(null);

        // Optimistically add the word to foundWords so the sidebar updates
        // immediately without waiting for the server broadcast
        setFoundWords((prev) => new Set(prev).add(guess));
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
                        if (lettersOnly.length > 0) setInvalidWord(null);
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