import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import bg from "../../assets/images/bg.png";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const LeaveReport = () => {
  const [officeMail, setOfficeMail] = useState<string | null>(null);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [leaveData, setLeaveData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([]);

  
  const COLORS = ["#FFA500", "#28a745", "#dc3545"]; // Pending, Approved, Rejected

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
    try {
      const res = await axios.get(
        `http://localhost:3030/leave/leave/data/${email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeaveData(res.data);
      setEmployeeData(res.data);
      // Count status types
      const statusCount = res.data.reduce(
        (acc: any, curr: any) => {
          acc[curr.status] = (acc[curr.status] || 0) + 1;
          return acc;
        },
        {}
      );
      setStatusData([
        { name: "Pending", value: statusCount.Pending || 0 },
        { name: "Approved", value: statusCount.Approved || 0 },
        { name: "Rejected", value: statusCount.Declined || 0 },
      ]);
    } catch (error) {
      console.error("Failed to fetch leave data:", error);
    }
  }
  

  

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
      {employeeData && (
      <div className="bg-[#C6D2D5] p-8 rounded-2xl shadow-xl w-full max-w-4xl mt-16">
        <h1 className="text-center text-[#122D3B] text-3xl font-bold mb-6">Leave Report</h1>
        
        <div className="w-full max-w-md mx-auto my-10 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-center text-accent mb-4">Leave Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
       )}
    </motion.div>
  );
};

export default LeaveReport;
