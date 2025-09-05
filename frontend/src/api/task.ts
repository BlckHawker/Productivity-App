// Provides helper functions for interacting with the backend task API.
import * as utils from "./utils.js";

/**
 * Fetch all tasks from the backend API.
 * @returns {Promise<object[] | Error>} 
 * A list of task objects if successful, or an Error if the API returns an error message.
 */
const getAllTasks = async () => {
	const response = await utils.getAPICall("/task");
	if (response.message) {
		return new Error(response.message);
	}
	return response;
};

/**
 * Create a new task with the given name.
 *
 * @param {string} name - The name of the task to create.
 * @returns {Promise<object | Error>} 
 * The created task object if successful, or an Error if the API returns an error message.
 */
const createTask = async (name: string) => {
	const response = await utils.postAPICall("/createTask", {name, complete: false});
	if(response.message) {
		return new Error(response.message);
	}
	return response;
};

export {
	getAllTasks,
	createTask
};