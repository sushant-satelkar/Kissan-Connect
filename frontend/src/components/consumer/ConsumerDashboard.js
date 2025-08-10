import React, { useState } from 'react';
import '../../styles/consumer/ConsumerDashboard.css';
import BrowseProducts from './BrowseProducts';
import ProductDetails from './ProductDetails';
import ShoppingCart from './ShoppingCart';
import Checkout from './Checkout';
import MyOrders from './MyOrders';

const ConsumerDashboard = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  
  // Mock data for products with images
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Organic Rice',
      price: 60,
      unit: 'kg',
      quantity: 150,
      description: 'Premium quality organic basmati rice. Grown without the use of chemical pesticides or fertilizers.',
      farmerName: 'Rajesh Kumar',
      location: 'Punjab',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 2,
      name: 'Fresh Tomatoes',
      price: 40,
      unit: 'kg',
      quantity: 75,
      description: 'Juicy, ripe tomatoes picked fresh from the farm. Perfect for salads and cooking.',
      farmerName: 'Anita Desai',
      location: 'Maharashtra',
      image: 'https://images.unsplash.com/photo-1592841200221-a6c68de1c429?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 3,
      name: 'Potatoes',
      price: 25,
      unit: 'kg',
      quantity: 200,
      description: 'Fresh, farm-grown potatoes. Great for a variety of dishes from curries to fries.',
      farmerName: 'Sanjay Patel',
      location: 'Uttar Pradesh',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 4,
      name: 'Apples',
      price: 120,
      unit: 'kg',
      quantity: 100,
      description: 'Sweet and crunchy apples freshly harvested from the orchards of Himachal Pradesh.',
      farmerName: 'Vikram Singh',
      location: 'Himachal Pradesh',
      image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 5,
      name: 'Onions',
      price: 35,
      unit: 'kg',
      quantity: 180,
      description: 'Fresh, farm-grown onions. An essential ingredient for Indian cooking.',
      farmerName: 'Anita Desai',
      location: 'Maharashtra',
      image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 6,
      name: 'Organic Wheat Flour',
      price: 50,
      unit: 'kg',
      quantity: 120,
      description: 'Stone-ground whole wheat flour made from organically grown wheat.',
      farmerName: 'Rajesh Kumar',
      location: 'Punjab',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 7,
      name: 'Fresh Green Peas',
      price: 80,
      unit: 'kg',
      quantity: 50,
      description: 'Sweet and tender green peas freshly harvested from the farm.',
      farmerName: 'Vikram Singh',
      location: 'Uttar Pradesh',
      image: 'https://images.unsplash.com/photo-1552043265-7fbfc51d5f6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 8,
      name: 'Organic Honey',
      price: 450,
      unit: 'kg',
      quantity: 25,
      description: 'Pure, raw honey produced by bees foraging on organic farms and wildflowers.',
      farmerName: 'Amit Sharma',
      location: 'Uttarakhand',
      image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  ]);
  
  // Mock data for orders
  const [orders, setOrders] = useState([
    {
      id: 2001,
      date: '2023-06-15',
      items: [
        { productId: 1, name: 'Organic Rice', price: 60, unit: 'kg', quantity: 5, total: 300, image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
        { productId: 2, name: 'Fresh Tomatoes', price: 40, unit: 'kg', quantity: 3, total: 120, image: 'https://images.unsplash.com/photo-1592841200221-a6c68de1c429?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }
      ],
      totalAmount: 420,
      status: 'Delivered',
      deliveryAddress: '123 Main St, Mumbai, Maharashtra',
      paymentMethod: 'UPI'
    },
    {
      id: 2002,
      date: '2023-06-10',
      items: [
        { productId: 3, name: 'Potatoes', price: 25, unit: 'kg', quantity: 10, total: 250, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
        { productId: 5, name: 'Onions', price: 35, unit: 'kg', quantity: 5, total: 175, image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }
      ],
      totalAmount: 425,
      status: 'Shipped',
      deliveryAddress: '456 Park Ave, Delhi, Delhi',
      paymentMethod: 'Credit Card'
    },
    {
      id: 2003,
      date: '2023-06-05',
      items: [
        { productId: 4, name: 'Apples', price: 120, unit: 'kg', quantity: 2, total: 240, image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
        { productId: 8, name: 'Organic Honey', price: 450, unit: 'kg', quantity: 1, total: 450, image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }
      ],
      totalAmount: 690,
      status: 'Delivered',
      deliveryAddress: '789 Green Rd, Bangalore, Karnataka',
      paymentMethod: 'Cash on Delivery'
    },
    {
      id: 2004,
      date: '2023-06-01',
      items: [
        { productId: 6, name: 'Organic Wheat Flour', price: 50, unit: 'kg', quantity: 5, total: 250, image: 'https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }
      ],
      totalAmount: 250,
      status: 'Delivered',
      deliveryAddress: '101 Lake View, Chennai, Tamil Nadu',
      paymentMethod: 'UPI'
    },
    {
      id: 2005,
      date: '2023-05-25',
      items: [
        { productId: 7, name: 'Fresh Green Peas', price: 80, unit: 'kg', quantity: 2, total: 160, image: 'https://images.unsplash.com/photo-1552043265-7fbfc51d5f6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
        { productId: 2, name: 'Fresh Tomatoes', price: 40, unit: 'kg', quantity: 3, total: 120, image: 'https://images.unsplash.com/photo-1592841200221-a6c68de1c429?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
        { productId: 5, name: 'Onions', price: 35, unit: 'kg', quantity: 4, total: 140, image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }
      ],
      totalAmount: 420,
      status: 'Delivered',
      deliveryAddress: '234 Hill Road, Hyderabad, Telangana',
      paymentMethod: 'Credit Card'
    }
  ]);
  
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setActiveTab('productDetails');
  };
  
  const handleAddToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Update quantity if product already in cart
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.price } 
          : item
      ));
    } else {
      // Add new item to cart
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        quantity: quantity,
        total: product.price * quantity,
        image: product.image
      }]);
    }
    
    // Show a success message or notification
    alert(`${product.name} added to cart!`);
  };
  
  const handleUpdateCartItem = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or negative
      setCart(cart.filter(item => item.productId !== productId));
    } else {
      // Update quantity
      setCart(cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: newQuantity, total: newQuantity * item.price } 
          : item
      ));
    }
  };
  
  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };
  
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    setActiveTab('checkout');
  };
  
  const handlePlaceOrder = (orderDetails) => {
    // In a real app, this would send the order to a backend API
    const newOrder = {
      id: orders.length + 2006,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      totalAmount: cart.reduce((sum, item) => sum + item.total, 0),
      status: 'Pending',
      deliveryAddress: orderDetails.address,
      paymentMethod: orderDetails.paymentMethod
    };
    
    setOrders([...orders, newOrder]);
    setCart([]);
    setActiveTab('myOrders');
    
    // Show success message
    alert('Order placed successfully!');
  };
  
  const handleBackToBrowse = () => {
    setSelectedProduct(null);
    setActiveTab('browse');
  };

  return (
    <div className="consumer-dashboard">
      <h1 className="dashboard-title">Consumer Dashboard</h1>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          Browse Products
        </button>
        <button 
          className={`tab-button ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => setActiveTab('cart')}
        >
          Shopping Cart {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
        </button>
        <button 
          className={`tab-button ${activeTab === 'myOrders' ? 'active' : ''}`}
          onClick={() => setActiveTab('myOrders')}
        >
          My Orders
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'browse' && (
          <BrowseProducts 
            products={products} 
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCart}
          />
        )}
        
        {activeTab === 'productDetails' && selectedProduct && (
          <ProductDetails 
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onBack={handleBackToBrowse}
          />
        )}
        
        {activeTab === 'cart' && (
          <ShoppingCart 
            cartItems={cart}
            onUpdateQuantity={handleUpdateCartItem}
            onRemoveItem={handleRemoveFromCart}
            onCheckout={handleCheckout}
          />
        )}
        
        {activeTab === 'checkout' && (
          <Checkout 
            cartItems={cart}
            onPlaceOrder={handlePlaceOrder}
          />
        )}
        
        {activeTab === 'myOrders' && (
          <MyOrders orders={orders} />
        )}
      </div>
    </div>
  );
};

export default ConsumerDashboard; 