// The landing page for an admin
// Admin may modify lists, customize a game, and start a room

import React,{useState,useEffect} from "react";
import {Link} from "react-router-dom";
import {Room} from "../models/Room";




const AdminPage = () => {
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
    <div className="center">
      <Link to="/">
            <button className="back">Back</button>
      </Link>
      {/* TaskList:: */}
      <div className="text-in-box">
        <h3>List here</h3>
        <h4>not a task 1 I'm just a header for good looks</h4>
        <h4>not a task 2 Just a placeholding space</h4>
        <h4>not a task 3 I should make my cheatsheet</h4>
        <h3>Game customizations here</h3>
        {/* <input type="range" min="1" max="100"/> */}
      </div>
      {/* Game customizations other than task list: */}
      <p>A slider that does not do anything (poor slider):</p>
      <div className="slider-parent">
          <input className={data>50?'heigh':'less'} type="range" min="0" max="20" step="1" value={data} onChange={(e)=>setData(e.target.value)} />
          <p>{data}</p>
      </div>
      {/* Room Generation: */}
      <button onClick={()=>{}}>Start a Room</button>
      <h1>Room Code: {room ? room.getRoomCode() : 'N/A'}</h1>
    </div>
  );
}
export default AdminPage;