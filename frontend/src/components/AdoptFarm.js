import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdoptFarm.css';

const AdoptFarm = () => {
  // Mock farmer data (in a real app, this would come from an API)
  const [farmers] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      location: 'Punjab, India',
      rating: 4.8,
      products: ['Rice', 'Wheat', 'Corn'],
      deliveryTime: '2-3 days',
      image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      subscriptionFee: 300,
      bio: 'Third-generation farmer with over 25 years of experience in sustainable farming practices.'
    },
    {
      id: 2,
      name: 'Anita Desai',
      location: 'Maharashtra, India',
      rating: 4.7,
      products: ['Tomatoes', 'Onions', 'Potatoes'],
      deliveryTime: '1-2 days',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      subscriptionFee: 250,
      bio: 'Organic farmer specializing in pesticide-free vegetables. Practicing traditional farming methods passed down for generations.'
    },
    {
      id: 3,
      name: 'Sanjay Patel',
      location: 'Gujarat, India',
      rating: 4.9,
      products: ['Cotton', 'Peanuts', 'Spices'],
      deliveryTime: '3-4 days',
      image: 'https://images.unsplash.com/photo-1565372195458-9de0b320ef04?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      subscriptionFee: 350,
      bio: 'Award-winning farmer focused on innovative agricultural techniques that preserve soil health and biodiversity.'
    },
    {
      id: 4,
      name: 'Lakshmi Rajan',
      location: 'Tamil Nadu, India',
      rating: 4.6,
      products: ['Rice', 'Sugarcane', 'Coconuts'],
      deliveryTime: '2-3 days',
      image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      subscriptionFee: 275,
      bio: 'Specializes in heritage rice varieties and traditional farming methods that preserve the cultural heritage of Tamil Nadu.'
    },
    {
      id: 5,
      name: 'Harjinder Singh',
      location: 'Haryana, India',
      rating: 4.5,
      products: ['Wheat', 'Mustard', 'Barley'],
      deliveryTime: '2-3 days',
      image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      subscriptionFee: 325,
      bio: 'Uses modern farming technology combined with sustainable methods to maximize yield while minimizing environmental impact.'
    }
  ]);

  return (
    <div className="adopt-farm-container">
      <h1 className="adopt-farm-title">Adopt a Farm</h1>
      <p className="adopt-farm-description">
        Support local farmers by adopting their farms. Your monthly subscription helps them maintain sustainable
        farming practices and ensures a steady income regardless of market fluctuations.
      </p>
      
      <div className="farmers-list">
        {farmers.map(farmer => (
          <Link to={`/adopt-farm/${farmer.id}`} key={farmer.id} className="farmer-card">
            <div className="farmer-image">
              <img src={farmer.image} alt={farmer.name} />
            </div>
            <div className="farmer-info">
              <h3>{farmer.name}</h3>
              <p className="location"><i className="fa fa-map-marker"></i> {farmer.location}</p>
              <div className="farmer-rating">
                <span className="star-rating">{'★'.repeat(Math.floor(farmer.rating))}</span>
                <span className="rating-value">{farmer.rating.toFixed(1)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdoptFarm; 