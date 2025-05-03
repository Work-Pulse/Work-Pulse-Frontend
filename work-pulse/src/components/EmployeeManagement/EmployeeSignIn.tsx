import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import bg from "../../assets/images/bg.png";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { registerUser } from "../../services/firebaseAuth";
import Swal from 'sweetalert2'

// Helper: Password strength levels
const getPasswordStrength = (password: string): { level: string; color: string } => {
  if (!password) return { level: "", color: "" };
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[^a-zA-Z0-9]/.test(password);

  if (password.length < 6) return { level: "Weak", color: "text-[#FE0303]" };
  if (hasLetters && hasNumbers && hasSymbols && password.length >= 10)
    return { level: "Strong", color: "text-[#069C1A]" };
  return { level: "Medium", color: "text-[#ABAB3A]" };
};

const EmployeeSignIn = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    designation: "",
    department: "",
    officeMail: "",
    personalMail: "",
    officePhone: "",
    personalPhone: "",
    joinDate: "",
    birthday: "",
    address: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState({ level: "", color: "" });
  const [passwordError, setPasswordError] = useState("");
  const [phoneErrors, setPhoneErrors] = useState({
    officePhone: "",
    personalPhone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validate phone fields
    if ((name === "officePhone" || name === "personalPhone") && !/^\+?\d*$/.test(value)) {
      setPhoneErrors((prev) => ({
        ...prev,
        [name]: "Phone number must contain digits only and may start with +.",
      }));
    } else {
      setPhoneErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (formData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      toast.error("Password must be at least 8 characters.");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }
  
    if (phoneErrors.officePhone || phoneErrors.personalPhone) {
      toast.error("Please correct phone number errors.");
      return;
    }
  
    setPasswordError("");
    setIsLoading(true);
  
    try {
      // Register user with Firebase Auth
      const firebaseUserCredential = await registerUser(formData.officeMail, formData.password);
      const firebaseUser = firebaseUserCredential.user;  // Access the 'user' from UserCredential
  
      // Get Firebase ID Token
      const token = await firebaseUser.getIdToken();  // Use 'getIdToken' on the 'user' object
  
      // Prepare data for API request
      const saveData = { ...formData } as Partial<typeof formData>;
      delete saveData.confirmPassword;
  
      // Send the data to the backend (add token to headers)
      await axios.post("http://localhost:3030/employee/employees", saveData, {
        headers: {
          Authorization: `Bearer ${token}`,  // Add the Firebase token here
        },
      });
  
      Swal.fire({
                  title: 'Registered Successfully!',
                  icon: 'success',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#4CAF50'  // any valid CSS color
                })
      navigate("/employeelogin");
    } catch (err) {
      console.error("Error:", err);
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
      <div className="p-8 rounded-2xl shadow-xl w-full max-w-5xl mx-auto">
        <h1 className="text-center text-[#122D3B] text-3xl font-bold mb-6">Employee Sign Up</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Designation" name="designation" value={formData.designation} onChange={handleChange} />
            <Input label="Department" name="department" value={formData.department} onChange={handleChange} />
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Office Email" type="email" name="officeMail" value={formData.officeMail} onChange={handleChange} />
            <Input label="Personal Email" type="email" name="personalMail" value={formData.personalMail} onChange={handleChange} />
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input label="Office Phone" name="officePhone" value={formData.officePhone} onChange={handleChange} />
              {phoneErrors.officePhone && (
                <p className="text-red-600 text-sm mt-1">{phoneErrors.officePhone}</p>
              )}
            </div>
            <div>
              <Input label="Personal Phone" name="personalPhone" value={formData.personalPhone} onChange={handleChange} />
              {phoneErrors.personalPhone && (
                <p className="text-red-600 text-sm mt-1">{phoneErrors.personalPhone}</p>
              )}
            </div>
          </div>

          {/* Row 5 */}
          <Input label="Address" name="address" value={formData.address} onChange={handleChange} full />

          {/* Row 6 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Birthday" type="date" name="birthday" value={formData.birthday} onChange={handleChange} />
            <Input label="Join Date" type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} />
          </div>

          {/* Row 7 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-medium text-[#122D3B] mb-1 block">Password</label>
              <PasswordInput
                placeholder="Enter Password"
                value={formData.password}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, password: value });
                  setPasswordStrength(getPasswordStrength(value));
                }}
              />
              {passwordStrength.level && (
                <p className={`mt-1 text-base font-semibold ${passwordStrength.color}`}>
                  Strength: {passwordStrength.level}
                </p>
              )}
            </div>

            <div>
              <label className="font-medium text-[#122D3B] mb-1 block">Confirm Password</label>
              <PasswordInput
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
            </div>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`text-white text-lg font-semibold p-3 rounded-lg transition duration-300 w-full ${
                isLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#122D3B] hover:bg-white hover:text-[#122D3B]"
              }`}
            >
              {isLoading ? "Registering..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="text-gray-700 text-xl text-center mt-6">
          Already have an account?{" "}
          <Link to="/employeelogin" className="text-[#122D3B] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </motion.div>
  );
};

export default EmployeeSignIn;

// Reusable Input Components
const PasswordInput = ({
  placeholder,
  value,
  onChange,
}: {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="py-1 px-2 pr-10 border border-gray-300 rounded-lg w-full"
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute top-1.5 right-2 text-gray-600"
      >
        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
      </button>
    </div>
  );
};

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  full = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  full?: boolean;
}) => (
  <label className={`font-medium text-[#122D3B] ${full ? "block" : ""}`}>
    <div className="mb-1">{label}</div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={`Enter ${label}`}
      required
      className="py-1 px-2 border border-gray-300 rounded-lg w-full placeholder:font-normal"
    />
  </label>
);
