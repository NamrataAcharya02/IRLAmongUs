import React, {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import { useSelector } from 'react-redux'
import background from "../images/stars-background.jpg";
import VoteScreen from "../components/VoteScreen";
import useSound from 'use-sound';
import meetingSound from '../sounds/meetingSFX.mp3'
import meetingBackground from "../images/stars-background.jpg";
import { useNavigate } from "react-router-dom";
import PlayerGameController from "../controllers/PlayerGameController";
import { auth } from "../firebase.js";

function PlayerGame(){
    const [currentComplete, setComplete] = useState(0);
    const [toComplete, setToComplete] = useState(20);
    const [playSound] = useSound(meetingSound);
    const [gameState, setGameState] = useState();
    const [tasks, setTasks] = useState([]);

    const navigate = useNavigate();
    let playerId = auth.currentUser.uid; // dummy for testing
    const forceUpdate = React.useReducer(() => ({}))[1];
    let controller = useRef(new PlayerGameController(playerId, forceUpdate));

    const setImposterWin = () => {
        setGameState("imposterWin");
    }

    const setCrewmateWin = () => {
        setGameState("crewmateWin");
    }

    const setEmergencyScreen = () => {
        playSound();
        setGameState("emergency");
    }

    const setVotingScreen = () => {
        setGameState("voting")
    }

    const setInGame = () => {
        setGameState("");
    }

    const returnHome = () => {
        navigate("/");
    }

    //function to add 1 to currentComplete (tracks number of completed tasks)
    function completeATask(){
        setComplete(currentComplete + 1);
    }
    //function to calculate total number of tasks (toComplete) based on number of crewmates and number of tasks per crewmate
    function setNumTasksToComplete(numCrewmates, numTasksPerCrewmate){
        setToComplete(numCrewmates * numTasksPerCrewmate);
    }

    const markComplete = (name) => {
        controller.current.markTaskComplete(name);
        const updatedTasks = controller.current.getVisibleTasks();
        setTasks(updatedTasks);
    }

    function markSelfDead(){
        controller.current.markSelfDead();
    }

    useEffect(() => {
        (async function () {
            await controller.current.init();
    
            console.log(`controller.current.room.getRoomCode(): ${controller.current.room.getRoomCode()}`);
            console.log(`controller.current.room.getTaskList(): ${controller.current.getVisibleTasks()}`);
            
            setTasks(controller.current.getVisibleTasks());

            })();
      }, []);

    return (
        <div className="center" style={{paddingTop: "20px", paddingBottom:"20px", backgroundImage: `url(${meetingBackground})`}}>
            {/* Progress bar shows how many tasks completed (currentComplete) out of total tasks (toComplete) */}
            <h4>Total Tasks Completed</h4>
            <progress value={currentComplete} max={toComplete}></progress>
            <button onClick={completeATask}>Complete a Task</button>
            {/* <button onClick={playSound}>Beep</button> */}
            {/* Player's task list */}
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
            {gameState==="emergency" && (
                <div className="overlay">
                    <h1>EMERGENCY MEETING CALLED</h1>
                    <button onClick={setInGame}>Return to Normal</button>
                </div>
            )}
            {gameState==="voting" && (
                <div className="overlay-meeting" style={{ backgroundImage: `url(${meetingBackground})` }}  >
                    <h1>Voting in Session</h1>
                    <button onClick={setInGame}>Return to Normal</button>
                </div>
            )}
            {gameState==="imposterWin" && (
                <div className="imposter-win">
                    <h1>IMPOSTER VICTORY</h1>
                    <div className="center">
                        <button onClick={returnHome}>Return Home</button>
                    </div>                   
                </div>
            )}
            {gameState==="crewmateWin" && (
                <div className="crewmate-win">
                    <h1>CREWMATE VICTORY</h1>
                    <div className="center">
                        <button onClick={returnHome}>Return Home</button>
                    </div>
                </div>
            )}
            <button onClick={setEmergencyScreen}>Call Emergency Meeting</button>
            <button onClick={setVotingScreen}>Set Voting Screen</button>
            <button onClick={setImposterWin}>Set Imposter Victory</button>
            <button onClick={setCrewmateWin}>Set Crewmate Victory</button>
        </div>
    );
}
export default PlayerGame;