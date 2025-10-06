import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, TagIcon } from '../icons/Icons';
import './CategoryManager.css';

const CategoryManager = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([
    { id: 'hombre', name: 'Hombre', count: 0 },
    { id: 'mujer', name: 'Mujer', count: 0 },
    { id: 'niños', name: 'Niños', count: 0 },
    { id: 'accesorios', name: 'Accesorios', count: 0 }
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    const categoryId = newCategory.toLowerCase().replace(/\s+/g, '-');
    const categoryExists = categories.some(cat => cat.id === categoryId);

    if (categoryExists) {
      alert('Esta categoría ya existe');
      return;
    }

    setLoading(true);
    
    // Simular guardado (aquí conectarías con Firebase)
    setTimeout(() => {
      const newCat = {
        id: categoryId,
        name: newCategory.trim(),
        count: 0
      };
      setCategories(prev => [...prev, newCat]);
      setNewCategory('');
      setLoading(false);
      console.log('Categoría agregada:', newCat);
    }, 500);
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      console.log('Categoría eliminada:', categoryId);
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
        
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-info">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">{category.count} productos</p>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
