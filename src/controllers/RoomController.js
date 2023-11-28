import { Room } from "../models/Room";

export default class RoomController {
    room;   // Room object
    user;   // TODO: User object (user would be super to Admin and Player)
    observerCallback;   // "callback" function
    playerIdNameList;    // list of Player objects formed from room
    constructor() {}

    notifyObserver() {
        // run observerCallback
    }

    addObserverCallback(observerCallback) {
        // add observer to Room object
        // add observer to User object
    }

    getActivePlayers() {
        // return a list tuples (playerId, playerName) from playerIdNameList
    }

    callMeeting() {
        // Update room status
    }

    viewRole() {
        // View the Users role (admin, crewmate, imposter)
    }
}