import { sha1Map, systemDict } from './utils.js';

let tableData;
let table;

// Initialize Dropzone
Dropzone.autoDiscover = false; // Disable auto-discovery for this instance
const myDropzone = new Dropzone("#my-awesome-dropzone", {
    paramName: "file", // The name that will be used to transfer the file
    maxFilesize: 15, // we're not expecting BIOS files over 15mb (TODO check if this works with folders or individual files)
    dictDefaultMessage: "Drag files here or click to upload",
    autoProcessQueue: false, // Automatically upload files
    acceptDirectories: true,
    disablePreviews: true
    
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

        // const myList = document.querySelector("#myList");
        // const listItem = document.createElement("li"); 
        // listItem.textContent = sha1String;
        // myList.appendChild(listItem);
    
        const possible_match = sha1Map.get(sha1String);
        if (possible_match !== undefined) {
            console.log(possible_match);
            const index = tableData.findIndex(row => row['sha1'] === sha1String);
            tableData[index]['match'] = true;
            table.setSort([
                {column:"match", dir:"desc"},
            ]);

        } else {
            console.log(possible_match);
        }
    } catch (error) {
        console.error(`Error processing file: ${error}`);
    }
    
});

function main() {
    tableData = Array.from(sha1Map.values());
    tableData.forEach(bios => bios["match"] = false);
    let b = 12; 
    table = new Tabulator("#tab_wrapper", {
        data: tableData, 
        autoColumns: true, 
        autoColumnsDefinitions:[
            {field:"match", formatter:"tickCross", visible:true}, 
        ],
        layout:"fitColumns",      
        pagination:"local",       
        paginationSize:20,        
        paginationCounter:"rows",
        initialSort: [
            {column: "match", dir: "desc"}
          ],
        selectableRows:true,
        // rowHeader:{formatter:"rowSelection", titleFormatter:"rowSelection", headerSort:false, resizable: false, frozen:true, headerHozAlign:"center", hozAlign:"center"},

        selectableRowsCheck:function(row){
            //row - row component
            return row.getData().match === true; 
        },
        footerElement:"<button>Export ZIP</button>",
        
    });
}

main();