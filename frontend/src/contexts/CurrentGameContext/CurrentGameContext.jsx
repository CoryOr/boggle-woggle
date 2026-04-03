/**
 * Context class containing the following general info about games:
 * 1) gameId(string)
 * 2) board(2d array of strings)
 * 3) score(number)
 * 4) timeLeft(number representing seconds)
 * 5) foundWords(hashset)
 * 6) isLoading(boolean loading status)
 *
 * TODO: Adapt this context in the future to contain extra(optional maybe?) fields for the multiplayer game modes and
 * any other game modes that are not currently in the scope of the team.
 */

import { useEffect, useState } from "react";
import { CurrentGameContext, useInitialGameState } from "./CurrentGameContext";

export function CurrentGameProvider({ children }) {
    const { gameId, setGameId, board, setBoard, score, setScore, timeLeft, setTimeLeft, foundWords, setFoundWords, isLoading, setIsLoading } = useInitialGameState();

    const [currentGuess, setCurrentGuess] = useState("");
    const [invalidWord, setInvalidWord] = useState(null);

    useEffect(() => {
        fetch("/api/game/new")
            .then((res) => res.json())
            .then((data) => {
                setBoard(data.board);
                setScore(0);
                setTimeLeft(60);
                setGameId(data.gameId);
                setCurrentGuess(""); // Clear the guess on a new game
                // A small delay added forces the loading screen to appear at least temporarily. Without it, the loading
                // screen can cause a weird visual glitch when the server responds extremely quickly
                setTimeout(() => setIsLoading(false), 1000);
            })
            .catch((err) => console.error(err));
    }, [setBoard, setGameId, setIsLoading, setScore, setTimeLeft]);

    // Sets timer to go off every 1000 milliseconds and update timeLeft accordingly
    useEffect(() => {
        if (!isLoading && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isLoading, timeLeft, setTimeLeft]);

    return (
        <CurrentGameContext.Provider value={{
            gameId, board, score, setScore, timeLeft, setTimeLeft,
            foundWords, setFoundWords, isLoading, setIsLoading,
            currentGuess, setCurrentGuess,
            invalidWord, setInvalidWord
        }}>
            {children}
        </CurrentGameContext.Provider>
    );
}