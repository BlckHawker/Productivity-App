import * as utils from "../src/api/utils";
import Project from "./Project";
import React from "react"; // must be in scope for JSX
import { useEffect, useState } from "react";

function ProjectDisplay() {

    // make get request for projects
    const[project, setProject] = useState<Array<object>>(null);

    useEffect(() => {
        const getRequest = utils.getAPICall("/projects");
        getRequest.then(project => setProject(project));

    }, []);


    return (
        <div id="projects">
            <h2>Projects</h2>
            <div id="proj-list">
                {project && project.map((proj) => <Project key={proj.id} name ={proj.name} color={proj.color}/>)}
            </div>
        </div>
    )
}

export default ProjectDisplay;

    // async function acquireProjectsCallback(): Promise<object[]> {   

        // if (projList) {
        //     getRequest.foreach((project) => {
        //         const component = <Project key={project.id} name={project.name} color= {project.color} />
        //         projList.appendChild(component);
        //         // const projList = document.querySelector("#proj-list");

        //     })
        // }

// acquireProjectsCallback();