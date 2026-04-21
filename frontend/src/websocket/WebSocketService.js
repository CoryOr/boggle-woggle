import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.client = null;
    this.pendingMessages = [];
  }

  connect(roomCode, username, onMessageReceived) {
    if (this.client && this.client.active) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS(`/ws`),
      reconnectDelay: 5000,
    });

    this.client.onConnect = (frame) => {
      console.log("Connected to STOMP as user:", username);

      this.client.subscribe(`/room/${roomCode}`, (message) => {
        console.log("Received message from server:", message.body);
        if (onMessageReceived) {
          onMessageReceived(JSON.parse(message.body));
        }
      });

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
        destination: destination,
        body: JSON.stringify(payload),
        headers: { 'content-type': 'application/json' }
      });
      console.log(`Successfully published to ${destination} with payload:`, payload);
    } catch (error) {
      console.error(`STOMP Publish failed for ${destination}:`, error);
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
      console.error("JoinRoom aborted: roomCode or username is null", { roomCode, username });
      return;
    }
    const payload = { roomCode: roomCode, username: username };
    this._publish("/app/room.join", payload);
  }

  toggleReady(roomCode, username) {
    console.log("Toggle Ready function called for:", username);
    const payload = { roomCode: roomCode, username: username };
    this._publish("/app/room.toggle-ready", payload);
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