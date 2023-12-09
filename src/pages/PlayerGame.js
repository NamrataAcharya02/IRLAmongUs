import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux'
import background from "../images/stars-background.jpg";
import VoteScreen from "../components/VoteScreen";
import useSound from 'use-sound';
import meetingSound from '../sounds/meetingSFX.mp3'
import meetingBackground from "../images/stars-background.jpg";
import { useNavigate } from "react-router-dom";
import PlayerGameController from "../controllers/PlayerGameController";
import { auth } from "../firebase.js";
import { current } from "@reduxjs/toolkit";
import { RoomStatus } from "../models/enum.js";
import { redirect } from "react-router-dom";
import PlayerHowTo from "../components/PlayerHowTo.js";

function PlayerGame() {
    const [currentComplete, setComplete] = useState(0);
    const [toComplete, setToComplete] = useState(20);
    const [playSound] = useSound(meetingSound);
    const [gameState, setGameState] = useState();
    const [tasks, setTasks] = useState([]);
    const [room, setRoom] = useState();
    const [showingRole, setShowingRole] = useState(false);
    const [roomCode, setRoomCode] = useState("");

    const navigate = useNavigate();
    let playerId = auth.currentUser.uid; // dummy for testing
    const forceUpdate = React.useReducer(() => ({}))[1];
    let controller = useRef(new PlayerGameController(playerId, forceUpdate));

    /**
     * @function sets the screen to imposter win
     */
    const setImposterWin = () => {
        setGameState("impostersWin");
    }

    /**
     * @function sets the screen to crewmate win
     */
    const setCrewmateWin = () => {
        setGameState("crewmatesWin");
    }

    /**
     * @function sets the emergency screen and updates the database to reflect the call, plays a sound
     */
    const setEmergencyScreen = () => {
        playSound();
        controller.current.room.updateStatus(RoomStatus.emergencyMeeting);
        setGameState("emergency");
    }

    /**
     * sets the voting screen
     */
    const setVotingScreen = () => {
        setGameState("voting")
    }

    const setInGame = () => {
        setGameState("");
    }

    /**
     * @function makes player leave room, navigates to home screen
     */
    const returnHome = () => {
        // controller.current.player.deletePlayer();
        try{
            controller.current.leaveRoom();
            navigate("/");
        }
        catch{
            navigate("/");
        }
        
        
        
    }


    //function to add 1 to currentComplete (tracks number of completed tasks)
    // function completeATask(){
    //     setComplete(currentComplete + 1);
    // }
    //function to calculate total number of tasks (toComplete) based on number of crewmates and number of tasks per crewmate
    /**
     * @function calculates and sets the number of tasksfor all crewmates to complete to complete
     * @param {Number} numCrewmates 
     * @param {Number} numTasksPerCrewmate 
     */
    function setNumTasksToComplete(numCrewmates, numTasksPerCrewmate) {
        setToComplete(numCrewmates * numTasksPerCrewmate);
    }

    /**
     * @function marks task as complete, updates database to reflect change
     * @param {String} name 
     */
    const markComplete = (name) => {
        controller.current.markTaskComplete(name);
        const updatedTasks = controller.current.getVisibleTasks();
        setTasks(updatedTasks);
    }

    /**
     * @function marks self as dead, updates database to reflect
     */
    function markSelfDead() {
        controller.current.markSelfDead();
    }

    /**
     * called on start to fill in information that is needed
     */
    useEffect(() => {
        (async function () {
            await controller.current.init();

            // try{
            //     controller.current.room.getRoomStatus();
            //     console.log("Tried to get room code");
            // }catch{
            //     navigate("/");
            // }
            // console.log(`controller.current.room.getRoomCode(): ${controller.current.room.getRoomCode()}`);
            // console.log(`controller.current.room.getTaskList(): ${controller.current.getVisibleTasks()}`);

            setRoom(controller.current.room);
            // setRoomCode(controller.current.room.getRoomCode());

            console.log("Room is currently:", room);
            setTasks(controller.current.getVisibleTasks());
            // setNumTasksToComplete((controller.current.room.getNumPlayers()-controller.current.room.getNumImposters()), controller.current.room.getNumTasksToDo());
            // console.log('threshold tasks: ', (controller.current.room.getNumPlayers()-controller.current.room.getNumImposters()) * controller.current.room.getNumTasksToDo());
            // setComplete(controller.current.getRoomNumTasksCompleted());
            // console.log("complete", controller.current.getRoomNumTasksCompleted());

        })();
        const interval = setInterval(() => {
            forceUpdate();
            // console.log("ding");
        }, 5000);
    }, []);




    return (
        <div className="background-div">
            <PlayerHowTo></PlayerHowTo>
            <div className="center" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
              <button className="back" onClick={() => returnHome()} style={{width: "100px"}}>Leave Game</button>
                {/* Progress bar shows how many tasks completed (currentComplete) out of total tasks (toComplete) */}
                {room && (
                    <div className="center">
                        {!showingRole && (
                            <button onClick={() => setShowingRole(true)}>Show Role</button>
                        )}
                        {showingRole && (
                            <div className="center">
                                <h1>Role: {controller.current.player.getImposterStatus() ? "Imposter" : "Crewmate"}</h1>
                                <button onClick={() => setShowingRole(false)}>Hide Role</button>
                            </div>
                        )}

                        <h4>Total Tasks Completed {controller.current.room.getNumTasksComplete()}</h4>
                        <progress value={controller.current.room.getNumTasksComplete()} max={toComplete}></progress>
                        <br></br>
                        <ul className="centered-lists">
                            {tasks.map((task) => (
                                <div className="task">
                                    <h3>
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            onClick={() => markComplete(task)}
                                            checked={false}
                                        />
                                        {task}
                                    </h3>
                                </div>
                            ))}
                        </ul>
                        <button onClick={markSelfDead}>Mark Self Dead</button>

                        {/* emergency meeting called screen */}
                        {controller.current.getRoomStatus() === "emergencyMeeting" && (
                            <div className="overlay">
                                <h1>EMERGENCY MEETING CALLED</h1>
                            </div>
                        )}
                        {controller.current.getRoomStatus() === "voting" && (
                            <div className="overlay-meeting" style={{ backgroundImage: `url(${meetingBackground})` }}  >
                                <h1>Voting in Session</h1>
                            </div>
                        )}
                        {controller.current.getRoomStatus() === "impostersWin" && (
                            <div className="imposter-win">
                                <h1>IMPOSTER VICTORY</h1>
                                <div className="center">
                                    <button onClick={returnHome}>Return Home</button>
                                </div>
                            </div>
                        )}
                        {controller.current.getRoomStatus() === "crewmatesWin" && (
                            <div className="crewmate-win">
                                <h1>CREWMATE VICTORY</h1>
                                <div className="center">
                                    <button onClick={returnHome}>Return Home</button>
                                </div>
                            </div>
                        )}
                        <button onClick={setEmergencyScreen}>Report Dead Body</button>
                        {/* <button onClick={setVotingScreen}>Set Voting Screen</button>
                        <button onClick={setImposterWin}>Set Imposter Victory</button>
                        <button onClick={setCrewmateWin}>Set Crewmate Victory</button> */}
                    </div>
                )}
            </div>
        </div>
    );
}
export default PlayerGame;