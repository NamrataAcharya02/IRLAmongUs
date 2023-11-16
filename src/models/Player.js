export class Player {
    #id;
    #name;
    #status;
    #numVotesRecieved;
    #voteToCast;

    // TODO: gain consensus on the following vars
    #roomCode;
    #taskList; // how to associate tasklist with player

    joinRoom(roomCode) {}

    callMeeting() {}

    changeName(newName) {}
}