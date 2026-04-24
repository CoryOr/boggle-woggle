//GamePage.jsx
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import GameBoard from "../components/GameBoard/GameBoard";
import "../components/GameBoard/GameBoard.css";
import { CurrentGameContext } from "../contexts/CurrentGameContext/CurrentGameContext.jsx";
import { UserContext } from "../contexts/UserContext/UserContext";
import { AudioContext } from "../contexts/AudioContext/AudioContextContext.jsx";
import Timer from "../components/Timer/Timer";
import GameFinished from "../components/GameFinished/GameFinished";
import WordInput from "../components/WordInput/WordInput";
import CurrentScore from "../components/CurrentScore/CurrentScore";
import LoadingIcon from "../components/LoadingIcon/LoadingIcon";
import FoundWordsSidebar from "../components/FoundWordsSidebar/FoundWordsSidebar";

export default function GamePage() {
  const nav = useNavigate();

  const {
    board,
    score,
    setScore,
    timeLeft,
    setTimeLeft,
    foundWords,
    isLoading,
    gameId,
  } = useContext(CurrentGameContext);

  const { highScore, longestWord } = useContext(UserContext);
  const { playSfx } = useContext(AudioContext);

  const [prevHighScore] = useState(() => highScore ?? 0);
  const [prevLongestWord] = useState(() => longestWord?.length ?? 0);

  const gameOverPlayedRef = useRef(false);

  useEffect(() => {
    if (!isLoading && timeLeft === 0 && gameId) {
      fetch("/api/game/finish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          gameId,
          score,
          foundWords: [...foundWords],
        }),
      })
        .then((res) => console.log("Game saved, status:", res.status))
        .catch((err) => console.error("Failed to save game result:", err));
    }
  }, [isLoading, timeLeft, gameId, score, foundWords]);

  useEffect(() => {
    if (!isLoading && timeLeft === 0 && !gameOverPlayedRef.current) {
      playSfx("/sounds/Winner.mp3");
      gameOverPlayedRef.current = true;
    }
  }, [isLoading, timeLeft, playSfx]);

  useEffect(() => {
    if (!isLoading && timeLeft > 0) {
      gameOverPlayedRef.current = false;
    }
  }, [isLoading, timeLeft]);

  const goHome = () => {
    nav("/");
  };

  const updateScore = (points) => {
    if (points > 0) {
      playSfx("/sounds/valid.wav");
    }

    setScore((prev) => prev + points);
  };

  const handleQuit = () => {
    playSfx("/sounds/click.wav");
    setTimeLeft(0);
  };

  return (
    <div className="game-page-container">
      {isLoading ? (
        <LoadingIcon />
      ) : timeLeft !== null && timeLeft === 0 ? (
        <GameFinished
          onGoHome={goHome}
          prevHighScore={prevHighScore}
          prevLongestWord={prevLongestWord}
        />
      ) : (
        <div className="game-layout-wrapper">
          <div className="game-center-column">
            <p className="game-page-text title">
              DRAG OR TYPE LETTERS TO PLAY!
            </p>
            <Timer timeLeft={timeLeft} />
            <CurrentScore score={score} />
            <WordInput updateScore={updateScore} />
            <GameBoard board={board} updateScore={updateScore} />
            <button
              className="btn quit-btn"
              onClick={handleQuit}
            >
              QUIT
            </button>
          </div>

          <div className="game-right-column">
            <FoundWordsSidebar />
          </div>
        </div>
      )}
    </div>
  );
}