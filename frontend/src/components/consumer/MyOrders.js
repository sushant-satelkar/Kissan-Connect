import React, { useState } from 'react';
import '../../styles/consumer/MyOrders.css';

const MyOrders = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };
  
  const handleBackToOrders = () => {
    setSelectedOrder(null);
  };
  
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };
  
  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      
      {selectedOrder ? (
        <div className="order-details">
          <button className="back-button" onClick={handleBackToOrders}>
            &larr; Back to Orders
          </button>
          
          <div className="order-details-header">
            <div className="order-info">
              <h3>Order #{selectedOrder.id}</h3>
              <p className="order-date">Placed on: {selectedOrder.date}</p>
              <p className="order-status">
                Status: 
                <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </p>
            </div>
            <div className="order-total">
              <p>Total Amount: <span className="total-value">₹{selectedOrder.totalAmount.toFixed(2)}</span></p>
            </div>
          </div>
          
          <div className="order-details-content">
            <div className="order-items-list">
              <h4>Items</h4>
              <table className="order-items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map(item => (
                    <tr key={item.productId} className="order-item-row">
                      <td>{item.name}</td>
                      <td>₹{item.price}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="order-delivery-info">
              <h4>Delivery Information</h4>
              <p><strong>Address:</strong> {selectedOrder.deliveryAddress}</p>
              <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
            </div>
            
            <div className="order-tracking">
              <h4>Order Tracking</h4>
              <div className="tracking-timeline">
                <div className={`tracking-step ${selectedOrder.status === 'Pending' || selectedOrder.status === 'Confirmed' || selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered' ? 'active' : ''}`}>
                  <div className="step-icon">1</div>
                  <div className="step-label">Order Placed</div>
                </div>
                <div className="tracking-connector"></div>
                <div className={`tracking-step ${selectedOrder.status === 'Confirmed' || selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered' ? 'active' : ''}`}>
                  <div className="step-icon">2</div>
                  <div className="step-label">Confirmed</div>
                </div>
                <div className="tracking-connector"></div>
                <div className={`tracking-step ${selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered' ? 'active' : ''}`}>
                  <div className="step-icon">3</div>
                  <div className="step-label">Shipped</div>
                </div>
                <div className="tracking-connector"></div>
                <div className={`tracking-step ${selectedOrder.status === 'Delivered' ? 'active' : ''}`}>
                  <div className="step-icon">4</div>
                  <div className="step-label">Delivered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="orders-list">
          {orders.length === 0 ? (
            <p className="no-orders-message">You haven't placed any orders yet.</p>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="order-row">
                    <td>#{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.items.length} item(s)</td>
                    <td>₹{order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="view-details-button"
                        onClick={() => handleViewDetails(order)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrders; 