// import * as taskApi from './api/task'
// import React from "react";
// import type { Task } from "./interfaces.js";
// import { useState, useEffect } from 'react';

// /* task creation; will need to be moved to another component */
// export function App(): React.ReactElement {
// 	const [tasks, setTasks] = useState<Task[]>([]);
// 	const [currentTaskName, setCurrentTaskName] = useState<string>("");
// 	const [error, setError] = useState<string>("");

// 	//fetch tasks from backend
// 	useEffect(() => {
// 		async function fetchData() {
// 		const getTasksResponse = await taskApi.getAllTasks() as Task[];
// 		console.log(getTasksResponse)
// 		if(!updateError(getTasksResponse)) {
// 			setTasks(getTasksResponse)
// 		}

// 	}
// 	fetchData();
// 	}, []);

// 	const handleCreateTask = async () => {
// 		setError("");

// 		//API call to create a task
// 		const getCreateTaskResponse = await taskApi.createTask(currentTaskName) as Task
// 		console.log(getCreateTaskResponse)
// 		if(!updateError(getCreateTaskResponse)) {
// 			setTasks([...tasks, getCreateTaskResponse]);
// 			setCurrentTaskName("");
// 		}
// 	};

	
// 	//todo give comment header
// 	function updateError(foo: object) {
// 		const bool = foo instanceof Error;
// 		if (bool) {
// 			setError(foo.message);
// 		}
// 		return bool;
// 	}

// 	return (
// 		<div>
// 			<h1>Current tasks</h1>
// 			<ul>
// 				{tasks.map((task) => (
// 					<li key={task.id}>{task.name}</li>
// 				))}
// 			</ul>
// 			<p>Add a name to a task to create it</p>
// 			<input
// 				value={currentTaskName}
// 				onChange={(e) => setCurrentTaskName(e.target.value)}
// 				type="text"
// 			/>
// 			<button onClick={handleCreateTask}>Create task</button>
// 			<p style={{ color: "red" }}>{error}</p>
// 		</div>
// 	);
// }