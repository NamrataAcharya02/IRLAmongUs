import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Room } from "../models/Room";
import {auth, googleAuthProvider} from "../firebase";
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminGameController from "../controllers/AdminGameController";
import {RoomStatus} from "../models/enum";

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
  console.log("AdminRoom(): room: " + room);
  const [players, setPlayers] = useState([]);
  const [gameScreen, setGameScreen] = useState(false);
  const [numImposters, setNumImposters] = useState(1);
  const [numTasksToDo, setNumTasksToDo] = useState(4);
  const [numPlayers, setNumPlayers] = useState(6);
  const [numTasksInFullList, setNumTasksInFullList] = useState(10);
  const [endGame, setEndGame] = useState(false);
  const [currentComplete, setComplete] = useState(0);
  const [toComplete, setToComplete] = useState(20);


//  let currentCompleteRef = useRef(0);
  //let toCompleteRef = useRef(20);
  const navigate = useNavigate();

  //const forceUpdate = React.useReducer(() => ({}))[1];
  const [_, forceUpdate] = React.useReducer((x) => x + 1, 0);
  let adminId = auth.currentUser.uid; // dummy for testing
  let controller = useRef(new AdminGameController(adminId, forceUpdate));

  const [roomState, setRoomState] = useState("inGame");

  async function callMeeting (){
    setRoomState("meetingCalled");
    await controller.current.updateRoomStatus(RoomStatus.emergencyMeeting);
    console.log("AH");
  }

  async function openVoting(){
    await controller.current.updateRoomStatus(RoomStatus.voting);
    setRoomState("votingScreen");
  }

  async function endMeeting(){
    await controller.current.updateRoomStatus(RoomStatus.inProgress);

    setRoomState("inGame");
  }

  async function markDead(id){
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
    await controller.current.markDead(id);
  }

  function kickPlayer(id){
    const updatedPlayers = playerList.filter((player) => player.id !== id);
    setPlayerList(updatedPlayers);
    controller.current.kickOutPlayer(id);
  }

  async function endGamefunction(){
    await controller.current.endGame();
    //navigate("/");
  }
  
  //Use to toggle to in game screen
  //Can also simply use 
  //      setGameScreen(true);
  //To go into in game screen
  async function toggleGameScreen(){
    setGameScreen(!gameScreen);
    console.log("controller.current" + controller.current.getRoomObject(), controller.current.getNumImposters());
    await controller.current.startGame(numImposters, numTasksToDo);
    setPlayers(controller.current.getPlayers());
    setToComplete(controller.current.threshold);
    setComplete(controller.current.getTotalNumberTasksCompleted());
  }

  useEffect(() => {
    (async function () {
      

      let roomCode = await controller.current.getRoomCode();
     // let adminObject = await controller.getAdmin();
      try {
        const retrievedRoom = await controller.current.getRoomDB(roomCode);
        console.log(retrievedRoom);
        console.log("abey saale");
        console.log("controller" + controller.current.getRoomObject());

        retrievedRoom.addCallback(forceUpdate)

        setRoom(retrievedRoom);


        setPlayers(controller.current.getPlayers());
        setToComplete(controller.current.threshold);
        setComplete(controller.current.getTotalNumberTasksCompleted());
        console.log("updated players", players);
        controller.current.setNumImposters(5);
        console.log(controller.current.checkEndGame());
       // console.log(controller.current.getRoomCode());
        console.log("endgame" + endGame);
        if (controller.current.checkEndGame() && !endGame){
          setEndGame(true);
        }

        console.log("AdminRoom(): retrievedRoom: " + retrievedRoom.getRoomCode());
        console.log("AdminRoom(): retrievedRoom: " + retrievedRoom.getRoomCode() + " adminId: " + retrievedRoom.getAdminId() + " tasklist: " + retrievedRoom.getTaskList());
      } catch (error) {
        console.error(error);
        setRoom(null);
      }
    })();
  }, []); // 
  
  useEffect(() => {
    (async function () {
      try {
        //re rendered: check if task threshold has reached. if yes, end game
        console.log(controller.current.checkEndGame());
       // console.log(controller.current.getRoomCode());
        console.log("endgame" + endGame);
        if (controller.current.checkEndGame() && !endGame){
          setEndGame(true);
        }
        setToComplete(controller.current.threshold);
        setComplete(controller.current.getTotalNumberTasksCompleted());
      
      } catch (error) {
       
      }
    })();
  }, []); // 
  
  


  return (
    <div className="center">
      {/* Waiting room screen */}
      {!gameScreen && (
        <div>
          <Link to="/">
            <button className="back">Back</button>
          </Link>
          {room ? (
            <h1>Room Code {room.getRoomCode()}</h1>
            
          ) : (
            <p>No room found for the admin.</p>
          )}
          <p>Number of Imposters: {numImposters}</p>
          <div className="slider-parent">
            <input type="range" min="1" max={numPlayers / 3} step="1" value={numImposters} onChange={(e) => setNumImposters(e.target.value)} />
          </div>
          <p>Number of Tasks per Player: {numTasksToDo}</p>
          <div className="slider-parent">
            <input type="range" min="1" max={numTasksInFullList} step="1" value={numTasksToDo} onChange={(e) => setNumTasksToDo(e.target.value)} />
          </div>
          {room ? (room.getPlayerIds()?.map((playerId) => (<p>{playerId}</p>))): ('no players')}
          <button onClick={toggleGameScreen}>Start Game</button>
        </div>
      )}
      {/* In Game Screen */}
      {gameScreen && (
        <div>
          <h1>In game</h1>
          <progress value={controller.current.getTotalNumberTasksCompleted()} max={controller.current.threshold}></progress>

          {controller.current.threshold}
          {controller.current.getTotalNumberTasksCompleted()}

          {room ? (room.getPlayerIds()?.map((playerId) => (<p>{playerId}</p>))): ('no players')}
          {controller.current.getPlayers().map((player) => (<p>{player.getName()} {player.getNumTasksCompleted()
          } {player.getStatus()} Imposter? {player.getImposterStatus()}</p>))}
          <div className="text-in-box">
                  <ul className="centered-lists">
                    {controller.current.getPlayers().map((player) => (
                      <div className="player">
                          <h2 className="whiteh2">{player.getName()}</h2>
                          <p>Role: {player.getImposterStatus()? "Imposter" : "Crewmate"}</p>
                          <p>Status: {player.getStatus() == "dead" ? "Dead" : "Alive"}</p>
                          {!player.getImposterStatus() && (<p>Number of Tasks Completed: {player.getNumTasksCompleted()}</p>)}
                          {!(player.getStatus == "dead") && (<button className="playerButton" onClick={() => markDead(player.getId())}>Mark Dead</button>)}
                          <button className="kickPlayer" onClick={() => kickPlayer(player.getId())}>Kick Player</button>
                      </div>
          ))}
        </ul>
      </div>
        </div>
        
      )}

       {/* In end */}
       {controller.current.checkEndGame() && (
        <div>
          <h1>ENDED</h1>
          <h2>{controller.current.impostersWin? "Imposters won" : "Crewmates won"}</h2>
          
        </div>
      )}




      {(roomState == "inGame") && (
        <button onClick={callMeeting}>Call Emergency Meeting</button>
      )}
      {(roomState == "meetingCalled") && (
        <button onClick={openVoting}>Open Voting Screen</button>
      )}
      {(roomState == "votingScreen") && (
        <button onClick={endMeeting}>End Emergency Meeting</button>
      )}
        <button onClick={endGamefunction}>End Game</button>
      
      
    </div>
  );
}

export default AdminRoom;