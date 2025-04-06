import { Link } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaUserClock, FaClipboardCheck, FaClipboardList } from 'react-icons/fa';
import { motion } from 'framer-motion';
import bg from '../../assets/images/bg.png';

const EmployeeDashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}  
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${bg})` }}>
      
      {/* Logout Button at Top Right */}
      <Link to='/employeelogin' className="absolute top-4 right-6">
        <button className="flex items-center gap-2 text-accent text-lg font-semibold p-3 bg-red rounded-lg hover:text-reject transition duration-300">
          <FaSignOutAlt size={20} /> Logout
        </button>
      </Link>

      {/* Dashboard Buttons - Unified Design */}
      <div className="flex flex-nowrap justify-center gap-10 p-8 rounded-2xl w-full max-w-6xl overflow-x-auto">
        
        <Link to='/employeedetails' className="w-64 h-48 text-[#122D3B] text-2xl font-semibold rounded-2xl transition duration-300 flex flex-col items-center justify-center gap-4 hover:bg-[#122D3B] hover:text-white shadow-xl">
          <FaUser size={80} />
          My Profile
        </Link>

        <Link to='/shift' className="w-64 h-48 text-[#122D3B] text-2xl font-semibold rounded-2xl transition duration-300 flex flex-col items-center justify-center gap-4 hover:bg-[#122D3B] hover:text-white shadow-xl">
          <FaUserClock size={80} />
          Shift
        </Link>

        <Link to='/leavedashboard' className="w-64 h-48 text-[#122D3B] text-2xl font-semibold rounded-2xl transition duration-300 flex flex-col items-center justify-center gap-4 hover:bg-[#122D3B] hover:text-white shadow-xl">
          <FaClipboardCheck size={80} />
          Leave Requests
        </Link>

        <Link to='/employeereport' className="w-64 h-48 text-[#122D3B] text-2xl font-semibold rounded-2xl transition duration-300 flex flex-col items-center justify-center gap-4 hover:bg-[#122D3B] hover:text-white shadow-xl">
          <FaClipboardList size={80} />
          Reports & Analytics
        </Link>
        
      </div>
    </motion.div>
  );
};

export default EmployeeDashboard;
