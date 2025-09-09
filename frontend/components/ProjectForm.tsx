import { Form } from "../hooks/Form";
import { useState } from "react";

function ProjectForm() {
    // initial state of form
    const initialState = {
        name: "",
        color: ""
    };
}

/*
TODO:

code for color picker:

<input type="color" id="colorInput" value="#ff0000">
    <div className="color-info">
        <p>HEX: <span id="hexValue">#ff0000</span></p>
        <p>RGB: <span id="rgbValue">rgb(255, 0, 0)</span></p>
    </div>

source: https://www.freecodecamp.org/news/create-color-picker-using-html-css-and-javascript

 */