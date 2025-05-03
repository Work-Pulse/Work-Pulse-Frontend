import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import bg from '../../assets/images/bg.png';

ChartJS.register(ArcElement, Tooltip, Legend);

const Reports: React.FC = () => {
  // Filters
  const [dateFilter, setDateFilter] = useState<'all'|'lastWeek'|'lastMonth'|'lastYear'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'All'|'High'|'Medium'|'Low'>('All');

  // Summary counts
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount]     = useState(0);
  const [loading, setLoading]               = useState(false);

  // Fetch summary whenever filters change
  useEffect(() => {
    setLoading(true);
    fetch(
      `http://localhost:3030/api/report/completion` +
      `?dateFilter=${dateFilter}&priorityFilter=${priorityFilter}`
    )
      .then(res => res.json())
      .then(data => {
        setCompletedCount(data.completedCount);
        setPendingCount(data.pendingCount);
      })
      .catch(err => {
        console.error('Error fetching report:', err);
      })
      .finally(() => setLoading(false));
  }, [dateFilter, priorityFilter]);

  // Chart config
  const chartData = {
    labels: ['Completed', 'Pending'],
    datasets: [{
      data: [completedCount, pendingCount],
      backgroundColor: ['#22c55e', '#facc15'],
      hoverBackgroundColor: ['#16a34a', '#eab308'],
    }]
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Back Button */}
      <Link to="/managerdashboard" className="self-start mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition">
          <FaArrowLeft size={20} /> Back
        </button>
      </Link>

      {/* Header */}
      <h1 className="text-4xl font-extrabold mb-2 text-white -mt-4">
        Task Completion Report
      </h1>

      {/* Filters */}
      <div className="flex gap-6 mb-6">
        <div>
          <label className="block mb-1 font-semibold text-white">By Date</label>
          <select
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value as any)}
            className="p-2 rounded"
          >
            <option value="all">All Time</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastYear">Last Year</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold text-white">By Priority</label>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value as any)}
            className="p-2 rounded"
          >
            <option value="All">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Chart Container (transparent) */}
      <div className="w-full max-w-2xl bg-transparent p-8 rounded-xl shadow-lg mx-auto flex flex-col items-center">
        {loading ? (
          <p className="text-gray-500">Loading chart…</p>
        ) : (
          <div className="w-full h-96">
            <Pie data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Reports;
