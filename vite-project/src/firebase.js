

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage"; // 1. ADD THIS IMPORT

import { getAuth } from "firebase/auth"; // 1. IMPORT AUTH

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUt_v63VksaGIA8Gx6Kid_MMy7Qlajtuk",
  authDomain: "gift-website-aef6d.firebaseapp.com",
  projectId: "gift-website-aef6d",
  storageBucket: "gift-website-aef6d.firebasestorage.app",
  messagingSenderId: "754253239379",
  appId: "1:754253239379:web:6585d0aa1ba667d720a2a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Export the database so Admin.jsx can use it (THIS was missing!)
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app); // 2. EXPORT AUTH

