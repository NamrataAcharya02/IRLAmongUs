class Admin {
    constructor() {
        this.taskList = new TaskList();
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