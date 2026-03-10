import { useState, useEffect } from "react";
import "./StatsComponent.css";

const DOTS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 3,
  top: Math.random() * 100,
  left: Math.random() * 100,
}));

const stats = [
  { label: "WIN/LOSE RATIO", value: "47%" },
  { label: "TOTAL TIME PLAYED", value: "1D 02H 30M" },
  { label: "ALL-TIME LONGEST WORD", value: "BINGBONG" },
  { label: "ALL-TIME HIGH SCORE", value: "2002" },
];

export default function StatisticsGrid() {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    stats.forEach((_, i) => {
      setTimeout(() => {
        setVisible((prev) => [...prev, i]);
      }, 150 * i);
    });
  }, []);

  return (
    <div className="stats-wrapper">
      {/* Stats grid */}
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