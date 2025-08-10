import React from 'react';
import '../styles/HomePage.css';
import Hero from './Hero';
import ProductSection from './ProductSection';

// Import images
import strawberryImg from '../assets/images/strawberry.jpg';
import radishImg from '../assets/images/radish.jpg';
import appleImg from '../assets/images/apple.jpg';
import carrotImg from '../assets/images/carrot.jpg';

const HomePage = ({ onNavigate }) => {
  // Product data
  const products = [
    {
      id: 1,
      name: 'strawberry',
      price: 170,
      unit: 'kg',
      image: strawberryImg
    },
    {
      id: 2,
      name: 'raddish',
      price: 75,
      unit: 'kg',
      image: radishImg
    },
    {
      id: 3,
      name: 'apple',
      price: 125,
      unit: 'kg',
      image: appleImg
    },
    {
      id: 4,
      name: 'carrot',
      price: 90,
      unit: 'kg',
      image: carrotImg
    }
  ];

  return (
    <div className="home-page">
      <Hero />
      <ProductSection products={products} />
    </div>
  );
};

export default HomePage; 