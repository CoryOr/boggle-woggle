/**
 * Placeholder page that will eventually be how we implement multiplayer. The current idea is to generate some kind
 * of unique lobby code that can then be shared so multiplayer can work properly, but this is TBD, pending the research
 * report for an issue that is currently up on Gitlab.
 */

import { useNavigate } from "react-router-dom";
import RoomCodeCard from "../components/MultiplayerLobbyComponents/RoomCodeCard";
import PlayerCards from "../components/MultiplayerLobbyComponents/PlayerCards";
import { Card, Button } from "react-bootstrap";
import "./Pages.css";

export default function LobbyPage() {
  const nav = useNavigate();

  return (
    <>
      <button className="stats-back-btn" onClick={() => nav("/game-select")}>
        <div className="stats-back-arrow">←</div>
        BACK
      </button>
      <div className="lobby-page">
        <Card className="lobby-page-container">
          <h1 className="title">Lobby</h1>
          <RoomCodeCard />
          <PlayerCards />
        </Card>
        <Card className="lobby-page-container lobby-buttons-container">
          <Button className="btn">Ready</Button>
          <Button className="btn-disabled">Waiting for host...</Button>
        </Card>
      </div>
    </>
  );
}
