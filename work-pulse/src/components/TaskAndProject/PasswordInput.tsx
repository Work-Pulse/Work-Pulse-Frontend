import { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps {
  password: string;
  setPassword: (value: string) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ password, setPassword }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      {/* Lock Icon */}
      <FaLock className="absolute left-3 top-3 text-[#122D3B]" size={20} />

      {/* Password Input */}
      <input
        type={showPassword ? "text" : "password"} // Toggle between text/password
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full pl-10 pr-10 py-2 border rounded-lg outline-none focus:ring-1 border-gray-300 focus:ring-[#eab308] focus:border-[#eab308] text-[#122D3B]"
      />

      {/* Eye Icon for Visibility Toggle */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-3 text-[#122D3B] focus:outline-none"
      >
        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
