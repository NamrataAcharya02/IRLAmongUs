import React, {useState} from "react";

/**
 * This React component renders the list of tasks for a player in the IRL Among Us app.
 * 
 * @function PlayerTaskList
 * @returns The PlayerTaskList component.
 */
function PlayerTaskList() { 
    // State variable for storing the list of tasks
    // Order the following list is how it is shuffled
    // i.e. as long as the task 'go to the roof of Boelter' is after 'enter Boelter 3400'
    //      the id does not matter and 'enter Boelter 3400' will always be displayed first (it can be bigger or smaller)
	const [tasks, setTasks] = useState([
        {name: 'say hi to Prof Eggert', completed:false, visible:true},
        {name: 'take a picture of Boelter 3420', completed:false, visible:true}, 
        {name: 'enter Boelter 3400', completed:false, visible:true},
        {name: 'go to the roof of Boelter', completed:false, visible:true},
        {name: 'get 110% on the final', completed:false, visible:false},
        {name: 'go to class 2 hours early', completed:false, visible:false}
    ]);

    /**
     * Marks a task as completed and updates the task list.
     * 
     * @function markComplete
     * @param {string} name The name of the task to mark as completed.
     * @returns {void}
     */
    const markComplete = (name) => {
        var setNewToVisible = false;
        const updatedTasks = tasks.map((task) => {
            //marks current one as complete and removes it from view
            if (task.name === name) {
              const updatedTask = {
                ...task,
                completed: !task.completed,
                visible: !task.visible, //comment out this line if you want players to see the tasks they have
              };
      
              return updatedTask;
            }
            //makes the next task down visible
            if (!task.visible && !setNewToVisible && !task.completed)
            {
                setNewToVisible = true;
                const updatedTask = {
                    ...task,
                    // complete: !task.complete,
                    visible: !task.visible,
                };
                return updatedTask;
            }
      
            return task;
          });
        setTasks(updatedTasks);
        //Save to DB
    };

    //displays the list of tasks and updates them
	return( 
        <ul className="centered-lists">
		    {tasks.map((task) => (task.visible && (
                <div className="task">
                    <h3>
                        <input 
                            type="checkbox"
                            className="checkbox"
                            onClick={() => markComplete(task.name)}
                            checked={task.completed}
                        /> 
                        {task.name}
                    </h3>
                </div>
            )))}
        </ul>
    );
} 

// Export the component as the default export.
export default PlayerTaskList; 

