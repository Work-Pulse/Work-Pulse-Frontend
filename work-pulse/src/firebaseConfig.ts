// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';   // Import necessary functions
import { getAuth } from 'firebase/auth';         // Firebase Authentication
import { getFirestore } from 'firebase/firestore';  // Firestore (if needed)

// Firebase Configuration from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyDYeHIq8iWW_XWhSTJfUtxHA4H_l8K9Es4",
    authDomain: "work-pulse-1111.firebaseapp.com",
    projectId: "work-pulse-1111",
    storageBucket: "work-pulse-1111.firebasestorage.app",
    messagingSenderId: "426284896324",
    appId: "1:426284896324:web:1e2e759cad4c7cde0d2c11",
    measurementId: "G-4M593RB46L"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Optionally Initialize Firestore (if needed)
const db = getFirestore(app);

export { app, auth, db };  // Export the auth and db to use in your app
