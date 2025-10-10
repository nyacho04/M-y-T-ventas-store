
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage } from './config';
import { compressImage } from '../utils/imageUtils';

// Funciones de Firebase Firestore
export const getProducts = async () => {
  const productsSnapshot = await getDocs(collection(db, 'products'));
  return productsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const addProduct = async (productData) => {
  const docRef = await addDoc(collection(db, 'products'), {
    ...productData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

export const updateProduct = async (productId, productData) => {
  const productRef = doc(db, 'products', productId);
  await updateDoc(productRef, {
    ...productData,
    updatedAt: new Date().toISOString()
  });
};

export const deleteProduct = async (productId) => {
  await deleteDoc(doc(db, 'products', productId));
};

export const subscribeToProducts = (callback) => {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(products);
  });
};

// Función para manejar imágenes (Base64 - completamente gratuita)
export const uploadImage = async (file) => {
  try {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      throw new Error('Solo se permiten archivos de imagen');
    }

    // Comprimir imagen si es muy grande
    let processedFile = file;
    if (file.size > 1 * 1024 * 1024) { // Si es mayor a 1MB, comprimir
      console.log('Comprimiendo imagen...');
      processedFile = await compressImage(file, 500); // Comprimir a máximo 500KB
    }

    // Convertir a Base64
    const base64 = await convertToBase64(processedFile);
    return base64;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Error al procesar la imagen: ' + error.message);
  }
};

// Función alternativa: convertir a Base64 (para imágenes pequeñas)
export const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Funciones para manejar categorías en Firebase
export const getCategories = async () => {
  const categoriesSnapshot = await getDocs(collection(db, 'categories'));
  return categoriesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const addCategory = async (categoryData) => {
  const docRef = await addDoc(collection(db, 'categories'), {
    ...categoryData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

export const deleteCategory = async (categoryId) => {
  await deleteDoc(doc(db, 'categories', categoryId));
};

export const subscribeToCategories = (callback) => {
  const q = query(collection(db, 'categories'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(categories);
  });
};
