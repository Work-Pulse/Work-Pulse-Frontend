
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import bg from "../../../assets/images/bg.png";
import { ArrowLeft, Search } from "lucide-react";
import axios from "axios";


interface ApplicationUsage {
  appName: string;
  usageInSeconds: number;
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const sec = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

export default function ShiftReport() {
  const { employeeId } = useParams();
  const [employeeInfo, setEmployeeInfo] = useState({
    firstName: "",
    lastName: "",
    department: "",
    designation: "",
  });
  const [shiftData, setShiftData] = useState<any[]>([]);
  const [filteredShiftData, setFilteredShiftData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const res = await axios.get(`http://localhost:3030/shift/employee-info/${employeeId}`);
        setEmployeeInfo(res.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    const fetchShiftData = async () => {
      try {
        const res = await axios.get(`http://localhost:3030/shift/shift-usage/employee/${employeeId}`);
        setShiftData(res.data);
        setFilteredShiftData(res.data); // Initially set filtered data to all shift data
      } catch (error) {
        console.error("Error fetching shift data:", error);
      }
    };

    fetchEmployeeData();
    fetchShiftData();
  }, [employeeId]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filteredData = shiftData.filter((shift) => {
      const matchesDate =
        shift.startTime.toLowerCase().includes(value) || shift.endTime.toLowerCase().includes(value);
      const matchesApp = shift.applicationUsage.some((app: ApplicationUsage) =>
        app.appName.toLowerCase().includes(value)
      );
      return matchesDate || matchesApp;
    });

    setFilteredShiftData(filteredData); // Update the filtered data
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center min-h-screen bg-cover bg-center p-6 bg-fixed"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Back Button */}
      <div className="w-full">
        <div className="fixed">
          <Link to="/monitor">
            <button className="absolute top-6 left-6 text-accent hover:text-reject p-3 rounded-full flex items-center">
              <ArrowLeft size={24} className="mr-2" /> Back
            </button>
          </Link>
        </div>
      </div>

      {/* Employee Info */}
      <div className="w-full max-w-6xl p-2 rounded-lg text-center mt-3">
        <p className="text-3xl font-bold text-text">{employeeInfo.firstName} {employeeInfo.lastName}</p>
        <p className="text-lg font-bold text-text">{employeeInfo.designation} - Department of {employeeInfo.department}</p>
        <p className="text-lg"></p>
      </div>

      {/* Search Input */}
      <div className="relative w-[40%] shadow-lg mt-3">
      <Search className="absolute left-2 top-4 text-text" size={25} />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by date or application name"
          className="w-full p-4 pl-10 rounded-lg shadow-sm focus:ring-3 focus:ring-text focus:outline-none bg-white/40 focus:bg-white"
        />
      </div>

      {/* Table Header */}
      <div className="max-w-6xl w-full mt-6">
        <div className="grid bg-background/40 grid-cols-5 p-4 text-text text-xl font-bold text-center items-center rounded-lg shadow-lg">
          <span >Start Time</span>
          <span >End Time</span>
          <span>Total Shift</span>
          <span className="col-span-2">Application Usage</span>
        </div>
        {filteredShiftData.map((shift, index) => (
          <div key={index} className="grid grid-cols-5 p-4 bg-background/40 text-center items-center rounded-lg shadow-md mt-4">
            <span className="font-medium">{shift.startTime}</span>
            <span className="font-medium">{shift.endTime}</span>
            <span className="font-medium">{shift.totalTime}</span>
            <div className="col-span-2">
              {shift.applicationUsage.map((app: ApplicationUsage, appIndex: number) => (
                <div key={appIndex} className="">
                  {app.appName} ({formatTime(app.usageInSeconds)})
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
