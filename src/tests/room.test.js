import { 
    getDoc,
    onSnapshot,
    setDoc,
    updateDoc,
    serverTimestamp,
    documentId,
    query
} from "firebase/firestore";

import { DocRefMock, DocSnapMock } from "./mocks";

import { Room, roomConverter } from "../models/Room";

import { RoomStatus } from "../models/enum";

import { RoomNotExistError } from "../errors/roomError";

const roomData = {
    id: '1234',
    adminId: 'snapData.adminId',
    code: '1234',
    createdAt: 'snapData.createdAt',
    tasklist: ['task 1', 'task 2', 'task 3', 'task 4', 'task 5', 'task 6'],
    numImposters: 1,
    numTasksToDo: 5,
    playerIds: ['pid1', 'pid2', 'pid3'],
    numTasksComplete: 1,
    status: 'inProgress',
}

const goodDocRef_noConverter = new DocRefMock(roomData);
const goodDocRef = new DocRefMock(roomData).withConverter(roomConverter);
const goodDocSnap = new DocSnapMock(goodDocRef, {size: 1});

// const badRef_noConverter = new DocRefMock()
const badDocRef = new DocRefMock({}).withConverter(roomConverter);
const badDocSnap = new DocSnapMock(badDocRef, {size: 0});

jest.mock('firebase/firestore', () => ({
    __esModule: true,
    ...jest.requireActual('firebase/firestore'), // use actual implementation for other functions
    // getDoc: jest.fn(() => Promise.resolve(goodDocSnap)),
    getDoc: jest.fn(() => Promise.resolve({})),
    onSnapshot: jest.fn(() => true),
    updateDoc: jest.fn(),
    setDoc: jest.fn(),
    serverTimestamp: jest.fn(),
    query: jest.fn()

}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Room.getRoom()', () => {
    test('getDoc with converter', async () => {
        getDoc.mockResolvedValue(goodDocSnap);

        let result = (await getDoc('1234')).data();
        console.log(`result.getRoomCode(): ${result.getRoomCode()}`);
    })

    test('Room.getRoom("1234")', async () => {
        getDoc.mockResolvedValue(goodDocSnap);
        let spyOnExists = jest.spyOn(goodDocSnap, 'exists');

        await Room.getRoom("1234");

        expect(getDoc).toHaveBeenCalled();

        expect(spyOnExists).toHaveBeenCalled();

    })

    test('Room.getRoom("1234") throws RoomNotExistError', async () => {
        getDoc.mockResolvedValue(badDocSnap);

        expect(async () => await Room.getRoom('1234')).rejects.toThrow(RoomNotExistError);
    })

    test('update room.updateNumTasksComplete', async () => {
        let r = new Room(roomData.id, roomData.adminId, roomData.code, roomData.createdAt, roomData.tasklist, roomData.numImposters, roomData.numTasksToDo);
        r.setPlayerIds(roomData.playerIds);
        r.setNumTasksComplete(roomData.numTasksComplete);
        r.setStatus(RoomStatus.enumValueOf(roomData.status));

        r.updateNumTasksComplete(1); // room init with 1, expecting value to be 2
        console.log(r);
        console.log(`r.getNumTasksComplete(): ${r.getNumTasksComplete()}`);

        expect(updateDoc).toHaveBeenCalled();
        expect(r.getNumTasksComplete()).toBe(2);
    })

    test('what happens when Room.createRoom(...) is called', async () => {
        getDoc.mockResolvedValue(badDocSnap);
        const room = await Room.createRoom(
            roomData.id,
            roomData.adminId,
            roomData.tasklist,
            roomData.numImposters,
            roomData.numTasksToDo
        );

        expect(getDoc).toHaveBeenCalled(); // sanity check
        expect(setDoc).toHaveBeenCalled();

        expect(room.getStatus().enumKey).toBe("new");
        expect(room.getRoomId()).toBe(roomData.id);
        expect(room.getAdminId()).toBe(roomData.adminId);
        expect(room.getRoomCode()).toBe(roomData.id);
        expect(room.getCreatedAt()).toBe(null);
        expect(room.getTaskList()).toBe(roomData.tasklist);
        expect(room.getNumImposters()).toBe(roomData.numImposters);
        expect(room.getNumTasksToDo()).toBe(roomData.numTasksToDo);
        expect(room.getNumTasksComplete()).toBe(0);
        expect(room.getPlayerIds()).toStrictEqual([]);
    })

    test('null roomCode provided', async () => {
        fail('un-implemented');
    })

    test('empty roomCode provided', async () => {
        fail('un-implemented');
    })

    test('more than one room', async () => {
        fail('un-implemented');
    })

    test('dockSnap room does not exist', async () => {
        fail('un-implemented');
    })


})

describe('Room.createRoom(...)', () => {
    test('doc that exists throws a DuplicateRoomCodeError', async () => {
        fail('un-implemented');
    })

    test('a room is created with new status when a doc does not exist', async () => {
        fail('un-implemented');
    })
})

describe('Room.getOrCreateRoom()', () => {
    test('create room because room does not exist', async () => {
        fail('un-implemented');
    })

    test('more than one room found error re-thrown', async () => {
        fail('un-implemented');
    })

    test('room object was created from scratch', async () => {
        fail('un-implemented');
    })

    test('room object was converted from firestore doc', async () => {
        fail('un-implemented');
    })
})

describe('Room.joinRoom()', () => {
    test('adding player that already exists in room', async () => {
        fail('un-implemented');
    })

    test('update doc with a new player id', async () => {
        fail('un-implemented');
    })
    
    test('join room returns a room object', async () => {
        fail('un-implemented');
    })
})

describe('Room.leaveRoom()', () => {
    test('error thrown when invalid roomcode provided', () => {
        fail('un-implemented');
    })

    test('player removed from a room', () => {
        fail('un-implemented');
    })
})

describe('Room core getters and setters', () => { 
    test('addCallback success', () => {
        fail('un-implemented');
    })
 })

describe('Room Status sets and updates', () => {
    test('update with wrong type of status attempted', async () => {
        fail('un-implemented');
    })

    test('update with correct status type', async () => {
        fail('un-implemented');
    })

    test('setStatus with wrong type of status attempted', async () => {
        fail('un-implemented');
    })

    test('setStatus with correct type of status attempted', async () => {
        fail('un-implemented');
    })
})

describe('Room num tasks accessessors', () => { 
    test('addNumTasksComplete prevents non Number from being added', async () => {
        fail('un-implemented');
    })
    
    test('addNumTasksComplete incrememnts the classes number of tasks complete by num', async () => {
        fail('un-implemented');
    })
    
    test('setNumTasksComplete updates the caller model', async () => {
        fail('un-implemented');
    })
})

describe('Room addPlayer', () => {
    test('adding a player that already exists', async () => {
        fail('un-implemented');
    })

    test('adding a new player to the players list', async () => {
        fail('un-implemented');
    })
})

describe('Room addCallback', () => { 
    test('adding callback to a room object', () => {
        fail('un-implemented');
    })

    test('a function that calls callback and succeeds', () => {
        fail('un-implemented');
    })
 })
