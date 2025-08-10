import React from 'react';
import '../../styles/consumer/ShoppingCart.css';

const ShoppingCart = ({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const totalAmount = cartItems.reduce((sum, item) => sum + item.total, 0);
  
  const handleQuantityChange = (productId, e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity >= 0) {
      onUpdateQuantity(productId, newQuantity);
    }
  };
  
  const handleIncrement = (productId, currentQuantity) => {
    onUpdateQuantity(productId, currentQuantity + 1);
  };
  
  const handleDecrement = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      onUpdateQuantity(productId, currentQuantity - 1);
    }
  };
  
  return (
    <div className="shopping-cart">
      <h2>Your Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <p>Add some products to your cart to see them here.</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.productId} className="cart-item">
                    <td className="product-cell">
                      <div className="cart-product-info">
                        <img src={item.image} alt={item.name} className="cart-product-image" />
                        <span className="cart-product-name">{item.name}</span>
                      </div>
                    </td>
                    <td className="price-cell">₹{item.price} per {item.unit}</td>
                    <td className="quantity-cell">
                      <div className="cart-quantity-controls">
                        <button 
                          className="quantity-button" 
                          onClick={() => handleDecrement(item.productId, item.quantity)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId, e)}
                          min="1"
                          className="cart-quantity-input"
                        />
                        <button 
                          className="quantity-button" 
                          onClick={() => handleIncrement(item.productId, item.quantity)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="total-cell">₹{item.total.toFixed(2)}</td>
                    <td className="actions-cell">
                      <button 
                        className="remove-button"
                        onClick={() => onRemoveItem(item.productId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="cart-summary">
            <div className="cart-total">
              <span className="total-label">Total Amount:</span>
              <span className="total-value">₹{totalAmount.toFixed(2)}</span>
            </div>
            <button className="checkout-button" onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCart; 