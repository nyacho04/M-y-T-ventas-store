import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import Footer from './components/Footer';
import { sampleProducts } from './data/products';
import './App.css';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return sampleProducts;
    }
    return sampleProducts.filter(product => product.category === selectedCategory);
  }, [selectedCategory]);

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
                Descubre nuestra colección de productos.
              </p>
            </div>
            
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
}

export default App;
