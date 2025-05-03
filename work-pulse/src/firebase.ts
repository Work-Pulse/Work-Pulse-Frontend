// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const auth = getAuth(app);