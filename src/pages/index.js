// This is the homepage/landing page

import React, {useState, useId} from "react";
import Popup from 'reactjs-popup';
import PlayerWaiting from "./PlayerWaiting";
import { useSelector, useDispatch } from 'react-redux'
import { setValue } from '../features/counter/counterSlice.js'

import {Link} from "react-router-dom";
import "./homepage.css";


// const Pages = () => {
//     const [isTextFieldVisible, setTextFieldVisible] = useState(false);

//     const toggleTextField = () => {
//         setTextFieldVisible(!isTextFieldVisible);
//     };

//     const id = useId();
//     const [roomCode, setRoomCode] = useState('');
//     const [nickname, setNickname] = useState('');

//     return (
//         <div className="center">
//             <h1>IRL AMONG US</h1>
//             {/* <Button as={Link} to="/adminpage">Go to Admin</Button> */}
//             <Link to="/adminpage">
//                 <button>Create a Room</button>
//             </Link>
//             <br></br>
//             <button onClick={toggleTextField}>Join a Room</button>
//             <div className="inputdiv">
//                 {isTextFieldVisible && (
//                     <input
//                     type = "number"
//                     placeholder="Room Code"
//                     id={id}
//                     onInput={e => setRoomCode(e.target.value)}
//                     maxLength={6}
//                     value={roomCode}
//                     // Additional input field attributes and event handlers
//                     />
//                 )}
//                 {isTextFieldVisible &&(
//                     <Popup trigger=
//                     {<button className="enter"> Enter </button>} 
//                     modal nested>
//                     {
//                         close => (
//                             <div className='modal'>
//                                 <h2>
//                                     Room Code: {roomCode}
//                                 </h2>
//                                 <input
//                                     placeholder="Nickname"
//                                     className="nickname"
//                                     value={nickname}
//                                     onInput={e => setNickname(e.target.value)}
//                                     // Additional input field attributes and event handlers
//                                 />
//                                 <div>
//                                     <button className="enter2" onClick=
//                                         {() => close()}>
//                                             Cancel
//                                     </button>
//                                     <Link to="/lobby">
//                                         <button className="enter2">Enter</button>
//                                     </Link>
//                                 </div>
//                             </div>
//                         )
//                     }
//                     </Popup>
//                 )}
//             </div>         
//         </div>
//     );
// };
// export default Pages;

function Pages(){
    const [isTextFieldVisible, setTextFieldVisible] = useState(false);

    const toggleTextField = () => {
        setTextFieldVisible(!isTextFieldVisible);
    };

    const id = useId();
    const [roomCode, setRoomCode] = useState('');
    const [nickname, setNickname] = useState('');


    const count = useSelector(state => state.counter.value)
    const dispatch = useDispatch()

    return (
        <div className="center">
            <h1>IRL AMONG US</h1>
            {/* <Button as={Link} to="/adminpage">Go to Admin</Button> */}
            <Link to="/adminpage">
                <button>Create a Room</button>
            </Link>
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