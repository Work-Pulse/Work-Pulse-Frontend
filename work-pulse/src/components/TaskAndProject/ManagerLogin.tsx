import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import bg from "../../assets/images/bg.png";
import PasswordInput from "./PasswordInput";

const ManagerLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const navigate = useNavigate(); 

  const handleLogin = () => {
    let isValid = true;

    if (!username.trim()) {
      setUsernameError("Username cannot be empty.");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!password.trim()) {
      setPasswordError("Password cannot be empty.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (isValid) {
      
      navigate("/managerdashboard");
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
      <div className="grid grid-cols-1 gap-8 p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-center text-text text-2xl font-bold">Manager Login</h2>

        <div className="flex flex-col gap-4">
          {/* Username Input with focus effect */}
          <div className="relative w-full">
            <FaUser className="absolute left-3 top-3 text-text" size={20} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg outline-none focus:ring-1 ${
                usernameError ? "border-red-500 ring-red-500" : "border-gray-300 focus:ring-[#eab308] focus:border-[#eab308]"
              } text-[#122D3B]`}
            />
            {usernameError && (
              <p className="text-reject text-base mt-1 font-semibold">{usernameError}</p>
            )}
          </div>

         {/* Password Input */}
          <PasswordInput password={password} setPassword={setPassword} />
          {passwordError && (
            <p className="text-reject text-base font-semibold">{passwordError}</p>
          )}
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="text-white text-lg font-semibold p-3 bg-text rounded-lg hover:bg-white hover:text-[#122D3B] transition duration-300 w-full"
        >
          Login
        </button>

        {/* Back to Home Button */}
        <div className="text-center">
          <Link
            to='/userselection'
            className="hover:bg-accent hover:text-background text-accent font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            Back to Users
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ManagerLogin;