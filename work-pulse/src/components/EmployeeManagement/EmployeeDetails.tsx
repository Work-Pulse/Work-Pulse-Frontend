// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import bg from "../../assets/images/bg.png";

// const LeaveRequestForm = () => {
//   // Form state
//   const [formData, setFormData] = useState({
//     leaveType: "",
//     startDate: "",
//     endDate: "",
//     reason: "",
//   });

//   // Handle input changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle form submission
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Leave Request Submitted:", formData);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 1 }}
//       className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
//       style={{ backgroundImage: `url(${bg})` }}
//     >
//       <div className="bg-[#C6D2D5] p-8 rounded-2xl shadow-xl w-full max-w-3xl">
//         <h1 className="text-center text-[#122D3B] text-3xl font-bold mb-6">Leave Request Form</h1>

//         <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

//           {/* Left Column */}
//           <div className="flex flex-col gap-4">
//             <label className="font-medium text-[#122D3B]">
//               Leave Type
//               <select
//                 name="leaveType"
//                 value={formData.leaveType}
//                 onChange={handleChange}
//                 className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
//                 required
//               >
//                 <option value="">Select Leave Type</option>
//                 <option value="Annual">Annual Leave</option>
//                 <option value="Sick">Sick Leave</option>
//                 <option value="Casual">Casual Leave</option>
//                 <option value="Maternity">Maternity Leave</option>
//               </select>
//             </label>

//             <label className="font-medium text-[#122D3B]">
//               Start Date
//               <input
//                 type="date"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleChange}
//                 className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
//                 required
//               />
//             </label>
//           </div>

//           {/* Right Column */}
//           <div className="flex flex-col gap-4">
//             <label className="font-medium text-[#122D3B]">
//               End Date
//               <input
//                 type="date"
//                 name="endDate"
//                 value={formData.endDate}
//                 onChange={handleChange}
//                 className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
//                 required
//               />
//             </label>
//           </div>

//           {/* Reason - Full Width */}
//           <div className="col-span-2">
//             <label className="font-medium text-[#122D3B]">
//               Reason
//               <textarea
//                 name="reason"
//                 value={formData.reason}
//                 onChange={handleChange}
//                 rows={4}
//                 className="mt-1 p-3 border border-gray-300 rounded-lg w-full resize-none"
//                 required
//               />
//             </label>
//           </div>

//           {/* Submit Button */}
//           <div className="col-span-2">
//             <button
//               type="submit"
//               className="text-white text-lg font-semibold p-3 bg-[#122D3B] rounded-lg hover:bg-white hover:text-[#122D3B] transition duration-300 w-full"
//             >
//               Submit Request
//             </button>
//           </div>
//         </form>

//         {/* Back to Dashboard */}
//         <div className="text-center mt-4">
//           <Link
//             to="/employeedashboard"
//             className="bg-[#122D3B] hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
//           >
//             Back to Dashboard
//           </Link>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default LeaveRequestForm;


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