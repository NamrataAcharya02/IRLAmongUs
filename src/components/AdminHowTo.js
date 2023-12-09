import React, {useState} from "react";
import Collapsible from "react-collapsible";

/**
 * This React component renders the Admin How To Play section of the IRL Among Us app.
 * 
 * @function AdminHowTo
 * @returns The Admin How To Play section.
 */
function AdminHowTo() {
    // State variable for managing the visibility of the help screen
    const [isHelpScreen, setHelpScreen] = useState(false); //how to play overlay

    /**
     * Toggles emergency screen to use (can also directly set emergency screen)
     * 
     * @function toggleHelpScreen
     * @returns {void}
     */ 
    const toggleHelpScreen = () => {
    setHelpScreen(!isHelpScreen);
    };

    // Render the component.
    return( 
        <div>
            {isHelpScreen && (
                <div className="overlay-help">
                    <h1>HOW TO PLAY</h1>
                    <div className="center">
                        <div className="help-in-box">
                            {/* Close "How to Play" pop-up */}
                            <button className="back" onClick={toggleHelpScreen}>Close</button>
                            {/* Crewmate How to Play */}
                            <h2 className="whiteh2">Admin</h2>
                            <ol className="helpList">
                                <li>
                                    Create tasks!
                                </li>
                                <li>
                                    Setting up Gameplay!
                                </li>
                                <li>
                                    Facilitate Gameplay!
                                </li>
                            </ol>
                            {/* Collapsible Sections for How to Play */}
                            {/* Gameplay Loop Section */}
                            <Collapsible trigger="How the game works">
                              <ol className="helpList">
                                <li>
                                  To start your own game of IRL Among Us, start by creating a task list. 
                                  Refer to the "Tasks" section on how to create tasks.
                                </li>
                                <li>
                                  Refer to the "Setting Up Gameplay" section for gameplay settings and preparing
                                  players for how to play the game.
                                </li>
                                <li>
                                  Then, click “Start a Room”.
                                </li>
                                <li>
                                  You will be met with a page that displays a room code. 
                                  Players can join your room by entering the Room Code in “Join a Room”.
                                </li>
                                <li>
                                  Once all players have joined, start the game.
                                </li>
                                <li>
                                  During the game, players may ask the Admin (you) to start an emergency meeting. 
                                  You can call an emergency meeting by clicking the “Emergency Meeting” button.
                                </li>
                                <li>
                                  Players discuss their findings and who they believe is the Imposter in emergency meetings. 
                                  The meeting ends after all players cast their votes on who they think is the Imposter.
                                </li>
                                <li>
                                  Killed players should attend emergency meetings but they cannot communicate.
                                </li>
                                <li>
                                  You may end the game at any time for any reason by clicking the “End Game” button.
                                </li>
                                <li>
                                  The game ends when one of these win conditions are satisfied:
                                  <ul>
                                    <li>The task target completion goal has been met (Crewmate win).</li>
                                    <li>All Imposters have been voted out (Crewmate win).</li>
                                    <li>The number of Imposters alive is the same as the number of Crewmates alive (Imposter win).</li>
                                  </ul>
                                </li>
                              </ol>
                            </Collapsible>
                            {/* Tasks Section */}
                            <Collapsible trigger="Creating Tasks">
                              <ol className="helpList">
                                <li>
                                  You will be making a list of tasks for your players to complete! 
                                  The tasks will be done in real life by your players.
                                </li>
                                <li>
                                  When you start a game, (not to be confused with start a room,) 
                                  the tasks you create will be randomized and given out to your players.
                                </li>
                                <li>
                                  Setting up Tasks: Create 4 difficult tasks and 10 easy tasks.
                                </li>
                                <li>
                                  Task examples:
                                  <ul>
                                    <li>The task target completion goal has been met (Crewmate win).</li>
                                    <li>All Imposters have been voted out (Crewmate win).</li>
                                    <li>The number of Imposters alive is the same as the number of Crewmates alive (Imposter win).</li>
                                  </ul>
                                </li>
                              </ol>
                            </Collapsible>
                            {/* Setting Up Gameplay Section */}
                            <Collapsible trigger="Setting Up Gameplay">
                              <ol className="helpList">
                                <li>
                                  Depending on the number of players, the number of Imposters should be adjusted. 
                                  A good guideline is for every 4 players, add one Imposter. 
                                  For example: if you have 10 players, have 2 Imposters. 
                                  If you have 5 players, have 1 Imposter.
                                </li>
                                <li>
                                  Teach your players how imposters will “kill” crewmates. 
                                  Some examples include a double tap on a shoulder, a tap with a pencil, or a wink.
                                </li>
                                <li>
                                  Teach your players how to act “dead”. Some examples include sitting down on the spot, 
                                  cracking open a glow stick, or raising a hand. 
                                  Don’t forget to remind them that they should mark themselves as “dead”!
                                </li>
                                <li>
                                  At the beginning of a game, it is recommended for all players to close their eyes, 
                                  and then have all the Imposters open their eyes to see who the other Imposters are.
                                </li>
                              </ol>
                            </Collapsible>
                        </div>
                    </div>
                </div>
            )}
            <button className="helpButton" onClick={toggleHelpScreen}>How to Play</button>
        </div>
    );
}

// Export the component as the default export.
export default AdminHowTo;