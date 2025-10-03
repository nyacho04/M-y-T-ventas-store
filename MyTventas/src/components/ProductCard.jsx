import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onViewDetails }) => {
  const handleViewMore = () => {
    onViewDetails(product);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        <div className="product-overlay">
          <button
            className="view-details-btn"
            onClick={handleViewMore}
            aria-label={`Ver detalles de ${product.name}`}
          >
            Ver más
          </button>
        </div>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <div className="product-price-container">
          <span className="product-price">UYU ${product.price.toLocaleString('es-UY')}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
