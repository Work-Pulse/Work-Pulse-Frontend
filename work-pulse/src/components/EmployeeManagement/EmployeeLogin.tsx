// src/components/EmployeeManagement/EmployeeLogin.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";
import PasswordInput from "./PasswordInput";
import bg from "../../assets/images/bg.png";
import "react-toastify/dist/ReactToastify.css";

export default function EmployeeLogin() {
  const [officeMail, setOfficeMail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1️⃣ Sign in with Firebase
      const cred = await signInWithEmailAndPassword(auth, officeMail, password);
      const idToken = await cred.user.getIdToken();

      // 2️⃣ Call your backend login endpoint (protected by verifyToken)
      const { data } = await axios.post(
        "http://localhost:3030/employee/employee/login",
        {}, // no body needed; email is extracted from the token
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      // 3️⃣ Use returned profile data if desired
      console.log("Logged in employee profile:", data.employee);
      // e.g. save to context or redux: setUser(data.employee);

      toast.success("Login successful!");
      navigate("/employeedashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      toast.error(err?.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="grid grid-cols-1 gap-8 p-8 rounded-2xl shadow-xl w-96 bg-white">
        <h2 className="text-center text-[#122D3B] text-2xl font-bold">
          Employee Login
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="relative w-full">
            <FaEnvelope className="absolute left-3 top-3 text-[#122D3B]" size={20} />
            <input
              type="email"
              placeholder="Office Email"
              value={officeMail}
              onChange={(e) => setOfficeMail(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#eab308] focus:border-[#eab308]"
            />
          </div>

          <PasswordInput
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="text-white text-lg font-semibold p-3 bg-text rounded-lg hover:bg-white hover:text-text transition duration-300 w-full"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-700 text-xl text-center">
          If you don't have an account,{" "}
          <Link to="/employeesignin" className="text-[#122D3B] font-semibold hover:underline">
            Sign up
          </Link>
        </p>

        <Link
          to="/userselection"
          className="shadow-lg hover:bg-text hover:text-background text-text font-semibold py-3 px-6 rounded-lg transition duration-300 text-center"
        >
          Back to Users
        </Link>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </motion.div>
  );
}
