import { useState } from "react";
import { ArrowLeft, Users, Search } from "lucide-react";
import bg from '../../assets/images/bg.png';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";


const employees = [
  { name: "Jhon Doe", designation: "Senior Software Engineer", department: "IT & Research" },
  { name: "Mary Jhone", designation: "Accountant", department: "Finance & Sales" },
  { name: "Mark Doe", designation: "Business Analyst", department: "IT and Research" },
  { name: "Tom Shelby", designation: "ML Engineer", department: "IT and Research" },
  { name: "Laila Hassan", designation: "Senior Executive Manager", department: "Finance & Sales" }
];

export default function EmployeeMonitoring() {
  const [search, setSearch] = useState("");

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.designation.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}  
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6 bg-fixed"
      style={{ backgroundImage: `url(${bg})` }}>
        
    
      <div className="w-full">
        <div className="fixed">
          <Link to="/managerdashboard">
            <button className="absolute top-6 left-6 text-accent hover:bg-background hover:border p-3 rounded-full flex items-center">
              <ArrowLeft size={24} className="mr-2" /> Back
            </button>
          </Link>
        </div>
      
      <div className="w-full p-10 max-w-6xl mx-auto bg- rounded-lg min-h-screen mt-4"> 
        <div className="flex items-center pb-8">
          <h2 className="text-3xl font-bold text-center flex-grow text-text mb-8">
            Employee Attendance & Shift Monitoring
          </h2>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="relative w-[50%] shadow-lg">
            <Search className="absolute left-3 top-4 text-text" size={20} />
            <input
              className="w-full p-4 pl-10 rounded-lg shadow-sm focus:ring-3 focus:ring-text focus:outline-none"
              placeholder="Search Employee, Designation, Department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link to="/manager-chat">
          <button className="bg-accent font-bold px-6 py-4 rounded-lg text-background flex items-center gap-2 shadow-lg hover:bg-background hover:text-text hover:border">
            <Users size={20} /> Employee Chat
          </button>
          </Link>
        </div>

        <div className="bg-white p-4 rounded-lg font-bold grid grid-cols-4 text-text text-lg shadow-lg">
          <span className="text-center">Employee Name</span>
          <span className="text-center">Designation</span>
          <span className="text-center">Department</span>
          <span></span> 
        </div>

        {filteredEmployees.map((employee, index) => (
          <div
            key={index}
            className="mt-4 p-5 grid grid-cols-4 font-medium items-center rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200 text-lg"
          >
            <span className="text-center">{employee.name}</span>
            <span className="text-center">{employee.designation}</span>
            <span className="text-center">{employee.department}</span>
            <Link to="/shift-report">
              <button className="bg-accent px-6 py-3 rounded-lg text-white hover:bg-background hover:text-accent hover:border">
                View Monthly Report
              </button>
            </Link>
          </div>
        ))}
      </div>
      </div>
    
    </motion.div>
  );
}
