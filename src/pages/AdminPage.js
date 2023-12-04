// The landing page for an admin
// Admin may modify lists, customize a game, and start a room

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Room } from "../models/Room";
import { Task, TaskList } from "../models/TaskList.js";
import background from "../images/stars-background.jpg";
import { useNavigate } from 'react-router-dom';
import {auth} from "../firebase.js";
import AdminHowTo from "../components/AdminHowTo.js";

let room = null;

const AdminPage = () => {
  const [data, setData] = useState(0);
  const [tasklist, setTasklist] = useState([]) //object that stores tasklist
  const [listName, setListName] = useState("") //name of tasklist
  const navigate = useNavigate();
  console.log(tasklist)

  //don't exceed number of tasks
  const hasEmptyTask = tasklist.some((singleTask, index) => {
    if (singleTask.description == "") {
      return true;
    }
    return false;
  });

  useEffect(() => {
    // Check if the user is logged into Firebase when the page opens
    const checkUser = async () => {
      const user = auth.currentUser;

      if (!user) {
        // If the user is not logged in, navigate to the login page or another appropriate route
        navigate("/");
      }
    };

    // Call the checkUser function when the component mounts
    checkUser();
  });

  //handle adding a task, adds an extra input field and new task object to tasklist
  const handleAddTask = () => {
    if(!hasEmptyTask){
      setTasklist((prevTasklist) => [...prevTasklist, new Task("")]);
    }
  }
  
  const deleteItem = (index) => {
    const updatedTasklist = [...tasklist];
    updatedTasklist.splice(index, 1);
    setTasklist(updatedTasklist);
  }

  //handle task name change in textbox. Updates task object as changes are being made
  const handleTaskChange = (e, index) => {
    const { name, value } = e.target
    console.log("name", name, "val", value)
    const list = [...tasklist];
    list[index].updateTask(value);
    console.log(list)
    setTasklist(list)

  }

  //handle saving the tasklist (incomplete)
  //This creates a new tasklist object and prints it to console
  const handleSaveTasklist = async () => {
    const list = [...tasklist]
    const tasklistObj = new TaskList(listName, list)

    console.log(tasklistObj)
    /*
    let adminId = "60000000";     // Dummy for dev purposes
      try {
        room = await Room.getOrCreateRoom(adminId, data, tasklist );
        console.log(room)
      } catch (error) { 
        console.log(error); 
        room = null;
      } */

  }
  //---------------------- Room Creation ----------------------------------------
  const [room, setRoom] = useState(null);


  //function to create a room
  const startRoom = async () => {  
    console.log("Current user", auth.currentUser.uid);
    let list = [...tasklist];
    try {
      const newRoom = await Room.getRoom("1966");
      setRoom(newRoom);
      navigate("/room");
    } catch (error) {
      console.error(error);
      setRoom(null);
    }
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
      {/* "How to Play" pop-up overlay for Players */}
      <AdminHowTo></AdminHowTo>

      {/* TaskList:: */}
      <div className="text-in-box">
        <input className="tasklist-title" placeholder="Name of Task List" value={listName} onChange={(e) => setListName(e.target.value)} />
        <div className="space-divider"></div>
        {tasklist.map((singleTask, index) => (
          <div className='task-container' key={index}>
            <input className="task" required type="text" placeholder="Task Description" value={singleTask.description} name="task" onChange={(e) => (handleTaskChange(e, index))} />
            <button className="delete-x" onClick={() => deleteItem(index)}>&#10006;</button>
            {/* {index == tasklist.length - 1}             */}
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