import * as utils from "../src/api/utils";
import { Form } from "../hooks/Form";
import React from "react"; // must be in scope for JSX

// props will be an object with the current project's name and color
function UpdateProjectForm(props: {name: string, color: string}) {
    // initial state of form
    const initialState = {
        name: props.name,
        color: props.color
    };
    
    const { onChange, onSubmit, values } = Form(
        projectChangeCallback,
        initialState
    );

    // checking input
    function checkInput(){
        
    }

    return (
        <>
            <form name="submit-project-form" id="submit-project-form" onSubmit={onSubmit}>
                <div>
                    <input
						name="name"
						id="inputname"
						type="name"
						placeholder="Project Name"
						onChange={onChange}
						//onInput={checkInput} 
                        // TODO: write checkInput function to handle input errors
						required
					/>
					<p id="name-error"></p>

					<input
						name="color"
						id="inputcolor"
						type="color"
						placeholder="Color"
						onChange={onChange}
						required
					/>
					<button id="submitbtn" type="submit">
						Update Project
					</button>
                </div>
            </form>
        </>
    )
}

export default UpdateProjectForm;