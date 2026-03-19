/**
 * Timer.jsx
 * 
 * This file contains the timer code displayed to the screen in GamePage.jsx
 * 
 * @author Luke Defrance
 */

import { FaHourglass } from "react-icons/fa";
import "./Timer.css";

export default function Timer({ timeLeft }) {
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className="timer-container">
            <FaHourglass size="3rem" />
            <p className="game-page-text">{formatTime(timeLeft)}</p>
        </div>
    );
}