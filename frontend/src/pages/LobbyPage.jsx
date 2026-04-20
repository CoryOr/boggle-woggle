/**
 * Placeholder page that will eventually be how we implement multiplayer. The current idea is to generate some kind
 * of unique lobby code that can then be shared so multiplayer can work properly, but this is TBD, pending the research
 * report for an issue that is currently up on Gitlab.
 */

import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RoomCodeCard from "../components/MultiplayerLobbyComponents/RoomCodeCard";
import PlayerCards from "../components/MultiplayerLobbyComponents/PlayerCards";
import { Card, Button } from "react-bootstrap";
import WebSocketService from "../websocket/WebSocketService";
import { UserContext } from "../contexts/UserContext/UserContext";
import "./Pages.css";

export default function LobbyPage() {
  const nav = useNavigate();
  const [players, setPlayers] = useState([]);
  const { roomCode } = useParams();
  const { username, isLoggedIn } = useContext(UserContext);

  // Derived state: these are calculated every render based on the 'players' state
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
    if (roomCode) {
      WebSocketService.connect(roomCode, username, (data) => {
        setPlayers(data.players);
      });
    }

    return () => {
      WebSocketService.disconnect();
    };
  }, [roomCode, username]);

  if (!isLoggedIn) return null;

  return (
    <>
      <button className="stats-back-btn" onClick={() => nav("/game-select")}>
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
            onClick={() => WebSocketService.toggleReady(roomCode, username)}
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
