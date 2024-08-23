//CreateEditForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateEditForm.css'; 
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faCalendarAlt, faEdit, faTags, faCalculator } from '@fortawesome/free-solid-svg-icons';

const CreateEditForm = ({ id, onSave }) => {
  const [branchName, setBranchName] = useState('');
  const [date, setDate] = useState('');
  const [session, setSession] = useState('Morning');
  const [itemName, setItemName] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [issuedQuantity, setIssuedQuantity] = useState(0);
  const [returnedQuantity, setReturnedQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5001/api/records/${id}`)
        .then(response => {
          const data = response.data;
          setBranchName(data.branchName);
          setDate(data.date);
          setSession(data.session);
          setItemName(data.itemName);
          setItemImage(null);
          setIssuedQuantity(data.issuedQuantity);
          setReturnedQuantity(data.returnedQuantity);
          setPrice(data.price);
          setTotalPrice(data.totalPrice);
        })
        .catch(error => {
          console.error('Error fetching record data:', error);
        });
    }
  }, [id]);

  const handleImageChange = (e) => {
    setItemImage(e.target.files[0]);
  };

  const handleCalculateTotalPrice = () => {
    const calculatedTotal = (issuedQuantity * price) - (returnedQuantity * price);
    setTotalPrice(calculatedTotal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (issuedQuantity < 0 || returnedQuantity < 0 || price < 0) {
      alert('Quantity and price must be non-negative.');
      return;
    }

    const formData = new FormData();
    formData.append('branchName', branchName);
    formData.append('date', date);
    formData.append('session', session);
    formData.append('itemName', itemName);
    if (itemImage) formData.append('itemImage', itemImage);
    formData.append('issuedQuantity', issuedQuantity);
    formData.append('returnedQuantity', returnedQuantity);
    formData.append('price', price);
    formData.append('totalPrice', totalPrice);

    try {
      if (id) {
        await axios.put(`http://localhost:5001/api/records/${id}`, formData);
      } else {
        await axios.post('http://localhost:5001/api/records', formData);
      }
      onSave();
      navigate('/table-view');
    } catch (error) {
      console.error('Error saving record:', error);
      alert('Failed to save the record. Please try again.');
    }
  };

  const resetForm = () => {
    setBranchName('');
    setDate('');
    setSession('Morning');
    setItemName('');
    setItemImage(null);
    setIssuedQuantity(0);
    setReturnedQuantity(0);
    setPrice(0);
    setTotalPrice(0);
  };

  return (
    <div className="create-edit-form">
      <h2>{id ? 'Edit Record' : 'Create Record'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="branchName">
            <FontAwesomeIcon icon={faEdit} /> Branch Name:
          </label>
          <select
            id="branchName"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            required
          >
            <option value="">Select Branch</option>
            <option value="Kandy">Kandy</option>
            <option value="Matale">Matale</option>
            <option value="Kurunegala">Kurunegala</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">
            <FontAwesomeIcon icon={faCalendarAlt} /> Date:
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="session">Session:</label>
          <select
            id="session"
            value={session}
            onChange={(e) => setSession(e.target.value)}
          >
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="itemName">
            <FontAwesomeIcon icon={faTags} /> Item Name:
          </label>
          <input
            type="text"
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="itemImage">
            <FontAwesomeIcon icon={faUpload} /> Item Image:
          </label>
          <input
            type="file"
            id="itemImage"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="issuedQuantity">
            <FontAwesomeIcon icon={faCalculator} /> Issued Quantity:
          </label>
          <input
            type="number"
            id="issuedQuantity"
            value={issuedQuantity}
            onChange={(e) => {
              setIssuedQuantity(Number(e.target.value));
              handleCalculateTotalPrice();
            }}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="returnedQuantity">
            <FontAwesomeIcon icon={faCalculator} /> Returned Quantity:
          </label>
          <input
            type="number"
            id="returnedQuantity"
            value={returnedQuantity}
            onChange={(e) => {
              setReturnedQuantity(Number(e.target.value));
              handleCalculateTotalPrice();
            }}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">
            <FontAwesomeIcon icon={faTags} /> Price:
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => {
              setPrice(Number(e.target.value));
              handleCalculateTotalPrice();
            }}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Total Price:</label>
          <p>{totalPrice.toFixed(2)}</p>
        </div>

        <button type="submit">{id ? 'Update' : 'Save'}</button>
        <button type="button" onClick={resetForm}>Reset</button>
      </form>
    </div>
  );
};

export default CreateEditForm;
