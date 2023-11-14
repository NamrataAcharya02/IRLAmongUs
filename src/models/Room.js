/************************************************************
 * Room.js
 * 
 * Below is a snippit that can be used in a react element
 ************************************************************
  
  import {Room} from "../models/Room";
  
  let room = null;
  const taskListObjs = [{
    name: "frontend set task list",
    tasks: {
        0: "frontend_set_task1",
        1: "frontend_set_task2",
        2: "frontend_set_task3",
    }
  },
  {
    name: "New list",
    tasks: {
        0: "new task 1",
        1: "new task 2",
        2: "new task 3",
    }
  }]
  
  const tasklistObj = taskListObjs[1];
  const numImposters = 1;
  const numTasksToDo = 2;

  useEffect(() => {
    (async function () {
      let adminId = "30000000";     // Dummy for dev purposes
      try {
        room = await Room.getOrCreateRoom(adminId, tasklistObj, numImposters, numTasksToDo);
        await room.updateRoom(tasklistObj, numImposters, numTasksToDo)
        console.log(room);
      } catch (error) { 
        console.log(error); 
        room = null;
      }
    })();
  }, []); // end useEffect()
 */

import { 
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc, 
} from "firebase/firestore";

import { db } from "../firebase";
import { RoomNotExistError, MoreThanOneRoomError } from "../errors/roomError";

/**
 * Configuration settings for Room.
 * 
 * TODO: Would be good to yank these out into some config file.
 */
const ROOM_CODE_LENGTH = 4;
const ROOM_CODE_CHARACTER_SET = '0123456789';
const ROOM_CODE_CHARACTER_SET_LENGTH = ROOM_CODE_CHARACTER_SET.length;

export class Room {
    #id;
    #adminId;
    #code;
    #createdAt;
    #tasklistObj;
    #numImposters;
    #numTasksToDo;
    constructor(id, adminId, code, createdAt, tasklistObj, numImposters, numTasksToDo) { 
        this.#id = id;
        this.#adminId = adminId;
        this.#code = code;
        this.#createdAt = createdAt;
        this.#tasklistObj = tasklistObj;
        this.#numImposters = numImposters;
        this.#numTasksToDo = numTasksToDo;
    }

    getRoomId() { return this.#id; }
    getAdminId() { return this.#adminId; }
    getRoomCode() { return this.#code; }
    getCreatedAt() { return this.#createdAt; }
    getTaskList() { return this.#tasklistObj; }
    getNumImposters() { return this.#numImposters; }
    getNumTasksToDo() { return this.#numTasksToDo; }
    setRoomId(id) { this.#id = id; }
    setAdminId(adminId) { this.#adminId = adminId; }
    setRoomCode(code) { this.#code = code; }
    setCreatedAt(createdAt) { this.#createdAt = createdAt; }
    setTaskList(tasklistObj) { this.#tasklistObj = tasklistObj; }
    setNumImposters(numImposters) { this.#numImposters = numImposters; }
    setNumTasksToDo(numTasksToDo) { this.#numTasksToDo = numTasksToDo; }

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
        if (typeof this.createRoom.created == 'undefined') {
            this.createRoom.created = false;
        }

        if (!this.createRoom.created) {
            this.createRoom.created = true;
            // TODO: make sure roomCode doesn't exist in the database. Upon successfully
            // generating a code, it should immediately add it to the database so it will
            // not conflict with some other room being created.
            const roomCode = this.#_generateRoomCode(ROOM_CODE_LENGTH);
            console.log("createRoom: " + roomCode);

            // TODO: validate numImposters to be greater than zero, and less than XX??

            // TODO: validate numTasksToDo to be greater than zero, and less than tasklistObj.tasks.length

            // const docRef = doc(db, "rooms", adminId).withConverter(roomConverter);
            const docRef = this.#_roomRefForAdmin(adminId);
            await setDoc(docRef, new Room(adminId, adminId, roomCode, null, tasklistObj, numImposters, numTasksToDo));
            
            return this.getRoom(adminId);
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

    static #_roomRefForAdmin(adminId) {
        return doc(db, "rooms", adminId).withConverter(roomConverter);
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
    static async getRoom(adminId) {
        // Currently, support admin having only one room.
        // const docRef = doc(db, "rooms", adminId).withConverter(roomConverter);
        const docRef = this.#_roomRefForAdmin(adminId);
        const docSnap = await getDoc(docRef);
        if (docSnap.size > 1) {
            throw new MoreThanOneRoomError("More than one roome exists for adminID " + adminId + ". Contact system adminstrator for help.");
        } else if (docSnap.empty) {
            throw new RoomNotExistError("No room for adminId: " + adminId);
        } else if (!docSnap.exists()) {
            throw new RoomNotExistError("No room for adminId: " + adminId);
        }
    
        const room = docSnap.data();

        console.log('room: ' + room.constructor.name);
        return room;
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
    static async getOrCreateRoom(adminId, tasklistObj, numImposters, numTasksToDo) {
        let room = null;
        try {
            room = await Room.getRoom(adminId);
        } catch (error) {
            if (error instanceof RoomNotExistError) {
                room = this.createRoom(adminId, tasklistObj, numImposters, numTasksToDo);
            } else if (error instanceof MoreThanOneRoomError) {
                throw error;
            } else {
                console.log("error" + error);
            }
        }
        return room;
    }

    /**
     * TODO:
     * @param {tasklistObj} tasklistObj 
     */
    updateTaskList(tasklistObj) {}

    async updateRoom(tasklistObj, numImposters, numTasksToDo) {
        if (JSON.stringify(this.getTaskList()) !== JSON.stringify(tasklistObj)  ||
            this.getNumImposters() !== numImposters                             ||
            this.getNumTasksToDo() !== numTasksToDo) 
        {
            const docRef = Room.#_roomRefForAdmin(this.getAdminId());
            this.setTaskList(tasklistObj);
            this.setNumImposters(numImposters);
            this.setNumTasksToDo(numTasksToDo);
            await updateDoc(docRef, {
                tasklist: tasklistObj,
                numImposters: numImposters,
                numTasksToDo: numTasksToDo
            });
            console.log("successfully updated room document " + this.getRoomId());
        }
    }

    /**
     * TODO:
     * @param {*} code 
     */
    static async deleteRoom(code) {
        // remove all players from room

        // then delete this instance of room from the databse

        // optional: return boolean indicating success
    }

    /**
     * TODO: 
     * @param {*} code 
     * @param {*} playerId 
     */
    static async joinRoom(code, playerId) {
        // add player to room
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
            id: room.getRoomId(),
            adminId: room.getAdminId(),
            code: room.getRoomCode(),
            createdAt: serverTimestamp(),
            taskListName: room.getTaskList().name,
            tasklist: room.getTaskList().tasks,
            numImposters: room.getNumImposters(),
            numTasksToDo: room.getNumTasksToDo()
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        const tasklistObj = {
            name: data.taskListName,
            tasks: data.tasklist
        }
        return new Room(data.id, data.adminId, data.code, data.createdAt, tasklistObj, data.numImposters, data.numTasksToDo);
    }
};
