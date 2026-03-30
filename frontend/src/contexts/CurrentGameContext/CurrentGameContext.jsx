import { useEffect } from "react";
import { CurrentGameContext, useInitialGameState } from "./CurrentGameContext";

export function CurrentGameProvider({ children }) {
    const { gameId, setGameId, board, setBoard, score, setScore, timeLeft, setTimeLeft, foundWords, setFoundWords, isLoading, setIsLoading } = useInitialGameState();

    useEffect(() => {
        fetch("/api/game/new")
            .then((res) => res.json())
            .then((data) => {
                setBoard(data.board);
                setScore(0);
                setTimeLeft(60);
                setGameId(data.gameId);
                setTimeout(() => setIsLoading(false), 1000);
                //setIsLoading(false);
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        if (!isLoading && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isLoading, timeLeft, setTimeLeft]);

    return (
        <CurrentGameContext.Provider value={{ gameId, board, score, setScore, timeLeft, setTimeLeft, foundWords, setFoundWords, isLoading, setIsLoading }}>
            {children}
        </CurrentGameContext.Provider>
    );
}