import { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full max-w-sm">
      <FaLock className="absolute left-3 top-3 text-[#122D3B]" size={20} />
      
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        className="pl-10 pr-10 py-2 border rounded-lg w-full"
      />

      <button 
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-3"
      >
        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
