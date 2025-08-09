// Example of broken lint rules

// 1. Single quotes instead of double quotes, missing semicolon
let greeting = 'hello world'  // <- should be: const greeting = "hello world";

// 2. Unused import
import fs from 'fs'; // <- should be removed if unused

// 3. Imports out of order
import zlib from "zlib";
import axios from "axios";

// 4. Using let instead of const when variable is never reassigned
let count = 5; // <- should be: const count = 5;

// 5. Using any type
function log(data: any) { // <- should be: function log(data: string)
  console.log(data);
}

// 6. Excessive blank lines

const a = 10;



const b = 20;

// 7. Spaces instead of tabs, and incorrect indentation

function test() {
    console.log("test"); // <- should be tab-indented 2 spaces visually, using tabs char
}
