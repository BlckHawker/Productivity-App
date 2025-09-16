import * as utils from "../src/api/utils";
import { useEffect, useState } from "react";
import Project from "./Project";
import React from "react"; // must be in scope for JSX

function ProjectDisplay() {

    // make get request for projects
    const[projects, setProjects] = useState<Array<object>>(null);

    useEffect(() => {
        const getRequest = utils.getAPICall("/projects");
        getRequest.then(projects => setProjects(projects));

    }, []);

    return (
        <div id="projects">
            <h2>Projects</h2>
            <div id="proj-list">
                {projects && projects.map((proj) => <Project key={proj.id} name ={proj.name} color={proj.color}/>)}
            </div>
        </div>
    )
}

export default ProjectDisplay;