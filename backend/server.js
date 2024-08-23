// server.js
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const recordsRouter = require('./routes/records'); 
const dashboardRoutes = require('./routes/dashboard'); // Import the dashboard routes

const app = express();
const port = 5001;

// MySQL connection pool setup
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rn_bakery_chain'
}).promise();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Provide the pool to routes
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use the router for handling /api/records routes
app.use('/api', recordsRouter);

// Use the router for handling /api/dashboard routes
app.use('/api/dashboard', dashboardRoutes);

// Force a simple database query on startup using async/await
(async () => {
  try {
    const [results] = await pool.query('SELECT 1');
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Error executing query:', err.message);
  }
})();

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
