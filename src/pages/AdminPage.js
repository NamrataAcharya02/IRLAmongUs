import React,{useState,useEffect} from "react";
import {Link} from "react-router-dom";

import {Room} from "../models/Room"

const AdminPage = () => {
  const [data,setData]=useState(0);
  
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState(null);
  
  // Wrap async in effect to get db queries.
  useEffect(() => {
    (async function () {
      let adminId = "10000000";     // Dummy for dev purposes
      let room = new Room(adminId); 
      try {
        const roomCode = await room.getRoom(adminId);
        setRoomCode(roomCode);
      } catch (e) { console.log(e); setError(e); }
    })();
  }, []);
  

  return (
    <div className="center">
      <Link to="/">
            <button className="back">Back</button>
        </Link>
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
      <p>Room code + {roomCode}</p>
      <button>Start a Room</button>
    </div>
  );
}
export default AdminPage;