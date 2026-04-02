export const GameHeader = ({
  score,
  moves,
  difficulty,
  onToggleDifficulty,
}) => {
  return (
    <div className="game-header">
      <h1>Memory Card Game</h1>
      <div className="stats">
        <button
          className={`difficulty-btn ${difficulty}`}
          onClick={onToggleDifficulty}>
          {difficulty === "easy"
            ? "Harder mode (32 cards)"
            : "Easy mode (16 cards)"}
        </button>
        <div className="stat-item">
          <span className="stat-label">Score:</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Moves:</span>
          <span className="stat-value">{moves}</span>
        </div>
      </div>
    </div>
  );
};
