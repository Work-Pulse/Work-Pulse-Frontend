import { Link } from "react-router-dom";
import bg from '../../../assets/images/bg.png';
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const employee = {
  name: "Jhon Doe",
  designation: "Senior Software Engineer",
  department: "Department of IT & Research",
};

const data = [
  {
    date: "2025/03/05",
    startTime: "09:00:00",
    endTime: "17:00:00",
    totalShift: "08:00:00",
    applicationUsage: [
      { name: "VS Code", duration: "02:30:00" },
      { name: "Teams", duration: "01:00:00" },
    ],
    unauthorizedActivities: [
      { name: "Whatsapp", duration: "02:30:00" },
      { name: "Youtube", duration: "01:00:00" },
    ],
  },
  {
    date: "2025/03/04",
    startTime: "09:00:00",
    endTime: "17:00:00",
    totalShift: "08:00:00",
    applicationUsage: [{ name: "Slack", duration: "01:30:00" }],
    unauthorizedActivities: [{ name: "Instagram", duration: "01:30:00" }],
  },
  {
    date: "2025/03/05",
    startTime: "09:00:00",
    endTime: "17:00:00",
    totalShift: "08:00:00",
    applicationUsage: [
      { name: "VS Code", duration: "02:30:00" },
      { name: "Teams", duration: "01:00:00" },
    ],
    unauthorizedActivities: [
      { name: "Whatsapp", duration: "02:30:00" },
      { name: "Youtube", duration: "01:00:00" },
    ],
  },
  {
    date: "2025/03/05",
    startTime: "09:00:00",
    endTime: "17:00:00",
    totalShift: "08:00:00",
    applicationUsage: [
      { name: "VS Code", duration: "02:30:00" },
      { name: "Teams", duration: "01:00:00" },
    ],
    unauthorizedActivities: [
      { name: "Whatsapp", duration: "02:30:00" },
      { name: "Youtube", duration: "01:00:00" },
    ],
  },
  {
    date: "2025/03/05",
    startTime: "09:00:00",
    endTime: "17:00:00",
    totalShift: "08:00:00",
    applicationUsage: [
      { name: "VS Code", duration: "02:30:00" },
      { name: "Teams", duration: "01:00:00" },
    ],
    unauthorizedActivities: [
      { name: "Whatsapp", duration: "02:30:00" },
      { name: "Youtube", duration: "01:00:00" },
    ],
  },
  
];

export default function AttendanceMonitor() {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6 bg-fixed"
        style={{ backgroundImage: `url(${bg})` }}
      >
        {/* Back Button */}
        <div className="w-full">
          <div className="fixed">
            <Link to="/monitor">
              <button className="absolute top-6 left-6 text-accent hover:bg-background hover:border p-3 rounded-full flex items-center">
                <ArrowLeft size={24} className="mr-2" /> Back
              </button>
            </Link>
          </div>
        </div>
  
        {/* Employee Details */}
        <div className="w-full max-w-6xl bg p-6 rounded-lg text-center">
          <h2 className="text-3xl font-bold text-gray-900"></h2>
          <p className="text-2xl text-accent font-bold mt-4">{employee.name}</p>
          <p className="text-accent font-semibold">{employee.designation}</p>
          <p className="text-accent">{employee.department}</p>
        </div>
  
        {/* Table Container */}
        <div className="max-w-6xl rounded-lg">
          {/* Table Header */}

            <div className=" grid grid-cols-6 bg-background p-4 text-text font-bold text-center items-center rounded-lg shadow-lg">
                <span>Date</span>
                <span>Start Time</span>
                <span>End Time</span>
                <span>Total Shift</span>
                <span>Application Usage</span>
                <span>Unauthorized Activities</span>
            </div>
  
          {/* Table Body */}
          <div className="mt-4">
            {data.map((entry, index) => (
              <div key={index} className="mt-4">
                {/* One div per row (same width as header) */}
                <div className=" grid grid-cols-6 bg-background p-4 text-text text-center items-center rounded-lg shadow-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  <span>{entry.date}</span>
                  <span>{entry.startTime}</span>
                  <span>{entry.endTime}</span>
                  <span>{entry.totalShift}</span>
  
                  {/* Application Usage Column */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {entry.applicationUsage.length > 0 ? (
                      entry.applicationUsage.map((app, i) => (
                        <span key={i} className="text-text px-3 py-1 rounded-lg">
                          {app.name} - {app.duration}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-xs">No Data</span>
                    )}
                  </div>
  
                  {/* Unauthorized Activities Column */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {entry.unauthorizedActivities.length > 0 ? (
                      entry.unauthorizedActivities.map((act, i) => (
                        <span key={i} className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs">
                          {act.name} - {act.duration}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-xs">No Data</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }
  