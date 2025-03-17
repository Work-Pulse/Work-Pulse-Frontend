import React from 'react'
import { Link } from 'react-router-dom'
import { FaUser, FaUserTie } from 'react-icons/fa';

const UserSelection = () => {
  return (
    <div>
      <div className="flex justify-center items-center h-screen bg-[#122D3B]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-[#C6D2D5] rounded-2xl shadow-xl">
        <button className="text-white text-xl font-semibold p-6 bg-[#122D3B] rounded-2xl hover:bg-white hover:text-[#122D3B] transition duration-300 flex items-center gap-4">
          <FaUser size={24} /> Employee Login
        </button>
        <button className="text-white text-xl font-semibold p-6 bg-[#122D3B] rounded-2xl hover:bg-white hover:text-[#122D3B] transition duration-300 flex items-center gap-4">
          <FaUserTie size={24} /> Manager Login
        </button>
      </div>
      <div>
        <Link to='/'className="bg-[#122D3B] hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-lg mt-4 shadow-md transition duration-300">
            Back to Home!
        </Link>
      </div>
    </div>
    </div>
  )
}

export default UserSelection
