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
    taskLists;


    constructor(adminId, name, taskLists) {
        this.adminId = adminId;
        this.name = name;
        this.taskLists = taskLists;
    }

    getAdminId() {
        return this.adminId;
    }

    getTaskLists() {
        return this.taskLists;
    }

    getName() { 
        return this.name;
    }

    static async getAdmin(adminId) {
        const docRef = doc(db, "admins", adminId).withConverter(adminConverter);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
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
        await setDoc(docRef, new Admin(adminId, "ABCD", taskLists));

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
            admin = this.createAdmin(adminId, taskLists);
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

    async updateAdminTasklists(tasklistObj) { 
        //double check
        
        const docRef = doc(db, "admins", this.getAdminId()).withConverter(adminConverter);
        let taskLists = this.getTaskLists();
        console.log(taskLists)

        taskLists.push(tasklistObj);
        console.log(taskLists)

        await updateDoc(docRef, {
            taskLists: taskLists,
        });
        
        console.log("Admin updated");
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

    /*
    There should be more methods to craete room, assign tasks, end game, etc.
    */
   
}

const adminConverter = {
    toFirestore: (admin) => {
        return {
            adminId: admin.getAdminId(),
            name: admin.getName(),
            taskLists: admin.getTaskLists(),
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Admin(data.adminId,data.name, data.taskLists);
    }
};