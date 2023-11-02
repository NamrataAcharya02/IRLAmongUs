// This is the homepage/landing page

import React, {useState, useId} from "react";
import Popup from 'reactjs-popup';
import PlayerWaiting from "./PlayerWaiting.js";
import { useSelector, useDispatch } from 'react-redux'
import { setValue } from '../features/counter/counterSlice.js'
import background from "../images/stars-background.jpg";

import { useNavigate } from 'react-router-dom';
import { redirect } from "react-router-dom";
import {Link} from "react-router-dom";
import "./homepage.css";

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// react hooks
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

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
const auth = firebase.auth();
const firestore = firebase.firestore();

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()} className='sign-out'>Sign Out</button>
  )
}

function Pages(){
    const [isTextFieldVisible, setTextFieldVisible] = useState(false);

    const toggleTextField = () => {
        setTextFieldVisible(!isTextFieldVisible);
    };

    const id = useId();
    const [roomCode, setRoomCode] = useState('');
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
        .then(function(){
            console.log("REDIRECTED")
            navigate('/adminpage');
        });
    }

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
        } else {
          // No user is signed in.
        }
    });

    const count = useSelector(state => state.counter.value)
    const dispatch = useDispatch()

    

    return (
        <div className="center" style={{ backgroundImage: `url(${background})` }}>
            <h1>IRL AMONG US</h1>
            {/* <Button as={Link} to="/adminpage">Go to Admin</Button> */}
            {/* <Link to="/adminpage"> */}
            <button onClick={signInWithGoogle}>Create a Game</button>
            {/* </Link> */}
            <br></br>
            <button onClick={toggleTextField}>Join a Room</button>
            <div className="inputdiv">
                {isTextFieldVisible && (
                    <input
                    type = "number"
                    placeholder="Room Code"
                    id={id}
                    onInput={e => setRoomCode(e.target.value)}
                    maxLength={6}
                    value={roomCode}
                    // Additional input field attributes and event handlers
                    />
                )}
                {isTextFieldVisible &&(
                    <Popup trigger=
                    {<button className="enter"> Enter </button>} 
                    modal nested>
                    {
                        close => (
                            <div className='modal'>
                                <h2>
                                    Room Code: {roomCode}
                                </h2>
                                <input
                                    placeholder="Nickname"
                                    className="nickname"
                                    value={nickname}
                                    onInput={e => setNickname(e.target.value)}
                                    // Additional input field attributes and event handlers
                                />
                                <div>
                                    <button className="enter2" onClick=
                                        {() => close()}>
                                            Cancel
                                    </button>
                                    <Link to="/lobby">
                                        <button 
                                            className="enter2"
                                            onClick={() => dispatch(setValue(nickname))}
                                        >
                                            Enter
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )
                    }
                    </Popup>
                )}
            </div>    
        </div>
    );
};
export default Pages;