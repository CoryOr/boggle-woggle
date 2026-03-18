import { createContext, useState, useEffect } from "react";

export const CurrentGameContext = createContext(null);

export function CurrentGameProvider({ children }) {
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [foundWords, setFoundWords] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentGame = localStorage.getItem("currentGame");
    const savedFoundWords = localStorage.getItem("foundWords");

    if (currentGame) {
      setBoard(JSON.parse(currentGame));
      if (savedFoundWords) {
        setFoundWords(new Set(JSON.parse(savedFoundWords)));
      }
    } 
    else {
      fetch("/api/game/new")
        .then((res) => res.json())
        .then((data) => {
          setBoard(data.board);
          setIsLoading(false);
          setScore(0);
          setTimeLeft(60);
          localStorage.setItem("currentGame", JSON.stringify(data.board));
          localStorage.setItem("foundWords", JSON.stringify([]));
        })
        .catch((err) => console.error(err));
    }
  }, []);

  return (
    <CurrentGameContext.Provider
      value={{
        board,
        score,
        timeLeft,
        foundWords,
        isLoading,
      }}
    >
      {children}
    </CurrentGameContext.Provider>
  );
}
