// TODO: Configurar Firebase cuando esté listo
// 1. Crear proyecto en https://console.firebase.google.com/
// 2. Instalar: npm install firebase
// 3. Reemplazar esta configuración con tus datos reales

// Configuración de ejemplo (reemplazar con tus datos reales)
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};

// Descomentar cuando Firebase esté configurado:
/*
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
*/

// Exportar configuración vacía por ahora
export const auth = null;
export const db = null;
export const storage = null;
