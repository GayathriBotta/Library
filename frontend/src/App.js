import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ViewBooks from "./pages/ViewBooks";
import Students from "./pages/Student";
import IssueBook from "./pages/IssueBook";

function AppContent() {
  const location = useLocation();

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        {location.pathname !== "/" && (
          <div className="topbar">
            <div className="topbar-title">Library Management System</div>
            <div className="topbar-right">
              <div className="topbar-icon">🔔</div>
              <div className="topbar-user">
                <div className="topbar-avatar">L</div>
              </div>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<ViewBooks />} />
          <Route path="/student" element={<Students />} />
          <Route path="/issue-book" element={<IssueBook />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
