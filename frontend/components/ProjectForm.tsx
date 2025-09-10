import { Form } from "../hooks/Form";


function ProjectForm() {
    let form = document.querySelector<HTMLElement>("#project-form");
    let formSubmissions: Object[] = [];

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
        // TODO: these lines work, but figure out how to get the error to go away
        let finalName: String = values.name;
        let finalColor: String = values.color;
        let finalProject: Object = {name: finalName, color: finalColor};


        // TODO: send data to database (after all functionality is implemented)

        /* // if(!formSubmissions.find((obj) => (obj.name == finalName ))){ // TODO: check for unique name w/ trimmed string
            formSubmissions.push(finalProject);
            // FIXME: using 'find()' works but the array only holds one value at a time, using 'include()' doesn't work but the array holds multiple values

            
        }
        else {
            alert("Project called " + finalName + " already exists. Please enter another name.")
            // TODO: highlight text box and disable submit button
        } */

        // TODO: check array length; if length == 100, disable create project button

        console.log(formSubmissions); // TODO: make sure array populates correctly; currently only holding one item at a time?
    }

    function formSubmit() {
        // hides the form on submit
        if (form) {
            if (form.style.display != "none") {
                form.style.display = "none";
            }
        }

        // TODO: reset form data
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
                        required 
                    />

                    <input
                        name='color'
                        id='color'
                        type='color'
                        placeholder='Color'
                        onChange={onChange}
                        required 
                    />
                    <button type='submit' onClick={() => formSubmit()}>Create Project</button>
                </div>
            </form>
        </>
    );
}

export default ProjectForm;

/*
form source: https://dev.to/karan316/build-forms-using-react-the-easy-way-with-typescript-46bh
*/
