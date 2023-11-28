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
//


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

        this.#callback = null;

        this.#addDocSnapshotListener();
    }

    addCallback(callback) {
        console.log("player adding callback");
        this.#callback = callback;
    }

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
            calledMeeting: this.#calledMeeting
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
    async setAsImposter(){
        const playerRef = doc(db, "players", this.#id);
        try{
            await updateDoc(playerRef, { isImposter: true });
            this.#isImposter = true;
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
    async gettImposterStatus() {
        return this.#isImposter;
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
    async callMeeting() {
        const playerRef = doc(db, "players", this.#id);
        try{
            await updateDoc(playerRef, { calledMeeting: true });
            this.#calledMeeting = true;
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
    async setDead() {
        const playerRef = doc(db, 'players', this.id);
        try {
            await updateDoc(playerRef, {status: "dead"});
            this.#status = "dead";
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
    async voteOut() {
        const playerRef = doc(db, 'players', this.id);
        try {
            await updateDoc(playerRef, {voteToCast: true});
            this.#voteToCast = true;
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

}
