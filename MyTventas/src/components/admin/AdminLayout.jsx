import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { StoreIcon, PlusIcon, LogoutIcon, TagIcon } from '../icons/Icons';
import useAuth from '../../hooks/useAuth';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path === '/admin/add-product') return 'Agregar Producto';
    if (path.includes('/admin/edit-product/')) return 'Editar Producto';
    return 'Panel Admin';
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleBackToStore = () => {
    navigate('/');
  };

  return (
    <div className="admin-layout">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <button className="back-to-store-btn" onClick={handleBackToStore}>
            <StoreIcon size={16} />
            Ver Tienda
          </button>
          <h1 className="page-title">{getPageTitle()}</h1>
        </div>
        
        <div className="header-right">
          <button 
            className="categories-btn"
            onClick={() => navigate('/admin/categories')}
          >
            <TagIcon size={16} />
            Categorías
          </button>
          <button 
            className="add-product-btn"
            onClick={() => navigate('/admin/add-product')}
            title="Agregar Producto"
          >
            <PlusIcon size={16} />
            <span className="btn-text">Agregar Producto</span>
          </button>
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogoutIcon size={16} />
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
