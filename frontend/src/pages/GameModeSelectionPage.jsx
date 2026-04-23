/**
 * Page that a user navigates to after clicking "Play Game" button on home page
 * Current gamemodes:
 * 1) Single player(navigates to GamePage)
 * 2) Multiplayer(navigates to LobbyPage)
 * 3) Daily Challenge(My own idea of something we could add, but not necessary for the project :D)
 */

import { useState, useContext } from "react";
import { Card, CardHeader, CardBody, Button } from "react-bootstrap";
import { RiUser3Fill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { FaBoltLightning } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
//import WebSocketService from "../websocket/WebSocketService";
import "./Pages.css";
import { UserContext } from "../contexts/UserContext/UserContext";
import { AudioContext } from "../contexts/AudioContext/AudioContextContext";

export default function GameModeSelectionPage() {
  const nav = useNavigate();
  const { isLoggedIn } = useContext(UserContext);
  const { playSfx } = useContext(AudioContext);

  const [hasClickedMultiplayer, setHasClickedMultiPlayer] = useState(false);
  const [userInputtedRoomCode, setUserInputtedRoomCode] = useState("");

  const goHome = () => {
    playSfx("/sounds/click.wav");
    nav("/");
  };

  const goToSinglePlayer = () => {
    playSfx("/sounds/click.wav");
    nav("/game");
  };

  const openMultiplayerOptions = () => {
    playSfx("/sounds/click.wav");
    setHasClickedMultiPlayer(true);
  };

  const createNewRoom = async () => {
    playSfx("/sounds/click.wav");

    if (!isLoggedIn) {
      nav("/login");
      alert("You must login in order to create a multiplayer room!");
      return;
    }

    try {
      const result = await fetch("/api/room/new");
      const data = await result.json();
      nav(`/lobby/${data.roomCode}`);
    } catch (error) {
      alert("Error creating room");
      console.log(error);
    }
  };

  const joinRoom = () => {
    playSfx("/sounds/click.wav");

    if (!isLoggedIn) {
      nav("/login");
      alert("You must login in order to join a multiplayer room!");
      return;
    }

    nav(`/lobby/${userInputtedRoomCode}`);
  };

  return (
    <>
      <button className="stats-back-btn" onClick={goHome}>
        <div className="stats-back-arrow">←</div>
        BACK
      </button>

      <div className="container">
        <h1 className="title mode-selection-title">Select Game Mode</h1>

        <Card className="gamemode-selection-card" onClick={goToSinglePlayer}>
          <CardHeader className="gamemode-selection-card-header">
            <RiUser3Fill />
            <h3>Single Player</h3>
          </CardHeader>
          <CardBody className="gamemode-selection-card-body">
            <p>Find as many words as you can in one minute</p>
          </CardBody>
        </Card>

        <Card
          className="gamemode-selection-card"
          onClick={openMultiplayerOptions}
        >
          <CardHeader className="gamemode-selection-card-header">
            <FaUsers />
            <h3>Multiplayer</h3>
          </CardHeader>
          <CardBody className="gamemode-selection-card-body">
            <p>Create a lobby to invite and challenge your friends</p>
          </CardBody>
        </Card>

        {hasClickedMultiplayer && (
          <>
            <Card
              className="multiplayer-selection-card top"
              style={{ animationDelay: "0.1s" }}
              onClick={createNewRoom}
            >
              Create A Room
            </Card>

            <Card
              className="multiplayer-selection-card bottom"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader>Join An Existing Room</CardHeader>
              <CardBody>
                <div className="lobby-join-form">
                  <input
                    className="code-input"
                    value={userInputtedRoomCode}
                    onChange={(e) => setUserInputtedRoomCode(e.target.value)}
                  />
                  <Button className="lobby-button" onClick={joinRoom}>
                    Enter
                  </Button>
                </div>
              </CardBody>
            </Card>
          </>
        )}

        <Card className="gamemode-selection-card disabled">
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