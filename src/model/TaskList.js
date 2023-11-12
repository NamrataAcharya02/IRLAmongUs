export class Task {
    constructor(description) { 
        this.description = description;
        this.completed = false;
    }

    // Method to mark the task as completed
    completeTask() {
        this.completed = true;
    }
}

export class TaskList {
    constructor(name) { 
        this.name = name;
        this.list = [];
    }

    // Method to add a task to the task list
    addTask(taskDescription) {

        const newTask = new Task(taskDescription);
        this.tasks.push(newTask);
        console.log("num of tasks after adding: " + this.list.length);
    }

    // Method to delete a task from the task list
    deleteTask(task) {
        const taskIndex = this.tasks.indexOf(task);

        if (taskIndex !== -1) {
            this.tasks.splice(taskIndex, 1);
        }
        console.log("num of tasks of deleting: " + this.list.length);
    }
}