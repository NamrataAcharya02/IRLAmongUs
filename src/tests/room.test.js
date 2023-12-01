import 'core-js';

import { db, auth } from "../firebase";

import { Room } from "../models/Room";

test('get room has room code', async () => {
    console.debug('before');
    const room = await Room.getRoom('1966');
    console.debug('after');
    expect(room.getRoomCode()).toBe('1966');
})