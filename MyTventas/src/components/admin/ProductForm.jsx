import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import useCategories from '../../hooks/useCategories';
import { addProduct, updateProduct, uploadImage } from '../../firebase/products';
import './ProductForm.css';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { products } = useProducts();
  const { categoriesForSelect } = useCategories();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'hombre',
    sizes: [],
    colors: [],
    image: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Única'];
  const availableColors = [
    'Blanco', 'Negro', 'Azul', 'Rojo', 'Verde', 'Rosa', 'Gris', 'Beige', 
    'Amarillo', 'Naranja', 'Morado', 'Violeta', 'Celeste', 'Turquesa',
    'Marfil', 'Coral', 'Salmón', 'Menta', 'Lavanda', 'Burgundy',
    'Azul Marino', 'Verde Oliva', 'Dorado', 'Plateado', 'Cobre',
    'Caqui', 'Terracota', 'Magenta', 'Cian', 'Multicolor', 'Estampado'
  ];

  useEffect(() => {
    if (isEdit && products.length > 0) {
      loadProduct();
    }
  }, [id, isEdit, products]);

  const loadProduct = () => {
    if (!isEdit || !products.length) return;
    
    setLoading(true);
    const productToEdit = products.find(p => p.id.toString() === id);
    
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        price: productToEdit.price,
        description: productToEdit.description,
        category: productToEdit.category,
        sizes: productToEdit.sizes || [],
        colors: productToEdit.colors || [],
        image: productToEdit.image
      });
      setImagePreview(productToEdit.image);
      setLoading(false);
    } else {
      setError('Producto no encontrado.');
      setLoading(false);
      navigate('/admin');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleColorToggle = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño inicial (máximo 10MB antes de compresión)
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen debe ser menor a 10MB. Se comprimirá automáticamente si es necesario.');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      // Crear preview local inmediatamente
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Procesar imagen (convertir a Base64)
      const imageData = await uploadImage(file);
      setFormData(prev => ({
        ...prev,
        image: imageData
      }));
      
      console.log('Imagen procesada exitosamente');
    } catch (error) {
      console.error('Error processing image:', error);
      setError(error.message || 'Error al procesar la imagen');
      setImagePreview('');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUrlChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      image: value
    }));
    setImagePreview(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        createdAt: new Date().toISOString()
      };

      if (isEdit) {
        await updateProduct(id, productData);
        console.log('Product updated:', productData);
      } else {
        await addProduct(productData);
        console.log('Product created:', productData);
      }

      navigate('/admin');
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="product-form">
        <div className="loading-spinner">
          <p>Cargando producto para editar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-form">
      <div className="form-header">
        <h1 className="form-title">
          {isEdit ? 'Editar Producto' : 'Agregar Producto'}
        </h1>
      </div>

      <form className="product-form-content" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Basic Info */}
          <div className="form-section">
            <h3 className="section-title">Información Básica</h3>
            
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Nombre del Producto *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ej: Remera Básica"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Precio (UYU) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="form-input"
                placeholder="890"
                min="0"
                step="0.01"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Categoría *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
                required
                disabled={loading}
              >
                {categoriesForSelect.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Descripción *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Describe el producto..."
                rows="4"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Imagen del Producto *
              </label>
              
              {/* Preview de imagen */}
              {imagePreview && (
                <div className="image-preview">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="preview-image"
                  />
                </div>
              )}
              
              {/* Botón de carga desde galería */}
              <div className="image-upload-section">
                <label htmlFor="imageFile" className="upload-btn">
                  <span className="upload-icon">📷</span>
                  {uploadingImage ? 'Procesando imagen...' : 'Importar desde Galería (Max 10MB)'}
                </label>
                <input
                  type="file"
                  id="imageFile"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden-input"
                  disabled={loading || uploadingImage}
                />
                
                <div className="or-divider">
                  <span>o</span>
                </div>
                
                {/* Input de URL manual */}
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleImageUrlChange}
                  className="form-input"
                  placeholder="Pega una URL de imagen..."
                  required
                  disabled={loading || uploadingImage}
                />
              </div>
            </div>
          </div>

          {/* Sizes and Colors */}
          <div className="form-section">
            <h3 className="section-title">Tallas Disponibles</h3>
            <div className="checkbox-group">
              {availableSizes.map(size => (
                <label key={size} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.sizes.includes(size)}
                    onChange={() => handleSizeToggle(size)}
                    disabled={loading}
                  />
                  <span className="checkbox-text">{size}</span>
                </label>
              ))}
            </div>

            <h3 className="section-title">Colores Disponibles</h3>
            <div className="checkbox-group">
              {availableColors.map(color => (
                <label key={color} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.colors.includes(color)}
                    onChange={() => handleColorToggle(color)}
                    disabled={loading}
                  />
                  <span className="checkbox-text">{color}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/admin')}
            disabled={loading}
          >
            ← Volver
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading || uploadingImage}
          >
            {loading ? 'Guardando...' : uploadingImage ? 'Subiendo imagen...' : (isEdit ? 'Guardar Cambios' : 'Crear Producto')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
