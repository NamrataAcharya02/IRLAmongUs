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

const adminData = {
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
});

describe('Admin.getOrCreateAdmin functionality', () => {
    test('Admin.getOrCreateAdmin() succeeds', async () => {
        getDoc.mockResolvedValue(goodDocSnap);

        // TODO: add the body
        await Admin.getOrCreateAdmin("1234");

        expect(getDoc).toHaveBeenCalled();
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

        // expect
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

        // expect
    })

    test('getAdmin fails', async () => {
        // initialize

        // expect
    })

    // TODO: other core functionality
})

describe('Admin.updateAdminRoomCode()', () => {
    test('updateAdminRoomCode succeeds', async () => {
        // initialize 

        // expect
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

        // expect
    })

    test('updateTasklist fails', async () => {
        // initialize

        // expect
    })

    // TODO: other core functionality
})