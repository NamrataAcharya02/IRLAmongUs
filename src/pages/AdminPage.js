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

  //handle adding a task, adds an extra input field
  const handleAddTask  = () => {
    setTasklist([...tasklist, new Task("")]);
  }

  /*useEffect(() => {
    (async function () {
      let adminId = "60000000";     // Dummy for dev purposes
      try {
        room = await Room.getOrCreateRoom(adminId);
        console.log(room)
      } catch (error) { 
        console.log(error); 
        room = null;
      }
    })();
  }, []);*/

  //handle task name change in textbox
  const handleTaskChange = (e, index) => {
    const {name, value} = e.target 
    console.log("name", name, "val", value)
    const list = [...tasklist];
    list[index].updateTask(value);
    console.log(list)
    setTasklist(list)

  }

  //handle saving the tasklist (incomplete)
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

  return (
    <div className="center">
      <Link to="/">
            <button className="back">Back</button>
        </Link>

        Task list name: 
        <input value={listName} onChange={(e)=>setListName(e.target.value)} />



        <h2>Task list</h2>
        {tasklist.map((singleTask, index) => (
          <div> 
            <input required type="text" value={singleTask.task} name = "task" onChange= {(e) => (handleTaskChange(e, index))} />
            {index == tasklist.length - 1
            }
           
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
        <h4>not a task 2 Just a placeholding space</h4>
        <h4>not a task 3 I should make my cheatsheet</h4>
        <h3>Game customizations here</h3>
        {/* <input type="range" min="1" max="100"/> */}
      </div>
      <p>A slider that does not do anything (poor slider):</p>
      <div className="slider-parent">
          <input className={data>50?'heigh':'less'} type="range" min="0" max="20" step="1" value={data} onChange={(e)=>setData(e.target.value)} />
          <p>{data}</p>
      </div>
      <button>Start a Room</button>
    </div>
  );
}
export default AdminPage;