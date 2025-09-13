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

// USE FOR TESTING ONLY: creates 100 projects. recommended to run `npm run clear` in backend before running this function
// function test_CreateProjects() {
// 	for (let i = 0; i<=100; i++){
// 		const finalProject = {name: "test"+i, color:"#ffffff"};
// 		const postResponse = utils.postAPICall("/project/create", finalProject);
// 	}
// }

export function App(): React.ReactElement {
	// TODO: menu should be collapsible (later)
	// test_CreateProjects(); <-- use to test project creation limit

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
