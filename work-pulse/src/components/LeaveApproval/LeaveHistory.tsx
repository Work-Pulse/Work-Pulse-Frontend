import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import bg from "../../assets/images/bg.png";

interface LeaveRequest {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "Approved" | "Pending" | "Rejected";
}

const LeaveHistory = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    { id: 1, leaveType: "Annual", startDate: "2025-04-10", endDate: "2025-04-15", reason: "Family vacation", status: "Approved" },
    { id: 2, leaveType: "Sick", startDate: "2025-03-22", endDate: "2025-03-24", reason: "Fever and cold", status: "Pending" },
    { id: 3, leaveType: "Casual", startDate: "2025-05-05", endDate: "2025-05-06", reason: "Personal work", status: "Rejected" },
    { id: 4, leaveType: "Annual", startDate: "2025-02-18", endDate: "2025-02-18", reason: "Personal Matter", status: "Approved" },
    { id: 5, leaveType: "Sick", startDate: "2025-03-04", endDate: "2025-03-04", reason: "Fever", status: "Approved" },
    { id: 6, leaveType: "Annual", startDate: "2025-01-18", endDate: "2025-01-20", reason: "Personal Matter", status: "Rejected" },
  ]);

  const [editingLeave, setEditingLeave] = useState<LeaveRequest | null>(null);

  const approvedLeaves = leaveRequests.filter((leave) => leave.status === "Approved");
  const pendingRejectedLeaves = leaveRequests.filter((leave) => leave.status === "Pending" || leave.status === "Rejected");

  const handleEdit = (leave: LeaveRequest) => {
    setEditingLeave(leave);
  };

  const handleSave = () => {
    if (!editingLeave) return;

    setLeaveRequests((prev) =>
      prev.map((leave) => (leave.id === editingLeave.id ? editingLeave : leave))
    );
    setEditingLeave(null);
  };

  const handleDelete = (id: number) => {
    setLeaveRequests((prev) => prev.filter((leave) => leave.id !== id));
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

      <div className="bg-[#C6D2D5] p-8 rounded-2xl shadow-xl w-full max-w-4xl">
        <h1 className="text-center text-[#122D3B] text-3xl font-bold mb-6">Leave History</h1>

        {/* Approved Leaves Table */}
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
              {approvedLeaves.map((request) => (
                <tr key={request.id} className="border-t border-gray-300">
                  <td className="p-3">{request.leaveType}</td>
                  <td className="p-3">{request.startDate}</td>
                  <td className="p-3">{request.endDate}</td>
                  <td className="p-3">{request.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pending & Rejected Leaves Table */}
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
              {pendingRejectedLeaves.map((request) => (
                <tr key={request.id} className="border-t border-gray-300">
                  <td className="p-3">
                    {editingLeave?.id === request.id ? (
                      <input
                        type="text"
                        value={editingLeave.leaveType}
                        
                      />
                    ) : (
                      request.leaveType
                    )}
                  </td>
                  <td className="p-3">
                    {editingLeave?.id === request.id ? (
                      <input
                        type="date"
                        value={editingLeave.startDate}
                        onChange={(e) =>
                          setEditingLeave({ ...editingLeave, startDate: e.target.value })
                        }
                      />
                    ) : (
                      request.startDate
                    )}
                  </td>
                  <td className="p-3">
                    {editingLeave?.id === request.id ? (
                      <input
                        type="date"
                        value={editingLeave.endDate}
                        onChange={(e) =>
                          setEditingLeave({ ...editingLeave, endDate: e.target.value })
                        }
                      />
                    ) : (
                      request.endDate
                    )}
                  </td>
                  <td className="p-3">
                    {editingLeave?.id === request.id ? (
                      <input
                        type="text"
                        value={editingLeave.reason}
                        onChange={(e) =>
                          setEditingLeave({ ...editingLeave, reason: e.target.value })
                        }
                      />
                    ) : (
                      request.reason
                    )}
                  </td>
                  <td className="p-3 font-semibold">{request.status}</td>
                  <td className="p-3 flex gap-2">
                    {editingLeave?.id === request.id ? (
                      <button onClick={handleSave} className="bg-[#122D3B] text-white px-4 py-2 rounded-lg">
                        Save
                      </button>
                    ) : (
                      <button onClick={() => handleEdit(request)} className="bg-[#122D3B] text-white px-4 py-2 rounded-lg">
                        Edit
                      </button>
                    )}
                    <button onClick={() => handleDelete(request.id)} className="bg-[#122D3B] text-white px-4 py-2 rounded-lg">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
          
      </div>
    </motion.div>
  );
};

export default LeaveHistory;
