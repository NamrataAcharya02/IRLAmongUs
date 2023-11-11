// Configuration is okay to be public, though can be factored out.
// In fact, all setup for app can be factored out.
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8_TMAHAg-9Fzq4kIBDzf9_veCPdqUHGY",
  appId: "1:299437319897:web:1a4aff6578a93b98cd40c8",
  authDomain: "irl-among-us-d5453.firebaseapp.com",
  databaseURL: "https://irl-among-us-d5453-default-rtdb.firebaseio.com",
  measurementId: "G-1SS9R7WKDG",
  messagingSenderId: "299437319897",
  projectId: "irl-among-us-d5453",
  storageBucket: "irl-among-us-d5453.appspot.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// firebase objects
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const rtdb = getDatabase(app);