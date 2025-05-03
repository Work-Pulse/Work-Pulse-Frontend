import { MemoryRouter, Routes, Route } from "react-router-dom";

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

import EmployeeShift from "./components/SystemMonitor/EmployeeShift"
import EmployeeMonitor from "./components/SystemMonitor/EmployeeMonitor";
import ShiftReport from "./components/SystemMonitor/SubComponents/ShiftReport";
import ManagerChat from "./components/SystemMonitor/SubComponents/ManagerChat";


import LeaveRequestForm from "./components/LeaveApproval/LeaveRequestForm";
import LeaveHistory from "./components/LeaveApproval/LeaveHistory";
import LeaveReport from "./components/LeaveApproval/LeaveReport";
import LeaveDashboard from "./components/LeaveApproval/LeaveDashboard";

const App = () => {
  return(
    <MemoryRouter>
      <Routes>
        <Route path="/">
        <Route index Component={Home}/>
      
        <Route path="userselection" Component={UserSelection}/>

        <Route path="managerlogin" Component={ManagerLogin}/>
        <Route path="managerdashboard" Component={ManagerDashboard}/>
        
        <Route path="tasks" Component={TaskManagement}/>
        <Route path="reports" Component={Reports}/>
        <Route path="leave-requests" Component={LeaveRequests}/>
        <Route path="tracking" Component={TaskTracking}/>

        <Route path="employeelogin" Component={EmployeeLogin}/>
        <Route path="employeedashboard" Component={EmployeeDashboard}/>
        <Route path="employeedetails" Component={EmployeeDetails}/>

        <Route path="shift" Component={EmployeeShift}/>
        <Route path="monitor" Component={EmployeeMonitor}/>
        <Route path="shift-report/:employeeId" Component={ShiftReport}/>
        <Route path="manager-chat" Component={ManagerChat}/>

        <Route path="reports" Component={Reports}/>
        <Route path="leave-requests" Component={LeaveRequests}/>
        <Route path="tracking" Component={TaskTracking}/>
        <Route path="employeereport" Component={EmployeeReport}/>
        <Route path="employeesignin" Component={EmployeeSignIn}/>

        <Route path="leaverequestform" Component={LeaveRequestForm}/>
        <Route path="leavehistory" Component={LeaveHistory}/>
        <Route path="leavereport" Component={LeaveReport}/>
        <Route path="leavedashboard" Component={LeaveDashboard}/>

        </Route>
      </Routes>
    </MemoryRouter>
  )
}

export default App;

