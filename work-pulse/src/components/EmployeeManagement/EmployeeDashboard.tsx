import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import bg from '../../assets/images/bg.png';

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  // State to store the user's email (officeMail)
  const [officeMail, setOfficeMail] = useState<string | null>(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Set the officeMail (user's email)
        setOfficeMail(firebaseUser.email);
      } else {
        navigate("/employeelogin"); // Redirect to login if not authenticated
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
      <button onClick={handleLogout} className="absolute top-4 right-6 flex items-center gap-2 text-accent text-lg font-semibold p-3 bg-red rounded-lg hover:text-reject transition duration-300">
        <FaSignOutAlt size={20} /> Logout
      </button>

      {officeMail && (
        <div className="text-xl mb-2">
          <p>Logged in as: {officeMail}</p>
        </div>
      )}

      {/* Dashboard Buttons */}
      <div className="flex flex-nowrap justify-center gap-10 p-8 rounded-2xl w-full max-w-6xl overflow-x-auto">
        {/* Dashboard Links here */}
      </div>
    </motion.div>
  );
};

export default EmployeeDashboard;
