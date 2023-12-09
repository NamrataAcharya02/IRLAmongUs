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

import { Player, playerConverter } from "../models/Player";

const playerData = {
    // TODO: Set a default
    id: "abc123",
    name: "Test Player",
    status: "alive",
    numVotesReceived: 0,
    voteToCast: "",
    roomCode: 0,
    taskList: ['task1', 'task2', 'task3'],
    isImposter: false,
    calledMeeting: false,
    numTasksCompleted: 0
}


const goodDocRef_noConverter = new DocRefMock(playerData);
const goodDocRef = new DocRefMock(playerData).withConverter(playerConverter);
const goodDocSnap = new DocSnapMock(goodDocRef, {size: 1});

// const badRef_noConverter = new DocRefMock()
const badDocRef = new DocRefMock({}).withConverter(playerConverter);
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

test('addCallback to player object', () => {
    // TODO
  //  let func = jest.fn();
   // let player = Player.getPlayer(playerData.id);
   // player.addCallback(func);
});

describe('Player.getPlayer functionality', () => {
    test('Player.getPlayer() succeeds', async () => {
        getDoc.mockResolvedValue(goodDocSnap);

        // TODO: add the body
        let player = await Player.getPlayer("1234");

        expect(getDoc).toHaveBeenCalled();
        expect(player.getId()).toBe('abc123');
    })

    test('Player.getPlayer("1234") fails with [specify condition]', async () => {
        getDoc.mockResolvedValue(badDocSnap);

        // code how you expect this function to act
    })
})

describe('Player.createPlayer()', () => {
    test('createPlayer succeeds', async () => {
        // initialize 
        getDoc.mockResolvedValue(goodDocSnap);

        // expect
        let player = await Player.createPlayer(playerData.name, playerData.id, '5678');
        expect(setDoc).toHaveBeenCalled();
        expect(player.getId()).toBe('abc123');

    })

    test('createPlayer fails [specify condition 1]', async () => {
        // initialize

        // expect
    })
    
    test('createPlayer fails [specify condition 2]', async () => {
        // If there is another way to fail, put it here
        // initialize

        // expect
    })
})

describe('Player primitive operations', () => {
    test('setTasksComplete succeeds', async () => {
        // initialize 
        getDoc.mockResolvedValue(goodDocSnap);
        let player = await Player.createPlayer(playerData.id, playerData.name, '5678');
        await player.setTaskList(playerData.taskList);
        await player.setTaskComplete('task1');

        // expect
        expect(updateDoc).toHaveBeenCalled();
        expect(player.getNumTasksCompleted()).toBe(1);

    })

    test('setTasksComplete fails', async () => {
        // initialize

        // expect
    })
    
    test('setImposterStatus succeeds', async () => {
        // If there is another way to fail, put it here
        // initialize
        getDoc.mockResolvedValue(goodDocSnap);
        let player = await Player.getPlayer(playerData.id);
        await player.setImposterStatus(true);

        // expect
        expect(updateDoc).toHaveBeenCalled();
        expect(player.getImposterStatus()).toBe(true);
    })
    
    test('setImposterStatus fails', async () => {
        // If there is another way to fail, put it here
        // initialize

        // expect
    })
})