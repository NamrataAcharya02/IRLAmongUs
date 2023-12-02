import GameController from "./GameController";
import { Admin } from "../models/Admin";
import { Room } from "../models/Room";
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

    //remove tasklist from constructor (and the other things, keep only adminId)
    constructor(adminId) {
        super();
        this.adminId = adminId;
        this.roomCode = 0;
        this.players = [];
        this.tasklist = [];
        
       // this.tasklist = tasklist;
       // this.numImposters = numImposters;
       // this.numTasksToComplete = numTasksToComplete;
        this.adminObject = Admin.getOrCreateAdmin(adminId, ['task'] );
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
            this.adminObject = Admin.getOrCreateAdmin(this.adminId, ['task']);
        }
        return this.adminObject;
    }

    static async getAdminDB(adminId) {
        // get the admin object from the database
        // return the admin object
        let admin = await Admin.getAdmin(adminId);
        return admin;

    }

    async setRoomCode(roomCode) {
        this.roomCode = roomCode;
        let admin = await this.getAdmin();
        this.roomCode = roomCode;
        console.log(admin);
        admin.setRoomCode(roomCode);
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
        console.log("room adding callback");



       // this.#callback = callback;
    }

    async startRoom() {
        //create a room object
        let admin = await this.getAdmin();
        let tasklist = admin.getTaskList();
        console.log("tasklist: " + tasklist);
        let roomCode = AdminGameController.generateRoomCode(ROOM_CODE_LENGTH);
        this.setRoomCode(roomCode);
        console.log("roomCode: " + roomCode);

        let room = await Room.getOrCreateRoom(this.roomCode, this.adminId, tasklist, this.numImposters, this.numTasksToComplete);

        console.log("room: " + room);
        return room;
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