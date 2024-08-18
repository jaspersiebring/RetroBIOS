import { sha1Map, systemDict } from './utils.js';

let a = 12;
// Initialize Dropzone
Dropzone.autoDiscover = false; // Disable auto-discovery for this instance

// Create a new Dropzone instance (#my-awesome-dropzone needs to be a form)
const myDropzone = new Dropzone("#my-awesome-dropzone", {
    paramName: "file", // The name that will be used to transfer the file
    maxFilesize: 15, // we're not expecting BIOS files over 15mb (TODO check if this works with folders or individual files)
    dictDefaultMessage: "Drag files here or click to upload",
    autoProcessQueue: false, // Automatically upload files
    acceptDirectories: true,
    disablePreviews: true
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


function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

// Handle files added to Dropzone
myDropzone.on("addedfile", async function(file) {

    try {
        console.log("File added:", file);
        
        const fileBuffer = await readFileAsArrayBuffer(file);
        const fileHash = await crypto.subtle.digest("SHA-1", fileBuffer);
        const viewHash = new Uint8Array(fileHash);
        const sha1String = Array.from(viewHash).map(byte => byte.toString(16).padStart(2, "0")).join("");

        
        
        const myList = document.querySelector("#myList");
        const listItem = document.createElement("li"); 
        listItem.textContent = sha1String;
        myList.appendChild(listItem);
        
        // const sha1s = Array.from(sha1_mapper.values(), (x) => x["sha1"]);
        // const romMatch = sha1s.includes(sha1String);
        const possible_match = sha1Map.get(sha1String);

        // alert(this.files.length);
        if (possible_match !== undefined) {
            console.log(possible_match);
            // alert(possible_match);
        } else {
            console.log(possible_match);
        }


    } catch (error) {
        console.error(`Error processing file: ${error}`);
    }
    
});


function main() {
    const tableData = Object.entries(systemDict).flatMap(([system, roms]) =>
        roms.map(rom => [system, rom.name, rom.size, rom.sha1])
    );
    
      new gridjs.Grid({
        columns: ["System", "Name", "Size", "SHA1"],
        data: tableData,
        sort: true, // Optional: enable sorting on columns
        search: true, // Optional: enable searching through the table
        pagination: {
            enabled: true,
            limit: 10, // Optional: number of rows per page
        }
    }).render(document.getElementById("wrapper"));
}

main();
