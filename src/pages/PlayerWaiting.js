import React, {useState} from "react";
import {Link} from "react-router-dom";
import background from "../images/stars-background.jpg";

function PlayerWaiting(){
    const nickname = "pull me from the db"
    return (
        <div className="center" style={{ backgroundImage: `url(${background})` }}>
        <Link to="/">
                <button className="back">Back</button>
            </Link>
        <h1>Hello {nickname}!</h1>
        <h2 className="waitingRoomh2">Room Code: pretend there's a code here</h2>
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