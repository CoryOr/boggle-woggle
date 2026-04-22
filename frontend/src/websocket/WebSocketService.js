import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.client = null;
        this.pendingMessages = [];
    }

    /**
     * Connect to the WebSocket server and subscribe to room topics.
     *
     * @param {string}        roomCode       - The room to connect to.
     * @param {string}        username       - The current user's username.
     * @param {Function|null} onLobbyMessage - Called for lobby updates and game start broadcasts.
     * @param {Function|null} onStateUpdate  - Called for live score/state updates during the game.
     */
    connect(roomCode, username, onLobbyMessage, onStateUpdate) {
        // If already connected, attach the state handler subscription and return
        if (this.client && this.client.connected) {
            if (onStateUpdate) {
                this.client.subscribe(`/room/${roomCode}/state`, (message) => {
                    onStateUpdate(JSON.parse(message.body));
                });
            }
            return;
        }

        // Tear down any half-open client before creating a new one
        if (this.client) {
            this.client.deactivate();
            this.client = null;
        }

        this.client = new Client({
            webSocketFactory: () => new SockJS('/ws'),
            reconnectDelay: 5000,
        });

        this.client.onConnect = () => {
            console.log("Connected to STOMP as user:", username);

            if (onLobbyMessage) {
                // Lobby updates: player joins, ready toggles
                this.client.subscribe(`/room/${roomCode}`, (message) => {
                    onLobbyMessage(JSON.parse(message.body));
                });

                // Game start broadcast
                this.client.subscribe(`/room/${roomCode}/start`, (message) => {
                    console.log("Game start received:", message.body);
                    onLobbyMessage(JSON.parse(message.body));
                });
            }

            if (onStateUpdate) {
                // Live score/state updates during the game
                this.client.subscribe(`/room/${roomCode}/state`, (message) => {
                    console.log("State update received:", message.body);
                    onStateUpdate(JSON.parse(message.body));
                });
            }

            // Flush any messages queued before connection was ready
            this.pendingMessages.forEach(({ destination, payload }) => {
                this._publishNow(destination, payload);
            });
            this.pendingMessages = [];

            this.joinRoom(roomCode, username);
        };

        this.client.activate();
    }

    _publishNow(destination, payload) {
        try {
            this.client.publish({
                destination,
                body: JSON.stringify(payload),
                headers: { 'content-type': 'application/json' },
            });
            console.log(`Successfully published to ${destination}:`, payload);
        } catch (error) {
            console.error(`STOMP publish failed for ${destination}:`, error);
        }
    }

    _publish(destination, payload) {
        if (!this.client || !this.client.active) {
            console.error(`Client not active, dropping message to ${destination}`);
            return;
        }
        if (!this.client.connected) {
            console.warn(`STOMP not fully connected, queuing message to ${destination}`);
            this.pendingMessages.push({ destination, payload });
            return;
        }
        this._publishNow(destination, payload);
    }

    joinRoom(roomCode, username) {
        if (!roomCode || !username) {
            console.error("joinRoom aborted: missing roomCode or username");
            return;
        }
        this._publish("/app/room.join", { roomCode, username });
    }

    toggleReady(roomCode, username) {
        this._publish("/app/room.toggle-ready", { roomCode, username });
    }

    /**
     * Submit a multiplayer word guess.
     * Server validates, scores, and broadcasts updated state to /room/{roomCode}/state.
     *
     * @param {string} roomCode - The active room code.
     * @param {string} guess    - The word being guessed (lowercase).
     */
    submitGuess(roomCode, guess) {
        this._publish("/app/room.guess", { roomCode, guess });
    }

    broadcastPlayerScore(roomCode, username, score) {
        this._publish("/app/room.score", { roomCode, username, score });
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            console.log("Disconnected from WebSocket");
        }
    }
}

const socketServiceInstance = new WebSocketService();
export default socketServiceInstance;