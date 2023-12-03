import React, {useState} from "react";
import GameController from "../controllers/GameController";
import PlayerGameController from "../controllers/PlayerGameController";

function VoteScreen() { 
    //alive player list, to be set by getActivePlayers() in GameController
	const players = [
        {playerId:"someId1", name:"Karen"},
        {playerId:"someId2", name:" May I speak to your manager?"},
        {playerId:"someId3", name:"Where is your manager?"},
        {playerId:"someId4", name:"I’ll sue you!"},
        {playerId:"someId5", name:"That’s unacceptable!"},
    ];

    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [skipVote, setSkipVote] = useState(false);

    const [voted, toggleVoted] = useState(false);

    const submitVote = (playerId) => {
        toggleVoted(true);
        //PlayerController.castVote(playerId)
    }

    const submitSkip = () => {
        setSkipVote(true);
        toggleVoted(true);
    }

    const chooseSkip = () => {
        setSelectedPlayer(null);
    }


    //displays voting screen
	return( 
        <div className="center">
            {/* lists live players */}
            <div className="voteScreenBox">
                {!voted && (
                    <div className="center">                   
                        <ul className="centered-lists">
                            {players.map((player) => (
                                <div>
                                    <button onClick={() => setSelectedPlayer(player)}>
                                        {player.name}
                                    </button>
                                </div>
                            ))}
                        </ul>
                        <button onClick={() => chooseSkip()}>Skip Vote</button>
                        {selectedPlayer && (
                            <h2 className="whiteh2">Vote for: {selectedPlayer ? selectedPlayer.name : "N/A"}</h2>
                        )}
                        {selectedPlayer && (<button onClick={() => submitVote(selectedPlayer.playerId)}>Submit Vote</button>)}
                        {!selectedPlayer && (
                            <h2 className="whiteh2">Skip Vote?</h2>
                        )}
                        {!selectedPlayer && (<button onClick={() => submitSkip()}>Submit Vote</button>)}
                    </div>
                )}
                {voted && (
                    <div className="center">
                        {skipVote && (
                            <div>
                                <h1>You chose to skip your vote</h1>
                            </div> 
                        )}
                        {!skipVote && (
                            <div>
                                <h1>You voted for</h1>
                                <h1>{selectedPlayer.name}</h1>
                            </div> 
                        )}
                        <br></br>      
                        <br></br>                              
                    </div>                
                )}
            </div>
        </div>
    );
} 

export default VoteScreen; 

