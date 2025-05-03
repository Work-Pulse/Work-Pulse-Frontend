import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaFileExport,FaArrowLeft } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import bg from "../../assets/images/bg.png";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";


// Register Chart.js components


const EmployeeReport = () => {
  const [officeMail, setOfficeMail] = useState<string | null>(null);
  const [employeeData, setEmployeeData] = useState<any>(null);

  const [formData, setFormData] = useState({
    designation: "",
    department: "",
    personalMail: "",
    personalPhone: "",
    address: "",
  });

  // Fetch logged-in employee data
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        const token = await firebaseUser.getIdToken();
        setOfficeMail(firebaseUser.email);
        fetchEmployeeData(firebaseUser.email, token);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchEmployeeData = async (email: string, token: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3030/employee/employee/data/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmployeeData(response.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    if (employeeData) {
      setFormData({
        designation: employeeData.designation || "",
        department: employeeData.department || "",
        personalMail: employeeData.personalMail || "",
        personalPhone: employeeData.personalPhone || "",
        address: employeeData.address || "",
      });
    }
  }, [employeeData]);


  const [tasks, setTasks] = useState<any[]>([]);

  const fetchTasks = async (userId: string, token: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3030/api/get-tasks/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (employeeData && employeeData.employeeId) {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          await fetchTasks(employeeData.employeeId, token);
        }
      }
    };
    fetchData();
  }, [employeeData]);

  const handleToggleTaskStatus = async (taskId: string, currentStatus: boolean) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
  
      const token = await user.getIdToken();
  
      await axios.patch(
        `http://localhost:3030/api/update-task-status/${taskId}`,
        { completed: !currentStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Update task list after status change
      const updatedTasks = tasks.map(task =>
        task._id === taskId ? { ...task, completed: !currentStatus } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Failed to update task status", error);
    }
  };

  const COLORS = ["#4CAF50", "#FF4B4B"]; // Green = completed, Red = pending


  const completedTasksCount = tasks.filter(task => task.completed).length;
  const pendingTasksCount = tasks.length - completedTasksCount;

const pieData = [
  { name: "Completed", value: completedTasksCount },
  { name: "Pending", value: pendingTasksCount },
];



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
      {/* Employee Details */}
      {employeeData && (
      <div className="bg-[#C6D2D5] p-10 rounded-2xl shadow-xl w-full max-w-4xl min-h-[400px]">
        <h2 className="text-3xl font-bold text-[#122D3B] mb-6">Employee Working Report</h2>
        <h3 className="text-xl font-semibold text-[#122D3B] mb-4">{employeeData.firstName} {employeeData.lastName}'s Working Report</h3>

        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <p className="font-medium text-[#122D3B]">Department:</p>
            <p>{employeeData.department}</p>
          </div>

          <div>
            <p className="font-medium text-[#122D3B]">Designation:</p>
            <p>{employeeData.designation}</p>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col items-center justify-center" >
       <h3 className="text-[#122D3B] text-3xl font-bold mb-1 mt-8">Task Completion Overview</h3>
          <PieChart width={500} height={350}>
            <Pie
              data={pieData}
              cx="60%"
              cy="60%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => console.log("Exporting report")}
            className="flex items-center gap-2 bg-[#122D3B] text-white px-6 py-3 rounded-lg hover:bg-[#0e1f2c] transition duration-300"
          >
            <FaFileExport size={18} /> Export Report
          </button>
        </div>
        
      </div>
        )}
    </motion.div>
  );
};

export default EmployeeReport;
