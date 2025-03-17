import { MemoryRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import UserSelection from "./components/UserSelection";

const App = () => {
  return(
    <MemoryRouter>
      <Routes>
        <Route path="/">
        <Route index Component={Home}/>
        <Route path="userselection" Component={UserSelection}/>
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

export default App;