

export class Room {
    constructor(adminId) { 
        this.adminId = adminId;
        console.log('adminId ' + adminId);
    }

    createRoom(adminId) {
        
        let roomCode = this._generateRoomCode(4)
        console.log("roomCode " + roomCode);

        //TODO: Save code to database

        return roomCode;
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

    getRoom(adminId) {
        // TODO: query database for room belonging to admin
        
    }

    joinRoom(code, playerId) {
        // add player to room
    }

    leaveRoom(code, playerId) {}
}