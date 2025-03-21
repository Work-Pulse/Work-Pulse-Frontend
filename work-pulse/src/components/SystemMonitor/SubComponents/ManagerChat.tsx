import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import bg from '../../../assets/images/bg.png';
import { motion } from 'framer-motion';

interface Message {
  type: 'message';
  sender: string;
  text: string;
  time: string;
  date: string;
}

interface DateSeparator {
  type: 'date';
  date: string;
}

type ChatEntry = Message | DateSeparator;

export default function ChatWindow() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ [key: string]: ChatEntry[] }>({});
  const [input, setInput] = useState<string>("");

  const employees: string[] = ["John Doe", "Jane Smith", "Alice Brown", "Bob Johnson"];

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const sendMessage = () => {
    if (!selectedChat || !input.trim()) return;
    const now = new Date();
    const timeStamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStamp = formatDate(now);

    setMessages((prev) => {
      const chatMessages = prev[selectedChat] || [];
      const lastMessage = chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null;
      const showDate = !lastMessage || (lastMessage.type === 'message' && lastMessage.date !== dateStamp);
      
      return {
        ...prev,
        [selectedChat]: [
          ...chatMessages,
          ...(showDate ? [{ type: 'date', date: dateStamp } as DateSeparator] : []),
          { type: 'message', sender: "me", text: input, time: timeStamp, date: dateStamp } as Message
        ],
      };
    });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}  
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6 bg-fixed"
      style={{ backgroundImage: `url(${bg})` }}>
    <div className=" w-full fixed">
    <div className="flex h-screen w-full">
      <div className="w-1/4 border-r">
        <div className="flex items-center gap-3 p-4">
          <Link to="/monitor">
          <FaArrowLeft className="cursor-pointer"/>
          </Link>
        </div>
        <div>
          {employees.map((employee) => (
            <div
              key={employee}
              className={`p-3 cursor-pointer bg-background rounded-lg mb-2 hover:bg-text hover:text-background ${selectedChat === employee ? "bg-primary" : ""}`}
              onClick={() => setSelectedChat(employee)}
            >
              {employee}
            </div>
          ))}
        </div>
      </div>
      <div className="w-3/4 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 bg-white rounded-lg">
              <h2 className="text-lg font-bold">{selectedChat}</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {(messages[selectedChat] || []).map((msg, index) => (
                msg.type === 'date' ? (
                  <div key={index} className="text-center text-xs text-gray-500 my-3">
                    {msg.date}
                  </div>
                ) : (
                  <div
                    key={index}
                    className={`p-2 my-1 rounded-lg max-w-xs ${msg.sender === "me" ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black self-start"}`}
                  >
                    <p>{msg.text}</p>
                    <span className="block text-xs text-right mt-1 text-gray-600">{msg.time}</span>
                  </div>
                )
              ))}
            </div>
            <div className="p-4 flex items-center bg-white border-t">
              <input
                className="flex-1 p-2 border rounded-lg"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
              />
              <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={sendMessage}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
    </div>
    </motion.div>
  );
}
