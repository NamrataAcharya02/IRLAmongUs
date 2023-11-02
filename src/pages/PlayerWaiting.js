import React, {useState} from "react";
import {Link} from "react-router-dom";
import { useSelector } from 'react-redux'
function PlayerWaiting(){
    const nickname = useSelector(state => state.counter.value)
    return (
        <div className="center">
        <Link to="/">
                <button className="back">Back</button>
            </Link>
        <h1>Hello {nickname}!</h1>
        <h2 className="waitingRoomh2">Room Code: pretend there's a code here</h2>
        <div className="player-lobby">
            <h3>player lobby waiting screen here</h3>
        </div>
        </div>
    );
}
export default PlayerWaiting;