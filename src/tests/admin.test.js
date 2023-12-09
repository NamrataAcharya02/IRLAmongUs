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

import { Admin, adminConverter } from "../models/Admin";
import AdminController from "../controllers/AdminGameController";
const adminData = {
    adminId: "abc123",
    name: "Test Admin",
    tasklist: [],
    roomCode: 0
    // TODO: Set a default
}

const goodDocRef_noConverter = new DocRefMock(adminData);
const goodDocRef = new DocRefMock(adminData).withConverter(adminConverter);
const goodDocSnap = new DocSnapMock(goodDocRef, {size: 1});

// const badRef_noConverter = new DocRefMock()
const badDocRef = new DocRefMock({}).withConverter(adminConverter);
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
    let func = jest.fn();
    let controller = new AdminController("1234", func);
    

});

describe('Admin.getOrCreateAdmin functionality', () => {
    test('Admin.getOrCreateAdmin() succeeds', async () => {
        getDoc.mockResolvedValue(goodDocSnap);

        // TODO: add the body
        let admin = await Admin.getOrCreateAdmin("1234");

        expect(getDoc).toHaveBeenCalled();
        expect(admin.getAdminId()).toBe("abc123");
        expect(admin.getName()).toBe("Test Admin");
        expect(admin.getTaskList()).toEqual([]);
        expect(admin.getRoomCode()).toBe(0);

    })

    test('Admin.getOrCreateAdmin("1234") fails with [specify condition 1]', async () => {
        getDoc.mockResolvedValue(badDocSnap);

        // code how you expect this function to act
    })
    
    test('Admin.getOrCreateAdmin("1234") fails with [specify condition 2]', async () => {
        getDoc.mockResolvedValue(badDocSnap);


        // code how you expect this function to act
    })
})

describe('Admin.createAdmin() functionality', () => {
    test('createAdmin succeeds', async () => {
        // initialize 
        getDoc.mockResolvedValue(goodDocSnap);
        let admin = await Admin.createAdmin("abc123", []);

        // expect
        expect(setDoc).toHaveBeenCalled();
        expect(admin.getAdminId()).toBe("abc123");
        expect(admin.getName()).toBe("Test Admin");
        expect(admin.getTaskList()).toEqual([]);
        expect(admin.getRoomCode()).toBe(0);
    })

    test('createAdmin fails [specify condition 1]', async () => {
        // initialize

        // expect
    })
    
    test('createAdmin fails [specify condition 2]', async () => {
        // If there is another way to fail, put it here
        // initialize

        // expect
    })
})

describe('Admin.getAdmin()', () => {
    test('getAdmin succeeds', async () => {
        // initialize 
        getDoc.mockResolvedValue(goodDocSnap);

        // expect
        let spyOnExists = jest.spyOn(goodDocSnap, 'exists');

        let admin = await Admin.getAdmin("abc123");

        expect(getDoc).toHaveBeenCalled();
        expect(spyOnExists).toHaveBeenCalled();
        console.log(`result.getId(): ${admin.getAdminId()}`);


    })

    test('getAdmin fails', async () => {
        // initialize
        getDoc.mockResolvedValue(badDocSnap);

        // expect
        let spyOnExists = jest.spyOn(badDocSnap, 'exists');

        let admin = await Admin.getAdmin("invalid");

        expect(getDoc).toHaveBeenCalled();
        expect(spyOnExists).toHaveBeenCalled();
        expect(admin).toBe(false);

    })

    // TODO: other core functionality
})

describe('Admin.updateAdminRoomCode()', () => {
    test('updateAdminRoomCode succeeds', async () => {
        // initialize 
        getDoc.mockResolvedValue(goodDocSnap);
        let admin = new Admin("abc123", "Test Admin", [], 0);
        await admin.updateAdminRoomCode('20');
        // expect
        expect(updateDoc).toHaveBeenCalled();
        expect(admin.getRoomCode()).toBe('20');
    })

    test('updateAdminRoomCode fails', async () => {
        // initialize

        // expect
    })

    // TODO: other core functionality
})

describe('Admin.updateTasklist()', () => {
    test('updateTasklist succeeds', async () => {
       // initialize 
       getDoc.mockResolvedValue(goodDocSnap);
       let admin = new Admin("abc123", "Test Admin", [], 0);
       await admin.updateAdminTasklist(['task1', 'task2', 'task3']);
       // expect
       expect(updateDoc).toHaveBeenCalled();
       expect(admin.getTaskList()).toEqual(['task1', 'task2', 'task3']);
    })

    test('updateTasklist fails', async () => {
        // initialize

        // expect
    })

    // TODO: other core functionality
})