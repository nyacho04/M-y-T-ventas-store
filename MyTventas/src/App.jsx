import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import Footer from './components/Footer';
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import ProductForm from './components/admin/ProductForm';
import CategoryManager from './components/admin/CategoryManager';
import { useProducts } from './hooks/useProducts';
import useAuth from './hooks/useAuth';
import './App.css';

// Componente para la tienda pública
const StoreApp = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Usar hook de productos con sincronización en tiempo real
  const { products, loading, error } = useProducts();

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter(product => product.category === selectedCategory);
  }, [products, selectedCategory]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="app">
      <Header 
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
      
      <main className="main-content">
        <div className="container">
          <section className="catalog-section">
            <div className="catalog-header">
              <h2 className="catalog-title">
                {selectedCategory === 'all' 
                  ? 'Nuestros Productos' 
                  : `Categoría: ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`
                }
              </h2>
              <p className="catalog-subtitle">
              Somos un emprendimiento de ropa ubicado en Maldonado. Tenemos ropa, accesorios y más.
              </p>
            </div>
            
            {loading ? (
              <div className="loading-spinner"></div>
            ) : error ? (
              <div className="error-message">
                <p>Error al cargar productos: {error}</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
                
                {filteredProducts.length === 0 && (
                  <div className="no-products">
                    <p>No hay productos disponibles en esta categoría.</p>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <Footer onCategorySelect={handleCategorySelect} />

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

// Componente para verificar autenticación de admin
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Verificando autenticación...</p>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal de la tienda */}
        <Route path="/" element={<StoreApp />} />
        
        {/* Rutas de administrador */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="add-product" element={<ProductForm />} />
          <Route path="edit-product/:id" element={<ProductForm />} />
          <Route path="categories" element={<CategoryManager />} />
        </Route>
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;