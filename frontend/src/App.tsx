/**
 * Root component for the frontend React application.
 * Displays testing creation task code to verify backend support. Does not reflect final file structure
 */
import { useEffect, useState } from "react";
import React from "react";
import type {Task} from "./interfaces.js";

/**
 * Renders the main application UI.
 *
 * @returns A React element containing mockup of getting and creating tasks to and from the backend
 */
export function App(): React.ReactElement {
	return (
		<>
			<div id="container">
				<h1>Hello World!</h1>
			</div>
		</>
	);
}

export default App;
