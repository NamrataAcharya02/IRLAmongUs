// import {GameController} from "./GameController";
import {Player} from "../models/Player";
import {Task} from "../models/TaskList";
import {Room} from "../models/Room";
// import {shuffler} from "../models/utils";
import { RoomNotExistError } from "../errors/roomError";

// export default class PlayerGameController extends GameController {
export default class PlayerGameController {
    room;
    player; // Player object
    taskList;
    visibleTasks;
    listener;
    playerId;
    roomCode;

    constructor(playerId, listener) {
        try {
            this.player = Player.getPlayer(playerId);
            console.log(`PlayerGameController:constructor this.player.getId(): ${this.player.getId()}`);
        } catch {
            // there is no player object with that id
            console.log(`no player found with id ${playerId}`);
        }
        

        this.playerId = playerId;
        this.listener = listener;  
        this.taskList = [];
        this.visibleTasks = [];
    }

    joinRoom(roomCode, name) {
        // try to get a player object, if one exists.
        try {
            this.room = Room.getRoom(roomCode);
            //TODO: add callback to room
            // this.room.

            this.player.setRoomCode(roomCode);

        } catch (err) {
            if (err instanceof RoomNotExistError) {
                console.log(`joinRoom room ${roomCode} does not exists`);
                return false;
            } else {  // if no player object exists, create one.
                const tasks = this.room.getTaskList();
                //TODO: shuffle tasks

                this.player = new Player(this.playerId, name, "alive", 0, "", roomCode, tasks, false, "", 0);
                
                this.room.addPlayer(this.playerId);
                this.player.setRoomCode(roomCode);

            }
        }

        // set user room to roomCode
        // set room from the return of calling Room.joinRoom
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

        const id = this.player.getId();
        this.room.leaveRoom(id);
    }

    callMeeting() {
        // TODO: SOrt this out
        // Jacob, just use this.player.setCallMeetingStatus();
        // Also, what does setCallMeetingStatus actually do?
        this.player = Player.getPlayer(this.player.getId());
        this.player.setCallMeetingStatus(true);

        
        // create a subcollection of room for meetings, to keep track of all 
        // meeting results.
        // update room status
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
       this.taskList = this.player.getTaskList();
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