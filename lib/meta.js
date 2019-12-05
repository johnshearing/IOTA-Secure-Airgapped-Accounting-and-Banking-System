/*
/
/ For managing data dictionary and for building the accounting system from metadata.
/
*/

// Dependencies
const fs = require('fs');
const readline = require('readline');
const { pipeline, Readable, Writable } = require('stream');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config')
const _data = require('./aData');
const helpers = require('./aHelpers');





// Define the container to hold data and functions for managing the data dictionary and for building the accounting system.
var meta = {};

// Define the branch of the meta object which will hold the functions used to build the accounting system.
meta.build = {}




// Define a function which builds a webpage for adding records to a table in the database.
meta.build.AddWebpage = function(tableName)
{
  // Collect information about the webpage from the metadata.
  // 1. Look in tableData.json - collect the path where the file will be written to.
  // 2. Look in fieldData.json - collect all the field names for the table name supplied.

  // Assemble the webpage string from the data.


  // Write the webpage string to the table.

}




// Define a function which builds the client side Javascript for adding records to a table in the database.
meta.build.AddJavascript = function(tableName)
{
  // 

}




// Define a function that builds the handler for serving up the HTML web page for adding records to a table.
meta.build.AddPageHandler = function(tableName)
{
  // 

}




// Define a function that builds the API handler which contains the code for adding records to a table.
meta.build.AddApiHandler = function(tableName)
{
  // 

}

