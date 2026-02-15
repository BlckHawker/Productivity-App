import * as utils from "../src/api/utils";
import { useEffect, useState } from "react";
import Project from "./Project";
import React from "react"; // must be in scope for JSX

export default function ProjectDisplay() {
	// make get request for projects
	const [projects, setProjects] = useState<Array<object>>(null);
	let isProj;

	useEffect(() => {
		const getRequest = utils.getAPICall("/projects");
		getRequest.then((projects) => setProjects(projects));
	}, []);

	// checking type of 'projects': array means tasks have been returned, anything else means there are no tasks
	if (Array.isArray(projects)) {
		isProj = true;
	} else {
		isProj = false;
	}

	return (
		<div id="projects">
			<h2>Projects</h2>
			<div id="proj-list">
				{isProj ? (
					projects &&
					projects.map((proj) => (
						<Project key={proj.id} id={proj.id} name={proj.name} color={proj.color} />
					))
				) : (
					<p>No projects!</p>
				)}
			</div>
		</div>
	);
}