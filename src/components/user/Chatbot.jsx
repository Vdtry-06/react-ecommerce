import { useState, useRef, useEffect } from "react";
import { Input, Button } from "antd";
import { SendOutlined, CloseOutlined } from "@ant-design/icons";
import { sendMessage } from "../../service/UserService";
import "../../static/style/chatbot.css";
import chatBot from "../../static/images/chatbot.png";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Xin chào! Tôi là trợ lý ảo. Bạn cần giúp đỡ gì?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setError(null);
  };

  const cleanResponseText = (text) => {
    text = text.replace(/\*/g, "");
    text = text.replace(/•/g, "");
    text = text.replace(/\*\*/g, "");
    text = text.replace(/\n+/g, " ");
    text = text.replace(/\s+/g, " ").trim();

    return text;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setMessages([...messages, { text: input, sender: "user" }]);
    const userQuery = input;
    setInput("");
    setLoading(true);
    setError(null);

    try {
      setMessages((prev) => [
        ...prev,
        { text: "...", sender: "bot", isTyping: true },
      ]);

      const response = await sendMessage(userQuery);

      setMessages((prev) =>
        prev
          .filter((msg) => !msg.isTyping)
          .concat({
            text: cleanResponseText(response.text),
            sender: "bot",
          })
      );
    } catch (error) {
      setMessages((prev) => prev.filter((msg) => !msg.isTyping));

      setError(error.message || "Lỗi khi gọi API!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen ? (
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={
            <img
              src={chatBot || "/placeholder.svg"}
              alt="Bot"
              style={{ width: 24, height: 24 }}
            />
          }
          onClick={toggleChatbot}
          className="chatbot-toggle"
        />
      ) : (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <img
                  src={chatBot || "/placeholder.svg"}
                  alt="Bot"
                  style={{ width: 24, height: 24 }}
                />
              </div>
              <span className="chatbot-title">Trợ lý ảo</span>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={toggleChatbot}
              className="chatbot-close-btn"
            />
          </div>

          <div
            className="chatbot-messages-container"
            ref={messagesContainerRef}
          >
            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-row ${msg.sender === "user" ? "user-row" : "bot-row"}`}
                >
                  <div
                    className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
                  >
                    {msg.isTyping ? (
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    ) : (
                      <span className="message-text">{msg.text}</span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {error && <div className="chatbot-error">{error}</div>}

          <div className="chatbot-input-container">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={handleSendMessage}
              placeholder="Nhập tin nhắn..."
              disabled={loading}
              className="chatbot-input"
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              loading={loading}
              disabled={!input.trim()}
              className="chatbot-send-btn"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
