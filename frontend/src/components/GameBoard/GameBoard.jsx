import { useState, useRef, useEffect, useContext } from "react";
import LetterTile from "./LetterTile";
import { CurrentGameContext } from "../../contexts/CurrentGameContext/CurrentGameContext.jsx";
import { AudioContext } from "../../contexts/AudioContext/AudioContextContext";
import "./GameBoard.css";

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
const GameBoard = ({ board, updateScore }) => {
    // Stores the currently highlighted tiles during a drag action
    const [selectedTiles, setSelectedTiles] = useState([]);

    // Stores the line coordinates used to draw the selection path
    const [svgPoints, setSvgPoints] = useState(null);

    // Shared game state from context
    const {
        gameId,
        setCurrentGuess,
        foundWords,
        setFoundWords,
        setInvalidWord
    } = useContext(CurrentGameContext);

    // Shared audio helper from context
    const { playSfx } = useContext(AudioContext);

    // Ref that tracks whether the user is actively dragging
    const isDraggingRef = useRef(false);

    // Ref copy of selected tiles so the mouseup handler can read the latest drag state
    const selectedTilesRef = useRef([]);

    // Stores DOM refs for each tile so line positions can be calculated
    const tileRefs = useRef({});

    // Ref to the overall board container
    const boardRef = useRef(null);

    // Creates a unique key for a tile based on row/column
    const getTileKey = (row, col) => `${row}-${col}`;

    // Returns true if a tile is currently selected
    const isTileSelected = (row, col) =>
        selectedTiles.some((t) => t.row === row && t.col === col);

    // Returns the order in which a tile was selected, used for visual styling
    const getSelectionIndex = (row, col) =>
        selectedTiles.findIndex((t) => t.row === row && t.col === col);

    /**
     * Calculates the points used for the SVG line that connects dragged tiles.
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
     * Starts a drag sequence when the user presses down on a letter tile.
     * The first tile becomes the initial selection.
     */
    const handleTileMouseDown = (e, row, col, letter) => {
        e.preventDefault();

        const initial = [{ row, col, letter }];

        isDraggingRef.current = true;
        selectedTilesRef.current = initial;
        setSelectedTiles(initial);

        // Sync the dragged letters with the shared input box
        setCurrentGuess(letter.toUpperCase());
        updateSvgLines(initial);
    };

    /**
     * Adds a tile to the drag selection when the mouse enters it.
     * A tile can only be added if:
     * 1) the user is dragging
     * 2) the tile has not already been selected
     * 3) the tile is adjacent to the last selected tile
     */
    const handleTileMouseEnter = (row, col, letter) => {
        if (!isDraggingRef.current) return;

        const current = selectedTilesRef.current;

        // Prevent reusing the same tile in one word
        if (current.some((t) => t.row === row && t.col === col)) return;

        const last = current[current.length - 1];

        const isAdjacent =
            Math.abs(last.row - row) <= 1 && Math.abs(last.col - col) <= 1;

        if (isAdjacent) {
            const updated = [...current, { row, col, letter }];
            selectedTilesRef.current = updated;
            setSelectedTiles(updated);

            // Update the visible guess shown in the shared input field
            setCurrentGuess(updated.map((t) => t.letter).join("").toUpperCase());
            updateSvgLines(updated);
        }
    };

    /**
     * Global mouseup listener:
     * - ends the drag action
     * - builds the final guessed word
     * - submits the word to the backend
     * - plays valid/invalid sound effects depending on the result
     *
     * This listener is global so the drag still finishes even if the user
     * releases the mouse outside the board.
     */
    useEffect(() => {
        const handleMouseUp = () => {
            // Ignore mouseup if the user was not dragging
            if (!isDraggingRef.current) return;

            const tiles = selectedTilesRef.current;

            // Reset drag state immediately
            isDraggingRef.current = false;
            selectedTilesRef.current = [];
            setSelectedTiles([]);
            setSvgPoints(null);

            // Ignore guesses shorter than 2 letters
            if (tiles.length < 2) {
                setCurrentGuess("");
                return;
            }

            // Build the final guessed word from the dragged tiles
            const guess = tiles.map((t) => t.letter).join("").toLowerCase();

            // Clear the shared input display right away so the UI feels responsive
            setCurrentGuess("");

            // If the word was already found, mark it invalid and play invalid sound
            if (foundWords.has(guess)) {
                setInvalidWord(guess.toUpperCase());
                playSfx("/sounds/invalid.wav");
                return;
            }

            // Submit the dragged word to the backend for validation
            fetch("/api/game/guess", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ gameId, guess }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.valid) {
                        // Valid guess:
                        // - increase score
                        // - store the word in foundWords
                        // - clear invalid message
                        // - play success sound
                        updateScore(data.score);
                        setFoundWords((prev) => new Set(prev).add(guess));
                        setInvalidWord(null);
                        playSfx("/sounds/valid.wav");
                    } else {
                        // Invalid guess:
                        // - show invalid message
                        // - play invalid sound
                        setInvalidWord(guess.toUpperCase());
                        playSfx("/sounds/invalid.wav");
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
        playSfx,
    ]);

    return (
        <div className="gameboard-wrapper">
            <div
                id="gameboard"
                ref={boardRef}
                onDragStart={(e) => e.preventDefault()}
            >
                {/* Draw the selection path between dragged tiles */}
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

                {/* Render each row and letter tile in the board */}
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