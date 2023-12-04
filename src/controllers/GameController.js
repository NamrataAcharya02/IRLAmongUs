// import { Admin } from "../models/Admin";
import { Room } from "../models/Room";

import { RoomStatus } from "../models/enum";

export default class GameController {
    room;   // Room object
    // user;   // TODO: User object (user would be super to Admin and Player)
    listener;   // "callback" function
    playerIdNameList;    // list of Player objects formed from room
    constructor(room, listener) {
        this.room = room;
        // this.user = user;
        this.listener = listener;
    }

    notifyObserver() {
        // TODO: do we need this??
        // run listener
    }

    addObserverCallback(listener) {
        // add observer to Room object
        this.room.addObserverCallback(listener);

        // add observer to User object
    }

    getActivePlayers() {
        // return a list tuples (playerId, playerName) from playerIdNameList
    }

    callMeeting(roomStatus) {
        // Update room status
        this.room.setStatus(roomStatus);
    }

    // viewRole() {
    //     // View the Users role (admin, crewmate, imposter)
    // }
}