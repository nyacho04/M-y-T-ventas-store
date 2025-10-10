import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, TagIcon } from '../icons/Icons';
import useCategories from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import './CategoryManager.css';

const CategoryManager = () => {
  const navigate = useNavigate();
  const { categories, loading, error, addCategory, removeCategory } = useCategories();
  const { products } = useProducts();
  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  // Función para contar productos por categoría
  const getCategoryProductCount = (categoryValue) => {
    return products.filter(product => product.category === categoryValue).length;
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    const categoryId = newCategory.toLowerCase().replace(/\s+/g, '-');
    const categoryExists = categories.some(cat => cat.value === categoryId || cat.id === categoryId);

    if (categoryExists) {
      alert('Esta categoría ya existe');
      return;
    }

    setAddingCategory(true);
    
    try {
      const success = await addCategory(newCategory.trim());
      if (success) {
        setNewCategory('');
        console.log('Categoría agregada:', newCategory);
      } else {
        alert('Error al agregar la categoría');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar la categoría');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        const success = await removeCategory(categoryId);
        if (success) {
          console.log('Categoría eliminada:', categoryId);
        } else {
          alert('Error al eliminar la categoría');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar la categoría');
      }
    }
  };

  return (
    <div className="category-manager">
      <div className="category-header">
        <h1 className="page-title">Gestión de Categorías</h1>
        <button 
          className="back-btn"
          onClick={() => navigate('/admin')}
        >
          ← Volver al Dashboard
        </button>
      </div>

      {/* Add Category Form */}
      <div className="add-category-section">
        <h2 className="section-title">
          <PlusIcon size={20} />
          Agregar Nueva Categoría
        </h2>
        
        <form onSubmit={handleAddCategory} className="category-form">
          <div className="form-group">
            <label htmlFor="categoryName" className="form-label">
              Nombre de la Categoría
            </label>
            <input
              type="text"
              id="categoryName"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="form-input"
              placeholder="Ej: Calzado, Deportes, Formal..."
              required
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            className="submit-btn"
            disabled={loading || !newCategory.trim()}
          >
            {loading ? 'Agregando...' : 'Agregar Categoría'}
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="categories-section">
        <h2 className="section-title">
          <TagIcon size={20} />
          Categorías Existentes
        </h2>
        
        {loading ? (
          <div className="loading-message">
            <p>Cargando categorías...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => {
              const categoryValue = category.value || category.id;
              const productCount = getCategoryProductCount(categoryValue);
              
              return (
                <div key={category.id} className="category-card">
                  <div className="category-info">
                    <h3 className="category-name">{category.name}</h3>
                    <p className="category-count">
                      {productCount} {productCount === 1 ? 'producto' : 'productos'}
                    </p>
                  </div>
                
                <div className="category-actions">
                  <button 
                    className="delete-category-btn"
                    onClick={() => handleDeleteCategory(category.id)}
                    title="Eliminar categoría"
                  >
                    ×
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
