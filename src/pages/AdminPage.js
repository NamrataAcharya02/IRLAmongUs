// The landing page for an admin
// Admin may modify lists, customize a game, and start a room

import React,{useState,useEffect} from "react";
import {Link} from "react-router-dom";  
import {Room} from "../models/Room";
import {Task, TaskList} from "../model/TaskList";

let room = null;

const AdminPage = () => {
  const [data,setData]=useState(0);
  const [tasklist, setTasklist] = useState([]) //object that stores tasklist
  const [listName, setListName] = useState("") //name of tasklist
  console.log(tasklist)

  //handle adding a task, adds an extra input field and new task object to tasklist
  const handleAddTask  = () => {
    setTasklist([...tasklist, new Task("")]);
  }

  //handle task name change in textbox. Updates task object as changes are being made
  const handleTaskChange = (e, index) => {
    const {name, value} = e.target 
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

import TaskList from "../features/TaskList";
import background from "../images/stars-background.jpg";

  const [data,setData]=useState(0);
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
  useEffect(() => {
    (async function () {      
      let adminId = "30000000";     // Dummy for dev purposes
      try {        
        const newRoom = await Room.getOrCreateRoom(adminId, tasklistObj, numImposters, numTasksToDo);
        await newRoom.updateRoom(tasklistObj, numImposters, numTasksToDo);
        setRoom(newRoom);
        // console.log(newRoom);
      } catch (error) { 
        console.log(error); 
        room = null;
      }
    })();
  }, []);

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

        Task list name: 
        <input value={listName} onChange={(e)=>setListName(e.target.value)} />

        <h2>Task list</h2>
        {tasklist.map((singleTask, index) => (
          <div> 
            <input required type="text" value={singleTask.task} name = "task" onChange= {(e) => (handleTaskChange(e, index))} />
            {index == tasklist.length - 1}
           
          </div>

        ))
        
        
        }
        <div>
            <button onClick={handleAddTask} > Add Task </button>
            <button onClick={handleSaveTasklist}> Save List</button>
              </div>

      <div className="text-in-box">
        
        <h3>List here</h3>
        <h4>not a task 1 I'm just a header for good looks</h4>
      </Link>
      {/* TaskList:: */}
      <div className="text-in-box">
        <h3>Create a Task List</h3>
        <TaskList></TaskList>
        {/* <h4>not a task 1 I'm just a header for good looks</h4>
        <h4>not a task 2 Just a placeholding space</h4>
        <h4>not a task 3 I should make my cheatsheet</h4> */}
        <h3>Game customizations here</h3>
        {/* <input type="range" min="1" max="100"/> */}
        <p>Here's a slider wow:</p>
        <div className="slider-parent">
          <input className={data>50?'heigh':'less'} type="range" min="0" max="20" step="1" value={data} onChange={(e)=>setData(e.target.value)} />
          <p>{data}</p>
        </div>
      </div>
      {/* Game customizations other than task list: */}
      
      {/* Room Generation: */}
      <button onClick={()=>{}}>Start a Room</button>
      <h1>Room Code: {room ? room.getRoomCode() : 'N/A'}</h1>
    </div>
  );
}
export default AdminPage;