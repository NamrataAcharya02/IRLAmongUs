import GameController from "./GameController";
import { Admin } from "../models/Admin";
import { Room } from "../models/Room";
import { DuplicateRoomCodeError } from "../errors/roomError";
import { RoomStatus } from '../models/enum';
import {Player} from "../models/Player";
import { cleanupDbCollectionDocs } from '../models/utils';

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


    constructor() {
        super();
        this.adminId = adminId;
        this.callback = callback;
        this.roomCode = 0;
        this.players = [];
        this.tasklist = [];
        this.room = null;
        this.threshold = 0;
    }

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

    static async createAdmin(adminId, tasklist) {
        // create an admin object
        // add the admin object to the database
        // return the admin object
        let admin = await Admin.getOrCreateAdmin(adminId, tasklist);
        this.adminObject = admin;
        return admin;

    }

    async getAdmin() {
        if (this.adminObject == null) {
            this.adminObject = await Admin.getOrCreateAdmin(this.adminId, ['task']);
        }
        return this.adminObject;
    }

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

    async getRoomDB(roomCode) {
        // get the room object from the database
        let room = await Room.getRoom(roomCode.toString());
        console.log("CHALU KYA HAI", room)
        this.setRoomObject(room);
        console.log("CHALU KYA HAIiiiiiiiiiiiiii", this.room)
        return room;
    }

    async setRoomCode(roomCode) {
        /*let admin = await this.getAdmin();
        this.roomCode = roomCode;*/
        //console.log(admin);
        let admin = await this.getAdmin();
        await admin.updateAdminRoomCode(roomCode);
    }

    async getRoomCode() {
        let admin = await this.getAdmin();
        this.roomCode = await admin.getRoomCode();
        return this.roomCode;
    }
    async saveTasklist(tasklist) {
        // update admin.tasklist
        let adminUser = await Admin.getAdmin(this.adminId);
        this.tasklist = tasklist;
        console.log("adminUser: " + adminUser, this.adminId);

        await adminUser.updateAdminTasklist(tasklist);

    }

    static generateRoomCode(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += ROOM_CODE_CHARACTER_SET.charAt(Math.floor(Math.random() * ROOM_CODE_CHARACTER_SET_LENGTH));
        }
        return result;
    }

    addCallback(callback) {
        console.log("admincontroller noting callback");
        this.callback = callback;
    }

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

    getVictoryStatus() {
        return this.victoryStatus;
    }



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

    async updateRoomStatus(status) {
        await this.room.updateStatus(status);
    }

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
            return true;
        }

        //numImposters == 0
        if (numImposters == 0) {
            console.log("crewmates win (no imposters)");
            //this.victoryStatus = "Crewmates Win.";
            this.impostersWin = false;
            return true;
        }

        //numTasksCompleted >= threshold
        let numTasksCompleted = this.getTotalNumberTasksCompleted();
        console.log("numTasksCompleted: " + numTasksCompleted);
        if (numTasksCompleted >= this.threshold) {
            console.log("crewmates win (tasks completed)");
            //this.victoryStatus = "Crewmates Win.";
            this.impostersWin = false;
            return true;
        }
    }
        return false;
        
    }

    startGame() {
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
            await player.setTaskList(this.room.getTaskList()); //assign tasklist to players
            await player.setRoomCode(this.room.getRoomCode());
            //await player.setNumTasksToComplete(this.room.getNumTasksToDo());
            console.log("player tasklist: " + player.getTaskList());
            this.players.push(player);
        }
        console.log("players: " + this.players);
         // assign player roles
         await this.#assignPlayerRoles();
         console.log("imposters: " + this.imposters);
 
         this.threshold = this.getNumTasksToComplete() * (this.players.length - this.getNumImposters());
         console.log("threshold: " + this.threshold);
 
        await room.updateStatus(RoomStatus.inProgress);
        await room.updateNumImposters(numImposters);
        await room.updateNumTasksToDo(numTasksToComplete);

    }

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

    displayGameCode() {
        // get the roomCode from the room Object
    }

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

    async endGame() {
        // for every playerId in room.playerIds,
        // delete player object from database
        // delete room object from database
        for (const player of this.players) {
            await player.deleteDoc(player.getId());
        }
        await Room.deleteRoom(this.room.getRoomCode());
        

    }

    startVoting(){
        // TODO: this could be a moot function.
        // set room status to ActiveVoting (in front end, if getRoomStatus() is 
        // "ActiveVoting," display voting ui to players)
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

    async kickOutPlayer(playerId) {
        // delete player from database
        // remove player from room.playerIds
        let player = await Player.getPlayer(playerId.toString());
        await player.setAliveStatus("kicked");
        this.threshold -= this.room.getNumTasksToDo();
        this.players = this.players.filter(function(player) {return player.getId() != playerId;});
        
        await Room.leaveRoom(this.room.getRoomCode(), playerId);
        console.log("player kicked out: " + playerId);
        console.log("new threshold" + this.threshold);


    }

    endMeeting() {
        // update room status to "InGame"
    }
}