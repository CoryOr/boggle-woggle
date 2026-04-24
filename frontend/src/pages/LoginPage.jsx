/**
 * Page where users who have already registered can login to their account
 */

import LoginForm from "../components/LoginForm/LoginForm";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AudioContext } from "../contexts/AudioContext/AudioContextContext";

const LoginPage = () => {
  const nav = useNavigate();
  const { playSfx } = useContext(AudioContext);

  const goHome = () => {
    playSfx("/sounds/click.wav");
    nav("/");
  };

  return (
    <div className="loginPage">
      <button className="stats-back-btn" onClick={goHome}>
        <div className="stats-back-arrow">←</div>
        BACK
      </button>
      <LoginForm />
    </div>
  );
};

export default LoginPage;