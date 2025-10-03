import React, { useEffect } from 'react';
import './ProductModal.css';

const ProductModal = ({ product, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          ×
        </button>
        
        <div className="modal-content">
          <div className="modal-image-section">
            <img
              src={product.image}
              alt={product.name}
              className="modal-image"
            />
          </div>
          
          <div className="modal-info-section">
            <div className="modal-header">
              <h2 className="modal-title">{product.name}</h2>
              <span className="modal-category">{product.category}</span>
            </div>
            
            <div className="modal-price-section">
              <span className="modal-price">UYU ${product.price.toLocaleString('es-UY')}</span>
            </div>
            
            <div className="modal-description">
              <h3>Descripción</h3>
              <p>{product.description}</p>
            </div>
            
            <div className="modal-details">
              <h3>Detalles</h3>
              <ul className="details-list">
                <li><strong>Talla:</strong> {product.size}</li>
                <li><strong>Color:</strong> {product.color}</li>
                <li><strong>Material:</strong> {product.material}</li>
                <li><strong>Disponibilidad:</strong> {product.availability}</li>
              </ul>
            </div>
            
            <div className="modal-actions">
              <button className="contact-btn">
                Contactar
              </button>
              <button className="close-btn" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
