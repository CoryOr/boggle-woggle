/**
 * GameFinished.jsx
 * 
 * This file contains the GameFinished code displayed to the screen after the timer runs out in GamePage.jsx
 * 
 * @author Luke Defrance
 */

import "./GameFinished.css";

export default function GameFinished({ onGoHome }) {
    return (
        <div className="game-finished-container">
            <h1 className="title game-finished-title">Game Over</h1>
            <button className="navButton" onClick={onGoHome}>Go Home</button>
        </div>
    );
}