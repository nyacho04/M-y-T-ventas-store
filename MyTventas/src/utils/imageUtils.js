// Utilidades para manejo de imágenes

// Función para validar si una URL es una imagen válida
export const isValidImageUrl = (url) => {
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url) || 
           url.includes('imgur.com') || 
           url.includes('drive.google.com') ||
           url.includes('dropbox.com');
  } catch {
    return false;
  }
};

// Función para redimensionar imagen antes de convertir a Base64
export const resizeImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo proporción
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, width, height);

      // Convertir a blob con calidad específica
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

// Función para comprimir imagen
export const compressImage = async (file, maxSizeKB = 500) => {
  let quality = 0.8;
  let compressedFile = file;

  // Si la imagen ya es pequeña, devolverla tal como está
  if (file.size <= maxSizeKB * 1024) {
    return file;
  }

  // Redimensionar y comprimir progresivamente
  while (compressedFile.size > maxSizeKB * 1024 && quality > 0.1) {
    compressedFile = await resizeImage(file, 800, 600, quality);
    quality -= 0.1;
  }

  return compressedFile;
};
