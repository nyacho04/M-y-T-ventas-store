import React from 'react';
import useCategories from '../hooks/useCategories';
import './ProductCard.css';

const ProductCard = ({ product, onViewDetails }) => {
  const { categories } = useCategories();
  
  const handleViewMore = () => {
    onViewDetails(product);
  };

  // Verificar si la categoría del producto existe
  const categoryExists = categories.some(cat => cat.value === product.category);
  const displayCategory = categoryExists ? product.category : 'Sin categoría';

  // Obtener la primera imagen del producto (compatibilidad con formato antiguo y nuevo)
  const productImages = product.images || (product.image ? [product.image] : []);
  const displayImage = productImages.length > 0 ? productImages[0] : '';

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={displayImage}
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
        <p className="product-category">{displayCategory}</p>
        <div className="product-price-container">
          <span className="product-price">
            {typeof product.price === 'number' 
              ? `UYU $${product.price.toLocaleString('es-UY')}`
              : `UYU $${product.price}`
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
