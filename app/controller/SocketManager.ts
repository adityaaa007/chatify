// SocketManager.ts

import io, { Socket } from "socket.io-client";
import { storage } from "../utils/Storage";

class SocketManager {
  private static instance: SocketManager | null = null;
  private socket: Socket | null = null;

  private constructor() {}

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  connect(url: string): void {
    this.socket = io(url);
    // Add other socket event listeners and initialization logic here
    this.socket.on("connect", () => {
      console.log('Connected to Socket server: '); // x8WIv7-mJelg7on_ALbx // TODO: create a context for storing whether we have already connected to socket

      const name = storage.getString("name");
      const id = storage.getString("id");

      this.socket!.emit("user-connect", {
        name,
        id,
        active: true,
      });
    });

    this.socket.on("disconnect", () => {
      console.log('DisConnected to Socket server: '); // x8WIv7-mJelg7on_ALbx

    });
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): Boolean {
    return this.socket?.connected!;
  }
}

export default SocketManager.getInstance();
