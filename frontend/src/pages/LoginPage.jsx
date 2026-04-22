/**
 * Page where users who have already registered can login to their account
 */

import LoginForm from "../components/LoginForm/LoginForm";
import "./Pages.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
const nav = useNavigate();

  return (
    <div className="loginPage">
      <button className="stats-back-btn" onClick={() => nav("/")}>
        <div className="stats-back-arrow">←</div>
        BACK
      </button>
      <LoginForm />
    </div>
  );
};

export default LoginPage;