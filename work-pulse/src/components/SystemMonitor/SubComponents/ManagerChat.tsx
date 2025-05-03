// ManagerChat.tsx
import { useState, useEffect } from "react";
import { FaPaperPlane, FaTrash } from "react-icons/fa";
import axios from "axios";
import bg from '../../../assets/images/bg.png';
import { motion } from 'framer-motion';
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Employee {
  firstName: string;
  lastName: string;
  officeMail: string;
}

interface ChatEntry {
  _id: string;
  senderType: "employee" | "manager";
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export default function ManagerChat() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState("");

  const fetchEmployees = async () => {
    try {
      const res = await axios.get<Employee[]>(
        "http://localhost:3030/chat/manager/employees"
      );
      setEmployees(res.data);
    } catch (err) {
      console.error("Employee list error:", err);
    }
  };

  const fetchMessages = async (officeMail: string) => {
    try {
      const res = await axios.get<ChatEntry[]>(
        `http://localhost:3030/chat/manager/${officeMail}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Fetch messages error:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selected) {
      fetchMessages(selected);
      const iv = setInterval(() => fetchMessages(selected), 3000);
      return () => clearInterval(iv);
    }
  }, [selected]);

  const sendMessage = async () => {
    if (!selected || !input.trim()) return;
    try {
      await axios.post("http://localhost:3030/chat/manager/send", {
        receiverId: selected,
        text: input,
      });
      setInput("");
      await fetchMessages(selected);
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  const deleteMsg = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3030/chat/manager/${id}`);
      setMessages((m) => m.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (  
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
    <div className="w-full">
        <div className="fixed">
          <Link to="/monitor">
            <button className="absolute text-accent hover:text-reject font-bold rounded-full flex items-center">
              <ArrowLeft size={24} className="mr-2" /> Back
            </button>
          </Link>
        </div>
      </div>
    
    <div className="flex h-screen mt-10">
      {/* Sidebar */}
      <div className="w-1/4 bg-white/40 rounded-lg p-4 overflow-y-auto font-bold mr-5">
        {employees.map((emp) => {
          const full = `${emp.firstName} ${emp.lastName}`;
          return (
            <div
              key={emp.officeMail}
              onClick={() => setSelected(emp.officeMail)}
              className={`p-2 rounded mb-2 cursor-pointer ${
                selected === emp.officeMail ? "bg-text text-white" : "hover:bg-white hover:text-text"
              }`}
            >
              {full}
            </div>
          );
        })}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white/50">
        {selected ? (
          <>
            <div className="p-4 bg-white/40 rounded-lg text-text font-bold">
              Chat with {employees.find((e) => e.officeMail === selected)?.firstName} {employees.find((e) => e.officeMail === selected)?.lastName}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
  {messages.map((msg) => {
    const isManager = msg.senderType === "manager";
    return (
      <div
        key={msg._id}
        className={`flex ${isManager ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`relative max-w-xs p-3 rounded-lg text-white ${
            isManager
              ? "bg-text" // Manager message bubble
              : "bg-gray" // Employee message bubble
          }`}
        >
          <p>{msg.text}</p>
          <span className="block text-xs text-gray-200 text-right mt-1">
            {new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isManager && (
            <FaTrash
              onClick={() => deleteMsg(msg._id)}
              className="absolute top-1 right-1 text-red-300 hover:text-red-500 cursor-pointer"
            />
          )}
        </div>
      </div>
    );
  })}
</div>


            <div className="p-4 flex bg-white/40 rounded-lg">
              <input
                className="flex-1 p-2 border rounded"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message…"
              />
              <button
                onClick={sendMessage}
                className="ml-2 flex items-center px-12 py-2 bg-text text-white rounded"
              >
                <FaPaperPlane />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select an employee to start chatting.
          </div>
        )}
      </div>
    </div>
    </motion.div>
  );
}
