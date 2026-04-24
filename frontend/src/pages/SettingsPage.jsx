/**
 * SettingsPage.jsx
 * Page that stores user settings. Has zero functionality currently. To be implemented...
 */

import { useContext } from "react";
import { UserContext } from "../contexts/UserContext/UserContext";
import { AudioContext } from "../contexts/AudioContext/AudioContextContext";
import { useNavigate } from "react-router-dom";
import "./Pages.css";
import "./SettingsPage.css";

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
      <button className="stats-back-btn settings-back-btn" onClick={goHome}>
        <div className="stats-back-arrow">←</div>
        BACK
      </button>

      <div className="settings-page">
        <h1 className="title settings-title">Settings</h1>

        <div className="settings-card">
          <h2 className="settings-username">
            Username: {username ?? "Guest"}
          </h2>

          <button className="btn settings-mute-btn" onClick={handleToggleMute}>
            {muted ? "Unmute Audio" : "Mute Audio"}
          </button>

          <div className="settings-slider-group">
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
            />
          </div>

          <div className="settings-slider-group">
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
            />
          </div>

          <div className="settings-slider-group">
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
            />
          </div>

          {isLoggedIn && (
            <button className="btn settings-logout-btn" onClick={handleLogout}>
              Log Out
            </button>
          )}
        </div>
      </div>
    </>
  );
}