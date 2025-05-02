import { useState, useEffect } from "react";
import {  FaPaperPlane, FaTrash } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import axios from "axios";

interface ChatMessage {
  _id: string;
  senderType: "employee" | "manager";
  senderId: string;
  receiverId: string;
  text: string;
  attachment?: { name: string; size: string };
  timestamp: string;
}

export default function ChatWindow() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [officeMail, setOfficeMail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  const fetchEmployeeMessages = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    try {
      const token = await user.getIdToken();

      const res = await axios.get<ChatMessage[]>(
        "http://localhost:3030/chat/employee",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { officeMail: user.email }
        }
      );

      setChatMessages(res.data);
    } catch (err) {
      console.error("Error fetching chat:", err);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    (async () => {
      setOfficeMail(user.email);
      const token = await user.getIdToken();

      // fetch profile
      const profile = await axios.get(
        `http://localhost:3030/employee/employee/data/${user.email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFirstName(profile.data.firstName);
      setLastName(profile.data.lastName);

      // initial chat load + polling
      await fetchEmployeeMessages();
      const iv = setInterval(fetchEmployeeMessages, 3000);
      return () => clearInterval(iv);
    })();
  }, []);

  const sendMessage = async () => {
    if (!message.trim() && !attachment) return;
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    try {
      const token = await user.getIdToken();
      await axios.post(
        "http://localhost:3030/chat/employee/send",
        {
          text: message,
          attachment: attachment
            ? { name: attachment.name, size: `${Math.ceil(attachment.size / 1024)} KB` }
            : undefined,
          officeMail: user.email    // only if your server still expects it
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("");
      setAttachment(null);
      await fetchEmployeeMessages();
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  const deleteMessage = async (id: string) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    try {
      const token = await user.getIdToken();
      await axios.delete(
        `http://localhost:3030/chat/employee/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { officeMail: user.email }  // axios allows a body on delete via `data`
        }
      );
      setChatMessages((msgs) => msgs.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="bg-white w-full rounded-lg shadow-lg flex flex-col h-[90%] max-w-md mx-auto fixed">
      <div className="p-4 flex justify-between items-center bg-gray rounded-t-lg">
        <div>
          {firstName && lastName && (
            <span className="font-semibold">
              Chat as {firstName} {lastName}
            </span>
          )}
        </div>
        {officeMail && <span className="text-sm text-text">{officeMail}</span>}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {chatMessages.map((msg) => {
        const isSelf = msg.senderType === "employee";
        return (
          <div
            key={msg._id}
            className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}
          >
          <div
            className={`relative inline-block px-4 pb-8 pr-10 py-2 pr-10 rounded-lg whitespace-pre-wrap max-w-[80%] ${
            isSelf ? "bg-text text-white" : "bg-gray text-black"
            }`}
          >
          <p>{msg.text}</p>

          {/* timestamp */}
          <span className="absolute bottom-1 right-2 text-xs text-gray-400">
            {new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {/* delete icon */}
            {isSelf && (
              <FaTrash
                onClick={() => deleteMessage(msg._id)}
                className="absolute top-1 right-1 cursor-pointer text-xs text-red-500"
              />
            )}
          </div>
        </div>
        );
      })}

      </div>
      <div className="p-4 flex items-center bg-gray-100 rounded-b-lg">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-2 border rounded bg-white"
          placeholder="Type a message"
        />

        <button
          onClick={sendMessage}
          className="ml-2 flex items-center space-x-1 bg-text text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FaPaperPlane />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}
