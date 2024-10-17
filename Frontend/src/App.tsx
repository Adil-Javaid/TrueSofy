// src/App.tsx
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import AdminDashboard from "./Components/AdminDashboard";
import TeamLeadDashboard from "./Components/TeamleadDashboard";
import TeamMemberPanel from "./Components/TeamMemberDashboard";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/team-lead" element={<TeamLeadDashboard />} />
        <Route path="/team-member" element={<TeamMemberPanel />} />
      </Routes>
    </Router>
  );
};

export default App;
