import { Form } from "../hooks/Form";


function ProjectForm() {
    let form = document.querySelector<HTMLElement>("#project-form");

    // initial state of form
    const initialState = {
        name: "",
        color: ""
    };

    const { onChange, onSubmit, values} = Form(
        projectMadeCallback,
        initialState
    );

    async function projectMadeCallback() {
        console.log("project made! this will send the information to the database");
    }

    function hideForm() {

        if (form) {
            if (form.style.display != "none") {
                form.style.display = "none";
            }
        }
    }

    return (
        <>
            <form id="project-form" onSubmit={onSubmit}>
                <div>
                    <input
                        name='name'
                        id='name'
                        type='name'
                        placeholder='Project Name'
                        onChange={onChange}
                        required />

                    <input
                        name='color'
                        id='color'
                        type='color'
                        placeholder='Color'
                        onChange={onChange}
                        required />
                    <button type='submit' onClick={() => hideForm()}>Create Project</button>
                </div>
            </form>
        </>
    );
}

export default ProjectForm;

/*
source: https://dev.to/karan316/build-forms-using-react-the-easy-way-with-typescript-46bh
 */

// // shows the form that creates a new project
// function showForm() {
// 	let form = document.querySelector<HTMLElement>("#project-form");

// 	if (form) {
// 		if (form.style.display == "none") {
// 			form.style.display = "block";
// 		}
// 		else {
// 			form.style.display = "none";
// 		}
// 	}

// }