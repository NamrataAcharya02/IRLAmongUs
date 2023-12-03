import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Room } from "../models/Room";
import {auth, googleAuthProvider} from "../firebase";
import AdminGameController from "../controllers/AdminGameController";
function AdminRoom() {
  const [room, setRoom] = useState(null);
  console.log("AdminRoom(): room: " + room);
  const [players, setPlayers] = useState([]);

  //const forceUpdate = React.useReducer(() => ({}))[1];
  const [_, forceUpdate] = React.useReducer((x) => x + 1, 0);
  let adminId = auth.currentUser.uid; // dummy for testing
  let controller = new AdminGameController(adminId, forceUpdate);

  useEffect(() => {
    (async function () {
      

      let roomCode = await controller.getRoomCode();
      let adminObject = await controller.getAdmin();
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
        const retrievedRoom = await AdminGameController.getRoomObject(roomCode);
        console.log(retrievedRoom);
        retrievedRoom.addCallback(forceUpdate)

        setRoom(retrievedRoom);
        setPlayers(retrievedRoom.getPlayerIds());

        console.log("AdminRoom(): retrievedRoom: " + retrievedRoom.getRoomCode());
        console.log("AdminRoom(): retrievedRoom: " + retrievedRoom.getRoomCode() + " adminId: " + retrievedRoom.getAdminId() + " tasklist: " + retrievedRoom.getTaskList());
      } catch (error) {
        console.error(error);
        setRoom(null);
      }
    })();
  }, []); //      


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
      {room ? (room.getPlayerIds()?.map((playerId) => (<p>{playerId}</p>))): ('no players')}
    </div>
  );
}

export default AdminRoom;