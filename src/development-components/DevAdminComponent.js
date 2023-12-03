import React, { useState, useEffect, useRef } from 'react';

import { Room } from '../models/Room';
//import { Player } from '../models/Player';

import { cleanupDbCollectionDocs } from '../models/utils';

//import { faker } from '@faker-js/faker';
// const { faker } = require('@faker-js/faker');

function DevRoomComponent () {
    const [room, setR] = useState(null);
    // const [players, setPlayers] = useState([]);

    const ALLOWED_ROOM_IDS = ["1966", "30000000"];

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

    const removeExtraRooms = async () =>{
        await cleanupDbCollectionDocs("rooms", ALLOWED_ROOM_IDS);
    }

    const removeExtraPlayers = async () => {
        const ALLOWED_PLAYER_IDS = ["uFGFRXaazkboMFqBfu55", "yPbU9xfKUXvQ3OYiN23Z"];
       // await cleanupDbCollectionDocs("players", ALLOWED_PLAYER_IDS);
    }

    // const createPlayerAndJoinRoom = async () => {
    //     try {
    //         console.log("creating player");
    //         const name = faker.person.firstName();
    //         const player = new Player(name, "1966");
            
    //         await player.createPlayer();
    //         await player.joinRoom();
            
    //         setPlayers([...players, player]);
            
    //         console.log("created player: " + player.getName());
    //         players.map((p) => {console.log(p.getName())});
    //     } catch (e) {
    //         console.log("DevRoomComponent.createPlayerAndJoinRoom catch (e): " + e);
    //     }
    // }

    const removePlayersFromRoom = async () => {
        const PLAYERS_TO_KEEP_IN_ROOM = ["yPbU9xfKUXvQ3OYiN23Z"];
        console.log(room.getPlayerIds());
        const roomId = room.getRoomCode();
        
        for (const pid of room.getPlayerIds()) {
            await Room.leaveRoom(roomId, pid);
            console.log("removed " + pid + " from room " + roomId);
        }
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
        <button onClick={removeExtraPlayers}>Remove Players</button>
        
        {/* <button onClick={createPlayerAndJoinRoom}>Create Player and Join Room</button> */}

        <button onClick={removePlayersFromRoom}>Remove Players from Room</button>
        </div>
        <p>End Test DevRoomComponent </p>
    </div>);
}

export default DevRoomComponent;