import { useState, useEffect } from "react";
import "./StatsComponent.css";

export default function StatisticsGrid() {
  const [visible, setVisible] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        const winPercent = data.gamesPlayed === 0
          ? "N/A"
          : `${Math.round((data.gamesWon / data.gamesPlayed) * 100)}%`;

        const statsData = [
          { label: "WIN PERCENTAGE",        value: winPercent },
          { label: "GAMES PLAYED",          value: data.gamesPlayed },
          { label: "ALL-TIME LONGEST WORD", value: data.longestWord ?? "N/A" },
          { label: "ALL-TIME HIGH SCORE",   value: data.highScore },
        ];

        setStats(statsData);

        // Trigger animations after data loads
        statsData.forEach((_, i) => {
          setTimeout(() => {
            setVisible((prev) => [...prev, i]);
          }, 150 * i);
        });
      })
      .catch((err) => console.error("Failed to load stats:", err));
  }, []);

  return (
    <div className="stats-wrapper">
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`stats-row ${visible.includes(i) ? "visible" : ""}`}
          >
            <span className="stats-label">{stat.label}:</span>
            <div className="stats-value-pill">
              <span className="stats-value-text">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}