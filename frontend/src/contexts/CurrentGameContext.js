import { createContext, useState } from "react";

export const CurrentGameContext = createContext(null);

export function useInitialGameState() {
    const [board, setBoard] = useState([]);
    const [foundWords, setFoundWords] = useState(new Set());
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isLoading, setIsLoading] = useState(true);

  return { board, setBoard, score, setScore, timeLeft, setTimeLeft, foundWords, setFoundWords, isLoading, setIsLoading };
}