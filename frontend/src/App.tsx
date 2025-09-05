/**
 * Root component for the frontend React application.
 * Displays testing creation task code to verify backend support. Does not reflect final file structure
 */
import * as taskApi from "./api/task";
import { useEffect, useState } from "react";
import React from "react";
import type {Task} from "./interfaces.js";

/**
 * Renders the main application UI.
 *
 * @returns A React element containing mockup of getting and creating tasks to and from the backend
 */
export function App(): React.ReactElement {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [currentTaskName, setCurrentTaskName] = useState<string>("");
	const [error, setError] = useState<string>("");

	//fetch tasks from backend
	useEffect(() => {
		async function fetchData() {
			const getTasksResponse = await taskApi.getAllTasks() as Task[];
			console.log(getTasksResponse);
			if(!updateError(getTasksResponse)) {
				setTasks(getTasksResponse);
			}

		}
		fetchData();
	}, []);

	const handleCreateTask = async () => {
		setError("");

		//API call to create a task
		const getCreateTaskResponse = await taskApi.createTask(currentTaskName) as Task;
		console.log(getCreateTaskResponse);
		if(!updateError(getCreateTaskResponse)) {
			setTasks([...tasks, getCreateTaskResponse]);
			setCurrentTaskName("");
		}
	};

	
	/**
	 * Checks if the given object is an Error instance.
	 * If it is, updates the error state with its message.
	 *
	 * @param foo - Any object to check
	 * @returns true if foo is an Error, otherwise false
	 */
	function updateError(foo: object) {
		const bool = foo instanceof Error;
		if (bool) {
			setError(foo.message);
		}
		return bool;
	}

	return (
		<div>
			<h1>Current tasks</h1>
			<ul>
				{tasks.map((task) => (
					<li key={task.id}>{task.name}</li>
				))}
			</ul>
			<p>Add a name to a task to create it</p>
			<input
				value={currentTaskName}
				onChange={(e) => setCurrentTaskName(e.target.value)}
				type="text"
			/>
			<button onClick={handleCreateTask}>Create task</button>
			<p style={{ color: "red" }}>{error}</p>
		</div>
	);
}

export default App;
