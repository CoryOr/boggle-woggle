/**
 * Page where users who have already registered can login to their account
 */

import LoginForm from "../components/LoginForm/LoginForm";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AudioContext } from "../contexts/AudioContext/AudioContext";

const LoginPage = () => {
  const nav = useNavigate();
  const { playSfx, startMusic } = useContext(AudioContext);

  useEffect(() => {
    startMusic("/sounds/menu-music.mp3");
  }, [startMusic]);

  return (
    <div className="loginPage">
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
      <LoginForm />
    </div>
  );
};

export default LoginPage;