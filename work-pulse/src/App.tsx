import { useEffect } from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { observeUser } from "./services/firebaseAuth";

// Route Components
import Home from "./components/Home";
import UserSelection from "./components/UserSelection";

import ManagerLogin from "./components/TaskAndProject/ManagerLogin";
import ManagerDashboard from "./components/TaskAndProject/ManagerDashboard";
import TaskManagement from "./components/TaskAndProject/TaskManagement";
import Reports from "./components/TaskAndProject/Reports";
import LeaveRequests from "./components/TaskAndProject/LeaveRequests";
import TaskTracking from "./components/TaskAndProject/TaskTracking";

import EmployeeLogin from "./components/EmployeeManagement/EmployeeLogin";
import EmployeeDashboard from "./components/EmployeeManagement/EmployeeDashboard";
import EmployeeSignIn from "./components/EmployeeManagement/EmployeeSignIn";
import EmployeeDetails from "./components/EmployeeManagement/EmployeeDetails";
import EmployeeReport from "./components/EmployeeManagement/EmployeeReport";

import EmployeeShift from "./components/SystemMonitor/EmployeeShift";
import EmployeeMonitor from "./components/SystemMonitor/EmployeeMonitor";
import ShiftReport from "./components/SystemMonitor/SubComponents/ShiftReport";
import ManagerChat from "./components/SystemMonitor/SubComponents/ManagerChat";

import LeaveRequestForm from "./components/LeaveApproval/LeaveRequestForm";
import LeaveHistory from "./components/LeaveApproval/LeaveHistory";
import LeaveReport from "./components/LeaveApproval/LeaveReport";
import LeaveDashboard from "./components/LeaveApproval/LeaveDashboard";

const App = () => {
  useEffect(() => {
    const unsubscribe = observeUser((user) => {
      if (user) {
        console.log("✅ Firebase Authenticated:", user.email);
      } else {
        console.log("🚫 Firebase Logged Out");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userselection" element={<UserSelection />} />

        <Route path="/managerlogin" element={<ManagerLogin />} />
        <Route path="/managerdashboard" element={<ManagerDashboard />} />
        <Route path="/tasks" element={<TaskManagement />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/leave-requests" element={<LeaveRequests />} />
        <Route path="/tracking" element={<TaskTracking />} />

        <Route path="/employeelogin" element={<EmployeeLogin />} />
        <Route path="/employeedashboard" element={<EmployeeDashboard />} />
        <Route path="/employeedetails" element={<EmployeeDetails />} />
        <Route path="/employeereport" element={<EmployeeReport />} />
        <Route path="/employeesignin" element={<EmployeeSignIn />} />

        <Route path="/shift" element={<EmployeeShift />} />
        <Route path="/monitor" element={<EmployeeMonitor />} />
        <Route path="/shift-report" element={<ShiftReport />} />
        <Route path="/manager-chat" element={<ManagerChat />} />

        <Route path="leaverequestform" Component={LeaveRequestForm}/>
        <Route path="leavehistory" Component={LeaveHistory}/>
        <Route path="leavereport" Component={LeaveReport}/>
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

export default App;
