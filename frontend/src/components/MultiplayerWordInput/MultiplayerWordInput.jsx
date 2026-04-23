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
import { AudioContext } from "../../contexts/AudioContext/AudioContextContext.jsx";
import socketService from "../../websocket/WebSocketService";
import "../WordInput/WordInput.css";

export default function MultiplayerWordInput({
    roomCode,
    username,
    updateScore,
    updatePlayerScores,
}) {
    const {
        gameId,
        foundWords,
        setFoundWords,
        currentGuess,
        setCurrentGuess,
        invalidWord,
        setInvalidWord,
    } = useContext(CurrentGameContext);

    const { playSfx } = useContext(AudioContext);

    const handleKeyPress = (e) => {
        if (e.key !== "Enter") return;

        const guess = currentGuess.toLowerCase();

        if (!guess.trim()) return;

        if (foundWords.has(guess)) {
            playSfx("/sounds/invalid.wav");
            setInvalidWord(currentGuess);
            setCurrentGuess("");
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
                    if (updatePlayerScores) updatePlayerScores(data.score);
                    if (roomCode && username) {
                        socketService.broadcastPlayerScore(roomCode, username, data.score);
                    }
                    setFoundWords((prev) => new Set(prev).add(guess));
                    setInvalidWord(null);
                } else {
                    playSfx("/sounds/invalid.wav");
                    setInvalidWord(currentGuess);
                }
            })
            .catch((err) => console.error("Error submitting guess:", err));

        setCurrentGuess("");
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