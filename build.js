// Builds the application
// To use, cd into this directory then run the command     node build

"use strict";

const meta = require('./lib/meta');


// Build webpages, JavaScript, and server side logic for working with tables.
// The parameter is metadataId in metadata.json.
// meta.build.addWebPage(1000);
// meta.build.editWebPage(1000);
// meta.build.listWebPage(1000);  
meta.build.serverSideLogic(1000);
