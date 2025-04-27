import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import bg from '../../assets/images/bg.png';
import PasswordInput from './PasswordInput';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeLogin = () => {
  const [officeMail, setOfficeMail] = useState("");
  const [password, setPassword] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const res = await axios.post("http://localhost:3030/employee/employee/login", {
        officeMail,
        password
      });
  
      const employeeData = res.data.employee; // get the employee info
      toast.success("Login successful!");
  
      console.log(employeeData);
      // You can store employee id (or the whole data) in localStorage or context
      localStorage.setItem("employeeId", employeeData.id); 
  
      navigate("/employeedashboard");
    } catch (err: any) {
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
      <div className="grid grid-cols-1 gap-8 p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-center text-[#122D3B] text-2xl font-bold">Employee Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Office Email Input */}
          <div className="relative w-full">
            <FaEnvelope className="absolute left-3 top-3 text-[#122D3B]" size={20} />
            <input
              type="email"
              placeholder="Office Email"
              value={officeMail}
              onChange={(e) => setOfficeMail(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#eab308] focus:border-[#eab308] text-[#122D3B]"
            />
          </div>

          {/* Password Input */}
          <PasswordInput 
            placeholder="Password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="text-white text-lg font-semibold p-3 bg-text rounded-lg hover:bg-white hover:text-text hover:border transition duration-300 w-full"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-700 text-xl text-center">
          If you don't have an account,{" "}
          <Link to="/employeesignin" className="text-[#122D3B] font-semibold hover:underline">
            Sign in
          </Link>
        </p>

        <div className="text-center">
          <Link
            to="/userselection"
            className="shadow-lg hover:bg-text hover:text-background text-text font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            Back to Users
          </Link>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </motion.div>
  );
};

export default EmployeeLogin;
