import RoomController from "./RoomController";

export default class PlayerRoomController extends RoomController {
    player;

    constructor() {
        super();
    }

    joinRoom() {}
    leaveRoom() {}
    callMeeting() {}
    markSelfDead() {}
    markTaskComplete(taskId) {}
    castVote(playerId) {}
    getVisibleTasks() {}
}