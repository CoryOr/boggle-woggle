export default function CurrentScore({ score }) {
  return (
    <div className="score-container">
      <p className="game-page-text">Score: {score}</p>
    </div>
  );
}
