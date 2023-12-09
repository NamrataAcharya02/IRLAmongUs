import React, {useState} from "react";

/**
 * This React component renders the Player How To Play section of the IRL Among Us app.
 * 
 * @function PlayerHowTo
 * @returns The Player How To Play section.
 */
function PlayerHowTo() {
    // State variable for managing the visibility of the help screen
    const [isHelpScreen, setHelpScreen] = useState(false); //how to play overlay

    /**
     * Toggles emergency screen to use (can also directly set emergency screen).
     * 
     * @function toggleHelpScreen
     * @returns {void}
     */
    const toggleHelpScreen = () => {
    setHelpScreen(!isHelpScreen);
    };

    // Render the component.
    return (
        <div>
            {isHelpScreen && (
                <div className="overlay-help">
                    <h1>HOW TO PLAY</h1>
                    <div className="center">
                        <div className="help-in-box">
                            {/* Close "How to Play" pop-up */}
                            <button className="back" onClick={toggleHelpScreen}>Close</button>
                            {/* Crewmate How to Play */}
                            <h2 className="whiteh2">Crewmate</h2>
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
                            <h2 className="whiteh2">Imposter</h2>
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
        </div>
    );
}

// Export the component as the default export.
export default PlayerHowTo