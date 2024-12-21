import { useState } from "react";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]); // Stores conversation history
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);

    const updatedMessages = [...messages, `You: ${input}`];

    try {
      const res = await axios.post("/api/chat", { messages: updatedMessages });
      const botResponse = res.data.response || "No response received.";

      setMessages([...updatedMessages, `Bot: ${botResponse}`]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...updatedMessages, "Bot: Failed to generate response. Try again."]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 rounded-md shadow-md">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.startsWith("You:")
                ? "text-right"
                : "text-left"
            }`}
          >
            <p
              className={`inline-block px-4 py-2 rounded-lg text-sm ${
                msg.startsWith("You:")
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {msg}
            </p>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-4">
        <textarea
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows="2"
          className="flex-grow p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className={`py-2 px-4 rounded-md text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default Chat;
