/*
*
*  Library for creating and managing logs
*
*/

// Dependencies
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');

// Create a container object for the library
var lib = {};


// Define the base directory of the logs folder.
lib.baseDir = path.join(__dirname, '/../data/logs');


// Append a string to a file. Create the file if it does not exist.



// Export the module
module.exports = lib;





