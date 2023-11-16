import React, { Component } from "react"; 


class FrontendTaskList extends Component { 
	constructor(props) { 
		super(props); 

		// Setting up state 
		this.state = { 
			userInput: "", 
			list: [], 
		}; 
	} 

	// Set a user input value 
	updateInput(value) { 
		this.setState({ 
			userInput: value, 
		}); 
	} 

	// Add item if user input in not empty 
	addItem() { 
		if (this.state.userInput !== "") { 
			const userInput = { 
				// Add a random id which is used to delete 
				id: Math.random(), 

				// Add a user value to list 
				value: this.state.userInput, 
			}; 

			// Update list 
			const list = [...this.state.list]; 
			list.push(userInput); 

			// reset state 
			this.setState({ 
				list, 
				userInput: "", 
			}); 
		} 
	} 

	// Function to delete item from list use id to delete 
	deleteItem(key) { 
		const list = [...this.state.list]; 

		// Filter values and leave value which we need to delete 
		const updateList = list.filter((item) => item.id !== key); 

		// Update list in state 
		this.setState({ 
			list: updateList, 
		}); 
	} 

	editItem = (index) => { 
	const todos = [...this.state.list]; 
	const editedTodo = prompt('Edit the todo:'); 
	if (editedTodo !== null && editedTodo.trim() !== '') { 
		let updatedTodos = [...todos] 
		updatedTodos[index].value= editedTodo 
		this.setState({ 
		list: updatedTodos, 
	}); 
	} 
	} 

	render() { 
		return ( 
			<div className="task-list"> 
				<h4>Select a task list</h4>
				<select>
          			<option value="list 1">Los Angeles</option>
          			<option value="list 2">UCLA</option>
          			<option value="list 3">San Francisco</option>
          			<option value="list 4">London</option>
				</select> 

				<hr />
				<h4>Add a task</h4> 
          	<input 
            placeholder="add item . . . "
            size="lg"
            value={this.state.userInput} 
            onChange={(item) => 
              this.updateInput(item.target.value) 
            } 
          	/> 
            <button 
              onClick={() => this.addItem()} 
            > 
              ADD 
            </button> 

						<ul> 
							{/* map over and print items */} 
							{this.state.list.map((item, index) => { 
								return (  
                  <li key={index}>
                    <span>{item.value}</span>
                    <button className="delete" onClick={() => this.deleteItem(item.id)}>Delete</button>
                    <button className="edit" onClick={() => this.editItem(index)}>Edit</button>
                  </li>
                );
							})} 
						</ul> 

			</div> 
		); 
	} 
} 

export default FrontendTaskList; 

