import "./Pages.css";
import "./MultiplayerGamePage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState, useRef, useCallback } from "react";
import GameBoard from "../components/GameBoard/GameBoard";
import MultiplayerWordInput from "../components/MultiplayerWordInput/MultiplayerWordInput";
import CurrentScore from "../components/CurrentScore/CurrentScore";
import Timer from "../components/Timer/Timer";
import LoadingIcon from "../components/LoadingIcon/LoadingIcon";
import FoundWordsSidebar from "../components/FoundWordsSidebar/FoundWordsSidebar";
import MultiplayerGameFinished from "../components/MultiplayerGameFinished/MultiplayerGameFinished";
import { CurrentGameContext } from "../contexts/CurrentGameContext/CurrentGameContext.jsx";
import { UserContext } from "../contexts/UserContext/UserContext";
import { AudioContext } from "../contexts/AudioContext/AudioContextContext.jsx";
import socketService from "../websocket/WebSocketService";

export default function MultiplayerGamePage({ initialPlayers }) {
  const nav = useNavigate();
  const { roomCode } = useParams();
  const [version] = useState(0);

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

  const { username } = useContext(UserContext);
  const { playSfx } = useContext(AudioContext);

  const gameOverPlayedRef = useRef(false);

  const [playerScores, setPlayerScores] = useState(() => {
    const initial = {};
    (initialPlayers ?? []).forEach((p) => {
      initial[p.username] = 0;
    });
    return initial;
  });

  const [playerFoundWords, setPlayerFoundWords] = useState({});

  const updateScore = (points) => {
    if (points > 0) {
      playSfx("/sounds/valid.wav");
    }

    setScore((prev) => prev + points);
  };

  const updatePlayerScores = (points) => {
    setPlayerScores((prev) => ({
      ...prev,
      [username]: (prev[username] || 0) + points,
    }));
  };

  const getWinners = useCallback(() => {
    const leaderboard = Object.entries(playerScores)
      .map(([username, score]) => ({
        username,
        score,
        wordCount: (playerFoundWords[username] ?? []).length,
      }))
      .sort((a, b) => b.score - a.score);

    const topScore = leaderboard[0]?.score ?? 0;

    return leaderboard
      .filter((player) => player.score === topScore)
      .map((player) => player.username);
  }, [playerScores, playerFoundWords]);

  useEffect(() => {
    const timer = setTimeout(() => {
      socketService.connect(roomCode, username, null, (state) => {
        setPlayerScores({ ...state.playerScores });
        setPlayerFoundWords({ ...state.playerFoundWords });

        if (state.playerScores[username] !== undefined) {
          setScore(state.playerScores[username]);
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [roomCode, username, setScore, version]);

  useEffect(() => {
    if (timeLeft === 0 && gameId) {
      const winners = getWinners();

      fetch("/api/game/finish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          gameId,
          score,
          foundWords: [...foundWords],
          winnerUsernames: winners,
        }),
      })
        .then((res) =>
          console.log("Multiplayer game saved, status:", res.status)
        )
        .catch((err) => console.error("Failed to save multiplayer game:", err));
    }
  }, [timeLeft, gameId, score, foundWords, getWinners]);

  useEffect(() => {
    if (timeLeft === 0 && !gameOverPlayedRef.current) {
      playSfx("/sounds/Winner.mp3");
      gameOverPlayedRef.current = true;
    }
  }, [timeLeft, playSfx]);

  const goHome = () => {
    socketService.disconnect();
    nav("/");
  };

  const handleQuit = () => {
    playSfx("/sounds/click.wav");
    socketService.disconnect();
    setTimeLeft(0);
  };

  if (timeLeft === 0) {
    console.log(playerFoundWords);
    return (
      <MultiplayerGameFinished
        playerScores={playerScores}
        playerFoundWords={playerFoundWords}
        currentUsername={username}
        currentUserWords={[...foundWords]}
        onGoHome={goHome}
      />
    );
  }

  return (
    <div className="game-page-container multiplayer-game-page">
      {isLoading ? (
        <LoadingIcon />
      ) : (
        <div className="multiplayer-layout-wrapper">
          <div className="multiplayer-left-column">
            <div className="mp-scoreboard-card">
              <h2 className="mp-scoreboard-title">SCORES</h2>
              <ul className="mp-scoreboard-list">
                {Object.entries(playerScores)
                  .sort(([, a], [, b]) => b - a)
                  .map(([uname, pts], i) => {
                    const lobbyPlayer =
                      (initialPlayers ?? []).find(
                        (p) => p.username === uname
                      ) ?? {};
                    return (
                      <li
                        key={uname}
                        className={`mp-scoreboard-row ${
                          uname === username ? "mp-scoreboard-row--me" : ""
                        }`}
                      >
                        <span className="mp-rank">#{i + 1}</span>
                        {lobbyPlayer.avatar && (
                          <img
                            src={lobbyPlayer.avatar}
                            alt={uname}
                            className="mp-avatar"
                          />
                        )}
                        <span className="mp-player-name">
                          {uname}
                          {lobbyPlayer.isHost && (
                            <span className="mp-host-badge"> 👑</span>
                          )}
                        </span>
                        <span className="mp-player-score">{pts}</span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>

          <div className="game-center-column">
            <p className="game-page-text title">
              DRAG OR TYPE LETTERS TO PLAY!
            </p>
            <Timer timeLeft={timeLeft} />
            <CurrentScore score={score} />
            <MultiplayerWordInput
              roomCode={roomCode}
              username={username}
              updateScore={updateScore}
              updatePlayerScores={updatePlayerScores}
            />
            <GameBoard
              board={board}
              updateScore={updateScore}
              updatePlayerScores={updatePlayerScores}
              roomCode={roomCode}
              username={username}
            />
            <button className="btn quit-btn" onClick={handleQuit}>
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