import React, { useEffect } from 'react';
import useCategories from '../hooks/useCategories';
import './ProductModal.css';

const ProductModal = ({ product, isOpen, onClose }) => {
  const { categories } = useCategories();
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

  // Verificar si la categoría del producto existe
  const categoryExists = categories.some(cat => cat.value === product.category);
  const displayCategory = categoryExists ? product.category : 'Sin categoría';

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
              <span className="modal-category">{displayCategory}</span>
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
              <div className="details-grid">
                {product.sizes && product.sizes.length > 0 && (
                  <div className="detail-item">
                    <strong>Tallas Disponibles:</strong>
                    <div className="detail-tags">
                      {product.sizes.map((size, index) => (
                        <span key={index} className="detail-tag">{size}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {product.colors && product.colors.length > 0 && (
                  <div className="detail-item">
                    <strong>Colores Disponibles:</strong>
                    <div className="detail-tags">
                      {product.colors.map((color, index) => (
                        <span key={index} className="detail-tag">{color}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="detail-item">
                  <strong>Disponibilidad:</strong>
                  <span className="detail-value available">En Stock</span>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="contact-btn"
                onClick={() => {
                  const message = `¡Hola! Me interesa el producto: ${product.name} - UYU $${product.price.toLocaleString('es-UY')}`;
                  const whatsappUrl = `https://api.whatsapp.com/send/?phone=59894405866&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                📱 Contactar por WhatsApp
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
