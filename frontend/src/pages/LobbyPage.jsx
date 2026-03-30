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
