import { Link } from 'react-router-dom';
import { FaTasks, FaClipboardList, FaSignOutAlt, FaChartLine, FaClipboardCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import bg from '../../assets/images/bg.png';

const EmployeeDashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}  
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6 "
      style={{ backgroundImage: `url(${bg})` }}>
      
      {/* Logout Button at Top Left */}
      <Link to='/employeelogin' className="absolute top-4 right-6">
        <button className="flex items-center gap-2 text-white text-lg font-semibold p-3 bg-red rounded-lg hover:text-[#ef4444] transition duration-300">
          <FaSignOutAlt size={20} /> Logout
        </button>
      </Link>

      {/* Dashboard Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 rounded-2xl w-full max-w-4xl">
        
        <Link to='/employeedetails' className="text-[#122D3B] text-xl font-semibold p-6 rounded-2xl transition duration-300 flex flex-col items-center gap-4 bg-white hover:bg-[#122D3B] hover:text-white shadow-md">
          <FaTasks size={64} />
          My details
        </Link>

        <Link to='/tracking' className="text-[#122D3B] text-xl font-semibold p-6 rounded-2xl transition duration-300 flex flex-col items-center gap-4 bg-white hover:bg-[#122D3B] hover:text-white shadow-md">
          <FaChartLine size={64} />
          Real-time Task Tracking
        </Link>

        <Link to='/leaverequestform' className="text-[#122D3B] text-xl font-semibold p-6 rounded-2xl transition duration-300 flex flex-col items-center gap-4 bg-white hover:bg-[#122D3B] hover:text-white shadow-md">
          <FaClipboardCheck size={64} />
          Leave Requests Approval
        </Link>

        <Link to='/reports' className="text-[#122D3B] text-xl font-semibold p-6 rounded-2xl transition duration-300 flex flex-col items-center gap-4 bg-white hover:bg-[#122D3B] hover:text-white shadow-md">
          <FaClipboardList size={64} />
          Reports & Analytics
        </Link>
        
      </div>
    </motion.div>
  );
};

export default EmployeeDashboard;
