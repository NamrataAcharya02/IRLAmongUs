import GameController from "./GameController";
import { Admin } from "../models/Admin";
import { Room } from "../models/Room";
import { DuplicateRoomCodeError } from "../errors/roomError";
import { RoomStatus } from '../models/enum';
import {Player} from "../models/Player";
import { cleanupDbCollectionDocs } from '../models/utils';
import { redirect } from "react-router-dom";
import { shuffler } from "../models/utils";

const ROOM_CODE_CHARACTER_SET = '0123456789';
const ROOM_CODE_CHARACTER_SET_LENGTH = ROOM_CODE_CHARACTER_SET.length;
const ROOM_CODE_LENGTH = 4;


export default class AdminGameController extends GameController {
    adminId;  // actual Admin object
    playerIds; // actual list of Player objects that are watched by admin
            // each player must have a listener added
    roomCode = 0;
    tasklist;
    numImposters;
    numTasksToComplete;
    adminObject = null;
    callback;
    room;
    players;
    threshold;
    imposterIds = [];
    crewmateIds = [];
    crewmates = [];
    impostersWin = false;
    numTasksPerPlayer;

        /**
     * Creates a new AdminGameController instance.
     *
     * @constructor
     * @param {string} adminId - The ID of the admin.
     * @param {Function} callback - The callback function to be executed after upon updates in the db.
     */
    constructor(adminId, callback) {
        super();
        this.adminId = adminId;
        this.callback = callback;
        this.roomCode = 0;
        this.players = [];
        this.tasklist = [];
        this.room = null;
        this.threshold = 0;
    }

    /**
     * This function gets the admin's tasklist
     * @async
     * @returns {Promise} A promise that resolves with the admin's tasklist
     * */
    async getTaskList() {
        let admin = await this.getAdmin();
        this.tasklist = await admin.getTaskList();
        return this.tasklist;
    }

    setNumImposters(numImposters) {
        this.numImposters = numImposters;
    }

    getNumImposters() {
        return this.numImposters;
    }

    setNumTasksToComplete(numTasksToComplete) {
        this.numTasksToComplete = numTasksToComplete;
    }

    getNumTasksToComplete() {   
        return this.numTasksToComplete;
    }

    /**
     * Retrieves the admin object. If it doesn't exist, creates a new one with a default tasklist.
     *  
     * @async
     * @function createAdmin
     * @param {string} adminId - The ID of the admin.
     * @param {Array<Object>} tasklist - An array of task objects to be saved.
     * @returns {Promise<Object>} A promise that resolves with the admin object.
     * 
    static async createAdmin(adminId, tasklist) {
        // create an admin object
        // add the admin object to the database
        // return the admin object
        let admin = await Admin.getOrCreateAdmin(adminId, tasklist);
        this.adminObject = admin;
        return admin;

    }

    /**
     * Retrieves the admin object. If it doesn't exist, creates a new one with a default tasklist.
     *
     * @async
     * @function getAdmin
     * @returns {Promise<Object>} A promise that resolves with the admin object.
     */
    async getAdmin() {
        if (this.adminObject == null) {
            this.adminObject = await Admin.getOrCreateAdmin(this.adminId, ['task']);
        }
        return this.adminObject;
    }

    /**
     * Retrieves the admin object from the database.
     * 
     * @async
     * @function getAdminDB
     * @param {string} adminId - The ID of the admin.
     * @returns {Promise<Object>} A promise that resolves with the admin object.
     * 
     * */
    static async getAdminDB(adminId) {
        // get the admin object from the database
        // return the admin object
        let admin = await Admin.getAdmin(adminId);
        return admin;

    }

    getRoomObject() {
        return this.room;
    }

    setRoomObject(room) {
        this.room = room;
    }

    getPlayers() {
        return this.players;    
    }

    /** 
     * This function gets the room object from the database and sets the room object
     * in the controller to the room object from the database.
     * @async
     * @param {string} roomCode - The room code of the room to be retrieved.
     * @returns {Promise} room object associated with the room code that resolves
     * 
     * */
    async getRoomDB(roomCode) {
        // get the room object from the database
        let room = await Room.getRoom(roomCode.toString());
        this.setRoomObject(room);
        return room;
    }

    /**
     * This function updates the admin in the database with the room code.
     * @async
     * @param {string} roomCode - The room code to be updated in the database.
     * @returns {Promise} A promise that resolves when the room code has been updated in the database.
     * 
     * */
    async setRoomCode(roomCode) {
        /*let admin = await this.getAdmin();
        this.roomCode = roomCode;*/
        //console.log(admin);
        let admin = await this.getAdmin();
        await admin.updateAdminRoomCode(roomCode);
    }

    /**
     * This function gets the room code from the admin object.
     * @async
     * @returns {Promise} A promise that resolves with the room code.
     *  
     * */
    async getRoomCode() {
        let admin = await this.getAdmin();
        this.roomCode = await admin.getRoomCode();
        return this.roomCode;
    }

    /**
     * Saves the tasklist for the game.
     *
     * @async
     * @function saveTasklist
     * @param {Array<Object>} tasklist - An array of task objects to be saved.
     * @returns {Promise} A promise that resolves when the tasklist has been saved to the database.
     */
    async saveTasklist(tasklist) {
        // update admin.tasklist
        let adminUser = await Admin.getAdmin(this.adminId);
        this.tasklist = tasklist;
        console.log("adminUser: " + adminUser, this.adminId);

        await adminUser.updateAdminTasklist(tasklist);

    }

    /**
     * Generates a random room code.
     * 
     * @param {number} length - The length of the room code to be generated.
     * @returns {string} A randomly generated room code.
     * 
     * */
    static generateRoomCode(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += ROOM_CODE_CHARACTER_SET.charAt(Math.floor(Math.random() * ROOM_CODE_CHARACTER_SET_LENGTH));
        }
        return result;
    }

    /**
     * This function adds a callback to the admin controller.
     * @param {Function} callback - The callback function to be executed upon updates in the db.
     * 
     * */
    addCallback(callback) {
        console.log("admincontroller noting callback");
        this.callback = callback;
    }

    /**
     * This function generated a random room code and generated a new room object and
     * calls the getOrCreateRoom function to create a room in the database.
     * @async
     * 
     * @returns {Promise} room object associated with the generated room code that resolves
     */
    async startRoom() {
        //create a room object
        console.log("startRoom");
        let admin = await this.getAdmin();
        console.log("admin: " + admin);
        let tasklist = admin.getTaskList();
        console.log("tasklist: " + tasklist);
        //NEED TO ADD CHECK FOR EXISTING ROOM CODE HERE
         // create a room code that doesn't conflict with existing documents in the db

        // lock this region
        // get roomcode from admin.getRoomCode();
        // try to get a room with that code. If the room exists, ensure that room.getAdminId() === admin.getId(). 
        // If the id's match, good. If not, generate new code, attempt to create a room. loop until unique room created.
        
        // finally {unlock region}

        let i = 0;
        while(i < 3) {
            try {
                i++; // fail safe to prevent infinite loops
                     
                     /** TODO: store all room doc.id in a list, generate a room code
                      *  until the generated code isn't in the list. Perform one last
                      * check in the rooms collection (as shown below with the !(...exists())) 
                      * to ensure a code hasn't been added, then use that code. 
                      * */
 
                let roomCode = AdminGameController.generateRoomCode(ROOM_CODE_LENGTH).toString();

                //COMMENT THIS OUTTTTTTT
               // roomCode = 5780;

                console.log("roomCode: " + roomCode);

                let room = await Room.getOrCreateRoom(roomCode, this.adminId, tasklist, 0, 0);
                console.log("im skipping over this");
                if (room) {
                    console.log("room created, setting roomCode")
                    await this.setRoomCode(roomCode);
                    this.setRoomObject(room);

                    console.log("roomCode: " + roomCode);

                //room.addCallback(this.callback);

                    console.log("room: " + room);
                    return room;

                }
                
            } catch (error) {
                     if (error instanceof DuplicateRoomCodeError) {
                         console.log("Duplicate roomCode: " + error);
                         throw error;
                     }
                     else {
                        console.log("error" + error);
                     }
            }
        }
    }

    getVictoryStatus() {
        return this.victoryStatus;
    }

    /**
     * This function randomly assigns player roles depending on the number of imposters (numImposters)
     * and the number of players in the room (numPlayers). It doesn't return anything, but it updates
     * the player objects in the database with their status.
     * @async
     * 
     * 
     */
    async #assignPlayerRoles() {
        // update player object
        let shufflePlayers = this.room.getPlayerIds();
        // Shuffle array
        const shuffled = shufflePlayers.sort(() => 0.5 - Math.random());

       // Get sub-array of first n elements after shuffled
        let imposters = shuffled.slice(0, this.numImposters);
        this.imposterIds = imposters;

        console.log("assigning roles", imposters);

        for (const player of this.players) {
            console.log("player: " + player.getId());
            if (imposters.includes(player.getId())) {
                // update player role to "Imposter"
                console.log("assigned imposter: " + player.getId());
                await player.setImposterStatus(true);

            } else {
                // update player role to "Crewmate"
                console.log("assigned crewmate: " + player.getId());
                this.crewmateIds.push(player.getId());
                this.crewmates.push(player);
                await player.setImposterStatus(false);
            }
        }

    }

    /**
     * This function updates the room status in the database.
     * @async
     * @param {string} status - The status to be updated in the database.
     * */
    async updateRoomStatus(status) {
        await this.room.updateStatus(status);
    }

    /**
     * This function checks for the different game end conditions.It bases this on 
     * the number of imposters, the number of crewmates, and the number of tasks completed.
     * @returns {boolean} true if the game has been won, false otherwise
     */
    checkEndGame() {
        // check if the game has been won
        // if so, update room status to "Won"
        // return true if game has been won, false otherwise

        //numImposters >= numCrewmates
        let numImposters = 0;
        let numCrewmates = 0;
        for (const player of this.players) {
            if (player.getImposterStatus() && player.getStatus() == "alive") {
                numImposters++;
            } else if (!player.getImposterStatus() && player.getStatus() == "alive") {
                numCrewmates++;
            }
        }
        console.log("numImposters: " + numImposters);
        console.log("numCrewmates: " + numCrewmates);
        if (numImposters != 0 || numCrewmates != 0) {

        if (numImposters >= numCrewmates) {
            console.log("imposters win");
            //this.victoryStatus = "Imposters Win.";
            this.impostersWin = true;
            this.updateRoomStatus(RoomStatus.impostersWin);
            return true;
        }

        //numImposters == 0
        if (numImposters == 0) {
            console.log("crewmates win (no imposters)");
            //this.victoryStatus = "Crewmates Win.";
            this.impostersWin = false;
            this.updateRoomStatus(RoomStatus.crewmatesWin);
            return true;
        }

        //numTasksCompleted >= threshold
        let numTasksCompleted = this.getTotalNumberTasksCompleted();
        console.log("numTasksCompleted: " + numTasksCompleted);
        if (numTasksCompleted >= this.threshold) {
            console.log("crewmates win (tasks completed)");
            //this.victoryStatus = "Crewmates Win.";
            this.impostersWin = false;
            this.updateRoomStatus(RoomStatus.crewmatesWin);
            return true;
        }
    }
        return false;
        
    }

     /**
     * Starts the game, sets up the room and players.
     *
     * @async
     * @function startGame
     * @param {number} numImposters - The number of imposters in the game.
     * @param {number} numTasksToComplete - The number of tasks to be completed in the game.
     * @returns {Promise} A promise of a room object that resolves when the game has started, room status is updated, players are set up, and tasks are assigned.
     */
    async startGame(numImposters, numTasksToComplete) {
        // update Room Status to "inGame"

        // NOTE: somewhere in the rendering of the React component,
        // there should be a function (perhaps an effect) that runs
        // every time a player object changes to determine if the 
        // whether the game has been won, that is, whether all the tasks
        // have been completed.
        console.log("startGame");
        console.log("room object: " + this.room);
        let room = this.getRoomObject();
        this.setNumImposters(numImposters);
        this.setNumTasksToComplete(numTasksToComplete);
        this.numTasksPerPlayer = numTasksToComplete / (this.room.getPlayerIds().length - numImposters);

        //update room status to inGame and update numImposters and numTasksToComplete
        
        this.playerIds = this.room.getPlayerIds();
        console.log("players: " + this.playerIds);

        for (const pid of this.playerIds) {
            console.log("pid: " + pid);
            let player = await Player.getPlayer(pid);

            console.log("player: " + player, player.getId());
            player.addCallback(this.callback);
            console.log("player callback added");
            await player.setAliveStatus("alive");
            let shuffledTaskList = shuffler(this.room.getTaskList());
            await player.setTaskList(shuffledTaskList); //assign tasklist to players
            await player.setRoomCode(this.room.getRoomCode());
            //await player.setNumTasksToComplete(this.room.getNumTasksToDo());
            console.log("player tasklist: " + player.getTaskList());
            this.players.push(player);
        }
        console.log("players: " + this.players);
         // assign player roles
         await this.#assignPlayerRoles();
         console.log("imposters: " + this.imposters);
 
         this.threshold = numTasksToComplete;
         console.log("threshold: " + this.threshold);
 
        await room.updateStatus(RoomStatus.inProgress);
        await room.updateNumImposters(numImposters);
        await room.updateNumTasksToDo(numTasksToComplete);

    }
    /**
     * Marks a player as dead in the game.
     *
     * @async
     * @function markDead
     * @param {string} playerId - The ID of the player to be marked as dead.
     * @returns {Promise} A promise that resolves when the player's status has been updated to "dead"
     */
    async markDead(playerId) {
        // update player object
        // update room object
        // update room status to "InMeeting"
        // return true if game has been won, false otherwise
        let player = await Player.getPlayer(playerId.toString());
        await player.setAliveStatus("dead");
        console.log("player marked dead: " + player.getId());
        //this.checkEndGame();
        //return this.checkEndGame();
    }

    async getPlayerName(pid)
    {
        
        let player = await Player.getPlayer(pid);
        console.log("player name: ", player.getName());
        return player.getName();
    }

    displayGameCode() {
        // get the roomCode from the room Object

    }
    /**
     * Gets the total number of tasks completed in the game.
     *
     * @async
     * @function getTotalNumberTasksCompleted
     * @returns {total} The total number of tasks that have been completed in the game.
     */
    getTotalNumberTasksCompleted() {
        // sum over each player object for the total number of
        // tasks completed
        let total = 0;
        for (const player of this.crewmates) {
            if (player.getStatus() != "kicked") {
                total += player.getNumTasksCompleted();
            }
        }
        return total;

    }
    /**
     * Ends the game, deletes player and room objects from the database.
     *
     * @async
     * @function endGame
     * @returns {Promise} A promise that resolves when all player objects and the room object have been deleted from the database.
     */
    async endGame() {
        // for every playerId in room.playerIds,
        // delete player object from database
        // delete room object from database
        for (const player of this.players) {
            await player.deletePlayer()
        }
        await Room.deleteRoom(this.roomCode);
        

    }

    /**
     * Kicks a player out of the game.
     * 
     * @async
     * @function kickOutPlayer
     * @param {string} playerId - The ID of the player to be kicked out.
     * @returns {Promise} A promise that resolves when the player has been kicked out of the game.
     */
    startVoting(){
        // TODO: this could be a moot function.
        // set room status to ActiveVoting (in front end, if getRoomStatus() is 
        // "ActiveVoting," display voting ui to players)
        //when voting begins, create a vote doc with an array of all players who have casted a vote
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

    getRoomStatus(){
        return this.room.getStatusAsString();
    }

    finalizeVotingResults() {
        // getVotingResults
        // kickout the player(s) voted out
        // endMeeting()

        // if (game won) logic -> update room status to "Won"
    }

    async kickOutPlayer(playerId) {
        // delete player from database
        // remove player from room.playerIds
        let player = await Player.getPlayer(playerId.toString());
        await player.deletePlayer();        
        this.threshold -= this.numTasksPerPlayer;
        this.players = this.players.filter(function(player) {return player.getId() != playerId;});
        
        await Room.leaveRoom(this.room.getRoomCode(), playerId);
        console.log("player kicked out: " + playerId);
        console.log("new threshold" + this.threshold);


    }

    endMeeting() {
        // update room status to "InGame"
    }
}