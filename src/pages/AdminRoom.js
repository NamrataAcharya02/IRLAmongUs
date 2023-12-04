import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Room } from "../models/Room";

function AdminRoom() {
  const [room, setRoom] = useState(null);
  const [playerList, setPlayerList] = useState([
    {id: 0, name: 'Namrata', imposter:false, dead:false, numCompletedTasks: 5},
    {id: 1, name: 'Karen', imposter:false, dead:true, numCompletedTasks: 100}, 
    {id: 2, name: 'Richard', imposter:false, dead:false, numCompletedTasks: 5},
    {id: 3, name: 'Victora', imposter:true, dead:false, numCompletedTasks: 0},
    {id: 4, name: 'Jacob', imposter:false, dead:true, numCompletedTasks: 5},
    {id: 5, name: 'Hongkun', imposter:false, dead:true, numCompletedTasks: 5}
  ]);
  const [roomState, setRoomState] = useState("inGame");

  function callMeeting (){
    setRoomState("meetingCalled");
    console.log("AH");
  }

  function openVoting(){
    setRoomState("votingScreen");
  }

  function endMeeting(){
    setRoomState("inGame");
  }

  function markDead(id){
    const updatedPlayers = playerList.map((player) =>{
      if(player.id === id){
        const updatedPlayer = {
          ...player,
          dead:true,
        };
        return updatedPlayer;
      }
      return player;
    })
    setPlayerList(updatedPlayers);
  }

  function kickPlayer(id){
    const updatedPlayers = playerList.filter((player) => player.id !== id);
    setPlayerList(updatedPlayers);
  }

  useEffect(() => {
    (async function () {
      try {
        const retrievedRoom = await Room.getRoom("1966");
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