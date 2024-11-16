
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB0VsF_jrZAIXzvLRuC6fcQvjra_hJclS0",
  authDomain: "visitormanagementsystem-40067.firebaseapp.com",
  projectId: "visitormanagementsystem-40067",
  storageBucket: "visitormanagementsystem-40067.firebasestorage.app",
  messagingSenderId: "1070194937587",
  appId: "1:1070194937587:web:9e2e47ff8b3fade85fb186",
  measurementId: "G-MM72QHN41D"
};

const app =!getApps().length ? initializeApp(firebaseConfig) : getApp( );
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export {app}