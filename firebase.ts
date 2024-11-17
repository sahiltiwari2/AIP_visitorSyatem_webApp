
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB0VsF_jrZAIXzvLRuC6fcQvjra_hJclS0",
  authDomain: "visitormanagementsystem-40067.firebaseapp.com",
  projectId: "visitormanagementsystem-40067",
  storageBucket: "visitormanagementsystem-40067.firebasestorage.app",
  messagingSenderId: "1070194937587",
  appId: "1:1070194937587:web:9e2e47ff8b3fade85fb186",
  measurementId: "G-MM72QHN41D",
  databaseURL: "https://visitormanagementsystem-40067-default-rtdb.firebaseio.com",
};

const app =!getApps().length ? initializeApp(firebaseConfig) : getApp( );
export const auth = getAuth(app);
export const database = getDatabase(app);
export {app}