import "./Pages.css";
import "./MultiplayerGamePage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import GameBoard from "../components/GameBoard/GameBoard";
import MultiplayerWordInput from "../components/MultiplayerWordInput/MultiplayerWordInput";
import CurrentScore from "../components/CurrentScore/CurrentScore";
import Timer from "../components/Timer/Timer";
import LoadingIcon from "../components/LoadingIcon/LoadingIcon";
import FoundWordsSidebar from "../components/FoundWordsSidebar/FoundWordsSidebar";
import MultiplayerGameFinished from "../components/MultiplayerGameFinished/MultiplayerGameFinished";
import { CurrentGameContext } from "../contexts/CurrentGameContext/CurrentGameContext.jsx";
import { UserContext } from "../contexts/UserContext/UserContext";
import socketService from "../websocket/WebSocketService";

/**
 * MultiplayerGamePage.jsx
 *
 * The multiplayer game screen. Reuses GameBoard, Timer, CurrentScore, and
 * FoundWordsSidebar from single player. Word submission goes through
 * MultiplayerWordInput → WebSocket → server → broadcast back to all players.
 *
 * Connects to the WebSocket fresh on mount with a short delay to ensure
 * LobbyPage's disconnect cleanup has fully completed first. This sidesteps
 * the React Strict Mode double-invoke race condition entirely.
 *
 * @param {Array} initialPlayers - LobbyUser[] passed via router navigation state.
 * @component
 */
export default function MultiplayerGamePage({ initialPlayers }) {
    const nav = useNavigate();
    const { roomCode } = useParams();

    const {
        board,
        score,
        setScore,
        timeLeft,
        setTimeLeft,
        foundWords,
        setFoundWords,
        isLoading,
        gameId,
    } = useContext(CurrentGameContext);

    const { username } = useContext(UserContext);

    // playerScores: { username: number } — matches MultiplayerGameFinished prop shape
    const [playerScores, setPlayerScores] = useState(() => {
        const initial = {};
        (initialPlayers ?? []).forEach((p) => { initial[p.username] = 0; });
        return initial;
    });

    // playerFoundWords: { username: string[] } — matches MultiplayerGameFinished prop shape
    const [playerFoundWords, setPlayerFoundWords] = useState({});

    useEffect(() => {
        // Small delay ensures LobbyPage's disconnect cleanup finishes before
        // we establish the new connection. Without this, React Strict Mode's
        // double-invoke causes a race between disconnect and connect.
        const timer = setTimeout(() => {
            socketService.connect(
                roomCode,
                username,
                null,
                (state) => {
                    // state = MultiplayerGameState { playerScores: {}, playerFoundWords: {} }
                    setPlayerScores({ ...state.playerScores });
                    setPlayerFoundWords({ ...state.playerFoundWords });

                    // Keep local context score in sync so CurrentScore is accurate
                    if (state.playerScores[username] !== undefined) {
                        setScore(state.playerScores[username]);
                    }

                    // Keep local found words in sync so FoundWordsSidebar is accurate
                    if (state.playerFoundWords?.[username]) {
                        setFoundWords(new Set(state.playerFoundWords[username]));
                    }
                }
            );
        }, 100);

        return () => clearTimeout(timer);
    }, [roomCode, username, setFoundWords, setScore]);

    useEffect(() => {
        if (timeLeft === 0 && gameId) {
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
                }),
            })
                .then((res) => console.log("Multiplayer game saved, status:", res.status))
                .catch((err) => console.error("Failed to save multiplayer game:", err));
        }
    }, [timeLeft, gameId, score, foundWords]);

    const goHome = () => {
        socketService.disconnect();
        nav("/");
    };

    if (timeLeft === 0) {
        return (
            <MultiplayerGameFinished
                playerScores={playerScores}
                playerFoundWords={playerFoundWords}
                currentUsername={username}
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

                    {/* Left: live scoreboard */}
                    <div className="multiplayer-left-column">
                        <div className="mp-scoreboard-card">
                            <h2 className="mp-scoreboard-title">SCORES</h2>
                            <ul className="mp-scoreboard-list">
                                {Object.entries(playerScores)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([uname, pts], i) => {
                                        const lobbyPlayer =
                                            (initialPlayers ?? []).find((p) => p.username === uname) ?? {};
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

                    {/* Center: main game */}
                    <div className="game-center-column">
                        <p className="game-page-text title">DRAG OR TYPE LETTERS TO PLAY!</p>
                        <Timer timeLeft={timeLeft} />
                        <CurrentScore score={score} />
                        <MultiplayerWordInput roomCode={roomCode} />
                        <GameBoard board={board} updateScore={() => {}} />
                        <button
                            className="btn quit-btn"
                            onClick={() => {
                                socketService.disconnect();
                                setTimeLeft(0);
                            }}
                        >
                            QUIT
                        </button>
                    </div>

                    {/* Right: found words */}
                    <div className="game-right-column">
                        <FoundWordsSidebar />
                    </div>

                </div>
            )}
        </div>
    );
}