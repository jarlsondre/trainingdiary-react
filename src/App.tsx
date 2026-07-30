import "./App.css";

import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import PasswordReset from "./components/passwordReset/PasswordReset";
import PasswordResetConfirm from "./components/passwordReset/PasswordResetConfirm";
import Toaster from "./components/Toaster/Toaster";
import Calculator from "./pages/Calculator/Calculator";
import Login from "./pages/Login/Login";
import UserDetail from "./pages/ProfilePage/UserDetail";
import Search from "./pages/Search/Search";
import DetailOverview from "./pages/SessionDetail/DetailOverview";
import SessionOverview from "./pages/SessionOverview/SessionOverview";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<SessionOverview />} />
        <Route path="password-reset" element={<PasswordReset />} />
        <Route
          path="password-reset-confirm/:username/:token"
          element={<PasswordResetConfirm />}
        />
        <Route path="session/:sessionId" element={<DetailOverview />} />
        <Route path="login" element={<Login />} />
        <Route path="calculator" element={<Calculator />} />
        <Route path="search" element={<Search />} />
        <Route path="/user/:username" element={<UserDetail />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
