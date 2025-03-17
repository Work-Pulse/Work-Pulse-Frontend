import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import bg from '../../assets/images/bg.png';
import PasswordInput from './PasswordInput';

const ManagerLogin = () => {
  const [username, setUsername] = useState("");

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }} 
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="grid grid-cols-1 gap-8 p-8 bg-[#C6D2D5] rounded-2xl shadow-xl w-96">
        <h2 className="text-center text-[#122D3B] text-2xl font-bold">Manager Login</h2>

        <div className="flex flex-col gap-4">
          {/* Username Input with focus effect */}
          <div className="relative w-full">
            <FaUser className="absolute left-3 top-3 text-[#122D3B]" size={20} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#eab308] focus:border-[#eab308] text-[#122D3B]"
/>

          </div>

          {/* Password Input */}
          <PasswordInput />
        </div>

        {/* Login Button */}
        <Link to='/managerdashboard'>
          <button className="text-white text-lg font-semibold p-3 bg-[#122D3B] rounded-lg hover:bg-white hover:text-[#122D3B] transition duration-300 w-full">
            Login
          </button>
        </Link>

        {/* Back to Home Button */}
        <div className="text-center">
          <Link
            to='/'
            className="bg-[#122D3B] hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            Back to Home!
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ManagerLogin;
