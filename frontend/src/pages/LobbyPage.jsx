/**
 * Placeholder page that will eventually be how we implement multiplayer. The current idea is to generate some kind
 * of unique lobby code that can then be shared so multiplayer can work properly, but this is TBD, pending the research
 * report for an issue that is currently up on Gitlab.
 */

import { useNavigate } from "react-router-dom";
import "./Pages.css";

export default function LobbyPage() {
  const nav = useNavigate();

  return (
    <>
      <button className="stats-back-btn" onClick={() => nav("/game-select")}>
        <div className="stats-back-arrow">←</div>
        BACK
      </button>
      <h1 className="title">Lobby Page coming soon</h1>
    </>
  );
}
