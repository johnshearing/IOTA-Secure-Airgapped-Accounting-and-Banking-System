// To start the application with the default staging configuration just start node with the following command:
// node index.js
// If using powershell and you wish to run a configuration different than the default staging config then,
// run the following command in PowerShell before starting node.
// $env:NODE_ENV="mySpecialConfigurationVariableFromTheConfigFile" 
// Now you can start node with the following as usual:
// node index.js
// For other command line interpreters such as BASH use the following command if you do not want the default staging config.
// NODE_ENV=mySpecialConfigurationVariable node index.js

"use strict";


// Dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/repl');
const meta = require('./lib/meta');
const helpers = require('./lib/aHelpers');


// Declare the app.
var app = {};


// Define the init function.
app.init = function()
{
  // Start the server for communication with users via http or https
  server.init();

  // Start the workers or background tasks.
  // workers.init();

  // Start the Command Line Interface (CLI).
  // Make sure the CLI starts last. 
  // That's so console.log messages from workers.init and server.init do no confuse users at the command prompt
  // setTimeout(function(){cli.init();}, 5000);

  // Get a random number at the console.
  // console.log(helpers.createRandomString(20));
  

  // Build webpages for working with tables.
  // The parameter is metadataId in metadata.json.
  // meta.build.addWebPage(1065);
  // meta.build.editWebPage(1065);
  // meta.build.listWebPage(1065);  
  // meta.build.serverSideLogic(1065);    
};


// Execute the init function
app.init();


// Export the app.
module.exports = app;

