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
import { useEffect } from "react"; 

export default function HomePage() {
  const nav = useNavigate();

  const gameSelect = () => nav("/game-select");
  const login = () => nav("/login");
  const stats = () => nav("/stats");
  const store = () => nav("/store");

  const navCards = [
    { title: "STORE", action: store },
    { title: "PLAY GAME", action: gameSelect },
    { title: "STATISTICS", action: stats },
    { title: "LOGIN", action: login },
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
            <img src="/Volume.png" alt="volume" className="VolumeImage" />
            <img src="/SettingBox.png" alt="settings" className="SettingImage" onClick={() => nav("/settings")}/>
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
