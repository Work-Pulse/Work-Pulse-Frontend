import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import bg from '../../assets/images/bg.png';

const initialRequests = [
  { id: 1, name: 'John Doe', date: '2025-03-18', time: '10:30 AM', leaveTime: '2:00 PM', reason: 'Doctor Appointment', status: 'Approved' },
  { id: 2, name: 'Jane Smith', date: '2025-03-17', time: '09:15 AM', leaveTime: '1:30 PM', reason: 'Family Emergency', status: 'Declined' },
  { id: 3, name: 'Michael Brown', date: '2025-03-16', time: '11:00 AM', leaveTime: '3:00 PM', reason: 'Personal Work', status: 'Approved' },
  { id: 4, name: 'Emily Davis', date: '2025-03-15', time: '08:45 AM', leaveTime: '12:00 PM', reason: 'Medical Checkup', status: 'Declined' }
];

const LeaveRequests = () => {
  const [activeTab, setActiveTab] = useState('approval');
  const [requests, setRequests] = useState(initialRequests.map(request => ({ ...request, message: '' })));

  const handleDecision = (id: number, status: string) => {
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === id ? { ...request, message: status } : request
      )
    );
    setTimeout(() => {
      setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
    }, 1500);
  };

  const handleDelete = (id: number) => {
    setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${bg})` }}>

      <Link to='/managerdashboard' className="absolute top-2 left-6">
        <button className="flex items-center gap-2 text-text text-xl font-extrabold p-3 bg-red-500 rounded-lg hover:text-reject transition duration-300">
          <FaArrowLeft size={20} /> Back
        </button>
      </Link>
      
      <div className="text-text text-4xl font-extrabold mb-6">Leave Requests</div>
      
      <div className="flex gap-3 mb-6 bg-white shadow-xl rounded-lg">
        <button onClick={() => setActiveTab('approval')} className={`px-5 py-2 font-bold rounded-l-lg transition duration-300 ${activeTab === 'approval' ? 'bg-text text-white' : 'bg-gray-500 hover:bg-blue-400'}`}>Approval</button>
        <button onClick={() => setActiveTab('history')} className={`px-5 py-2 font-bold rounded-r-lg transition duration-300 ${activeTab === 'history' ? 'bg-text text-white ' : 'bg-gray-500 hover:bg-blue-400'}`}>History</button>
      </div>

      <div className="w-full h-full max-w-6xl shadow-xl p-8 rounded-lg  max-h-[600px] overflow-y-auto text-lg">
        <AnimatePresence>

        
          {activeTab === 'approval' && requests.length > 0 && (
            requests.map((request, index) => (
              <motion.div key={request.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
                className={`p-6 border-b border-gray-300 mb-4 shadow-xl rounded-lg relative text-[#122D3B] font-semibold text-xl transition duration-300 ${index % 2 === 0 ? 'bg-[#e5e7eb]' : 'bg-[#d1d5db]'}`}>
                    
                <div className="grid grid-cols-2 gap-3">
                  <p><strong>Name:</strong> {request.name}</p>
                  <p><strong>Date:</strong> {request.date}</p>
                  <p><strong>Requested at:</strong> {request.time}</p>
                  <p><strong>Leave Time:</strong> {request.leaveTime}</p>
                  <p className="col-span-2"><strong>Reason:</strong> {request.reason}</p>
                </div>
                <div className="absolute top-1/2 right-6 transform -translate-y-1/2 flex gap-4">
                  <button onClick={() => handleDecision(request.id, 'Accepted!')} className="px-5 py-2 bg-[#22c55e] text-lg text-white rounded-lg hover:bg-green-700 transition duration-300">Accept</button>
                  <button onClick={() => handleDecision(request.id, 'Declined!')} className="px-5 py-2 bg-reject text-lg text-white rounded-lg hover:bg-red-700 transition duration-300">Decline</button>
                </div>
                {request.message && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
                    className={`mt-4 p-3 text-white font-semibold rounded text-center text-lg ${request.message === 'Accepted!' ? 'bg-[#122D3B]' : 'bg-[#122D3B]'}`}>
                    {request.message}
                  </motion.div>
                )}
              </motion.div>
            ))
          )}


          {activeTab === 'history' && (
            requests.map(request => (
              <motion.div key={request.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="text-2xl font-bold mb-4">
              
               <div className="p-6 border-b border-gray-300 mb-2 rounded-lg shadow-xl relative text-[#122D3B] font-semibold text-xl transition duration-300 bg-[#e5e7eb]">
                <div className="grid grid-cols-2 gap-3">
                  <p><strong>Name:</strong> {request.name}</p>
                  <p><strong>Date:</strong> {request.date}</p>
                  <p><strong>Requested at:</strong> {request.time}</p>
                  <p><strong>Leave Time:</strong> {request.leaveTime}</p>
                  <p className="col-span-2"><strong>Reason:</strong> {request.reason}</p>
                </div>

                {/* Approval Status (Centered Right) */}
                <div className="absolute top-1/2 right-6 transform -translate-y-1/2 text-2xl font-semibold flex gap-6 ">
                      {request.status === 'Approved' ? (
                        <span className="text-[#22c55e] flex items-center gap-2">
                          <FaCheckCircle size={20} /> Approved
                        </span>
                      ) : (
                        <span className="text-[#b91c1c] flex items-center gap-2">
                          <FaTimesCircle size={20} /> Declined
                        </span>
                      )}
                    </div>

                <button 
                  onClick={() => handleDelete(request.id)} 
                  className="absolute top-4 right-6 text-[#122D3B] hover:text-[#b91c1c] transition duration-300">
                  <FaTrash size={22} />
                </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LeaveRequests;
