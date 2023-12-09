// import {GameController} from "./GameController";
import {Player} from "../models/Player";
import {Room} from "../models/Room";
import {shuffler} from "../models/utils";
import { RoomNotExistError } from "../errors/roomError";
import { RoomStatus } from "../models/enum";

// export default class PlayerGameController extends GameController {
export default class PlayerGameController {
    room;
    player; // Player object
    taskList;
    visibleTasks;
    listener;
    playerId;
    roomCode;

    /**
     * Creates a new instance of PlayerGameController.
     * @class
     * @constructor
     * @param {string} playerId - The ID of the player.
     * @param {Function} listener - The listener function for the player.
     */
    constructor(playerId, listener) {
        this.room = null;
        this.player = null;
        this.playerId = playerId;
        this.name = "";
        this.roomCode = null;
        this.listener = listener;  
        this.taskList = [];
        this.visibleTasks = [];
    }

    /**
     * Initializes the PlayerGameController.
     * @function init
     * @returns {Promise<PlayerGameController>} A promise that resolves to an instance of PlayerGameController.
     */
    async init() {
        let player = await Player.getPlayer(this.playerId);
        if (!player) {
            console.log(`no player found with id ${this.playerId}...creating`);
            // new players during PlayerGameController startup have not actually "joined" a room
            // therefore, name or room code information has not been submitted.
            player = await Player.createPlayer("", this.playerId, "");
        }
        this.player = player;

        try {
            console.log(`this.player.getRoomCode(): ${this.player.getRoomCode()}`);   
            this.room = await Room.getRoom(this.player.getRoomCode()); // will either have 4-char string or ""
            console.log("retrieved player room", this.room);
        } catch (err) {
            if (err instanceof RoomNotExistError) {
                console.log(`PlayerGameController.init() room ${this.player.getRoomCode()} not exist`);
                this.room = null;
            } else {
                console.log(`some other err: ${err}`);
            }
        }


        player.addCallback(this.listener);

        return this;
    }

    /**
     * Joins the room with the provided room code and player name.
     * @function joinRoom
     * @param {string} roomCode - The code of the room to join.
     * @param {string} name - The name of the player.
     */
    async joinRoom(roomCode, name) {
        if (!this.room) {
            try {
                this.room = await Room.getRoom(roomCode);
                await this.player.setRoomCode(roomCode);

                this.room.addPlayer(this.player.getId());

                this.setTasks();

                // TODO: 
                this.room.addCallback(this.listener);
            } catch (err) {
                if (err instanceof RoomNotExistError) {
                    console.log(`joinRoom room ${roomCode} does not exists`);
                }
                throw err;
            }
        } else {
            // a room object already exists, so join whatever room is in that
        }
        
        await this.player.setName(name);

        // this.room.addPlayer(this.player.getId());
        
        // get tasklist from room
        // this.setTasks();

        // // TODO: 
        // this.room.addCallback(this.listener);

    }

    /**
     * Sets the tasks for the player.
     * @function setTasks
     */
    async setTasks() {
        // generate from room.tasklist.tasks a randomized list of 
        // N = room.numTasksToComplete tasks.

        // update player object with the generated list
        const stringArray = this.room.getTaskList();
        this.taskList = stringArray.sort(() => 0.5 - Math.random());
        console.log("Shuffled tasks", this.taskList);

        this.player.setTaskList(this.taskList);

    }

    /**
     * Makes the player leave the current room.
     * @function leaveRoom
     */
    async leaveRoom() {
        // remove player id from room.playerids
        // delete player db instance

        //code, playerId
        // this.room.leaveRoom(this.roomCode, this.playerId);
        this.player.deletePlayer();
    }

    /**
     * Calls a meeting in the game.
     * @function callMeeting
     */
    async callMeeting() {
        // TODO: SOrt this out
        // Jacob, just use this.player.setCallMeetingStatus();
        // Also, what does setCallMeetingStatus actually do?
        // this.player.setCallMeetingStatus(true);
        this.room.updateStatus(RoomStatus.emergencyMeeting);
        

        // Jacob, I should add a function to room: createEmergencySubcollection

        // update room status
    }

    /**
     * Marks the player as dead in the game.
     * @function markSelfDead
     */
    async markSelfDead() {
        // if player is crewmate,
        // then update player status
        if(!this.player.getImposterStatus()){
            this.player.setAliveStatus('dead');
        }

    }

    /**
     * Marks a task as complete for the player.
     * @function markTaskComplete
     * @param {string} description - The description of the task to be marked as complete.
     */
    async markTaskComplete(description) {
        this.taskList = this.player.getTaskList();
        this.player.setTaskComplete(description);
        if(!this.player.getImposterStatus() && this.player.getStatus() == "alive")
        {
            this.room.updateNumTasksComplete(1);
        }
        // update player tasklists task to completed
    }


    /**
     * Gets up to four tasks that have not been completed.
     * @function getVisibleTasks
     * @returns {Array} An array of up to four tasks that have not been completed.
     */
    getVisibleTasks() {
        // Display up to four tasks that have not been completed.
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

    /**
     * Gets the total tasks completed
     * @function getTasklistStatus
     * @returns {number} A number represnting the total tasks completed.
     */
    getTasklistStatus() {
        // return (number of tasks complete, number of tasks requred)
        return this.player.getNumTasksCompleted();
    }

    /**
     * @function getRoomNumTasksCompleted
     * @returns {number} A number representing the total tasks completed by the player
     */
    getRoomNumTasksCompleted(){
        return this.room.getNumTasksComplete();
    }

    /**
     * @function getRoomStatus
     * @returns {string} A string representing the room status
     */
    getRoomStatus(){
        // console.log("status", this.room.getStatus().enumKey)
        return this.room.getStatusAsString();
    }
}
