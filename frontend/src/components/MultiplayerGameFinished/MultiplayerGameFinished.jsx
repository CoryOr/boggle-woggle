/**
 * MultiplayerGameFinished.jsx
 * End-of-game screen for multiplayer. Displays:
 *   - Winner announcement (or tie)
 *   - Full ranked leaderboard with scores & word counts
 *   - The current user's own found-words list
 * Props:
 *   playerScores     {Object}   { username: score }
 *   playerFoundWords {Object}   { username: string[] }
 *   currentUsername  {string}
 *   onGoHome         {Function}
 * @author Nicholas DiCristo, Alexander Ordonez
 */

import "./MultiplayerGameFinished.css";
import { useContext, useEffect } from "react";
import { AudioContext } from "../../contexts/AudioContext/AudioContextContext";

export default function MultiplayerGameFinished({
  playerScores = {},
  playerFoundWords = {},
  currentUsername,
  onGoHome,
}) {
  const { playSfx } = useContext(AudioContext);

  // Build a sorted leaderboard array
  const leaderboard = Object.entries(playerScores)
    .map(([username, score]) => ({
      username,
      score,
      wordCount: (playerFoundWords[username] ?? []).length,
    }))
    .sort((a, b) => b.score - a.score);

  const topScore = leaderboard[0]?.score ?? 0;
  const winners = leaderboard
    .filter((p) => p.score === topScore)
    .map((p) => p.username);

  const isTie = winners.length > 1;
  const isWinner = winners.includes(currentUsername);

  const myWords = [...(playerFoundWords[currentUsername] ?? [])].sort();
  const myRank = leaderboard.findIndex((p) => p.username === currentUsername) + 1;

  const MEDAL = ["🥇", "🥈", "🥉"];

  useEffect(() => {
    if (isWinner) {
      playSfx("/sounds/Winner.mp3");
    } else {
      playSfx("/sounds/game-over.wav");
    }
  }, [isWinner, playSfx]);

  return (
    <div className="mpgf-container">
      {/* ── Winner Banner ── */}
      <div className="mpgf-winner-banner">
        <span className="mpgf-trophy">🏆</span>
        <h1 className="mpgf-winner-text">
          {isTie
            ? `It's a tie! ${winners.join(" & ")}`
            : `${winners[0]} wins!`}
        </h1>
        <span className="mpgf-trophy">🏆</span>
      </div>

      {/* ── Leaderboard ── */}
      <div className="mpgf-leaderboard">
        <h2 className="mpgf-section-title">Leaderboard</h2>
        <ol className="mpgf-board-list">
          {leaderboard.map((player, idx) => {
            const isMe = player.username === currentUsername;
            return (
              <li
                key={player.username}
                className={`mpgf-board-row${isMe ? " mpgf-board-row--me" : ""}`}
              >
                <span className="mpgf-rank">
                  {MEDAL[idx] ?? `#${idx + 1}`}
                </span>
                <span className="mpgf-board-name">
                  {player.username}
                  {isMe && <span className="mpgf-you-tag">you</span>}
                </span>
                <span className="mpgf-board-words">{player.wordCount}w</span>
                <span className="mpgf-board-score">{player.score} pts</span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* ── My stats strip ── */}
      {currentUsername && (
        <div className="mpgf-my-stats">
          <span>
            Your rank: <strong>#{myRank}</strong>
          </span>
          <span>
            Your score: <strong>{playerScores[currentUsername] ?? 0} pts</strong>
          </span>
          <span>
            Words found: <strong>{myWords.length}</strong>
          </span>
        </div>
      )}

      {/* ── My found words ── */}
      {currentUsername && (
        <div className="mpgf-words-card">
          <p className="mpgf-words-card-title">Your words</p>
          {myWords.length === 0 ? (
            <p className="mpgf-no-words">No words found this round.</p>
          ) : (
            <ul className="mpgf-word-list">
              {myWords.map((word) => (
                <li key={word} className="mpgf-word-item">
                  {word}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button
        className="mpgf-home-button"
        onClick={() => {
          playSfx("/sounds/click.wav");
          onGoHome();
        }}
      >
        Go Home
      </button>
    </div>
  );
}