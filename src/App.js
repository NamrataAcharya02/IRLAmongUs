import React, { useRef, useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Pages from "./pages/homepage";
import AdminPage from './pages/AdminPage';
import PlayerWaiting from './pages/PlayerWaiting';
// firebase imports
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// react hooks
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// Configuration is okay to be public, though can be factored out.
// In fact, all setup for app can be factored out.
// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyC8_TMAHAg-9Fzq4kIBDzf9_veCPdqUHGY",
//   authDomain: "irl-among-us-d5453.firebaseapp.com",
//   projectId: "irl-among-us-d5453",
//   storageBucket: "irl-among-us-d5453.appspot.com",
//   messagingSenderId: "299437319897",
//   appId: "1:299437319897:web:1a4aff6578a93b98cd40c8",
//   measurementId: "G-1SS9R7WKDG"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// // Initialize application
// firebase.initializeApp(firebaseConfig)

// // firebase objects
// const auth = firebase.auth();
// const firestore = firebase.firestore();



// const App = () =>{
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Pages />} />
//         <Route path="adminpage" element={<AdminPage />} />
//       </Routes>
//     </Router>
//   );
// }
function App(){
  return(
    
    <Router>
       <Routes>
          <Route path="/" element={<Pages />} />
          <Route path="adminpage" element={<AdminPage />} />
          <Route path="lobby" element={<PlayerWaiting />} />
       </Routes>
    </Router>
  )
}
export default App;

// function App() {
//   // react objects
//   const [user] = useAuthState(auth);
  
//   return (
    
//     <div className="App">
//       <header>
//        <h1>⚛️🔥💬 IRL Among Us</h1>
//        <SignOut />
//       </header>

//       <section>
//         {user ? <ChatRoom /> : <SignIn />}
//       </section>

//     </div>
//   );
// }



// function SignIn() {

//   const signInWithGoogle = () => {
//     const provider = new firebase.auth.GoogleAuthProvider();
//     auth.signInWithPopup(provider);
//   }

//   return (<>
//     <button onClick={signInWithGoogle}>Sign in with Google</button>
//     </>
//   )
// }

// function SignOut() {
//   return auth.currentUser && (
//     <button onClick={() => auth.signOut()} className='sign-out'>Sign Out</button>
//   )
// }

// function ChatRoom() {

//   const dummy = useRef(); // scroll to bottom div dummy

//   const messagesRef = firestore.collection('messages');
//   const query = messagesRef.orderBy('createdAt').limit(25);

//   const [messages] = useCollectionData(query, {idField: 'id'});

//   const [formValue, setFormValue] = useState('');

//   const sendMessage = async(e) => {
    
//     e.preventDefault(); // Do not refresh page on submit

//     const { uid, photoURL } = auth.currentUser;

//     await messagesRef.add({  // create a new document in firestore
//       text: formValue,
//       createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Good practice to take time from server, not local, to avoid timezone issues
//       uid,
//       photoURL
//     });

//     // reset form to empty string after message is sent
//     setFormValue('');

//     // snap to bottom of chat
//     dummy.current.scrollIntoView({behavior: 'smooth' });
//   }

//   return (<>
//       <main>
//       {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
//         <span ref={dummy}></span>
//       </main>

//       <form onSubmit={sendMessage}>
//         {/* When user types in form, trigger onChange event */}
//         <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />

//         <button type="submit">🕊️</button>
//       </form>
//     </>)
// }

// function ChatMessage(props) {
//   const { text, uid, photoURL } = props.message;

//   const messageClass = uid == auth.currentUser.id ? 'sent' : 'received';
  
//   return (<>
//   <div className={`message ${messageClass}`}>
//     <img src={photoURL}/>
//     <p>{text}</p>
//   </div></>)
// }


// export default App;
