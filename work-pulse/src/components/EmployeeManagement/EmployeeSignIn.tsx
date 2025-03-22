import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import bg from "../../assets/images/bg.png";
import PasswordInput from "./PasswordInput";

const EmployeeSignIn = () => {
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    officeMail: "",
    personalMail: "",
    officePhone: "",
    personalPhone: "",
    joinDate: "",
    birthday: "",
    address: "",
    username: "", // Added username field
    password: "",
    confirmPassword: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-[#C6D2D5] p-8 rounded-2xl shadow-xl w-full max-w-3xl">
        <h1 className="text-center text-[#122D3B] text-3xl font-bold mb-6">Employee Sign Up</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <label className="font-medium text-[#122D3B]">
              First Name
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                required
              />
            </label>

            <label className="font-medium text-[#122D3B]">
              Office Email
              <input
                type="email"
                name="officeMail"
                value={formData.officeMail}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                required
              />
            </label>

            <label className="font-medium text-[#122D3B]">
              Office Phone Number
              <input
                type="tel"
                name="officePhone"
                value={formData.officePhone}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                required
              />
            </label>

            <label className="font-medium text-[#122D3B]">
              Birthday
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                required
              />
            </label>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <label className="font-medium text-[#122D3B]">
              Last Name
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                required
              />
            </label>

            <label className="font-medium text-[#122D3B]">
              Personal Email
              <input
                type="email"
                name="personalMail"
                value={formData.personalMail}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                required
              />
            </label>

            <label className="font-medium text-[#122D3B]">
              Personal Phone Number
              <input
                type="tel"
                name="personalPhone"
                value={formData.personalPhone}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                required
              />
            </label>

            <label className="font-medium text-[#122D3B]">
              Join Date
              <input
                type="date"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                required
              />
            </label>
          </div>

          {/* Address Field - Full Width */}
          <div className="col-span-2">
            <label className="font-medium text-[#122D3B]">
              Address
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                required
              />
            </label>
          </div>


          {/* Password Fields - Full Width */}
          <div className="col-span-2 flex flex-col gap-4">
          <label className="font-medium text-[#122D3B]">
              Username
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full "
                required
              />
            </label>
            <label className="font-medium text-[#122D3B]">
              Password
              <PasswordInput
                placeholder="Enter Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </label>

            <label className="font-medium text-[#122D3B]">
              Confirm Password
              <PasswordInput
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </label>
          </div>

          {/* Sign-Up Button */}
          <div className="col-span-2">
          <Link to="/employeelogin">
            <button
              type="submit"
              className="text-white text-lg font-semibold p-3 bg-[#122D3B] rounded-lg hover:bg-white hover:text-[#122D3B] transition duration-300 w-full"
            >
              Sign Up
            </button>
            </Link>
          </div>
        </form>

        <p className="text-gray-700 text-xl text-center mt-4">
          Already have an account?{" "}
          <Link to="/employeelogin" className="text-[#122D3B] font-semibold hover:underline">
            Login
          </Link>
        </p>

        {/* Back to Home Button */}
        <div className="text-center mt-4">
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
