import { useEffect } from "react";
import { UserContext, useInitialUserState } from "./UserContext";

export function UserProvider({ children }) {
    const {
        id, setId,
        username, setUsername,
        avatar, setAvatar,
        highScore, setHighScore,
        longestWord, setLongestWord,
        gamesPlayed, setGamesPlayed,
        isLoggedIn, setIsLoggedIn,
    } = useInitialUserState();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        fetch("/api/users/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error("Not authenticated");
                return res.json();
            })
            .then((data) => {
                setId(data.id);
                setUsername(data.username);
                setAvatar(data.avatar);
                setHighScore(data.highScore);
                setLongestWord(data.longestWord);
                setGamesPlayed(data.gamesPlayed);
                setIsLoggedIn(true);
            })
            .catch(() => {
                localStorage.removeItem("token");
                setId(null);
                setUsername(null);
                setAvatar(null);
                setHighScore(0);
                setLongestWord(null);
                setGamesPlayed(0);
                setIsLoggedIn(false);
            });
    }, [setId, setUsername, setHighScore, setLongestWord, setGamesPlayed, setIsLoggedIn]);

    function login(userData) {
        if (userData.accessToken) {
          localStorage.setItem("token", userData.accessToken);
        }

        setId(userData.id ?? null);
        setUsername(userData.username ?? null);
        setAvatar(userData.avatar ?? null);
        setHighScore(userData.highScore ?? 0);
        setLongestWord(userData.longestWord ?? null);
        setGamesPlayed(userData.gamesPlayed ?? 0);
        setIsLoggedIn(true);
    }

    function logout() {
        localStorage.removeItem("token");
        setId(null);
        setUsername(null);
        setAvatar(null);
        setHighScore(0);
        setLongestWord(null);
        setGamesPlayed(0);
        setIsLoggedIn(false);
    }

    return (
        <UserContext.Provider value={{
            id,
            username,
            avatar,
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