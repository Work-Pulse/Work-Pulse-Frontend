import { Link } from 'react-router-dom';
import { FaTasks, FaUsers, FaClipboardList, FaSignOutAlt,FaChartLine , FaClipboardCheck } from 'react-icons/fa';

const ManagerDashboard = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-[#122D3B]">
      <div className="grid grid-cols-1 h-[95%] w-[97%] gap-8 p-8 bg-[#C6D2D5] rounded-2xl shadow-xl">
        <h2 className="text-center text-[#122D3B] text-2xl font-semibold">Manager Dashboard</h2>
        
        <div className="flex flex-col gap-4">
          <Link to='/tasks' className="flex items-center gap-4 bg-white p-3 rounded-lg shadow hover:bg-[#122D3B] hover:text-white transition duration-300">
            <FaTasks size={20} className="text-[#122D3B]" />
            Task Management
          </Link>

          <Link to='/employees' className="flex items-center gap-4 bg-white p-3 rounded-lg shadow hover:bg-[#122D3B] hover:text-white transition duration-300">
            <FaChartLine size={20} className="text-[#122D3B]" />
            Real-time Task Tracking
          </Link>

          <Link to='/employees' className="flex items-center gap-4 bg-white p-3 rounded-lg shadow hover:bg-[#122D3B] hover:text-white transition duration-300">
            <FaClipboardCheck size={20} className="text-[#122D3B]" />
            Leave Requests Approval
          </Link>

          <Link to='/reports' className="flex items-center gap-4 bg-white p-3 rounded-lg shadow hover:bg-[#122D3B] hover:text-white transition duration-300">
            <FaClipboardList size={20} className="text-[#122D3B]" />
            Reports & Analytics
          </Link>
        </div>
        
        <Link to='/managerlogin'>
        <button className="flex items-center justify-center gap-2 text-white text-lg font-semibold p-3 bg-red-600 rounded-lg hover:bg-red-700 transition duration-300 w-72">
          <FaSignOutAlt size={20} /> Logout
        </button>
        </Link>

      </div>
    </div>
  );
}

export default ManagerDashboard;
