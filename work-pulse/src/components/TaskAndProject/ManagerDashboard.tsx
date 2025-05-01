import { Link } from 'react-router-dom';
import { FaTasks, FaClipboardList, FaSignOutAlt, FaChartLine, FaClipboardCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import bg from '../../assets/images/bg.png';

const ManagerDashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}  
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6 "
      style={{ backgroundImage: `url(${bg})` }}>
      
      {/* Logout Button at Top Left */}
      <Link to='/managerlogin' className="absolute top-4 right-6">
        <button className="flex items-center gap-2 text-text text-xl font-bold p-3 bg-red rounded-lg hover:text-reject transition duration-300">
          <FaSignOutAlt size={20} /> Logout
        </button>
      </Link>

      {/* <h1 className="absolute top-4 left-1/2 transform -translate-x-1/2 text-3xl md:text-4xl pt-5 font-extrabold text-text drop-shadow-lg">
        Welcome to WorkPulse!
      </h1> */}

      {/* Dashboard Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 rounded-2xl w-full max-w-4xl">
        
        <Link to='/tasks' className="text-text text-xl font-semibold p-6 rounded-2xl transition duration-300 flex flex-col items-center gap-4 shadow-2xl hover:bg-accent hover:text-white">
          <FaTasks size={64} />
          Task Management
        </Link>

        <Link to='/monitor' className="text-text text-xl font-semibold p-6 rounded-2xl transition duration-300 flex flex-col items-center gap-4 shadow-2xl hover:bg-accent hover:text-white">
          <FaChartLine size={64} />
          Employee Tracking
        </Link>

        <Link to='/leave-requests' className="text-text text-xl font-semibold p-6 rounded-2xl transition duration-300 flex flex-col items-center gap-4 shadow-2xl hover:bg-accent hover:text-white">
          <FaClipboardCheck size={64} />
          Leave Requests Approval
        </Link>

        <Link to='/reports' className="text-text text-xl font-semibold p-6 rounded-2xl transition duration-300 flex flex-col items-center gap-4 shadow-2xl hover:bg-accent hover:text-white">
          <FaClipboardList size={64} />
          Reports & Analytics
        </Link>
        
      </div>
    </motion.div>
  );
};

export default ManagerDashboard;
