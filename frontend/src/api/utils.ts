/*
 * Provides helper functions to make GET and POST requests to the backend API.
 * Uses the base URL defined in environment variables.
 */
const baseUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * Perform a GET request to the backend API.
 *
 * @param {string} url - The endpoint path (relative to baseUrl).
 * @returns {Promise<any | Error>} Parsed JSON response or an Error if the request fails.
 */
const getAPICall = async (url: string) => {
	return await fetch(`${baseUrl}${url}`, {
		headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
		method:  "GET"
	}).then(response => {
		return response.json();

	}).then(json => {
		return json;

	})
		.catch((error) => {
			return error;
		});
};

/**
 * Perform a POST request to the backend API.
 *
 * @param {string} url - The endpoint path (relative to baseUrl).
 * @param {object} body - The request payload to send in the POST.
 * @returns {Promise<any | Error>} Parsed JSON response or an Error if the request fails.
 */
const postAPICall = async (url: string, body: object) => {
	return await fetch(`${baseUrl}${url}`, {
		body:    JSON.stringify(body),
		method:  "POST",
		headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
	}).then(response => {
		return response.json();

	}).then(json => {
		return json;

	})
		.catch((error) => {
			return error;
		});
};

export {
	getAPICall,
	postAPICall
};