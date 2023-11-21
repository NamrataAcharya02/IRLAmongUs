// This is the homepage/landing page

import React, {useState, useId} from "react";
import Popup from 'reactjs-popup';
import PlayerWaiting from "./PlayerWaiting.js";
// import { useSelector, useDispatch } from 'react-redux'
import { setValue } from '../components/counter/counterSlice.js'
import background from "../images/stars-background.jpg";

import { useNavigate } from 'react-router-dom';
// import { redirect } from "react-router-dom";
import {Link} from "react-router-dom";
import "../style/homepage.css";

// react hooks
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import {auth, googleAuthProvider} from "../firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => signOut(auth)} className='sign-out'>Sign Out</button>
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
        signInWithPopup(auth, googleAuthProvider)
        .then(function(){
            console.log("REDIRECTED")
            navigate('/adminpage');
        });
    }

    onAuthStateChanged(auth, function(user) {
        if (user) {
          // User is signed in.
        } else {
          // No user is signed in.
        }
    });

    // const count = useSelector(state => state.counter.value)
    // const dispatch = useDispatch()

    

    return (
        <div className="centerHome" style={{ backgroundImage: `url(${background})` }}>
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