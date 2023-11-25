import React, {useState} from "react";


function PlayerTaskList() { 
    //order the following list is how it is shuffled
    //i.e. as long as the task 'go to the roof of Boelter' is after 'enter Boelter 3400'
    //      the id does not matter and 'enter Boelter 3400' will always be displayed first (it can be bigger or smaller)
	const [tasks, setTasks] = useState([
        {id: 0, taskDescription: 'say hi to Prof Eggert', complete:false, visible:true},
        {id: 1, taskDescription: 'take a picture of Boelter 3420', complete:false, visible:true}, 
        {id: 3, taskDescription: 'enter Boelter 3400', complete:false, visible:true},
        {id: 2, taskDescription: 'go to the roof of Boelter', complete:false, visible:true},
        {id: 4, taskDescription: 'get 110% on the final', complete:false, visible:false},
        {id: 5, taskDescription: 'go to class 2 hours early', complete:false, visible:false}
    ]);

    //marks task as complete and updates the task
    const markComplete = (taskID) => {
        var setNewToVisible = false;
        const updatedTasks = tasks.map((task) => {
            //marks current one as complete and removes it from view
            if (task.id === taskID) {
              const updatedTask = {
                ...task,
                complete: !task.complete,
                visible: !task.visible, //comment out this line if you want players to see the tasks they have
              };
      
              return updatedTask;
            }
            //makes the next task down visible
            if (!task.visible && !setNewToVisible && !task.complete)
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
        <ul>
		    {tasks.map((task) => (task.visible && (
                <div className="task">
                    <h3>
                        <input 
                            type="checkbox"
                            className="checkbox"
                            onClick={() => markComplete(task.id)}
                            checked={task.complete}
                        /> 
                        {task.taskDescription}
                    </h3>
                </div>
            )))}
        </ul>
    );
} 

export default PlayerTaskList; 

