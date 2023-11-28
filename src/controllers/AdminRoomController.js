import RoomController from "./RoomController";

export default class AdminRoomController extends RoomController {
    admin;

    constructor() {
        super();
    }

    calculateMinMaxImposters() {}
    calculateMinMaxTasksToComplete() {}
    #determinePlayerRoles() {}
    #assignPlayerRoles() {}

    setGameParameters(paramsDict) {}
    startGame() {}
    displayGameCode() {}
    endGame() {}
    startVoting(){}
    getVotingProgress() {}
    endVoting() {}
    getVotingResults() {}
    finalizeVotingResults() {}
    kickOutPlayer(playerId) {}
    endMeeting() {}
}