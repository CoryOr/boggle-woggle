import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RoomCodeCard from "../components/MultiplayerLobbyComponents/RoomCodeCard";
import PlayerCards from "../components/MultiplayerLobbyComponents/PlayerCards";
import { Card, Button } from "react-bootstrap";
import socketService from "../websocket/WebSocketService";
import { UserContext } from "../contexts/UserContext/UserContext";
import { AudioContext } from "../contexts/AudioContext/AudioContext";
import "./Pages.css";

export default function LobbyPage() {
  const nav = useNavigate();
  const [players, setPlayers] = useState([]);
  const { roomCode } = useParams();
  const { username, isLoggedIn } = useContext(UserContext);
  const { playSfx, startMusic } = useContext(AudioContext);

  const currentUser = players.find((p) => p.username === username);
  const isHost = currentUser?.isHost || false;
  const isReady = currentUser?.isReady || false;
  const allPlayersReady = players.length > 0 && players.every((p) => p.isReady);

  useEffect(() => {
    if (!isLoggedIn) {
      nav("/login");
    }
  }, [isLoggedIn, nav]);

  useEffect(() => {
    startMusic("/sounds/menu-music.mp3");

    if (roomCode && username) {
      socketService.connect(roomCode, username, (data) => {
        setPlayers(data.players);
      });
    }

    return () => {
      socketService.disconnect();
    };
  }, [roomCode, username, startMusic]);

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
            <Button className={allPlayersReady ? "btn" : "btn-disabled"}>
              Start Game
            </Button>
          ) : (
            <Button className="btn-disabled">Waiting for host...</Button>
          )}
        </Card>
      </div>
    </>
  );
}