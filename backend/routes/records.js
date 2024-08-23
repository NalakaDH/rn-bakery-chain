//records.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../db'); 

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Path where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage: storage });

// Route to create a new record
router.post('/records', upload.single('itemImage'), async (req, res) => {
  try {
    const { branchName, date, session, itemName, issuedQuantity, returnedQuantity, price } = req.body;
    const itemImage = req.file ? req.file.filename : null;
    const totalPrice = (issuedQuantity * price) - (returnedQuantity * price);

    // Check if required fields are provided
    if (!branchName || !date || !session || !itemName || !issuedQuantity || !returnedQuantity || !price) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert data into the database
    const [result] = await pool.query(
      'INSERT INTO records (branchName, date, session, itemName, itemImage, issuedQuantity, returnedQuantity, price, totalPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [branchName, date, session, itemName, itemImage, issuedQuantity, returnedQuantity, price, totalPrice]
    );

    // Return a success response
    res.status(201).json({ message: 'Record saved successfully', id: result.insertId });
  } catch (error) {
    console.error('Error saving record:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch all records
router.get('/records', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM records');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching records:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update an existing record
router.put('/records/:id', upload.single('itemImage'), async (req, res) => {
  const { id } = req.params;
  const { branchName, date, session, itemName, issuedQuantity, returnedQuantity, price } = req.body;
  const itemImage = req.file ? req.file.filename : req.body.existingItemImage; // Handle existing image
  const totalPrice = (issuedQuantity * price) - (returnedQuantity * price);

  // Check if required fields are provided
  if (!branchName || !date || !session || !itemName || !issuedQuantity || !returnedQuantity || !price) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Update the record in the database
    const [result] = await pool.query(
      'UPDATE records SET branchName = ?, date = ?, session = ?, itemName = ?, itemImage = ?, issuedQuantity = ?, returnedQuantity = ?, price = ?, totalPrice = ? WHERE id = ?',
      [branchName, date, session, itemName, itemImage, issuedQuantity, returnedQuantity, price, totalPrice, id]
    );

    // Check if the record was updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json({ message: 'Record updated successfully' });
  } catch (error) {
    console.error('Error updating record:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Route to delete a record
router.delete('/records/:id', async (req, res) => {
  const { id } = req.params;
  const pool = req.pool;

  try {
    const [result] = await pool.query('DELETE FROM records WHERE id = ?', [id]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Record deleted successfully' });
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (err) {
    console.error('Error deleting record:', err.message);
    res.status(500).json({ message: 'Error deleting record' });
  }
});

module.exports = router;
