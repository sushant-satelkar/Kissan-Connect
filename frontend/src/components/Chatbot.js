import React, { useState } from 'react';
import '../styles/Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages([...messages, { text: inputMessage, isBot: false }]);
    
    // Simulate bot response (you can replace this with actual chatbot API)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Thanks for your message! Our team will get back to you soon.",
        isBot: true
      }]);
    }, 1000);

    setInputMessage('');
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>KisaanConnect Support</h3>
            <button onClick={() => setIsOpen(false)} className="close-button">×</button>
          </div>
          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.isBot ? 'bot' : 'user'}`}>
                {message.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="input-container">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="message-input"
            />
            <button type="submit" className="send-button">Send</button>
          </form>
        </div>
      )}
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '×' : '💬'}
      </button>
    </div>
  );
};

export default Chatbot; 