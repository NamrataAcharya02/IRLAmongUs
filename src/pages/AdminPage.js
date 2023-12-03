// The landing page for an admin
// Admin may modify lists, customize a game, and start a room

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Room } from "../models/Room";
import { Task, TaskList } from "../models/TaskList.js";
import background from "../images/stars-background.jpg";
import { useNavigate } from 'react-router-dom';
import {auth} from "../firebase.js";
import Collapsible from "react-collapsible";

let room = null;

const AdminPage = () => {
  const [data, setData] = useState(0);
  const [tasklist, setTasklist] = useState([]) //object that stores tasklist
  const [listName, setListName] = useState("") //name of tasklist
  const [isHelpScreen, setHelpScreen] = useState(false); //how to play overlay
  const navigate = useNavigate();
  console.log(tasklist)
  
  //function for toggling emergency screen to use (can also directly set emergency screen)
  const toggleHelpScreen = () => {
    setHelpScreen(!isHelpScreen);
  };

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
    try {
      let adminId = "30000000"; // Dummy for dev purposes
      let roomCode = '1234';
      const newRoom = await Room.getOrCreateRoom(       
        roomCode,
        adminId,
        tasklistObj,
        numImposters,
        numTasksToDo
      );
      await newRoom.updateRoom(tasklistObj, numImposters, numTasksToDo);
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
      {isHelpScreen && (
                <div className="overlay-help">
                    <h1>HOW TO PLAY</h1>
                    <div className="center">
                        <div className="help-in-box">
                            {/* Close "How to Play" pop-up */}
                            <button className="back" onClick={toggleHelpScreen}>Close</button>
                            {/* Crewmate How to Play */}
                            <h2 className="whiteh2">Admin</h2>
                            <ol className="helpList">
                                <li>
                                    Create tasks!
                                </li>
                                <li>
                                    Setting up Gameplay!
                                </li>
                                <li>
                                    Facilitate Gameplay!
                                </li>
                            </ol>
                            {/* Collapsible Sections for How to Play */}
                            {/* Gameplay Loop Section */}
                            <Collapsible trigger="How the game works">
                              <ol className="helpList">
                                <li>
                                  To start your own game of IRL Among Us, start by creating a task list. 
                                  Refer to the "Tasks" section on how to create tasks.
                                </li>
                                <li>
                                  Refer to the "Setting Up Gameplay" section for gameplay settings and preparing
                                  players for how to play the game.
                                </li>
                                <li>
                                  Then, click “Start a Room”.
                                </li>
                                <li>
                                  You will be met with a page that displays a room code. 
                                  Players can join your room by entering the Room Code in “Join a Room”.
                                </li>
                                <li>
                                  Once all players have joined, start the game.
                                </li>
                                <li>
                                  During the game, players may ask the Admin (you) to start an emergency meeting. 
                                  You can call an emergency meeting by clicking the “Emergency Meeting” button.
                                </li>
                                <li>
                                  Players discuss their findings and who they believe is the Imposter in emergency meetings. 
                                  The meeting ends after all players cast their votes on who they think is the Imposter.
                                </li>
                                <li>
                                  Killed players should attend emergency meetings but they cannot communicate.
                                </li>
                                <li>
                                  You may end the game at any time for any reason by clicking the “End Game” button.
                                </li>
                                <li>
                                  The game ends when one of these win conditions are satisfied:
                                  <ul>
                                    <li>The task target completion goal has been met (Crewmate win).</li>
                                    <li>All Imposters have been voted out (Crewmate win).</li>
                                    <li>The number of Imposters alive is the same as the number of Crewmates alive (Imposter win).</li>
                                  </ul>
                                </li>
                              </ol>
                            </Collapsible>
                            {/* Tasks Section */}
                            <Collapsible trigger="Creating Tasks">
                              <ol className="helpList">
                                <li>
                                  You will be making a list of tasks for your players to complete! 
                                  The tasks will be done in real life by your players.
                                </li>
                                <li>
                                  When you start a game, (not to be confused with start a room,) 
                                  the tasks you create will be randomized and given out to your players.
                                </li>
                                <li>
                                  Setting up Tasks: Create 4 difficult tasks and 10 easy tasks.
                                </li>
                                <li>
                                  Task examples:
                                  <ul>
                                    <li>The task target completion goal has been met (Crewmate win).</li>
                                    <li>All Imposters have been voted out (Crewmate win).</li>
                                    <li>The number of Imposters alive is the same as the number of Crewmates alive (Imposter win).</li>
                                  </ul>
                                </li>
                              </ol>
                            </Collapsible>
                            {/* Setting Up Gameplay Section */}
                            <Collapsible trigger="Setting Up Gameplay">
                              <ol className="helpList">
                                <li>
                                  Depending on the number of players, the number of Imposters should be adjusted. 
                                  A good guideline is for every 4 players, add one Imposter. 
                                  For example: if you have 10 players, have 2 Imposters. 
                                  If you have 5 players, have 1 Imposter.
                                </li>
                                <li>
                                  Teach your players how imposters will “kill” crewmates. 
                                  Some examples include a double tap on a shoulder, a tap with a pencil, or a wink.
                                </li>
                                <li>
                                  Teach your players how to act “dead”. Some examples include sitting down on the spot, 
                                  cracking open a glow stick, or raising a hand. 
                                  Don’t forget to remind them that they should mark themselves as “dead”!
                                </li>
                                <li>
                                  At the beginning of a game, it is recommended for all players to close their eyes, 
                                  and then have all the Imposters open their eyes to see who the other Imposters are.
                                </li>
                              </ol>
                            </Collapsible>
                        </div>
                    </div>
                </div>
            )}
            <button className="helpButton" onClick={toggleHelpScreen}>How to Play</button>

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