import GameController from "./GameController";

export default class PlayerGameController extends GameController {
    player; // Player object

    constructor() {
        super();
    }

    joinRoom(roomCode) {
        // set user room to roomCode
        // set room from the return of calling Room.joinRoom
    }

    setTasks() {
        // generate from room.tasklist.tasks a randomized list of 
        // N = room.numTasksToComplete tasks.

        // update player object with the generated list
    }

    leaveRoom() {
        // remove player id from room.playerids
        // delete player db instance
    }

    callMeeting() {
        // TODO: SOrt this out
        // update room status
        // create emergency room db instance with same roomCode as room
        // OR create room.createEmergencyField() that creates
        // a db instance to keep track of voting
        // OR create a subcollection of room for meetings, to keep track of all 
        // meeting results.
    }

    markSelfDead() {
        // if player is crewmate,
        // then update player status
    }

    markTaskComplete(taskId) {
        // update player tasklists task to completed
    }

    castVote(playerId) {
        // If the room status is emergency meeting
        // add a vote to the emergency room's votes list
        // after casting a vote, ...?
    }

    getVisibleTasks() {
        // Display up to four tasks that have not been completed.
    }

    getTasklistStatus() {
        // return (number of tasks complete, number of tasks requred)
    }
}