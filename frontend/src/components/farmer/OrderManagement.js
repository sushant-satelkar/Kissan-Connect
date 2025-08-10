import React, { useState } from 'react';
import '../../styles/farmer/OrderManagement.css';

const OrderManagement = ({ orders, onUpdateStatus }) => {
  const [filter, setFilter] = useState('all');
  
  // Filter orders based on status
  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);
  
  const handleStatusChange = (orderId, newStatus) => {
    onUpdateStatus(orderId, newStatus);
  };
  
  return (
    <div className="order-management">
      <h2>Order Management</h2>
      
      <div className="order-filters">
        <button 
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Orders
        </button>
        <button 
          className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`filter-button ${filter === 'accepted' ? 'active' : ''}`}
          onClick={() => setFilter('accepted')}
        >
          Accepted
        </button>
        <button 
          className={`filter-button ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </button>
      </div>
      
      {filteredOrders.length === 0 ? (
        <p className="no-orders-message">No {filter !== 'all' ? filter : ''} orders found.</p>
      ) : (
        <div className="order-table-container">
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Consumer</th>
                <th>Date</th>
                <th>Crop</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className={`order-row ${order.status}`}>
                  <td>#{order.id}</td>
                  <td>{order.consumerName}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.cropName}</td>
                  <td>{order.quantity} {order.unit}</td>
                  <td>₹{order.price}</td>
                  <td>₹{order.total}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    {order.status === 'pending' && (
                      <div className="order-actions">
                        <button 
                          className="accept-button"
                          onClick={() => handleStatusChange(order.id, 'accepted')}
                        >
                          Accept
                        </button>
                        <button 
                          className="reject-button"
                          onClick={() => handleStatusChange(order.id, 'rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {order.status !== 'pending' && (
                      <span className="action-taken">
                        {order.status === 'accepted' ? 'Accepted' : 'Rejected'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderManagement; 