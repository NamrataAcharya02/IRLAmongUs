import React, {useState} from "react";
import {Link} from "react-router-dom";
import { useSelector } from 'react-redux'
import background from "../images/stars-background.jpg";
import FrontendTaskList from "../components/TaskListComponent";


function PlayerGame(){
    const [isEmergencyScreen, setEmergencyScreen] = useState(false);

    //function for toggling emergency screen to use (can also directly set emergency screen)
    const toggleEmergencyScreen = () => {
        setEmergencyScreen(!isEmergencyScreen);
    };
    return (
        <div>
            <FrontendTaskList></FrontendTaskList>
            {isEmergencyScreen && (
                <div className="overlay">
                    <h1>EMERGENCY MEETING CALLED</h1>
                    <button onClick={toggleEmergencyScreen}>Toggle Emergency Screen</button>
                </div>
            )}
            <button onClick={toggleEmergencyScreen}>Toggle Emergency Screen</button>
        </div>
    );
}
export default PlayerGame;