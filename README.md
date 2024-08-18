<img src="docs/assets/images/logo.png" alt="logo" width="200"/>

# RetroBIOS: BIOS Organizer for RetroArch

Simple web app that finds and prepares your BIOS files for usage with Libretro (or its RetroArch frontend).  

No more need to manually select, rename and move your BIOS files to some RetroArch installation somewhere, just dump them in RetroBIOS and let it sort them out for you. It does this by generating checksums for your local files (i.e. unique identifiers) and comparing them against their known counterparts as documented by Libretro [here](https://github.com/libretro/libretro-database/blob/4a98ea9726b3954a4e5a940d255bd14c307ddfba/dat/System.dat). It then refactors *copies* of all matching files to the format expected by Libretro (name *and* folder structure). 

This repository does **NOT** include the BIOS files themselves.