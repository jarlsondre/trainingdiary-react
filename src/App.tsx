import "./App.css";
import SessionOverview from "./pages/SessionOverview/SessionOverview";

import { Routes, Route } from "react-router-dom";
import DetailOverview from "./pages/SessionDetail/DetailOverview";
import Login from "./pages/Login/Login";
import Navbar from "./components/navbar/Navbar";
import Calculator from "./pages/Calculator/Calculator";
import Search from "./pages/Search/Search";
import UserDetail from "./pages/ProfilePage/UserDetail";
import PasswordReset from "./components/passwordReset/PasswordReset";
import PasswordResetConfirm from "./components/passwordReset/PasswordResetConfirm";

function App() {
  return (
    <div>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<SessionOverview />}></Route>
        <Route path="password-reset" element={<PasswordReset />}></Route>
        <Route
          path="password-reset-confirm/:username/:token"
          element={<PasswordResetConfirm />}
        ></Route>
        <Route path="session/:sessionId" element={<DetailOverview />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="calculator" element={<Calculator />}></Route>
        <Route path="search" element={<Search />}></Route>
        <Route path="/user/:username" element={<UserDetail />} />
      </Routes>
    </div>
  );
}

export default App;
