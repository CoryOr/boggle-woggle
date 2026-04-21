import { createContext, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const CurrentGameContext = createContext(null);

export function CurrentGameProvider({
  children,
  skipAutoFetch = false,
}) {
  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [foundWords, setFoundWords] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const [currentGuess, setCurrentGuess] = useState("");
  const [invalidWord, setInvalidWord] = useState(null);

  // SINGLE PLAYER ONLY AUTO FETCH
  useEffect(() => {
    if (skipAutoFetch) return;

    fetch("/api/game/new")
      .then((res) => res.json())
      .then((data) => {
        setBoard(data.board);
        setScore(0);
        setTimeLeft(60);
        setGameId(data.gameId);
        setCurrentGuess("");
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  }, [skipAutoFetch]);

  // TIMER
  useEffect(() => {
    if (!isLoading && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLoading, timeLeft]);

  return (
    <CurrentGameContext.Provider
      value={{
        gameId,
        setGameId,
        board,
        setBoard,
        score,
        setScore,
        timeLeft,
        setTimeLeft,
        foundWords,
        setFoundWords,
        isLoading,
        setIsLoading,
        currentGuess,
        setCurrentGuess,
        invalidWord,
        setInvalidWord,
      }}
    >
      {children}
    </CurrentGameContext.Provider>
  );
}