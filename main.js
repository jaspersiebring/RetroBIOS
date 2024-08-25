import { sha1Map, systemDict, headerMenu } from './utils.js';
2375.58
// containers
let tableData;
let table;
const nameMapper = {};
let hashSet = new Set();

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

async function getSha1(file) {
    const fileBuffer = await readFileAsArrayBuffer(file);
    const fileHash = await crypto.subtle.digest("SHA-1", fileBuffer);
    const viewHash = new Uint8Array(fileHash);
    const sha1String = Array.from(viewHash).map(byte => byte.toString(16).padStart(2, "0")).join("");
    return sha1String;
}

const myDropzone = new Dropzone("#my-awesome-dropzone", {
    paramName: "file", 
    maxFilesize: 15, // we're not expecting BIOS files over 15mb (TODO check if this works with folders or individual files)
    dictDefaultMessage: "Drag files here or click to upload",
    autoProcessQueue: false, // we don't actually upload anything 
    acceptDirectories: true,
    disablePreviews: true,
    
    accept: async function(file, done) {
        const sha1String = await getSha1(file);
        const hashPresent = hashSet.has(sha1String);
        const possible_match = sha1Map.get(sha1String);
        // we only continue if hash is new and matched one of the known BIOS' hashes
        if (possible_match !== undefined && !hashPresent) {
            const index = tableData.findIndex(row => row['sha1'] === sha1String);
            tableData[index]['match'] = true;
            table.setSort([
                {column:"match", dir:"desc"},
            ]);
            nameMapper[file.name] = tableData[index].name;
            hashSet.add(sha1String);
            done();
        }
    }
});


// myDropzone.on("addedfile", async function(file) {
//     try {
//         console.log("File added:", file);
        
//         const sha1String = await getSha1(file);
//         const hashPresent = hashSet.has(sha1String);
//         const possible_match = sha1Map.get(sha1String);
//         if (possible_match !== undefined) {
//             console.log(possible_match);
//             const index = tableData.findIndex(row => row['sha1'] === sha1String);
//             tableData[index]['match'] = true;
//             table.setSort([
//                 {column:"match", dir:"desc"},
//             ]);

//         } else {
//             console.log(possible_match);
//         }
//     } catch (error) {
//         console.error(`Error processing file: ${error}`);
//     }
    
// });






function main() {
    // data init
    tableData = Array.from(sha1Map.values());
    tableData.forEach(bios => bios["match"] = false);
    
    // tabulator table init
    table = new Tabulator("#table_wrapper", {
        data: tableData,
        autoColumns: false,
        columns: [
            {title:"name", field:"name", visible:true, headerMenu:headerMenu}, 
            {title:"size", field:"size", visible:true}, 
            {title:"crc", field:"crc", visible:false}, 
            {title:"md5", field:"md5", visible:false}, 
            {title:"sha1", field:"sha1", visible:true}, 
            {title:"system", field:"system", visible:true}, 
            {title:"match", field:"match", visible:true}, 
        ],

        layout:"fitDataTable",
        pagination:"local",       
        paginationSize:20,        
        paginationCounter:"rows",
        responsiveLayout:"collapse", // hide rows that no longer fit
        initialSort: [
            {column: "match", dir: "desc"}
          ],
        footerElement:`<button id = "zipAll">Export ZIP</button> <label class="switch">Hide unmatched files<input type="checkbox" id="showAll"><span class="slider round"></span></label>`,
    });
    
    table.on("tableBuilt", function() {
        const exportButton = document.getElementById("zipAll");
        if (exportButton) {
            exportButton.addEventListener("click", async function() {
                const zip = new JSZip();
                const validFiles = myDropzone.getAcceptedFiles();
                for (let validFile of validFiles) {
                    const validBuffer = await validFile.arrayBuffer();
                    zip.file(nameMapper[validFile.name], validBuffer);
                }

                zip.generateAsync({type:"blob"}).then(function (blob) {
                    saveAs(blob, "system.zip");
                });
            });
        }

        const checkBox = document.getElementById("showAll");
        if (checkBox) {
            checkBox.addEventListener("change", function() {    
                if (checkBox.checked) {
                    table.setFilter("match", "=", true);
                } else {
                    table.clearFilter();
                }
                table.setSort([
                    {column:"match", dir:"desc"},
                ]);

                const columnWidths = table.getColumns().map(column => {
                    return {
                        field: column.getField(),  // Get the field name of the column
                        width: column.getWidth()   // Get the current width of the column
                    };
                });
                console.log(columnWidths);
            

            });
        }
    });
}

main();