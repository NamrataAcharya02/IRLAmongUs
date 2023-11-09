export class RoomNotExistError extends Error {
    constructor (message) {
        super(message);
        this.name = "RoomNotExistError";
    }
}

export class MoreThanOneRoomError extends Error {
    constructor(message) {
        super(message);
        this.name = "MoreThanOneRoomError";
    }
}