import React from "react";
// import * as utils from "../src/api/utils";

function DeleteProjectForm (props: {id: number}) {

    // remember to merge in completed project edit form
    // when the delete button is pressed, this pops up
    // two buttons: delete and cancel
    // if cancel: close popup
    // if delete: send DELETE request to API and reload

    const cancelClicked = () => {
        console.log("you cancelled deletion!")
    }

    const deleteClicked = () => { // make async
        console.log(`you deleted it! This is the ID: ${props.id}`);

        // make DELETE request here

        // after, reload the window
    }


    return(
        <>
            <p>Are you sure you want to delete?</p>
            <button onClick={cancelClicked}>Cancel</button>
            <button onClick={deleteClicked}>Delete</button>
        </>
    )
}

export default DeleteProjectForm;