import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaUserClock, FaClipboardList } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import bg from '../../assets/images/bg.png';
import axios from 'axios';

import { FaClipboardCheck } from 'react-icons/fa6';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [officeMail, setOfficeMail] = useState<string | null>(null);
  const [employeeData, setEmployeeData] = useState({
    id: 0,  // Initialize id as a number
    firstName: '',
    lastName: '',
    designation: '',
    department: '',
  });

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setOfficeMail(firebaseUser.email);
        // Get Firebase ID Token
        const token = await firebaseUser.getIdToken();

        // Fetch employee data after setting officeMail
        if (firebaseUser.email) {
          try {
            const response = await axios.get(
              `http://localhost:3030/employee/employee/data/${firebaseUser.email}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,  // Add the Firebase token here
                },
              }
            );
            // Assuming the API response has an 'id' field
            setEmployeeData({
              ...response.data,
              id: response.data.id || 0,  // Ensure the 'id' is added correctly
            });
          } catch (error) {
            console.error('Error fetching employee data:', error);
          }
        }
      } else {
        navigate('/employeelogin'); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/employeelogin');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <button
        onClick={handleLogout}
        className="absolute top-4 right-6 flex items-center gap-2 text-accent text-lg font-semibold p-3 bg-red rounded-lg hover:text-reject transition duration-300"
      >
        <FaSignOutAlt size={20} /> Logout
      </button>

      {employeeData.firstName && (
        <div className="flex flex-col items-center justify-center bg-cover bg-center p-6 text-[#122D3B]">
          <p className='text-xl font-bold'>Welcome!</p>
          <p className='text-3xl font-bold'>{employeeData.firstName} {employeeData.lastName}</p>
          <p className='text-base font-semibold'>{employeeData.designation} - Department of {employeeData.department}</p>
        </div>
      )}

      {/* Dashboard Buttons */}
      <div className="flex flex-nowrap justify-center gap-10 p-8 rounded-2xl w-full max-w-6xl overflow-x-auto">
        
        <Link to='/employeedetails' className="w-64 h-48 text-[#122D3B] text-2xl font-semibold rounded-2xl transition duration-300 flex flex-col items-center justify-center gap-4 hover:bg-[#122D3B] hover:text-white shadow-xl">
          <FaUser size={80} />
          My Profile
        </Link>

        <Link to='/shift' className="w-64 h-48 text-[#122D3B] text-2xl font-semibold rounded-2xl transition duration-300 flex flex-col items-center justify-center gap-4 hover:bg-[#122D3B] hover:text-white shadow-xl">
          <FaUserClock size={80} />
          Shift
        </Link>

        <Link to='/leaverequestform' className="w-64 h-48 text-[#122D3B] text-2xl font-semibold rounded-2xl transition duration-300 flex flex-col items-center justify-center gap-4 hover:bg-[#122D3B] hover:text-white shadow-xl">
          <FaClipboardCheck size={80} />
          Leave Requests
        </Link>

        <Link to='/employeereport' className="w-64 h-48 text-[#122D3B] text-2xl font-semibold rounded-2xl transition duration-300 flex flex-col items-center justify-center gap-4 hover:bg-[#122D3B] hover:text-white shadow-xl">
          <FaClipboardList size={80} />
          Reports & Analytics
        </Link>
      </div>

      {officeMail && (
        <div className="text-base mb-2">
          <p>Logged in as: {officeMail}</p>
        </div>
      )}

    </motion.div>
  );
};

export default EmployeeDashboard;
