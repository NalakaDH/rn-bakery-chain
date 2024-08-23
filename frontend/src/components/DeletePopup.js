//DeletePopup.js
import React from 'react';
import './DeletePopup.css'; 

const DeletePopup = ({ onClose, onConfirm }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete this record?</p>
        <div className="popup-actions">
          <button onClick={onConfirm} className="confirm-btn">Confirm Delete</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
