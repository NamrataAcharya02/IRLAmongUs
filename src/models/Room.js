import { 
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc, 
    where,

    Firestore
} from "firebase/firestore";

import { RoomStatus } from './enum';

import { db } from "../firebase";
import { RoomNotExistError, MoreThanOneRoomError, InvalidRoomCodeError } from "../errors/roomError";
import { FirebaseError } from "firebase/app";

/**
 * Configuration settings for Room.
 * 
 * TODO: Would be good to yank these out into some config file.
 */
const ROOM_CODE_LENGTH = 4;
const ROOM_CODE_CHARACTER_SET = '0123456789';
const ROOM_CODE_CHARACTER_SET_LENGTH = ROOM_CODE_CHARACTER_SET.length;


export class Room {
    status;
    #id;
    #adminId;
    #code;
    #createdAt;
    #tasklistObj;
    #numImposters;
    #numTasksToDo;
    #playerIds; // TODO: convert to Player
    constructor(id, adminId, code, createdAt, tasklistObj, numImposters, numTasksToDo) { 
        this.status = RoomStatus.new;
        this.#id = id;
        this.#adminId = adminId;
        this.#code = code;
        this.#createdAt = createdAt;
        this.#tasklistObj = tasklistObj;
        this.#numImposters = numImposters;
        this.#numTasksToDo = numTasksToDo;
        this.#playerIds = [];
    }

    getRoomId() { return this.#id; }
    getAdminId() { return this.#adminId; }
    getRoomCode() { return this.#code; }
    getCreatedAt() { return this.#createdAt; }
    getTaskList() { return this.#tasklistObj; }
    getNumImposters() { return this.#numImposters; }
    getNumTasksToDo() { return this.#numTasksToDo; }
    getPlayerIds() { return this.#playerIds; }
    getStatus() {return this.status; }

    setRoomId(id) { this.#id = id; }
    setAdminId(adminId) { this.#adminId = adminId; }
    setRoomCode(code) { this.#code = code; }
    setCreatedAt(createdAt) { this.#createdAt = createdAt; }
    setTaskList(tasklistObj) { this.#tasklistObj = tasklistObj; }
    setNumImposters(numImposters) { this.#numImposters = numImposters; }
    setNumTasksToDo(numTasksToDo) { this.#numTasksToDo = numTasksToDo; }
    setPlayerIds(playerIds) { this.#playerIds = playerIds; }
    setStatus(status) { this.status = status; }

    addPlayer(player) { this.#playerIds.push(player); }

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
     *          or tasklistObj.tasks.lenth < numTasksToDo
     * 
     * @param {String} adminId unique alphanumeric string provided via firebase
     * @param {Object} tasklistObj the tasks associated with this gameplay room.
     * @param {Number} numImposters The number of characters who will be imposters
     * @param {Number} numTasksToDo The number of tasks each Crewmate is required 
     *                              to complete to win the game
     * @returns {Room} A concrete room that has been added to the database.
     */
    static async createRoom(adminId, tasklistObj, numImposters, numTasksToDo) {
        // only run this method once
        if (typeof this.createRoom.called == 'undefined') {
            this.createRoom.called = false;
        }
        console.log("create Room");
        
        // create a room code that doesn't conflict with existing documents in the db
        let i = 0;
        if (!this.createRoom.called) {
            console.log(`createRoom setting this.createRoom.called to true`);
            this.createRoom.called = true;
            while(i < 3) {
                try {
                    i++; // fail safe to prevent infinite loops
                    
                    /** TODO: store all room doc.id in a list, generate a room code
                     *  until the generated code isn't in the list. Perform one last
                     * check in the rooms collection (as shown below with the !(...exists())) 
                     * to ensure a code hasn't been added, then use that code. 
                     * */

                    const roomCode = this.#_generateRoomCode(ROOM_CODE_LENGTH);
                    console.log("createRoom: " + roomCode);
    
                    // TODO: validate numImposters to be greater than zero, and less than XX??
    
                    // TODO: validate numTasksToDo to be greater than zero, and less than tasklistObj.tasks.length
    
                    const docRef = this.#_roomRefForRoomCode(roomCode);
                    if (!(await getDoc(docRef)).exists()) {
                        
                        console.log("creating room doc " + roomCode);
                        
                        const room = new Room(roomCode, adminId, roomCode, null, tasklistObj, numImposters, numTasksToDo);
                        room.setStatus(RoomStatus.new);
                        await setDoc(docRef, room);
                        return room;
                    }
                    
                } catch (error) {
                    if (error instanceof FirebaseError) {
                        console.log("caught FirebaseError: " + error + ". Rethrowing!");
                        throw error;
                    }
                }
            }
        }
    }

    /**
     * Generate a random string of characters from ROOM_CODE_CHARACTER_SET. the string
     * will have a length defined be it's only parameter, length.
     * 
     * @param {Number} length Length of the string that should be generated
     * @returns A string of lenght `length` generated from ROOM_CODE_CHARACTER_SET
     */
    static #_generateRoomCode(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += ROOM_CODE_CHARACTER_SET.charAt(Math.floor(Math.random() * ROOM_CODE_CHARACTER_SET_LENGTH));
        }
        return result;
    }

    static #_roomRefForRoomCode(roomCode) {
        return doc(db, "rooms", roomCode).withConverter(roomConverter);
    }

    // static #_roomsQueryForCode(roomCode) {
    //     return query(collection(db, "rooms"), where("code", "==", roomCode)).withConverter(roomConverter);
    // }

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
        if (roomCode == null) {
            throw new RoomNotExistError("null roomCode");
        }
        // Currently, support admin having only one room.
        // const docRef = doc(db, "rooms", adminId).withConverter(roomConverter);
        const docRef = this.#_roomRefForRoomCode(roomCode);
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
     * desired tasklistObj. 
     * 
     * If the Room retrieved via the getRoom method has different tasklistObject, numImposters, or 
     * numTasksToDo than is passed in by the corresponding parameters, it is the responsibility 
     * of the caller to discover and rectify the discrepancies.
     * 
     * Upon recieving a `RoomNotExistError`, the method will attempt to create a room using 
     * `this.create(...)`. The Room returned by this method will have the tasklistObj
     * 
     * This method handles all Errors thrown by `getRoom()` and `createRoom()`. This method will
     * rethrow the following two errors:
     * - InvalidNumberOfImposters
     * - InvalidNumberOfTasksToDo
     * 
     * @param {String} adminId The unique identifier provided by firebase
     * @param {Object} tasklistObj the tasks to be associated with this gameplay room.
     * @param {Number} numImposters The number of characters who will be imposters
     * @param {Number} numTasksToDo The number of tasks each Crewmate is required 
     *                              to complete to win the game
     * @returns A Room object corresponding to the adminId
     */
    static async getOrCreateRoom(roomCode, adminId, tasklistObj, numImposters, numTasksToDo) {
        let room = null;
        try {
            console.log('getOrCreateRoom: getting room: ' + roomCode);
            room = await Room.getRoom(roomCode);
        } catch (error) {
            if (error instanceof RoomNotExistError) {
                console.log(`Room with code ${roomCode} does not exist`);
                room = await Room.createRoom(adminId, tasklistObj, numImposters, numTasksToDo);
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
     * @param {TaskList} tasklistObj Admin defined tasks all playerIds who join room will receive
     * @param {Number} numImposters Admin defined number of imposters who "kill" Crewmates
     * @param {Number} numTasksToDo Admin defined number of tasks each Crewmate must complete for game to be won
     * @returns The room object instance that called the method
     */
    async updateRoom(tasklistObj, numImposters, numTasksToDo) {
        if (JSON.stringify(this.getTaskList()) !== JSON.stringify(tasklistObj)  ||
            this.getNumImposters() !== numImposters                             ||
            this.getNumTasksToDo() !== numTasksToDo) 
        {
            const docRef = Room.#_roomRefForRoomCode(this.getRoomCode());
            this.setTaskList(tasklistObj);
            this.setNumImposters(numImposters);
            this.setNumTasksToDo(numTasksToDo);
            await updateDoc(docRef, {
                tasklist: tasklistObj,
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
    static async deleteRoom(room) {
        // remove all playerIds from room

        // then delete this instance of room from the databse

        // optional: return boolean indicating success
    }

    /**
     * Add a player to a rooms `playerIds` list and update firestore to reflect a
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
            if (room.getPlayers().includes(playerId)) {
                console.log("Player " + playerId + " already in room " + roomCode);
                return room;
            }
            
            // update the room retrieved from the database
            room.addPlayer(playerId);

            // update database
            const roomDocRef = this.#_roomRefForRoomCode(room.getRoomCode());
            await updateDoc(roomDocRef, {
                players: arrayUnion(playerId)
            });
            console.log("performed array union");
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
        // remove a player from an instance of a room
    }

}


/**
 * Firestore converter used to convert:
 *      * a Room object to a firestore document in the room collection
 *      * a room collection document to a Room object
 */
const roomConverter = {
    toFirestore: (room) => {
        return {
            staus: room.getStatus().enumKey,
            id: room.getRoomId(),
            adminId: room.getAdminId(),
            code: room.getRoomCode(),
            createdAt: serverTimestamp(),
            taskListName: room.getTaskList().name,
            tasklist: room.getTaskList().tasks,
            numImposters: room.getNumImposters(),
            numTasksToDo: room.getNumTasksToDo(),
            playerIds: room.getPlayerIds(),
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        const tasklistObj = {
            name: data.taskListName,
            tasks: data.tasklist
        }
        let room = new Room(data.id, data.adminId, data.code, data.createdAt, tasklistObj, data.numImposters, data.numTasksToDo);
        room.setPlayerIds(data.playerIds);
        // console.log(`fromFirestore: data.status: ${data.status}`);
        room.setStatus(RoomStatus.enumValueOf(data.status));
        // console.log(`fromFirestore: room.getStatus(): ${room.getStatus()}`);
        // console.log(`fromFirestore: room.getNumImposters(): ${room.getNumImposters()}`);
        return room;
    }
};
