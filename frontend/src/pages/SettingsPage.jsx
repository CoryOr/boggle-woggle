/**
 * Page that stores user settings. Has zero functionality currently. To be implemented...
 */

import { useContext } from "react";
import { UserContext } from "../contexts/UserContext/UserContext";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const { username } = useContext(UserContext);
  const nav = useNavigate();

  return (
    <>
      <button className="stats-back-btn" onClick={() => nav("/")}>
        <div className="stats-back-arrow">←</div>
        BACK
      </button>
      <h1 className="title">Username is: {username}</h1>
    </>
  );
}
