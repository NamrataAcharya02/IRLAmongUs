// Configuration is okay to be public, though can be factored out.
// In fact, all setup for app can be factored out.
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let firebaseConfig = {
  apiKey: "AIzaSyC8_TMAHAg-9Fzq4kIBDzf9_veCPdqUHGY",
  authDomain: "irl-among-us-d5453.firebaseapp.com",
  projectId: "irl-among-us-d5453",
  storageBucket: "irl-among-us-d5453.appspot.com",
  messagingSenderId: "299437319897",
  appId: "1:299437319897:web:1a4aff6578a93b98cd40c8",
  measurementId: "G-1SS9R7WKDG"
};

// // eslint-disable-next-line no-restricted-globals
// if (location.hostname === 'localhost') {
//   firebaseConfig = {
//     projectId: 'irl-among-us-d5453',
//     appId: 'test',
//     apiKey: 'AIzaSyC8_TMAHAg-9Fzq4kIBDzf9_veCPdqUHGY',
//     authDomain: 'irl-among-us-d5453.firebaseapp.com'
//   }
// }

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// firebase objects
export const googleAuthProvider = new GoogleAuthProvider();

// export const db = getFirestore(app);
// export const auth = getAuth(app);
const db = getFirestore(app);
const auth = getAuth(app);



export { db, auth };