/**
 * Page that a user navigates to after clicking "Play Game" button on home page
 * Current gamemodes:
 * 1) Single player(navigates to GamePage)
 * 2) Multiplayer(navigates to LobbyPage)
 * 3) Daily Challenge(My own idea of something we could add, but not necessary for the project :D)
 */

import { Card, CardHeader, CardBody } from "react-bootstrap";
import { RiUser3Fill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { FaBoltLightning } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "./Pages.css";

export default function GameModeSelectionPage() {
  const nav = useNavigate();

  return (
    <>
      <button className="stats-back-btn" onClick={() => nav("/")}>
        <div className="stats-back-arrow">←</div>
        BACK
      </button>
      <div className="container">
        <h1 className="title mode-selection-title">Select Game Mode</h1>
        <Card className="gamemode-selection-card" onClick={() => nav("/game")}>
          <CardHeader className="gamemode-selection-card-header">
            <RiUser3Fill />
            <h3>Single Player</h3>
          </CardHeader>
          <CardBody className="gamemode-selection-card-body">
            <p>Find as many words as you can in one minute</p>
          </CardBody>
        </Card>
        <Card className="gamemode-selection-card" onClick={() => nav("/lobby")}>
          <CardHeader className="gamemode-selection-card-header">
            <FaUsers />
            <h3>Multiplayer</h3>
          </CardHeader>
          <CardBody className="gamemode-selection-card-body">
            <p>Create a lobby to invite and challenge your friends</p>
          </CardBody>
        </Card>
        <Card className="gamemode-selection-card disabled-game-mode">
          <CardHeader className="gamemode-selection-card-header">
            <FaBoltLightning />
            <h3>Daily Challenge</h3>
          </CardHeader>
          <CardBody className="gamemode-selection-card-body">
            <p>Coming soon...</p>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
