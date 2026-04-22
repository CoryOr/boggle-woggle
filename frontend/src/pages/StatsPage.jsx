import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext/UserContext";
import { AudioContext } from "../contexts/AudioContext/AudioContextContext";
import StatsComponent from "../components/StatsPage/StatsComponent";

export default function StatsPage() {
  const nav = useNavigate();
  const { isLoggedIn } = useContext(UserContext);
  const { playSfx, startMusic } = useContext(AudioContext);

  useEffect(() => {
    startMusic("/sounds/menu-music.mp3");

    if (!isLoggedIn) {
      nav("/login");
    }
  }, [isLoggedIn, nav, startMusic]);

  const goHome = () => {
    playSfx("/sounds/click.wav");
    nav("/");
  };

  const titleStyle = {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: "600",
  };

  return (
    <>
      <button className="stats-back-btn" onClick={goHome}>
        <div className="stats-back-arrow">←</div>
        BACK TO HOME
      </button>
      <h1 style={titleStyle}>STATISTICS</h1>
      <StatsComponent />
    </>
  );
}