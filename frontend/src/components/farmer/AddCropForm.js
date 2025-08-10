import React, { useState } from 'react';
import '../../styles/farmer/AddCropForm.css';

const AddCropForm = ({ onAddCrop }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    price: '',
    location: '',
    image: null
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.quantity || !formData.price || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Convert quantity and price to numbers
    const cropData = {
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      image: previewImage
    };
    
    onAddCrop(cropData);
    
    // Reset form
    setFormData({
      name: '',
      quantity: '',
      unit: 'kg',
      price: '',
      location: '',
      image: null
    });
    setPreviewImage(null);
  };
  
  return (
    <div className="add-crop-form">
      <h2>Add New Crop Listing</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Crop Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter crop name"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              min="1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="unit">Unit</label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
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
        
        <div className="form-group">
          <label htmlFor="price">Price (₹ per {formData.unit})</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            min="1"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter your location"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Upload Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
          />
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Crop preview" />
            </div>
          )}
        </div>
        
        <button type="submit" className="submit-button">Add Crop</button>
      </form>
    </div>
  );
};

export default AddCropForm; 