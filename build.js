// Builds the application
// To use, cd into this directory then run the command     node build

"use strict";

const meta = require('./lib/meta');

// Build webpages, JavaScript, and server side logic for working with tables.
// The parameter is metadataId in metadata.json.
meta.build.addWebPage(4295);
// meta.build.editWebPage(4295);
// meta.build.listWebPage(4295);  
// meta.build.serverSideLogic(4295);

// const meta = require('./lib/z_Original_Working_meta.js');
// Build webpages, JavaScript, and server side logic for working with tables.
// The parameter is metadataId in metadata.json.
// meta.build.addWebPage(3000);
// meta.build.editWebPage(3000);
// meta.build.listWebPage(3000);  
// meta.build.serverSideLogic(3000);