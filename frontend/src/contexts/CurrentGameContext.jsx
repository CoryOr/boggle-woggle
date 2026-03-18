import { useEffect } from "react";
import { CurrentGameContext, useInitialGameState } from "./CurrentGameContext";

export function CurrentGameProvider({ children }) {
  const { board, setBoard, score, setScore, timeLeft, setTimeLeft, foundWords, setFoundWords, isLoading, setIsLoading } = useInitialGameState();

  useEffect(() => {
    if (board.length === 0) {
      fetch("/api/game/new")
        .then((res) => res.json())
        .then((data) => {
          setBoard(data.board);
          setScore(0);
          setTimeLeft(60);
          setIsLoading(false);
          localStorage.setItem("currentGame", JSON.stringify(data.board));
          localStorage.setItem("foundWords", JSON.stringify([]));
        })
        .catch((err) => console.error(err));
    }
  }, []);

  return (
    <CurrentGameContext.Provider value={{ board, score, timeLeft, foundWords, isLoading }}>
      {children}
    </CurrentGameContext.Provider>
  );
}