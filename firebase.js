
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBtRvQE26w3hmEco8g0bDsY_zoCQgDD6K8",
  authDomain: "visitor-management-syste-21908.firebaseapp.com",
  projectId: "visitor-management-syste-21908",
  storageBucket: "visitor-management-syste-21908.firebasestorage.app",
  messagingSenderId: "653378898041",
  appId: "1:653378898041:web:5a20a988d8dc380c296ca8",
  databaseURL: "https://visitor-management-syste-21908-default-rtdb.firebaseio.com",
};

const app =!getApps().length ? initializeApp(firebaseConfig) : getApp( );
export const auth = getAuth(app);
export const database = getDatabase(app);
export const provider = new GoogleAuthProvider();
auth.languageCode = 'en'
export {app}

// "dev": "next dev --turbo -H 192.168.1.9",