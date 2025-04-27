import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAmSmV9yOy308XsxHJGymV_J6rJLKpV_sk",
  authDomain: "miopenlab.firebaseapp.com",
  projectId: "miopenlab",
  storageBucket: "miopenlab.firebasestorage.app",
  messagingSenderId: "1033230670770",
  appId: "1:1033230670770:web:f415b92bdf1636ad4ba2ab",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
