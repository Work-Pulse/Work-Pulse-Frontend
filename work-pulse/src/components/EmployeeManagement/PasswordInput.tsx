import { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // ✅ Type added
}

const PasswordInput: React.FC<PasswordInputProps> = ({ placeholder, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full max-w-sm">
      {/* Lock Icon */}
      <FaLock className="absolute left-3 top-3 text-[#122D3B]" size={20} />

      {/* Password Input */}
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange} // ✅ Now correctly typed
        className="pl-10 pr-10 py-2 border rounded-lg w-full outline-none focus:ring-1 focus:ring-[#eab308] focus:border-[#eab308] text-[#122D3B]"
      />

      {/* Show/Hide Password Button */}
      <button 
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-3 text-[#122D3B] hover:text-[#eab308] transition"
      >
        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
