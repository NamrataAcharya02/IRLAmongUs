import GameController from "./GameController";
import Player from "../models/Player";
import Task from "../models/TaskList";
import Room from "../models/Room";
import shuffler from "../models/utils";

export default class PlayerGameController extends GameController {
    player; // Player object
    taskList;
    visibleTasks;
    callback;
    name;
    roomCode;

    constructor(name, callback) {
        this.roomCode = room.getRoomCode();
        this.player = Player.createPlayer(name, roomCode);

        this.roomCode = 0;
        this.taskList = [];
        this.visibleTasks = [];
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
                const task = new Task(taskDescription, true);
                this.taskList.push(task);
            }

            this.taskList.push(new Task(taskDescription, false));
        }
        
        this.player.setTaskList(this.taskList);

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
       this.player = Player.getPlayer(this.player.getId());
       this.taskList = player.getTaskList();
       this.player.setTaskComplete();


        let i = 0;
       for(i = 0; i < this.tasklist.length; i++)
       {
        if(description == this.taskList[i].name)
        {
            this.taskList[i].completed = true;
            this.taskList[i].visible = false;
            this.player.setTaskComplete(description);
        }
       }

    }

    castVote(playerId) {
        // If the room status is emergency meeting
        // add a vote to the emergency room's votes list
        // after casting a vote, ...?
    }

    getVisibleTasks() {
        // Display up to four tasks that have not been completed.
        this.player = Player.getPlayer(this.player.getId());
        this.taskList = this.player.getTaskList();
        this.visibleTasks = [];
        if(this.taskList.length < 5){
            return this.taskList;
        }
        else{
            this.visibleTasks = [
                this.taskList[0],
                this.taskList[1],
                this.taskList[2],
                this.taskList[3]
            ];
        }
       
        return this.visibleTasks;
    }

    getTasklistStatus() {
        // return (number of tasks complete, number of tasks requred)
    }
}