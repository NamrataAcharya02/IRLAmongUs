// The landing page for an admin
// Admin may modify lists, customize a game, and start a room

import React, { useState, useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import { Room } from "../models/Room";
import { Task, TaskList } from "../models/TaskList.js";
import {Admin} from "../models/Admin.js";
import background from "../images/stars-background.jpg";
import { useNavigate } from 'react-router-dom';
import DevRoomComponent from "../development-components/DevAdminComponent.js";
import AdminGameController from "../controllers/AdminGameController.js";
import {auth, googleAuthProvider} from "../firebase";

let room = null;

const AdminPage = () => {
  const [data, setData] = useState(0);
  const [tasklist, setTasklist] = useState([]) //object that stores tasklist
  const [listName, setListName] = useState("") //name of tasklist
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  let list = [];
  var tasklistObject = null;
  console.log(tasklist)

  useEffect(() => {
    (async function () {
      try {
        if (tasklist == null || tasklist.length == 0) {
        let admin  = await Admin.getAdmin(auth.currentUser.uid);
        list = admin.getTaskList();
        setTasklist(list);
        forceUpdate();
        }
      //setTasklist(list);

      } catch (error) {
        console.error(error);
      }
      
    })();
  });


  //handle adding a task, adds an extra input field and new task object to tasklist
  const handleAddTask = () => {
    setTasklist([...tasklist, ""]);
  }

  //handle task name change in textbox. Updates task object as changes are being made
  const handleTaskChange = (e, index) => {
    const { name, value } = e.target
    console.log("name", name, "val", value)
    const list = [...tasklist];
    //list[index].updateTask(value);
    list[index] = value;
    console.log(list)
    setTasklist(list)

  }

  //handle saving the tasklist (incomplete)
  //This creates a new tasklist object and prints it to console
  const handleSaveTasklist = async () => {
    const list = [...tasklist];
    /*const tasklistObj = new TaskList(listName, list);
    tasklistObject = tasklistObj;
    let admin = await Admin.getAdmin(auth.currentUser.uid);
    console.log(admin)*/

    let controller = new AdminGameController(auth.currentUser.uid, null, null);
    controller.saveTasklist(tasklist)
    //await admin.updateAdminTasklists(tasklistObj);

    console.log(tasklistObj);
    /*
    let adminId = "60000000";     // Dummy for dev purposes
      try {
        room = await Room.getOrCreateRoom(adminId, data, tasklist );
        console.log(room)
      } catch (error) { 
        console.log(error); 
        room = null;
      } */

    console.log(tasklist)
    //admin.updateAdminTasklists(tasklist);

  }
  //---------------------- Room Creation ----------------------------------------
  const [room, setRoom] = useState(null);
  const navigate = useNavigate();
  // Temporary Task Lists
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



  //Room configurations
  const tasklistObj = taskListObjs[1];
  const numImposters = 1;
  const numTasksToDo = 2;


  //function to create a room
  const startRoom = async () => {
    console.log("Current user", auth.currentUser.uid);
    let list = [...tasklist];
   // try {
      let adminId = auth.currentUser.uid; // Dummy for dev purposes
      let controller = new AdminGameController(adminId, list, numImposters, numTasksToDo);
      let newroom = await controller.startRoom();





      /*let roomCode = '1234';
      const newRoom = await Room.getOrCreateRoom(
        adminId,
        roomCode,
        tasklistObj,
        numImposters,
        numTasksToDo
      );
      await newRoom.updateRoom(tasklistObject, numImposters, numTasksToDo);
      setRoom(newRoom);
      navigate("/room");
    } catch (error) {
      console.error(error);
      setRoom(null);
    } */
  };
  //----------------------- Room Creation ---------------------------------------

  //TODO: Sign out button (refer to skeleton code)
  // function SignOut() {
  //   return auth.currentUser && (
  //     <button onClick={() => auth.signOut()} className='sign-out'>Sign Out</button>
  //   )
  // }
  return (
    <div className="center" style={{ backgroundImage: `url(${background})` }}>
      <Link to="/">
        <button className="back">Back</button>
      </Link>
      <DevRoomComponent></DevRoomComponent>

      {/* TaskList:: */}

      <div className="text-in-box">
        {/*<h2>Task list name:</h2>
        <input value={listName} onChange={(e) => setListName(e.target.value)} />*/}

        <h2>Task list</h2>
        {tasklist.map((singleTask, index) => (
          <div>
            <input className="task" required type="text" placeholder="Task Description" value={singleTask} name="task" onChange={(e) => (handleTaskChange(e, index))} />
            {index == tasklist.length - 1}

          </div>

        ))


        }
        <div>
          <button onClick={handleAddTask} > Add Task </button>
          <button onClick={handleSaveTasklist}> Save List</button>
        </div>
        <h3>Game customizations here</h3>
        {/* <input type="range" min="1" max="100"/> */}
        <p>Here's a slider wow:</p>
        <div className="slider-parent">
          <input className={data > 50 ? 'heigh' : 'less'} type="range" min="0" max="20" step="1" value={data} onChange={(e) => setData(e.target.value)} />
          <p>{data}</p>
        </div>
      </div>
      {/* Game customizations other than task list: */}

      {/* Room Generation: */}
      <button onClick={startRoom}>Start a Room</button>
      
      {/* <h1>Room Code: {room ? room.getRoomCode() : 'N/A'}</h1> */}
    </div>
  );
}
export default AdminPage;