# 🔥 Configuración de Firebase para M y T Ventas

## 📋 Pasos para conectar Firebase

### 1. **Crear proyecto en Firebase**
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Clic en "Crear proyecto"
3. Nombre: `mytventas-store` (o el que prefieras)
4. Habilita Google Analytics (opcional)

### 2. **Configurar Firestore Database**
1. En el menú lateral, ve a "Firestore Database"
2. Clic en "Crear base de datos"
3. Selecciona "Modo de prueba" (por ahora)
4. Elige la región más cercana (us-central1)

### 3. **Configurar Authentication**
1. En el menú lateral, ve a "Authentication"
2. Clic en "Comenzar"
3. Ve a la pestaña "Sign-in method"
4. Habilita "Email/Password"

### 4. **Configurar Storage (opcional)**
1. En el menú lateral, ve a "Storage"
2. Clic en "Comenzar"
3. Selecciona "Modo de prueba"

### 5. **Obtener configuración**
1. Ve a "Configuración del proyecto" (⚙️)
2. Scroll hacia abajo hasta "Tus aplicaciones"
3. Clic en el ícono web (</>)
4. Registra la app con nombre: `mytventas-web`
5. **Copia la configuración** que aparece

### 6. **Instalar Firebase en el proyecto**
```bash
npm install firebase
```

### 7. **Actualizar configuración**
Reemplaza el contenido de `src/firebase/config.js` con tu configuración real:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "tu-api-key-real",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### 8. **Descomentar funciones Firebase**
En `src/firebase/products.js` y `src/firebase/auth.js`, descomenta todas las líneas que tienen `// TODO:`

## 🎯 **Resultado Final**

Una vez configurado Firebase:

✅ **Cambios en dashboard** → Se reflejan **inmediatamente** en la tienda pública  
✅ **Agregar producto** → Aparece **al instante** en el catálogo  
✅ **Editar producto** → Se actualiza **en tiempo real**  
✅ **Eliminar producto** → Se quita **automáticamente**  
✅ **Login real** → Autenticación con Firebase Auth  
✅ **Datos persistentes** → Se guardan en Firestore  
✅ **Imágenes** → Se suben a Firebase Storage  

## 🔒 **Reglas de Seguridad (Firestore)**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura pública de productos
    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null; // Solo usuarios autenticados
    }
  }
}
```

## 🚀 **¡Listo!**

Con estos pasos, tu aplicación tendrá sincronización en tiempo real entre el dashboard y la tienda pública.
