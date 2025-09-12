import * as utils from "../src/api/utils";
import { Form } from "../hooks/Form";
import React from "react";


function ProjectForm() {

    const form = document.querySelector<HTMLElement>("#project-form");
    let successfulSubmit = true;

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

        // check responses for errors
        if (postResponse.status == "400") {

            // limit is 100 projects
            if (message.message === "Reached maximum amount of projects (100). Please delete some before creating more.") {
                const createbtn = document.querySelector<HTMLButtonElement>("#create-proj");

                // TODO: once deletion is in place, the button will be enabled after there are less than 100 projects
                if (createbtn) {
                    createbtn.disabled = true;
                    // TODO: create an 'error div' that will hold message.message and appears on hover. populate the div here
                }
            }
            else {
                // TODO: make error div for invalid input and populate here
            }
            alert(message.message); // alert user
        }

        if (postResponse.status == "409") {
            const btn = document.querySelector<HTMLButtonElement>("#submitbtn");
            // TODO: create an 'error div' that will hold message.message and appears on hover. populate the div here

            // red outline
            const input = document.querySelector<HTMLInputElement>("#inputname");
            if (input){
                input.style.outline = "thick solid #FF0000"; // TODO: highlight wasn't working properly, outline done for now; check with Kovu for preference later
            }

            if (btn) {
                btn.disabled = true;
            }
        }
    }

    // TODO: enable all buttons if name input is empty and maxHit == false


    // form onSubmit; check data submitted
    function formSubmit() {

        // check that form is good to hide
        /* Criteria:
            * maxHit == false
            * uniqueName == true
            * validName == true
            * validColor == true
            * if all is well, then hide the form
        */

        // hides the form on submit
        if (form) {
            if (form.style.display != "none" && successfulSubmit == true) {
                form.style.display = "none";
            }
        }

        // TODO: reset form data on submit
    }

    return (
        <>
            <form id="project-form" onSubmit={onSubmit}>
                <div id="input-container">
                    <input
                        name='name'
                        id='inputname'
                        type='name'
                        placeholder='Project Name'
                        onChange={onChange}
                        required 
                    />

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

export default ProjectForm;

/*
form source: https://dev.to/karan316/build-forms-using-react-the-easy-way-with-typescript-46bh
*/
