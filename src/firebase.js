// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions"; // Aggiungi questa importazione

// ✅ CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDoHibrGP14FGVvTIUh7dcXNB8dsRyEAuQ",
  authDomain: "registrazioneappmeteo.firebaseapp.com",
  projectId: "registrazioneappmeteo",
  storageBucket: "registrazioneappmeteo.firebasestorage.app",
  messagingSenderId: "337646805054",
  appId: "1:337646805054:web:9b74ce1c06ab8bdf48f16f",
  measurementId: "G-Z55N5KBC8L"
};

// ✅ INIZIALIZZA FIREBASE
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ ESPORTA FIREBASE PER TUTTI I COMPONENTI
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const functions = getFunctions(app); // Esporta functions