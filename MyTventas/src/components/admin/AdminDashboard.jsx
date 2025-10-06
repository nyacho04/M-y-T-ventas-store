import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { getProducts, deleteProduct } from '../../firebase/products';
import { PackageIcon, DollarIcon, TagIcon, EditIcon, TrashIcon } from '../icons/Icons';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(productId);
        console.log(`Producto ${productId} eliminado`);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/edit-product/${productId}`);
  };

  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, product) => sum + product.price, 0),
    categories: [...new Set(products.map(p => p.category))].length
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <PackageIcon size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalProducts}</h3>
            <p className="stat-label">Productos</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <DollarIcon size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">UYU ${stats.totalValue.toLocaleString('es-UY')}</h3>
            <p className="stat-label">Valor Total</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <TagIcon size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.categories}</h3>
            <p className="stat-label">Categorías</p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="products-section">
        <div className="section-header">
          <h2 className="section-title">Productos</h2>
        </div>

        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Tallas</th>
                <th>Colores</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="product-thumbnail"
                    />
                  </td>
                  <td>
                    <div 
                      className="product-info"
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      <h4 className="product-name">{product.name}</h4>
                      <p className="product-description" title={product.description}>
                        {product.description}
                      </p>
                      {hoveredProduct === product.id && (
                        <div className="description-tooltip">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="product-price">
                      UYU ${product.price.toLocaleString('es-UY')}
                    </span>
                  </td>
                  <td>
                    <span className="product-category">
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="product-sizes">
                      {product.sizes.map(size => (
                        <span key={size} className="size-tag">{size}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="product-colors">
                      {product.colors.map(color => (
                        <span key={color} className="color-tag">{color}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditProduct(product.id)}
                        title="Editar"
                      >
                        <EditIcon size={16} />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteProduct(product.id)}
                        title="Eliminar"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
