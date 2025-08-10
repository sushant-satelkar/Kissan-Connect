import React, { useState } from 'react';
import '../../styles/farmer/ManageListings.css';

const ManageListings = ({ crops, onEditCrop, onDeleteCrop }) => {
  const [editingCrop, setEditingCrop] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    price: '',
    location: '',
    image: ''
  });
  
  const handleEditClick = (crop) => {
    setEditingCrop(crop.id);
    setEditFormData({
      id: crop.id,
      name: crop.name,
      quantity: crop.quantity,
      unit: crop.unit,
      price: crop.price,
      location: crop.location,
      image: crop.image
    });
  };
  
  const handleCancelEdit = () => {
    setEditingCrop(null);
  };
  
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };
  
  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    
    // Convert quantity and price to numbers
    const updatedCrop = {
      ...editFormData,
      quantity: Number(editFormData.quantity),
      price: Number(editFormData.price)
    };
    
    onEditCrop(updatedCrop);
    setEditingCrop(null);
  };
  
  const handleDeleteClick = (cropId) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      onDeleteCrop(cropId);
    }
  };
  
  return (
    <div className="manage-listings">
      <h2>Manage Your Crop Listings</h2>
      
      {crops.length === 0 ? (
        <p className="no-crops-message">You haven't added any crops yet.</p>
      ) : (
        <div className="crop-list">
          {crops.map((crop) => (
            <div key={crop.id} className="crop-item">
              {editingCrop === crop.id ? (
                <form className="edit-form" onSubmit={handleEditFormSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`edit-name-${crop.id}`}>Crop Name</label>
                      <input
                        type="text"
                        id={`edit-name-${crop.id}`}
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`edit-quantity-${crop.id}`}>Quantity</label>
                      <input
                        type="number"
                        id={`edit-quantity-${crop.id}`}
                        name="quantity"
                        value={editFormData.quantity}
                        onChange={handleEditFormChange}
                        min="1"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`edit-unit-${crop.id}`}>Unit</label>
                      <select
                        id={`edit-unit-${crop.id}`}
                        name="unit"
                        value={editFormData.unit}
                        onChange={handleEditFormChange}
                      >
                        <option value="kg">Kilogram (kg)</option>
                        <option value="g">Gram (g)</option>
                        <option value="quintal">Quintal</option>
                        <option value="ton">Ton</option>
                        <option value="piece">Piece</option>
                        <option value="dozen">Dozen</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`edit-price-${crop.id}`}>Price (₹)</label>
                      <input
                        type="number"
                        id={`edit-price-${crop.id}`}
                        name="price"
                        value={editFormData.price}
                        onChange={handleEditFormChange}
                        min="1"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`edit-location-${crop.id}`}>Location</label>
                      <input
                        type="text"
                        id={`edit-location-${crop.id}`}
                        name="location"
                        value={editFormData.location}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="edit-form-buttons">
                    <button type="submit" className="save-button">Save</button>
                    <button type="button" className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="crop-image">
                    <img src={crop.image} alt={crop.name} />
                  </div>
                  <div className="crop-details">
                    <h3>{crop.name}</h3>
                    <p><strong>Quantity:</strong> {crop.quantity} {crop.unit}</p>
                    <p><strong>Price:</strong> ₹{crop.price} per {crop.unit}</p>
                    <p><strong>Location:</strong> {crop.location}</p>
                  </div>
                  <div className="crop-actions">
                    <button 
                      className="edit-button"
                      onClick={() => handleEditClick(crop)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteClick(crop.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageListings; 