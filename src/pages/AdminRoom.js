import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Room } from "../models/Room";

function AdminRoom() {
  const [room, setRoom] = useState(null);

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