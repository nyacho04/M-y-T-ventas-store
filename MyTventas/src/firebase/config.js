// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxGnFulhAfio9tay3O2oj0hlc0qT4hPOo",
  authDomain: "m-y-t-ventas-store.firebaseapp.com",
  projectId: "m-y-t-ventas-store",
  storageBucket: "m-y-t-ventas-store.firebasestorage.app",
  messagingSenderId: "1074265596649",
  appId: "1:1074265596649:web:25c79a4547514d40110678",
  measurementId: "G-8QNRZNT57E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);