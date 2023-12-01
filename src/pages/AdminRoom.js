import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Room } from "../models/Room";

function AdminRoom() {
  const [room, setRoom] = useState();

  useEffect(() => {
    (async function () {
      let adminId = "1234"; // dummy for testing
      let roomCode = "30000000";
      try {
        const retrievedRoom = await Room.getRoom(roomCode);

        setRoom(retrievedRoom);

        console.log("AdminRoom(): retrievedRoom: " + retrievedRoom.getRoomCode());
        console.log("AdminRoom(): retrievedRoom: " + retrievedRoom.getRoomCode() + " adminId: " + retrievedRoom.getAdminId() + " tasklist: " + retrievedRoom.getTaskList());
      } catch (error) {
        console.error(error);
        setRoom(null);
      }
    })();
  }, []);

  return (
    <div className="center">
      <Link to="/">
        <button className="back">Back</button>
      </Link>
      {room ? (
        <h1>Room Code {room.getRoomCode()}</h1>
      ) : (
        <p>No room found for the admin.</p>
      )}
    </div>
  );
}

export default AdminRoom;