import { useEffect, useState } from "react";
import socketService, { SocketEvent } from "./socket";
import "./App.css";

export const CHAT_API_URL = "http://localhost:5214";

const CHAT_API_HUB_URL = `${CHAT_API_URL}/hubchat`;

function App() {
  const [userId, setUserId] = useState<string>();
  const [chatId, setChatId] = useState<string>();

  useEffect(() => {
    const connectSocket = async () => {
      try {
        await socketService.connect(CHAT_API_HUB_URL);
        console.log("Connected to SignalR hub");
      } catch (error) {
        console.error("Failed to connect to SignalR hub:", error);
      }
    };
    connectSocket();
    return () => {
      socketService.disconnect().catch((error) => {
        console.error("Error disconnecting from SignalR hub:", error);
      });
    };
  }, []);

  const join = async () => {
    try {
      await socketService.invoke(SocketEvent.join, {
        chatId: chatId,
        userId: userId,
      });
    } catch (error) {
      console.error("Failed to join to SignalR hub:", error);
    }
  };

  const leave = async () => {
    try {
      await socketService.invoke(SocketEvent.leave, {
        chatId: chatId,
        userId: userId,
      });
    } catch (error) {
      console.error("Failed to join to SignalR hub:", error);
    }
  };

  return (
    <div className="App">
      <button onClick={() => leave()}>Leave</button>
      <button onClick={() => join()}>Join</button>
      <label>
        userId
        <input
          type="text"
          onChange={(event) => setUserId(event.target.value)}
        />
      </label>
      <label>
        chatId
        <input
          type="text"
          onChange={(event) => setChatId(event.target.value)}
        />
      </label>
    </div>
  );
}

export default App;
