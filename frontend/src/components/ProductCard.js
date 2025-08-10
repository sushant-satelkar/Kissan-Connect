import React from 'react';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { name, price, unit, image } = product;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={image} alt={name} className="product-image" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-price">₹ {price} / {unit}</p>
      </div>
    </div>
  );
};

export default ProductCard; 