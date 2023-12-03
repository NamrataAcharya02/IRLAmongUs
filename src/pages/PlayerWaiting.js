import React, {useState} from "react";
import {Link} from "react-router-dom";
import background from "../images/stars-background.jpg";

function PlayerWaiting(){
    const nickname = "pull me from the db"
    const [isHelpScreen, setHelpScreen] = useState(false);
    
    //function for toggling emergency screen to use (can also directly set emergency screen)
    const toggleHelpScreen = () => {
        setHelpScreen(!isHelpScreen);
    };
    
    return (
        <div className="center" style={{ backgroundImage: `url(${background})` }}>
            <Link to="/">
                <button className="back">Back</button>
            </Link>
            {/* "How to Play" pop-up overlay for Players */}
            {isHelpScreen && (
                <div className="overlay-help">
                    <h1>HOW TO PLAY</h1>
                    <div className="center">
                        <div className="help-in-box">
                            {/* Close "How to Play" pop-up */}
                            <button className="back" onClick={toggleHelpScreen}>Close</button>
                            {/* Crewmate How to Play */}
                            <h2 className="waitingRoomh2">Crewmate</h2>
                            <ol className="helpList">
                                <li>
                                    To win: Complete all tasks before Imposters kill all 
                                    Crewmates to win or vote out all Imposters!
                                </li>
                                <li>
                                    Report “dead” bodies, which calls an emergency meeting. 
                                    You also have the option to not report a dead body if you see one.
                                </li>
                                <li>
                                    Crewmates can ask the Admin to call an emergency meeting.
                                </li>
                                <li>
                                    In the emergency meeting, vote who you think is the Imposter. 
                                    You can elect to “Skip” vote. If “Skip” vote has the most votes, 
                                    no one will be voted out.
                                </li>
                                <li>
                                    If you are voted out in an emergency meeting, you are dead.
                                </li>
                                <li>
                                    If you are dead, you can not communicate. You should still attend emergency meetings.
                                </li>
                                <li>
                                    Dead Crewmates should mark themselves as dead by clicking “Mark Self Dead”.
                                </li>
                            </ol>
                        </div>
                        {/* Imposter How to Play */}
                        <div className="help-in-box">
                            <h2 className="waitingRoomh2">Imposter</h2>
                            <ol className="helpList">
                                <li>
                                    To win: Kill crewmates (method to “kill” a player decided before the game starts 
                                    or vote them out in emergency meetings) until the number of Imposters alive is 
                                    the same as the number of Crewmates alive!
                                </li>
                                <li>
                                    Your tasks are fake. Blend in with the Crewmates by pretending to do tasks.
                                </li>
                                <li>
                                    You can either report a dead body or run away to escape suspicion.
                                </li>
                                <li>
                                    Imposters can ask the Admin to call an emergency meeting 
                                    (This is one way to bluff innocence).
                                </li>
                                <li>
                                    In emergency meetings, avoid suspicion by bluffing or 
                                    throwing suspicion on other Crewmates.
                                </li>
                                <li>
                                    If you are voted out in an emergency meeting, you are dead.
                                </li>
                                <li>
                                    Don’t get caught!
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            )}
            <button className="helpButton" onClick={toggleHelpScreen}>How to Play</button>
            
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