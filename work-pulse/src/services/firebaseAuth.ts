// src/services/firebaseAuth.ts
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
  } from "firebase/auth";
  import { auth } from "../firebase";
  
  // Register user
  export const registerUser = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);
  
  // Login user
  export const loginUser = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);
  
  // Logout
  export const logoutUser = () => signOut(auth);
  
  // Observe session state
  export const observeUser = (cb: (user: User | null) => void) =>
    onAuthStateChanged(auth, cb);
  