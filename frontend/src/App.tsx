/**
 * Root component for the frontend React application.
 * Displays testing creation task code to verify backend support. Does not reflect final file structure
 */

import ProjectDisplay from "../components/ProjectDisplay-Menu";
import ProjectForm from "../components/ProjectForm";
import React from "react";

// shows the form that creates a new project
function showForm() {
	const form = document.querySelector<HTMLElement>("#project-form");

	if (form) {
		form.style.display = "block";
	}

}

/**
 * Renders the main application UI.
 *
 * @returns A React element containing mockup of getting and creating tasks to and from the backend
 */

export function App(): React.ReactElement {
	// TODO: menu should be collapsible
	// TODO: put 100 projects test function back + function call

	return (
		<div className="App">
			<div id="menu"> 
				<ProjectDisplay />
				<ProjectForm />
				<button id="create-proj" onClick={() => showForm()}>New Project</button>
			</div>
		</div>
	)

}

export default App;
