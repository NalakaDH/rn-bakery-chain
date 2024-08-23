//Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [weeklySales, setWeeklySales] = useState([]);
  const [branchPerformance, setBranchPerformance] = useState([]);
  const [sessionComparison, setSessionComparison] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesResponse, branchResponse, sessionResponse] = await Promise.all([
          axios.get('http://localhost:5001/api/dashboard/weekly-records'),
          axios.get('http://localhost:5001/api/dashboard/branch-performance'),
          axios.get('http://localhost:5001/api/dashboard/session-comparison'),
        ]);

        setWeeklySales(salesResponse.data);
        setBranchPerformance(branchResponse.data);
        setSessionComparison(sessionResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="chart-container">
        <h2 className="chart-title">Weekly Sales Chart</h2>
        {weeklySales.length > 0 ? (
          <div className="chart-wrapper">
            <LineChart width={800} height={400} data={weeklySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total_issued" stroke="#8884d8" />
              <Line type="monotone" dataKey="total_returned" stroke="#82ca9d" />
            </LineChart>
          </div>
        ) : (
          <p>No data available for weekly sales</p>
        )}
      </div>

      <div className="chart-container">
        <h2 className="chart-title">Branch Performance Chart</h2>
        {branchPerformance.length > 0 ? (
          <div className="chart-wrapper">
            <BarChart width={800} height={400} data={branchPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="branchName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_issued" fill="#8884d8" />
              <Bar dataKey="total_returned" fill="#82ca9d" />
            </BarChart>
          </div>
        ) : (
          <p>No data available for branch performance</p>
        )}
      </div>

      <div className="chart-container">
        <h2 className="chart-title">Session Comparison Chart</h2>
        {sessionComparison.length > 0 ? (
          <div className="chart-wrapper">
            <BarChart width={800} height={400} data={sessionComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="session" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_issued" fill="#8884d8" />
              <Bar dataKey="total_returned" fill="#82ca9d" />
            </BarChart>
          </div>
        ) : (
          <p>No data available for session comparison</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
