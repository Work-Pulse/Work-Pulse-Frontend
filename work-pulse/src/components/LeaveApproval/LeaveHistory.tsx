// src/components/LeaveHistory.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import bg from "../../assets/images/bg.png";

export default function LeaveHistory() {
  const [officeMail, setOfficeMail] = useState<string | null>(null);
  const [leaveData, setLeaveData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    leaveTime: "",
    status: ""
  });

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        const token = await user.getIdToken();
        setOfficeMail(user.email);
        fetchLeaves(user.email, token);
      }
    });
    return () => unsub();
  }, []);

  async function fetchLeaves(email: string, token: string) {
    const res = await axios.get(
      `http://localhost:3030/leave/leave/data/${email}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setLeaveData(res.data);
  }

  function handleEditClick(leave: any) {
    setEditingId(leave._id);
    setFormData({
      leaveType: leave.leaveType,
      startDate: leave.startDate.split("T")[0],
      endDate: leave.endDate.split("T")[0],
      leaveTime: leave.leaveTime || "",
      status: leave.status
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleUpdate() {
    if (!editingId) return;
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user?.email) return;
    const token = await user.getIdToken();

    try {
      await axios.put(
        `http://localhost:3030/leave/leave/update/${editingId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchLeaves(user.email, token);
      setEditingId(null);
      Swal.fire("Updated!", "Leave request updated successfully.", "success");
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire("Error", "Could not update leave.", "error");
    }
  }

  async function handleDelete(id: string) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user?.email) return;
    const token = await user.getIdToken();

    try {
      await axios.delete(`http://localhost:3030/leave/leave/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaveData((prev) => prev.filter((l) => l._id !== id));
      Swal.fire("Deleted!", "Leave request deleted.", "success");
    } catch (error) {
      console.error("Delete failed:", error);
      Swal.fire("Error", "Could not delete leave.", "error");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Back Button */}
      <Link to="/leavedashboard" className="absolute top-6 left-6">
        <button className="flex items-center gap-2 bg-reject text-white p-3 rounded-lg hover:opacity-80 transition">
          <FaArrowLeft /> Back
        </button>
      </Link>

      <div className="bg-primary p-8 rounded-2xl shadow-xl w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-accent mb-6">Leave History</h1>
        <h2 className="text-xl font-semibold text-text mb-4">
          All Leaves for {officeMail}
        </h2>

        <div className="overflow-x-auto mb-6">
          <table className="w-full bg-white border border-gray rounded-lg">
            <thead>
              <tr className="bg-accept text-text">
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Start</th>
                <th className="p-3 text-left">End</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveData.length ? (
                leaveData.map((leave) => (
                  <tr key={leave._id} className="border-t border-gray">
                    <td className="p-3 text-text">{leave.leaveType}</td>
                    <td className="p-3 text-text">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-text">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-text">{leave.leaveTime}</td>
                    <td className="p-3 text-text">{leave.status}</td>
                    <td className="p-3 flex gap-2">
                      {leave.status === "Pending" && (
                        <button
                          onClick={() => handleEditClick(leave)}
                          className="bg-secondary text-white px-3 py-1 rounded hover:opacity-80 transition"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(leave._id)}
                        className="bg-reject text-white px-3 py-1 rounded hover:opacity-80 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-3 text-center text-text">
                    No leave history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {editingId && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl text-accent mb-4">Edit Leave Request</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {["leaveType","startDate","endDate","leaveTime","status"].map((field) => (
                <div key={field}>
                  <label className="block mb-1 text-text capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    name={field}
                    type={
                      field.includes("Date") ? "date"
                      : field === "leaveTime" ? "time"
                      : "text"
                    }
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray rounded bg-white text-text"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-accept text-white rounded hover:opacity-80 transition"
              >
                Update Leave
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
