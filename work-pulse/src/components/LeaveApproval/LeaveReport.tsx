import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import bg from "../../assets/images/bg.png";

const LeaveReport = () => {
  // State to store leave requests
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, leaveType: "Annual", startDate: "2025-04-10", endDate: "2025-04-15", reason: "Family vacation", status: "Approved" },
    { id: 2, leaveType: "Sick", startDate: "2025-03-22", endDate: "2025-03-24", reason: "Fever and cold", status: "Pending" },
    { id: 3, leaveType: "Casual", startDate: "2025-05-05", endDate: "2025-05-06", reason: "Personal work", status: "Rejected" },
    { id: 4, leaveType: "Annual", startDate: "2025-02-18", endDate: "2025-02-18", reason: "Personal Matter", status: "Approved" },
    { id: 5, leaveType: "Sick", startDate: "2025-03-04", endDate: "2025-03-04", reason: "Fever", status: "Approved" },
    { id: 6, leaveType: "Annual", startDate: "2025-01-18", endDate: "2025-01-20", reason: "Personal Matter", status: "Rejected" },
  ]);

  // Filter leave requests
  const approvedLeaves = leaveRequests.filter((leave) => leave.status === "Approved");
  const pendingRejectedLeaves = leaveRequests.filter((leave) => leave.status === "Pending" || leave.status === "Rejected");

  // Function to handle updating a leave request
  const handleUpdate = (id: Number) => {
    console.log("Update clicked for ID:", id);
    // Logic for updating leave request (open modal, form, etc.)
  };

  // Function to handle deleting a leave request
  const handleDelete = (id: Number) => {
    const updatedRequests = leaveRequests.filter((leave) => leave.id !== id);
    setLeaveRequests(updatedRequests);
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
      <Link to="/leaverequestform" className="absolute top-6 left-6">
        <button className="flex items-center gap-2 text-white text-lg font-semibold p-3 bg-red-600 rounded-lg hover:bg-red-700 transition duration-300">
          <FaArrowLeft size={20} /> Back
        </button>
      </Link>

      <div className="bg-[#C6D2D5] p-8 rounded-2xl shadow-xl w-full max-w-4xl">
        <h1 className="text-center text-[#122D3B] text-3xl font-bold mb-6">Leave History</h1>

        {/* Approved Leave Table */}
        <h2 className="text-2xl font-semibold text-[#122D3B] mb-3">Approved Leaves</h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-green-600 text-[#122D3B]">
                <th className="p-3 text-left">Leave Type</th>
                <th className="p-3 text-left">Start Date</th>
                <th className="p-3 text-left">End Date</th>
                <th className="p-3 text-left">Reason</th>
              </tr>
            </thead>
            <tbody>
              {approvedLeaves.length > 0 ? (
                approvedLeaves.map((request) => (
                  <tr key={request.id} className="border-t border-gray-300">
                    <td className="p-3">{request.leaveType}</td>
                    <td className="p-3">{request.startDate}</td>
                    <td className="p-3">{request.endDate}</td>
                    <td className="p-3">{request.reason}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    No approved leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pending & Rejected Leave Table */}
        <h2 className="text-2xl font-semibold text-[#122D3B] mb-3">Pending & Rejected Leaves</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-red-600 text-[#122D3B]">
                <th className="p-3 text-left">Leave Type</th>
                <th className="p-3 text-left">Start Date</th>
                <th className="p-3 text-left">End Date</th>
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRejectedLeaves.length > 0 ? (
                pendingRejectedLeaves.map((request) => (
                  <tr key={request.id} className="border-t border-gray-300">
                    <td className="p-3">{request.leaveType}</td>
                    <td className="p-3">{request.startDate}</td>
                    <td className="p-3">{request.endDate}</td>
                    <td className="p-3">{request.reason}</td>
                    <td className={`p-3 font-semibold ${request.status === "Pending" ? "text-yellow-600" : "text-red-600"}`}>
                      {request.status}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleUpdate(request.id)}
                        className="bg-[#122D3B] hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(request.id)}
                        className="bg-[#122D3B] hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
                    No pending or rejected leave requests found.
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
