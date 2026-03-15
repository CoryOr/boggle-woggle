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
import { useEffect } from "react";

export default function HomePage() {
  // Navigate to different pages
  const nav = useNavigate();

  const singlePlayer = () => {
    nav("/game");
  };

  const multiplayer = () => {
    nav("/login");
  };

  const stats = () => {
    nav("/stats");
  };

  const store = () => {
    nav("/store");
  };

  useEffect(() => {
    localStorage.removeItem("currentGame");
    localStorage.removeItem("foundWords");
  }, []);

  return (
    <div className="homePage">
      {/* Top section: logo and settings/volume icons */}
      <div className="homeTopBar">
        <div className="homeLogo">
          <img src="/LOGO.png" alt="Boggle Logo" className="BoggleLogoImage" />
        </div>

        <div className="homeIcons">
          <img src="/Volume.png" alt="volume" className="VolumeImage" />
          <img src="/SettingBox.png" alt="settings" className="SettingImage" />
        </div>
      </div>

      {/* Middle section: main navigation buttons */}
      <div className="homeButtonRow">
        <button className="homeMainButton" onClick={store}>
          STORE
        </button>

        <button className="homeMainButton" onClick={singlePlayer}>
          SINGLE
          <br />
          PLAYER
        </button>

        <button className="homeMainButton" onClick={multiplayer}>
          MULTIPLAYER
        </button>

        <button className="homeMainButton" onClick={stats}>
          STATISTICS
        </button>
      </div>

      {/* Bottom section: merch promotion and donation button */}
      <div className="homeBottomSection">
        <div className="merchBurst">
          <div>
            <br />
            NEW MERCH
            <br />
            IN STORE
            <br />
            !!!
          </div>
        </div>

        <div className="BingBongArea">
          <img src="/BingBong.png" alt="BingBong" className="BingBongImage" />
        </div>

        <button className="supportButton">SUPPORT US!</button>
      </div>
    </div>
  );
}
