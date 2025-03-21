import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import bg from '../../assets/images/bg.png';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('taskSummary');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6 relative"
      style={{ backgroundImage: `url(${bg})` }}>

      {/* Back Button */}
      <Link to='/managerdashboard' className="absolute top-2 left-6">
        <button className="flex items-center gap-2 text-text text-xl font-extrabold p-3 bg-red-500 rounded-lg hover:text-reject transition duration-300">
          <FaArrowLeft size={20} /> Back
        </button>
      </Link>

      {/* Heading */}
      <div className="text-text text-4xl font-extrabold mb-6">Reports & Analytics</div>

      {/* Report Tabs */}
      <div className="flex gap-4 mb-6 bg-white rounded-lg shadow-lg">
        <button
          onClick={() => setActiveReport('taskSummary')}
          className={`px-6 py-2 text-text font-bold transition rounded-l-lg duration-300 ${
            activeReport === 'taskSummary' ? 'bg-text text-white' : 'bg-gray-500 hover:bg-blue-400'
          }`}>
          Task Assignment Summary
        </button>

        <button
          onClick={() => setActiveReport('taskCompletion')}
          className={`px-6 py-2 text-text font-bold rounded-r-lg transition duration-300 ${
            activeReport === 'taskCompletion' ? 'bg-text text-white' : 'bg-gray-500 hover:bg-blue-400'
          }`}>
          Task Completion Report
        </button>
      </div>

      {/* Report Content */}
      <div className="w-full h-full max-w-6xl bg-white p-8 rounded-lg shadow-lg max-h-[600px] overflow-y-auto text-lg">
        <AnimatePresence>
          {/* Task Assignment Summary Report */}
          {activeReport === 'taskSummary' && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 0.4 }}>
              <h2 className="text-xl font-bold mb-4">Task Assignment Summary</h2>
              <p className="text-gray-600">No data available yet.</p>
            </motion.div>
          )}

          {/* Task Completion Report */}
          {activeReport === 'taskCompletion' && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 0.4 }}>
              <h2 className="text-xl font-bold mb-4">Task Completion Report</h2>
              <p className="text-gray-600">No data available yet.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Reports;
