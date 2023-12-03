import GameController from "./GameController";
import { Admin } from "../models/Admin";
import { Room } from "../models/Room";
import { DuplicateRoomCodeError } from "../errors/roomError";
const ROOM_CODE_CHARACTER_SET = '0123456789';
const ROOM_CODE_CHARACTER_SET_LENGTH = ROOM_CODE_CHARACTER_SET.length;
const ROOM_CODE_LENGTH = 4;

export default class AdminGameController extends GameController {
    adminId;  // actual Admin object
    players; // actual list of Player objects that are watched by admin
            // each player must have a listener added
    roomCode = 0;
    tasklist;
    numImposters;
    numTasksToComplete;
    adminObject = null;
    callback;
    room;

    //remove tasklist from constructor (and the other things, keep only adminId)
    constructor(adminId, callback) {
        super();
        this.adminId = adminId;
        this.callback = callback;
        this.roomCode = 0;
        this.players = [];
        this.tasklist = [];
        this.room = null;
        
       // this.tasklist = tasklist;
       // this.numImposters = numImposters;
       // this.numTasksToComplete = numTasksToComplete;
        //this.adminObject = Admin.getOrCreateAdmin(adminId, ['task'] );
        //create admin object here
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

    static async getRoomObject(roomCode) {
        // get the room object from the database
        // return the room object
        let room = await Room.getRoom(roomCode.toString());
        this.room = room;
        return room;
    }

    async setRoomCode(roomCode) {
        /*let admin = await this.getAdmin();
        this.roomCode = roomCode;*/
        //console.log(admin);
        let admin = await this.getAdmin();
        admin.updateAdminRoomCode(roomCode);
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

                console.log("roomCode: " + roomCode);

                let room = await Room.getOrCreateRoom(roomCode, this.adminId, tasklist, 0, 0);
                console.log("im skipping over this");
                if (room) {
                    console.log("room created, setting roomCode")
                    await this.setRoomCode(roomCode);
                    this.room = room;

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



        
        //room.addCallback() in front end 

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

    async startGame(numImposters, numTasksToComplete) {
        // update Room Status to "inGame"

        // NOTE: somewhere in the rendering of the React component,
        // there should be a function (perhaps an effect) that runs
        // every time a player object changes to determine if the 
        // whether the game has been won, that is, whether all the tasks
        // have been completed.
        console.log("startGame");
        console.log("room object: " + this.room);

        //update room status to inGame and update numImposters and numTasksToComplete
        await this.room.updateRoomStatus(Room.Status.inGame);
        await this.room.updateRoomNumImposters(numImposters);
        await this.room.updateRoomNumTasksToComplete(numTasksToComplete);

        this.players = this.room.getPlayerIds();
        console.log("players: " + this.players);


        /*// create player objs
        _createPlayers();
        this.room.updateRoomStatus(RoomStatus.inProgress);
    }

    _createPlayer() {
        this.players = this.room.getPlayerIds().forEach(pid => {
            const p = new Player(this.room.getRoomCode(), ...); // I don't know how Player is implemented
            p.addCallback(this.callback);
            return p;
        }); */


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