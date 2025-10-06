import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ onCategorySelect, selectedCategory }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'hombre', name: 'Hombre' },
    { id: 'mujer', name: 'Mujer' },
    { id: 'niños', name: 'Niños' },
    { id: 'accesorios', name: 'Accesorios' }
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
              {categories.map((category) => (
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
            {categories.map((category) => (
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
