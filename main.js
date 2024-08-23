import { sha1Map, systemDict, headerMenu } from './utils.js';

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

function main() {
    // data init
    tableData = Array.from(sha1Map.values());
    tableData.forEach(bios => bios["match"] = false);
    
    // tabulator table init
    table = new Tabulator("#tab_wrapper", {
        data: tableData, 
        autoColumns: true, 
        autoColumnsDefinitions:[
            {field:"match", formatter:"tickCross", visible:true}, 
            // {field:"crc", visible:false}, 
            // {field:"md5", visible:false}, 
            {field:"name", headerMenu:headerMenu}, 
        ],
        layout:"fitColumns",
        pagination:"local",       
        paginationSize:20,        
        paginationCounter:"rows",
        responsiveLayout:"hide", // hide rows that no longer fit
        initialSort: [
            {column: "match", dir: "desc"}
          ],
        selectableRows:true,
        // rowHeader:{formatter:"rowSelection", titleFormatter:"rowSelection", headerSort:false, resizable: false, frozen:true, headerHozAlign:"center", hozAlign:"center"},
        selectableRowsCheck:function(row){
            //row - row component
            return row.getData().match === true; 
        },
        footerElement:`<button id = "zipAll">Export ZIP</button>`,
        
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
    });
}

main();