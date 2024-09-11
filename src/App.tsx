import { useEffect, useState } from "react";
import { SocketEvent, SocketService } from "./socket";
import "./App.css";

export const CHAT_API_URL = "http://localhost:5214";

const CHAT_API_HUB_URL = `${CHAT_API_URL}/hubchat`;
const socketService = SocketService.getInstance();
function App() {
  const [userId, setUserId] = useState<number>(() => 0);
  const [chatId, setChatId] = useState<number>(() => 0);
  const [messageContent, setMessageContent] = useState<string>('');


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
    socketService.on(SocketEvent.recive, message => console.log(`Message ${JSON.stringify(message)}`))
    return () => {
      socketService.disconnect().catch((error) => {
        console.error("Error disconnecting from SignalR hub:", error);
      });
    };
  }, []);

  const join = async () => {
    try {
      const eventMessage : {chatId: number, userId: number} = { chatId: chatId, userId: userId}
      await socketService.invoke(SocketEvent.join, eventMessage);
    } catch (error) {
      console.error("Failed to join to SignalR hub:", error);
    }
  };

  const leave = async () => {
    try {
      const eventMessage : {chatId: number, userId: number} = { chatId: chatId, userId: userId}
      await socketService.invoke(SocketEvent.leave, eventMessage);
    } catch (error) {
      console.error("Failed to join to SignalR hub:", error);
    }
  };
  const sendMessage = async () => {
    try {
      const eventMessage : {chatId: number, userId: number, content: string} = {
        content: messageContent,
        chatId,
        userId
      }
      console.log(eventMessage);
      
      await socketService.invoke(SocketEvent.send, eventMessage);
    } catch (error) {
      console.error("Failed to join to SignalR hub:", error);
    }
  }

  return (
    <div className="App">
      <button onClick={() => leave()}>Leave</button>
      <button onClick={() => join()}>Join</button>

      <label>
        userId
        <input
          type="number"
          onChange={(event) => setUserId(+event.target.value)}
        />
      </label>
      <label>
        chatId
        <input
          type="number"
          onChange={(event) => setChatId(+event.target.value)}
        />
      </label>
      <label>
        Messge content
        <textarea
          onChange={(event) => setMessageContent(event.target.value)}
        />
      <button onClick={() => sendMessage()}>Send</button>
      </label>


    </div>
  );
}

export default App;
