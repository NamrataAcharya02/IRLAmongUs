import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import background from "../images/stars-background.jpg";
import PlayerHowTo from "../components/PlayerHowTo.js";

function PlayerWaiting(){
    const location = useLocation();
    const [nickname, setNickname] = useState(location.state.name);
    const [roomCode, setRoomCode] = useState(location.state.code);

    // useEffect(() =>{
    //     join room here (nickname and roomCode are useable variables)
    // });

    return (
        <div className="center" style={{ backgroundImage: `url(${background})` }}>
            <Link to="/">
                <button className="back">Back</button>
            </Link>
            {/* "How to Play" pop-up overlay for Players */}
            <PlayerHowTo></PlayerHowTo>
            
            <h1>Hello {nickname}!</h1>
            <h2 className="whiteh2">Room Code: {roomCode}</h2>
            <div className="player-lobby">
                <h3>player lobby waiting screen here</h3>
            </div>
            <Link to="/game">
                <button>To Temporary Player Screen</button>
            </Link>
        </div>
    );
}
export default PlayerWaiting;