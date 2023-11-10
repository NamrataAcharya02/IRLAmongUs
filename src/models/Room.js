/************************************************************
 * Room.js
 * 
 * Below is a snippit that can be used in a react element
 ************************************************************
  
  import {Room} from "../models/Room";
  
  let room = null;
  const tasklistObj = {
    name: "frontend set task list",
    tasks: {
        0: "frontend_set_task1",
        1: "frontend_set_task2",
        2: "frontend_set_task3",
    }
  }

  useEffect(() => {
    (async function () {
      let adminId = "30000000";     // Dummy for dev purposes
      try {
        room = await Room.getOrCreateRoom(adminId, tasklistObj);
        console.log(room);
      } catch (error) { 
        console.log(error); 
        room = null;
      }
    })();
  }, []);
 */

import { collection, query, where, 
    getDocs, setDoc, doc, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase";
import { RoomNotExistError, MoreThanOneRoomError } from "../errors/roomError";

export class Room {
    constructor(id, adminId, code, createdAt, tasklistObj) { 
        this.id = id;
        this.adminId = adminId;
        this.code = code;
        this.createdAt = createdAt;
        this.tasklistObj = tasklistObj;
    }

    static async createRoom(adminId, tasklistObj) {
        
        const roomCode = this._generateRoomCode(4)
        console.log("createRoom: " + roomCode);

        const roomsRef = doc(collection(db, "rooms")).withConverter(roomConverter);
        await setDoc(roomsRef, new Room(null, adminId, roomCode, null, tasklistObj));

        return this.getRoom(adminId);
    }

    static _generateRoomCode(length) {
        let result = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static async getRoom(adminId) {
        const q = query(collection(db, "rooms"), where("adminId", "==", adminId)).withConverter(roomConverter);
        
        const querySnapshot = await getDocs(q);
    
        // Currently, support admin having only one room.
        if (querySnapshot.size > 1) {
            throw new MoreThanOneRoomError("More than one roome exists for adminID " + adminId);
        } else if (querySnapshot.empty) {
            throw new RoomNotExistError("No room for adminId: " + adminId);
        }
    
        const room = querySnapshot.docs.map((doc) => doc.data())[0];
        // console.log('room: ' + room.constructor.name);
        return room;
    }

    static async getOrCreateRoom(adminId, tasklistObj) {
        let room = null;
        try {
            room = await this.getRoom(adminId);
            // console.log("getOrCreateRoom.getRoom(adminID).roomCode: " + room.code);
        } catch (error) {
            if (error instanceof RoomNotExistError) {
                room = await this.createRoom(adminId, tasklistObj);
                // console.log("getOrCreateRoom.createRoom(adminID).roomCode: " + room.code);
            } else if (error instanceof MoreThanOneRoomError) {
                throw error;
            } else {
                console.log("error" + error);
            }
        }
        return room;
    }

    static async deleteRoom(code) {
        // remove all players from room

        // then delete this instance of room from the databse

        // optional: return boolean indicating success
    }

    static async joinRoom(code, playerId) {
        // add player to room
    }

    static async leaveRoom(code, playerId) {
        // remove a player from an instance of a room
    }

    setTasklist(tasklistObj){
        this.tasklistObj = tasklistObj;
    }
}

const roomConverter = {
    toFirestore: (room) => {
        return {
            adminId: room.adminId,
            code: room.code,
            createdAt: serverTimestamp(),
            taskListName: room.tasklistObj.name,
            tasklist: room.tasklistObj.tasks
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        const tasklistObj = {
            name: data.taskListName,
            tasks: data.tasklist
        }
        return new Room(data.id, data.adminId, data.code, data.createdAt, tasklistObj);
    }
};
