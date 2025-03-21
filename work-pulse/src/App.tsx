import { MemoryRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import UserSelection from "./components/UserSelection";
import ManagerLogin from "./components/TaskAndProject/ManagerLogin";
import ManagerDashboard from "./components/TaskAndProject/ManagerDashboard";
import TaskManagement from "./components/TaskAndProject/TaskManagement";
import Reports from "./components/TaskAndProject/Reports";
import LeaveRequests from "./components/TaskAndProject/LeaveRequests";
import TaskTracking from "./components/TaskAndProject/TaskTracking";

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
        <Route path="leaverRquests" Component={LeaveRequests}/>
        <Route path="tracking" Component={TaskTracking}/>
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

export default App;