console.log("Hello world!");

async function fetchDatFile() {
    const url = "https://raw.githubusercontent.com/libretro/libretro-database/master/dat/System.dat";
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text(); // Use .text() for text-based .dat files
        // console.log(data); // or handle the data as needed
        return data;
    } catch (error) {
        console.error('Error fetching .dat file:', error);
    }
}


async function main() {
    console.log("Hello world!");
    const data = await fetchDatFile();
    const lines = data.split("\n");
    const systems = [];


    let x = 0;
    for (let line of lines) {
        line = line.replace("\t", "");
        console.log(line);

        if (x > 2) {
            let b = 12;

            // const regexString = /(?:name\s+(\S+))?\s*(?:size\s+(\d+))?\s*(?:crc\s+([A-F0-9]+))?\s*(?:md5\s+([a-f0-9]+))?\s*(?:sha1\s+([a-f0-9]+))?/g;            
            // matches = line.match(regexString)
            const regex = /(?:name\s+(\S+))?\s*(?:size\s+(\d+))?\s*(?:crc\s+([A-F0-9]+))?\s*(?:md5\s+([a-f0-9]+))?\s*(?:sha1\s+([a-f0-9]+))?/g;

            // Alternative syntax using RegExp constructor
            // const regex = new RegExp('(?:name\\s+(\\S+))?\\s*(?:size\\s+(\\d+))?\\s*(?:crc\\s+([A-F0-9]+))?\\s*(?:md5\\s+([a-f0-9]+))?\\s*(?:sha1\\s+([a-f0-9]+))?', 'g')
            
            // const str = `'rom ( name 3do_arcade_saot.bin size 524288 crc B832DA9A md5 8970fc987ab89a7f64da9f8a8c4333ff sha1 520d3d1b5897800af47f92efd2444a26b7a7dead )'`;
            let m;
            
            while ((m = regex.exec(line)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                let some = 12;
                // The result can be accessed through the `m`-variable.
                m.forEach((match, groupIndex) => {
                    console.log(`Found match, group ${groupIndex}: ${match}`);
                    let some = 12;
                });
            }
            

            let xx = 12;
            if (matches) {
                // Extract values from the matches array
                const name = matches[1] || 'Not provided';
                const size = matches[2] || 'Not provided';
                const crc = matches[3] || 'Not provided';
                const md5 = matches[4] || 'Not provided';
                const sha1 = matches[5] || 'Not provided';

                // Output the extracted values
                console.log('NAME:', name);
                console.log('SIZE:', size);
                console.log('CRC:', crc);
                console.log('MD5:', md5);
                console.log('SHA1:', sha1);
            } else {
                console.log('No matches found');
            }

            let c = 12;



        }

        if (line.startsWith("comment")) {
            const current_system = line.split('"')[1];
            x++;
            continue;
        }




    }


}

main();

// # Parsing Libretro's system.dat and formatting as pandas dataframe
// system_series = []
// with open(FILE_PATH, "r", encoding="utf-8") as file:
//     for line in file:
//         line = line.strip()
//         if line.startswith("comment"):
//             current_system = line.split('"')[1]
//             continue
        
//         regex_string = r'\brom.+name\s+(?P<name>"[^"]+"|\S+)(?:(?:(?:\s+size\s+(?P<size>\S+))|(?:\s+crc\s+(?P<crc>\S+))|(?:\s+md5\s+(?P<md5>\S+))|(?:\s+sha1\s+(?P<sha1>\S+)))(?=\s|$))*'
//         match = re.search(regex_string, line)
        
//         if match:
//             data = match.groupdict()
//             data["system"] = current_system
//             data["name"] = data["name"].replace('"', "")
//             system_series.append(data)

// # join dfs and drop features without checksums
// SYSTEMS = pd.DataFrame(system_series)
// SYSTEMS = SYSTEMS[~SYSTEMS["md5"].isnull()].reset_index(drop=True)

// # path to retroarch/system (if found)
// RETROARCH_PATH = find_retroarch()

// # 'cli' if user passes arguments else 'start gui'
// # Needs to be present before the @Gooey decorator (https://github.com/chriskiehl/Gooey/issues/449)
// if len(sys.argv) >= 2:
//     if "--ignore-gooey" not in sys.argv:
//         sys.argv.append("--ignore-gooey")