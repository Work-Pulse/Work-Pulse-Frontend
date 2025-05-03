import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import bg from '../../assets/images/bg.png';

interface LeaveRequest {
  _id: string;
  firstName: string;
  officeMail: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  leaveTime: string;
  status: string;
  
}

const LeaveRequests = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get('http://localhost:3030/leave/leaves');
        setRequests(response.data);
      } catch (error) {
        console.error('Failed to fetch leave requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  //approve and decline
const handleApprove = async (id: string) => {
  try {
    await axios.patch(`http://localhost:3030/leave/leaves/${id}/approve`); 
    setRequests(requests.map(req => 
      req._id === id ? {...req, status: 'Approved'} : req
    ));
  } catch (error) {
    console.error('Failed to approve request:', error);
  }
};

const handleReject = async (id: string) => {
  try {
    await axios.patch(`http://localhost:3030/leave/leaves/${id}/reject`);
    setRequests(requests.map(req => 
      req._id === id ? {...req, status: 'Declined'} : req
    ));
  } catch (error) {
    console.error('Failed to reject request:', error);
  }
};

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Link to='/managerdashboard' className="absolute top-2 left-6">
        <button className="flex items-center gap-2 text-text text-xl font-extrabold p-3 bg-red-500 rounded-lg hover:text-reject transition duration-300">
          <FaArrowLeft size={20} /> Back
        </button>
      </Link>

      <div className="text-text text-4xl font-extrabold mb-6">All Leave Requests</div>

      <div className="w-full max-w-6xl shadow-xl p-8 rounded-lg max-h-[600px] overflow-y-auto text-lg bg-white">
        {loading ? (
          <p className="text-center text-xl font-semibold">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-xl font-semibold">No leave records found.</p>
        ) : (
          <AnimatePresence>
            {requests.map((request, index) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className={`p-6 mb-4 shadow-md rounded-lg text-[#122D3B] font-semibold text-xl ${
                  index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
                }`}
              >
                <div className="grid grid-cols-2 gap-4">
                  <p><strong>Name:</strong> {request.firstName}</p>
                  <p><strong>Email:</strong> {request.officeMail}</p>
                  <p><strong>Leave Type:</strong> {request.leaveType}</p>
                  <p><strong>Start Date:</strong> {request.startDate}</p>
                  <p><strong>End Date:</strong> {request.endDate}</p>
                  <p><strong>Leave Time:</strong> {request.leaveTime}</p>
                 
               
               <div className="mt-4 text-xl flex justify-between items-center">
                  {request.status === 'Approved' ? (
                    <span className="text-[#22c55e] flex items-center gap-2 ml-auto">
                      <FaCheckCircle /> Approved
                    </span>
                  ) : request.status === 'Declined' ? (
                    <span className="text-[#b91c1c] flex items-center gap-2 ml-auto">
                      <FaTimesCircle /> Declined
                    </span>
                  ) : (
                    <>
                      <span className="text-[#122D3B] flex items-center gap-2">
                        ⏳ Pending
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApprove(request._id)}
                          className="bg-[#22c55e] text-white px-3 py-1 rounded hover:bg-green-600 transition"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(request._id)}
                          className="bg-[#b91c1c] text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </>
                  )}
                </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default LeaveRequests;
