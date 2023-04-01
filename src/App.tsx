import "./App.css";
import SessionOverview from "./pages/SessionOverview/SessionOverview";

import { Routes, Route } from "react-router-dom";
import DetailOverview from "./pages/SessionDetail/DetailOverview";
import Login from "./pages/Login/Login";
import Navbar from "./components/navbar/Navbar";
import Calculator from "./pages/Calculator/Calculator";

function App() {
  return (
    <div>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<SessionOverview />}></Route>
        <Route path="session/:sessionId" element={<DetailOverview />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="calculator" element={<Calculator />}></Route>
      </Routes>
    </div>
  );
}

export default App;
