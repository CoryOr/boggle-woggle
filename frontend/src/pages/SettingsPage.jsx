/**
 * SettingsPage.jsx
 * Page that stores user settings. Has zero functionality currently. To be implemented...
 */

import { useContext } from "react";
import { UserContext } from "../contexts/UserContext/UserContext";
import { AudioContext } from "../contexts/AudioContext/AudioContextContext";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const { username, logout, isLoggedIn } = useContext(UserContext);
  const {
    muted,
    toggleMute,
    masterVolume,
    musicVolume,
    sfxVolume,
    setMasterVolume,
    setMusicVolume,
    setSfxVolume,
    playSfx,
  } = useContext(AudioContext);

  const nav = useNavigate();

  function goHome() {
    playSfx("/sounds/click.wav");
    nav("/");
  }

  function handleLogout() {
    playSfx("/sounds/click.wav");
    logout();
    nav("/");
  }

  function handleToggleMute() {
    playSfx("/sounds/click.wav");
    toggleMute();
  }

  return (
    <>
      <button className="stats-back-btn" onClick={goHome}>
        <div className="stats-back-arrow">←</div>
        BACK
      </button>

      <h1 className="title">Settings</h1>
      <h2>Username: {username ?? "Guest"}</h2>

      <div style={{ maxWidth: "500px", margin: "2rem auto" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <button onClick={handleToggleMute}>
            {muted ? "Unmute Audio" : "Mute Audio"}
          </button>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="master-volume">
            Master Volume: {Math.round(masterVolume * 100)}%
          </label>
          <input
            id="master-volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={masterVolume}
            onChange={(e) => setMasterVolume(e.target.value)}
            style={{ display: "block", width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="music-volume">
            Music Volume: {Math.round(musicVolume * 100)}%
          </label>
          <input
            id="music-volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={musicVolume}
            onChange={(e) => setMusicVolume(e.target.value)}
            style={{ display: "block", width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="sfx-volume">
            SFX Volume: {Math.round(sfxVolume * 100)}%
          </label>
          <input
            id="sfx-volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={sfxVolume}
            onChange={(e) => setSfxVolume(e.target.value)}
            style={{ display: "block", width: "100%" }}
          />
        </div>

        {isLoggedIn && (
          <div style={{ marginTop: "2rem" }}>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </div>
    </>
  );
}