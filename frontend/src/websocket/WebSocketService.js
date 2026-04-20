import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.client = null;
  }

  /**
   * @param {string} roomCode - The code for the specific lobby
   * @param {string} userId - The current user's ID from UserContext
   * @param {function} onMessageReceived - Callback to update the React 'players' state
   */
  connect(roomCode, username, onMessageReceived) {
  if (this.client && this.client.active) return;

  this.client = new Client({
    webSocketFactory: () => new SockJS(`/ws`),
    reconnectDelay: 5000,
  });

  this.client.onConnect = (frame) => {
    console.log("Connected to STOMP as user:", username);
    console.log(frame); // here for linting

    // Subscribe to the room's topic
    this.client.subscribe(`/room/${roomCode}`, (message) => {
      console.log(message.body);
      if (onMessageReceived) {
        onMessageReceived(JSON.parse(message.body));
      }
    });

    this.joinRoom(roomCode, username); 
  };

  this.client.activate();
}

  /**
   * Publishes a message to the backend to add the user to the room list
   */
  joinRoom(roomCode, username) {
    if (!roomCode || !username) {
    console.error("JoinRoom aborted: roomCode or username is null", { roomCode, username });
    return;
  }
  if (this.client && this.client.connected) {
    const payload = {
      roomCode: roomCode,
      username: username
    };

    this.client.publish({
      destination: "/app/room.join",
      body: JSON.stringify(payload),
    });
  }
}

  toggleReady(roomCode, username) {
    console.log("Toggle Ready function called for:", username); // Log 1

    if (this.client && this.client.connected) {
      const payload = {
        roomCode: roomCode,
        username: username
      };

      console.log("Publishing to /app/room.ready with payload:", payload); // Log 2

      this.client.publish({
        destination: "/app/room.ready",
        body: JSON.stringify(payload)
      });
    } else {
      console.error("Cannot toggle ready: Not connected to WebSocket"); // Log 3
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null; // Reset the client for future connections
      console.log("Disconnected from WebSocket");
    }
  }
}

const socketServiceInstance = new WebSocketService();
export default socketServiceInstance;