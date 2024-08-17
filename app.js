import { sha256 } from './utils.js';

// Initialize Dropzone
Dropzone.autoDiscover = false; // Disable auto-discovery for this instance

// Create a new Dropzone instance (#my-awesome-dropzone needs to be a form)
const myDropzone = new Dropzone("#my-awesome-dropzone", {
    paramName: "file", // The name that will be used to transfer the file
    maxFilesize: 15, // we're not expecting BIOS files over 15mb (TODO check if this works with folders or individual files)
    dictDefaultMessage: "Drag files here or click to upload",
    autoProcessQueue: false // Automatically upload files
});

// // Handle the `success` event
// myDropzone.on("success", function(file, response) {
//     console.log("File successfully uploaded:", file);
//     console.log("Server response:", response);
//     // You can handle the response from the server here
// });

// // Handle the `error` event
// myDropzone.on("error", function(file, response) {
//     console.error("Error uploading file:", file);
//     console.error("Server response:", response);
//     // You can handle the error here
// });

// // Handle the `complete` event
// myDropzone.on("complete", function(file) {
//     console.log("File upload complete:", file);
//     // You can perform actions after the upload completes here
// });

// Handle files added to Dropzone
myDropzone.on("addedfile", function(file) {
    console.log("File added:", file);
    // Perform actions when a file is added
    const fileSizeKB = (file.size / 1024).toFixed(2);

    const fileSizeSTR = `File size: ${fileSizeKB}`;
    const whatever = `${typeof sha256}`;
    console.log(fileSizeSTR);
    
    const myList = document.querySelector("#myList");
    const listItem = document.createElement("li");
    // listItem.textContent = fileSizeSTR;
    listItem.textContent = whatever;

    myList.appendChild(listItem);
});


// processQueue is never called