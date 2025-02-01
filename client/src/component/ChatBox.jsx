import { useEffect, useState } from "react";
import socketManager from "../Socket";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = socketManager.connect("http://localhost:3000", {
    transports: ["websocket"],
  });

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message"); // Cleanup listener
    };
  }, [socket]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", { message, senderId: socket.id });
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col justify-between h-full w-full p-4 bg-base rounded-lg shadow-lg">
    <h1 className="text-xl mb-4 text-center">Chat Box</h1>
    
    {/* Message container with flex layout */}
    <div className="flex-1 overflow-y-auto px-2 py-2 mb-4 bg-gray-600 rounded-lg flex flex-col gap-2">
      {messages.map(({ message, senderId }, index) => (
        <p
          key={index}
          className={`px-4 py-2 w-fit max-w-xs rounded-lg ${
            senderId === socket.id
              ? "bg-blue-500 text-white self-end"
              : "bg-gray-300 text-black self-start"
          }`}
        >
          {message}
        </p>
      ))}
    </div>
    
    {/* Input and button */}
    <div className="flex gap-2 justify-between items-center w-full">
      <input
        type="text"
        placeholder="Type here"
        className="input w-full p-2 border rounded-lg"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="btn p-2 bg-blue-500 text-white rounded-lg"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  </div>
  
  );
}