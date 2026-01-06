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

export function App(): React.ReactElement {
	return (
		<div className="App">
			<div id="menu">
				<ProjectDisplay />
				<ProjectForm />
				<button id="create-proj" onClick={() => showForm()}>
					New Project
				</button>
			</div>
		</div>
	);
}

export default App;