import { Link } from "react-router-dom";
import { FaUser, FaUserTie } from "react-icons/fa";
import { motion } from "framer-motion";

const UserSelection = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col justify-center items-center h-screen bg-background"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 rounded-2xl mb-8 w-full h-100 max-w-4xl">
        <button className="text-white text-xl font-semibold p-6 rounded-2xl transition duration-300 flex flex-col items-center gap-4 bg-text hover:bg-secondary hover:text-accent">
          <FaUser size={64} />
          Employee Login
        </button>
        <button className="text-white text-xl font-semibold p-6 rounded-2xl transition duration-300 flex flex-col items-center gap-4 bg-text hover:bg-secondary hover:text-accent">
          <FaUserTie size={64} />
          Manager Login
        </button>
      </div>
      <Link
        to="/"
        className="text-white h-100 text-xl font-semibold p-4 rounded-2xl transition duration-300 flex items-center gap-4 bg-text hover:bg-secondary hover:text-accent"
      >
        Back to Home
      </Link>
    </motion.div>
  );
};

export default UserSelection;
