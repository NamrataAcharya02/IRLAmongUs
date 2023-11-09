import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../firebase";

import { collection, query, where, getDocs } from "firebase/firestore";

export class Room {
    constructor(adminId) { 
        this.adminId = adminId;
        console.log('adminId ' + adminId + ": typeof " + typeof adminId);
    }

    async createRoom(adminId) {
        // let roomCode = null;
        // try {
        //     // TODO: sort this out
        //     roomCode = await this.getRoom(adminId);
        //     // await this.getRoom(adminId);
        //     console.log("createRoom roomCode: " + roomCode);

        // } catch (e) {
        //     console.log("Error getting document: ", e);
        // }
        
        // if ( !roomCode ) {
        //     roomCode = this._generateRoomCode(4)
        // }
        // console.log("roomCode " + roomCode);

        // //TODO: Save code to database

        // return roomCode;
    }

    _generateRoomCode(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    deleteRoom(code) {
        // remove all players from room
    }

    async getRoom(adminId) {
        const q = query(collection(db, "rooms"), where("adminId", "==", adminId));
        
        const querySnapshot = await getDocs(q);

        // Currently, support admin having only one room.
        if (querySnapshot.size > 1) {
            throw "More than one roome exists for this admin";
        } else if (querySnapshot.empty) {
            throw "No room exists for admin";
        }

        const one_room = querySnapshot.docs.map((doc) => doc.data())[0];

        return one_room.code;
    }

    joinRoom(code, playerId) {
        // add player to room
    }

    leaveRoom(code, playerId) {}
}