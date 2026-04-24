import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext/UserContext";
import { AudioContext } from "../contexts/AudioContext/AudioContextContext";
import StatsComponent from "../components/StatsPage/StatsComponent";

export default function StatsPage() {
  const nav = useNavigate();
  const { isLoggedIn } = useContext(UserContext);
  const { playSfx } = useContext(AudioContext);

  const goHome = () => {
    playSfx("/sounds/click.wav");
    nav("/");
  };

  const goLogin = () => {
    playSfx("/sounds/click.wav");
    nav("/login");
  };

  const titleStyle = {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: "600",
    color: 'white'
  };

  return (
    <>
      <button className="stats-back-btn" onClick={goHome}>
        <div className="stats-back-arrow">←</div>
        BACK
      </button>

      <h1 style={titleStyle}>STATISTICS</h1>

      {!isLoggedIn ? (
        <div className="guest-stats-message">
          <h2>Statistics are unavailable for guests</h2>
          <p>Please log in to view your game statistics.</p>
          <button className="btn" onClick={goLogin}>
            Log In
          </button>
        </div>
      ) : (
        <StatsComponent />
      )}
    </>
  );
}