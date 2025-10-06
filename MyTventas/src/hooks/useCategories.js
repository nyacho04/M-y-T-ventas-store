import { useState, useEffect } from 'react';

const useCategories = () => {
  const [categories, setCategories] = useState([
    { value: 'hombre', label: 'Hombre' },
    { value: 'mujer', label: 'Mujer' },
    { value: 'niños', label: 'Niños' },
    { value: 'accesorios', label: 'Accesorios' }
  ]);

  const addCategory = (newCategory) => {
    const categoryId = newCategory.toLowerCase().replace(/\s+/g, '-');
    const categoryExists = categories.some(cat => cat.value === categoryId);

    if (!categoryExists) {
      const newCat = {
        value: categoryId,
        label: newCategory.trim()
      };
      setCategories(prev => [...prev, newCat]);
      return newCat;
    }
    return null;
  };

  const removeCategory = (categoryId) => {
    setCategories(prev => prev.filter(cat => cat.value !== categoryId));
  };

  return {
    categories,
    addCategory,
    removeCategory
  };
};

export default useCategories;
