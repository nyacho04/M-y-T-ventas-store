// TODO: Descomentar cuando Firebase esté configurado
/*
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
import { db } from './config';
*/

// Funciones simuladas (reemplazar con Firebase real)
export const getProducts = async () => {
  // TODO: Reemplazar con Firebase
  /*
  const productsSnapshot = await getDocs(collection(db, 'products'));
  return productsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  */
  
  // Simulación actual
  const { sampleProducts } = await import('../data/products');
  return sampleProducts;
};

export const addProduct = async (productData) => {
  // TODO: Reemplazar con Firebase
  /*
  const docRef = await addDoc(collection(db, 'products'), {
    ...productData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
  */
  
  // Simulación actual
  console.log('Producto agregado (simulado):', productData);
  return 'simulated-id';
};

export const updateProduct = async (productId, productData) => {
  // TODO: Reemplazar con Firebase
  /*
  const productRef = doc(db, 'products', productId);
  await updateDoc(productRef, {
    ...productData,
    updatedAt: new Date().toISOString()
  });
  */
  
  // Simulación actual
  console.log('Producto actualizado (simulado):', productId, productData);
};

export const deleteProduct = async (productId) => {
  // TODO: Reemplazar con Firebase
  /*
  await deleteDoc(doc(db, 'products', productId));
  */
  
  // Simulación actual
  console.log('Producto eliminado (simulado):', productId);
};

// Función para escuchar cambios en tiempo real
export const subscribeToProducts = (callback) => {
  // TODO: Reemplazar con Firebase
  /*
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(products);
  });
  */
  
  // Simulación actual - no hay cambios en tiempo real
  console.log('Suscripción a productos (simulada)');
  return () => {}; // Función de limpieza vacía
};
