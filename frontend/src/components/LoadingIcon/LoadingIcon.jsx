/**
 * Contains animated letters and an ellipses(...) that make the loading screen a bit more appealing
 */

import './LoadingIcon.css';

const letters = ['B', 'O', 'G', 'G', 'L', 'E', 'W', 'O', 'G'];

const LoadingIcon = () => (
  <div className="loading-wrapper">
      {/* B O G */}
      {/* G L E */}
      {/* W O G */}
    <div className="loading-grid">
      {letters.map((letter, i) => (
        <div
          key={i}
          className={`loading-tile${letter === 'L' ? ' white' : ''}`}
          style={{ animationDelay: `${(i * 0.13).toFixed(2)}s` }}
        >
          {letter}
        </div>
      ))}
    </div>
    {/* Setting things up ...  */}
    <div className="loading-message">
      Setting things up
      <span className="loading-dot">.</span>
      <span className="loading-dot">.</span>
      <span className="loading-dot">.</span>
    </div>
  </div>
);

export default LoadingIcon;