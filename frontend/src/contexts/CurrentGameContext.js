import { createContext, useState } from "react";

export const CurrentGameContext = createContext(null);

export function useInitialGameState() {
  const [board, setBoard] = useState(() => {
    const currentGame = localStorage.getItem("currentGame");
    return currentGame ? JSON.parse(currentGame) : [];
  });

  const [foundWords, setFoundWords] = useState(() => {
    const savedFoundWords = localStorage.getItem("foundWords");
    return savedFoundWords ? new Set(JSON.parse(savedFoundWords)) : new Set();
  });

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isLoading, setIsLoading] = useState(!localStorage.getItem("currentGame"));

  return { board, setBoard, score, setScore, timeLeft, setTimeLeft, foundWords, setFoundWords, isLoading, setIsLoading };
}