/**
 * HomePage.jsx
 *
 * Main landing page for the Boggle app.
 *
 * Features:
 * - Displays the Boggle logo
 * - Provides navigation buttons for Store, Single Player, Multiplayer, and Statistics
 * - Shows setting and audio icons
 * - Displays promotional merch section and support button
 *
 * Author(s): Alexander Ordonez / Boggle Woggle (t_3c)
 */

import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import { useEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext/UserContext";
import { AudioContext } from "../contexts/AudioContext/AudioContextContext";

export default function HomePage() {
  const nav = useNavigate();
  const { avatar, username, isLoggedIn, logout } = useContext(UserContext);
  const { playSfx, toggleMute, muted } = useContext(AudioContext);

  const playClick = () => playSfx("/sounds/click.wav");

  const gameSelect = () => {
    playClick();
    nav("/game-select");
  };

  const login = () => {
    playClick();
    nav("/login");
  };

  const stats = () => {
    playClick();
    nav("/stats");
  };

  const store = () => {
    playClick();
    nav("/store");
  };

  const settings = () => {
    playClick();
    nav("/settings");
  };

  const handleLogout = () => {
    playClick();
    logout();
    nav("/login");
  };

  const handleToggleMute = () => {
    toggleMute();
  };

  const navCards = [
    { title: "STORE", action: store },
    { title: "PLAY GAME", action: gameSelect },
    { title: "STATISTICS", action: stats },
    isLoggedIn
      ? { title: "LOG OUT", action: handleLogout }
      : { title: "LOGIN", action: login },
  ];

  useEffect(() => {
    localStorage.removeItem("currentGame");
    localStorage.removeItem("foundWords");
  }, []);

  return (
    <div className="homePage">
      <div className="homeShell">
        <div className="homeTopBar">
          <div className="homeLogo">
            <img
              src="/LOGO.png"
              alt="Boggle Logo"
              className="BoggleLogoImage"
            />
          </div>

          <div className="homeIcons">
            {isLoggedIn && avatar && (
              <img
                src={avatar}
                alt={`${username}'s avatar`}
                className="homeUserAvatar"
              />
            )}

            <img
              src="/Volume.png"
              alt="volume"
              className={`VolumeImage ${muted ? "muted" : ""}`}
              onClick={handleToggleMute}
            />

            <img
              src="/SettingBox.png"
              alt="settings"
              className="SettingImage"
              onClick={settings}
            />
          </div>
        </div>

        <div className="homeButtonGrid">
          {navCards.map((card) => (
            <Card
              key={card.title}
              className="homeNavCard"
              onClick={card.action}
            >
              <Card.Body className="homeNavCardBody">
                <Card.Text className="homeNavCardText">
                  {card.title === "SINGLE PLAYER" ? (
                    <>
                      SINGLE
                      <br />
                      PLAYER
                    </>
                  ) : (
                    card.title
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>

        <div className="homePromoGrid">
          <Card className="promoCard burstCard">
            <Card.Body className="promoCardBody">
              <div className="merchBurst">
                <div className="merchText">
                  NEW MERCH
                  <br />
                  IN STORE
                  <br />
                  !!!
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="promoCard mascotCard">
            <Card.Body className="promoCardBody">
              <img
                src="/BingBong.png"
                alt="BingBong"
                className="BingBongImage"
              />
            </Card.Body>
          </Card>

          <Card className="promoCard supportCard" disabled={true}>
            <Card.Body className="promoCardBody">
              <Card.Text className="supportCardText">SUPPORT US!</Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}