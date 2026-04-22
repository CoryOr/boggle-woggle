/**
 * Store page containing microtransactions. We ain't actually developing this page
 */

import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AudioContext } from "../contexts/AudioContext/AudioContextContext";

export default function StorePage() {
  const nav = useNavigate();
  const { playSfx, startMusic } = useContext(AudioContext);

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
      <h1 className="title">This is the store!</h1>
    </>
  );
}