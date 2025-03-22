import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaFileExport,FaArrowLeft } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import bg from "../../assets/images/bg.png";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EmployeeReport = () => {
  // Example single employee data with working hours for each month
  const [employee] = useState({
    id: 1,
    name: "Emp1",
    department: "HR",
    joinDate: "2023-05-10",
    status: "Active",
    workingShift: "Full-Time", // Working shift
    monthlyHours: [
      160, // January
      150, // February
      170, // March
      165, // April
      160, // May
      155, // June
      168, // July
      150, // August
      160, // September
      158, // October
      162, // November
      155, // December
    ],
  });

  // Data for the chart
  const chartData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ], // Labels for each month
    datasets: [
      {
        label: "Working Hours",
        data: employee.monthlyHours, // Data for the working hours for each month
        backgroundColor: "#2196F3", // Color for the bars
        borderColor: "#1976D2", // Border color for each bar
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Employee Working Hours (Monthly)",
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw} hours`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Working Hours",
        },
        beginAtZero: true,
      },
    },
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
      {/* Employee Details */}
      <div className="bg-[#C6D2D5] p-10 rounded-2xl shadow-xl w-full max-w-4xl min-h-[400px]">
        <h2 className="text-3xl font-bold text-[#122D3B] mb-6">Employee Report</h2>
        <h3 className="text-xl font-semibold text-[#122D3B] mb-4">{employee.name}'s Working Report</h3>

        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <p className="font-medium text-[#122D3B]">Department:</p>
            <p>{employee.department}</p>
          </div>

          <div>
            <p className="font-medium text-[#122D3B]">Status:</p>
            <p>{employee.status}</p>
          </div>

          <div>
            <p className="font-medium text-[#122D3B]">Join Date:</p>
            <p>{employee.joinDate}</p>
          </div>

          <div>
            <p className="font-medium text-[#122D3B]">Working Shift:</p>
            <p>{employee.workingShift}</p>
          </div>
        </div>

        {/* Working Hours Chart */}
        <div className="mb-6">
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Export Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => console.log("Exporting report")}
            className="flex items-center gap-2 bg-[#122D3B] text-white px-6 py-3 rounded-lg hover:bg-[#0e1f2c] transition duration-300"
          >
            <FaFileExport size={18} /> Export Report
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeReport;
