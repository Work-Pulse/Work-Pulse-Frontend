import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import bg from "../../assets/images/bg.png";

const LeaveReport = () => {
  // Sample leave requests data (Replace this with API data)
  const [leaveRequests] = useState([
    {
      id: 1,
      leaveType: "Annual",
      startDate: "2025-04-10",
      endDate: "2025-04-15",
      reason: "Family vacation",
      status: "Approved",
    },
    {
      id: 2,
      leaveType: "Sick",
      startDate: "2025-03-22",
      endDate: "2025-03-24",
      reason: "Fever and cold",
      status: "Pending",
    },
    {
      id: 3,
      leaveType: "Casual",
      startDate: "2025-05-05",
      endDate: "2025-05-06",
      reason: "Personal work",
      status: "Rejected",
    },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
        {/* Back Button */}
              <Link to="/leaverequestform" className="absolute top-6 left-6">
                <button className="flex items-center gap-2 text-white text-lg font-semibold p-3 bg-red-600 rounded-lg hover:bg-red-700 transition duration-300">
                  <FaArrowLeft size={20} /> Back
                </button>
              </Link>
      <div className="bg-[#C6D2D5] p-8 rounded-2xl shadow-xl w-full max-w-4xl">
        <h1 className="text-center text-[#122D3B] text-3xl font-bold mb-6">Leave Report</h1>

        {/* Leave Report Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-[#122D3B] text-white">
                <th className="p-3 text-left">Leave Type</th>
                <th className="p-3 text-left">Start Date</th>
                <th className="p-3 text-left">End Date</th>
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.length > 0 ? (
                leaveRequests.map((request) => (
                  <tr key={request.id} className="border-t border-gray-300">
                    <td className="p-3">{request.leaveType}</td>
                    <td className="p-3">{request.startDate}</td>
                    <td className="p-3">{request.endDate}</td>
                    <td className="p-3">{request.reason}</td>
                    <td
                      className={`p-3 font-semibold ${
                        request.status === "Approved"
                          ? "text-green-600"
                          : request.status === "Pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {request.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-6">
          <Link
            to="/employeedashboard"
            className="bg-[#122D3B] hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default LeaveReport;
