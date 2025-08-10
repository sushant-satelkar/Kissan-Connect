import React, { useState } from 'react';
import '../../styles/farmer/FarmerDashboard.css';
import AddCropForm from './AddCropForm';
import ManageListings from './ManageListings';
import PricePrediction from './PricePrediction';
import OrderManagement from './OrderManagement';
import CropHealthAnalysis from './CropHealthAnalysis';

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('addCrop');
  
  // Mock data for crops with images
  const [crops, setCrops] = useState([
    {
      id: 1,
      name: 'Organic Rice',
      quantity: 150,
      unit: 'kg',
      price: 60,
      location: 'Punjab',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 2,
      name: 'Fresh Tomatoes',
      quantity: 75,
      unit: 'kg',
      price: 40,
      location: 'Maharashtra',
      image: 'https://images.unsplash.com/photo-1592841200221-a6c68de1c429?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 3,
      name: 'Potatoes',
      quantity: 200,
      unit: 'kg',
      price: 25,
      location: 'Uttar Pradesh',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 4,
      name: 'Apples',
      quantity: 100,
      unit: 'kg',
      price: 120,
      location: 'Himachal Pradesh',
      image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 5,
      name: 'Onions',
      quantity: 180,
      unit: 'kg',
      price: 35,
      location: 'Maharashtra',
      image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  ]);
  
  // Mock data for orders
  const [orders, setOrders] = useState([
    {
      id: 1001,
      consumerName: 'Rahul Sharma',
      orderDate: '2023-06-10',
      cropName: 'Organic Rice',
      quantity: 20,
      unit: 'kg',
      price: 60,
      total: 1200,
      status: 'pending'
    },
    {
      id: 1002,
      consumerName: 'Priya Patel',
      orderDate: '2023-06-09',
      cropName: 'Fresh Tomatoes',
      quantity: 15,
      unit: 'kg',
      price: 40,
      total: 600,
      status: 'accepted'
    },
    {
      id: 1003,
      consumerName: 'Amit Kumar',
      orderDate: '2023-06-08',
      cropName: 'Potatoes',
      quantity: 50,
      unit: 'kg',
      price: 25,
      total: 1250,
      status: 'pending'
    },
    {
      id: 1004,
      consumerName: 'Neha Singh',
      orderDate: '2023-06-07',
      cropName: 'Apples',
      quantity: 10,
      unit: 'kg',
      price: 120,
      total: 1200,
      status: 'rejected'
    },
    {
      id: 1005,
      consumerName: 'Vikram Malhotra',
      orderDate: '2023-06-06',
      cropName: 'Onions',
      quantity: 30,
      unit: 'kg',
      price: 35,
      total: 1050,
      status: 'accepted'
    }
  ]);

  // Function to add a new crop
  const handleAddCrop = (newCrop) => {
    const cropWithId = {
      ...newCrop,
      id: crops.length + 1,
      image: newCrop.image || 'https://via.placeholder.com/150'
    };
    setCrops([...crops, cropWithId]);
    setActiveTab('manageListings');
  };

  // Function to edit a crop
  const handleEditCrop = (editedCrop) => {
    setCrops(crops.map(crop => 
      crop.id === editedCrop.id ? editedCrop : crop
    ));
  };

  // Function to delete a crop
  const handleDeleteCrop = (cropId) => {
    setCrops(crops.filter(crop => crop.id !== cropId));
  };

  // Function to handle order status change
  const handleOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? {...order, status: newStatus} : order
    ));
  };

  return (
    <div className="farmer-dashboard">
      <h1 className="dashboard-title">Farmer Dashboard</h1>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'addCrop' ? 'active' : ''}`}
          onClick={() => setActiveTab('addCrop')}
        >
          Add New Crop
        </button>
        <button 
          className={`tab-button ${activeTab === 'manageListings' ? 'active' : ''}`}
          onClick={() => setActiveTab('manageListings')}
        >
          Manage Listings
        </button>
        <button 
          className={`tab-button ${activeTab === 'pricePrediction' ? 'active' : ''}`}
          onClick={() => setActiveTab('pricePrediction')}
        >
          Price Prediction
        </button>
        <button 
          className={`tab-button ${activeTab === 'orderManagement' ? 'active' : ''}`}
          onClick={() => setActiveTab('orderManagement')}
        >
          Order Management
        </button>
        <button 
          className={`tab-button ${activeTab === 'cropHealth' ? 'active' : ''}`}
          onClick={() => setActiveTab('cropHealth')}
        >
          AI Crop Health Analysis
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'addCrop' && (
          <AddCropForm onAddCrop={handleAddCrop} />
        )}
        
        {activeTab === 'manageListings' && (
          <ManageListings 
            crops={crops} 
            onEditCrop={handleEditCrop} 
            onDeleteCrop={handleDeleteCrop} 
          />
        )}
        
        {activeTab === 'pricePrediction' && (
          <PricePrediction />
        )}
        
        {activeTab === 'orderManagement' && (
          <OrderManagement 
            orders={orders} 
            onUpdateStatus={handleOrderStatus} 
          />
        )}
        
        {activeTab === 'cropHealth' && (
          <CropHealthAnalysis />
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard; 