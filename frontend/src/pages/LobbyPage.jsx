import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RoomCodeCard from "../components/MultiplayerLobbyComponents/RoomCodeCard";
import PlayerCards from "../components/MultiplayerLobbyComponents/PlayerCards";
import { Card, Button } from "react-bootstrap";
import socketService from "../websocket/WebSocketService";
import { UserContext } from "../contexts/UserContext/UserContext";
import { AudioContext } from "../contexts/AudioContext/AudioContextContext";
import "./Pages.css";

/**
 * LobbyPage.jsx
 *
 * Multiplayer lobby. Players join, toggle ready, and the host starts the game.
 *
 * When the host clicks Start Game:
 *  1. Host publishes { roomCode } to /app/room.start via WebSocket
 *  2. Server generates a board and broadcasts MultiplayerGameState to
 *     /room/{roomCode}/start
 *  3. All clients receive it here and navigate to /lobby/:roomCode/game
 *     with players, gameId, and board in router state
 *  4. MultiplayerGamePage reconnects fresh after a short delay
 */
export default function LobbyPage() {
  const nav = useNavigate();
  const [players, setPlayers] = useState([]);
  const [isStarting, setIsStarting] = useState(false);
  const { roomCode } = useParams();
  const { username, isLoggedIn } = useContext(UserContext);
  const { playSfx, startMusic } = useContext(AudioContext);
  const playersRef = useRef(players);

  const currentUser = players.find((p) => p.username === username);
  const isHost = currentUser?.isHost || false;
  const isReady = currentUser?.isReady || false;
  const allPlayersReady =
    players.length > 0 && players.every((p) => p.isReady);

  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  useEffect(() => {
    if (!isLoggedIn) nav("/login");
  }, [isLoggedIn, nav]);

  useEffect(() => {
    startMusic("/sounds/menu-music.mp3");

    if (!roomCode || !username) return;

    socketService.connect(
      roomCode,
      username,
      (data) => {
        if (data.gameId && data.board) {
          nav(`/lobby/${roomCode}/game`, {
            state: {
              players: playersRef.current,
              gameId: data.gameId,
              board: data.board,
            },
          });
          return;
        }
        if (data.players) setPlayers(data.players);
      },
      null
    );

    return () => {
      socketService.disconnect();
    };
  }, [roomCode, username, nav, startMusic]);

  const handleStartGame = () => {
    if (!allPlayersReady || isStarting) return;
    setIsStarting(true);
    try {
      playSfx("/sounds/click.wav");
      socketService._publish("/app/room.start", { roomCode });
    } catch (err) {
      console.error("Failed to start game:", err);
      setIsStarting(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <>
      <button
        className="stats-back-btn"
        onClick={() => {
          playSfx("/sounds/click.wav");
          nav("/game-select");
        }}
      >
        <div className="stats-back-arrow">←</div>
        BACK
      </button>

      <div className="lobby-page">
        <Card className="lobby-page-container">
          <h1 className="title">Lobby</h1>
          <RoomCodeCard roomCode={roomCode} />
          <PlayerCards players={players} />
        </Card>

        <Card className="lobby-page-container lobby-buttons-container">
          <Button
            className="btn"
            onClick={() => {
              playSfx("/sounds/click.wav");
              socketService.toggleReady(roomCode, username);
            }}
          >
            {!isReady ? "Ready" : "Not Ready"}
          </Button>

          {isHost ? (
            <Button
              className={
                allPlayersReady && !isStarting ? "btn" : "btn btn-disabled"
              }
              onClick={handleStartGame}
              disabled={!allPlayersReady || isStarting}
            >
              {isStarting ? "Starting..." : "Start Game"}
            </Button>
          ) : (
            <Button className="btn btn-disabled" disabled>
              Waiting for host...
            </Button>
          )}
        </Card>
      </div>
    </>
  );
}
