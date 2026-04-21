import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RoomCodeCard from "../components/MultiplayerLobbyComponents/RoomCodeCard";
import PlayerCards from "../components/MultiplayerLobbyComponents/PlayerCards";
import { Card, Button } from "react-bootstrap";
import socketService from "../websocket/WebSocketService";
import { UserContext } from "../contexts/UserContext/UserContext";
import "./Pages.css";

/**
 * LobbyPage.jsx
 *
 * Multiplayer lobby. Players join, toggle ready, and the host starts the game.
 *
 * When the host clicks Start Game:
 *  1. Host publishes { roomCode } to /app/room.start via WebSocket
 *  2. Server generates a board and broadcasts MultiplayerGameState to
 *     /room/{roomCode}/start
 *  3. All clients receive it here and navigate to /lobby/:roomCode/game
 *     with players, gameId, and board in router state
 *  4. MultiplayerGamePage reconnects fresh after a short delay
 */
export default function LobbyPage() {
    const nav = useNavigate();
    const [players, setPlayers] = useState([]);
    const [isStarting, setIsStarting] = useState(false);
    const { roomCode } = useParams();
    const { username, isLoggedIn } = useContext(UserContext);

    // Derived state
    const currentUser = players.find((p) => p.username === username);
    const isHost = currentUser?.isHost || false;
    const isReady = currentUser?.isReady || false;
    const allPlayersReady = players.length > 0 && players.every((p) => p.isReady);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!isLoggedIn) nav("/login");
    }, [isLoggedIn, nav]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!roomCode || !username) return;

        socketService.connect(
            roomCode,
            username,
            (data) => {
                if (data.gameId && data.board) {
                    nav(`/lobby/${roomCode}/game`, {
                        state: { players, gameId: data.gameId, board: data.board },
                    });
                    return;
                }
                if (data.players) setPlayers(data.players);
            },
            null
        );

        return () => {
            socketService.disconnect();
        };
    }, [roomCode, username, nav]);

    const handleStartGame = () => {
        if (!allPlayersReady || isStarting) return;
        setIsStarting(true);
        try {
            socketService._publish("/app/room.start", { roomCode });
        } catch (err) {
            console.error("Failed to start game:", err);
            setIsStarting(false);
        }
    };

    if (!isLoggedIn) return null;

    return (
        <>
            <button className="stats-back-btn" onClick={() => nav("/game-select")}>
                <div className="stats-back-arrow">←</div>
                BACK
            </button>
            <div className="lobby-page">
                <Card className="lobby-page-container">
                    <h1 className="title">Lobby</h1>
                    <RoomCodeCard roomCode={roomCode} />
                    <PlayerCards players={players} />
                </Card>
                <Card className="lobby-page-container lobby-buttons-container">
                    <Button
                        className="btn"
                        onClick={() => socketService.toggleReady(roomCode, username)}
                    >
                        {!isReady ? "Ready" : "Not Ready"}
                    </Button>
                    {isHost ? (
                        <Button
                            className={allPlayersReady && !isStarting ? "btn" : "btn btn-disabled"}
                            onClick={handleStartGame}
                            disabled={!allPlayersReady || isStarting}
                        >
                            {isStarting ? "Starting..." : "Start Game"}
                        </Button>
                    ) : (
                        <Button className="btn btn-disabled" disabled>
                            Waiting for host...
                        </Button>
                    )}
                </Card>
            </div>
        </>
    );
}