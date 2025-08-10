import React, { useState } from 'react';
import '../../styles/consumer/ProductDetails.css';

const ProductDetails = ({ product, onAddToCart, onBack }) => {
  const [quantity, setQuantity] = useState(1);
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.quantity) {
      setQuantity(value);
    }
  };
  
  const handleIncrement = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };
  
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };
  
  return (
    <div className="product-details">
      <button className="back-button" onClick={onBack}>
        &larr; Back to Products
      </button>
      
      <div className="product-details-container">
        <div className="product-image-large">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-details-info">
          <h2 className="product-title">{product.name}</h2>
          <p className="product-price">₹{product.price} per {product.unit}</p>
          <p className="product-availability">
            <span className="availability-label">Availability:</span> 
            <span className={`availability-value ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.quantity > 0 ? `${product.quantity} ${product.unit} available` : 'Out of Stock'}
            </span>
          </p>
          
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="farmer-info">
            <h3>Farmer Information</h3>
            <p><strong>Name:</strong> {product.farmerName}</p>
            <p><strong>Location:</strong> {product.location}</p>
          </div>
          
          <div className="quantity-selector">
            <h3>Quantity</h3>
            <div className="quantity-input-group">
              <button 
                className="quantity-button" 
                onClick={handleDecrement}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max={product.quantity}
                className="quantity-input"
              />
              <button 
                className="quantity-button" 
                onClick={handleIncrement}
                disabled={quantity >= product.quantity}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="total-price">
            <h3>Total Price</h3>
            <p className="total-amount">₹{(product.price * quantity).toFixed(2)}</p>
          </div>
          
          <button 
            className="add-to-cart-large" 
            onClick={handleAddToCart}
            disabled={product.quantity === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 