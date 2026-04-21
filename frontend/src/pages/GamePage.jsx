import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import GameBoard from "../components/GameBoard/GameBoard";
import "../components/GameBoard/GameBoard.css";
import { CurrentGameContext } from "../contexts/CurrentGameContext/CurrentGameContext";
import { AudioContext } from "../contexts/AudioContext/AudioContext";
import { UserContext } from "../contexts/UserContext/UserContext";
import Timer from "../components/Timer/Timer";
import GameFinished from "../components/GameFinished/GameFinished";
import WordInput from "../components/WordInput/WordInput";
import CurrentScore from "../components/CurrentScore/CurrentScore";
import LoadingIcon from "../components/LoadingIcon/LoadingIcon";
import FoundWordsSidebar from "../components/FoundWordsSidebar/FoundWordsSidebar";

/**
 * GamePage.jsx
 * A hub file for all of our game logic. Currently holds single player information,
 * but will be extended to multiplayer in the future. Coordinates the layout between
 * the game board, inputs, timers, and the sidebar.
 *
 * @component
 * @returns {JSX.Element} The rendered GamePage UI.
 */
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

  const { startMusic, stopMusic, playSfx } = useContext(AudioContext);
  const { highScore, longestWord } = useContext(UserContext);

  const [prevHighScore] = useState(() => highScore ?? 0);
  const [prevLongestWord] = useState(() => longestWord?.length ?? 0);

  console.log("Current words found:", [...foundWords]);

  // Uncomment when you add gameplay music
  // useEffect(() => {
  //   startMusic("/sounds/bg-music.mp3");
  //
  //   return () => {
  //     stopMusic();
  //   };
  // }, [startMusic, stopMusic]);

  useEffect(() => {
    if (timeLeft === 0) {
      stopMusic();
    }
  }, [timeLeft, stopMusic]);

  useEffect(() => {
    if (timeLeft === 0 && gameId) {
      fetch("/api/game/finish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ gameId, score, foundWords: [...foundWords] }),
      })
        .then((res) => console.log("Game saved, status:", res.status))
        .catch((err) => console.error("Failed to save game result:", err));
    }
  }, [timeLeft, gameId, score, foundWords]);

  const goHome = () => {
    nav("/");
  };

  const updateScore = (points) => {
    setScore(score + points);
  };

  return (
    <div className="game-page-container">
      {timeLeft === 0 ? (
        <GameFinished
          onGoHome={goHome}
          prevHighScore={prevHighScore}
          prevLongestWord={prevLongestWord}
        />
      ) : (
        <>
          {isLoading ? (
            <LoadingIcon />
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
                  onClick={() => {
                    playSfx("/sounds/click.wav");
                    setTimeLeft(0);
                  }}
                >
                  QUIT
                </button>
              </div>

              <div className="game-right-column">
                <FoundWordsSidebar />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}