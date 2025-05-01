import { useState, useEffect } from "react";
import { FaPaperclip, FaPaperPlane } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import axios from "axios";

// Define types for chat message and attachment
interface ChatMessage {
  id: number;
  text: string;
  sender: "employee" | "manager";
  attachment?: { name: string; size: string } | null;
  timestamp: string;
}

const ChatWindow = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, text: "Hi there, could you send me my latest bill please?", sender: "manager", timestamp: "18:42 p.m." },
  ]);
  const [message, setMessage] = useState<string>("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [officeMail, setOfficeMail] = useState<string | null>(null);  // Store officeMail
  const [firstName, setFirstName] = useState<string | null>(null); // Store firstName
  const [lastName, setLastName] = useState<string | null>(null); // Store lastName

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const fetchEmployeeData = async () => {
        try {
          // Set officeMail from Firebase user email
          setOfficeMail(user.email);

          // Fetch the Firebase token
          const token = await user.getIdToken();

          // Make a request to your backend to fetch employee data by officeMail (firebase user email)
          const response = await axios.get(`http://localhost:3030/employee/employee/data/${user.email}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Send the token in the Authorization header
            },
          });

          // Assuming the backend response contains firstName and lastName
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
        } catch (error) {
          console.error("Error fetching employee data:", error);
        }
      };

      fetchEmployeeData();
    }
  }, []);

  const sendMessage = () => {
    if (!message.trim() && !attachment) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      text: message,
      sender: "employee",
      attachment: attachment ? { name: attachment.name, size: "24 KB" } : null,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessage("");
    setAttachment(null);
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) setAttachment(file);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white w-full rounded-lg shadow-lg flex flex-col h-[90%] max-w-md mx-auto shadow-lg fixed">
      <div className="p-4 text-center font-semibold text-text flex items-center bg-background bg-opacity-40 rounded-lg justify-between">
        {firstName && lastName && (
          <span className="text-lg text-text">Chat as {`${firstName} ${lastName}`}</span>  
        )}
        {officeMail && (
          <span className="text-sm text-gray-500">{officeMail}</span>  
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === "employee" ? "items-end" : "items-start"}`}>
            <div className={`min-w-[120px] max-w-xs pb-10 pt-5 px-4 rounded-lg relative flex flex-col ${msg.sender === "employee" ? "bg-text text-background" : "bg-primary text-black"}`}>
              <p className="break-words">{msg.text}</p>
              {msg.attachment && (
                <div className="mt-2 bg-white p-2 rounded-lg flex items-center space-x-2 shadow">
                  <span className="text-sm text-accent">📄 {msg.attachment.name}</span>
                  <span className="text-xs text-gray-500">{msg.attachment.size}</span>
                </div>
              )}
              <span className="absolute bottom-1 right-2 text-xs text-gray-500">{msg.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 flex items-center bg-background rounded-lg">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 p-2 border rounded bg-white"
          placeholder="Type here"
        />
        <label className="ml-2 cursor-pointer">
          <FaPaperclip className="text-text hover:text-primary" />
          <input type="file" onChange={handleAttachmentChange} className="hidden" />
        </label>
        <button
          onClick={sendMessage}
          className="ml-2 bg-text text-white p-2 rounded-full shadow-lg hover:bg-primary"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
