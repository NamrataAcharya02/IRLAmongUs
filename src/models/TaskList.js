export class Task {
    constructor(name, visible) {
        this.name = name;
        this.completed = false;
        this.visible = visible;
    }
 
    // Method to mark the task as completed
    completeTask() {
        this.completed = true;
    }
    // Method to update task description.
    updateTask(newName) {
        this.name = newName;
    }

    // Static method to serialize a Task object into a dictionary
    static serialize(task) {
        return {
            name: task.name,
            completed: task.completed,
            visible: task.visible,
        };
    }

    // Static method to deserialize a dictionary into a Task object
    static deserialize(taskData) {
        return new Task(taskData.name, taskData.visible, taskData.completed);
    }
}

export class TaskList {
    constructor(name, list) { 
        this.name = name
        this.tasks = list
    }

    // Method to add a task to the task list
    addTask(taskDescription) {

        const newTask = new Task(taskDescription);
        this.tasks.push(newTask);
        console.log("num of tasks after adding: " + this.tasks.length);
    }

    // Method to delete a task from the task list
    deleteTask(task) {
        const taskIndex = this.tasks.indexOf(task);

        if (taskIndex !== -1) {
            this.tasks.splice(taskIndex, 1);
        }
        console.log("num of tasks of deleting: " + this.tasks.length);
    }

    // Static method to serialize a TaskList object into a list of dictionaries
    static serialize(taskList) {
        return taskList.tasks.map((task) => Task.serialize(task));
    }

    // Static method to deserialize a list of dictionaries into a TaskList object
    static deserialize(taskListDictionaries) {
        const tasks = [];
        for (const taskDictionary of taskListDictionaries) {
            tasks.push(Task.deserialize(taskDictionary));
        }
        return new TaskList('My Task List', tasks);
    }
}