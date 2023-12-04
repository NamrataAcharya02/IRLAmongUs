import { db } from "../firebase";
import GameController from "./GameController";

export default class AdminGameController extends GameController {
    admin;  // actual Admin object
    players; // actual list of Player objects that are watched by admin
            // each player must have a listener added

    constructor() {
        super();
    }

    validateNumImposters(n) {
        // ensure: 0 < n < imposterThreshold*numberOfPlayers
        // upon fail, throw an error the front end can interpret
    }

    validateNumTasksToComplete(n) {
        // ensure: 0 < n < maximum Task in Tasklist
        // upon fail, throw an error the front end can interpret
    }

    #calculateMinMaxImposters() {
        // return (min, imposter Threshold * number Of Players)
    }
    
    #calculateMinMaxTasksToComplete() {
        // return (min, maxNumberTasksAvailable)
    }

    #determinePlayerRoles() {
        // Initially, all player roles *should* be "Crewmate"
        // using (validated) numImposters and number of players 
        // in room,
        // randomly assign imposter roles to numImposters players
        // return list of playerIds of assigned imposters
    }

    #assignPlayerRoles() {
        // update player object
    }

    setGameParameters(paramsDict) {
        // update room with (validated) parameters: 
        //  - numImposters
        //  - numTasksToComplete
        //  - Tasklist
        // any paramsDict key should map exactly to rooms db schema

    }

    startGame() {
        // update Room Status to "inGame"

        // NOTE: somewhere in the rendering of the React component,
        // there should be a function (perhaps an effect) that runs
        // every time a player object changes to determine if the 
        // whether the game has been won, that is, whether all the tasks
        // have been completed.
    }

    displayGameCode() {
        // get the roomCode from the room Object
    }

    getTotalNumberTasksCompleted() {
        // sum over each player object for the total number of
        // tasks completed
    }

    endGame() {
        // for every playerId in room.playerIds,
        // delete player object from database
        // delete room object from database
    }

    startVoting(){
        // TODO: this could be a moot function.
        // set room status to ActiveVoting (in front end, if getRoomStatus() is 
        // "ActiveVoting," display voting ui to players)

        // Create a Firestore doc called 'vote'
        const votingDocRef = db.collection('rooms').doc(this.roomID).collection('vote').doc('vote');

        // Set the 'playerswhovoted' field to an empty array
        votingDocRef.set({
            playerswhovoted: []
        });
    }

    getVotingProgress() {
        // return (number votes recieve, number active players in room)
    }

    endVoting() {
        // TODO: this could be a moot function.
        // set room status to "InactiveVoting" (in front end, if getRoomStatus() 
        // is "InactiveVoting," display ...?)
    }

    getVotingResults() {
        // get voting progress. 

        // count votes for each player

        // rank vites in decreasing order

        // if max votes is unique to one player, display that the name
        // of the unique player voted out

        // TODO: if max votes is not unique to one player...
    }

    finalizeVotingResults() {
        // getVotingResults
        // kickout the player(s) voted out
        // endMeeting()

        // if (game won) logic -> update room status to "Won"
    }

    kickOutPlayer(playerId) {
        // delete player from database
        // remove player from room.playerIds
    }

    endMeeting() {
        // update room status to "InGame"
    }
}