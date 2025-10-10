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
    images: [] // Cambiar de image a images array
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const availableSizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Única',
    'P', 'PP', 'G', 'GG', 'EG', 'EGG',
    'Chico', 'Mediano', 'Grande', 'Extra Grande',
    'Pequeño'
  ];
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
      // Manejar tanto el formato antiguo (image) como el nuevo (images)
      const productImages = productToEdit.images || (productToEdit.image ? [productToEdit.image] : []);
      
      setFormData({
        name: productToEdit.name,
        price: productToEdit.price,
        description: productToEdit.description,
        category: productToEdit.category,
        sizes: productToEdit.sizes || [],
        colors: productToEdit.colors || [],
        images: productImages
      });
      setImagePreview(productImages.length > 0 ? productImages[0] : '');
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
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validar archivos
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona solo archivos de imagen válidos');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Las imágenes deben ser menores a 10MB. Se comprimirán automáticamente si es necesario.');
        return;
      }
    }

    setUploadingImage(true);
    setError('');

    try {
      const newImages = [];
      
      for (const file of files) {
        // Crear preview local inmediatamente para la primera imagen
        if (newImages.length === 0) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreview(e.target.result);
          };
          reader.readAsDataURL(file);
        }

        // Procesar imagen (convertir a Base64)
        const imageData = await uploadImage(file);
        newImages.push(imageData);
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
      
      console.log(`${newImages.length} imagen(es) procesada(s) exitosamente`);
    } catch (error) {
      console.error('Error processing images:', error);
      setError(error.message || 'Error al procesar las imágenes');
      setImagePreview('');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUrlChange = (e) => {
    const { value } = e.target;
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, value.trim()]
      }));
      setImagePreview(value);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    // Si removemos la primera imagen, actualizar el preview
    if (index === 0 && formData.images.length > 1) {
      setImagePreview(formData.images[1]);
    } else if (formData.images.length === 1) {
      setImagePreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validar que hay al menos una imagen
    if (formData.images.length === 0) {
      setError('Debe agregar al menos una imagen al producto');
      setLoading(false);
      return;
    }

    try {
      const productData = {
        ...formData,
        price: formData.price, // Mantener como texto para permitir formatos como "2x100"
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
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ej: 100 - 2x100 o Consultar"
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
                Imágenes del Producto *
              </label>
              
              {/* Preview de imágenes */}
              {formData.images.length > 0 && (
                <div className="images-preview">
                  <h4>Imágenes agregadas ({formData.images.length}):</h4>
                  <div className="images-grid">
                    {formData.images.map((image, index) => (
                      <div key={index} className="image-preview-item">
                        <img 
                          src={image} 
                          alt={`Preview ${index + 1}`} 
                          className="preview-image"
                        />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => handleRemoveImage(index)}
                          disabled={loading}
                        >
                          ✕
                        </button>
                        <span className="image-number">{index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Botón de carga desde galería */}
              <div className="image-upload-section">
                <label htmlFor="imageFile" className="upload-btn">
                  <span className="upload-icon">📷</span>
                  {uploadingImage ? 'Procesando imágenes...' : 'Importar desde Galería (Múltiples archivos - Max 10MB c/u)'}
                </label>
                <input
                  type="file"
                  id="imageFile"
                  accept="image/*"
                  multiple
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
                  id="imageUrl"
                  name="imageUrl"
                  onChange={handleImageUrlChange}
                  className="form-input"
                  placeholder="Pega una URL de imagen..."
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
