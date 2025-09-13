import * as utils from "../src/api/utils";
import { Form } from "../hooks/Form";
import React from "react"; // must be in scope for JSX

function ProjectForm() {

    // globals
    const errormsg = document.querySelector<HTMLElement>("#name-error");
    const submitbtn = document.querySelector<HTMLButtonElement>("#submitbtn");
    const createbtn = document.querySelector<HTMLButtonElement>("#create-proj");
    const input = document.querySelector<HTMLInputElement>("#inputname");
    let maxHit = false;

    // initial state of form
    const initialState = {
        name: "",
        color: ""
    };

    const { onChange, onSubmit, values} = Form(
        projectMadeCallback,
        initialState
    );

    // requests to api and results are held here
    async function projectMadeCallback() {
        // TODO: these lines work, but figure out how to get the error to go away
        const finalName: string = values.name.trim();
        const finalColor: string = values.color;
        const finalProject: object = {name: finalName, color: finalColor};

        // make API call
        const postResponse = await utils.postAPICall("/project/create", finalProject);
        const message = await postResponse.json;

        // project limit hit
        if (postResponse.status == "400") {

            // limit is 100 projects
            if (message.message === "Reached maximum amount of projects (100). Please delete some before creating more.") {
                maxHit = true;

                // TODO: once deletion is in place, the button will be enabled after there are less than 100 projects
                 if (errormsg) {
                    // populate innerHTML
                    errormsg.innerHTML = message.message;
                    // display on submit btn hover
                    if (createbtn) {
                        createbtn.addEventListener("mouseover", () => {
                            errormsg.style.visibility = "visible";
                        });

                        // hide when not hovering
                        createbtn.addEventListener("mouseout", () => {
                            errormsg.style.visibility = "hidden";
                        })
                    }
                }
            }
        }

        // error handling
        // project name already exists
        if (postResponse.status == "409") {

            // if element isn't null
            if (submitbtn) {
                // disable submit button
                submitbtn.disabled = true;
            }

            // if element isn't null
            if (errormsg) {
                // populate innerHTML
                errormsg.innerHTML = message.message;
                // display on submit btn hover
                if (submitbtn) {
                    if (submitbtn.disabled === true) {
                        submitbtn.addEventListener("mouseover", () => {
                            errormsg.style.visibility = "visible";
                        });

                        // hide when not hovering
                        submitbtn.addEventListener("mouseout", () => {
                            errormsg.style.visibility = "hidden";
                        });
                    }
                }
            }

            // red outline
            if (input){
                input.style.outline = "thick solid #FF0000"; // TODO: highlight wasn't working properly, outline done for now; check with Kovu for preference later
            }
        }

        // cleanup
        
    }

    // enabling buttons after fixing an error
    if (input) {
        if (input.value === "") {

            // enable submit button
            if (submitbtn) {
                submitbtn.disabled = false;

                if (errormsg) {
                    errormsg.innerHTML = "";
                }
            }
            // undo outline
            if (input){
                input.style.outline = "none";
            }

            // enable new button project
            if (createbtn) {
                if (maxHit === false) {
                    createbtn.disabled = false;
                }
            }
        }
    }

    return (
        <>
            <form name="project-form" id="project-form" onSubmit={onSubmit}>
                <div id="input-container">
                    <input
                        name='name'
                        id='inputname'
                        type='name'
                        placeholder='Project Name'
                        onChange={onChange}
                        required 
                    />
                    <p id="name-error"></p>

                    <input
                        name='color'
                        id='inputcolor'
                        type='color'
                        placeholder='Color'
                        onChange={onChange}
                        required 
                    />
                    <button id="submitbtn" type='submit'>Create Project</button>
                </div>
            </form>
        </>
    );
}

// () => {if (nameInput) nameInput.value = ""}
export default ProjectForm;

/*
form source: https://dev.to/karan316/build-forms-using-react-the-easy-way-with-typescript-46bh
*/
