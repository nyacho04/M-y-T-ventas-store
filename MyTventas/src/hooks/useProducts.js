import { useState, useEffect } from 'react';
import { getProducts, subscribeToProducts } from '../firebase/products';

// Hook para manejar productos con sincronización en tiempo real
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const productsData = await getProducts();
        setProducts(productsData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    // Cargar productos iniciales
    loadProducts();

    // Suscribirse a cambios en tiempo real (cuando Firebase esté configurado)
    const unsubscribe = subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts);
    });

    // Limpieza al desmontar
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { products, loading, error };
};
