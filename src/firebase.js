import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// Configuration is okay to be public, though can be factored out.
// In fact, all setup for app can be factored out.
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8_TMAHAg-9Fzq4kIBDzf9_veCPdqUHGY",
  authDomain: "irl-among-us-d5453.firebaseapp.com",
  projectId: "irl-among-us-d5453",
  storageBucket: "irl-among-us-d5453.appspot.com",
  messagingSenderId: "299437319897",
  appId: "1:299437319897:web:1a4aff6578a93b98cd40c8",
  measurementId: "G-1SS9R7WKDG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize application
firebase.initializeApp(firebaseConfig)

// firebase objects
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const auth = firebase.auth();
export const firestore = firebase.firestore();