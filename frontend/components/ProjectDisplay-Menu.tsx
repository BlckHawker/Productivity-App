import * as utils from "../src/api/utils";
import React from "react"; // must be in scope for JSX

function ProjectDisplay() {

    // make get request for projects
    async function acquireProjectsCallback() {
        const getRequest = await utils.getAPICall("/projects");

        console.log(getRequest);
    }

    acquireProjectsCallback();

    return (
        <div id="projects">
            <h2>Projects</h2>
            <div id="proj-list">
                <ul>
                </ul>
            </div>
        </div>
    )
}

export default ProjectDisplay;