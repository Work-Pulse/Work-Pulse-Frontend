import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import bg from "../../assets/images/bg.png";
import PasswordInput from "./PasswordInput";

const EmployeeSignIn = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  //const [password, setPassword] = useState("");
  //const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="grid grid-cols-1 gap-6 p-8 bg-[#C6D2D5] rounded-2xl shadow-xl w-96">
        <h2 className="text-center text-[#122D3B] text-2xl font-bold">Employee Sign Up</h2>

        <div className="flex flex-col gap-4">
          {/* First Name */}
          <div className="relative w-full">
            <FaUser className="absolute left-3 top-3 text-[#122D3B]" size={18} />
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#eab308] focus:border-[#eab308] text-[#122D3B]"
            />
          </div>

          {/* Last Name */}
          <div className="relative w-full">
            <FaUser className="absolute left-3 top-3 text-[#122D3B]" size={18} />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#eab308] focus:border-[#eab308] text-[#122D3B]"
            />
          </div>

          {/* Birthday */}
          <div className="relative w-full">
            <FaCalendarAlt className="absolute left-3 top-3 text-[#122D3B]" size={18} />
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#eab308] focus:border-[#eab308] text-[#122D3B]"
            />
          </div>

          {/* Email */}
          <div className="relative w-full">
            <FaEnvelope className="absolute left-3 top-3 text-[#122D3B]" size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#eab308] focus:border-[#eab308] text-[#122D3B]"
            />
          </div>

          {/* Password */}
          <PasswordInput 
           // placeholder="Password"
           // value={password}
           // onChange={(e) => setPassword(e.target.value)}
          />

          {/* Confirm Password */}
          <PasswordInput 
            //placeholder="Confirm Password"
           // value={confirmPassword}
           // onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Sign Up Button */}
        <button className="text-white text-lg font-semibold p-3 bg-[#122D3B] rounded-lg hover:bg-white hover:text-[#122D3B] transition duration-300 w-full">
          Sign Up
        </button>

        <p className="text-gray-700 text-sm">
          Already have an account?{" "}
          <Link to="/employeelogin" className="text-[#122D3B] font-semibold hover:underline">
            Login
          </Link>
        </p>

        {/* Back to Home Button */}
        <div className="text-center">
          <Link
            to="/"
            className="bg-[#122D3B] hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            Back to Home!
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeSignIn;
