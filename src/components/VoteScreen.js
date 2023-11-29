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

    const [voted, toggleVoted] = useState(false);

    const submitVote = (playerId) => {
        toggleVoted(true);
        //PlayerController.castVote(playerId)
    }


    //displays voting screen
	return( 
        <div className="center">
            {/* lists live players */}
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
                    <h1>Currently Selected: {selectedPlayer ? selectedPlayer.name : "N/A"}</h1>
                    <button onClick={() => submitVote(selectedPlayer.playerId)}>Submit Vote</button>
                </div>
            )}
            {voted && (
                <div className="center">
                    <div>
                        <h1>You voted for</h1>
                        <h1>{selectedPlayer.name}</h1>
                    </div>              
                </div>                
            )}
        </div>
    );
} 

export default VoteScreen; 

