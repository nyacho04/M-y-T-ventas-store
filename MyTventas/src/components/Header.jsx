import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCategories from '../hooks/useCategories';
import './Header.css';

const Header = ({ onCategorySelect, selectedCategory }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { categories } = useCategories();

  // Agregar "Todos" como primera opción y usar categorías de Firebase
  const allCategories = [
    { id: 'all', name: 'Todos' },
    ...categories.map(cat => ({
      id: cat.value || cat.id,
      name: cat.name
    }))
  ];

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCategoryClick = (categoryId) => {
    onCategorySelect(categoryId);
    setIsMenuOpen(false);
  };

  const handleAdminClick = () => {
    navigate('/admin/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo">
            <h1>M y T Ventas</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <ul className="nav-list">
              {allCategories.map((category) => (
                <li key={category.id}>
                  <button
                    className={`nav-item ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={handleMenuToggle}
            aria-label="Abrir menú"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Admin Login Button */}
          <div className="admin-section">
            <button 
              className="admin-login-btn"
              onClick={handleAdminClick}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className={`nav-mobile ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list-mobile">
            {allCategories.map((category) => (
              <li key={category.id}>
                <button
                  className={`nav-item-mobile ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name}
                </button>
              </li>
            ))}
            <li>
              <button
                className="nav-item-mobile admin-mobile-btn"
                onClick={() => {
                  handleAdminClick();
                  setIsMenuOpen(false);
                }}
              >
                🔐 Admin
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
