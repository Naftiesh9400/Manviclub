import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDt2RenmYEZ7ya0TOQVbxMXNswd3e7-1VA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "manvifishingclub.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "manvifishingclub",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "manvifishingclub.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "935355648799",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:935355648799:web:1588ac044b1e454ea53e2a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-KQVYDP3WC7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Analytics only if supported (browser environment)
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
});

export default app;
