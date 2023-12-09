import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Room } from "../models/Room";
import {auth, googleAuthProvider} from "../firebase";
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminGameController from "../controllers/AdminGameController";
import {RoomStatus} from "../models/enum";

/**
 * @function AdminRoom
 * @returns rendered page displaying RoomCode, Players, 
 * Number of Imposters, and Number of Tasks per Player before the game starts.
 * Render changes as RoomState changes. 
 * When in game, list of Players and their Statuses are displayed.
 * When emergency meeting is called, displays voting screen.
 * When the game ends, screen shows which team won.
 */
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

  /**
   * Sets the RoomState to 'meetingCalled'.
   * 
   * @async
   * @function callMeeting
   */
  async function callMeeting (){
    setRoomState("meetingCalled");
    await controller.current.updateRoomStatus(RoomStatus.emergencyMeeting);
    console.log("AH");
  }

   /**
    * Sets RoomState to 'votingScreen
    * 
    * @async
    * @function openVoting
    */
  async function openVoting(){
    await controller.current.updateRoomStatus(RoomStatus.voting);
    setRoomState("votingScreen");
  }

  /**
   * Sets RoomState to 'inGame'
   * 
   * @async
   * @function endMeeting
   */
  async function endMeeting(){
    await controller.current.updateRoomStatus(RoomStatus.inProgress);

    setRoomState("inGame");
  }

  /**
   * If a Player is 'dead', update the Player's status to 'dead'
   * and set the PlayerList with the updated list of Players.
   * 
   * @async
   * @function markDead
   * @param {int} id 
   */
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

  /**
   * Kicks a Player from the PlayerList.
   * 
   * @function kickPlayer
   * @param {int} id 
   */
  function kickPlayer(id){
    const updatedPlayers = playerList.filter((player) => player.id !== id);
    setPlayerList(updatedPlayers);
    controller.current.kickOutPlayer(id);
  }

  /**
   * Calls controller from AdminGameController to end the game.
   * 
   * @async
   * @function endGamefunction
   */
  async function endGamefunction(){
    await controller.current.endGame();
    //navigate("/");
  }
  
  /**
   * Use to toggle to in game screen
   * 
   * @async
   * @function toggleGameScreen
   */
  async function toggleGameScreen(){
    setGameScreen(!gameScreen);
    console.log("controller.current" + controller.current.getRoomObject(), controller.current.getNumImposters());
    await controller.current.startGame(numImposters, numTasksToDo);
    setPlayers(controller.current.getPlayers());
    setToComplete(controller.current.threshold);
    setComplete(controller.current.getTotalNumberTasksCompleted());
  }

  /**
   * Initializes the Room with Admin, RoomCode, database, Players, 
   * the game settings (number of imposters, tasks).
   * 
   * Checks if the game has ended.
   * 
   * @async
   * @function
   */
  useEffect(() => {
    (async function () {
      
      let adminObject = await controller.current.getAdmin();

      let roomCode = await controller.current.getRoomCode();
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
  
  /**
   * Checks if the task threshold has been reached. If yes, end game
   * 
   * @async
   * @function
   */
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