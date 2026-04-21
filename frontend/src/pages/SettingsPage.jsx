/**
 * SettingsPage.jsx
 * Page for user settings, including global audio controls.
 */

import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext/UserContext";
import { AudioContext } from "../contexts/AudioContext/AudioContextContext";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const { username } = useContext(UserContext);
  const { muted, toggleMute, volume, setVolume, playSfx, startMusic } =
    useContext(AudioContext);
  const nav = useNavigate();

  useEffect(() => {
    startMusic("/sounds/menu-music.mp3");
  }, [startMusic]);

  return (
    <>
      <button
        className="stats-back-btn"
        onClick={() => {
          playSfx("/sounds/click.wav");
          nav("/");
        }}
      >
        <div className="stats-back-arrow">←</div>
        BACK
      </button>

      <h1 className="title">Settings for: {username}</h1>

      <div style={{ padding: "1rem" }}>
        <h2>Audio Settings</h2>

        <p>Audio is currently: {muted ? "Muted" : "On"}</p>

        <button
          onClick={() => {
            playSfx("/sounds/click.wav");
            toggleMute();
          }}
        >
          {muted ? "Unmute Audio" : "Mute Audio"}
        </button>

        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="volume-slider">
            Volume: {Math.round(volume * 100)}%
          </label>
          <br />
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          />
        </div>
      </div>
    </>
  );
}