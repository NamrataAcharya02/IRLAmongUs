import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import background from "../images/stars-background.jpg";
import PlayerHowTo from "../components/PlayerHowTo.js";
import { useNavigate } from "react-router-dom";

import { auth } from "../firebase.js";
import PlayerGameController from "../controllers/PlayerGameController";

function PlayerWaiting() {
    const location = useLocation();
    const [nickname, setNickname] = useState(location.state.name);
    const [roomCode, setRoomCode] = useState(location.state.code);
    const navigate = useNavigate();
    const [room, setRoom] = useState();

    const forceUpdate = React.useReducer(() => ({}))[1];
    let playerId = auth.currentUser.uid; // dummy for testing
    let controller = useRef(new PlayerGameController(playerId, forceUpdate));

    /**
     * @function useEffect
     * called at start to populate waiting screen
     * also refreshes page to redirect when game has started
     */
    useEffect(() => {
        (async function () {
            await controller.current.init();
            // await (await controller.current.init()).joinRoom(roomCode, nickname);
            await controller.current.joinRoom(roomCode, nickname);

            console.log(`controller.current.room.getRoomCode(): ${controller.current.room.getRoomCode()}`);
            console.log(`controller.current.room.getTaskList(): ${controller.current.getVisibleTasks()}`);
            setRoom(controller.current.room);
            const interval = setInterval(() => {
                if (controller.current.getRoomStatus() === "inProgress") {
                    navigate("/game");
                }
                // console.log("dong");
            }, 5000);
        })();
    }, []); // 
    // useEffect(() =>{
    //     join room here (nickname and roomCode are useable variables)
    // });

    return (
        <div className="background-div">
            <PlayerHowTo></PlayerHowTo>
            <div className="center" >
                <Link to="/">
                    <button className="back">Back</button>
                </Link>
                {/* "How to Play" pop-up overlay for Players */}
                

                <h1>Hello {nickname}!</h1>
                {room && (
                    <h2 className="whiteh2">Room Code: {controller.current.room.getRoomCode()}</h2>
                )}
                <div></div>
                {/* <Link to="/game">
                    <button>To Temporary Player Screen</button>
                </Link> */}
            </div>
        </div>
    );
}
export default PlayerWaiting;