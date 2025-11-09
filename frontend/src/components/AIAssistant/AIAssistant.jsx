import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./AIAssistant.css";

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hello! I'm PF AI Assistant. I can analyze your spending, suggest budgets, and answer financial questions. How can I help today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new message appears
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle user sending a message
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // 🔐 Get logged-in user email (from localStorage)
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userEmail = storedUser?.email || "snowbabyca9@gmail.com";

      // 📡 Send user input to backend
      const response = await axios.post("http://localhost:5000/api/ai/chat", {
        message: userMessage.content,
        email: userEmail,
      });

      const assistantMessage = {
        role: "assistant",
        content:
          response.data.response ||
          "⚠️ Sorry, I couldn't get a response from the AI.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Sorry, an error occurred while connecting to AI. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ai-assistant-container">
      {/* Header */}
      <div className="chat-header">
        <h1 className="chat-title">PF AI Assistant</h1>
        <p className="chat-subtitle">
          Your intelligent AI assistant for finance
        </p>
      </div>

      {/* Chat messages */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${
              msg.role === "user" ? "user-message" : "assistant-message"
            }`}
          >
            <div className="message-content">{msg.content}</div>
          </div>
        ))}

        {/* Typing animation */}
        {loading && (
          <div className="message assistant-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Ask about your spending, savings, or income..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button
          className="send-button"
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          <span className="send-icon">➤</span>
        </button>
      </div>
    </div>
  );
}
