import React, {useState} from "react";


function PlayerTaskList() { 
	const [tasks, setTasks] = useState([
        {id: 0, taskDescription: 'say hi to Prof Eggert', complete:false, visible:true},
        {id: 1, taskDescription: 'take a picture of Boelter 3420', complete:false, visible:true},
        {id: 2, taskDescription: 'go to the roof of Boelter', complete:false, visible:true},
        {id: 3, taskDescription: 'enter Boelter 3400', complete:false, visible:true},
        {id: 4, taskDescription: 'get 110% on the final', complete:false, visible:false},
        {id: 5, taskDescription: 'go to class 2 hours early', complete:false, visible:false}
    ]);

    const markComplete = (taskID) => {
        var setNewToVisible = false;
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskID) {
              const updatedTask = {
                ...task,
                complete: !task.complete,
                visible: !task.visible, //comment out this line if you want players to see the tasks they have completed
              };
      
              return updatedTask;
            }
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

