// TODO: Descomentar cuando Firebase esté configurado
/*
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from './config';
*/

// Funciones simuladas (reemplazar con Firebase real)
export const loginUser = async (email, password) => {
  // TODO: Reemplazar con Firebase
  /*
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
  */
  
  // Simulación actual
  if (email === 'admin@mytventas.com' && password === 'admin123') {
    return { uid: 'simulated-user-id', email };
  }
  throw new Error('Credenciales incorrectas');
};

export const logoutUser = async () => {
  // TODO: Reemplazar con Firebase
  /*
  await signOut(auth);
  */
  
  // Simulación actual
  console.log('Usuario deslogueado (simulado)');
};

export const onAuthStateChange = (callback) => {
  // TODO: Reemplazar con Firebase
  /*
  return onAuthStateChanged(auth, callback);
  */
  
  // Simulación actual
  const token = localStorage.getItem('adminToken');
  callback(token ? { uid: 'simulated-user-id' } : null);
  return () => {}; // Función de limpieza vacía
};
