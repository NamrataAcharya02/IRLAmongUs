import GameController from "./GameController";
import Player from "../models/Player";
import Task from "../models/TaskList";
import Room from "../models/Room";
import shuffler from "../models/utils";

export default class PlayerGameController extends GameController {
    player; // Player object
    tasklist;
    callback;
    name;

    constructor(name, callback) {
        this.player = player;
        this.player = Player.createPlayer(name, );

        this.tasklist = [];
        this.callback = callback;
        
        
        super();
       
    }

    joinRoom(roomCode) {
        // set user room to roomCode
        // set room from the return of calling Room.joinRoom
        this.player.setRoomCode(roomCode);
    }

    setTasks() {
        // generate from room.tasklist.tasks a randomized list of 
        // N = room.numTasksToComplete tasks.

        // update player object with the generated list
        stringArray = this.room.getTaskList();
        shuffArray = shuffler(stringArray);
        for(let i = 0;i < shuffArray.length; i++)
        {
            taskDescription = shufArray[i];

            if(i < 4)
            {
                this.tasklist.push(new Task(taskDescription, false));
            }
            
            this.tasklist.push(new Task(taskDescription, false));
        }
        
        this.player.setTaskList(taskList);

    }

    leaveRoom() {
        // remove player id from room.playerids
        // delete player db instance

        id = player.getId();
        this.room.leaveRoom(id);
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
        if(!this.player.getImposterStatus()){
            this.player.setAliveStatus('dead');
        }

    }

    markTaskComplete(description) {
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