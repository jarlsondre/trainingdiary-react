import "./App.css";
import SessionOverview from "./pages/SessionOverview/SessionOverview";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import DetailOverview from "./pages/SessionDetail/DetailOverview";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SessionOverview />}></Route>
      <Route path="session/:sessionId" element={<DetailOverview />}></Route>
    </Routes>
  );
}

export default App;
