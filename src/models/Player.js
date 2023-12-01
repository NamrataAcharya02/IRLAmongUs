//
import { 
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc, 
    collection,
    onSnapshot,
    query,
    where,
    arrayUnion,
    serverTimestamp
} from "firebase/firestore";

import { db } from "../firebase";

import Task from "./TaskList";
import TaskList from "./TaskList";

export class Player {
    #id;
    #name;
    #status;
    #numVotesReceived;
    #voteToCast;

    // TODO: gain consensus on the following vars
    #roomCode;
    #taskList; // how to associate tasklist with player
    #isImposter;
    #calledMeeting;
    #numTasksCompleted;

    #callback;

    constructor( name, roomCode) {
        this.#id = "0";
        this.#name = name;
        this.#status = "alive";
        this.#numVotesReceived = 0;
        this.#voteToCast = false;
        this.#roomCode = roomCode;
        this.#taskList = [];
        this.#isImposter = false;
        this.#calledMeeting = false;
        this.#numTasksCompleted = 0;

        this.#callback = null;

        this.#addDocSnapshotListener();
    }

    addCallback(callback) {
        console.log("player adding callback");
        this.#callback = callback;
    }

    playerID(id){this.#id = id;}
    playerStatus(status){this.#status = status;}
    playerNumVotesReceived(votes){this.#numVotesReceived = votes;}
    playerVoteToCast(status){this.#voteToCast = status;}
    playerTaskList(taskList){this.#taskList = taskList;}
    playerIsImposter(status){this.#isImposter = status;}
    playerCalledMeeting(status){this.#calledMeeting = status;}
    playerNumTasksCompleted(num){this.#numTasksCompleted = num;}

    #__updateFromSnapshot(snapData) {
        console.log("updating");
        this.#id = snapData.id;
        this.#name = snapData.name;
        this.#status = snapData.status;
        this.#numVotesReceived = snapData.numVotesReceived;
        this.#voteToCast = snapData.voteToCast;
        this.#roomCode = snapData.roomCode;
        this.#taskList = snapData.taskList;
        this.#isImposter = snapData.isImposter;
        this.#calledMeeting = snapData.calledMeeting;
        if (this.#callback != null) {
            console.log("running callback for player");
            this.#callback();
        }
        console.log("finished");
    }

    #addDocSnapshotListener() {
        const playerRef = doc(db, 'players', this.#id);

        this.unsub = onSnapshot(playerRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                this.#__updateFromSnapshot(docSnapshot.data());
            } else {
                console.log("No player");
            }
        }, (error) => {
            console.error("Error listening to pplayer updates: ", error);
        });
    }

    //creates a player in the players collection
    async createPlayer() {
        const playerRef = doc(collection(db, "players"));
        this.#id = playerRef.id; // Set the player id to the Firestore-generated id
    
        await setDoc(playerRef, {
            id: this.#id,
            name: this.#name,
            status: this.#status,
            numVotesReceived: this.#numVotesReceived,
            voteToCast: this.#voteToCast,
            roomCode: this.#roomCode,
            taskList: this.#taskList,
            isImposter: this.#isImposter,
            calledMeeting: this.#calledMeeting,
            numTasksCompleted: this.#numTasksCompleted
        });
        

    }

    //deletes a player from the players collection
    async deletePlayer() {
        const playerRef = doc(db, 'players', this.#id);
        try {
            await deleteDoc(playerRef);
            console.log('Player document successfully deleted');
        } catch (error) {
            console.error('Error deleting player document:', error);
        }
    }


    //sets player as imposter
    async setImposterStatus(status){
        const playerRef = doc(db, "players", this.#id);
        try{
            await updateDoc(playerRef, { isImposter: status });
            this.#isImposter = status;
        } catch (error) {
            console.error('Error', error);            
        }
    }

    //returns imposter status of isImposter
    //async getImposterStatus() {
      //  const playerRef = doc(db, 'players', this.id);
        //try {
          //  const docSnap = await getDoc(playerRef);
//
  //          if (docSnap.exists()) {
    //            this.#isImposter = docSnap.data().isImposter;
      //          return this.#isImposter;
        //    } else {
          //      console.log('No document');
            //}
        //} catch (error) {
          //  console.error('Error', error);
        //}
    //}
    async getImposterStatus() {
        return this.#isImposter;
    }

    async setId(idCode) {
        const playerRef = doc(db, "players", this.#id);
        try{
            await updateDoc(playerRef, { id: idCode });
            this.#id = idCode;
        } catch (error) {
            console.error('Error', error);            
        }
    }

    async getId(){
        return this.#id;
    }

    //changes name for player
    async setName(newName) {
        const playerRef = doc(db, "players", this.#id);
        try{
            await updateDoc(playerRef, { name: newName });
            this.#name = newName;
        } catch (error) {
            console.error('Error', error);            
        }
    }

    //returns name
    async getName() {
        return this.#name;
    }
    //sets calledMeeting to true
    async setCallMeetingStatus(status) {
        const playerRef = doc(db, "players", this.#id);
        try{
            await updateDoc(playerRef, { calledMeeting: status });
            this.#calledMeeting = status;
        } catch (error) {
            console.error('Error', error);            
        }
    }

    //returns meeting status of player
    async getMeetingStatus() {
        return this.#calledMeeting;
    }

    //sets the room code for player
    async setRoomCode(newRoomCode) {
        const playerRef = doc(db, 'players', this.id);
        try {
            await updateDoc(playerRef, {roomCode: newRoomCode});
            this.#roomCode = newRoomCode;
        } catch (error) {
            console.error('Error', error);
        }
    }

    //gets the room code for player, returns roomCode
    async getRoomCode() {
        return this.#roomCode;
    }

    //sets player status to dead
    async setAliveStatus(status) {
        const playerRef = doc(db, 'players', this.id);
        try {
            await updateDoc(playerRef, {status: status});
            this.#status = status;
        } catch (error) {
            console.error('Error', error);
        }
    }

    //returns player status
    async getStatus() {
        return this.#status;
    }

    //set the number of votes the player received in meeting
    async setVotesReceived(votes) {
        const playerRef = doc(db, 'players', this.id);
        try {
            await updateDoc(playerRef, {numVotesReceived: votes});
            this.#numVotesReceived = votes;
        } catch (error) {
            console.error('Error', error);
        }
    }

    //get the number of votes the player received in meeting
    async getVotesReceived() {
        return this.#numVotesReceived;
    }

    //sets player to be voted out, voteToCast set to true
    async setVoteOut(status) {
        const playerRef = doc(db, 'players', this.id);
        try {
            await updateDoc(playerRef, {voteToCast: status});
            this.#voteToCast = status;
        } catch (error) {
            console.error('Error', error);
        }
    }

    //returns vote status, true means player has been voted out
    async getVoteStatus() {
        return this.#voteToCast;
    }

    //sets the players task list
    async setTaskList(tasks) {
        const playerRef = doc(db, 'players', this.id);
        try {
            await updateDoc(playerRef, {taskList: tasks});
            this.#taskList = tasks;
        } catch (error) {
            console.error('Error', error);
        }
    }

    async getTaskList() {
        return this.#taskList;
    }

    

    async getNumTasksCompleted(){
        return this.#numTasksCompleted;
    }

}

const playerConverter = {
    toFirestore: (player) => {
        return {
            id: player.getName(),
            name: player.getName(),
            status: player.getStatus(),
            numVotesReceived: player.getVotesReceived(),
            voteToCast: player.getVoteStatus(),
            roomCode: player.getRoomCode(),
            taskList: player.getTaskList(), 
            isImposter: player.getImposterStatus(),
            calledMeeting: player.getMeetingStatus(),
            numTasksCompleted: player.getNumTasksCompleted(),
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        let player = new Player(data.name, data.roomCode);
        
        player.playerID(data.id);
        player.playerStatus(data.status);
        player.playerNumVotesReceived(data.numVotesReceived);
        player.playerVoteToCast(data.voteToCast);
        player.playerTaskList(data.taskList);
        player.playerIsImposter(data.isImposter);
        player.playerCalledMeeting(data.calledMeeting);
        player.numTasksCompleted(data.numTasksCompleted);

        return player;
    }
};