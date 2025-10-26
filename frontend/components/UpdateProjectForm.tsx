import * as utils from "../src/api/utils";
import { Form } from "../hooks/Form";
import React from "react"; // must be in scope for JSX

// props will be an object with the current project's name and color
function UpdateProjectForm(props: {name: string, color: string, id: number}) {
    const errormsg = document.querySelector<HTMLElement>("#name-error");
    const updatebtn = document.querySelector<HTMLButtonElement>("#submitbtn");
    const input = document.querySelector<HTMLInputElement>("#inputname");
    let currentVal:string;

	if (input){
		currentVal = input.value;
	}

    // initial state of form
    const initialState = {
        id: props.id,
        name: props.name,
        color: props.color
    };

	const oldColor = props.color;
    
    const { onChange, onSubmit, values } = Form(
        projectChangeCallback,
        initialState
    );

    // checking input
    function checkInput() {
		// get current input value
		if (input) {
			if (input.value != currentVal) {
				// enable submit button
				if (updatebtn) {
					updatebtn.disabled = false;

					if (errormsg) {
						errormsg.innerHTML = "";
					}
				}
				// undo outline
				if (input) {
					input.style.outline = "none";
				}
			}

		}
	}

    async function projectChangeCallback(){
        const newName: string = values.name;
        const newColor: string = values.color;
        const id = props.id;
        const newProj: object = {id: id, name: newName, color: newColor};

        console.log(`current name: ${newName}, currentColor: ${newColor}, ID: ${id}`);

        // make PUT request to update name and/or color
        // display error message in a div below the form
        // PUT returns errors when name is the same!
        const putResponse = await utils.putAPICall("/project/update", newProj);

        // save response message
        // if response if 400, display message
        const message = await putResponse.json;

        if (putResponse.status == "400") {
            if (errormsg) {
                errormsg.innerHTML = message.message; // display error message
                console.log(message.message)

                // show div on button hover
                if (updatebtn) {
                    updatebtn.disabled = true;
						updatebtn.addEventListener("mouseover", () => {
							errormsg.style.visibility = "visible";
						});

						// hide when not hovering
						updatebtn.addEventListener("mouseout", () => {
							errormsg.style.visibility = "hidden";
						});
					}
            }
        }

        // after input is accepted
		if (!putResponse.status) {
			if (input) {
				input.value = "";
				window.location.reload();
			}
		}

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
                        onInput={checkInput}
						required
					/>
					<p id="name-error"></p>

					<input
						name="color"
						id="inputcolor"
						type="color"
						placeholder="Color"
                        // TODO: make sure color displays as current color, not as default black
						defaultValue={oldColor}
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