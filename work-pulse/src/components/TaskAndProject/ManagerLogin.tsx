import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import bg from "../../assets/images/bg.png";
import PasswordInput from "./PasswordInput";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManagerLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const navigate = useNavigate(); 

  const [isLoading, setIsLoading] = useState(false);


  const handleLogin = async () => {
    setIsLoading(true);
    setUsernameError("");
    setPasswordError("");
  
    try {
      const response = await axios.post("http://localhost:3030/api/validate-login", {
        username,
        password,
      });
  
      if (response.status === 200) {
        navigate("/managerdashboard");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data;
        const message = data.message || data.error || "Validation failed";
  
        // Show toast instead of inline error
        toast.error(message);
      } else {
        console.error("Unexpected error:", error);
        toast.error("Something went wrong. Please try again.");
      }
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
              required
              className={`w-full pl-10 pr-3 py-2 border rounded-lg outline-none focus:ring-1 ${
                usernameError ? "border-red-500 ring-red-500" : "border-gray-300 focus:ring-[#eab308] focus:border-[#eab308]"
              } text-[#122D3B]`}
            />
      
          </div>

         {/* Password Input */}
          <PasswordInput password={password} setPassword={setPassword} />
         
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`text-white text-lg font-semibold p-3 rounded-lg w-full transition duration-300 ${
            isLoading
             ? "bg-gray-400 cursor-not-allowed"
             : "bg-text hover:bg-white hover:text-[#122D3B]"
         }`}
         >
           {isLoading ? "Logging in..." : "Login"}
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
      <ToastContainer position="top-right" autoClose={3000} />
    </motion.div>
  );
};

export default ManagerLogin;
