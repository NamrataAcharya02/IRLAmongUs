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

    /**
     * Creates a new Player.
     *@constructor
     * @param {string} id - The ID of the player.
     * @param {string} name - The name of the player.
     * @param {string} status - The status of the player.
     * @param {number} numVotesReceived - The number of votes received by the player.
     * @param {string} voteToCast - The vote to cast by the player.
     * @param {string} roomCode - The room code of the player.
     * @param {Array} taskList - The task list of the player.
     * @param {boolean} isImposter - Whether the player is an imposter or not.
     * @param {boolean} calledMeeting - Whether the player has called a meeting or not.
     * @param {number} numTasksCompleted - The number of tasks completed by the player.
     */
    constructor(id, name, status, numVotesReceived, 
        voteToCast, roomCode, taskList, isImposter, 
        calledMeeting, numTasksCompleted) {
        this.#id = id;
        this.#name = name;
        this.#status = status;
        this.#numVotesReceived = numVotesReceived;
        this.#voteToCast = voteToCast;
        this.#roomCode = roomCode;
        this.#taskList = taskList;
        this.#isImposter = isImposter;
        this.#calledMeeting = calledMeeting;
        this.#numTasksCompleted = numTasksCompleted;

        this.#callback = null;

        this.#addDocSnapshotListener();
    }

    /**
     * Adds a callback function for the player.
     *
     * @param {Function} callback - The callback function to be added.
     */
    addCallback(callback) {
        console.log("player adding callback");
        this.#callback = callback;
    }

    /**
     * Sets the player's ID.
     *
     * @param {string} id - The new ID of the player.
     */
    playerID(id){this.#id = id;}
    /**
     * Sets the player's status.
     *
     * @param {string} status - The new status of the player.
     */
    playerStatus(status){this.#status = status;}
    /**
     * Sets the number of votes received by the player.
     *
     * @param {number} votes - The new number of votes received by the player.
     */
    playerNumVotesReceived(votes){this.#numVotesReceived = votes;}
    /**
     * Sets the vote to cast by the player.
     *
     * @param {string} status - The new vote to cast by the player.
     */
    playerVoteToCast(status){this.#voteToCast = status;}
    /**
     * Sets the task list of the player.
     *
     * @param {Array} taskList - The new task list of the player.
     */
    playerTaskList(taskList){this.#taskList = taskList;}
    /**
     * Sets whether the player is an imposter or not.
     *
     * @param {boolean} status - Whether the player is an imposter or not.
     */
    playerIsImposter(status){this.#isImposter = status;}
    /**
     * Sets whether the player has called a meeting or not.
     *
     * @param {boolean} status - Whether the player has called a meeting or not.
     */
    playerCalledMeeting(status){this.#calledMeeting = status;}
    /**
     * Sets the number of tasks completed by the player.
     *
     * @param {number} num - The new number of tasks completed by the player.
     */
    playerNumTasksCompleted(num){this.#numTasksCompleted = num;}

    /**
     * Updates the player's state from a snapshot.
     *@function updateFromSnapshot
     * @param {Object} snapshot - The snapshot from which to update the player's state.
     */
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
        this.#numTasksCompleted = snapData.numTasksCompleted;
        if (this.#callback != null) {
            console.log("running callback for player");
            this.#callback();
        }
        console.log("finished");
    }

    /**
     * @function addDocSnapshotListener
     * Adds a document snapshot listener for the player.
     * The listener updates the player's state from the snapshot whenever the document changes.
     */
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

    /**
     * Retrieves a player from the database.
     *@function getPlayer
     * @param {string} playerId - The ID of the player to retrieve.
     * @returns {Promise<Object>} The player data if it exists, or false otherwise.
     */
    static async getPlayer(playerId){
        const playerRef = doc(db, 'players', playerId).withConverter(playerConverter);
        const docSnap = await getDoc(playerRef);
        if(docSnap.exists())
        {   
            console.log(docSnap.data());
            return docSnap.data();
        }

        return false;

    }

    //creates a player in the players collection
    /**
     * Creates a new player in the database.
     *@function createPlayer
     * @param {string} playerId - The ID of the player to create.
     * @param {string} name - The name of the player to create.
     * @param {string} roomCode - The room code of the player to create.
     * @returns {Promise<Object>} The created player data.
     */
    static async createPlayer(name, playerId, roomCode) {
        // const playerRef = doc(collection(db, "players"), playerId).withConverter(playerConverter);
        const playerRef = doc(db, "players", playerId).withConverter(playerConverter);
        
        // debugger;
        const player = new Player(playerId, name, "alive", 0, false, roomCode, [], false, false, 0);

        await setDoc(playerRef, player);

        // return this.getPlayer(playerRef);
        return player;
        

    }

    //deletes a player from the players collection
    /**
     * Deletes the current player from the database.
     *@function deletePlayer
     * @returns {Promise<void>} Resolves when the player is successfully deleted.
     */
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
    /**
     * Sets the imposter status of the player.
     *@function setImposterStatus
     * @param {boolean} status - The new imposter status of the player.
     * @returns {Promise<void>} Resolves when the imposter status is successfully updated.
     */
    async setImposterStatus(status){
        const playerRef = doc(db, "players", this.#id);
        try{
            await updateDoc(playerRef, { isImposter: status });
            this.#isImposter = status;
        } catch (error) {
            console.error('Error', error);            
        }
    }

    /**
     * Retrieves the imposter status of the player.
     *@function getImposterStatus
     * @returns {string} The imposter status of the player.
     */
    getImposterStatus() {
        return this.#isImposter;
    }

    /**
     * Sets the ID of the player.
     *@function setId
     * @param {string} idCode - The new ID of the player.
     * @returns {Promise<void>} Resolves when the ID is successfully updated.
     */
    async setId(idCode) {
        const playerRef = doc(db, "players", this.#id);
        try{
            await updateDoc(playerRef, { id: idCode });
            this.#id = idCode;
        } catch (error) {
            console.error('Error', error);            
        }
    }

    /**
     * Retrieves the ID of the player.
     *@function getId
     * @returns {string} The ID of the player.
     */
    getId(){
        return this.#id;
    }

    //changes name for player
    /**
     * Sets the name of the player.
     *@function setName
     * @param {string} newName - The new name of the player.
     * @returns {Promise<void>} Resolves when the name is successfully updated.
     */
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
    /**
     * Retrieves the name of the player.
     *@function getName
     * @returns {string} The name of the player.
     */
    getName() {
        return this.#name;
    }

    //sets calledMeeting to true
    /**
     * Sets the meeting call status of the player.
     *@function setCallMeetingStatus
     * @param {boolean} status - The new meeting call status of the player.
     * @returns {Promise<void>} Resolves when the meeting call status is successfully updated.
     */
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
    /**
     * Retrieves the meeting call status of the player.
     *@function getMeetingStatus
     * @returns {boolean} The meeting call status of the player.
     */
    getMeetingStatus() {
        return this.#calledMeeting;
    }

    //sets the room code for player
    /**
     * Sets the room code for the player.
     *@function setRoomCode
     * @param {string} newRoomCode - The new room code for the player.
     * @returns {Promise<void>} Resolves when the room code is successfully updated.
     */
    async setRoomCode(newRoomCode) {
        const playerRef = doc(db, 'players', this.#id);
        try {
            await updateDoc(playerRef, {roomCode: newRoomCode});
            this.#roomCode = newRoomCode;
        } catch (error) {
            console.error('Error', error);
        }
    }

    //gets the room code for player, returns roomCode
    /**
     * Retrieves the room code of the player.
     *@function getRoomCode 
     * @returns {string} The room code of the player.
     */
    getRoomCode() {
        return this.#roomCode;
    }

    //sets player status to dead
    /**
     * Sets the alive status of the player.
     *@function setAliveStatus
     * @param {boolean} status - The new alive status of the player.
     * @returns {Promise<void>} Resolves when the alive status is successfully updated.
     */
    async setAliveStatus(status) {
        const playerRef = doc(db, 'players', this.#id);
        try {
            await updateDoc(playerRef, {status: status});
            this.#status = status;
        } catch (error) {
            console.error('Error', error);
        }
    }

    //returns player status
    /**
     * Retrieves the alive status of the player.
     *@function getStatus
     * @returns {boolean} The alive status of the player.
     */
    getStatus() {
        return this.#status;
    }

    //set the number of votes the player received in meeting
    /**
     * Sets the number of votes the player received in a meeting.
     *@function setVotesReceived
     * @param {number} votes - The number of votes the player received.
     * @returns {Promise<void>} Resolves when the number of votes is successfully updated.
     */
    async setVotesReceived(votes) {
        const playerRef = doc(db, 'players', this.#id);
        try {
            await updateDoc(playerRef, {numVotesReceived: votes});
            this.#numVotesReceived = votes;
        } catch (error) {
            console.error('Error', error);
        }
    }

    //get the number of votes the player received in meeting
    /**
     * Retrieves the number of votes the player received in a meeting.
     *@function getVotesReceived
     * @returns {number} The number of votes the player received.
     */
    getVotesReceived() {
        return this.#numVotesReceived;
    }

    //sets player to be voted out, voteToCast set to true
    /**
     * Sets the vote out status of the player.
    * @function setVoteOut
     * @param {boolean} status - The new vote out status of the player.
     * @returns {Promise<void>} Resolves when the vote out status is successfully updated.
     */
    async setVoteOut(status) {
        const playerRef = doc(db, 'players', this.#id);
        try {
            await updateDoc(playerRef, {voteToCast: status});
            this.#voteToCast = status;
        } catch (error) {
            console.error('Error', error);
        }
    }

    //returns vote status, true means player has been voted out
    /**
     * Retrieves the vote status of the player.
     * @function getVoteStatus
     * @returns {boolean} The vote status of the player. True means the player has been voted out.
     */
    getVoteStatus() {
        return this.#voteToCast;
    }

    //sets the players task list
    /**
     * Sets the task list of the player.
     * @function setTaskList
     * @param {Array} taskList - The new task list of the player.
     * @returns {Promise<void>} Resolves when the task list is successfully updated.
     */
    async setTaskList(taskList) {
        const playerRef = doc(db, 'players', this.#id);
        try {
            await updateDoc(playerRef, {taskList: taskList});
            this.#taskList = taskList;
        } catch (error) {
            console.error('Error', error);
        }
    }

    /**
     * Retrieves the task list of the player.
     * @function getTaskList
     * @returns {Array} The task list of the player.
     */
    getTaskList() {
        return this.#taskList;
    }

    /**
     * Retrieves the number of tasks completed by the player.
     * @function getNumTasksCompleted
     * @returns {number} The number of tasks completed by the player.
     */
    getNumTasksCompleted(){
        return this.#numTasksCompleted;
    }

    /**
     * Sets the number of tasks completed by the player.
     * @function setNumTasksCompleted
     * @param {number} numTasks - The new number of tasks completed by the player.
     * @returns {Promise<void>} Resolves when the number of tasks completed is successfully updated.
     */
    async setNumTasksCompleted(numTasksCompleted) {
        const playerRef = doc(db, 'players', this.#id);
        try {
            await updateDoc(playerRef, {numTasksCompleted: numTasksCompleted});
            this.#numTasksCompleted = numTasksCompleted;
        } catch (error) {
            console.error('Error', error);
        }
    }

    /**
 * Marks a specific task as completed for the player.
 *  @function setTaskComplete
    * @param {string} taskId - The ID of the task to be marked as completed.
    * @returns {Promise<void>} Resolves when the task is successfully marked as completed.
    */
    async setTaskComplete(description)
    {
        let i = 0;
        for(i = 0; i < this.#taskList.length; i++)
        {
            if(description == this.#taskList[i])
            {
                this.#numTasksCompleted++;
                this.#taskList.splice(i, 1);
            }
        }

        this.setNumTasksCompleted(this.#numTasksCompleted);
        this.setTaskList(this.#taskList);

    }

}

/**
 * Firestore converter for Player objects. This allows for easy serialization and deserialization
 * of Player objects when storing and retrieving from Firestore.
 * @function playerConverter
 * @type {Object}
 * @property {function(Player): Object} toFirestore - Converts a Player object into a plain JavaScript object for storage in Firestore.
 * @property {function(firebase.firestore.DocumentSnapshot, firebase.firestore.SnapshotOptions): Player} fromFirestore - Converts a Firestore document snapshot into a Player object.
 */
export const playerConverter = {
    toFirestore: (player) => {
        return {
            id: player.getId(),
            name: player.getName(),
            status: player.getStatus(),
            numVotesReceived: player.getVotesReceived(),
            voteToCast: player.getVoteStatus(),
            roomCode: player.getRoomCode(),
            taskList: player.getTaskList(), 
            isImposter: player.getImposterStatus(),
            calledMeeting: player.getMeetingStatus(),
            numTasksCompleted: player.getNumTasksCompleted()
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        let player = new Player(data.id, data.name, data.status, data.numVotesReceived, 
            data.voteToCast, data.roomCode, data.taskList, data.isImposter, 
            data.calledMeeting, data.numTasksCompleted );

        return player;
    }
};

