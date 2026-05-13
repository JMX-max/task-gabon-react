import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzRZVkBtIHVogm4tYROc38UhXR7-xGaPw",
  authDomain: "tachegabon.firebaseapp.com",
  projectId: "tachegabon",
  storageBucket: "tachegabon.firebasestorage.app",
  messagingSenderId: "252796907311",
  appId: "1:252796907311:web:1de4b5b13fa46c78cb7bda",
   measurementId: "G-RE3PLRL3ZB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);