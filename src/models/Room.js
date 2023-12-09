import { 

    QuerySnapshot,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    documentId,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    serverTimestamp,
    setDoc,
    updateDoc, 
    where,
    Firestore
} from "firebase/firestore";

import { RoomStatus } from './enum';

import { db } from "../firebase";
import { RoomNotExistError, MoreThanOneRoomError, DuplicateRoomCodeError } from "../errors/roomError";
import { FirebaseError } from "firebase/app";
import { redirect } from "react-router-dom";

export class Room {
    status;
    // #statusAsString;
    #id;
    #adminId;
    #code;
    #createdAt;
    #tasklist;
    #numImposters;
    #numTasksToDo;
    #numTasksComplete;

    #playerIds;

    #callback;
    constructor(id, adminId, code, createdAt, tasklist, numImposters, numTasksToDo) {
        this.status = RoomStatus.new;
        this.#id = id;
        this.#adminId = adminId;
        this.#code = code;
        this.#createdAt = createdAt;
        this.#tasklist = tasklist;
        this.#numImposters = numImposters;
        this.#numTasksToDo = numTasksToDo;
        this.#playerIds = [];
        this.#numTasksComplete = 0;

        this.#callback = null;

        this.#addDocSnapshotListener();
    }

    getRoomId() { return this.#id; }
    getAdminId() { return this.#adminId; }
    /**
     * 
     * @returns room code associated with the room
     */
    getRoomCode() { return this.#code; }
    getCreatedAt() { return this.#createdAt; }
    getTaskList() { return this.#tasklist; }
    getNumImposters() { return this.#numImposters; }
    getNumTasksToDo() { return this.#numTasksToDo; }
    getNumPlayers() {return this.#playerIds.length; }
    getPlayerIds() { return this.#playerIds; }
    getStatus() {return this.status; }
    getStatusAsString() { 
        // console.log("return status", this.status.enumKey);
        return this.status.enumKey; 
    }
    getNumTasksComplete() { return this.#numTasksComplete; }
    

    setRoomId(id) { this.#id = id; }
    setAdminId(adminId) { this.#adminId = adminId; }
    setRoomCode(code) { this.#code = code; }
    setCreatedAt(createdAt) { this.#createdAt = createdAt; }
    setTaskList(tasklist) { this.#tasklist = tasklist; }
    setNumImposters(numImposters) { this.#numImposters = numImposters; }
    setNumTasksToDo(numTasksToDo) { this.#numTasksToDo = numTasksToDo; }
    setPlayerIds(players) { this.#playerIds = players; }
    setNumTasksComplete(numTasksToComplete) { this.#numTasksComplete = numTasksToComplete; }

    setStatus(status) { 
        console.log("status changed");
        if (status instanceof RoomStatus){
            this.status = status; 
        } else {
            throw TypeError(`status must be of type RoomStatus`);
        }
    }

    addNumTasksComplete(num) {
        if (!(typeof num !== Number)) {
            throw TypeError(`num "${num}" in addNumTasksComplete invalid Type`);
        }
        this.#numTasksComplete = this.getNumTasksComplete() + num;
    }
    
    /**
     * updates the task list associated with the room
     * @param {string[]} tasklist the task list that is associated with the room
     */
    async updateTaskList(tasklist) { 
        this.setTaskList(tasklist);
        this.#__update({tasklist: tasklist});
    }

    /**
     * updates the number of imposters in the room
     * @param {Number} numImposters the number of imposters to set for the room
     */
    async updateNumImposters(numImposters) { 
        this.setNumImposters(numImposters); 
        this.#__update({numImposters: numImposters});
    }

    /**
     * updates how many tasks the crewmates should aim to achieve
     * @param {Number} numTasksToDo the number of tasks the room should collectively do
     */
    async updateNumTasksToDo(numTasksToDo) { 
        this.setNumTasksToDo(numTasksToDo);
        this.#__update({numTasksToDo: numTasksToDo});
    }

    /**
     * sets the room status to what is passed in
     * @param {RoomStatus} status enum that signifies what state the room is in
     */
    async updateStatus(status) { 
        if (status instanceof RoomStatus){
            this.setStatus(status); 
            this.#__update({status: status.enumKey});
        } else {
            throw TypeError(`status must be of type RoomStatus`);
        }
    }

    /**
     * adds num to the number of tasks the room has completed
     * updates the database
     * @param {Number} num how many tasks that has been completed since last update
     */
    async updateNumTasksComplete(num) {
        this.addNumTasksComplete(num);
        this.#__update({numTasksComplete: this.getNumTasksComplete()});
    }

    /**
     * adds player to room
     * @param {String} playerId id of player that wants to join the room
     */
    async addPlayer(playerId) { 
        if (!(this.getPlayerIds().includes(playerId))) {
            this.#playerIds.push(playerId); 
            this.#__update({playerIds: arrayUnion(playerId)});
        }
    }

    /**
     * 
     * @param {Callback} callback listener for updating the data of the room live
     */
    addCallback(callback) {
        console.log("room adding callback");
        this.#callback = callback;
    }

    /**
     * 
     * @param {Field} field what field of the doc is updated
     */
    async #__update(field) {
        await updateDoc(Room.#_roomRefForRoomCode(this.getRoomCode()), field);
    }


    /**
     * repopulates and updates the class variables with the latest snapshot of the database
     * @param {Data} snapData the data that is pulled from the database
     */
    #__updateFromSnapshot(snapData) {
        console.log("updating");
        this.#id = snapData.id;
        this.#adminId = snapData.adminId;
        this.#code = snapData.code;
        this.#createdAt = snapData.createdAt;
        this.#tasklist = snapData.tasklist;
        this.#numImposters = snapData.numImposters;
        this.#numTasksToDo = snapData.numTasksToDo;
        this.#numTasksComplete = snapData.numTasksComplete;
        this.#playerIds = snapData.playerIds;
        this.status = RoomStatus.enumValueOf(snapData.status);
        if (this.#callback != null) {
            console.log("running callback in room");
            this.#callback();
        }
        console.log("finished");
    }

    /**
     * adds a listener to the database to send updates from the snapshot
     */
    #addDocSnapshotListener() {
        console.log("registering DocSnapshotListener for Room " + this.getRoomCode());
        const docQuery = query(collection(db, "rooms"), where(documentId(), "==", this.getRoomCode()));

        this.unsub = onSnapshot(docQuery, 
            snapshot => {
                console.log("onSnapshot triggered");
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        console.log("New room: ", change.doc.data());
                    }
                    if (change.type === "modified") {
                        const docData = change.doc.data();
                        console.log("Modified room: ", docData.id);
                        this.#__updateFromSnapshot(docData);
                    }
                    if (change.type === "removed") {
                        console.log("Removed room: ", change.doc.data());
                    }
                  });
            },
            (err) => {
                console.log("error while handling snapshot: " + err);
            }
            );
    }

    /**
     * Create a room for game play. This method calls _generateRoomCode and ensures 
     * code uniqueness. It verifies that the number of tasks asked to be completed
     * are within bounds of the number of tasks in a task list. For the time being,
     * createRoom only ensures the number of imposters is greater than zero.
     * 
     * Errors
     * This method throws two errors that can be caught by external callers, namely:
     * - InvalidNumberOfImposters thrown when numImposters is <= 0
     * - InvalidNumberOfTasksToDo thrown when numTasksToDo <= 0 
     *          or tasklist.tasks.lenth < numTasksToDo
     * 
     * @param {String} adminId unique alphanumeric string provided via firebase
     * @param {Array} tasklist the tasks associated with this gameplay room.
     * @param {Number} numImposters The number of characters who will be imposters
     * @param {Number} numTasksToDo The number of tasks each Crewmate is required 
     *                              to complete to win the game
     * @returns {Room} A concrete room that has been added to the database.
     */
    static async createRoom(roomCode, adminId, tasklist, numImposters, numTasksToDo) {
        // only run this method once
        // if (typeof this.createRoom.called == 'undefined') {
        //     this.createRoom.called = false;
        // }
        console.log("create Room");
        
        // create a room code that doesn't conflict with existing documents in the db
        // if (!this.createRoom.called) {
            // this.createRoom.called = true;
            /** TODO: store all room doc.id in a list, generate a room code
             *  until the generated code isn't in the list. Perform one last
             * check in the rooms collection (as shown below with the !(...exists())) 
             * to ensure a code hasn't been added, then use that code. 
             * */

            const docRef = this.#_roomRefForRoomCode(roomCode);
            
        if (!(await getDoc(docRef)).exists()) {
            
            console.log("creating room doc " + roomCode);
            
            const room = new Room(roomCode, adminId, roomCode, null, tasklist, numImposters, numTasksToDo);
            room.setStatus(RoomStatus.new);
            await setDoc(docRef, room);
            return room;
        } else {
            throw new DuplicateRoomCodeError(`Attempting to create a room with the same id: ${roomCode}`);
        }
        // }
    }


    static #_roomRefForRoomCode(roomCode) {
        return doc(db, "rooms", roomCode).withConverter(roomConverter);
    }

    /**
     * Query the database for the unique room belonging to the admin as defined by
     * the parameter `adminId`.
     * 
     * Errors:
     * This method throws two Errors that can be caught by callers:
     * - MoreThanOneRoomError thrown when database reflects more than one room for an Admin
     * - RoomNotExistError thrown when no room was found for the room. Indicates a call to 
     *          `createRoom()` might be needed.
     * 
     * @param {String} adminId The unique identifier provided by firebase
     * @returns A Room object belonging to the admin defined by `adminId`.
     */
    // static async getRoom(adminId) {
    static async getRoom(roomCode) {
        if (roomCode == null || roomCode == "") {
            throw new RoomNotExistError("null or empty roomCode");
        }
        // Currently, support admin having only one room.
        // const docRef = doc(db, "rooms", adminId).withConverter(roomConverter);
        const docRef = this.#_roomRefForRoomCode(roomCode.toString());
        const docSnap = await getDoc(docRef);
        if (docSnap.size > 1) {
            throw new MoreThanOneRoomError("More than one roome with code " + roomCode + ". Contact system adminstrator for help.");
        } else if (!docSnap.exists()) {
            throw new RoomNotExistError("No room with code: " + roomCode);
        }

        return docSnap.data();
    }

    /**
     * A frontend helper method that makes querying the database for a room more straightforward.
     * This method first trys to find a room (via `this.getRoom(...)`). If the room exists in the
     * database, a Room object will be returned with all information as fetched from the database.
     * That is, it is the callers responsibility to ensure that the returned Room object has the 
     * desired tasklist. 
     * 
     * If the Room retrieved via the getRoom method has different tasklistect, numImposters, or 
     * numTasksToDo than is passed in by the corresponding parameters, it is the responsibility 
     * of the caller to discover and rectify the discrepancies.
     * 
     * Upon recieving a `RoomNotExistError`, the method will attempt to create a room using 
     * `this.create(...)`. The Room returned by this method will have the tasklist
     * 
     * This method handles all Errors thrown by `getRoom()` and `createRoom()`. This method will
     * rethrow the following two errors:
     * - InvalidNumberOfImposters
     * - InvalidNumberOfTasksToDo
     * 
     * @param {String} adminId The unique identifier provided by firebase
     * @param {Array} tasklist the task descriptions associated with this gameplay room.
     * @param {Number} numImposters The number of characters who will be imposters
     * @param {Number} numTasksToDo The number of tasks each Crewmate is required 
     *                              to complete to win the game
     * @returns A Room object corresponding to the adminId
     */
    static async getOrCreateRoom(roomCode, adminId, tasklist, numImposters, numTasksToDo) {
        let room = null;
        try {
            console.log('getOrCreateRoom: getting room: ' + roomCode);
            room = await Room.getRoom(roomCode);
        } catch (error) {
            if (error instanceof RoomNotExistError) {
                console.log("willcreate");
                room = await Room.createRoom(roomCode, adminId, tasklist, numImposters, numTasksToDo);
                console.log("have apparently created")
                console.log("getOrCreateRoom created room with id: " + room.getRoomCode());
            } else if (error instanceof MoreThanOneRoomError) {
                throw error;
            } else {
                console.log("error" + error);
            }
        }
        return room;
    }


    /**
     * Update a room instance and database with parameters, only if a change in any one of the 
     * parameters has occured. This method checks for changes to prevent unnecessary database
     * writes.
     * 
     * TODO: Refactor this method to make it more robust and handle all types of updates.
     * Ideally, arglist is a dictionary who's key's correspond to Room attributes,
     * and whos values corresopnd to the new value. 
     * 
     * @param {Array} tasklist Admin defined tasks all players who join room will receive
     * @param {Number} numImposters Admin defined number of imposters who "kill" Crewmates
     * @param {Number} numTasksToDo Admin defined number of tasks each Crewmate must complete for game to be won
     * @returns The room object instance that called the method
     */
    async updateRoom(tasklist, numImposters, numTasksToDo) {
        if (JSON.stringify(this.getTaskList()) !== JSON.stringify(tasklist)  ||
            this.getNumImposters() !== numImposters                             ||
            this.getNumTasksToDo() !== numTasksToDo) 
        {
            const docRef = Room.#_roomRefForRoomCode(this.getRoomCode());
            this.setTaskList(tasklist);
            this.setNumImposters(numImposters);
            this.setNumTasksToDo(numTasksToDo);
            await updateDoc(docRef, {
                tasklist: tasklist,
                numImposters: numImposters,
                numTasksToDo: numTasksToDo
            });
            console.log("successfully updated room " + this.getRoomCode());
        }
        return this;
    }



    /**
     * TODO:
     * @param {*} code 
     */
    static async deleteRoom(roomCode) {
        

        const roomDocRef = this.#_roomRefForRoomCode(roomCode);
        await deleteDoc(roomDocRef);
        return true;
    }

    /**
     * Add a player to a rooms `players` list and update firestore to reflect a
     * newly added added player.
     * 
     * If this method returns, it will always yield a Room object.
     * 
     * joinRoom throws two errors:
     *      - RoomCodeDoesNotExistError
     *      - MoreThanOneRoomError
     * when the queried room code doesn't exist or when more than one room exists
     * with the room code, respectively.
     * 
     * @param {String} roomCode ROOM_CODE_LENGTH code of the room provided by Game Admins.
     * @param {String} playerId alphanumeric id assigned to anonymous users
     * @returns {Room} The room object associated with the roomCode sent in
     */
    static async joinRoom(roomCode, playerId) {
        try {
            let room = await Room.getRoom(roomCode);
            
            // only add the player to this rooms `players` list if it doesn't exist in it
            if (room.getPlayerIds().includes(playerId)) {
                console.log("Player " + playerId + " already in room " + roomCode);
                return room;
            }

            // update database
            const roomDocRef = this.#_roomRefForRoomCode(room.getRoomCode());
            await updateDoc(roomDocRef, {
                players: arrayUnion(playerId)
            });

            return room;

            
        } catch (error) {
            if (error instanceof RoomNotExistError) {
                throw error;
            } else {
                throw error;
            }
        }
    }

    /**
     * TODO:
     * @param {*} code 
     * @param {*} playerId 
     */
    static async leaveRoom(code, playerId) {
        const room = await Room.getRoom(code);
        const currPlayers = room.getPlayerIds();
        try {
            const updatedPlayers = currPlayers.splice(currPlayers.indexOf(playerId), 1);
            const roomDocRef = this.#_roomRefForRoomCode(code);
            await updateDoc(roomDocRef, {players: updatedPlayers});
        } catch (err) {
            console.log(err);
        }
    }

}


/**
 * Firestore converter used to convert:
 *      * a Room object to a firestore document in the room collection
 *      * a room collection document to a Room object
 */
export const roomConverter = {
    toFirestore: (room) => {
        return {
            status: room.getStatus().enumKey,
            id: room.getRoomId(),
            adminId: room.getAdminId(),
            code: room.getRoomCode(),
            createdAt: serverTimestamp(),
            tasklist: room.getTaskList(),
            numImposters: room.getNumImposters(),
            numTasksToDo: room.getNumTasksToDo(),
            numTasksComplete: room.getNumTasksComplete(),
            playerIds: room.getPlayerIds(),
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        let room = new Room(data.id, data.adminId, data.code, data.createdAt, data.tasklist, data.numImposters, data.numTasksToDo);
        room.setPlayerIds(data.playerIds);
        room.setNumTasksComplete(data.numTasksComplete);
        room.setStatus(RoomStatus.enumValueOf(data.status));
        return room;
    }
};