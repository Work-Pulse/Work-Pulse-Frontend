import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const ManagerLogin = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-[#122D3B]">
      <div className="grid grid-cols-1 gap-8 p-8 bg-[#C6D2D5] rounded-2xl shadow-xl w-96">
        <h2 className="text-center text-[#122D3B] text-2xl font-semibold">User Login</h2>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow">
            <FaUser size={20} className="text-[#122D3B]" />
            <input 
              type="text" 
              placeholder="Username" 
              className="w-full outline-none text-[#122D3B]"
            />
          </div>

          <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow">
            <FaUser size={20} className="text-[#122D3B]" />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full outline-none text-[#122D3B]"
            />
          </div>
        </div>

        <Link to='/managerdashboard'>
        <button className="text-white text-lg font-semibold p-3 bg-[#122D3B] rounded-lg hover:bg-white hover:text-[#122D3B] transition duration-300 w-full">
          Login
        </button>
        </Link>
        
        <div className="text-center">
          <Link to='/' className="bg-[#122D3B] hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300">
            Back to Home!
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ManagerLogin;
