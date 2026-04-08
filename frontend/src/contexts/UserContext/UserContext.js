import { createContext, useState } from "react";

export const UserContext = createContext(null);

export function useInitialUserState() {
    const [id, setId] = useState(null);
    const [username, setUsername] = useState(null);
    const [highScore, setHighScore] = useState(0);
    const [longestWord, setLongestWord] = useState(null);
    const [gamesPlayed, setGamesPlayed] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [avatar, setAvatar] = useState(null);

    return {
        id, setId,
        username, setUsername,
        avatar, setAvatar,
        highScore, setHighScore,
        longestWord, setLongestWord,
        gamesPlayed, setGamesPlayed,
        isLoggedIn, setIsLoggedIn,
    };
}