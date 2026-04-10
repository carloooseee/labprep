import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZoXSshImeHvs1njS92kARvJluAj96WBY",
  authDomain: "lab-prep-df2fe.firebaseapp.com",
  projectId: "lab-prep-df2fe",
  storageBucket: "lab-prep-df2fe.firebasestorage.app",
  messagingSenderId: "507427448426",
  appId: "1:507427448426:web:5e1a22a8492218ea6d4c13",
  measurementId: "G-2LH418BC2P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
