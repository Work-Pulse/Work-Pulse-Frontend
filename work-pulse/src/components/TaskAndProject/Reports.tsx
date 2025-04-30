import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import bg from '../../assets/images/bg.png';

ChartJS.register(ArcElement, Tooltip, Legend);

const initialTasks = [
  { id: 1, name: 'Alice Johnson', assignedDate: '2025-03-18', deadline: '2025-03-25', description: 'Develop login authentication', status: 'In Progress', priority: 'High' },
  { id: 2, name: 'Bob Smith', assignedDate: '2025-03-17', deadline: '2025-03-22', description: 'Design homepage UI', status: 'Completed', priority: 'Medium' },
  { id: 3, name: 'Charlie Brown', assignedDate: '2025-03-16', deadline: '2025-03-20', description: 'Integrate API services', status: 'Pending', priority: 'Low' },
  { id: 4, name: 'Diana Prince', assignedDate: '2025-03-15', deadline: '2025-03-19', description: 'Create user profile page', status: 'Completed', priority: 'High' },
  { id: 5, name: 'Ethan Hunt', assignedDate: '2025-03-14', deadline: '2025-03-18', description: 'Fix database schema', status: 'Pending', priority: 'Medium' },
];

const Reports = () => {
  const [activeReport, setActiveReport] = useState('taskSummary');
  const [tasks, setTasks] = useState(initialTasks);

  const handleDelete = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const taskCompletionData = {
    labels: ['High Priority', 'Medium Priority', 'Low Priority'],
    datasets: [
      {
        label: 'Completed Tasks by Priority',
        data: [
          tasks.filter((task) => task.priority === 'High' && task.status === 'Completed').length,
          tasks.filter((task) => task.priority === 'Medium' && task.status === 'Completed').length,
          tasks.filter((task) => task.priority === 'Low' && task.status === 'Completed').length,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF4D6D', '#2C98D9', '#FFC233'],
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6 relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Back Button */}
      <Link to="/managerdashboard" className="absolute top-2 left-6">
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
          }`}
        >
          Task Assignment Summary
        </button>

        <button
          onClick={() => setActiveReport('taskCompletion')}
          className={`px-6 py-2 text-text font-bold rounded-r-lg transition duration-300 ${
            activeReport === 'taskCompletion' ? 'bg-text text-white' : 'bg-gray-500 hover:bg-blue-400'
          }`}
        >
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
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl font-bold mb-4">Task Assignment Summary</h2>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-6 border-b border-gray-300 mb-4 shadow-xl rounded-lg relative bg-[#e5e7eb]"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <p>
                        <strong>Name:</strong> {task.name}
                      </p>
                      <p>
                        <strong>Assigned Date:</strong> {task.assignedDate}
                      </p>
                      <p>
                        <strong>Deadline:</strong> {task.deadline}
                      </p>
                      <p className="col-span-2">
                        <strong>Description:</strong> {task.description}
                      </p>
                      <p className="flex items-center gap-2">
                        <strong>Status:</strong>
                        {task.status === 'Pending' && (
                          <span className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                            <span className="text-accent bg-yellow-100 font-semibold px-3 py-1 rounded-lg">Pending</span>
                          </span>
                        )}
                        {task.status === 'In Progress' && (
                          <span className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                            <span className="text-reject bg-blue-100 font-semibold px-3 py-1 rounded-lg">In Progress</span>
                          </span>
                        )}
                        {task.status === 'Completed' && (
                          <span className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-green-500"></span>
                            <span className="text-[#22c55e] bg-green-100 font-semibold px-3 py-1 rounded-lg">Completed</span>
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="absolute top-4 right-6 text-[#122D3B] hover:text-[#b91c1c] transition duration-300"
                    >
                      <FaTrash size={22} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No tasks available.</p>
              )}
            </motion.div>
          )}

          {/* Task Completion Report */}
          {activeReport === 'taskCompletion' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl font-bold mb-4">Task Completion Report</h2>
              <div className="w-full max-w-md mx-auto">
                <Pie data={taskCompletionData} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Reports;