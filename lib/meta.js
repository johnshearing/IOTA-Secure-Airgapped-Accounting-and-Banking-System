/*
/
/ For managing data dictionary and for building the accounting system from metadata.
/
*/

// Dependencies
const fs = require('fs');
const { pipeline, Readable, Writable } = require('stream');
const util = require('util');
const StringDecoder = require('string_decoder').StringDecoder;
const helpers = require('./aHelpers');





// Define the container to hold data and functions for managing the data dictionary and for building the accounting system.
var meta = {};

// Define the branch of the meta object which will hold the functions used to build the accounting system.
meta.build = {}




// Define a function which builds a webpage and all supporting client/server code for 
// adding records to a json table in the database.
meta.build.AddWebpage = function(tableId)
{
  let dataObject = {};
  dataObject.uniqueField01Value = "";   
  dataObject.uniqueField01Name = "table.tableName";           
  dataObject.sourcePath = '/dbMetadata/metadata.json';
  dataObject.queryString = 'WHERE:;tableId:;MatchesExactly:;' + tableId + ':;';  

  let recordObject;

  // Collect information about the webpage from the metadata.
  // 1. Look in metadata.json - Read the object for the given tableId.
  helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)
  {
    if(!errorFromGetMostRecent) // Got the most recent record from getMostRecent
    {
      // Used to decode the payload buffer into readable text.
      let decoder = new StringDecoder('utf8');    

      // This instance of the Writable object gives us a place for a callback to run when the payload is received.
      const writable = new Writable();

      // Called by pipeline below. Does something useful with the payload
      writable.write = function(payload)     
      {
        let stringContainer = '';                 
        stringContainer = stringContainer + decoder.write(payload);
        recordObject = JSON.parse(stringContainer);
 
        // This is all the metadata for the table.
        // I can use recordObject to build the webpage and all supporting code for adding records to a table.
        // console.log(recordObject);

        // Assemble the webpage string from the metadata in recordObject

        // This will hold the html text of the webpage.
        
        let htmlString = 
        "<h1>" + recordObject.webPages.addPage.heading + "</h1>" + "\n" +
        "<h2>" + recordObject.webPages.addPage.forms.addForm.heading + "</h2>" + "\n" +
        "\n" + 
        "<div class=\"formWrapper\">" + "\n" +
        "  <form id=\"" + recordObject.table.tableName + "Add\" action=\"/api/" + recordObject.table.tableName + "\" method=\"POST\">" + "\n" +
        "    <div class=\"formError\"></div>" + "\n";

        // Start of: Add field controls to the html.       

        // Start of: Create one defaultElements object combining the key/value pairs of all the 
        // defaultElements objects that might exist in a table.

        // These defaultElements may not have the same name as the table fields.
        // For instance: The "hashedPassword" field in the dbUsers file is fed from the "password" defaultElement.
        // So first make an array of the field names.
        let keysOfFieldsArray = Object.keys(recordObject.fields);

        // Make a single object containing the key/value pairs found inside the defaultElements of each field.
        let combinedDefaultElementsObject = {};
        
        // There may be more than one default element for each field 
        // (Consider velocity calculated from both time and distance elements.) 
        // Or there may be no default elements for a field in which case they can still 
        // be assigned later in the formElements object if desired.
        // So loop through keysOfFieldsArray add key/value pairs found in the defaultElements 
        // object of each field and add them to combinedDefaultElementObject.
        keysOfFieldsArray.forEach(function (elementValue)
        {
          // Create an object of default elements for a field.
          let defaultElementsObject = recordObject.fields[elementValue].defaultElements;

          // Loop through defaultElementsObject.
          for (let key in defaultElementsObject) 
          {
            // Grab each defaultElement and copy to an object which will hold all defaultElements for the table.
            combinedDefaultElementsObject[key] = defaultElementsObject[key];
          }

        }); // End of: keysOfFieldsArray.forEach(function (elementValue, elementIndex, keysOfFieldsArray)

        console.log(combinedDefaultElementsObject);      
        
        // End of: Create one combinedDefaultElementsObject object combining the key/value pairs of all the defaultElements objects that might exist for each field.      
        
        // Look for key/value pairs in combinedDefaultElementsObject object that 
        // match the form elements if they exist.

        // Make an array of keys in the formElements object. 
        // There will only be one form on the add page so no need to loop through the forms object.       
        let keysOfFormElementsArray = Object.keys(recordObject.webPages.addPage.forms.formElements);

        // Look in combinedDefaultElementsObject for a match. 
        




        // Below is just to remind me that the assign method might be useful.
        // combinedDefaultElementsObject = Object.assign(o1, o2, o3);     
        
        // End of: Add field controls to the html.         

      }; // End of: writable.write = function(payload){...}

      // Passes the payload stream to the writable object which calls writable.write 
      // which does something useful with the payload.
      pipeline
      (
        payload,
        writable,
        function(error){if(error){console.log('There was an error.');}}
      );

    } // End of: if(!error) Got the most recent record from gitHashedPass
    else // There was indeed an error returned by getMostRecent when attempting to get the most current record.
    {
      helpers.log // Log the error.
      (
        7,
        'bxpa2p2t7ps3wrd1dqu7' + '\n' + 
        'The following was the error message from getMostRecent:' + '\n' +                                             
        errorFromGetMostRecent + '\n'                                                 
      ); // End of: helpers.log // Log the error.
    } // End of: Else // There was indeed an error returned by getHashedPass when attempting to get the most current record.



  }); //End of: helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)  

}// End of: meta.build.AddWebpage = function(tableId){...}




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



// Export the module
module.exports = meta;