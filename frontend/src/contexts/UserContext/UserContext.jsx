import { useEffect } from "react";
import { UserContext, useInitialUserState } from "./UserContext";

export function UserProvider({ children }) {
    const {
        id, setId,
        username, setUsername,
        highScore, setHighScore,
        longestWord, setLongestWord,
        gamesPlayed, setGamesPlayed,
        isLoggedIn, setIsLoggedIn,
    } = useInitialUserState();

    // On mount, check if a session already exists (e.g. cookie/token)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        fetch("/api/users/me", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error("Not authenticated");
                return res.json();
            })
            .then((data) => {
                setId(data.id);
                setUsername(data.username);
                setHighScore(data.highScore);
                setLongestWord(data.longestWord);
                setGamesPlayed(data.gamesPlayed);
                setIsLoggedIn(true);
            })
            .catch(() => {
                setIsLoggedIn(false);
            });
    }, [setId, setUsername, setHighScore, setLongestWord, setGamesPlayed, setIsLoggedIn]);

    // Call this after a successful login form submission
    function login(userData) {
        localStorage.setItem("token", userData.accessToken);
        setId(userData.id);
        setUsername(userData.username);
        setHighScore(userData.highScore);
        setLongestWord(userData.longestWord);
        setGamesPlayed(userData.gamesPlayed);
        setIsLoggedIn(true);
    }

    // Call this to log the user out
    function logout() {
        localStorage.removeItem("token");
        setId(null);
        setUsername(null);
        setHighScore(0);
        setLongestWord(null);
        setGamesPlayed(0);
        setIsLoggedIn(false);
    }

    return (
        <UserContext.Provider value={{
            id,
            username,
            highScore, setHighScore,
            longestWord, setLongestWord,
            gamesPlayed, setGamesPlayed,
            isLoggedIn,
            login,
            logout,
        }}>
            {children}
        </UserContext.Provider>
    );
}