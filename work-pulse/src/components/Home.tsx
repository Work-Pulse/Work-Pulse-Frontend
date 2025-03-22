import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import bg from '../assets/images/bg.png'
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }} 
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6 "
      style={{ backgroundImage: `url(${bg})` }}

    >
      <div className="rounded-2xl p-6 max-w-lg w-full text-center">
        <img 
          src={logo}
          alt="Work Schedule" 
          className="mx-auto w-64 h-auto rounded-lg"
        />

        <h1 className="text-3xl font-medium text-accent mt-10">Welcome to </h1>
        <h1 className="text-5xl font-extrabold text-accent mb-10">WORK PULSE</h1>

        <Link 
          to='/userselection' 
          className="text-accent shadow-xl text-xl font-semibold py-3 px-3 rounded-2xl hover:bg-text hover:text-background transition duration-300 flex justify-center items-center w-full max-w-xs mx-auto"
        >
          Get Started
        </Link>
      </div>
    </motion.div>
  );
};

export default Home;
