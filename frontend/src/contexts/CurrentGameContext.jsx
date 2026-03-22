import { useEffect } from "react";
import { CurrentGameContext, useInitialGameState } from "./CurrentGameContext";

export function CurrentGameProvider({ children }) {
  const { board, setBoard, score, setScore, timeLeft, setTimeLeft, foundWords, isLoading, setIsLoading } = useInitialGameState();

  useEffect(() => {
    if (board.length === 0) {
      fetch("/api/game/new")
        .then((res) => res.json())
        .then((data) => {
          setBoard(data.board);
          setScore(0);
          setTimeLeft(60);
          setIsLoading(true);
          localStorage.setItem("currentGame", JSON.stringify(data.board));
          localStorage.setItem("foundWords", JSON.stringify([]));
        })
        .catch((err) => console.error(err));
    }
  }, [board.length, setBoard, setIsLoading, setScore, setTimeLeft]);

  return (
    <CurrentGameContext.Provider value={{ board, score, timeLeft, foundWords, isLoading, setIsLoading }}>
      {children}
    </CurrentGameContext.Provider>
  );
}