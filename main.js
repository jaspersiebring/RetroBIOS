import { sha256, sha1_mapper } from './utils.js';

let a = 12;
// Initialize Dropzone
Dropzone.autoDiscover = false; // Disable auto-discovery for this instance

// Create a new Dropzone instance (#my-awesome-dropzone needs to be a form)
const myDropzone = new Dropzone("#my-awesome-dropzone", {
    paramName: "file", // The name that will be used to transfer the file
    maxFilesize: 15, // we're not expecting BIOS files over 15mb (TODO check if this works with folders or individual files)
    dictDefaultMessage: "Drag files here or click to upload",
    autoProcessQueue: false // Automatically upload files
});

// ignore

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

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.result);
        reader.readAsArrayBuffer(file);
    });
}


// Handle files added to Dropzone
myDropzone.on("addedfile", async function(file) {

    try {
        console.log("File added:", file);
        
        const romArrayBuffer = await readFileAsArrayBuffer(file);
        const hashedRom = await crypto.subtle.digest("SHA-1", romArrayBuffer);
        console.log('SHA-1 Hash:', hashedRom);  // Display hash
        
        const uint8ViewOfHash = new Uint8Array(hashedRom);
        
        const sha1_hex_string = Array.from(uint8ViewOfHash).map(byte => byte.toString(16).padStart(2, "0")).join("");
        
        const myList = document.querySelector("#myList");
        const listItem = document.createElement("li");
        // listItem.textContent = fileSizeSTR;
        listItem.textContent = sha1_hex_string;
        const sha1s = Array.from(sha1_mapper.values(), (x) => x["sha1"]);
        let a = 12;

        
        const possible_match = sha1_mapper.get(sha1_hex_string);

        const romMatch = sha1s.includes(sha1_hex_string);
        console.log(possible_match);
        alert(possible_match);
        myList.appendChild(listItem);

    } catch (error) {
        console.error(`Error processing file: ${error}`);
    }
    
});


// ignore

async function main() {
    console.log(sha1_mapper);
    let a = 12;
    // Example lookup
    const md5ToFind = 'some-md5-hash';
    const rom = sha1_mapper.get(md5ToFind);

    if (rom) {
        console.log('ROM found:', rom);
    } else {
        console.log('ROM not found');
    }
}

main();
// processQueue is never called