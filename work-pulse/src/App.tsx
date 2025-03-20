import { MemoryRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import UserSelection from "./components/UserSelection";

import ManagerLogin from "./components/TaskAndProject/ManagerLogin";
import ManagerDashboard from "./components/TaskAndProject/ManagerDashboard";
import TaskManagement from "./components/TaskAndProject/TaskManagement";

import EmployeeLogin from "./components/EmployeeManagement/EmployeeLogin";
import EmployeeDashboard from "./components/EmployeeManagement/EmployeeDashboard";
import EmployeeDetails from "./components/EmployeeManagement/EmployeeDetails";
import EmployeeSignIn from "./components/EmployeeManagement/EmployeeSignIn";

import EmployeeShift from "./components/SystemMonitor/EmployeeShift"
import EmployeeMonitor from "./components/SystemMonitor/EmployeeMonitor";
import ShiftReport from "./components/SystemMonitor/SubComponents/ShiftReport";





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

        <Route path="employeelogin" Component={EmployeeLogin}/>
        <Route path="employeedashboard" Component={EmployeeDashboard}/>
        <Route path="employeesignin" Component={EmployeeSignIn}/>
        <Route path="employeedetails" Component={EmployeeDetails}/>

        <Route path="shift" Component={EmployeeShift}/>
        <Route path="monitor" Component={EmployeeMonitor}/>
        <Route path="shift-report" Component={ShiftReport}/>

        </Route>
      </Routes>
    </MemoryRouter>
  )
}

export default App;