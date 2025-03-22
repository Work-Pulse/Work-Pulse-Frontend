import { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";

import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import bg from "../../assets/images/bg.png";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface LeaveRequest {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "Approved" | "Pending" | "Rejected";
}

const LeaveReport = () => {
  const [leaveRequests] = useState<LeaveRequest[]>([
    { id: 1, leaveType: "Annual", startDate: "2025-04-10", endDate: "2025-04-15", reason: "Family vacation", status: "Approved" },
    { id: 2, leaveType: "Sick", startDate: "2025-03-22", endDate: "2025-03-24", reason: "Fever and cold", status: "Pending" },
    { id: 3, leaveType: "Casual", startDate: "2025-05-05", endDate: "2025-05-06", reason: "Personal work", status: "Rejected" },
    { id: 4, leaveType: "Annual", startDate: "2025-02-18", endDate: "2025-02-18", reason: "Personal Matter", status: "Approved" },
    { id: 5, leaveType: "Sick", startDate: "2025-03-04", endDate: "2025-03-04", reason: "Fever", status: "Approved" },
    { id: 6, leaveType: "Annual", startDate: "2025-01-18", endDate: "2025-01-20", reason: "Personal Matter", status: "Rejected" },
  ]);

  // Aggregate leave data by leave type and status
  const leaveStats = useMemo(() => {
    const stats = leaveRequests.reduce((acc, leave) => {
      if (!acc[leave.leaveType]) {
        acc[leave.leaveType] = { Approved: 0, Pending: 0, Rejected: 0 };
      }
      acc[leave.leaveType][leave.status] += 1;
      return acc;
    }, {} as Record<string, { Approved: number; Pending: number; Rejected: number }>);

    return stats;
  }, [leaveRequests]);

  // Chart data
  const chartData = {
    labels: Object.keys(leaveStats), // Leave types (Annual, Sick, Casual, etc.)
    datasets: [
      {
        label: "Approved",
        data: Object.values(leaveStats).map((stat) => stat.Approved),
        backgroundColor: "#4CAF50",
      },
      {
        label: "Pending",
        data: Object.values(leaveStats).map((stat) => stat.Pending),
        backgroundColor: "#FFEB3B",
      },
      {
        label: "Rejected",
        data: Object.values(leaveStats).map((stat) => stat.Rejected),
        backgroundColor: "#F44336",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Leave Requests by Type and Status",
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw} leave(s)`;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Leave Types" },
      },
      y: {
        title: { display: true, text: "Number of Leaves" },
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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
        <Link to="/leavehistory" className="absolute top-6 left-6">
        <button className="flex items-center gap-2 text-white text-lg font-semibold p-3 bg-red-600 rounded-lg hover:bg-red-700 transition duration-300">
          <FaArrowLeft size={20} /> Back
        </button>
      </Link>
      <div className="bg-[#C6D2D5] p-8 rounded-2xl shadow-xl w-full max-w-4xl">
        <h1 className="text-center text-[#122D3B] text-3xl font-bold mb-6">Leave Report</h1>

        {/* Leave Statistics Chart */}
        <div className="mb-6">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div className="text-center mt-8">
          <p className="text-lg text-[#122D3B]">This report shows the number of leaves requested, categorized by leave type and status.</p>
        </div>
      </div>
    </div>
    </motion.div>
  );
};


export default LeaveReport;
