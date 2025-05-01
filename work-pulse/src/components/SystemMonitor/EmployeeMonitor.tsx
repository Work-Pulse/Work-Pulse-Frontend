import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Users } from "lucide-react";
import bg from '../../assets/images/bg.png';
import { motion } from 'framer-motion';
import axios from "axios";

export default function EmployeeMonitoring() {
  const [search, setSearch] = useState(""); // Search term
  const [employees, setEmployees] = useState<any[]>([]); // Store fetched employee data

  // Fetch employee data from the backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:3030/shift/shift-usage/fetchAll"); // Make sure the URL is correct
        const data = response.data;

        // Remove duplicate employees based on employeeId
        const uniqueEmployees = Array.from(
          new Map(
            data.map((item: any) => [item.employeeId, item]) // Map by employeeId
          ).values()
        );

        setEmployees(uniqueEmployees); // Update state with unique employees
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees based on search term
  const filteredEmployees = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(search.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(search.toLowerCase()) ||
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

      {/* Back Button */}
      <div className="w-full">
        <div className="fixed">
          <Link to="/managerdashboard">
            <button className="absolute top-6 left-6 text-accent hover:text-reject p-3 rounded-full flex items-center">
              <ArrowLeft size={24} className="mr-2" /> Back
            </button>
          </Link>
        </div>
      </div>

      <div className="w-full p-10 max-w-6xl mx-auto rounded-lg min-h-screen mt-4"> 
        <div className="flex items-center pb-8">
          <h2 className="text-3xl font-bold text-center flex-grow text-text mb-8">
            Employee Attendance & Shift Monitoring
          </h2>
        </div>

        {/* Search Input */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative w-[50%] shadow-lg mb-5">
            <Search className="absolute left-2 top-4 text-text" size={25} />
            <input
              className="w-full p-4 pl-10 rounded-lg shadow-sm focus:ring-3 focus:ring-text focus:outline-none"
              placeholder="Search Employee, Designation, Department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link to="/manager-chat">
            <button className="bg-accent font-bold px-6 py-4 rounded-lg text-background flex items-center gap-2 shadow-lg hover:bg-background hover:text-text">
              <Users size={20} /> Employee Chat
            </button>
          </Link>
        </div>

        {/* Table Header */}
        <div className="bg-white p-4 rounded-lg font-bold grid grid-cols-5 text-xl shadow-lg">
          <span className="text-center text-gray pr-5">Employee ID</span>
          <span className="text-center text-text pr-10">Employee Name</span>
          <span className="text-center text-gray">Designation</span>
          <span className="text-center">Department</span>
          <span className="text-center"></span>
        </div>

        {/* Table Body */}
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee, index) => (
            <div
              key={index}
              className="mt-4 p-5 grid grid-cols-5 font-medium items-center rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200 text-lg"
            >
              <div className="text-center text-gray pr-5">{employee.employeeId}</div>
              <div className="text-center pr-">{employee.firstName} {employee.lastName}</div>
              <div className="text-center text-gray">{employee.designation}</div>
              <div className="text-center">{employee.department}</div>
              <div className="text-center">
                <Link to={`/shift-report/${employee.employeeId}`}>
                  <button className="bg-primary px-6 py-3 rounded-lg text-accent hover:bg-accent hover:text-background">
                    View Report
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-accent mt-4">No results found</p>
        )}
      </div>
    </motion.div>
  );
}
