import { Link } from "react-router-dom";
import { FaUser, FaUserTie } from "react-icons/fa";
import { motion } from "framer-motion";
import bg from '../assets/images/bg.png';

const UserSelection = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6 "
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 rounded-2xl mb-8 w-full h-100 max-w-4xl">
        <button className="text-text text-xl shadow-xl font-semibold p-6 rounded-2xl transition duration-300 flex flex-col items-center gap-4 hover:bg-text hover:text-background">
          <FaUser size={64} />
          Employee Login
        </button>

        <Link to = '/managerlogin' className="text-text text-xl shadow-xl font-semibold p-6 rounded-2xl transition duration-300 flex flex-col items-center gap-4  hover:bg-text hover:text-background">
          <FaUserTie size={64} />
          Manager Login
        </Link>
      </div>
      <Link
        to="/"
        className="text-background h-100 text-xl outline-[#6b7280] font-semibold p-4 rounded-2xl transition duration-300 flex items-center gap-4 bg-text hover:bg-background hover:text-text"
      >
        Back to Home!
      </Link>
    </motion.div>
  );
};

export default UserSelection;
