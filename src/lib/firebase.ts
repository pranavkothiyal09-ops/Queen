import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBHEu2w2korRgy3joknh1AXKx7ky4KjKqE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "queen-s-bakery.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "queen-s-bakery",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "queen-s-bakery.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "860496803411",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:860496803411:web:92d65a54f8dd6f70c638a6",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-28841NVWPX",
};

// Initialize Firebase app singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication singleton
export const auth = getAuth(app);
