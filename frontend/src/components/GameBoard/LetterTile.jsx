/**
 * A  presentational component displaying a single letter on the game board.
 * Receives mouse event handlers from GameBoard to facilitate drag-to-select logic.
 * * @component
 * @param {Object} props - The component props.
 * @param {string} props.letter - The character to display on this tile.
 * @param {boolean} props.isSelected - Determines if the tile receives the highlighted 'selected' CSS class.
 * @param {number} props.selectionIndex - The index of this tile in the current drag chain (0 is the starting tile).
 * @param {Function} props.onMouseDown - Handler triggered when the user clicks down on this specific tile.
 * @param {Function} props.onMouseEnter - Handler triggered when the user drags their mouse into this tile.
 * @param {Function} props.tileRef - A callback ref used by GameBoard to calculate SVG line coordinates.
 * * @returns {JSX.Element} A styled, interactive tile.
 */
const LetterTile = ({
                        letter,
                        isSelected,
                        selectionIndex,
                        onMouseDown,
                        onMouseEnter,
                        tileRef,
                    }) => {
    const isFirst = selectionIndex === 0;

    return (
        <div
            ref={tileRef}
            className={`letter-tile${isSelected ? " letter-tile--selected" : ""}${isFirst ? " letter-tile--first" : ""} no-select-tile`}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            draggable={false}
        >
            <p>{letter}</p>
        </div>
    );
};

export default LetterTile;