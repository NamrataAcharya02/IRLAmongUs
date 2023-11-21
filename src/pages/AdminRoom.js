import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Room } from "../models/Room";

function AdminRoom() {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    (async function () {
      let adminId = "30000000"; // dummy for testing
      let roomCode = ["3528", "9019", "7654"];
      try {
        const taskListObjs = [{
          name: "frontend set task list",
          tasks: {
              0: "frontend_set_task1",
              1: "frontend_set_task2",
              2: "frontend_set_task3",
          }
        },
        {
          name: "New list",
          tasks: {
              0: "new task 1",
              1: "new task 2",
              2: "new task 3",
          }
        }]
        
        const tasklistObj = taskListObjs[1];
        const numImposters = 1;
        const numTasksToDo = 3;

        // const retrievedRoom = await Room.getRoom(roomCode[0]);
        // const retrievedRoom = await Room.createRoom(adminId, tasklistObj, numImposters, numTasksToDo);
        const retrievedRoom = await Room.getOrCreateRoom(roomCode[2], adminId, tasklistObj, numImposters, numTasksToDo);

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