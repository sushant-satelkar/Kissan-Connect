import React from 'react';
import '../styles/Hero.css';
import heroImage from '../assets/images/hero.jpg';

const Hero = () => {
  return (
    <div className="hero-container" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="hero-content">
        <h1 className="hero-title">
          Bharat Ke Kheton Se,<br />
          Seedha Aapke Ghar Tak!
        </h1>
      </div>
    </div>
  );
};

export default Hero; 