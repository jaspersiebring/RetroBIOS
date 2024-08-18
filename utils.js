async function fetchFile() {
    const url = "https://raw.githubusercontent.com/libretro/libretro-database/master/dat/System.dat";
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text(); 
        return data;
    } catch (error) {
        console.error('Error fetching .dat file:', error);
    }
}

async function parseDat() {
    const data = await fetchFile();
    const systemPattern = /comment\s+"([^"]+)"/g;
    const romPattern = /rom.*(?:name\s+)(\S+)?\s*(?:size\s+)(\S+)?\s*(?:crc\s+)(\S+)?\s*(?:md5\s+)(\S+)?\s*(?:sha1\s+)(\S+)?/g;
    
    let matched_systems = data.matchAll(systemPattern);
    let matched_roms = data.matchAll(romPattern);
    matched_systems = Array.from(matched_systems);
    matched_roms = Array.from(matched_roms);
    matched_systems.reverse() // so we can use .find()

    // roms can only be between systems
    const sha1Map = new Map(); // Map to index BIOS files by their SHA1 hash
    const systemDict = {}

    for (let i = 0; i < matched_roms.length; i++) {
        const current_system = matched_systems.find(system => system.index < matched_roms[i].index);
        const system = current_system[1];

        const [_, name, size, crc, md5, sha1] = matched_roms[i];
        const rom = {
            name: name.replace(/['"]/g, '') || null,
            size: size || null,
            crc: crc || null,
            md5: md5 || null,
            sha1: sha1 || null,
            system: system || null
        }
        if (sha1) {
            sha1Map.set(sha1, rom);            
            if (system) {
                if (!systemDict[system]) {
                    systemDict[system] = []; // Initialize array if not present
                }
                systemDict[system].push(rom); // Add ROM to the system's array
            }
        }
    }
    return [sha1Map, systemDict];
}

export const [sha1Map, systemDict] = await parseDat();