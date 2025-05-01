import { Link } from 'react-router-dom';
import { FaFileAlt ,  FaHistory , FaChartBar  ,FaArrowLeft} from 'react-icons/fa';
import { motion } from 'framer-motion';
import bg from '../../assets/images/bg.png';

const LeaveDashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}  
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${bg})` }}>
      
      {/* Back Button */}
      <Link to="/employeedashboard" className="absolute top-6 left-6">
        <button className="flex items-center gap-2 text-text text-xl font-extrabold p-3 bg-red-500 rounded-lg hover:text-reject transition duration-300">
          <FaArrowLeft size={20} /> Back
        </button>
      </Link>

      {/* Dashboard Buttons - Unified Design */}
      <div className="flex flex-nowrap justify-center gap-10 p-8 rounded-2xl w-full max-w-6xl overflow-x-auto">
        
        <Link to='/leaverequestform' className="w-64 h-48 text-[#122D3B] text-2xl font-semibold rounded-2xl transition duration-300 flex flex-col items-center justify-center gap-4 hover:bg-[#122D3B] hover:text-white shadow-xl">
          <FaFileAlt  size={80} />
          Request Form
        </Link>

        <Link to='/leavehistory' className="w-64 h-48 text-[#122D3B] text-2xl font-semibold rounded-2xl transition duration-300 flex flex-col items-center justify-center gap-4 hover:bg-[#122D3B] hover:text-white shadow-xl">
          <FaHistory  size={80} />
          Leave History
        </Link>

        <Link to='/leavereport' className="w-64 h-48 text-[#122D3B] text-2xl font-semibold rounded-2xl transition duration-300 flex flex-col items-center justify-center gap-4 hover:bg-[#122D3B] hover:text-white shadow-xl">
          <FaChartBar  size={80} />
          Reports & Analytics
        </Link>
        
      </div>
    </motion.div>
  );
};

export default LeaveDashboard;
