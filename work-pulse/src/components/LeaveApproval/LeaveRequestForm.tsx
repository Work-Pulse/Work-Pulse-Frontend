import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import bg from "../../assets/images/bg.png";
import axios from "axios";

const LeaveRequestForm = () => {
  const navigate = useNavigate();

  // Updated Form state
  const [formData, setFormData] = useState({
    employeeName: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    leaveTime: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (startDate < today || endDate < today) {
      alert("Start Date and End Date must be today or a future date.");
      return;
    }

    if (endDate < startDate) {
      alert("End Date cannot be earlier than Start Date.");
      return;
    }

    axios.post("http://localhost:3030/leave/leaves", formData)
      .then((res) => {
        console.log("Success:", res.data);
        alert("Leave Request Submitted Successfully!");
        navigate("/leavedashboard");
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Submit failed");
      });
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
      <Link to="/leavedashboard" className="absolute top-6 left-6">
        <button className="flex items-center gap-2 text-text text-xl font-extrabold p-3 bg-red-500 rounded-lg hover:text-reject transition duration-300">
          <FaArrowLeft size={20} /> Back
        </button>
      </Link>

      <div className="bg-[#C6D2D5] p-8 rounded-2xl shadow-xl w-full max-w-3xl">
        <h1 className="text-center text-[#122D3B] text-3xl font-bold mb-6">Leave Request Form</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            {/* Employee Name */}
            <label className="font-medium text-[#122D3B]">
              Employee Name
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                placeholder="Enter your name"
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                required
              />
            </label>

            {/* Leave Type */}
            <label className="font-medium text-[#122D3B]">
              Leave Type
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                required
              >
                <option value="">Select Leave Type</option>
                <option value="Annual">Annual Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Casual">Casual Leave</option>
                <option value="Half Day">Half Day</option>
              </select>
            </label>

           {/* End Date */}
           <label className="font-medium text-[#122D3B]">
              End Date
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                required
              />
            </label>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4"> 
            {/* Start Date */}
            <label className="font-medium text-[#122D3B]">
              Start Date
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                required
              />
            </label>

            {/* Leave Time */}
            
            {/* <label className="font-medium text-[#122D3B]">
              Leave Time
              <input
                type="time"
                name="leaveTime"
                value={formData.leaveTime}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
              />
            </label> */}

            {formData.leaveType === "Half Day" && (
              <div className="col-span-2">
                <label className="font-medium text-[#122D3B]">
                  Leave Time
                  <input
                    type="time"
                    name="leaveTime"
                    value={formData.leaveTime}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="col-span-2">
            <button
              type="submit"
              className="text-white text-lg font-semibold p-3 bg-[#122D3B] rounded-lg hover:bg-white hover:text-[#122D3B] transition duration-300 w-full"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default LeaveRequestForm;
