//Home.js
import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

// Import icons or images 
import CreateEditIcon from '../assets/icons8-create-50.png';
import TableViewIcon from '../assets/icons8-records-80.png';
import DashboardIcon from '../assets/icons8-dashboard-94.png';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Welcome to RN Bakery Chain</h1>
       
        <Link to="/create-edit" className="cta-button">Explore Now</Link>
      </section>
      <section className="features">
        <div className="feature">
          <img src={CreateEditIcon} alt="Create/Edit Icon" className="feature-icon" />
          <h2>Create/Edit Form</h2>
          <p>Easily create and edit records with a user-friendly form. Upload images, calculate totals, and more.</p>
        </div>
        <div className="feature">
          <img src={TableViewIcon} alt="Table View Icon" className="feature-icon" />
          <h2>Table View</h2>
          <p>View and manage all records in a comprehensive table. Sort, filter, and interact with data efficiently.</p>
        </div>
        <div className="feature">
          <img src={DashboardIcon} alt="Dashboard Icon" className="feature-icon" />
          <h2>Dashboard</h2>
          <p>Analyze key metrics with interactive charts and summaries. Track performance, sales, and more.</p>
        </div>
      </section>
      <footer className="footer">
        <p>&copy; 2024 RN Bakery Chain. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
