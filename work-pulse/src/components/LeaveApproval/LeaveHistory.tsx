import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import bg from "../../assets/images/bg.png";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const LeaveHistory = () => {
  const [officeMail, setOfficeMail] = useState<string | null>(null);
  const [leaveData, setLeaveData] = useState<any[]>([]);
  const [editingLeave, setEditingLeave] = useState<any>(null);

  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    leaveTime: "",
    status: ""
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        const token = await firebaseUser.getIdToken();
        setOfficeMail(firebaseUser.email);
        fetchLeaveData(firebaseUser.email, token);
      }
    });

    return () => unsubscribe();
  }, []);

  //fetch logged in employee leaves
  const fetchLeaveData = async (email: string, token: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3030/leave/leave/data/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeaveData(response.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const handleEditClick = (leave: any) => {
    setEditingLeave(leave);
    setFormData({
      leaveType: leave.leaveType || "",
      startDate: leave.startDate.split('T')[0] || "", 
      endDate: leave.endDate.split('T')[0] || "",
      leaveTime: leave.leaveTime || "",
      status: leave.status || "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email ) return;

    const token = await user.getIdToken();

    try {
      await axios.put(
        `http://localhost:3030/leave/leave/update/${user.email}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refetch updated data
      await fetchLeaveData(user.email, token);
      setEditingLeave(null); // Close the edit form
      alert("Leave updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update leave");
    }
  };

  const handleDelete = async (id: string) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) return;

    const token = await user.getIdToken();

    try {
      await axios.delete(`http://localhost:3030/leave/leave/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted leave from state
      setLeaveData((prev) => prev.filter((leave) => leave._id !== id));
      alert("Leave entry deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete leave entry");
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
      {/* Back Button */}
      <Link to="/leavedashboard" className="absolute top-6 left-6">
        <button className="flex items-center gap-2 text-text text-xl font-extrabold p-3 bg-red-500 rounded-lg hover:text-reject transition duration-300">
          <FaArrowLeft size={20} /> Back
        </button>
      </Link>

      <div className="bg-[#C6D2D5] p-8 rounded-2xl shadow-xl w-full max-w-4xl">
        <h1 className="text-center text-[#122D3B] text-3xl font-bold mb-6">Leave History</h1>

        {/* Approved Leaves Table */}
        <h2 className="text-2xl font-semibold text-[#122D3B] mb-3">All Leaves {officeMail}</h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-green-600 text-[#122D3B]">
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Start Date</th>
                <th className="p-3 text-left">End Date</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveData.length > 0 ? (
                leaveData.map((leave, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="p-3">{leave.leaveType}</td>
                    <td className="p-3">{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td className="p-3">{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td className="p-3">{leave.leaveTime}</td>
                    <td className="p-3">{leave.status}</td>
                    <td className="p-3 flex gap-2">
                      {leave.status === "Pending" && (
                        <button
                          onClick={() => handleEditClick(leave)}
                          className="bg-[#22c55e] text-white px-3 py-1 rounded hover:bg-blue-800 transition duration-300"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(leave._id)}
                        className="bg-[#b91c1c] text-white px-3 py-1 rounded hover:bg-red-700 transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3" colSpan={6}>No leave history available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Form */}
        {editingLeave && (
          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-semibold mb-4">Edit Leave Request</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <input
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Time</label>
                <input
                  type="time"
                  name="leaveTime"
                  value={formData.leaveTime}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-[#122D3B] text-white rounded hover:bg-blue-700 transition"
              >
                Update Leave
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LeaveHistory;