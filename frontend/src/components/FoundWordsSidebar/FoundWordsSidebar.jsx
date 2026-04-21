import React, { useContext } from "react";
import { CurrentGameContext } from "../../contexts/CurrentGameContext/CurrentGameContext.jsx";
import "./FoundWordsSidebar.css";

/**
 * Renders a sidebar displaying the list of words the player has successfully found.
 * Dynamically updates as new words are added to the global context.
 * * @component
 * @context {CurrentGameContext} Uses foundWords (Set) to display the currently valid guessed words.
 */
export default function FoundWordsSidebar() {
    // Global state synced across the game page
    const { foundWords } = useContext(CurrentGameContext);

    // Convert the Set/HashSet from context into an array so React can map over it.
    //Also sort it alphabetically so it looks clean for the user.
    const wordsArray = foundWords ? Array.from(foundWords).sort() : [];

    return (
        <div className="found-words-sidebar">
            <h3 className="found-words-title">Found Words ({wordsArray.length})</h3>

            <div className="words-list-container">
                {wordsArray.length === 0 ? (
                    <p className="no-words-msg">No words found yet.</p>
                ) : (
                    <ul className="words-list">
                        {wordsArray.map((word, index) => (
                            <li key={index} className="word-item">
                                {word}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}