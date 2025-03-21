import { Link } from 'react-router-dom';
import {  FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import bg from '../../assets/images/bg.png';

const EmployeeDetails = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}   
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6 "
      style={{ backgroundImage: `url(${bg})` }}>
      
      {/* Logout Button at Top Left */}
      <Link to='/employeedashboard' className="absolute top-2 left-6">
        <button className="flex items-center gap-2 text-white text-lg font-semibold p-3 bg-red rounded-lg hover:bg-red-700 transition duration-300">
          <FaArrowLeft size={20} /> Back
        </button>
      </Link>

      
    </motion.div>
  );
};

export default EmployeeDetails;