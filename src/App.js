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

// react hooks
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

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
