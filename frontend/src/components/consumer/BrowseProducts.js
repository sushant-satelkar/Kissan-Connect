import React, { useState } from 'react';
import '../../styles/consumer/BrowseProducts.css';

const BrowseProducts = ({ products, onViewProduct, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    location: ''
  });
  
  // Filter products based on search term and filters
  const filteredProducts = products.filter(product => {
    // Search term filter
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price range filter
    const matchesMinPrice = filters.minPrice === '' || product.price >= Number(filters.minPrice);
    const matchesMaxPrice = filters.maxPrice === '' || product.price <= Number(filters.maxPrice);
    
    // Location filter
    const matchesLocation = filters.location === '' || 
                           product.location.toLowerCase().includes(filters.location.toLowerCase());
    
    return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesLocation;
  });
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      minPrice: '',
      maxPrice: '',
      location: ''
    });
  };
  
  return (
    <div className="browse-products">
      <div className="search-filter-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products, farmers, or locations..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <div className="filters-container">
          <h3>Filters</h3>
          <div className="filter-group">
            <label htmlFor="minPrice">Min Price (₹):</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Min"
              min="0"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="maxPrice">Max Price (₹):</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max"
              min="0"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Enter location"
            />
          </div>
          
          <button className="clear-filters-button" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>
      </div>
      
      <div className="products-container">
        <h2>Available Products</h2>
        
        {filteredProducts.length === 0 ? (
          <p className="no-products-message">No products found matching your criteria.</p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img src={product.image} alt={product.name} className="product-image" />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">₹{product.price} per {product.unit}</p>
                  <p className="product-quantity">Available: {product.quantity} {product.unit}</p>
                  <p className="product-farmer">Farmer: {product.farmerName}</p>
                  <p className="product-location">Location: {product.location}</p>
                  <div className="product-actions">
                    <button 
                      className="view-details-button"
                      onClick={() => onViewProduct(product)}
                    >
                      View Details
                    </button>
                    <button 
                      className="add-to-cart-button"
                      onClick={() => onAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseProducts; 