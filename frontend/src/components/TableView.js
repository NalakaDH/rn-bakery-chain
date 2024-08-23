//TableView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeletePopup from './DeletePopup';
import './TableView.css'; 
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faClone, faTrash } from '@fortawesome/free-solid-svg-icons';

const TableView = () => {
  const [records, setRecords] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/records');
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, []);

  const handleDeleteClick = (recordId) => {
    setRecordToDelete(recordId);
    setShowPopup(true);
  };

  const handleEditClick = (record) => {
    navigate(`/create-edit-form/${record.id}`);
  };

  const handleCloneClick = async (recordId) => {
    try {
      const recordToClone = records.find((record) => record.id === recordId);
      const newRecord = { ...recordToClone, id: undefined };

      const response = await axios.post('http://localhost:5001/api/records', newRecord);

      setRecords((prevRecords) => [...prevRecords, response.data]);
    } catch (error) {
      console.error('Error cloning record:', error);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setRecordToDelete(null);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5001/api/records/${id}`);
      if (response.status === 200) {
        alert('Record deleted successfully');
        setRecords((prevRecords) =>
          prevRecords.filter((record) => record.id !== id)
        );
      } else {
        alert('Failed to delete record');
      }
    } catch (error) {
      console.error('Error deleting record:', error.message);
      alert('Error deleting record');
    }
  };

  const handleConfirmDelete = async () => {
    handleDelete(recordToDelete);
    handleClosePopup();
  };

  return (
    <div className="table-view">
      <h2>Records Table</h2>
      <table>
        <thead>
          <tr>
            <th>Branch Name</th>
            <th>Date</th>
            <th>Session</th>
            <th>Item Name</th>
            <th>Item Image</th>
            <th>Issued Quantity</th>
            <th>Returned Quantity</th>
            <th>Price</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((record) => (
              <tr key={record.id}>
                <td>{record.branchName}</td>
                <td>{record.date}</td>
                <td>{record.session}</td>
                <td>{record.itemName}</td>
                <td>
                  {record.itemImage && (
                    <img
                      src={`http://localhost:5001/uploads/${record.itemImage}`}
                      alt={record.itemName}
                      className="item-image"
                    />
                  )}
                </td>
                <td>{record.issuedQuantity}</td>
                <td>{record.returnedQuantity}</td>
                <td>{record.price}</td>
                <td>{record.totalPrice}</td>
                <td className="actions">
                  <button className="edit-button" onClick={() => handleEditClick(record)}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                  <button className="clone-button" onClick={() => handleCloneClick(record.id)}>
                    <FontAwesomeIcon icon={faClone} /> Clone
                  </button>
                  <button className="delete-button" onClick={() => handleDeleteClick(record.id)}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No records found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showPopup && (
        <DeletePopup 
          onClose={handleClosePopup} 
          onConfirm={handleConfirmDelete} 
        />
      )}
    </div>
  );
};

export default TableView;
