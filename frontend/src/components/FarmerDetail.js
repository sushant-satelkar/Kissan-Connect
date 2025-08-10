import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/FarmerDetail.css';

const FarmerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Mock farmer data (in a real app, this would come from an API)
  useEffect(() => {
    // Simulating API fetch
    setTimeout(() => {
      const farmersData = [
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
          image: 'https://images.unsplash.com/photo-1594761051169-d300c0c2fb61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
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
          image: 'https://images.unsplash.com/photo-1562011841-e1c4b757a247?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
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
          image: 'https://images.unsplash.com/photo-1535090042247-30387a6a6424?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          subscriptionFee: 325,
          bio: 'Uses modern farming technology combined with sustainable methods to maximize yield while minimizing environmental impact.'
        }
      ];
      
      const selectedFarmer = farmersData.find(f => f.id === parseInt(id));
      setFarmer(selectedFarmer);
      setLoading(false);
    }, 500); // Simulate loading time
  }, [id]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleSubscribe = () => {
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  
  const handleCompleteSubscription = () => {
    // In a real app, this would process the payment and create a subscription
    setSubscribed(true);
    setShowModal(false);
    
    // Show success notification
    alert(`You have successfully subscribed to ${farmer.name}'s farm!`);
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading farmer details...</p>
      </div>
    );
  }
  
  if (!farmer) {
    return (
      <div className="error-container">
        <h2>Farmer not found</h2>
        <button className="back-button" onClick={handleGoBack}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="farmer-detail-container">
      <button className="back-button" onClick={handleGoBack}>
        &larr; Back to Farmer List
      </button>
      
      <div className="farmer-detail-card">
        <div className="farmer-header">
          <div className="farmer-image-large">
            <img src={farmer.image} alt={farmer.name} />
          </div>
          <div className="farmer-header-info">
            <h1>{farmer.name}</h1>
            <p className="location"><i className="fa fa-map-marker"></i> {farmer.location}</p>
            <div className="farmer-rating-large">
              <span className="star-rating">{'★'.repeat(Math.floor(farmer.rating))}</span>
              <span className="rating-value">{farmer.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        <div className="farmer-bio">
          <h3>About the Farmer</h3>
          <p>{farmer.bio}</p>
        </div>
        
        <div className="farmer-products">
          <h3>Products Offered</h3>
          <ul className="products-list">
            {farmer.products.map((product, index) => (
              <li key={index} className="product-item">{product}</li>
            ))}
          </ul>
        </div>
        
        <div className="delivery-info">
          <h3>Estimated Delivery Time</h3>
          <p>{farmer.deliveryTime}</p>
        </div>
        
        <div className="subscription-section">
          <h3>Support this Farmer</h3>
          <div className="subscription-info">
            <p>Monthly subscription fee: ₹{farmer.subscriptionFee}</p>
            <p>Your subscription provides direct financial support to this farmer, helping them maintain sustainable farming practices.</p>
            
            {!subscribed ? (
              <button 
                className="subscribe-button" 
                onClick={handleSubscribe}
              >
                Adopt this Farm
              </button>
            ) : (
              <div className="subscribed-badge">
                <span className="check-icon">✓</span>
                <span>You've adopted this farm!</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Subscription Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="subscription-modal">
            <button className="close-modal" onClick={handleCloseModal}>&times;</button>
            <h2>Adopt {farmer.name}'s Farm</h2>
            
            <div className="subscription-details">
              <p>You are about to subscribe to:</p>
              <h3>{farmer.name}</h3>
              <p className="subscription-price">₹{farmer.subscriptionFee} per month</p>
              
              <div className="payment-methods">
                <h4>Select Payment Method</h4>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={handlePaymentMethodChange}
                    />
                    <span className="payment-label">Credit/Debit Card</span>
                  </label>
                  
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={handlePaymentMethodChange}
                    />
                    <span className="payment-label">UPI</span>
                  </label>
                  
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="netbanking"
                      checked={paymentMethod === 'netbanking'}
                      onChange={handlePaymentMethodChange}
                    />
                    <span className="payment-label">Net Banking</span>
                  </label>
                </div>
              </div>
              
              <div className="subscription-benefits">
                <h4>Benefits:</h4>
                <ul>
                  <li>Direct financial support to the farmer</li>
                  <li>Priority access to products</li>
                  <li>Regular updates from the farm</li>
                  <li>Invitation to farm visits (where applicable)</li>
                </ul>
              </div>
              
              <div className="subscription-actions">
                <button className="cancel-button" onClick={handleCloseModal}>Cancel</button>
                <button className="confirm-button" onClick={handleCompleteSubscription}>
                  Confirm Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDetail; 