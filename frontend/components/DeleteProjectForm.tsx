import React from "react";

function DeleteProjectForm () {

    // when the delete button is pressed, this pops up
    // two buttons: delete and cancel
    // if cancel: close popup
    // if delete: send DELETE request to API and reload

    return(
        <>
            <p>Are you sure you want to delete?</p>
            <button>Cancel</button>
            <button>Delete</button>
        </>
    )
}

export default DeleteProjectForm;