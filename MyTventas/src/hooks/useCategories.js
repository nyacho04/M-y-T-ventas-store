import { useState, useEffect } from 'react';
import { getCategories, addCategory, deleteCategory, subscribeToCategories } from '../firebase/products';

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCategories();
        
        // Si no hay categorías en Firebase, crear las categorías por defecto
        if (categoriesData.length === 0) {
          const defaultCategories = [
            { name: 'Hombre', value: 'hombre' },
            { name: 'Mujer', value: 'mujer' },
            { name: 'Accesorios', value: 'accesorios' }
          ];
          
          for (const cat of defaultCategories) {
            await addCategory(cat);
          }
          
          // Cargar las categorías recién creadas
          const newCategories = await getCategories();
          setCategories(newCategories);
        } else {
          setCategories(categoriesData);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError(err.message);
        // Fallback a categorías por defecto si hay error
        setCategories([
          { id: 'hombre', name: 'Hombre', value: 'hombre' },
          { id: 'mujer', name: 'Mujer', value: 'mujer' },
          { id: 'accesorios', name: 'Accesorios', value: 'accesorios' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    // Cargar categorías iniciales
    loadCategories();

    // Suscribirse a cambios en tiempo real
    const unsubscribe = subscribeToCategories((updatedCategories) => {
      setCategories(updatedCategories);
    });

    // Limpieza al desmontar
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleAddCategory = async (categoryName) => {
    try {
      const categoryData = {
        name: categoryName.trim(),
        value: categoryName.toLowerCase().replace(/\s+/g, '-')
      };
      
      await addCategory(categoryData);
      return true;
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Error al agregar categoría');
      return false;
    }
  };

  const handleRemoveCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      return true;
    } catch (error) {
      console.error('Error removing category:', error);
      setError('Error al eliminar categoría');
      return false;
    }
  };

  // Convertir para compatibilidad con ProductForm (value/label)
  const categoriesForSelect = categories.map(cat => ({
    value: cat.value || cat.id,
    label: cat.name
  }));

  return {
    categories,
    categoriesForSelect,
    loading,
    error,
    addCategory: handleAddCategory,
    removeCategory: handleRemoveCategory
  };
};

export default useCategories;
