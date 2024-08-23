//SidebarLayout.js
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './SidebarLayout.css';

const SidebarLayout = () => {
  return (
    <div className="sidebar-layout">
      <div className="sidebar">
        <h2 className="website-name">RN Bakery Chain</h2>
        <nav>
          <NavLink to="/" className="nav-link" end>
            <span className="nav-icon">🏠</span>
            Home
          </NavLink>
          <NavLink to="/create-edit" className="nav-link">
            <span className="nav-icon">✏️</span>
            Create/Edit
          </NavLink>
          <NavLink to="/table-view" className="nav-link">
            <span className="nav-icon">📊</span>
            TableView
          </NavLink>
          <NavLink to="/dashboard" className="nav-link">
            <span className="nav-icon">📈</span>
            Dashboard
          </NavLink>
        </nav>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
