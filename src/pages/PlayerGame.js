import React, {useState} from "react";
import {Link} from "react-router-dom";
import { useSelector } from 'react-redux'
import background from "../images/stars-background.jpg";
import FrontendTaskList from "../components/TaskListComponent";


function PlayerGame(){
    const [isEmergencyScreen, setEmergencyScreen] = useState(false);
    const [isMeetingRoom, setMeetingRoom] = useState(false);

    //function for toggling emergency screen to use (can also directly set emergency screen)
    const toggleEmergencyScreen = () => {
        setEmergencyScreen(!isEmergencyScreen);
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

    return (
        <div className="center">
            <FrontendTaskList></FrontendTaskList>
            {/* emergency meeting called screen */}
            {isEmergencyScreen && (
                <div className="overlay">
                    <h1>EMERGENCY MEETING CALLED</h1>
                    <div className="center">
                        {/* emergency meeting room screen */}
                        {isMeetingRoom && (
                            <div className="overlay-meeting">
                                <h1>EMERGENCY MEETING ROOM</h1>
                                <div className="center">
                                    <button onClick={leaveMeetingRoom}>Leave Meeting Room</button>
                                </div>
                            </div>
                        )}
                        <button onClick={toggleMeetingRoom}>Enter Meeting Room</button>
                    </div>
                </div>
            )}
            <button onClick={toggleEmergencyScreen}>Toggle Emergency Screen</button>
        </div>
    );
}
export default PlayerGame;