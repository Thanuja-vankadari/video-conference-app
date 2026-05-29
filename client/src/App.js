import React, { useEffect, useRef, useState } from "react";
import socket from "./socket";
import "./App.css";

function App() {
  const videoRef = useRef();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      });

    socket.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat-message");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("chat-message", message);
    setMessage("");
  };

  const shareScreen = async () => {
    const screenStream =
      await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

    videoRef.current.srcObject = screenStream;
  };

  return (
    <div className="container">
      <h1>Video Conference App</h1>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
      />

      <br />

      <button onClick={shareScreen}>
        Share Screen
      </button>

      <div className="chat">
        <h2>Chat</h2>

        {messages.map((m, i) => (
          <p key={i}>{m}</p>
        ))}

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;