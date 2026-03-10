/**
 * Tile component displaying a single letter on the game board
 * 
 * @param {string} letter - The letter to display on this tile
 * @returns a styled tile with the given letter
 */

const LetterTile = ({letter}) => {
    return (
        <div className="letter-tile">
            <p>{letter}</p>
        </div>
    )
}

export default LetterTile;