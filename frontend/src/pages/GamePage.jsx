import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import GameBoard from "../components/GameBoard/GameBoard";
import "../components/GameBoard/GameBoard.css";
import { CurrentGameContext } from "../contexts/CurrentGameContext/CurrentGameContext";
import Timer from "../components/Timer/Timer";
import GameFinished from "../components/GameFinished/GameFinished";
import WordInput from "../components/WordInput/WordInput";
import CurrentScore from "../components/CurrentScore/CurrentScore";

/**
 * A hub file for all of our game logic. Currently holds only single player information, but will
 * be extended to multiplayer in the future. 
 * 
 * TODO: Don't allow words to be submitted multiple times for a single game.
 * @returns the GamePage jsx
 */
export default function GamePage() {
    const nav = useNavigate();
    const [mode, setMode] = useState(null);
    const { board, score, setScore, timeLeft, setTimeLeft, foundWords, isLoading, setIsLoading } =
        useContext(CurrentGameContext);

    console.log("Current words found:" + foundWords); // NOTE: THIS IS JUST HERE TO PASS LINTING

    const goHome = () => {
        nav("/");
    };

    const updateScore = (points) => {
        setScore(score + points);
    }

    return (
        <div className="game-page-container">
            {(timeLeft === 0) ? (
                // GAME OVER SCREEN
                <GameFinished onGoHome={goHome} />
            ) : isLoading ? (
                // MODE SELECTION SCREEN
                <div className="mode-selection-container">
                    <h1 className="title mode-selection-title">Select Game Mode</h1>

                    <div className="mode-buttons">
                        <button className="navButton" onClick={() => setMode("single")}>
                            Single Player
                        </button>
                        <button className="navButton" onClick={() => setMode("multi")}>
                            Multiplayer
                        </button>
                    </div>

                    {mode === "single" && (
                        <div className="mode-confirm-container">
                            <p className="game-page-text">Mode: Single Player Selected</p>
                            <button
                                className="navButton start-button"
                                onClick={() => setIsLoading(false)}
                            >
                                START GAME
                            </button>
                        </div>
                    )}

                    {mode === "multi" && (
                        <p className="game-page-text">Multiplayer Mode is coming soon!</p>
                    )}

                    <button className="navButton go-back-button" onClick={goHome}>
                        Go Back
                    </button>
                </div>
            ) : (
                // ACTIVE GAME BOARD SCREEN
                <>
                    <p className="game-page-text title">DRAG OR TYPE LETTERS TO PLAY!</p>
                    <Timer timeLeft={timeLeft} />
                    <CurrentScore score={score} />
                    <WordInput updateScore={updateScore}/>

                    <GameBoard board={board} />

                    <button
                        className="navButton quit-button"
                        onClick={() => setTimeLeft(0)}
                    >
                        Quit Game
                    </button>
                </>
            )}
        </div>
    );
}