import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiBookOpen,
  FiUsers,
  FiRepeat
} from "react-icons/fi";

function Navbar() {
  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <FiBookOpen />
        </div>

        <div>
          <strong>LIBRARY</strong>
          <span>Library Management</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="nav-section">
        <p className="nav-title">MAIN MENU</p>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `side-link ${isActive ? "active" : ""}`
          }
        >
          <FiGrid />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/books"
          className={({ isActive }) =>
            `side-link ${isActive ? "active" : ""}`
          }
        >
          <FiBookOpen />
          <span>Books</span>
        </NavLink>

        <NavLink
          to="/student"
          className={({ isActive }) =>
            `side-link ${isActive ? "active" : ""}`
          }
        >
          <FiUsers />
          <span>Students</span>
        </NavLink>

        <NavLink
          to="/issue-book"
          className={({ isActive }) =>
            `side-link ${isActive ? "active" : ""}`
          }
        >
          <FiRepeat />
          <span>Issue & Return</span>
        </NavLink>
      </div>

      {/* Bottom profile */}
      <div className="sidebar-bottom">

        <div className="profile-card">
          <div className="profile-avatar">
            L
          </div>

          <div className="profile-info">
            <strong>Librarian</strong>
            <span>Administrator</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <span>© 2026 Library</span>
        </div>

      </div>

    </aside>
  );
}


export default Navbar;
