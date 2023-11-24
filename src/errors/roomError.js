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

export class DuplicateRoomCodeError extends Error {
    constructor(message) {
        super(message);
        this.name = "DuplicateRoomCodeError";
    }
}

export class InvalidRoomCodeError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidRoomCodeError";
    }
}

// TODO: Yank these into a tasklistError.js file once it has been created
export class InvalidNumberOfImposters extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidNumberOfImposters";
    }
}

export class InvalidNumberOfTasksToDo extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidNumberOfTasksToDo";
    }
}