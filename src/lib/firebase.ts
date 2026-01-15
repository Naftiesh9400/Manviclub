import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDt2RenmYEZ7ya0TOQVbxMXNswd3e7-1VA",
  authDomain: "manvifishingclub.firebaseapp.com",
  projectId: "manvifishingclub",
  storageBucket: "manvifishingclub.firebasestorage.app",
  messagingSenderId: "935355648799",
  appId: "1:935355648799:web:1588ac044b1e454ea53e2a",
  measurementId: "G-KQVYDP3WC7"
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
