import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import bg from "../../assets/images/bg.png";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";


const LeaveHistory = () => {

  const [officeMail, setOfficeMail] = useState<string | null>(null);
  const [leaveData, setLeaveData] = useState<any[]>([]);


  const [formData, setFormData] = useState({
    
    leaveType:"",
    startDate: "",
    endDate:"",
    leaveTime: "",
    status:""
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
  
  useEffect(() => {
    if (leaveData.length > 0) {
      const latestLeave = leaveData[0]; // or sort and pick the latest by date
      setFormData({
        leaveType: latestLeave.leaveType || "",
        startDate: latestLeave.startDate || "",
        endDate: latestLeave.endDate || "",
        leaveTime: latestLeave.leaveTime || "",
        status:latestLeave.status || "",
      });
    }
  }, [leaveData]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) return;

    const token = await user.getIdToken();

    try {
      // Update employee details
      await axios.put(
        `http://localhost:3030/leave/leave/update/${user.email}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refetch updated data
      await fetchLeaveData(user.email, token);
      alert("Employee details updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update employee details");
    }
  };

  // const handleDelete = (id: number) => {
  //   setLeaveRequests((prev) => prev.filter((leave) => leave.id !== id));
  // };

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
        <h2 className="text-2xl font-semibold text-[#122D3B] mb-3">All Leaves </h2> {officeMail}
        <div className="overflow-x-auto mb-6">
          <table className="w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-green-600 text-[#122D3B]">
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Start Date</th>
                <th className="p-3 text-left">End Date</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Status</th>
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3" colSpan={4}>No leave history available</td>
                  </tr>
                )}
              </tbody>

          </table>
          
        </div>
          
      </div>
    </motion.div>
  );
};

export default LeaveHistory;
