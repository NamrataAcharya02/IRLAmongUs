import React, { useState, useEffect, useRef } from 'react';

import { Room, removeExtraRooms } from '../models/Room';

function DevRoomComponent () {
    const [room, setR] = useState(null);

    /**
     * pass to the room object to inform when a change in the
     * database has been detected. When called, this method
     * triggers the re-rendering of this react component
     */
    const forceUpdate = React.useReducer(() => ({}))[1];

    const test = async () => {
        try {
            const r = await Room.getRoom("1966");
            r.addCallback(forceUpdate);
            setR(r);
        } catch (e) {
            console.log("DevRoomComponent catch (e): " + e);
        }
    }

    const printRoom = () => {
        console.log(room);
    }

    return (
    <div>
        <p>Test DevRoomComponent </p>
        <button onClick={test}>Test</button>
        <p>{room ? "Room Code: " + room.getRoomCode() : "no room"}</p>
        <p>{room ? "numImposters: " + room.getNumImposters() : "no imposter(s)"}</p>
        <div>
        <button onClick={printRoom}>Print Room</button>
        <button onClick={removeExtraRooms}>Remove Rooms</button>
        </div>
        <p>End Test DevRoomComponent </p>
    </div>);
}

export default DevRoomComponent;