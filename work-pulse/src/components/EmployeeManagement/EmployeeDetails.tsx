import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaSave } from "react-icons/fa";
import { motion } from "framer-motion";
import bg from "../../assets/images/bg.png";

const EmployeeDetails = () => {
  // Employee state (initial values)
  const [employee, setEmployee] = useState({
    firstName: "Emp1",
    lastName: "Emppp",
    joinDate: "2023-05-10",
    birthday: "1995-08-15",
    officeMail: "emp1@workpulse.com",
    personalMail: "emp1emppp@gmail.com",
    officePhone: "+1234567890",
    personalPhone: "+0987654321",
    address: "12/C, Gothatuwa Rd, Thalawakale",
  });

  const [isEditing, setIsEditing] = useState(false); // Track edit mode

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Back Button */}
      <Link to="/employeedashboard" className="absolute top-6 left-6">
        <button className="flex items-center gap-2 text-white text-lg font-semibold p-3 bg-red-600 rounded-lg hover:bg-red-700 transition duration-300">
          <FaArrowLeft size={20} /> Back
        </button>
      </Link>

      {/* Employee Details Card (Increased Height & Centered Title) */}
      <div className="bg-[#C6D2D5] p-10 rounded-2xl shadow-xl w-full max-w-4xl min-h-[500px]">
        {/* Centered Title */}
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-[#122D3B] text-3xl font-bold">Employee Details</h2>
        </div>

        {/* Edit/Save Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 text-white bg-[#122D3B] px-4 py-2 rounded-lg hover:bg-[#0e1f2c] transition duration-300"
          >
            {isEditing ? <><FaSave size={18} /> Save</> : <><FaEdit size={18} /> Edit</>}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <label className="font-medium text-[#122D3B]">First Name:</label>
            <input
              type="text"
              name="firstName"
              value={employee.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              className="border border-gray-300 p-3 rounded-lg bg-white w-full"
            />

            <label className="font-medium text-[#122D3B]">Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={employee.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              className="border border-gray-300 p-3 rounded-lg bg-white w-full"
            />

            <label className="font-medium text-[#122D3B]">Join Date:</label>
            <input
              type="date"
              name="joinDate"
              value={employee.joinDate}
              onChange={handleChange}
              disabled={!isEditing}
              className="border border-gray-300 p-3 rounded-lg bg-white w-full"
            />

            <label className="font-medium text-[#122D3B]">Birthday:</label>
            <input
              type="date"
              name="birthday"
              value={employee.birthday}
              onChange={handleChange}
              disabled={!isEditing}
              className="border border-gray-300 p-3 rounded-lg bg-white w-full"
            />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <label className="font-medium text-[#122D3B]">Office Email:</label>
            <input
              type="email"
              name="officeMail"
              value={employee.officeMail}
              onChange={handleChange}
              disabled={!isEditing}
              className="border border-gray-300 p-3 rounded-lg bg-white w-full"
            />

            <label className="font-medium text-[#122D3B]">Personal Email:</label>
            <input
              type="email"
              name="personalMail"
              value={employee.personalMail}
              onChange={handleChange}
              disabled={!isEditing}
              className="border border-gray-300 p-3 rounded-lg bg-white w-full"
            />

            <label className="font-medium text-[#122D3B]">Office Phone:</label>
            <input
              type="tel"
              name="officePhone"
              value={employee.officePhone}
              onChange={handleChange}
              disabled={!isEditing}
              className="border border-gray-300 p-3 rounded-lg bg-white w-full"
            />

            <label className="font-medium text-[#122D3B]">Personal Phone:</label>
            <input
              type="tel"
              name="personalPhone"
              value={employee.personalPhone}
              onChange={handleChange}
              disabled={!isEditing}
              className="border border-gray-300 p-3 rounded-lg bg-white w-full"
            />
          </div>

          {/* Full-width Address Field */}
          <div className="col-span-2">
            <label className="font-medium text-[#122D3B]">Address:</label>
            <input
              type="text"
              name="address"
              value={employee.address}
              onChange={handleChange}
              disabled={!isEditing}
              className="border border-gray-300 p-3 rounded-lg bg-white w-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeDetails;
