
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "nepal-emart.firebaseapp.com",
  projectId: "nepal-emart",
  storageBucket: "nepal-emart.appspot.com",
  messagingSenderId: "1093390230232",
  appId: "1:1093390230232:web:a6db3f568f9a353634b83b",
  measurementId: "G-1B9C1V3Z3V"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
