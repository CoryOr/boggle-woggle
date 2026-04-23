import { useState, useRef, useEffect, useContext } from "react";
import LetterTile from "./LetterTile";
import { CurrentGameContext } from "../../contexts/CurrentGameContext/CurrentGameContext.jsx";
import "./GameBoard.css";
import socketService from "../../websocket/WebSocketService.js";

/**
 * Renders the main game board and handles drag-to-select interaction logic.
 * Players can click and drag across letter tiles to form words.
 * The current selection is synced globally via CurrentGameContext so it can
 * be displayed simultaneously in the WordInput component.
 * * @component
 * @param {Object} props - The component props.
 * @param {string[][]} props.board - A 2D array representing the grid of letters.
 * @param {Function} props.updateScore - Callback function triggered when a valid word is submitted.
 * * @context {CurrentGameContext} Uses gameId for API submission, and currentGuess/setCurrentGuess to sync UI.
 */
const GameBoard = ({ board, updateScore, updatePlayerScores, roomCode, username }) => {
  // Local state for the physical tiles currently highlighted
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [svgPoints, setSvgPoints] = useState(null);

  // Global state synced with WordInput
  const { gameId, setCurrentGuess, foundWords, setFoundWords, setInvalidWord } =
    useContext(CurrentGameContext);

  const isDraggingRef = useRef(false);
  const selectedTilesRef = useRef([]);
  const tileRefs = useRef({});
  const boardRef = useRef(null);

  const getTileKey = (row, col) => `${row}-${col}`;

  const isTileSelected = (row, col) =>
    selectedTiles.some((t) => t.row === row && t.col === col);

  const getSelectionIndex = (row, col) =>
    selectedTiles.findIndex((t) => t.row === row && t.col === col);

  /**
   * Helper function to calculate SVG lines.
   */
  const updateSvgLines = (tiles) => {
    if (!boardRef.current || tiles.length < 2) {
      setSvgPoints(null);
      return;
    }
    const boardRect = boardRef.current.getBoundingClientRect();
    const points = tiles
      .map((t) => {
        const el = tileRefs.current[getTileKey(t.row, t.col)];
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: r.left - boardRect.left + r.width / 2,
          y: r.top - boardRect.top + r.height / 2,
        };
      })
      .filter(Boolean);
    setSvgPoints(points.length >= 2 ? points : null);
  };

  /**
   * Initializes the drag sequence when a user clicks on a tile.
   */
  const handleTileMouseDown = (e, row, col, letter) => {
    e.preventDefault();
    const initial = [{ row, col, letter }];
    isDraggingRef.current = true;
    selectedTilesRef.current = initial;
    setSelectedTiles(initial);

    setCurrentGuess(letter.toUpperCase());
    updateSvgLines(initial);
  };

  /**
   * Continues the drag sequence as the mouse enters new tiles.
   * Enforces rules: cannot revisit tiles, must be adjacent to the last tile.
   */
  const handleTileMouseEnter = (row, col, letter) => {
    if (!isDraggingRef.current) return;
    const current = selectedTilesRef.current;

    if (current.some((t) => t.row === row && t.col === col)) return;

    const last = current[current.length - 1];
    const isAdjacent =
      Math.abs(last.row - row) <= 1 && Math.abs(last.col - col) <= 1;

    if (isAdjacent) {
      const updated = [...current, { row, col, letter }];
      selectedTilesRef.current = updated;
      setSelectedTiles(updated);

      setCurrentGuess(
        updated
          .map((t) => t.letter)
          .join("")
          .toUpperCase()
      );
      updateSvgLines(updated);
    }
  };

  /**
   * Global mouse up listener ensures the drag ends even if the user releases
   * their mouse while outside the boundaries of the game board.
   */
  useEffect(() => {
    const handleMouseUp = () => {
      if (!isDraggingRef.current) return;

      const tiles = selectedTilesRef.current;
      isDraggingRef.current = false;
      selectedTilesRef.current = [];
      setSelectedTiles([]);
      setSvgPoints(null);

      if (tiles.length < 2) {
        setCurrentGuess("");
        return;
      }

      const guess = tiles
        .map((t) => t.letter)
        .join("")
        .toLowerCase();

      // Instantly clear the UI text box so it feels responsive
      setCurrentGuess("");

      // Prevent submitting words already found
      if (foundWords.has(guess)) {
        setInvalidWord(guess.toUpperCase());
        setCurrentGuess("");
        return;
      }

      fetch("/api/game/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, guess }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            updateScore(data.score);
            if (updatePlayerScores) updatePlayerScores(data.score);
            if (roomCode && username) socketService.broadcastPlayerScore(roomCode, username, data.score);
            setFoundWords((prev) => new Set(prev).add(guess));
            setInvalidWord(null);
          } else {
            setInvalidWord(guess.toUpperCase());
          }
        })
        .catch((err) => console.error("Error submitting guess:", err));
    };

    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [
    gameId,
    updateScore,
    setCurrentGuess,
    foundWords,
    setFoundWords,
    setInvalidWord,
    roomCode,
    username,
    updatePlayerScores
  ]);

  return (
    <div className="gameboard-wrapper">
      <div
        id="gameboard"
        ref={boardRef}
        onDragStart={(e) => e.preventDefault()}
      >
        {svgPoints && svgPoints.length >= 2 && (
          <svg className="tile-connection-svg" aria-hidden="true">
            <polyline
              points={svgPoints.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="rgba(255, 220, 0, 0.9)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="gameboard-row">
            {row.map((letter, colIndex) => (
              <LetterTile
                letter={letter}
                key={colIndex}
                isSelected={isTileSelected(rowIndex, colIndex)}
                selectionIndex={getSelectionIndex(rowIndex, colIndex)}
                onMouseDown={(e) =>
                  handleTileMouseDown(e, rowIndex, colIndex, letter)
                }
                onMouseEnter={() =>
                  handleTileMouseEnter(rowIndex, colIndex, letter)
                }
                tileRef={(el) =>
                  (tileRefs.current[getTileKey(rowIndex, colIndex)] = el)
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
