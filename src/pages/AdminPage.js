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
import AdminHowTo from "../components/AdminHowTo.js";
import { useRef } from 'react';

let room = null;

//let controller = null;

const AdminPage = () => {
  
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  //const [controller, setController] = useState(null);
  let controller = useRef(new AdminGameController(auth.currentUser.uid, forceUpdate));
  const [tasklist, setTasklist] = useState([]) //object that stores tasklist
  const [listName, setListName] = useState("") //name of tasklist
  let list = [];
  var tasklistObject = null;
  const navigate = useNavigate();
  //console.log(tasklist)
  

  //don't exceed number of tasks
  const hasEmptyTask = tasklist.some((singleTask, index) => {
    if (singleTask.description == "") {
      return true;
    }
    return false;
  });

  /**
   * async function checkUser created:
   * Checks if the user is logged into Firebase when the page opens.
   * If the user is not logged in, navigate to the login page or another appropriate route.
   * 
   * Calls checkUser when component is mounted.
   * 
   * @async
   * @function checkUser
   */
  useEffect(() => {
    // Check if the user is logged into Firebase when the page opens
    const checkUser = async () => {
      const user = auth.currentUser;

      if (!user) {
        // If the user is not logged in, navigate to the login page or another appropriate route
        navigate("/");
      } else {
        if (controller == null) {
         // setController(new AdminGameController(auth.currentUser.uid, forceUpdate));


        }
      }
    };

    // Call the checkUser function when the component mounts
    checkUser();
  });

  /**
   * Gets or creates Admin object, then initializes TaskList object.
   * @async
   * @function
   */
  useEffect(() => {
    (async function () {
      try {
        if (tasklist == null || tasklist.length == 0) {
          console.log("getting admin", auth.currentUser.uid)
        let admin  = await Admin.getOrCreateAdmin(auth.currentUser.uid, ['task']);
        console.log("got admin", admin)
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


  /** 
   * handles adding a task, adds an extra input field and new task object to tasklist 
   * 
  */
  const handleAddTask = () => {
    if(!hasEmptyTask){
      setTasklist((prevTasklist) => [...prevTasklist, new Task("")]);
    }
  }
  /**
   * handles deleting a task
   * @param {int} index 
   */
  const deleteItem = (index) => {
    const updatedTasklist = [...tasklist];
    updatedTasklist.splice(index, 1);
    setTasklist(updatedTasklist);
  }

  /**
   * handles task name change in textbox. Updates task object as changes are being made
   * @param {any} e
   * @param {int} index
  */
  const handleTaskChange = (e, index) => {
    const { name, value } = e.target
    console.log("name", name, "val", value)
    const list = [...tasklist];
    //list[index].updateTask(value);
    list[index] = value;
    console.log(list)
    setTasklist(list)

  }

  /**
   * Handles saving the tasklist (incomplete)
   * This creates a new tasklist object and prints it to console.
   * Calls controller from AdminGameController to save the TaskList.
   * 
   * @async
   * @function handleSaveTasklist
   */
  const handleSaveTasklist = async () => {
    const list = [...tasklist];
    /*const tasklistObj = new TaskList(listName, list);
    tasklistObject = tasklistObj;
    let admin = await Admin.getAdmin(auth.currentUser.uid);
    console.log(admin)*/

    //let controller = new AdminGameController(auth.currentUser.uid, null, null);
    controller.current.saveTasklist(list);
    
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


  /**
   * Function to create a Room, uses authentication to verify user id.
   * Initializes TaskList object.
   * Navigates to the page rendering the created Room.
   * 
   * @async
   * @function startRoom
   */
  const startRoom = async () => {  
    console.log("Current user", auth.currentUser.uid);
    let list = [...tasklist];
    try {
      //let adminId = auth.currentUser.uid; // Dummy for dev purposes
      //let controller = new AdminGameController(adminId);
     // controller.setNumImposters(numImposters);
      //controller.setNumTasksToComplete(numTasksToDo);
      //controller.saveTasklist(list);

      let newroom = await controller.current.startRoom(numImposters, numTasksToDo);
      //let roomCode = AdminGameController.generateRoomCode(4);
      //let newroom = await Room.getOrCreateRoom(roomCode, adminId, list, numImposters, numTasksToDo);
      //await controller.setRoomCode(roomCode);

      setRoom(newroom);
      console.log(newroom);
      navigate("/room");
    } catch (error) {
      console.error(error);
      setRoom(null);
    }


      /*let roomCode = '1234';
      const newRoom = await Room.getOrCreateRoom(
        adminId,
        roomCode,
        adminId,
        tasklistObj,
        numImposters,
        numTasksToDo
      );
      await newRoom.updateRoom(tasklistObject, numImposters, numTasksToDo);
      setRoom(newRoom);
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

      {/* "How to Play" pop-up overlay for Players */}
      <AdminHowTo></AdminHowTo>

      {/* TaskList:: */}

      <div className="text-in-box">
        <input className="tasklist-title" placeholder="Name of Task List" value={listName} onChange={(e) => setListName(e.target.value)} />
        <div className="space-divider"></div>
        {tasklist.map((singleTask, index) => (
          <div className='task-container' key={index}>
            <input className="task" required type="text" placeholder="Task Description" value={singleTask} name="task" onChange={(e) => (handleTaskChange(e, index))} />
            <button className="delete-x" onClick={() => deleteItem(index)}>&#10006;</button>
            {/* {index == tasklist.length - 1}             */}
          </div>

        ))


        }
        <div>
          <button onClick={handleAddTask} > Add Task </button>
          <button onClick={handleSaveTasklist}> Save List</button>
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