import React, {useState} from "react";
import {Link} from "react-router-dom";
import { useSelector } from 'react-redux'
import background from "../images/stars-background.jpg";
import PlayerTaskList from "../components/PlayerTaskList";
import VoteScreen from "../components/VoteScreen";
import useSound from 'use-sound';
import meetingSound from '../sounds/meetingSFX.mp3'
import meetingBackground from "../images/stars-background.jpg";
import { useNavigate } from "react-router-dom";

function PlayerGame(){
    const [isEmergencyScreen, setEmergencyScreen] = useState(false);
    const [isMeetingRoom, setMeetingRoom] = useState(false);
    const [currentComplete, setComplete] = useState(0);
    const [toComplete, setToComplete] = useState(20);
    const [playSound] = useSound(meetingSound);
    const [gameEnd, setGameEnd] = useState();
    const navigate = useNavigate();

    const setImposterWin = () => {
        setGameEnd("imposterWin");
    }

    const setCrewmateWin = () => {
        setGameEnd("crewmateWin");
    }

    const returnHome = () => {
        navigate("/");
    }

    //function for toggling emergency screen to use (can also directly set emergency screen)
    const toggleEmergencyScreen = () => {
        setEmergencyScreen(!isEmergencyScreen);
        playSound();
    };
    //function for toggling emergency meeting room screen
    const toggleMeetingRoom = () => {
        setMeetingRoom(!isMeetingRoom);
    };
    //function to toggle both emergency meeting room and emergency screen
    function leaveMeetingRoom() {
        setMeetingRoom(!isMeetingRoom);
        setEmergencyScreen(!isEmergencyScreen);
    };

    //function to add 1 to currentComplete (tracks number of completed tasks)
    function completeATask(){
        setComplete(currentComplete + 1);
    }
    //function to calculate total number of tasks (toComplete) based on number of crewmates and number of tasks per crewmate
    function setNumTasksToComplete(numCrewmates, numTasksPerCrewmate){
        setToComplete(numCrewmates * numTasksPerCrewmate);
    }

    return (
        <div className="center" style={{paddingTop: "20px", paddingBottom:"20px", backgroundImage: `url(${meetingBackground})`}}>
            {/* Progress bar shows how many tasks completed (currentComplete) out of total tasks (toComplete) */}
            <h4>Total Tasks Completed</h4>
            <progress value={currentComplete} max={toComplete}></progress>
            <button onClick={completeATask}>Complete a Task</button>
            {/* <button onClick={playSound}>Beep</button> */}
            {/* Player's task list */}
            <PlayerTaskList></PlayerTaskList>

            {/* emergency meeting called screen */}
            {isEmergencyScreen && (
                <div className="overlay">
                    <h1>EMERGENCY MEETING CALLED</h1>
                    <div className="center">
                        {/* emergency meeting room screen */}
                        {isMeetingRoom && (
                            <div className="overlay-meeting" style={{ backgroundImage: `url(${meetingBackground})` }}  >
                                <h1>Who is the imposter?</h1>
                                <VoteScreen></VoteScreen>
                                <div className="center">
                                    <button onClick={leaveMeetingRoom}>Leave Meeting Room</button>
                                </div>
                            </div>
                        )}
                        <button onClick={toggleMeetingRoom}>Enter Meeting Room</button>
                    </div>
                </div>
            )}
            {gameEnd==="imposterWin" && (
                <div className="imposter-win">
                    <h1>IMPOSTER VICTORY</h1>
                    <div className="center">
                        <button onClick={returnHome}>Return Home</button>
                    </div>                   
                </div>
            )}
            {gameEnd==="crewmateWin" && (
                <div className="crewmate-win">
                    <h1>CREWMATE VICTORY</h1>
                    <div className="center">
                        <button onClick={returnHome}>Return Home</button>
                    </div>
                </div>
            )}
            <button onClick={toggleEmergencyScreen}>Call Emergency Meeting</button>
            <button onClick={setImposterWin}>Set Imposter Victory</button>
            <button onClick={setCrewmateWin}>Set Crewmate Victory</button>
        </div>
    );
}
export default PlayerGame;