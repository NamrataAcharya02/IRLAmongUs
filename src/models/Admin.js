import { db } from "../firebase";
import { 
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc, 
} from "firebase/firestore";



export class Admin {
    adminId;
    name;
    tasklist;
    roomCode = 0;


    /** 
     * @constructor
     * @param {string} adminId - The id of the admin
     * @param {string} name - The name of the admin
     * @param {TaskList} tasklist - The tasklist of the admin
     * @param {string} roomCode - The room code of the admin
     * 
    */
    constructor(adminId, name, tasklist, roomCode) {
        this.adminId = adminId;
        this.name = name;
        this.tasklist = tasklist;
        this.roomCode = roomCode;
    }

    /**This function gets the admin id
     * @function getAdminId
     * @returns {string} - The admin id
     * */
    getAdminId() {
        return this.adminId;
    }

    /**This function gets the tasklist
     * @function getTaskList
     * @returns {string[]} - The tasklist
     * */
    getTaskList() {
        return this.tasklist;
    }

    /**This function gets the name
     * @function getName
     * @returns {string} - The name
     * */
    getName() { 
        return this.name;
    }

    /**This function sets the room code
     * @function setRoomCode
     * @param {string} roomCode - The room code
     * */
    setRoomCode(roomCode) {
        this.roomCode = roomCode;
    }

    /**This function gets the room code
     * @function getRoomCode
     * @returns {string} - The room code
     * */
    getRoomCode() { 
        return this.roomCode;
    }

    /**This function gets the admin document from the database and returns an admin object
     * initialised with the data from the document
     * @function getAdmin
     * @async
     * @param {string} adminId - The id of the admin
     * @returns {Admin} - The admin object
     * 
     * 
        */
    static async getAdmin(adminId) {
        const docRef = doc(db, "admins", adminId).withConverter(adminConverter);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            console.log("adminId: " + docSnap.data().getAdminId());
            return docSnap.data();
        }
        return false;
    }

    /**This function creates an admin document in the database and returns an admin object
     * initialised with the data from the document
     * @function createAdmin
     * @async
     * @param {string} adminId - The id of the admin
     * @param {string[]} taskLists - The tasklist of the admin
     * @returns {Admin} - The admin object
     * 
     * 
     * */
    static async createAdmin(adminId, taskLists) {
        const docRef = doc(db, "admins", adminId).withConverter(adminConverter);
        //const docRef = doc(db, "admins", adminId);
       /* const admindoc = {
            adminId: adminId,
            name: "ABCD",
            taskLists: taskLists,
        } */
        console.log(taskLists)
       // await setDoc(docRef, admindoc);
        await setDoc(docRef, new Admin(adminId, "ABCD", taskLists, 0));

        console.log("Admin created");
        return this.getAdmin(adminId);

    }

    /**This function gets the admin document from the database and returns an admin object
     * initialised with the data from the document. If the admin document does not exist,
     * it creates an admin document in the database and returns an admin object
     * initialised with the data from the document
     * @function getOrCreateAdmin
     * @async
     * @param {string} adminId - The id of the admin
     * @param {string[]} taskLists - The tasklist of the admin
     * @returns {Admin} - The admin object
     * 
     *  
     * */
    static async getOrCreateAdmin(adminId, taskLists) {
        let admin = null;
        admin = await this.getAdmin(adminId);
        if (admin) {
            console.log("admin exists");
        }
        else {
            console.log('creating admin')
            admin = await this.createAdmin(adminId, taskLists);
        }
        /*try {
            room = await Room.getRoom(adminId);
        } catch (error) {
            if (error instanceof RoomNotExistError) {
                room = Room.createRoom(adminId, tasklistObj, numImposters, numTasksToDo);
            } else if (error instanceof MoreThanOneRoomError) {
                throw error;
            } else {
                console.log("error" + error);
            }
        }
        return room;*/
        return admin;
    }

    /**This function updates the admin document in the database.  
     * It sets the object's tasklist and returns the admin object
     * @function updateAdmin
     * @async
     * @param {string} adminId - The id of the admin
     * @param {string[]} taskLists - The tasklist to be updated with
     * @returns {Admin} - The admin object
     * */
    async updateAdminTasklist(tasklist) { 
        //double check
        
        const docRef = doc(db, "admins", this.getAdminId()).withConverter(adminConverter);
        //let taskLists = this.getTaskList();
        //console.log(taskLists)

        //taskLists.push(tasklist);
        //console.log(taskLists)

        await updateDoc(docRef, {
            tasklist: tasklist,
        });
        
        console.log("Admin updated");
        return this;
    }

    /**This function updates the admin document in the database.
     * It sets the object's room code and returns the admin object
     * @function updateAdmin
     * @async
     * @param {string} roomCode - The room code to be updated with
     * @returns {Admin} - The admin object
     * 
     * */

    async updateAdminRoomCode(roomCode) {
        if (JSON.stringify(this.getRoomCode()) !== JSON.stringify(roomCode))  
        {
            console.log(roomCode)
            const docRef = doc(db, "admins", this.getAdminId()).withConverter(adminConverter);
            this.setRoomCode(roomCode);
            console.log("updating admin with room code " + this.getRoomCode());
            await updateDoc(docRef, {
                roomCode: this.getRoomCode(),
            });
            console.log("successfully updated admin with room code " + this.getRoomCode());
        }
        return this;
    }

    /* Note: Need frontend input to get the taskDescription, like user types in the description 
             in the text field, and taps `add task` button. Then this method should be triggered to 
             generate the Task from the taskDescription and add to the taskList.
     */
    // Method to add a task using the TaskList's addTask method
    addTask(taskDescription) {
        return this.taskList.addTask(taskDescription);
    }

    /* Note: Need frontend input to get the task, like user seletcs a task to remove from 
             the list, and taps `delete task` button. Then this method should be triggered to 
             locate the Task from the taskDescription and remove it from the taskList.
     */
    // Method to delete a task using the TaskList's deleteTask method
    deleteTask(task) {
        this.taskList.deleteTask(task);
    }

    createVoteDoc() {
        // create a vote document in the database

    }

    /*
    There should be more methods to craete room, assign tasks, end game, etc.
    */
   
}

export const adminConverter = {
    toFirestore: (admin) => {
        return {
            adminId: admin.getAdminId(),
            name: admin.getName(),
            tasklist: admin.getTaskList(),
            roomCode: admin.getRoomCode(),
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Admin(data.adminId,data.name, data.tasklist, data.roomCode);
    }
};