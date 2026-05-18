import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
  getFirestore
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpvUD04TVEszKwZVO3fGmM3jS1jnehMV4",
  authDomain: "task-gabon.firebaseapp.com",
  projectId: "task-gabon",
  storageBucket: "task-gabon.firebasestorage.app",
  messagingSenderId: "1035531961007",
  appId: "1:1035531961007:web:b88886d3553e1010ed0a5a",
  measurementId: "G-6VXJB5G20B"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);