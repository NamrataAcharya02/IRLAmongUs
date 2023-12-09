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


    constructor(adminId, name, tasklist, roomCode) {
        this.adminId = adminId;
        this.name = name;
        this.tasklist = tasklist;
        this.roomCode = roomCode;

    }

    getAdminId() {
        return this.adminId;
    }

    getTaskList() {
        return this.tasklist;
    }

    getName() { 
        return this.name;
    }

    setRoomCode(roomCode) {
        this.roomCode = roomCode;
    }

    getRoomCode() { 
        return this.roomCode;
    }

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