/*
/
/ For managing data dictionary and for building the accounting system from metadata.
/ Tables must be named in the singular and in camelCase. "customerOrder not customerorders"
/ Numerals may not be used in field names except to append a zero onto the field names of
/ objects which are intended to be duplicated. For instance phone0 in the contact table when 
/ a contact may have many phone numbers nested in the document. 
/ Use "streetOne" not "street1" when field names must include numbers.
/ Do not use any punctuation in table and field names. Use only A to Z or a to z.
/
*/

"use strict";


// Dependencies
const fs = require('fs');
const path = require('path');
const { pipeline, Readable, Writable } = require('stream');
const StringDecoder = require('string_decoder').StringDecoder;
const helpers = require('./aHelpers');




// Define the container to hold data and functions for managing the data dictionary and for building the accounting system.
var meta = {};

// Define the base directory of the accounting folder.
meta.baseDir = path.join(__dirname, '/../accounting/');

// Define the branch of the meta object which will hold the functions used to build the accounting system.
meta.build = {}


// Define a function which builds server-side handlers that contain logic for serving webpages which 
// are used to interact with tables. Also built by this function are the post, put, and get handlers 
// which are the server side logic for interacting with tables.
meta.build.serverSideLogic = function(metadataId)
{
  // This object tells the getMostRecent function which record to retrive in the data dictionary (metadata.json)
  let dataObject = {};

  // We are not trying to write to the table so no need to enforce uniqueness.
  // Since this field is never empty in metadata.json, an empty string will pass the uniqueness test in getMostRecent().
  dataObject.uniqueField01Value = ""; 

  dataObject.uniqueField01Name = "tableName";           
  dataObject.path = '/database/dbMetadata/metadata.json';
  dataObject.queryString = 'WHERE:;metadataId:;MatchesExactly:;' + metadataId + ':;';  

  let recordObject;
  let htmlString = "";

  // Collect information about the webpage from the metadata.
  // 1. Look in metadata.json - Read the object for the given metadataId.
  helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)
  {
    if(!errorFromGetMostRecent) // Got the most recent record from getMostRecent
    {
      // Used to decode the payload buffer into readable text.
      let decoder = new StringDecoder('utf8');    

      // This instance of the Writable object gives us a place for a callback to run when the payload is received.
      const writable = new Writable();

      // Called by pipeline below.
      // Here is where we process the single line of json returned in the payload to make the the handlers.
      writable.write = function(payload)     
      {
        let stringContainer = '';                 
        stringContainer = stringContainer + decoder.write(payload);
        recordObject = JSON.parse(stringContainer);
 
        // All the metadata for the table is in record object.
        // Assemble the webpage string from the metadata in recordObject.

        let tableNameInTitleCase = recordObject.tableName[0].toUpperCase() + recordObject.tableName.slice(1);   

        // Figure out how many directories deep the table is in relation to the root directory of the application.
        // To do this we count the slashes in the directory path for the table we are handling and add two.
        // Thats's how many instances of "../" we need to add the require string to reach code in the lib directory.
        let nestLevel = recordObject.directory.split('/').length + 2;

        let nestString = ""

        for (let loopCount = 0; loopCount < nestLevel - 1; loopCount = loopCount + 1) 
        { 
          nestString = nestString + "../";
        }
        // End of: Figure out how many directories deep...


        htmlString = htmlString + 
`/*
/ Handlers for the "${recordObject.tableName}" table.
/ This program was built by meta.js starting at yx52pvsi0kn9p5o46hrq
/ Any changes made to this program will be overwritten next time the application is generated.
/ Make your changes in the generator meta.js or in the data dictionary metadata.json
*/

"use strict";

// Dependencies
const fs = require('fs');
const readline = require('readline');
const { pipeline, Readable, Writable } = require('stream');
const StringDecoder = require('string_decoder').StringDecoder;
const _data = require('${nestString}lib/aData');
const helpers = require('${nestString}lib/aHelpers');


// Create a container for all the handlers
let ${recordObject.tableName} = {};




// Define the handler function that serves up the HTML page for searching and listing ${recordObject.tableName} records.
// Behavior from meta.js at gg9ec14lo9rqjk7kxz7f
${recordObject.tableName}.serveListPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : '${tableNameInTitleCase} List',
      'body.class' : '${recordObject.tableName}List',     
      'tableName':'${recordObject.tableName}',
      "tableLabel":"${tableNameInTitleCase}",    
      'head.clientCode' : '', // The HTML header template must see something or an empty string.         
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/${recordObject.directory}/${recordObject.tableName}List', templateData, function(errorGetTemplate, str)
    {
      if(!errorGetTemplate && str) // If there were no errors and a template was returned
      {
        // Add the universal header and footer.
        helpers.addUniversalTemplates(str, templateData, function(errorAddUnivTemplates, str)
        {
          if(!errorAddUnivTemplates && str) // if no error and template was returned:
          {
            // Return that page as html
            callback(200, str, 'html');
          } 
          else // there was an error or the concatenated templates were not returned.
          {
            helpers.log
            (            
              5,
              '${helpers.createRandomString(20)}' + '\\n' +
              'There was an error or the concatenated templates were not returned.' + '\\n' +
              'This was the error:' + '\\n' +
              JSON.stringify(errorAddUnivTemplates) + '\\n'
            );

            callback(500, undefined, 'html');
          }
        }); // End of: helpers.addUniversalTemplates(str...

      } // End of: If there were no errors and a template was returned
      else // There was an error or no template was returned.
      {
        helpers.log
        (
          5,
          '${helpers.createRandomString(20)}' + '\\n' +
          'There was an error or no template was returned.' + '\\n' +
          'This was the error:' + '\\n' +
          JSON.stringify(errorGetTemplate) + '\\n'
        );

        // Send back status code for Internal Server Error, an undefined payload, and contentType of html.
        callback(500, undefined, 'html');
      }
    }); // End of: call to helpers.getTemplate(...

  } // End of: if the method is get
  else // Method not get. Only gets allowed.
  {
    helpers.log
    (
      5,
      '${helpers.createRandomString(20)}' + '\\n' +
      'Method not get. Only gets allowed.' + '\\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: ${recordObject.tableName}.serveListPage = function(data, callback){...}
// End of:// Define the handler function that serves up the HTML page for searching and listing ${recordObject.tableName} records.




// Define the handler function that serves up the HTML page for creating new ${recordObject.tableName} records.
// Behavior from meta.js at xenz5eipqot8nym0eev3
${recordObject.tableName}.serveAddPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : 'Create a New ${tableNameInTitleCase}',
      'head.description' : 'For creating a new ${recordObject.tableName} record',
      'body.class' : '${recordObject.tableName}Add', 
      'head.clientCode' : '', // The HTML header template must see something or an empty string.      
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/${recordObject.directory}/${recordObject.tableName}Add', templateData, function(errorGetTemplate, str)
    {
      if(!errorGetTemplate && str) // If there were no errors and a template was returned
      {
        // Add the universal header and footer.
        helpers.addUniversalTemplates(str, templateData, function(errorAddUnivTemplates, str)
        {
          if(!errorAddUnivTemplates && str) // if no error and template was returned:
          {
            // Return that page as html
            callback(200, str, 'html');
          } 
          else // there was an error or the concatenated templates were not returned.
          {
            helpers.log
            (            
              5,
              '${helpers.createRandomString(20)}' + '\\n' +
              'There was an error or the concatenated templates were not returned.' + '\\n' +
              'This was the error:' + '\\n' +
              JSON.stringify(errorAddUnivTemplates) + '\\n'
            );

            callback(500, undefined, 'html');
          }
        }); // End of: helpers.addUniversalTemplates(str...

      } // End of: If there were no errors and a template was returned
      else // There was an error or no template was returned.
      {
        helpers.log
        (
          5,
          '${helpers.createRandomString(20)}' + '\\n' +
          'There was an error or no template was returned.' + '\\n' +
          'This was the error:' + '\\n' +
          JSON.stringify(errorGetTemplate) + '\\n'
        );

        // Send back status code for Internal Server Error, an undefined payload, and contentType of html.
        callback(500, undefined, 'html');
      }
    }); // End of: call to helpers.getTemplate(...

  } // End of: if the method is get
  else // Method not get. Only gets allowed.
  {
    helpers.log
    (
      5,
      '${helpers.createRandomString(20)}' + '\\n' +
      'Method not get. Only gets allowed.' + '\\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: ${recordObject.tableName}.serveAddPage = function(data, callback){...}
// End of: Define the handler function that serves up the HTML page for creating new ${recordObject.tableName} records.




// Define the handler function that serves up the HTML page for editing ${recordObject.tableName} records.
// Behavior from meta.js at 2a4tb24fsq3de66ti8c4
${recordObject.tableName}.serveEditPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : 'Edit a ${tableNameInTitleCase}',     
      'body.class' : '${recordObject.tableName}Edit',
      'selected.${recordObject.tableName}Id' : data.queryStringObject.${recordObject.tableName}Id,  
      'head.clientCode' : '', // The HTML header template must see something or an empty string.     
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/${recordObject.directory}/${recordObject.tableName}Edit', templateData, function(errorGetTemplate, str)
    {
      if(!errorGetTemplate && str) // If there were no errors and a template was returned
      {
        // Add the universal header and footer.
        helpers.addUniversalTemplates(str, templateData, function(errorAddUnivTemplates, str)
        {
          if(!errorAddUnivTemplates && str) // if no error and template was returned:
          {
            // Return that page as html
            callback(200, str, 'html');
          } 
          else // there was an error or the concatenated templates were not returned.
          {
            helpers.log
            (            
              5,
              '${helpers.createRandomString(20)}' + '\\n' +
              'There was an error or the concatenated templates were not returned.' + '\\n' +
              'This was the error:' + '\\n' +
              JSON.stringify(errorAddUnivTemplates) + '\\n'
            );

            callback(500, undefined, 'html');
          }
        }); // End of: helpers.addUniversalTemplates(str...

      } // End of: If there were no errors and a template was returned
      else // There was an error or no template was returned.
      {
        helpers.log
        (
          5,
          '${helpers.createRandomString(20)}' + '\\n' +
          'There was an error or no template was returned.' + '\\n' +
          'This was the error:' + '\\n' +
          JSON.stringify(errorGetTemplate) + '\\n'
        );

        // Send back status code for Internal Server Error, an undefined payload, and contentType of html.
        callback(500, undefined, 'html');
      }
    }); // End of: call to helpers.getTemplate(...

  } // End of: if the method is get
  else // Method not get. Only gets allowed.
  {
    helpers.log
    (
      5,
      '${helpers.createRandomString(20)}' + '\\n' +
      'Method not get. Only gets allowed.' + '\\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: ${recordObject.tableName}.serveEditPage = function(data, callback){...}
// End of: Define the handler function that serves up the HTML page for editing ${recordObject.tableName} records.




// Router for ${recordObject.tableName} functions
// Define a function which calls the requested get, post, put, or delete subhandler function for ${recordObject.tableName} 
// and passes to the chosen subhandler the client's request object and the callback function.
// Behavior from meta.js at lw39etuyhw7wb82hv9ct
${recordObject.tableName}.${recordObject.tableName} = function(data, callback)
{
  // Create an array of acceptable methods.
  var acceptableMethods = ['post', 'get', 'put'];

  // if the requested method is one of the acceptable methods:
  if (acceptableMethods.indexOf(data.method) > -1) 
  {
    // then call the appropriate ${recordObject.tableName} subhandler.
    ${recordObject.tableName}._${recordObject.tableName}[data.method](data, callback);
  } 
  // Otherwise the method was not one of the acceptable methods:
  else 
  {
    helpers.log
    (
      5,
      '${helpers.createRandomString(20)}' + '\\n' +
      'The method was not one of the acceptable methods' + '\\n'
    ); 

    // so send back status 405 (Not Allowed).
    callback(405);
  }
}; // End of: ${recordObject.tableName}.${recordObject.tableName} = function(data, callback){...}
//End of: Router for ${recordObject.tableName} functions




// Create a subobject within the handlers object for the ${recordObject.tableName} submethods (post, get, put, and delete)
${recordObject.tableName}._${recordObject.tableName} = {};


`

        // ???? Will need to return here frequently to copy variables from this area.

        // Creating the POST, PUT, and GET handlers.
        // Start of: Collect information about the fields.       
        // Create one defaultElements object combining the key/value pairs of all the defaultElements objects that might exist in a table.

        
        // These defaultElements may not have the same name as the table fields.
        // For instance: The "hashedPassword" field in the user file is fed from the "password" defaultElement.
        // We do this because the password is hashed before it is written to the table. 
        // hashedPassword is a calculated field. It is not fed directly from the user's input.
        // Some of these fields may be objects that contain more fields and we will need the pathName to all of them.
        // The pathNames to all these fields will be pushed into this array.
        let keysOfFieldsArray = [];

        let fieldsObject = recordObject.fields;

        // Loop thorough the top level of fields object - drilling into it as required.
        for (let fieldKey in fieldsObject)
        {
          // If this top level field is an object containing more fields inside...
          if(fieldsObject[fieldKey][fieldKey + "0"])
          {
            // Declare a function that we will use to drill into the object.
            function drillIntoObject(address, objKey, objectNestLevel, previousPath)
            {      
              // if the subfield is also an object then this function calls itself using the subfield parameters.
              // This will continue drilling in until we are at the end of the branches
              if(address[objKey][objKey + "0"])              
              { 
                // Check each property of the subobject to see if it too is an object.
                for (let property in address[objKey][objKey + "0"])
                {
                  // If the property is also an object
                  if(address[objKey][objKey + "0"][property][property + "0"])
                  {
                    // This function calls itself so as to go deeper into the object
                    drillIntoObject(address[objKey][objKey + "0"], property, objectNestLevel + 1, previousPath + objKey + "_" + objKey + "0_");                    
                  }
                  else // This property is not an object. We are at the end of the branch where we encounter a data field.
                  { 
                    // Assemble the path through the current object to the current data field.
                    let objectPath = objKey + "_" + objKey + "0" + "_" + property;

                    // If the current object is nested then prepend the path to include the parent objects.
                    objectPath = previousPath.length === 0 ? objectPath : previousPath + objectPath;                     

                    keysOfFieldsArray.push(objectPath);

                  } // End of: else - This property is not an object.
                } // End of: for-let Check each property of the subobject to see if it too is an object.
              } // End of: if the subfield is also an object
            }; // End of: function drillIntoObject(address, objKey, objectNestLevel, previousPath){...}
            
            // Keep track of how deep we have drilled into the object.
            let objectNestLevel = 1;

            // Call the function defined above. 
            // This function will call itself several times if drilling into nested objects is required.
            drillIntoObject(fieldsObject, fieldKey, objectNestLevel, "")
          }
          else // This top level field is not an object - It's just a regular field.
          {
            // Push the pathname to this top level field onto the array
            keysOfFieldsArray.push(fieldKey);            
          }

        } // End of: for (let fieldKey in fieldsObject){...}
        // End of: // Loop thorough the top level fields         




        // Make a single object containing the key/value pairs found inside the defaultElements of each field.
        let combinedDefaultElementsObject = {};
        
        // There may be more than one default element for each field 
        // (Consider velocity calculated from both time and distance elements.) 
        // So loop through fieldsObject from the data dictionary and add key/value pairs 
        // found in the defaultElements object of each field object and add them to the
        // combinedDefaultElementObject. What we are doing is copying defaultElements 
        // from different branches of the recordObject tree into one new object so that 
        // we can work with them.

        // Loop thorough the top level fields
        for (let fieldKey in fieldsObject)
        {
          // If this top level field is an object containing more fields inside...
          if(fieldsObject[fieldKey][fieldKey + 0])
          {
            // Declare a function that we will use to drill into the object.
            function drillIntoObject(address, objKey, previousPath, objectNestLevel)
            {      
              // Check each property of the subobject to see if it too is an object.
              for (let property in address[objKey][objKey + "0"])
              {
                // If the property is also an object then drill deeper.
                if(address[objKey][objKey + "0"][property][property + "0"])
                {
                  // This function calls itself so as to go deeper into the object.
                  drillIntoObject(address[objKey][objKey + "0"], property, previousPath + objKey +  "_" + objKey + "0_", objectNestLevel + 1);
                }
                else // This property is not an object. We are at the end of the branch where we encounter a data field.
                { 
                  // Assemble the path through the current object to the current data field.
                  let objectPath = objKey + "_" + objKey + "0_" + property;

                  // If the current data field is nested then prepend the path to include the parent objects.
                  objectPath = previousPath.length === 0 ? objectPath : previousPath + objectPath; 

                  // Grab all the defaultElements (form controls) for this data field.
                  // There may be several - Think time and distance controls required to calculate a velocity field
                  let defaultElementsObject = address[objKey][objKey + "0"][property].defaultElements;

                  // Loop through defaultElementsObject.
                  for (let elementKey in defaultElementsObject) 
                  {
                  // Grab each defaultElement and copy to an object which will hold all defaultElements for the table.
                  combinedDefaultElementsObject[objectPath] = defaultElementsObject[elementKey];
                  }
                } // End of: else - This property is not an object.
              } // End of: for (let property in address[objKey].subObject){Check each property of the subobject to see if it too is an object.}
            }; // End of: function drillIntoObject(address, objKey, previousPath, objectNestLevel){...}
            
            // Keep track of how deep we have drilled into the object.
            let objectNestLevel = 1;

            // Call the function defined above. 
            // This function will call itself several times if drilling into nested objects is required.
            drillIntoObject(fieldsObject, fieldKey, "", objectNestLevel)
          }
          else // This top level field is not an object - It's just a regular data field.
          {
            // Create an object of default elements for the current data field.
            let defaultElementsObject = fieldsObject[fieldKey].defaultElements;


            // Loop through defaultElementsObject.
            for (let elementKey in defaultElementsObject) 
            {
              // Grab each defaultElement and copy to an object which will hold all defaultElements for this table.
              combinedDefaultElementsObject[elementKey] = defaultElementsObject[elementKey];
            } 

          }
        } // End of: for (let fieldKey in fieldsObject){...}
        // End of: // Loop thorough the top level fields 


        // Start of: Assemble the POST Handler

        htmlString = htmlString +
`

// ${recordObject.tableName} - post subhandler
// Define the ${recordObject.tableName} post subhandler function.
// This function appends a record to the ${recordObject.tableName} file.
// Behavior from meta.js at 1723qxikk1l3ru0vfrny 
${recordObject.tableName}._${recordObject.tableName}.post = function(data, callback)
{
  // Field validation starts here.
`

        let lastPart;

        // Start of: Insert validation code for the post handler. ????
        // 1. Loop through the combinedDefaultElementsObject.
        for (let fieldKey in combinedDefaultElementsObject) 
        {
          // console.log("2. This is combinedDefaultElementsObject[" + fieldKey + "]: " + "\n",combinedDefaultElementsObject[fieldKey], "\n\n");

          // If there is a zero in the fieldKey then we are dealing with an object which contains fields inside.
          if(fieldKey.includes("0"))
          {
            // Break up the fieldKey into an array split on the underscore.
            let fieldKeyPartsArray = fieldKey.split("_");

            // Get the last part of the fieldKey.
            // That's everything after the last underscore.
            // It's the fieldName without the object path.
            lastPart = fieldKeyPartsArray[fieldKeyPartsArray.length - 1]   
            
            htmlString = htmlString +
`
  // Start of: Load the ${lastPart}Array dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let ${lastPart}KeyArray = [`
  
            // Loop through the *PartsArray adding any elements found to htmlString
            // that do not have a zero or that are not the string "subObject".
            fieldKeyPartsArray.forEach
            (
              function(currentPart, fieldKeyPartsArrayIndex, fieldKeyPartsArrayAsParam)
              {
                if(!currentPart.includes("0") && currentPart != "subObject")
                {
                  htmlString = htmlString + "\"" + currentPart + "\"";

                  // Add a coma if we are not on the last element.
                  if(fieldKeyPartsArrayIndex < fieldKeyPartsArrayAsParam.length - 1)
                  {
                    htmlString = htmlString + ", ";
                  }
                }
              }
            );


            htmlString = htmlString +
`]

  let ${lastPart}Array = loadPayloadArray([], ${lastPart}KeyArray, data.payload, 0, 0, "", true)[0];
  // End of: Load the ${lastPart}Array dynamically once the payload is known. 
`            
          }
          else // This is not a container object but rather a regular data field.
          {
            htmlString = htmlString +          
            "  // Get " + fieldKey + " from payload" + "\n" +
            
            "  let " + fieldKey + " = data.payload[\"" + fieldKey + "\"];" + "\n" +          
            "\n";  
          }


          // Merge the default validation objects with the post validation objects.
          let mergedValidationObject = extend(true, combinedDefaultElementsObject[fieldKey].validation.default, combinedDefaultElementsObject[fieldKey].validation.post);            
          // console.log("3 The mergedValidationObject is:\n", mergedValidationObject, "\n")

          // Loop through the validation property of each field.
          for (let validationKey in mergedValidationObject)
          {
            // console.log("4. Below is the value of mergedValidationObject[" + validationKey + "] : \n" , mergedValidationObject[validationKey], "\n\n");            

            if(validationKey === "passIfString")
            {
              // If the user supplied the validation code
              if(mergedValidationObject[validationKey])
              {
                htmlString = htmlString + 
                "  // " + validationKey + "\n" +
                "  " + mergedValidationObject[validationKey] + "\n" +
                "\n";
              }
              else // No user supplied validation. Create a generic validation code
              {
                // If there is a zero in the fieldKey then we are dealing with an object which contains fields inside.
                if(fieldKey.includes("0"))
                {
                  htmlString = htmlString + 
`                  
  // Start of: Validate elements in the ${lastPart}Array
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  ${lastPart}Array.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : '${lastPart} must be of datatype string'});}
  });
  // End of: Validate elements in the ${lastPart}Array

`
                }
                else // No zero in the fieldkey. This is a not a container object but rather a data field.
                {
                  htmlString = htmlString +                 
                  "  // passIfString Default behavior from meta.js at qif5xwvzgr7efln9xtr8" + "\n" +
                  "  if(typeof(" + fieldKey + ") != 'string'){return callback(400, {'Error' : '" + fieldKey + " must be of datatype string'});}" + "\n" + 
                  "\n";
                }
              } // End of: No user supplied validation. Create a generic validation code
            } // End of: if(validationKey === "passIfString")
            else if(validationKey === "passIfNotEmpty")
            {
              // If the user supplied the validation code
              if(mergedValidationObject[validationKey])
              {
                htmlString = htmlString + 
                "  // " + validationKey + "\n" +
                "  " + mergedValidationObject[validationKey] + "\n" +
                "\n";
              }
              else // No user supplied validation. Create a generic validation code.
              {
                htmlString = htmlString + 
                "  // passIfNotEmpty Default behavior from meta.js at eojwivwlhxkm1b837n2o" + "\n" +                
                "  if(!" + fieldKey + " || " + fieldKey + ".trim().length === 0){return callback(400, {'Error' : 'No " + fieldKey + " was entered'});}else{" + fieldKey + " = " + fieldKey + ".trim()}" + "\n" +
                "\n";
              }
            }
            else if(validationKey === "passIfString&NotEmptyThenTrim")
            {
              // If the user supplied the validation code in the data dictionary
              if(mergedValidationObject[validationKey])
              {
                htmlString = htmlString + 
                "  // " + validationKey + "\n" +
                "  " + mergedValidationObject[validationKey] + "\n" +
                "\n";
              }
              else // No user supplied validation code. Create a generic validation string.
              {
                // If there is a zero in the fieldKey then we are dealing with an object which contains fields inside.
                if(fieldKey.includes("0"))
                {
                  htmlString = htmlString + 
`                  
  // Start of: Validate elements in the ${lastPart}Array
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at fkb3ulfqr09ryyc0rb0d
  ${lastPart}Array.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : '${lastPart} must be of datatype string'});}
    if(!arrayElement[1] || arrayElement[1].trim().length === 0){return callback(400, {'Error' : 'No ${lastPart} was entered'});}else{arrayElement[1] = arrayElement[1].trim()}
  });
  // End of: Validate elements in the ${lastPart}Array

`

                } // End of: If there is a zero in the fieldKey...
                else // No zero in the fieldkey. This is a not a container object but rather a data field.
                {
                  htmlString = htmlString + 
`  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(${fieldKey}) != 'string'){return callback(400, {'Error' : '${fieldKey} must be of datatype string'});}
  if(!${fieldKey} || ${fieldKey}.trim().length === 0){return callback(400, {'Error' : 'No ${fieldKey} was entered'});}else{${fieldKey} = ${fieldKey}.trim()}

`
                } // End of: Else: No zero in the fieldkey. This is a not a container object but rather a data field.
              } // End of:  // No user supplied validation code. Create a generic validation string.
            } // End of: else if(validationKey === "passIfString&NotEmptyThenTrim")
            else if(validationKey === "passMenuItemsOnly")
            {
              // If the user supplied the validation code in the data dictionary
              if(mergedValidationObject[validationKey])
              {
                htmlString = htmlString + 
                "  // " + validationKey + "\n" +
                "  " + mergedValidationObject[validationKey] + "\n" +
                "\n";
              }
              else // No user supplied validation code. Create a generic validation string.
              {

                // If there is a zero in the fieldKey then we are dealing with an object which contains fields inside.
                if(fieldKey.includes("0"))
                {
                  htmlString = htmlString + 
`  
  // Start of: Validate elements in the ${lastPart}Array
  // passMenuItemsOnly
  // Behavior from meta.js at 69nq4ck9lcdakwpb58o6
  ${lastPart}Array.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string')
    {
      return callback(400, {'Error' : '${lastPart} must be of datatype string'});
    }
  
    if
    (
`
                  
                  // Build validation for the menu options.
                  let isFirstOptionWrite = true;

                  Object.keys(combinedDefaultElementsObject[fieldKey].options).forEach
                  (
                    function(optionKey)
                    {
                      // If the option is not blank and this is the first option to be validated.
                      if(optionKey && isFirstOptionWrite)
                      {
                        htmlString = htmlString + 
                        "      arrayElement[1] !== \"" + optionKey + "\"" + "\n";

                        isFirstOptionWrite = false;

                      }
                      else if(optionKey)
                      {
                        htmlString = htmlString + 
                        "      && arrayElement[1] !== \"" + optionKey + "\"" + "\n";
                      }
                    }
                  );                


                  htmlString = htmlString + 
`    )
    {
      return callback(400, {'Error' : '${lastPart} does not match menu options'});
    }
  });
  // End of: Validate elements in the ${lastPart}Array

`
                }
                else // This is not a container object but rather just a regular data field.
                {
                  
                  htmlString = htmlString +    
`
  // Behavior from meta.js at ettt3o23onrmd04b94jq
  // This generated behavior has not been tested yet. ????
  if(typeof(${fieldKey}) != 'string')
  {
    return callback(400, {'Error' : '${fieldKey} must be of datatype string'});
  }
  
  if
  (
`

                  // Build validation for the menu options.
                  let isFirstOptionWrite = true;

                  Object.keys(combinedDefaultElementsObject[fieldKey].options).forEach
                  (
                    function(optionKey)
                    {
                      // If the option is not blank and this is the first option to be validated.
                      if(optionKey && isFirstOptionWrite)
                      {
                        htmlString = htmlString + 
                        "      ${fieldKey} !== \"" + optionKey + "\"" + "\n";

                        isFirstOptionWrite = false;

                      }
                      else if(optionKey)
                      {
                        htmlString = htmlString + 
                        "      && ${fieldKey} !== \"" + optionKey + "\"" + "\n";
                      }
                    }
                  );


                  htmlString = htmlString +
`    
  )
  {
    return callback(400, {'Error' : 'No ${fieldKey} was selected from menu'});
  }
  else
  {
    ${fieldKey} = ${fieldKey}.trim()
  }

`                                 
                } // End of: Else: This is not a container object but rather just a regular data field.
              } // End of: Else: No user supplied validation code. Create a generic validation string.
            } // End of: else if(validationKey === "passMenuItemsOnly"){...}
            else // validationKey must be user defined.
            {
              // If the user supplied the validation string
              if(mergedValidationObject[validationKey])
              {
                htmlString = htmlString + 
                "  // " + validationKey + "\n" +
                "  " + mergedValidationObject[validationKey] + "\n" +
                "\n";
              }
            }         
          } // End of: for for (let validationKey in mergedValidationObject){...}                    
        } // End of: for (let fieldKey in combinedDefaultElementsObject)       
        // End of: Insert validation code.


        // Start of Enforce unique fields.
        // This code can only handle one uniqueId for each table for now.
        // Later we will update this code to handle as many uniqueIds as may be required.
        // Looks like we just need to put this section of code in a loop.
        // Or better, Test for all the unique fields at the same time in a single loop.
        // This code already handles the possibility that no fields are required to be unique.
        // In that case the loop will not run and the following code will not be inserted.
        // This causes the code that normally runs inside to be indented one tab too many.
        // That can be fixed by running a beautifier on the code. 
        // I intend to build a simple beautifier into this generator but since this is only aesthetic it can wait.

        // 1. Create an array with all the field names for fields which must be unique.
        let uniqueFieldsArray = [];

        // Loop thorough the top level fields drilling in as required.
        for (let fieldKey in fieldsObject)
        {
          // If this top level field is an object containing more fields inside...
          if(fieldsObject[fieldKey].subObject)
          {
            // Declare a function that we will use to drill into the object.
            function drillIntoObject(address, objKey, previousObjKey, previousKeyPart, objectNestLevel)
            {      
              // if the subfield is also an object then this function calls itself using the subfield parameters.
              // This will continue drilling in until we are at the end of the branches
              if(address[objKey].subObject)
              { 
                // Check each property of the subobject to see if it too is an object.
                for (let property in address[objKey].subObject)
                {
                  // If the property is also an object
                  if(address[objKey].subObject[property].subObject)
                  {
                    // This function calls itself so as to go deeper into the object
                    drillIntoObject(address[objKey].subObject, property, objKey, "subObject", objectNestLevel + 1);
                  }
                  else // This property is not an object. We are at the end of the branch where we encounter a data field.
                  { 
                    // Assemble the path through the current object to the current data field.
                    let objectPath = objKey + "." + "subObject" + "." + property;

                    // If the current object is nested then prepend the path to include the parent objects.
                    objectPath = previousObjKey.length === 0 ? objectPath : previousObjKey + "." + previousKeyPart + "." + objectPath;

                    // Check if the current field has a unique constraint.
                    if(address[objKey].subObject[property].unique === true)
                    {
                      uniqueFieldsArray.push(objectPath);   
                    } 
                  } // End of: else - This property is not an object.
                } // End of: for-let Check each property of the subobject to see if it too is an object.
              } // End of: if the subfield is also an object
            }; // End of: function drillIntoObject(address, objKey, previousObjKey, previousKeyPart, objectNestLevel){...}
            
            // Keep track of how deep we have drilled into the object.
            let objectNestLevel = 1;

            // Call the function defined above. 
            // This function will call itself several times if drilling into nested objects is required.
            drillIntoObject(fieldsObject, fieldKey, "", "", objectNestLevel)
          }
          else // This top level field is not an object - It's just a regular data field.
          {
            if(fieldsObject[fieldKey].unique === true)
            {
              uniqueFieldsArray.push(fieldKey);   
            }          
          }

        } // End of: for (let fieldKey in fieldsObject){...}
        // End of: // Loop thorough the top level fields 
  

        // If there are unique key fields then insert code that checks uniqueness of the candidate value.
        if(uniqueFieldsArray.length != 0)
        {
          let uniqueFieldInTitleCase = uniqueFieldsArray[0][0].toUpperCase() + uniqueFieldsArray[0].slice(1);

          htmlString = htmlString +
`
  // Enforcing uniqueness of the ${uniqueFieldsArray[0]} field.
  // Will toggle this to false if we find the ${uniqueFieldsArray[0]} already exists in ${recordObject.tableName}.
  // Behavior from meta.js at rmkfkaef7xo3gyvnvgm4
  let ${uniqueFieldsArray[0].split(".").join("_")}_IsUnused = true;  

  // Using this to track the primary key of a record that we might encounter with the candidate ${uniqueFieldsArray[0]}.
  // If we encounter this primary key again we will check to see if the ${uniqueFieldsArray[0]} has been changed.
  // If it has then the candidate ${uniqueFieldsArray[0]} will be marked as available again.
  let uniqueIdOfRecordHoldingCandidate_${uniqueFieldInTitleCase.split(".").join("_")} = false; 
                        

  // To ensure the ${uniqueFieldsArray[0]} is unique we will read every record in 
  // ${recordObject.tableName} and compare with the ${uniqueFieldsArray[0]} provided.

  // This function sets up a stream where each chunk of data is a complete line in the ${recordObject.tableName} file.
  let readInterface = readline.createInterface
  (
    { // specify the file to be read.
      input: fs.createReadStream(_data.baseDir + '/${recordObject.directory}' + '/' + '${recordObject.tableName}' + '.json')
    }
  );
  
  // Look at each record in the file and set a flag if the ${uniqueFieldsArray[0]} matches the ${uniqueFieldsArray[0]} provided by the user.
  readInterface.on('line', function(line) 
  {
    // Convert the JSON string from ${recordObject.tableName} into an object.
    let lineObject = JSON.parse(line);

    // Several different record sets with the supplied ${uniqueFieldsArray[0]} and the same ${recordObject.tableName}Id 
    // may exist already if the record has been changed or deleted prior to this operation.

    // A modified record is simply a new record with the same ${recordObject.tableName}Id as an existing record.
    // The newest record is the valid record and the older record is history.  
    // So position matters. These tables should never be sorted.
    // These tables can be packed however to get rid of historical records.

    // The transaction log also maintains the history and the current state of the entire database.
    // So the transaction log can be used to check the integrity of the every table.
    // No records in the transaction log should be removed.

    // A deleted record in this system is simply an identical record appended with 
    // the deleted field set to true. 
    // So depending on how many times the ${uniqueFieldsArray[0]} has been added and deleted there may 
    // be several sets of records in the ${recordObject.tableName} table currently 
    // that have the same ${uniqueFieldsArray[0]} and the same ${recordObject.tableName}Id.
    // The table can be packed occasionally to get rid of these deleted record sets. 
    // Deletes are handled as appends with the deleted field set to true because real 
    // deletes tie up the table for a long time.

    // In this table, the ${uniqueFieldsArray[0]} is a unique key as well as the ${recordObject.tableName}Id.
    // The ${recordObject.tableName}Id also serves as the primary key.
    // The difference is that the ${recordObject.tableName}Id may never change whereas the ${uniqueFieldsArray[0]}
    // may be changed to something different if a valid record for that ${uniqueFieldsArray[0]}
    // does not already exist.    

    // When adding a record we first make sure that the record does NOT already exist.
    // There should be no record with the current ${uniqueFieldsArray[0]} or if there is then 
    // the last record with this ${uniqueFieldsArray[0]} must have the deleted field set to true.

    // When changing a record we:
    // 1. Make sure that the record with this ${uniqueFieldsArray[0]} does indeed exist and...
    // 2. that the last instance of a record with this ${uniqueFieldsArray[0]} is not deleted.
  
    // It is ok to add a new record with this same ${uniqueFieldsArray[0]} again when the last instance 
    // of this record encountered in the stream has the deleted flag set to true. 
    // In that case, the ${recordObject.tableName}Id will be different but the ${uniqueFieldsArray[0]} will be the same.         

    // As explained above, only the last matching record for a particular ${uniqueFieldsArray[0]} matters.
    // It's like that old game "She loves me, She loves me not".

    if (${uniqueFieldsArray[0].split(".").join("_")} == lineObject.${uniqueFieldsArray[0]}) // we found a matching entry
    {
      if (lineObject.deleted == false) // The record has not been deleted so it's a duplicate. Not unique.
      {
        ${uniqueFieldsArray[0].split(".").join("_")}_IsUnused = false; // This flag used in the on close event listener below. 

        // If this record (record with this primary key) is encountered further down where it has been deleted 
        // or where the ${uniqueFieldsArray[0]} has been changed with a put operation:
        // Then the candidate ${uniqueFieldsArray[0]} will be available again as we continue searching through the records.
        // We are already checking if this ${uniqueFieldsArray[0]} becomes available again by deletion.
        // Now we need to check if the ${uniqueFieldsArray[0]} becomes available because the record with this primary 
        // key gets changed with a new ${uniqueFieldsArray[0]}.
        // That will make the candidate ${uniqueFieldsArray[0]} unique and available again.
        // So record this global sequential unique id (the ${recordObject.tableName}Id in this case).
        // If we find the gsuid again, then check if the ${uniqueFieldsArray[0]} has changed.
        // If it has been changed then:
        // 1. Set the ${uniqueFieldsArray[0].split(".").join("_")}_IsUnused flag to true again
        // 2. clear out the variable tracking the uniqueId of the record.
        uniqueIdOfRecordHoldingCandidate_${uniqueFieldInTitleCase.split(".").join("_")} = lineObject.${recordObject.tableName}Id;
      }
      // The matching record we found has been deleted so it may as well not exist. The new record is still unique.
      else 
      {
        ${uniqueFieldsArray[0].split(".").join("_")}_IsUnused = true;
      } 
    } // End of: if we found a matching entry

    // If we have seen this primary key before and flagged the ${uniqueFieldsArray[0]} already taken 
    // because it was identical to the ${uniqueFieldsArray[0]} we are trying to add and it had not been deleted:

    // Ok, the current record is not holding the candidate ${uniqueFieldsArray[0]} but 
    // maybe it was in the past and someone changed it.
    // if the candidate ${uniqueFieldsArray[0]} is flagged unavailable and we are looking at the record that was flagged:
    else if(${uniqueFieldsArray[0].split(".").join("_")}_IsUnused === false && uniqueIdOfRecordHoldingCandidate_${uniqueFieldInTitleCase.split(".").join("_")} === lineObject.${recordObject.tableName}Id)
    {
      // Check if the ${uniqueFieldsArray[0]} is no longer holding the candidate ${uniqueFieldsArray[0]}.
      // If it is not holding the candidate ${uniqueFieldsArray[0]} then flag the ${uniqueFieldsArray[0]} 
      // available again and clear out the variable tracking this primary key.
      ${uniqueFieldsArray[0].split(".").join("_")}_IsUnused = true;
      uniqueIdOfRecordHoldingCandidate_${uniqueFieldInTitleCase} = false;
    }

  }); // End of: readInterface.on('line', function(line){...}
  // End of: Look at each record...




  // This listener fires after we have discovered if the ${uniqueFieldsArray[0]} is 
  // unique or not, and have then closed the readable stream from ${recordObject.tableName}.
  // The callback function defined here will append the record if the ${uniqueFieldsArray[0]} 
  // was found to be unique.
  // Behavior from meta.js at aiwaoocd1uegzjbqeydk
  readInterface.on('close', function() 
  {
    // If the ${uniqueFieldsArray[0]} already exists then exit this process without appending the record.
    if (!${uniqueFieldsArray[0].split(".").join("_")}_IsUnused) 
    {      
      helpers.log
      (
        5,
        '${helpers.createRandomString(20)}' + '\\n' +
        'The ${uniqueFieldsArray[0]} : ' + ${uniqueFieldsArray[0].split(".").join("_")} + ' already exists' + '\\n'                                  
      ); // End of: helpers.log(...)

      return callback(400, {'Error' : 'The ${uniqueFieldsArray[0]} already exists'});
    }

    // If we made it to this point then the candidate ${uniqueFieldsArray[0]} is unique so continue on with the append opperation.
    // Behavior from meta.js at gwwelr17hmxvq4spdrcl
    
`          

        } // End of: if(uniqueFieldsArray.length != 0){...}
        // End of: Enforce unique fields. 




        // Start of: Insert code for writing to the database.
        htmlString = htmlString +
    `
    // Get the next global sequential unique Id and lock the database
    // Locking the database makes the system multiuser.
    // All writes to any table must first get a lock on gsuid.json
    // gsuid.json stays locked until the operation is completely finished and _data.removeLock is called.
    // This ensures that only one process is writing to the database at any one time.  
    // If the transaction fails or if it requires a rollback then the lock will remain until an administrator removes it.
    // This will halt all writes to the database until the administrator has had a chance to investigate.
    // Behavior from meta.js at lc2gqx4uqgw9o0hjtkdp       
    _data.nextId(function(error, nextIdObject)
    {

      // If we were unable to get the next gsuid then exit this process without appending the record. 
      if(error || !nextIdObject)
      {
        helpers.log
        (
          5,
          '${helpers.createRandomString(20)}' + '\\n' +
          'Unable to get the next gsuid.' + '\\n' +
          'The following was the error' + '\\n' +
          JSON.stringify(error) + '\\n'                                   
        ); // End of: helpers.log(...)

        return callback(423, {'Error' : 'Database is Locked'});
      }


      // If we got this far then we were able to lock the gsuid.json file and get the next 
      // unique id number for this record so continue on.



      // Create the ${recordObject.tableName} object. 
      // This object will be appended to ${recordObject.tableName}.json.
      // Behavior from meta.js at cmqbrt7gkxkex9z8a1qb
      let ${recordObject.tableName}Object = {};
      ${recordObject.tableName}Object.${recordObject.tableName}Id = nextIdObject.nextId;

`

        let addFormElementsObject = recordObject.webPages.addPage.forms.addForm.formElements;

        // Loop thorough the top level fieldsObject drilling in as required.
        for (let fieldKey in fieldsObject)
        {
          // Used to navigate the object tree.
          let subObjectPath = "";

          // If this top level field is an object containing more fields inside...
          if(fieldsObject[fieldKey][fieldKey + 0])
          {
            // Declare a function that we will use to drill into the object.
            function drillIntoObject(address, objKey, objectNestLevel, previousPath)
            { 
              // if the subfield is also an object then this function calls itself using the subfield parameters.
              // This will continue drilling in until we are at the end of the branches
              if(address[objKey][objKey + 0])
              { 
                // If this is the first time we were this deep in the object on this branch.
                if(objectNestLevelHistory === objectNestLevel)
                {
                  if(objectNestLevel === 1)
                  {
                    htmlString = htmlString + "\n";    
                                    
                    // Note that we are going deeper into the object.
                    subObjectPath = objKey + "." + objKey + "0";
                  }
                  else
                  {
                  // Note that we are going deeper into the object.
                  subObjectPath = subObjectPath + "." + objKey + "." + objKey + "0";
                  }                  
                  // Keeping track of how many levels deep we have already drilled.
                  // This is so we don't overwrite code that has already been generated.
                  objectNestLevelHistory = objectNestLevelHistory + 1;
                } // End of: if(objectNestLevelHistory === objectNestLevel){...}

                // Check each property of the subobject to see if it too is an object.
                for (let property in address[objKey][objKey + "0"])
                {
                  // If the property is also an object
                  if(address[objKey][objKey + "0"][property][property + "0"])
                  {
                    // This function calls itself so as to go deeper into the object
                    drillIntoObject(address[objKey][objKey + "0"], property, objectNestLevel + 1, previousPath + objKey + "_" + objKey + "0_");
                  }
                  else // This property is not an object. We are at the end of the branch where we encounter a data field.
                  { 
                    // Assemble the path through the current object to the current data field.
                    // let objectPath = objKey + "_" + "subObject" + "_" + property;

                    // If the current object is nested then prepend the path to include the parent object(s).
                    // objectPath = previousPath.length === 0 ? objectPath : previousPath + objectPath;

                    htmlString = htmlString +
                    "      " + "// Add any fields named \"" + property + "Array\" to the object we will write to the database." + "\n" +
                    "      " + recordObject.tableName + "Object = buildBranches(" + property + "Array, " + recordObject.tableName + "Object);" + "\n\n";    
                    
                  } // End of: else - This property is not an object.
                } // End of: for-let Check each property of the subobject to see if it too is an object.

                
                // Noting that we are moving back up the object tree.
                objectNestLevelHistory = objectNestLevelHistory -1;  

                // Removing the the last two branches from the subObjectPath.
                // Again, this is for noting that we are moving up the object tree.
                // Split the subObjectPath string into an array delimited by the dot. 
                // Then slice the last two items from the array.
                // Finally, join it all back together again as a string delimited by a dot.
                subObjectPath = subObjectPath.split(".").slice(0, -2).join(".");  

              } // End of: if the subfield is also an object
            }; // End of: function drillIntoObject(address, objKey, objectNestLevel, previousPath){...}
            
            // Keep track of how deep we have drilled into the object.
            let objectNestLevel = 1;
            let objectNestLevelHistory = 1;

            // Call the function defined above. 
            // This function will call itself several times if drilling into nested objects is required.
            drillIntoObject(fieldsObject, fieldKey, objectNestLevel, "")
          }
          else // This top level field is not an object - It's just a regular data field.
          {  
            // if the data field is on the form
            if(addFormElementsObject[fieldKey])
            {
              // Write out the topLevelDataField
              htmlString = htmlString +
              "      " + recordObject.tableName + "Object." + fieldKey + " = " + fieldKey + ";" + "\n";
            }
            else // the data field is not on the form.
            {
              // Initialize the data field as undefined.
              htmlString = htmlString +
              "      " + recordObject.tableName + "Object." + fieldKey + " = undefined;" + "\n";
            }
          } // End of: else: this top level field is not an object
        } // End of: for (let fieldKey in fieldsObject){...}
        // End of: // Loop thorough the top level fields 



        htmlString = htmlString +          
`      
      ${recordObject.tableName}Object.timeStamp = Date.now();
      ${recordObject.tableName}Object.deleted = false;


      // Code from the data dictionary marked postHandlerPreprocessing, if any, will be inserted below.
`      


        // Generate preprocessing code for the post handlers.
        // No code is generated if none is found in the data dictionary (meta.json)

        // Create an array to hold all the field names with path for all
        // fields which contain a calculation named putHandlerPreprocessing.
        let calculatedFieldsArray = [];

        // Will hold code found if any.
        let fieldCalculationCode = false;           

        // Loop thorough the top level fields drilling in as required.
        for (let fieldKey in fieldsObject)
        {
          // If this top level field is an object containing more fields inside...
          if(fieldsObject[fieldKey][fieldKey + "0"])
          {
            // Declare a function that we will use to drill into the object.
            function drillIntoObject(address, objKey, previousObjKey, objectNestLevel)
            {      
              // if the subfield is also an object then this function calls itself using the subfield parameters.
              // This will continue drilling in until we are at the end of the branches
              if(address[objKey][objKey + "0"])
              { 
                // Check each property of the subobject to see if it too is an object.
                for (let property in address[objKey][objKey + "0"])
                {
                  // If the property is also an object
                  if(address[objKey][objKey + "0"][property][property + "0"])
                  {
                    // This function calls itself so as to go deeper into the object
                    drillIntoObject(address[objKey][objKey + "0"], property, objKey, objectNestLevel + 1);
                  }
                  else // This property is not an object. We are at the end of the branch where we encounter a data field.
                  { 
                    // Assemble the path through the current object to the current data field.
                    let objectPath = objKey + "." + property;

                    // If the current object is nested then prepend the path to include the parent objects.
                    objectPath = previousObjKey.length === 0 ? objectPath : previousObjKey + "." + objectPath;

                    // Check if the current field contains the calculation object and if it has any properties.
                    if(address[objKey][objKey + "0"][property].calculation && Object.keys(address[objKey][objKey + "0"][property].calculation).length > 0)
                    {
                      calculatedFieldsArray.push(objectPath);  

                      // Get the (PUT Handler Pre-processing code) from the calculation object for the current field if it exists.
                      for (let calcKey in address[objKey][objKey + "0"][property].calculation)
                      {
                        if(calcKey === "postHandlerPreprocessing")
                        {
                          fieldCalculationCode = address[objKey][objKey + "0"][property].calculation[calcKey]; 
                          break;           
                        }
                      } 


                      if(fieldCalculationCode) // If the programmer entered a preprocessing calculation for this field in data dictionary.
                      {
                        htmlString = htmlString +
              `                   
${fieldCalculationCode}
                
                `
                                          
                      } // End of: if(fieldCalculationCode){...}
                    } // End of: if(address[objKey].subObject[property].calculation && ...
                  } // End of: else - This property is not an object.
                } // End of: for-let Check each property of the subobject to see if it too is an object.
              } // End of: if the subfield is also an object
            } // End of: function drillIntoObject(address, objKey, previousObjKey, previousKeyPart, objectNestLevel){...}
            
            // Keep track of how deep we have drilled into the object.
            let objectNestLevel = 1;

            // Call the function defined above. 
            // This function will call itself several times if drilling into nested objects is required.
            drillIntoObject(fieldsObject, fieldKey, "", objectNestLevel)
          }
          else // This top level field is not an object - It's just a regular data field.
          {
            if(fieldsObject[fieldKey].calculation && Object.keys(fieldsObject[fieldKey].calculation).length > 0)
            {
              // Add to the array of fields that contain calculations.
              calculatedFieldsArray.push(fieldKey);   

              // Get the (PUT Handler Pre-processing code) from the calculation object for the current field if it exists.
              for (let calcKey in fieldsObject[fieldKey].calculation)
              {
                if(calcKey === "postHandlerPreprocessing")
                {
                  fieldCalculationCode = fieldsObject[fieldKey].calculation[calcKey]; 
                  break;           
                }
              }  
              
              
              if(fieldCalculationCode) // If the programmer entered a preprocessing calculation for this field in data dictionary.
              {
                htmlString = htmlString +
      `
${fieldCalculationCode}
          
          `
          
              } // End of: if(fieldCalculationCode){...}              
            } // End of: if(fieldsObject[fieldKey].calculation &&...          
          } // End of: Else: this top level field is not an object...
        } // End of: for (let fieldKey in fieldsObject){...}
        // End of: // Generate preprocessing code for the post handlers.




htmlString = htmlString +          
`      

      // Create the logObject.
      // This object will be written to history.json which maintains a history of 
      // all changes to all tables in the database.
      var logObject =
      {
        "historyId" : nextIdObject.nextId + 1,                 
        "transactionId" : nextIdObject.nextId + 2,            
        "rollback" : false,
        "process" : "${recordObject.tableName}._${recordObject.tableName}.post",
        "comment" : "Post new record",
        "who" : "No login yet",    
        "${recordObject.tableName}" : ${recordObject.tableName}Object   
      }

      // Calling the function which creates an entry into the database log file.
      // Behavior from meta.js at ugc5u97p0sb9z5o7dpmh
      _data.append
      (
        'database/dbHistory', 
        'history', 
        logObject, 
        function(err)
        {
          // If there was an error appending to the history file then exit this process
          if (err)  
          {
            helpers.log
            (
              7,
              '${helpers.createRandomString(20)}' + '\\n' +
              'There was an error appending to the history file' + '\\n' +
              'An error here does not necessarily mean the append to history did not happen.' + '\\n' +  
              'But an error at this point in the code surely means there was no append to ${recordObject.tableName}' + '\\n' +                                          
              'CHECK TO SEE IF history and ${recordObject.tableName} ARE STILL IN SYNC' + '\\n' +                    
              'The following was the record we tried to append:' + '\\n' +
              JSON.stringify(logObject) + '\\n' +                   
              'The following is the error message:' + '\\n' +                  
              err  + '\\n'
            );

            return callback(500, {'Error' : 'Could not create a new ${recordObject.tableName} record.'});
          }



          // The history file has been appended to successfully so continue on.



          // Calling the function which appends a record to the file ${recordObject.tableName}.json
          _data.append
          (
          '/${recordObject.directory}', 
          '${recordObject.tableName}', 
          ${recordObject.tableName}Object, 
          function(err)
          {
            if (!err)  // The file has been appended to successfully.
            {
              // Call to function which removes lock
              _data.removeLock
              (function(error)
              // start of callback code which is run after attempting to remove the lock.
              {
                if(!error) // Database lock was successfully removed.
                {
                  callback(200); 
                }
                else // Good write but unable to remove lock on database.
                {
                  helpers.log // Log the error.
                  (
                    7,
                    '${helpers.createRandomString(20)}' + '\\n' +
                    'Successful write to ${recordObject.tableName} but unable to remove lock on database' + '\\n' +
                    'The following record was appended to the ${recordObject.tableName} file:' + '\\n' +                            
                    JSON.stringify(logObject) + '\\n' +   
                    'The following was the error message:' + '\\n' +                                             
                    error + '\\n'
                  ); // End of: helpers.log. Log the error.

                  return callback(500, {'Error' : 'Successful write to ${recordObject.tableName} but unable to remove lock on database'});

                } // End of: else Good write but unable to remove lock on database.

              } // End of callback code which is run after attempting to remove the lock.
              ); // End of: _data.removeLock(function(error){...}
              // End of: Call to function which removes lock

            }    // End of: if (!err)  //The file has been appended to successfully.
            else // There was an error appending to ${recordObject.tableName}.
            {
              helpers.log // Log the error.
              (
                5,
                '${helpers.createRandomString(20)}' + '\\n' +
                'There was an error when appending to the ${recordObject.tableName} file.' + '\\n' +
                'The following record may or may not have been appended to the ${recordObject.tableName} file:' + '\\n' +                            
                JSON.stringify(logObject) + '\\n' +
                'Attempting to rollback the entry.' + '\\n' +    
                'The following was the error message:' + '\\n' +                                             
                err + '\\n'            
              );

              // Assemble rollback record for the ${recordObject.tableName} file which will negate previous entry if any.                 
              ${recordObject.tableName}Object.timeStamp = Date.now();
              ${recordObject.tableName}Object.deleted = true;

              // Assemble rollback record for the history file which will negate previous entry if any.
              logObject =
              {
                "historyId" : nextIdObject.nextId + 3,                             
                "transactionId" : nextIdObject.nextId + 2,                        
                "rollback" : true,
                "process" : "${recordObject.tableName}._${recordObject.tableName}.post",
                "comment" : "Error posting. Appending a delete.",                        
                "who" : "Function needed",    
                "${recordObject.tableName}" : ${recordObject.tableName}Object   
              }

              // Start the rollback process.
              _data.append // Append a rollback entry in history.
              (
                'database/dbHistory', 
                'history', 
                logObject, 
                function(err)
                {
                  if (!err) // The roll back entry in history was appended successfully.
                  {
                    // Calling the function which appends a record to the file ${recordObject.tableName}.json
                    _data.append
                    (
                      '/${recordObject.directory}', 
                      '${recordObject.tableName}', 
                      ${recordObject.tableName}Object, 
                      function(err)
                      {
                        if (!err) // The rollback record for ${recordObject.tableName} was appended successfully.
                        {
                          helpers.log
                          (
                            5,
                            '${helpers.createRandomString(20)}' + '\\n' +
                            'Rollback entry in the ${recordObject.tableName} file was appended successfully' + '\\n' +
                            'The following was the record we rolled back:' + '\\n' +
                            JSON.stringify(logObject) + '\\n'                                   
                          ); // End of: helpers.log(...)
                        }
                        else // There was an error when rolling back record for ${recordObject.tableName}.
                        {
                          helpers.log
                          (
                            7,
                            '${helpers.createRandomString(20)}' + '\\n' +
                            'There was an error appending a rollback entry in the ${recordObject.tableName} file' + '\\n' +
                            'The following record may or may not have been rolled back:' + '\\n' +
                            JSON.stringify(logObject) + '\\n' +   
                            'An error here does not necessarily mean the deleting append to ${recordObject.tableName} did not happen.' + '\\n' +                                        
                            'CHECK TO SEE IF history and ${recordObject.tableName} ARE STILL IN SYNC' + '\\n' + 
                            'The following is the error message:' + '\\n' +                                                                     
                            err  + '\\n'
                          ); // End of: helpers.log(...)
                        }

                      } // End of: callback function(err){...}
                    ); // End of: _data.append(...)
                    
                  } // End of: The roll back entry in history was appended successfully.
                  else // There was an error when appending a rollback entry in history.
                  { 
                    helpers.log
                    (
                      7,
                      '${helpers.createRandomString(20)}' + '\\n' +
                      'There was an error appending a rollback entry in the history file' + '\\n' +
                      'A rollback entry may or may not have been written in the ${recordObject.tableName} file' + '\\n' +  
                      'CHECK TO SEE IF history and ${recordObject.tableName} ARE STILL IN SYNC' + '\\n' +                                      
                      'The following was the record we tried to roll back:' + '\\n' +
                      JSON.stringify(logObject) + '\\n' +        
                      'The following is the error message:' + '\\n' +
                      err  + '\\n'
                    );
                  } // End of: else There was an error when appending a rollback entry in history.
                } // End of: callback function(err){...}
              ); // End of: _data.append(...) Append a rollback entry in history.

              return callback(500, {'Error' : 'Could not create the new ${recordObject.tableName}.'});              

            } // End of: else // There was an error appending to ${recordObject.tableName}.
          } // End of: callback function
          ); // End of: Calling the function which appends a record to the file ${recordObject.tableName}.json 
        } // End of: callback function
      ); // End of: _data.append(dbHistory...)
      // End of: Calling the function which creates an entry into history. 
    }); // End of: lib.nextId(function(err, nextIdObject)
`

          if(uniqueFieldsArray.length != 0)
          {
            htmlString = htmlString +
            "  }); // End of: readInterface.on('close', function(){...}" + "\n"
          }


          htmlString = htmlString +
`}; // End of: ${recordObject.tableName}._${recordObject.tableName}.post = function(...
// End of: ${recordObject.tableName} - post subhandler



`  
        // End of: Assemble the POST Handler

        // Start of: Assemble the PUT Handler  
        
        //????        
        
        htmlString = htmlString +        
`
// ${recordObject.tableName} - put handler
// Define the ${recordObject.tableName} put subhandler function 
// This function updates a record.
// Required data: ${recordObject.tableName}Id
// Note: At least one other field must be specified.
// Behavior from meta.js at mzimrkdf1we1bjw96zgp
${recordObject.tableName}._${recordObject.tableName}.put = function(data, callback)
{
  // Field validation starts here.
  // Get ${recordObject.tableName}Id from payload
  let ${recordObject.tableName}Id = data.payload.${recordObject.tableName}Id;

  // PrimaryKey validation. 
  // Default behavior from meta.js at o65yzg6ddze2fkvcgw5s
  // If ${recordObject.tableName}Id is a valid string then convert it to a number.  
  if (typeof(${recordObject.tableName}Id) === 'string'){${recordObject.tableName}Id = parseInt(${recordObject.tableName}Id, 10);}else{return callback(400, {'Error' : '${recordObject.tableName}Id must be a of string type'});}

`

        lastPart;

        // Start of: Insert validation code for the post handler. ????
        // 1. Loop through the combinedDefaultElementsObject.
        for (let fieldKey in combinedDefaultElementsObject) 
        {
          // console.log("2. This is combinedDefaultElementsObject[" + fieldKey + "]: " + "\n",combinedDefaultElementsObject[fieldKey], "\n\n");

          // If there is a zero in the fieldKey then we are dealing with an object which contains fields inside.
          if(fieldKey.includes("0"))
          {
            // Break up the fieldKey into an array split on the underscore.
            let fieldKeyPartsArray = fieldKey.split("_");

            // Get the last part of the fieldKey.
            // That's everything after the last underscore.
            // It's the fieldName without the object path.
            lastPart = fieldKeyPartsArray[fieldKeyPartsArray.length - 1]   
            
            htmlString = htmlString +
`
  // Start of: Load the ${lastPart}Array dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let ${lastPart}KeyArray = [`
  
            // Loop through the *PartsArray adding any elements found to htmlString
            // that do not have a zero or that are not the string "subObject".
            fieldKeyPartsArray.forEach
            (
              function(currentPart, fieldKeyPartsArrayIndex, fieldKeyPartsArrayAsParam)
              {
                if(!currentPart.includes("0") && currentPart != "subObject")
                {
                  htmlString = htmlString + "\"" + currentPart + "\"";

                  // Add a coma if we are not on the last element.
                  if(fieldKeyPartsArrayIndex < fieldKeyPartsArrayAsParam.length - 1)
                  {
                    htmlString = htmlString + ", ";
                  }
                }
              }
            );


            htmlString = htmlString +
`]

  let ${lastPart}Array = loadPayloadArray([], ${lastPart}KeyArray, data.payload, 0, 0, "", true)[0];
  // End of: Load the ${lastPart}Array dynamically once the payload is known. 

`            
          }
          else // This is not a container object but rather a regular data field.
          {
            htmlString = htmlString +          
            "  // Get " + fieldKey + " from payload" + "\n" +
            
            "  let " + fieldKey + " = data.payload[\"" + fieldKey + "\"];" + "\n" +          
            "\n";  
          }


          // Merge the default validation objects with the post validation objects.
          let mergedValidationObject = extend(true, combinedDefaultElementsObject[fieldKey].validation.default, combinedDefaultElementsObject[fieldKey].validation.put);            
          // console.log("3 The mergedValidationObject is:\n", mergedValidationObject, "\n")

          // Loop through the validation property of each field.
          for (let validationKey in mergedValidationObject)
          {
            // console.log("4. Below is the value of mergedValidationObject[" + validationKey + "] : \n" , mergedValidationObject[validationKey], "\n\n");            

            if(validationKey === "passIfString")
            {
              // If the user supplied the validation code
              if(mergedValidationObject[validationKey])
              {
                htmlString = htmlString + 
                "  // " + validationKey + "\n" +
                "  " + mergedValidationObject[validationKey] + "\n" +
                "\n";
              }
              else // No user supplied validation. Create a generic validation code
              {
                // If there is a zero in the fieldKey then we are dealing with an object which contains fields inside.
                if(fieldKey.includes("0"))
                {
                  htmlString = htmlString + 
`                  
  // Start of: Validate elements in the ${lastPart}Array
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  ${lastPart}Array.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : '${lastPart} must be of datatype string'});}
  });
  // End of: Validate elements in the ${lastPart}Array

`
                }
                else // No zero in the fieldkey. This is a not a container object but rather a data field.
                {
                  htmlString = htmlString +                 
                  "  // passIfString Default behavior from meta.js at 8o3hk7yns1ih1nnpft7j" + "\n" +   
                  "  if(typeof(" + fieldKey + ") != 'string'){return callback(400, {'Error' : '" + fieldKey + " must be of datatype string'});}" + "\n" + 
                  "\n";
                }
              } // End of: No user supplied validation. Create a generic validation code
            } // End of: if(validationKey === "passIfString")
            else if(validationKey === "passIfNotEmpty")
            {
              // If the user supplied the validation code
              if(mergedValidationObject[validationKey])
              {
                htmlString = htmlString + 
                "  // " + validationKey + "\n" +
                "  " + mergedValidationObject[validationKey] + "\n" +
                "\n";
              }
              else // No user supplied validation. Create a generic validation code.
              {
                htmlString = htmlString + 
                "  // passIfNotEmpty Default behavior from meta.js at lybuuqv6re4sgnjplens" + "\n" +                
                "  if(" + fieldKey + ".trim().length === 0){return callback(400, {'Error' : 'No " + fieldKey + " was entered'});}else{" + fieldKey + " = " + fieldKey + ".trim()}" + "\n" +
                "\n";
              }
            }
            else if(validationKey === "passIfString&NotEmptyThenTrim")
            {
              // If the user supplied the validation code in the data dictionary
              if(mergedValidationObject[validationKey])
              {
                htmlString = htmlString + 
                "  // " + validationKey + "\n" +
                "  " + mergedValidationObject[validationKey] + "\n" +
                "\n";
              }
              else // No user supplied validation code. Create a generic validation string.
              {
                // If there is a zero in the fieldKey then we are dealing with an object which contains fields inside.
                if(fieldKey.includes("0"))
                {

                  htmlString = htmlString +
`  // Start of: Validate elements in the ${lastPart}Array
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at ohw0ivijs2au0nt2rwf1
  ${lastPart}Array.forEach(function(arrayElement)
  {
    // If ${lastPart} is of string type and is not empty 
    if (typeof(arrayElement[1]) === 'string' && arrayElement[1].trim().length > 0) 
    { 
      // The user entered something in the edit form
      arrayElement[1] = arrayElement[1].trim()
    } 
    // Else, the user may have entered some other datatype like a number or 
    // perhaps nothing at all if using the Delete form or if just using the API. 
    else 
    { 
      // If the user entered nothing: 
      if(arrayElement[1] === undefined) 
      { 
        // Then user is likely trying to delete a record.
        // So change the value to false and continue processing.
        arrayElement[1] = false 
      } 
      else // The user entered something invalid so reject the edit. 
      { 
        return callback(400, {'Error' : 'Not a valid ' + arrayElement[1]}); 
      } 
    }
  }); // End of: ${lastPart}Array.forEach(function(arrayElement)
  // End of: Validate elements in the ${lastPart}Array 

`

                } // End of: If there is a zero in the fieldKey...
                else // No zero in the fieldkey. This is a not a container object but rather a data field.
                {

                  htmlString = htmlString +
`  // passIfString&NotEmptyThenTrim
  // Default behavior from meta.js at ulg5xxvzgr7efln9xur9 
  // If ${fieldKey} is of string type and is not empty 
  if (typeof(${fieldKey}) === 'string' && ${fieldKey}.trim().length > 0) 
  { 
    // The user entered something in the edit form
    ${fieldKey} = ${fieldKey}.trim()
  } 
  // Else, the user may have entered some other datatype like a number or 
  // perhaps nothing at all if using the Delete form or if just using the API. 
  else 
  { 
    // If the user entered nothing: 
    if(${fieldKey} === undefined) 
    { 
      // Then user is likely trying to delete a record.
      // So change the value to false and continue processing.
      ${fieldKey} = false 
    } 
    else // The user entered something invalid so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid ${fieldKey}'}); 
    } 
  }

`

                } // End of: Else: No zero in the fieldkey. This is a not a container object but rather a data field.
              } // End of:  // No user supplied validation code. Create a generic validation string.
            } // End of: else if(validationKey === "passIfString&NotEmptyThenTrim")
            else if(validationKey === "passMenuItemsOnly")
            {
              // If the user supplied the validation code in the data dictionary
              if(mergedValidationObject[validationKey])
              {
                htmlString = htmlString + 
                "  // " + validationKey + "\n" +
                "  " + mergedValidationObject[validationKey] + "\n" +
                "\n";
              }
              else // No user supplied validation code. Create a generic validation string.
              {

                // If there is a zero in the fieldKey then we are dealing with an object which contains fields inside.
                if(fieldKey.includes("0"))
                {
                  htmlString = htmlString + 
`  // Start of: Validate elements in the ${lastPart}Array
  // passMenuItemsOnly
  // Behavior from meta.js at 69nq4ck9lcdakwpb58o6
  ${lastPart}Array.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string')
    {
      return callback(400, {'Error' : '${lastPart} must be of datatype string'});
    }
  
    if
    (
`
                  
                  // Build validation for the menu options.
                  let isFirstOptionWrite = true;

                  Object.keys(combinedDefaultElementsObject[fieldKey].options).forEach
                  (
                    function(optionKey)
                    {
                      // If the option is not blank and this is the first option to be validated.
                      if(optionKey && isFirstOptionWrite)
                      {
                        htmlString = htmlString + 
                        "      arrayElement[1] !== \"" + optionKey + "\"" + "\n";

                        isFirstOptionWrite = false;

                      }
                      else if(optionKey)
                      {
                        htmlString = htmlString + 
                        "      && arrayElement[1] !== \"" + optionKey + "\"" + "\n";
                      }
                    }
                  );                


                  htmlString = htmlString + 
`    )
    {
      return callback(400, {'Error' : '${lastPart} does not match menu options'});
    }
  });
  // End of: Validate elements in the ${lastPart}Array

`
                }
                else // This is not a container object but rather just a regular data field.
                {
                  
                  htmlString = htmlString +    
`
  // Behavior from meta.js at ettt3o23onrmd04b94jq
  // This generated behavior has not been tested yet. ????
  if(typeof(${fieldKey}) != 'string')
  {
    return callback(400, {'Error' : '${fieldKey} must be of datatype string'});
  }
  
  if
  (
`

                  // Build validation for the menu options.
                  let isFirstOptionWrite = true;

                  Object.keys(combinedDefaultElementsObject[fieldKey].options).forEach
                  (
                    function(optionKey)
                    {
                      // If the option is not blank and this is the first option to be validated.
                      if(optionKey && isFirstOptionWrite)
                      {
                        htmlString = htmlString + 
                        "      ${fieldKey} !== \"" + optionKey + "\"" + "\n";

                        isFirstOptionWrite = false;

                      }
                      else if(optionKey)
                      {
                        htmlString = htmlString + 
                        "      && ${fieldKey} !== \"" + optionKey + "\"" + "\n";
                      }
                    }
                  );


                  htmlString = htmlString +
`    
  )
  {
    return callback(400, {'Error' : 'No ${fieldKey} was selected from menu'});
  }
  else
  {
    ${fieldKey} = ${fieldKey}.trim()
  }

`                                 
                } // End of: Else: This is not a container object but rather just a regular data field.
              } // End of: Else: No user supplied validation code. Create a generic validation string.
            } // End of: else if(validationKey === "passMenuItemsOnly"){...}
            else // validationKey must be user defined.
            {
              // If the user supplied the validation string
              if(mergedValidationObject[validationKey])
              {
                htmlString = htmlString + 
                "  // " + validationKey + "\n" +
                "  " + mergedValidationObject[validationKey] + "\n" +
                "\n";
              }
            }         
          } // End of: for for (let validationKey in mergedValidationObject){...}                    
        } // End of: for (let fieldKey in combinedDefaultElementsObject)       
        // End of: Insert validation code.


        // Start of Enforce unique fields.
        // This code can only handle one uniqueId for each table for now.
        // Later we will update this code to handle as many uniqueIds as may be required.
        // Looks like we just need to put this section of code in a loop.
        // Or better, Test for all the unique fields at the same time in a single loop.
        // This code already handles the possibility that no fields are required to be unique.
        // In that case the loop will not run and the following code will not be inserted.
        // This causes the code that normally runs inside to be indented one tab too many.
        // That can be fixed by running a beautifier on the code. 
        // I intend to build a simple beautifier into this generator but since this is only aesthetic it can wait.

        // 1. Create an array with all the field names for fields which must be unique.
        uniqueFieldsArray = [];

        // Loop thorough the top level fields drilling in as required.
        for (let fieldKey in fieldsObject)
        {
          // If this top level field is an object containing more fields inside...
          if(fieldsObject[fieldKey].subObject)
          {
            // Declare a function that we will use to drill into the object.
            function drillIntoObject(address, objKey, previousObjKey, previousKeyPart, objectNestLevel)
            {      
              // if the subfield is also an object then this function calls itself using the subfield parameters.
              // This will continue drilling in until we are at the end of the branches
              if(address[objKey].subObject)
              { 
                // Check each property of the subobject to see if it too is an object.
                for (let property in address[objKey].subObject)
                {
                  // If the property is also an object
                  if(address[objKey].subObject[property].subObject)
                  {
                    // This function calls itself so as to go deeper into the object
                    drillIntoObject(address[objKey].subObject, property, objKey, "subObject", objectNestLevel + 1);
                  }
                  else // This property is not an object. We are at the end of the branch where we encounter a data field.
                  { 
                    // Assemble the path through the current object to the current data field.
                    let objectPath = objKey + "." + "subObject" + "." + property;

                    // If the current object is nested then prepend the path to include the parent objects.
                    objectPath = previousObjKey.length === 0 ? objectPath : previousObjKey + "." + previousKeyPart + "." + objectPath;

                    // Check if the current field has a unique constraint.
                    if(address[objKey].subObject[property].unique === true)
                    {
                      uniqueFieldsArray.push(objectPath);   
                    } 
                  } // End of: else - This property is not an object.
                } // End of: for-let Check each property of the subobject to see if it too is an object.
              } // End of: if the subfield is also an object
            }; // End of: function drillIntoObject(address, objKey, previousObjKey, previousKeyPart, objectNestLevel){...}
            
            // Keep track of how deep we have drilled into the object.
            let objectNestLevel = 1;

            // Call the function defined above. 
            // This function will call itself several times if drilling into nested objects is required.
            drillIntoObject(fieldsObject, fieldKey, "", "", objectNestLevel)
          }
          else // This top level field is not an object - It's just a regular data field.
          {
            if(fieldsObject[fieldKey].unique === true)
            {
              uniqueFieldsArray.push(fieldKey);   
            }          
          }

        } // End of: for (let fieldKey in fieldsObject){...}
        // End of: // Loop thorough the top level fields 





        // End of: This is the new code. bp8m07ldxnpmioplj6c0


        /*
        lastPart;

        // Start of: Insert validation code for the put handler.
        // 1. Loop through the combinedDefaultElementsObject.
        for (let fieldKey in combinedDefaultElementsObject) 
        {
          // console.log("2. This is combinedDefaultElementsObject[" + fieldKey + "]: " + "\n",combinedDefaultElementsObject[fieldKey], "\n\n");



          // If there is a zero in the fieldKey then we are dealing with an object which contains fields inside.
          if(fieldKey.includes("0"))
          {
            // Get the last part of the fieldKey.
            // That's everything after the last underscore.
            // It's the fieldName without the object path.
            lastPart = fieldKey.split("_")[fieldKey.split("_").length - 1]

            let lastPartInTitleCase = lastPart[0].toUpperCase() + lastPart.slice(1);            
          


            htmlString = htmlString +
`
  // Start of: Load the ${lastPart}Array dynamically once the payload is known.
  // Behavior from meta.js at k03gi53l3fqk307c9puv
  let ${lastPart}Array = [];
  let run${lastPartInTitleCase}Loop = true;
  let ${lastPart}LoopCount = 0;

  while (run${lastPartInTitleCase}Loop === true)
  {
    // Check if the data exists in the payload`



            // Get the part of fieldKey in front of the zero and the part behind it.
            let splitArray = fieldKey.split("0");



            htmlString = htmlString +
`
    if(data.payload["${splitArray[0]}" + ${lastPart}LoopCount.toString() + "${splitArray[1]}"])
    {
      ${lastPart}Array.push(data.payload["${splitArray[0]}" + ${lastPart}LoopCount.toString() + "${splitArray[1]}"]);

      ${lastPart}LoopCount = ${lastPart}LoopCount + 1;
    }
    else // No more ${lastPart} variables were sent by the client.  
    {
      run${lastPartInTitleCase}Loop = false;      
    }    
  } // End of: while (run${lastPartInTitleCase}Loop === true){...}
  // End of: Load the ${lastPart}Array dynamically once the payload is known.  
`            
          }
          else // This is not a container object but rather a regular data field.
          {
            htmlString = htmlString +          
            "  // Get " + fieldKey + " from payload" + "\n" +
            "  let " + fieldKey + " = data.payload[\"" + fieldKey + "\"];" + "\n" +          
            "\n";  
          }


          // Merge the default validation objects with the post validation objects.
          let mergedValidationObject = extend(true, combinedDefaultElementsObject[fieldKey].validation.default, combinedDefaultElementsObject[fieldKey].validation.put);            
          // console.log("3 The mergedValidationObject is:\n", mergedValidationObject, "\n")

          // Loop through the validation property of each field.
          for (let validationKey in mergedValidationObject)
          {
            // console.log("4. Below is the value of mergedValidationObject[" + validationKey + "] : \n" , mergedValidationObject[validationKey], "\n\n");            

            if(validationKey === "passIfString")
            {
              // If the user supplied the validation code
              if(mergedValidationObject[validationKey])
              {
                htmlString = htmlString + 
                "  // " + validationKey + "\n" +
                "  " + mergedValidationObject[validationKey] + "\n" +
                "\n";
              }
              else // No user supplied validation. Create a generic validation code
              {
                // If there is a zero in the fieldKey then we are dealing with an object which contains fields inside.
                if(fieldKey.includes("0"))
                {

                  htmlString = htmlString + 
`                  
  // Start of: Validate elements in the ${lastPart}Array
  // passIfString
  // Behavior from meta.js at 6xczd8sfmnvhmvrivajc
  ${lastPart}Array.forEach(function(arrayElement)
  {
    // If ${lastPart} is of string type and is not empty 
    if (typeof(arrayElement) === 'string') 
    { 
      // The user entered something in the edit form
      // Pass the string as it is.
    } 
    // Else, the user may have entered some other datatype like a number or 
    // perhaps nothing at all if using the Delete form or if just using the API. 
    else 
    { 
      // If the user entered nothing: 
      if(arrayElement === undefined) 
      { 
        // Then user is likely trying to delete a record.
        // So change the value to false and continue processing.
        arrayElement = false 
      } 
      else // The user entered something invalid so reject the edit. 
      { 
        return callback(400, {'Error' : 'Not a valid ' + arrayElement}); 
      } 
    }
  }); // End of: ${lastPart}Array.forEach(function(arrayElement)
  // End of: Validate elements in the ${lastPart}Array  
` 

                }
                else // No zero in the fieldkey. This is a not a container object but rather a data field.
                {
                  htmlString = htmlString + 
`  // passIfString
  // Default behavior from meta.js at bif5xwvzgr4efln9ftr3 
  // If ${fieldKey} is of string type 
  if (typeof(${fieldKey}) === 'string')
  { 
    // The user entered something or left the field blank in the edit form
    // No need to do anything with ${fieldKey}. We are using it as specified by the user.
  } 
  // Else, the user may have entered some other datatype like a number or 
  // perhaps the value is undefined if using the Delete form or if just using the API. 
  else 
  { 
    // If the value is undefined: 
    if(${fieldKey} === undefined) 
    { 
      // Then user is likely trying to delete a record.
      // So change the value to false and continue processing.
      ${fieldKey} = false 
    } 
    else // The user entered something invalid so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid ${fieldKey}'}); 
    } 
  }
  
`
                } // End of: else // No zero in the fieldkey. This is a not a container object but rather a data field.
              } // End of: No user supplied validation. Create a generic validation code
            } // End of: if(validationKey === "passIfString")
            else if(validationKey === "passIfNotEmpty")
            {
              // If the user supplied the validation code
              if(mergedValidationObject[validationKey])
              {
                htmlString = htmlString + 
                "  // " + validationKey + "\n" +
                "  " + mergedValidationObject[validationKey] + "\n" +
                "\n";
              }
              else // No user supplied validation. Create a generic validation code.
              {
                htmlString = htmlString + 
                "  // passIfNotEmpty Default behavior from meta.js at yu7ggyxrx11it6xsyl9t" + "\n" +                
                "  if(!" + fieldKey + " || " + fieldKey + ".trim().length === 0){return callback(400, {'Error' : 'No " + fieldKey + " was entered'});}else{" + fieldKey + " = " + fieldKey + ".trim()}" + "\n" +
                "\n";
              }
            }
            else if(validationKey === "passIfString&NotEmptyThenTrim")
            {
              // If the user supplied the validation code in the data dictionary
              if(mergedValidationObject[validationKey])
              {
                htmlString = htmlString + 
                "  // " + validationKey + "\n" +
                "  " + mergedValidationObject[validationKey] + "\n" +
                "\n";
              }
              else // No user supplied validation code. Create a generic validation string.
              {
                // If there is a zero in the fieldKey then we are dealing with an object which contains fields inside.
                if(fieldKey.includes("0"))
                {


                  
                  htmlString = htmlString + 
`                  
  // Start of: Validate elements in the ${lastPart}Array
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at ohw0ivijs2au0nt2rwf1
  ${lastPart}Array.forEach(function(arrayElement)
  {
    // If ${lastPart} is of string type and is not empty 
    if (typeof(arrayElement) === 'string' && arrayElement.trim().length > 0) 
    { 
      // The user entered something in the edit form
      arrayElement = arrayElement.trim()
    } 
    // Else, the user may have entered some other datatype like a number or 
    // perhaps nothing at all if using the Delete form or if just using the API. 
    else 
    { 
      // If the user entered nothing: 
      if(arrayElement === undefined) 
      { 
        // Then user is likely trying to delete a record.
        // So change the value to false and continue processing.
        arrayElement = false 
      } 
      else // The user entered something invalid so reject the edit. 
      { 
        return callback(400, {'Error' : 'Not a valid ' + arrayElement}); 
      } 
    }
  }); // End of: ${lastPart}Array.forEach(function(arrayElement)
  // End of: Validate elements in the ${lastPart}Array  
`          


                } // End of: If there is a zero in the fieldKey...
                else // No zero in the fieldkey. This is a not a container object but rather a data field.
                {
                  htmlString = htmlString + 
`  // passIfString&NotEmptyThenTrim
  // Default behavior from meta.js at yif5xwczgr4ebln99trd 
  // If ${fieldKey} is of string type and is not empty 
  if (typeof(${fieldKey}) === 'string' && ${fieldKey}.trim().length > 0) 
  { 
    // The user entered something in the edit form
    ${fieldKey} = ${fieldKey}.trim()
  } 
  // Else, the user may have entered some other datatype like a number or 
  // perhaps nothing at all if using the Delete form or if just using the API. 
  else 
  { 
    // If the user entered nothing: 
    if(${fieldKey} === undefined) 
    { 
      // Then user is likely trying to delete a record.
      // So change the value to false and continue processing.
      ${fieldKey} = false 
    } 
    else // The user entered something invalid so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid ${fieldKey}'}); 
    } 
  }
  
`
                } // End of: Else: No zero in the fieldkey. This is a not a container object but rather a data field.
              } // End of:  // No user supplied validation code. Create a generic validation string.
            } // End of: else if(validationKey === "passIfString&NotEmptyThenTrim")
            else if(validationKey === "passMenuItemsOnly")
            {
              // If the user supplied the validation code in the data dictionary
              if(mergedValidationObject[validationKey])
              {
                htmlString = htmlString + 
                "  // " + validationKey + "\n" +
                "  " + mergedValidationObject[validationKey] + "\n" +
                "\n";
              }
              else // No user supplied validation code. Create a generic validation string.
              {

                // If there is a zero in the fieldKey then we are dealing with an object which contains fields inside.
                if(fieldKey.includes("0"))
                {
                  htmlString = htmlString + 
`  
// Start of: Validate elements in the ${lastPart}Array
  // passMenuItemsOnly
  // Behavior from meta.js at f6prkp8jnrdvnadz9d6s
  ${lastPart}Array.forEach(function(arrayElement)
  {
    if(typeof(arrayElement) != 'string')
    {
      return callback(400, {'Error' : '${lastPart} must be of datatype string'});
    }

    if
    (
`
                  
                  // Build validation for the menu options.
                  let isFirstOptionWrite = true;

                  Object.keys(combinedDefaultElementsObject[fieldKey].options).forEach
                  (
                    function(optionKey)
                    {
                      // If the option is not blank and this is the first option to be validated.
                      if(optionKey && isFirstOptionWrite)
                      {
                        htmlString = htmlString + 
                        "      arrayElement !== \"" + optionKey + "\"" + "\n";

                        isFirstOptionWrite = false;

                      }
                      else if(optionKey)
                      {
                        htmlString = htmlString + 
                        "      && arrayElement !== \"" + optionKey + "\"" + "\n";
                      }
                    }
                  );                


                  htmlString = htmlString + 
`    )
    {
      return callback(400, {'Error' : '${lastPart} does not match menu options'});
    }
  });
  // End of: Validate elements in the ${lastPart}Array

`
                }
                else // This is not a container object but rather just a regular data field.
                {
                  
                  htmlString = htmlString +    
`
  // Behavior from meta.js at c9avu52b4xzvbtzq1xjv
  // This generated behavior has not been tested yet. ????
  if(typeof(${fieldKey}) != 'string')
  {
    return callback(400, {'Error' : '${fieldKey} must be of datatype string'});
  }

  if
  (
`

                  // Build validation for the menu options.
                  let isFirstOptionWrite = true;

                  Object.keys(combinedDefaultElementsObject[fieldKey].options).forEach
                  (
                    function(optionKey)
                    {
                      // If the option is not blank and this is the first option to be validated.
                      if(optionKey && isFirstOptionWrite)
                      {
                        htmlString = htmlString + 
                        "      ${fieldKey} !== \"" + optionKey + "\"" + "\n";

                        isFirstOptionWrite = false;

                      }
                      else if(optionKey)
                      {
                        htmlString = htmlString + 
                        "      && ${fieldKey} !== \"" + optionKey + "\"" + "\n";
                      }
                    }
                  );


                  htmlString = htmlString +
`    
  )
  {
    return callback(400, {'Error' : 'No ${fieldKey} was selected from menu'});
  }
  else
  {
    ${fieldKey} = ${fieldKey}.trim()
  }

`                                 
                } // End of: Else: This is not a container object but rather just a regular data field.
              } // End of: Else: No user supplied validation code. Create a generic validation string.
            } // End of: else if(validationKey === "passMenuItemsOnly"){...}
            else // validationKey must be user defined.
            {
              // If the user supplied the validation string
              if(mergedValidationObject[validationKey])
              {
                htmlString = htmlString + 
                "  // " + validationKey + "\n" +
                "  " + mergedValidationObject[validationKey] + "\n" +
                "\n";
              }
            }         
          } // End of: for for (let validationKey in mergedValidationObject){...}                    
        } // End of: for (let fieldKey in combinedDefaultElementsObject)       
        // End of: Insert validation code.
        */

        htmlString = htmlString +  
`  
  // Check if the deleted flag is of type string and that the value is exactly equal to "true".
  // That would mean the user wants to delete the record. Otherwise the users does not want to delete the record.
  // Set deleted to boolean true if validation is passed otherwise set it to false.
  // Behavior from meta.js at ts2g5rn5uw6mvup58vph
  let deleted = typeof(data.payload.deleted) === 'string' && data.payload.deleted === "true" ? true : false;

  
  //if all fields fail validation then exit this process without writing changes to the table.
  if
  (
  `

        // Loop thorough the top level fields
        for (let fieldKey in fieldsObject)
        {
          // If this top level field is an object containing more fields inside...
          if(fieldsObject[fieldKey][fieldKey + "0"])
          {
            // Declare a function that we will use to drill into the object.
            function drillIntoObject(address, objKey, previousObjKey, objectNestLevel)
            {      
              // if the subfield is also an object then this function calls itself using the subfield parameters.
              // This will continue drilling in until we are at the end of the branches
              if(address[objKey][objKey + "0"])
              { 
                // Check each property of the subobject to see if it too is an object.
                for (let property in address[objKey][objKey + "0"])
                {
                  // If the property is also an object
                  if(address[objKey][objKey + "0"][property][property + "0"])
                  {
                    // This function calls itself so as to go deeper into the object
                    drillIntoObject(address[objKey][objKey + "0"], property, objKey, objectNestLevel + 1);
                  }
                  else // This property is not an object. We are at the end of the branch where we encounter a data field.
                  { 
                    let defaultElementsObject = address[objKey][objKey + "0"][property].defaultElements;

                    // Looping for the rare case when there is more than one defaultElement associated with a field.                    
                    for (let key in defaultElementsObject) 
                    {
                      htmlString = htmlString + 
                      // "!" + objectPath.split("_").slice(0, -1).join("_") + "_" + key + " && ";
                      "  !" + key + "Array.some(function(element){if(element){return true;}})" + "\n" + "    &&";
                    }

                  } // End of: else - This property is not an object.
                } // End of: for-let Check each property of the subobject to see if it too is an object.
              } // End of: if the subfield is also an object
            }; // End of: function drillIntoObject(address, objKey, previousObjKey, previousKeyPart, objectNestLevel){...}
            
            // Keep track of how deep we have drilled into the object.
            let objectNestLevel = 1;

            // Call the function defined above. 
            // This function will call itself several times if drilling into nested objects is required.
            // drillIntoObject(fieldsObject, fieldKey, "", "", objectNestLevel)
            drillIntoObject(fieldsObject, fieldKey, "", objectNestLevel)            
          }
          else // This top level field is not an object - It's just a regular data field.
          {
            // Create an object of default elements for a field.
            let defaultElementsObject = fieldsObject[fieldKey].defaultElements;

            // Loop through defaultElementsObject.
            for (let key in defaultElementsObject) 
            {
              htmlString = htmlString + 
              "  !" + key + "\n" + "    &&";
            } 
          }
        } // End of: for (let fieldKey in fieldsObject){...}
        // End of: // Loop thorough the top level fields 



        htmlString = htmlString + "  !deleted" + "\n" + "  )" + "\n";



        htmlString = htmlString +    
`  {
    helpers.log
    (
      5,
      '${helpers.createRandomString(20)}' + '\\n' +
      'No fields pass the validation process' + '\\n'                                  
    ); // End of: helpers.log(...)

      return callback(400, {'Error' : 'Missing required fields'});
  } // End of: Field validation failed - Exit this process.

  // If we made it this far then field validation has been passed successfully so continue with the process.

  // Get the next global sequential unique Id and lock the database
  // Locking the database makes the system multiuser.
  // All writes to any table must first get a lock on gsuid.json
  // gsuid.json stays locked until the operation is completely finished and _data.removeLock is called.
  // This ensures that only one process is writing to the database at any one time.  
  // Behavior from meta.js at wzoyt9ohnvst1pe5etn0        
  _data.nextId(function(error, nextIdObject)
  {
    // If lock failed or unable to get the next gsuid.
    if(error || !nextIdObject)
    {
      helpers.log
      (
        5,
        '${helpers.createRandomString(20)}' + '\\n' +
        'Unable to get the next gsuid.' + '\\n' +
        'The following was the error' + '\\n' +
        JSON.stringify(error) + '\\n'                                   
      ); // End of: helpers.log(...)

      return callback(423, {'Error' : 'Database is Locked'});
    } // End of: If lock failed or unable to get the next gsuid.


    // If we made it here then we were able to lock the gsuid.json file and get 
    // the next unique id number for this record. So continue with the process.


    // Create the ${recordObject.tableName} object. 
    // This object will be appended to ${recordObject.tableName}.json.
    // Add in all fields even if no data is available yet. 
    // This is to establish the order in which the fields will be written to the table. 
    // Behavior from 3bd1sa5ve4aqrfspunrt in meta.js         
    let ${recordObject.tableName}Object = {};
    ${recordObject.tableName}Object.${recordObject.tableName}Id = ${recordObject.tableName}Id;

`


        let editFormElementsObject = recordObject.webPages.editPage.forms.editForm.formElements;

        // Loop thorough the top level fieldsObject drilling in as required.
        for (let fieldKey in fieldsObject)
        {
          // If this top level field is an object containing more fields inside...
          if(fieldsObject[fieldKey][fieldKey + "0"])
          {
            // Declare a function that we will use to drill into the object.
            function drillIntoObject(address, objKey, objectNestLevel, previousPath)
            { 
              // if the subfield is also an object then this function calls itself using the subfield parameters.
              // This will continue drilling in until we are at the end of the branches
              if(address[objKey][objKey + "0"])
              { 
                // If this is the first time we were this deep in the object on this branch.
                if(objectNestLevelHistory === objectNestLevel)
                {
                  if(objectNestLevel === 1)
                  {
                    htmlString = htmlString + "\n";    
                  }

                  // Keeping track of how many levels deep we have already drilled.
                  // This is so we don't overwrite code that has already been generated.
                  objectNestLevelHistory = objectNestLevelHistory + 1;
                } // End of: if(objectNestLevelHistory === objectNestLevel){...}

                // Check each property of the subobject to see if it too is an object.
                for (let property in address[objKey][objKey + "0"])
                {
                  // If the property is also an object
                  if(address[objKey][objKey + "0"][property][property + "0"])
                  {
                    // This function calls itself so as to go deeper into the object
                    drillIntoObject(address[objKey][objKey + "0"], property, objectNestLevel + 1, previousPath + objKey + "_" + objKey + "0_");
                  }
                  else // This property is not an object. We are at the end of the branch where we encounter a data field.
                  { 
                    htmlString = htmlString +
                    "    " + "// Add any fields named \"" + property + "Array\" to the object we will write to the database." + "\n" +
                    "    " + recordObject.tableName + "Object = buildBranches(" + property + "Array, " + recordObject.tableName + "Object);" + "\n\n";    
                    
                  } // End of: else - This property is not an object.
                } // End of: for-let Check each property of the subobject to see if it too is an object.

                // Noting that we are moving back up the object tree.
                objectNestLevelHistory = objectNestLevelHistory -1;   

              } // End of: if the subfield is also an object
            }; // End of: function drillIntoObject(address, objKey, objectNestLevel, previousPath){...}
            
            // Keep track of how deep we have drilled into the object.
            let objectNestLevel = 1;
            let objectNestLevelHistory = 1;

            // Call the function defined above. 
            // This function will call itself several times if drilling into nested objects is required.
            drillIntoObject(fieldsObject, fieldKey, objectNestLevel, "")
          }
          else // This top level field is not an object - It's just a regular data field.
          {  
            // if the data field is on the form
            if(addFormElementsObject[fieldKey])
            {
              // Write out the topLevelDataField
              htmlString = htmlString +
              "    " + recordObject.tableName + "Object." + fieldKey + " = " + fieldKey + ";" + "\n"; 
            }
            else // the data field is not on the form.
            {


              // Write out the topLevelDataField
              htmlString = htmlString +
              "    " + recordObject.tableName + "Object." + fieldKey + " = undefined;" + "\n"; 

            } // End of: Else the data field is not on the form.
          } // End of: else: this top level field is not an object
        } // End of: for (let fieldKey in fieldsObject){...}
        // End of: // Loop thorough the top level fields 


        htmlString = htmlString + 

`    ${recordObject.tableName}Object.timeStamp = Date.now();
    ${recordObject.tableName}Object.deleted = false;

    let dataObject = {};
`

        uniqueFieldsArray.forEach(function (elementValue, elementIndex)
        {
          htmlString = htmlString +  
          "    dataObject.uniqueField0" + (elementIndex + 1) + "Name = \"" + elementValue + "\";" + "\n" +
          "    dataObject.uniqueField0" + (elementIndex + 1) + "Value = " + recordObject.tableName + "Object." + elementValue + ";" + "\n";
        }); // End of: uniqueFieldsArray.forEach(function (elementValue, elementIndex)


        htmlString = htmlString +      
`    dataObject.path = '/${recordObject.directory}/${recordObject.tableName}.json';
    dataObject.queryString = 'WHERE:;${recordObject.tableName}Id:;MatchesExactly:;' + ${recordObject.tableName}Id + ':;';

    // This function returns the most recent record for this ${recordObject.tableName}Id after checking that 
    // data for unique fields is indeed unique and that the a record with the supplied ${recordObject.tableName}Id exists to modify.
    // Behavior from meta.js at 6pmnh29cub4p4g2fmb04
    helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)
    {
      // If there was an error returned by getMostRecent when attempting to get the most current record.        
      if(errorFromGetMostRecent)
      {
        // Call to function which removes lock
        _data.removeLock
        (function(errorFromRemoveLock)
        // start of callback code which is run after attempting to remove the lock.
        {
          if(!errorFromRemoveLock) // Database lock was successfully removed.
          {
            if(errorFromGetMostRecent)
            {
              helpers.log // Log the error.
              (
                7,
                '${helpers.createRandomString(20)}' + '\\n' + 
                'The following was the error message from getMostRecent:' + '\\n' +                                             
                errorFromGetMostRecent + '\\n'                                                 
              ); // End of: helpers.log // Log the error.

              return callback(500, {'Error' : errorFromGetMostRecent});      
            }
          }
          else // Error from getMostRecent and also unable to remove lock on database.
          {
            if(errorFromGetMostRecent)
            {
              helpers.log // Log the error.
              (
                7,
                '${helpers.createRandomString(20)}' + '\\n' +
                'The following was the error message from getMostRecent:' + '\\n' +                                             
                errorFromGetMostRecent + '\\n'  +
                'Also unable to remove lock on database.' + '\\n' + 
                'The following was the error message from removeLock:' + '\\n' +                                      
                errorFromRemoveLock + '\\n'
              ); // End of: helpers.log // Log the error.

              return callback(500, {'Error' : errorFromGetMostRecent + " and " + errorFromRemoveLock});      
            } // End of: if(errorFromGetMostRecent){...}
          } // End of: unable to remove lock on database after getMostRecent returned a failed read.

        } // End of callback code which is run after attempting to remove the lock.
        ); // End of: _data.removeLock(function(error){...}
        // End of: Call to function which removes lock after failed read from getMostRecent
      } // End of: There was indeed an error returned by getMostRecent when attempting to get the most current record.          


      // If we got this far then we got the most recent record from getMostRecent without any problem. 
      // So Continue with the process.


      // Used to decode the payload buffer into readable text.
      let decoder = new StringDecoder('utf8');    

      // This instance of the Writable object gives us a place for a callback to run when the payload is received.
      const writable = new Writable();

      // Called by pipeline below. Does something useful with the payload
      // Behavior from meta.js at 74l4ugm91cza7uv38jac
      writable.write = function(payload)
      {
        let stringContainer = '';                 
        stringContainer = stringContainer + decoder.write(payload);
        let recordObject = JSON.parse(stringContainer);


`

        // Generate preprocessing code for the put handlers.
        // Generic code is generated if none is found in the data dictionary (meta.json)

        // Create an array to hold all the field names with path for all
        // fields which contain a calculation named putHandlerPreprocessing.
        calculatedFieldsArray = [];

        // Will hold code found if any.
        fieldCalculationCode = false;           

        // Loop thorough the top level fields drilling in as required.
        for (let fieldKey in fieldsObject)
        {
          // If this top level field is an object containing more fields inside...
          if(fieldsObject[fieldKey][fieldKey + "0"])
          {
            // Declare a function that we will use to drill into the object.
            function drillIntoObject(address, objKey, previousObjKey, objectNestLevel)
            {      
              // if the subfield is also an object then this function calls itself using the subfield parameters.
              // This will continue drilling in until we are at the end of the branches
              if(address[objKey][objKey + "0"])
              { 
                // Check each property of the subobject to see if it too is an object.
                for (let property in address[objKey][objKey + "0"])
                {
                  // If the property is also an object
                  if(address[objKey][objKey + "0"][property][property + "0"])
                  {
                    // This function calls itself so as to go deeper into the object
                    drillIntoObject(address[objKey][objKey + "0"], property, objKey, objectNestLevel + 1);                    
                  }
                  else // This property is not an object. We are at the end of the branch where we encounter a data field.
                  { 
                    // Assemble the path through the current object to the current data field.
                    let objectPath = objKey + "." + objKey + "0" + "." + property;

                    // Check if the current field contains the calculation object and if it has any properties.
                    if(address[objKey][objKey + "0"][property].calculation && Object.keys(address[objKey][objKey + "0"][property].calculation).length > 0)
                    {
                      calculatedFieldsArray.push(objectPath);  

                      // Get the (PUT Handler Pre-processing code) from the calculation object for the current field if it exists.
                      for (let calcKey in address[objKey][objKey + "0"][property].calculation)
                      {
                        if(calcKey === "putHandlerPreprocessing")
                        {
                          fieldCalculationCode = address[objKey][objKey + "0"][property].calculation[calcKey]; 
                          break;           
                        }
                      } 

                      // If the programmer entered code in data dictionary then insert it into the put handler.
                      if(fieldCalculationCode)
                      {
                        htmlString = htmlString + 
                        "        // Preprocessing for " + objectPath + "\n" +
                        "        " + fieldCalculationCode + "\n\n";
                      }
                      else // No code in the data dictionary for this process. So build generic code.
                      {
                        // Get fieldName from the objectPath. That's the very last part.
                        let fieldName = objectPath.split(".")[objectPath.split(".").length - 1]

                        // Replacing the zero with the letter X for use in comments.
                        let xPath = objectPath.split("0").join("X")

                        // Gives us the subObject with out a zero or X at the end.
                        let containerX = objectPath.split("0")[0].split(".")[objectPath.split("0")[0].split(".").length -1];


                        htmlString = htmlString + 
`        for (let arrayIndex = 0; arrayIndex < ${fieldName}Array.length; arrayIndex++) 
        {
          // Preprocessing for ${xPath}
          if(${fieldName}Array[arrayIndex]) // If the user supplied data for ${xPath}
          {
            // No preprocessing was specifed for ${xPath}. Use it as was supplied by the user.
          }
          else // If the user did not supply data for ${xPath}
          {
            // Save ${xPath} from the most recent record.
            ${recordObject.tableName}Object.${containerX}["${containerX}" + arrayIndex.toString()]["${fieldName}"] = ${fieldName}Array[arrayIndex];
          }
        } 

`

                      }  // End of: Else: no code in the data dictionary for this process.
                    } // End of: if(address[objKey].subObject[property].calculation && ...
                  } // End of: else - This property is not an object.
                } // End of: for-let Check each property of the subobject to see if it too is an object.
              } // End of: if the subfield is also an objectCheck if the current field contains the calculation object and if it has any
            } // End of: function drillIntoObject(address, objKey, previousObjKey, previousKeyPart, objectNestLevel){...}
            
            // Keep track of how deep we have drilled into the object.
            let objectNestLevel = 1;

            // Call the function defined above. 
            // This function will call itself several times if drilling into nested objects is required.
            drillIntoObject(fieldsObject, fieldKey, "", objectNestLevel)
          }
          else // This top level field is not an object - It's just a regular data field.
          {
            if(fieldsObject[fieldKey].calculation && Object.keys(fieldsObject[fieldKey].calculation).length > 0)
            {
              // Add to the array of fields that contain calculations.
              calculatedFieldsArray.push(fieldKey);   

              // Get the (PUT Handler Pre-processing code) from the calculation object for the current field if it exists.
              for (let calcKey in fieldsObject[fieldKey].calculation)
              {
                if(calcKey === "putHandlerPreprocessing")
                {
                  fieldCalculationCode = fieldsObject[fieldKey].calculation[calcKey]; 
                  break;           
                }
              }              

              // If the programmer entered code in data dictionary then insert it into the put handler.
              if(fieldCalculationCode)
              {
                htmlString = htmlString + 
                "        // Preprocessing for " + fieldKey + "\n" +
                "        " + fieldCalculationCode + "\n\n";
              }
              else // No code in the data dictionary for this process. So build generic code.
              {
                htmlString = htmlString + 
                "        // Preprocessing for " + fieldKey + "\n" +
                "        if(" + fieldKey + ") // If the user supplied data for " + fieldKey + "\n" +
                "        {" + "\n" +
                "          // No preprocessing was specifed for " + fieldKey + ". Use it as was supplied by the user." + "\n" +
                "        }" + "\n" +
                "        else // If the user did not supply data for " + fieldKey + "\n" + 
                "        {" + "\n" +
                "          // Save " + fieldKey + " from the most recent record." + "\n" +
                "          " + recordObject.tableName + "Object." + fieldKey + " = recordObject." + fieldKey + ";" + "\n" +
                "        }" + "\n\n";
              } // End of: Else no code in the data dictionary for this process.              
            } // End of: if(fieldsObject[fieldKey].calculation &&...          
          } // End of: Else: this top level field is not an object...
        } // End of: for (let fieldKey in fieldsObject){...}
        // End of: // Generate preprocessing code for the put handlers.
       

        // Insert preprocessing code for handling deletes.

        htmlString = htmlString +
        "        // If we are appending a delete make sure that everything else is coming from the most recent saved record." + "\n" +
        "        if(deleted)" + "\n" +
        "        {" + "\n" +
        "          " + recordObject.tableName + "Object = {};" + "\n" +
        "          " + recordObject.tableName + "Object." + recordObject.tableName + "Id = " + recordObject.tableName + "Id;" + "\n";
       

        for (let key in recordObject.fields) 
        {    
          htmlString = htmlString +
          "          " + recordObject.tableName + "Object." + key + " = recordObject." + key + ";" + "\n";          
        }

        htmlString = htmlString +
        "          " + recordObject.tableName + "Object.timeStamp = Date.now();" + "\n" +        
        "          " + recordObject.tableName + "Object.deleted = true;" + "\n" + 
        "        }" + "\n" +
        "        else" + "\n" +  
        "        {" + "\n" +        
        "          " + recordObject.tableName + "Object.deleted = false;" + "\n" +
        "        }" + "\n\n";

        htmlString = htmlString +               
             
   `
        // Create the logObject.
        // This object will be written to history.json which maintains a history of 
        // all changes to all tables in the database.
        // Behavior from meta.js at 8ymdma3uxbjrggohz977
        var logObject =
        {           
          "historyId" : nextIdObject.nextId + 1,    
          "transactionId" : nextIdObject.nextId + 2,                 
          "rollback" : false,
          "process" : "${recordObject.tableName}._${recordObject.tableName}.put",
          "comment" : "Changing a record",
          "who" : "No login yet.",    
          "${recordObject.tableName}" : ${recordObject.tableName}Object   
        }

        // Calling the function which creates an entry into the database log file.
        _data.append
        (
          'database/dbHistory', 
          'history', 
          logObject, 
          function(err)
          {
            if (!err)  //The history file has been appended to successfully.
            {
              // Calling the function which appends a record to the file ${recordObject.tableName}.json
              _data.append
              (
                '/${recordObject.directory}', 
                '${recordObject.tableName}', 
                ${recordObject.tableName}Object, 
                function(err)
                {
                  if (!err)  //The file has been appended to successfully.
                  {
                    // Call to function which removes lock
                    _data.removeLock
                    (function(error)
                    // start of callback code which is run after attempting to remove the lock.
                    {
                      if(!error) // Database lock was successfully removed.
                      {
                        callback(200); 
                      }
                      else // Good write but unable to remove lock on database.
                      {
                        helpers.log // Log the error.
                        (
                          7,
                          '${helpers.createRandomString(20)}' + '\\n' +
                          'Successful write to ${recordObject.tableName} but unable to remove lock on database' + '\\n' +
                          'The following record was appended to ${recordObject.tableName}:' + '\\n' +                            
                          JSON.stringify(logObject) + '\\n' +   
                          'The following was the error message:' + '\\n' +                                             
                          error + '\\n'
                        ); // End of: helpers.log // Log the error.

                        callback(500, {'Error' : 'Successful write to ${recordObject.tableName} but unable to remove lock on database'});

                      } // End of: else Good write but unable to remove lock on database.

                    } // End of callback code which is run after attempting to remove the lock.
                    ); // End of: _data.removeLock(function(error){...}
                    // End of: Call to function which removes lock

                  }    // End of: if (!err)  //The file has been appended to successfully.
                  else // There was an error appending to ${recordObject.tableName}.
                  {
                    helpers.log // Log the error.
                    (
                      5,
                      '${helpers.createRandomString(20)}' + '\\n' +
                      'There was an error when appending to the ${recordObject.tableName} file.' + '\\n' +
                      'The following record may or may not have been appended to ${recordObject.tableName}:' + '\\n' +                            
                      JSON.stringify(logObject) + '\\n' +
                      'Attempting to rollback the entry.' + '\\n' +    
                      'The following was the error message:' + '\\n' +                                             
                      err + '\\n'
                    );

                    // Assemble rollback record for the ${recordObject.tableName} file which will negate previous entry if any.
                    // Behavior from meta.js at 8l4zwqs63qwmp81rjcpw  
                    ${recordObject.tableName}Object = 
                    {
                        "${recordObject.tableName}Id" : recordObject.nextId,
`


        for (let key in recordObject.fields) 
        {    
          htmlString = htmlString +   
          "                        \"" + key + "\" : recordObject." + key + "," + "\n";     
        }


        htmlString = htmlString + 

`                        "timeStamp" : recordObject.timeStamp,
                        "deleted" : recordObject.deleted
                    };                        

                    // Assemble rollback record for the history file which will negate previous entry if any.
                    logObject =
                    {                    
                      "historyId" : nextIdObject.nextId + 3,    
                      "transactionId" : nextIdObject.nextId + 2,                                
                      "rollback" : true,
                      "process" : "${recordObject.tableName}._${recordObject.tableName}.put",
                      "comment" : "Error during Put. Appending rollback",                        
                      "who" : "No login yet",    
                      "${recordObject.tableName}" : ${recordObject.tableName}Object   
                    }

                    // Start the rollback process.
                    _data.append // Append a rollback the entry in history.
                    (
                      'database/dbHistory', 
                      'history', 
                      logObject, 
                      function(err)
                      {
                        if (!err) // The roll back entry in history was appended successfully.
                        {
                          // Calling the function which appends a record to the file ${recordObject.tableName}.json
                          _data.append
                          (
                            '/${recordObject.directory}', 
                            '${recordObject.tableName}', 
                            ${recordObject.tableName}Object, 
                            function(err)
                            {
                              if (!err) // The rollback record for ${recordObject.tableName} was appended successfully.
                              {
                                helpers.log
                                (
                                  5,
                                  '${helpers.createRandomString(20)}' + '\\n' +
                                  'Rollback entry in the ${recordObject.tableName} file was appended successfully' + '\\n' +
                                  'The following was the record we rolled back:' + '\\n' +
                                  JSON.stringify(logObject) + '\\n'                                   
                                ); // End of: helpers.log(...)
                              }
                              else // There was an error when rolling back record for ${recordObject.tableName}.
                              {
                                helpers.log
                                (
                                  7,
                                  '${helpers.createRandomString(20)}' + '\\n' +
                                  'There was an error appending a rollback entry in the ${recordObject.tableName} file' + '\\n' +
                                  'The following record may or may not have been rolled back:' + '\\n' +
                                  JSON.stringify(logObject) + '\\n' +   
                                  'An error here does not necessarily mean the deleting append to ${recordObject.tableName} did not happen.' + '\\n' +                                        
                                  'CHECK TO SEE IF history and ${recordObject.tableName} ARE STILL IN SYNC' + '\\n' + 
                                  'The following is the error message:' + '\\n' +                                                                     
                                  err  + '\\n'
                                ); // End of: helpers.log(...)
                              }

                            } // End of: callback function(err){...}
                          ); // End of: _data.append(...)

                        } // End of: The roll back entry in history was appended successfully.
                        else // There was an error when appending a rollback entry in history.
                        { 
                          helpers.log
                          (
                            7,
                            '${helpers.createRandomString(20)}' + '\\n' +
                            'There was an error appending a rollback entry in the history file' + '\\n' +
                            'A rollback entry may or may not have been written in the ${recordObject.tableName} file' + '\\n' +  
                            'CHECK TO SEE IF history and ${recordObject.tableName} ARE STILL IN SYNC' + '\\n' +                                      
                            'The following was the record we tried to roll back:' + '\\n' +
                            JSON.stringify(logObject) + '\\n' +        
                            'The following is the error message:' + '\\n' +
                            err  + '\\n'
                          );
                        } // End of: else There was an error when appending a rollback entry in history.
                      } // End of: callback function(err){...}
                    ); // End of: _data.append(...)

                    callback(500, {'Error' : 'Could not create the new ${recordObject.tableName}.'});

                  } // End of: else // There was an error appending to ${recordObject.tableName}.
                } // End of: callback function
                ); // End of: Calling the function which appends a record to the file ${recordObject.tableName}.json 

            } //End of: The history file has been appended to successfully.
            else // There was an error appending to the history file.
            {
              helpers.log
              (
                7,
                '${helpers.createRandomString(20)}' + '\\n' +
                'There was an error appending to the history file' + '\\n' +
                'An error here does not necessarily mean the append to history did not happen.' + '\\n' +  
                'But an error at this point in the code surely means there was no append to ${recordObject.tableName}' + '\\n' +                                          
                'CHECK TO SEE IF history and ${recordObject.tableName} ARE STILL IN SYNC' + '\\n' +                    
                'The following was the record we tried to append:' + '\\n' +
                JSON.stringify(logObject) + '\\n' +                   
                'The following is the error message:' + '\\n' +                  
                err  + '\\n'
              );

              callback(500, {'Error' : 'Could not create the new ${recordObject.tableName}.'});
            }
          } // End of: callback function
        ); // End of: _data.append(dbHistory...)
        // End of: Calling the function which creates an entry into history. 

      }; // End of: writable.write = function(payload){...}

      // Passes the payload stream to the writable object which calls writable.write 
      // which does something useful with the payload.
      pipeline
      (
        payload,
        writable,
        function(pipelineError)
        {
          if(pipelineError)
          {
            helpers.log // Log the error.
            (
              7,
              '${helpers.createRandomString(20)}' + '\\n' + 
              'Pipeline error. The message was as follows' + '\\n' +                                             
              pipelineError + '\\n'                                                 
            ); // End of: helpers.log // Log the error.
          } // End of: if(pipelineError){...}
        } // End of: function(piplineError){...}
      ); // End of: Pipeline
    }); //End of: helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)
  }); // End of: lib.nextId(function(err, nextIdObject)
}; // End of: handlers._${recordObject.tableName}.put = function(...
// End of: Define the ${recordObject.tableName} put subhandler function



`      

        // End of: Assemble the PUT Handler   
        //????
        // Start of: Assemble the GET Handler  
        
        htmlString = htmlString +

`
// Define the ${recordObject.tableName} get subhandler function.
// Streams the ${recordObject.tableName} file or part of it back to the client.
${recordObject.tableName}._${recordObject.tableName}.get = function(data, callback)
{
  let amountOfWhereClauses = 0; // We haven't found any yet.
  let amountOfOrderByClauses = 0; // We haven't found any yet.

  // No value set but declared here because we need access to these thoughout the entire function.
  let queryArray, queryString;

  // If there is a query expression.
  if (data.hasOwnProperty('queryString') || typeof(Object.keys(data.queryStringObject)[0]) != 'undefined')
  {

    if (data.hasOwnProperty('queryString'))
    {
      // In this case the queryString is coming from ${recordObject.tableName}Edit page.
      queryString = data.queryString
    }
    else
    {
      // In this case the queryString is coming from the ${recordObject.tableName}List page.
      // For some reason the string comes in as an array element in the object's 
      // key instead of it's value. That's why the Object.keys(...)[0] method.
      queryString = Object.keys(data.queryStringObject)[0];
    }

    // Make an array out of the queryString where each phrase of the query is an element.
    queryArray = queryString.split(":;");

    // Define a function to restore encoded characters that the 
    // client may pass to the server in the query string.
    function restoreCharacters(elementValue, elementIndex, queryArray) 
    {
      switch(elementValue) {
        case "{[POUND]}":
          queryArray[elementIndex] = "#";
        break;
        case "{[AMPERSAND]}":
          queryArray[elementIndex] = "&";
        break;
        case "{[EQUALS]}":
          queryArray[elementIndex] = "=";
        break;
        case "{[BACK-SLASH]}":
          queryArray[elementIndex] = "\\\\";
        break;
        case "{[SINGLE-QUOTE]}":
          queryArray[elementIndex] = "'";
        break;
        case "{[PLUS]}":
          queryArray[elementIndex] = "+";
        break;                                        
      }
    }

    // Call the function defined above once for each element in the queryArray to decode
    // special characters that the client may have passed to the server in the query string.
    queryArray.forEach(restoreCharacters);    
    
    let lengthOfQueryArray = queryArray.length;    

    // Look at the first element to find out if we have a where clause or an orderby clause.
    let firstQueryElement = queryArray[0];
    let indexOfNextPossibleOrderBy = 0

    if(firstQueryElement == 'WHERE') // The user filled out a where clause.
    {
      // Find out howmany ANDWHERE clauses there are starting at index 4 and counting forward by 4 until ANDWHERE is not found.
      // We are counting by four because we only want to check elements where the ANDWHERE value would carry the correct context.
      // In other words we only want to look where a conjuction would be found. Not a field value and not a comparison operator. 
      amountOfWhereClauses = 1; // We know about the first one so far.
      let indexOfNextPossibleANDORWHERE = amountOfWhereClauses * 4
      let proceedWithLoop = true;

      while (indexOfNextPossibleANDORWHERE < lengthOfQueryArray -1 && proceedWithLoop == true) 
      {
        if(queryArray[indexOfNextPossibleANDORWHERE] == "ANDWHERE" || queryArray[indexOfNextPossibleANDORWHERE] == "ORWHERE")
        {
          amountOfWhereClauses = amountOfWhereClauses + 1;
          indexOfNextPossibleANDORWHERE = amountOfWhereClauses * 4
        }
        else
        {
          indexOfNextPossibleOrderBy = indexOfNextPossibleANDORWHERE
          proceedWithLoop = false;
        }
      }
    }
    else // The firstQueryElement wasn't 'WHERE' So it must be 'ORDERBY'
    {
      // If we have something and there are no where clauses then we must be starting with an orderby clause.
      amountOfOrderByClauses = 1
    }

    // Now we are going to find out how many orderby clauses there are.
    let proceedWithLoop = true;

    while (indexOfNextPossibleOrderBy < lengthOfQueryArray - 1 && proceedWithLoop == true) 
    {
      if(queryArray[indexOfNextPossibleOrderBy] == "ORDERBY" || queryArray[indexOfNextPossibleOrderBy] == "ThenOrderBy")
      {
        amountOfOrderByClauses = amountOfOrderByClauses + 1;
        indexOfNextPossibleOrderBy = indexOfNextPossibleOrderBy + 3;
      }
      else
      {
        proceedWithLoop = false;
      }
    }

  } // End of: if (typeof(data.queryStringObject[0]) !== 'undefined'){...}
  // End of: If the user created a query expression.


  
  // Create an empty map data structure which will be used to merge ${recordObject.tableName} records that have the same unique fields.
  // Chose map data structure over objects because maps are guaranteed to maintain the same order where as objects are not.
  let ${recordObject.tableName}Map = new Map();
  
  // This function sets up a stream where each chunk of data is a complete line in the ${recordObject.tableName} file.
  let readInterface = readline.createInterface
  (
    { // specify the file to be read.
      input: fs.createReadStream(_data.baseDir + '/${recordObject.directory}' + '/' + '${recordObject.tableName}' + '.json'),
    }
  );



  // Look at each record in the file.
  readInterface.on('line', function(line) 
  {
    // Convert the JSON string (a single line from the ${recordObject.tableName} file) into lineValueObject.
    // These objects will written back to a new file after deleting some un-needed key/value pairs.
    let lineValueObject = JSON.parse(line);
    let recordWasDeleted = false;    

    // Declare a variable to serve as a key in the map to manage the lineValueObject.
    let ${recordObject.tableName}Id = lineValueObject.${recordObject.tableName}Id;      

    if(lineValueObject.deleted === true) // if the record in the file ${recordObject.tableName}.json had the delete field set to true:
    {
      // Remove this record from the map 
      ${recordObject.tableName}Map.delete(${recordObject.tableName}Id);
      recordWasDeleted = true;
    }
    else if(amountOfWhereClauses > 0) // else if the user created one or more filter expressions
    {
      let whereClauseCount = 1; // Represents the filter expression we are currently evaluating.
      let index = 1; // Used to navigate the queryArray.
      let shouldDeleteThisRecord = false;
      let shouldLoopAgain = true;


      function drillIntoObject(jsonRecordObject, queryItemArray, itemIndex)
      {
          // Converting each property key from dot notation to bracket notation.
          // Then using bracket notation to drill down into the object.

          // Get a reference to the recordObject called "value"
          let objValue = jsonRecordObject;

          // Split the property key into an array delimited by the dot if any.
          // The array will be used to drill into nested objects.
          const keyParts = queryItemArray[itemIndex].split(".");

          // Here is where we do the drilling.
          for (let keyPart of keyParts) 
          {
            // Make objValue point to it's sub-object or it's final value when the loop is finished running.
            objValue = objValue[keyPart];

            // Not all records will have the same data structure - 
            // Fields specified in the data dictionary may be missing.
            // So don't try to get a value if it's not there - 
            // That would cause an error and stop the table from loading
            if(objValue === undefined){break};            
          } 

          return objValue;
      };


      let fieldValue = drillIntoObject(lineValueObject, queryArray, index);


      while(whereClauseCount <= amountOfWhereClauses && shouldLoopAgain === true)
      {
        if (fieldValue === undefined) // Not all records will have the same structure. The field may not exist.
        {
          shouldDeleteThisRecord = true;
        }
        else
        {
          switch(queryArray[index + 1]) 
          {
            case 'MatchesExactly': // 1
            {
              if(fieldValue != queryArray[index + 2])
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;

            case 'MatchesExactlyNotCaseSensitive': // 2
            {
              if(fieldValue.toString().toLowerCase() != queryArray[index + 2].toString().toLowerCase())
              {
                shouldDeleteThisRecord = true;
              }             
            }
            break;
            
            case 'DoesNotMatchExactly': // 3
              {
                if(fieldValue == queryArray[index + 2])
                {
                  shouldDeleteThisRecord = true;
                }
              }
              break;

            case 'DoesNotMatchExactlyNotCaseSensitive': // 4
            {
              if(fieldValue.toString().toLowerCase() == queryArray[index + 2].toString().toLowerCase())
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;

            case 'BeginsWith': // 5
            {
              if(fieldValue.toString().indexOf(queryArray[index + 2].toString()) != 0)
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;
            
            case 'BeginsWithNotCaseSensitive': // 6
            {
              if(fieldValue.toString().toLowerCase().indexOf(queryArray[index + 2].toString().toLowerCase()) != 0)
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;    

            case 'DoesNotBeginWith': // 7
            {
              if(fieldValue.toString().indexOf(queryArray[index + 2].toString()) == 0)
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;

            case 'DoesNotBeginWithNotCaseSensitive': // 8
            {
              if(fieldValue.toString().toLowerCase().indexOf(queryArray[index + 2].toString().toLowerCase()) == 0)          
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;          

            case 'Contains': // 9
            {
              if(fieldValue.toString().indexOf(queryArray[index + 2].toString()) == -1)
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;

            case 'ContainsNotCaseSensitive': // 10
            {
              if(fieldValue.toString().toLowerCase().indexOf(queryArray[index + 2].toString().toLowerCase()) == -1)          
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;

            case 'DoesNotContain': // 11
            {
              if(fieldValue.toString().indexOf(queryArray[index + 2].toString()) > -1)
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;

            case 'DoesNotContainNotCaseSensitive': // 12
            {
              if(fieldValue.toString().toLowerCase().indexOf(queryArray[index + 2].toString().toLowerCase()) > -1)          
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;

            case 'EndsWith': // 13
            {
              if(!fieldValue.toString().endsWith(queryArray[index + 2].toString()))
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;
            
            case 'EndsWithNotCaseSensitive': // 14
            {
              if(!fieldValue.toString().toLowerCase().endsWith(queryArray[index + 2].toString().toLowerCase()))
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;
            
            case 'DoesNotEndWith': // 15
            {
              if(fieldValue.toString().endsWith(queryArray[index + 2].toString()))
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;
            
            case 'DoesNotEndWithNotCaseSensitive': // 16
            {
              if(fieldValue.toString().toLowerCase().endsWith(queryArray[index + 2].toString().toLowerCase()))
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;

            case 'IsGreaterThan': // 17
            {
              if(fieldValue <= queryArray[index + 2])
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;          
            
            case 'IsGreaterThanNotCaseSensitive': // 18
            {
              if(fieldValue.toString().toLowerCase() <= queryArray[index + 2].toString().toLowerCase())
              {
                shouldDeleteThisRecord = true;
              }
            }
            break; 
            
            case 'IsGreaterThanOrEqualTo': // 19
            {
              if(fieldValue < queryArray[index + 2])
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;
            
            case 'IsGreaterThanOrEqualToNotCaseSensitive': // 20
            {
              if(fieldValue.toString().toLowerCase() < queryArray[index + 2].toString().toLowerCase())
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;
            
            case 'IsLessThan': // 21
            {
              if(fieldValue >= queryArray[index + 2])
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;

            case 'IsLessThanNotCaseSensitive': // 22
            {
              if(fieldValue.toString().toLowerCase() >= queryArray[index + 2].toString().toLowerCase())
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;                
            
            case 'IsLessThanOrEqualTo': // 23
            {
              if(fieldValue > queryArray[index + 2])
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;          
            
            case 'IsLessThanOrEqualToNotCaseSensitive': // 24
            {
              if(fieldValue.toString().toLowerCase() > queryArray[index + 2].toString().toLowerCase())
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;          
                        
            default: // When there are no case matches then do this.
            {

            }

          } // End of: switch(queryArray[index + 1])  
        } // End of: if (fieldValue === undefined){...}
             
        // All (ANDWHERE) clauses will be evaluated first.
        // The order of the clauses will matter.


        // If the record failed the specified match condition and has set the delete flag:
        // Then we need to look for an ORWHERE clause further along in the queryArray that might pass this record.
        // Any ANDWHERE clauses between are already failures because all AND conditions must pass or none should pass.
        if(shouldDeleteThisRecord === true)
        {      
          let indexOfNextPossibleOrWhere = index + 3;
          let proceedWithThisWhileLoop = true;     
          let foundForwardOrWhereClause = false; // Haven't found any yet.


          while (indexOfNextPossibleOrWhere <= amountOfWhereClauses * 4 && proceedWithThisWhileLoop == true) 
          {                       
            if(queryArray[indexOfNextPossibleOrWhere] == "ORWHERE") //We found a filter that may pass this record.
            {
              foundForwardOrWhereClause = true;
              proceedWithThisWhileLoop = false;
              // Need to repeat the outside while loop (not this one) at the index for the ORWHERE filter just found.
            }
            else // We did not find an ORWHERE filter this time through the while loop
            {
              // lets loop again to look further along the queryArray.
              indexOfNextPossibleOrWhere = indexOfNextPossibleOrWhere + 4;
              proceedWithThisWhileLoop = true;                           
            }
          } // End of: while (indexOfNextPossibleOrWhere < amountOfWhereClauses * 4 -1 && proceedWithLoop == true){...}

          
          if(foundForwardOrWhereClause === true) // Another ORWHERE clause exists that might pass this record.
          {
            // index = index + 4;
            index = indexOfNextPossibleOrWhere + 1
            whereClauseCount = whereClauseCount + 1;   
            shouldLoopAgain = true;  
            recordWasDeleted = false;    
            shouldDeleteThisRecord = false;              
          }

          // FAILING THIS RECORD!!!
          // Breaking out of both while loops and deleting this record. 
          else // Else: there are no more ORWHERE filters that could save this record
          {
            // Finally remove this record from the map 
            ${recordObject.tableName}Map.delete(${recordObject.tableName}Id);
            recordWasDeleted = true;  
            shouldLoopAgain = false;  
            shouldDeleteThisRecord = false;  
          // There is no more processing for this particular record in readInterface.on    
          // IT ALL ENDS HERE FOR THIS RECORD!!!                  
          }

        } //End of: if(shouldDeleteThisRecord === true){...}

        // Else: the current filter passed this record.
        else // shouldDeleteThisRecord was false.
        {

        // Since the record passed through this current filter we need to 
        // see if there is an ANDWHERE filter right next to this current filter. 
        // Any further ANDWHERE filters right next to this current one must also 
        // pass the record until there are no more filters or an ORWHERE filter is 
        // encountered. In that case the loop is stopped and the record is passed.

          let indexOfNextPossibleAndWhere = index + 3; 
    
          // If we found an ANDWHERE filter that must pass this record.  
          if(queryArray[indexOfNextPossibleAndWhere] == "ANDWHERE") 
          {
            // Need to repeat the outside while loop (not this one) at the index for the ANDWHERE filter just found.
            // If the filter is passed then we will be back here again looking for another ANDWHERE clause.
            index = index + 4;
            whereClauseCount = whereClauseCount + 1;   
            shouldLoopAgain = true;  
            recordWasDeleted = false;    
            shouldDeleteThisRecord = false; 
          }
          else // We did not find an ANDWHERE filter this time through the while loop
          {
            // PASSING THIS RECORD!!!
            // Breaking out of both while loops and passing this record.
            shouldLoopAgain = false; 
            recordWasDeleted = false;  
          }

        } // End of: else: shouldDeleteThisRecord was false
        

      } // End of: while(whereClauseCount <= amountOfWhereClauses && shouldLoopAgain === true)
      
    } //End of: else if(amountOfWhereClauses > 0) // else if the user created one or more filter expressions

    //If the record was not marked for deletion and passed through the filters above:
    if(recordWasDeleted === false)
    {
      `
        // Start of: Remove any unpublished fields from the lineValueObject before returning it to the requester.
        // 1. Create an array with all the field names for fields which are not published.
        let unpublishedFieldsArray = [];


        // Loop thorough the top level fieldsObject and drill in as required
        for (let fieldKey in fieldsObject)
        {
          // If this top level field is an object containing more fields inside...
          if(fieldsObject[fieldKey].subObject)
          {
            // Declare a function that we will use to drill into the object.
            function drillIntoObject(address, objKey, previousObjKey, previousKeyPart, objectNestLevel)
            {      
              // if the subfield is also an object then this function calls itself using the subfield parameters.
              // This will continue drilling in until we are at the end of the branches where we encounter the data fields
              if(address[objKey].subObject)
              { 
                // Check each property of the subobject to see if it too is an object.
                for (let property in address[objKey].subObject)
                {
                  // If the property is also an object
                  if(address[objKey].subObject[property].subObject)
                  {
                    // This function calls itself so as to go deeper into the object
                    drillIntoObject(address[objKey].subObject, property, objKey, "subObject", objectNestLevel + 1);
                  }
                  else // This property is not an object. We are at the end of the branch where we encounter a data field.
                  { 
                    // Assemble the path through the current object to the current data field.
                    let objectPath = objKey + "." + "subObject" + "." + property;

                    // If the current object is nested then prepend the path to include the parent objects.
                    objectPath = previousObjKey.length === 0 ? objectPath : previousObjKey + "." + previousKeyPart + "." + objectPath;

                    if(address[objKey].subObject[property].published === false)
                    {
                      unpublishedFieldsArray.push(objectPath);   
                    } 
                  } // End of: else - This property is not an object.
                } // End of: for-let Check each property of the subobject to see if it too is an object.
              } // End of: if the subfield is also an object
            }; // End of: function drillIntoObject(address, objKey, previousObjKey, previousKeyPart, objectNestLevel){...}
            
            // Keep track of how deep we have drilled into the object.
            let objectNestLevel = 1;

            // Call the function defined above. 
            // This function will call itself several times if drilling into nested objects is required.
            drillIntoObject(fieldsObject, fieldKey, "", "", objectNestLevel)
          }
          else // This top level field is not an object - It's just a regular data field.
          {
            if(fieldsObject[fieldKey].published === false)
            {
              unpublishedFieldsArray.push(fieldKey);   
            }          
          }

        } // End of: topFieldsArray.forEach(function (fieldKey, topFieldsArrayIndex){...}
        // End of: // Loop thorough the top level fields 


        unpublishedFieldsArray.forEach(function(elementValue)
        {

          htmlString = htmlString +
          "// Remove the " + elementValue + " key/value pair from the lineValueObject before returning it to the requester." + "\n" +
          "      delete lineValueObject." + elementValue + ";" + "\n\n";         

        }); // End of: Remove any unpublished fields from the lineValueObject before returning it to the requester.


        htmlString = htmlString +
`      // Remove the deleted key/value pair from the lineValueObject before returning it to the requester.
      delete lineValueObject.deleted;            

      // Update this record in the map.
      ${recordObject.tableName}Map.set(${recordObject.tableName}Id, lineValueObject);
    }

  }); // End of: readInterface.on('line', function(line){...}
  // End of: Look at each record...


  // This listener fires after we have looked through all the records in the ${recordObject.tableName} file.
  // The callback function defined here will stream the ${recordObject.tableName} list back to the clients browser.
  readInterface.on('close', function() 
  {          
    // This readable stream will be used to write the result of the merge to a new file.
    const sourceStream = new Readable(); 

    for (const [key, valueObject] of ${recordObject.tableName}Map)
    {
      // Convert the data object to a string.
      let stringData = JSON.stringify(valueObject);     

      // Load the readable stream with data.
      sourceStream.push(stringData + '\\n');                  
    }       

    // Tell the stream no more data is coming.
    sourceStream.push(null);     

    callback(200, sourceStream, 'stream');             

  }); // End of: readInterface.on('close', function(){...}   

}; // End of: handlers._${recordObject.tableName}.get = function(data, callback){do stuff}
// End of: Define the ${recordObject.tableName} get subhandler function.  


// A payloadArray is used to validate and save nested data to the database.
// Declaring a function that we will use to load a payloadArray dynamically once the payload is known.  
// The nestLevel determines which element in payloadKeyArray we are addressing. It's the index
// The loopCount determines the value of the number we are appending to the element when building the 
// property key used to access the property value from payloadObject that we wish to load into payloadArray.
// Behavior from meta.js at defq4ols90h44rvcw8st
function loadPayloadArray(payloadArray, payloadKeyArray, payloadObject, nestLevel, loopCount, previousPart, continueLooping)
{      
  let keyUnderConstruction, recursionResult;    

  // for (let loopCount = 0; loopCount < payloadKeyArray.length - 1; loopCount = loopCount + 1)
  while(continueLooping)
  {
    // Start with a blank key.
    keyUnderConstruction = "";

    // If we are at the top. 
    if(nestLevel === 0)
    {
      keyUnderConstruction = previousPart +
      payloadKeyArray[nestLevel] + "_" + payloadKeyArray[nestLevel]  + loopCount.toString();
    } // End of: If we are at the top.
    else // Not at the top
    {
      keyUnderConstruction = previousPart +
      "_" + payloadKeyArray[nestLevel] + "_" + payloadKeyArray[nestLevel]  + loopCount.toString();      
    } // End of: Else: we are not at the top.

    // If we are at the bottom
    // Finish constructing the key.
    // Then run the key expression in a while loop to load the payloadArray
    if(nestLevel === payloadKeyArray.length - 2)
    {
      // Finish building the keyUnderConstruction.
      keyUnderConstruction = keyUnderConstruction +
      "_" + payloadKeyArray[nestLevel + 1];

      // Now we will use the key that we built.
      // Check if the data exists in the payload
      if(payloadObject[keyUnderConstruction])
      {
        // If the data is there then push it onto the array we use to write to the database.
        payloadArray.push([keyUnderConstruction, payloadObject[keyUnderConstruction]]);

        loopCount = loopCount + 1;
      }
      else // No more payloads were found at this level.  
      {
        // If nothing was found when the loopCount is at zero then we are completely done.
        if(loopCount === 0)
        {
          continueLooping = false;
          return [payloadArray, continueLooping];
        }
        else // data was found previously at this level so we are not done.
        {
          continueLooping = true;
          return [payloadArray, continueLooping];

        } // End of: Else: data was found previously at this level so we are not done.
      } // End of: Else: No more payloads were found at this level. 
    } // End of: If we are at the bottom
    else // We are not at the bottom. We need to recurse deeper into the payloadKeyArray.
    {
      // This function calls itself so as to add more text to the keyUnderConstruction
      recursionResult = loadPayloadArray(payloadArray, payloadKeyArray, payloadObject, nestLevel + 1, 0, keyUnderConstruction, true);

      payloadArray = recursionResult[0];

      loopCount = loopCount + 1;         

      continueLooping = recursionResult[1];
      
      if(!continueLooping)
      {
        return recursionResult
      };

    } // End of: Else we are not at the bottom. Go deeper into the recursion and pop out again.
  } // End of: while(true)
}; // End of: function loadPayloadArray(address, objKey, objectNestLevel, previousPath){...}
// End of: Declare a function that we will use to load the payloadArray dynamically once the payload is known.  


// Define a function to load nested data which has been validated into the object we will write to the database.
function buildBranches(fieldArray, persistObject)
{
  // Loop through the fieldArray which contains nested data from the client.
  fieldArray.forEach
  (
    // Perform the following function on every element in the fieldArray.
    function(fieldArrayElement)
    {
      // Get a reference to the object tree so we can build branches.
      let objectBranch = persistObject;  

      // Make an array from the path string splitting it on the underscore.
      // The elements tell us what to name the branches.
      fieldArrayElement[0].split("_").forEach
      (
        // Perform the following function for every element in fieldArrayElement.
        function(pathArrayElement, pathArrayIndex, pathArray)
        {
          // If we are not on the last one - we are building branches of this object.
          if(pathArrayIndex < pathArray.length - 1)
          {
            // If the branch does not exist...
            if(!objectBranch[pathArrayElement])
            {
              // Create the branch
              objectBranch[pathArrayElement] = {};

              // Jump onto the new branch
              objectBranch = objectBranch[pathArrayElement];
            } // End of: If the branch does not exist.
            else // The branch exists. It was made in a previous loop
            {
              // Jump onto the existing branch
              objectBranch = objectBranch[pathArrayElement];                  
            } // End of: Else - The branch exists. It was made in a previous loop
          } // End of: If we are not on the last one...
          else // This is the last element which holds the name of the field. We are inserting the value.
          {
            // Put a leaf at the end of the current branch and asign the value for the field we are saving to the database.
            objectBranch[pathArrayElement] = fieldArrayElement[1];
          } // End of: Else - This is the last element ...
        } // End of: function(pathArrayElement, pathArrayIndex, pathArray){...}
      ) // fieldArrayElement[0].split("_").forEach(...)
    } // End of: function(fieldArrayElement){...}
  ) // End of: fieldArray.forEach(...)

  return persistObject;

} // End of: function buildBranches(fieldArray, persistObject){...}
// End of: Define a function to load nested data which has been validated into the object we will write to the database.


// Export the module
module.exports = ${recordObject.tableName};

`

     
        //????
        // Write out this javascript to file.

        let fileExtension = ".js";

        // Call the function which appends a string to a file 
        // then process anonymous callback function defined here.
        meta.append
        (
          recordObject.directory, 
          recordObject.tableName + "Logic", 
          fileExtension,
          htmlString, 
          function(err)
          {
            if (!err) // The javascript string was written successfully to a file.
            {
              helpers.log
              (
              5,
              'df3z3xrz7aquiy9dqecs' + '\n' +
              'The javascript file ' + recordObject.tableName + "Logic" + '.js was written successfully to a file.' + '\n'                                  
              ); // End of: helpers.log(...)
            }
            else // There was an error writing the HTML string to a file.
            {
              helpers.log
              (
              7,
              'v2sbc2t9l2lo06tkwxtj' + '\n' +
              'There was an error writing the javascript string to a file' + '\n'
              ); // End of: helpers.log(...)
            } // End of: else there was an error writing the javascript string to a file.
          } // End of: callback function(err){...}
        ); // End of: _data.append(...)


      }; // End of: writable.write = function(payload){...}

      // Passes the payload stream to the writable object which calls writable.write 
      // which does something useful with the payload.
      pipeline
      (
        payload,
        writable,
        function(pipelineError)
        {
          if(pipelineError)
          {
            helpers.log // Log the error.
            (
              7,
              'lfywxqkxg2am7df6ozhl' + '\n' + 
              'Pipeline error. The message was as follows' + '\n' +                                             
              pipelineError + '\n'                                                 
            ); // End of: helpers.log // Log the error.
          } // End of: if(pipelineError){...}
        } // End of: function(piplineError){...}
      ); // End of: Pipeline

    } // End of: if(!error) Got the most recent record from getMostRecent
    else // There was indeed an error returned by getMostRecent when attempting to get the most current record.
    {
      helpers.log // Log the error.
      (
        7,
        'wbxpa2p2tops3wrd1dquo' + '\n' + 
        'The following was the error message from getMostRecent:' + '\n' +                                             
        errorFromGetMostRecent + '\n'                                                 
      ); // End of: helpers.log // Log the error.
    } // End of: Else // There was indeed an error returned by getHashedPass when attempting to get the most current record. 
  }); //End of: helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)  

}// End of: meta.build.serverSideLogic = function(metadataId){...}




// Define a function which builds a webpage for 
// adding records to a json table in the database.
meta.build.addWebPage = function(metadataId)
{
  // This object tells the getMostRecent function which record to retrive in the data dictionary (metadata.json)
  let dataObject = {};

  // We are not trying to write to the table so no need to enforce uniqueness.
  // Since this field is never empty in metadata.json, an empty string will pass the uniqueness test in getMostRecent().
  dataObject.uniqueField01Value = "";

  dataObject.uniqueField01Name = "tableName";           
  dataObject.path = '/database/dbMetadata/metadata.json';
  dataObject.queryString = 'WHERE:;metadataId:;MatchesExactly:;' + metadataId + ':;';  

  let recordObject;
  let htmlString = "";

  // Collect information about the webpage from the metadata.
  // 1. Look in metadata.json - Read the object for the given metadataId.
  helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)
  {
    if(!errorFromGetMostRecent) // Got the most recent record from getMostRecent
    {
      // Used to decode the payload buffer into readable text.
      let decoder = new StringDecoder('utf8');    

      // This instance of the Writable object gives us a place for a callback to run when the payload is received.
      const writable = new Writable();

      // Called by pipeline below.
      // Here is where we process the single line of json returned in the payload and make the webpage.
      writable.write = function(payload)     
      {
        let stringContainer = '';                 
        stringContainer = stringContainer + decoder.write(payload);
        recordObject = JSON.parse(stringContainer);
 
        // All the metadata for the table is in record object.
        // Assemble the webpage string from the metadata in recordObject.

        let tableNameInTitleCase = recordObject.tableName[0].toUpperCase() + recordObject.tableName.slice(1);

        htmlString = htmlString + 
        "<!-- This entire file was generated by meta.js at 37bdou8uc4khgjtts5nh -->" + "\n" +
        "<!-- Any changes to this file will be overwritten when the application is regenerated -->" + "\n" +
        "<!-- Make your changes in the generator meta.js or in the data dictionary metadata.json -->" + "\n";        

        // If we have specified text for the addPage heading.
        if(recordObject.webPages.addPage.heading)
        {
          htmlString = htmlString + 
          "<h1>" + recordObject.webPages.addPage.heading + "</h1>" + "\n";
        }
        else // We did not specify text for the addPage heading.
        {
          htmlString = htmlString +               
          "<h1>Add a Record to the " + tableNameInTitleCase + " Table</h1>" + "\n";
        }


        let addFormObject = recordObject.webPages.addPage.forms.addForm;


        // If we have specifed text for the addform heading.
        if(addFormObject.heading)
        {
          htmlString = htmlString +           
          "<h2>" + addFormObject.heading + "</h2>" + "\n" +
          "\n";
        }

        htmlString = htmlString +
        "<div class=\"formWrapper\">" + "\n" +
        "  <form id=\"" + recordObject.tableName + "Add\" action=\"/api/" + recordObject.tableName + "\" method=\"POST\">" + "\n" +
        "    <div class=\"formError\"></div>" + "\n";

        // Start of: Add field controls to the html.       

        // Make an array of keys in the formElements object. Used to deep merge defaultElements with formElements.
        // There will only be one form on the add page so, for now, no need to loop through the forms object.       
        let keysOfFormElementsArray = Object.keys(recordObject.webPages.addPage.forms.addForm.formElements);

        // Deep merge the defaultElements with formElements - formElements taking precedence.
        keysOfFormElementsArray.forEach(function (elementValue)
        {
          // console.log("0. This is the elementValue of the keysOfFormElementsArray : ", elementValue, "\n");

          // call the function which builds the HTML for the form element.
          htmlString = htmlString + meta.makeAddPageElementHtml(elementValue, recordObject);
        }); // End of: keysOfFormElementsArray.forEach(function (elementValue){...}

        // End of: Add field controls to the html.      
        
        
        // Finish the form with the submit button.
        htmlString = htmlString +        
        "    <div class=\"inputWrapper ctaWrapper smallTopMargin\">" + "\n";        


        // If we have specified text for the submit button.
        if(recordObject.webPages.addPage.forms.addForm.submitButtonText)
        {
          htmlString = htmlString +     
          "      <button type=\"submit\" class=\"cta green\">" + recordObject.webPages.addPage.forms.addForm.submitButtonText + "</button>" + "\n";
        }
        else
        {
          htmlString = htmlString +               
          "      <button type=\"submit\" class=\"cta green\">Save New " + tableNameInTitleCase + "</button>" + "\n";
        }


        htmlString = htmlString + 
        "    </div>" + "\n" +
        "  </form>" + "\n" +
        "</div>";


        htmlString = htmlString + 
`

<script>
/*
 * Frontend Logic for application
 *
 */

"use strict";

// Container for frontend application
var app = {};


// AJAX Client (for RESTful API)
// Create an empty object to contain the client.
app.client = {}




// Define interface function for making API calls.
app.client.request = function(headers,path,method,queryStringObject,payload,callback)
{
  // Set defaults
  headers = typeof(headers) == 'object' && headers !== null ? headers : {};
  path = typeof(path) == 'string' ? path : '/';
  method = typeof(method) == 'string' && ['POST','GET','PUT','DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
  queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
  payload = typeof(payload) == 'object' && payload !== null ? payload : {};
  callback = typeof(callback) == 'function' ? callback : false;

  // For each query string parameter sent, add it to the path
  var requestUrl = path+'?';
  var counter = 0;
  for(var queryKey in queryStringObject)
  {
    if(queryStringObject.hasOwnProperty(queryKey))
    {
      counter++;

      // If at least one query string parameter has already been added, preprend new ones with an ampersand
      if(counter > 1)
      {
        requestUrl+='&';
      }

      // Add the key and value
      requestUrl+=queryKey+'='+queryStringObject[queryKey];
    }
  }

  // Form the http request as a JSON type
  var xhr = new XMLHttpRequest();
  xhr.open(method, requestUrl, true);
  xhr.setRequestHeader("Content-type", "application/json");

  // For each header sent, add it to the request
  for(var headerKey in headers)
  {
     if(headers.hasOwnProperty(headerKey))
     {
       xhr.setRequestHeader(headerKey, headers[headerKey]);
     }
  }

  // If there is a current session token set, add that as a header
  // if(app.config.sessionToken)
  // {
  //   xhr.setRequestHeader("token", app.config.sessionToken.id);
  // }

  // When the request comes back, handle the response
  xhr.onreadystatechange = function()
  {
      if(xhr.readyState == XMLHttpRequest.DONE) 
      {
        var statusCode = xhr.status;
        var responseReturned = xhr.responseText;

        // Callback if requested
        if(callback)
        {
          try
          {
            var parsedResponse = JSON.parse(responseReturned);
            callback(statusCode,parsedResponse);
          } 
          catch(e)
          {
            callback(statusCode,false);
          }

        }
      }
  }

  // Send the payload as JSON
  var payloadString = JSON.stringify(payload);
  xhr.send(payloadString);

}; // End of: app.client.request = function(headers,path,method,queryStringObject,payload,callback){...}
// End of: Interface for making API calls




// Add a listener to the submit event of all forms in the DOM and bind the anonymous 
// function declared below to the listener using addEventListener.
// bindForms is called from app.init when the webpage is loaded but the anonymous 
// function declared using addEventListener only runs when the form is submitted.
// The function takes the submit event object (e) as the argument.
app.bindForms = function()
{
  // If the DOM contains the CSS selector "form"
  if(document.querySelector("form"))
  {

    // Create an interface to manipulate all the forms in the DOM.
    var allForms = document.querySelectorAll("form");

    // Add a listener to the submit event of every form in the DOM and bind the anonymous function declared here.
    for(var i = 0; i < allForms.length; i++)
    {
      // The following is what runs when the user submits the form.
      allForms[i].addEventListener("submit", function(e)
      {
        // Stop it from submitting
        e.preventDefault();

        // The key word "this" below refers to the html (more accurately the DOM) of the form being submitted.
        // The formId from the html (DOM) is used when loading the form with data.
        var formId = this.id;
        //path and method will determine which api handler will get called.
        var path = this.action;
        var method = this.method.toUpperCase();

        // Hide the error message (if it's currently shown due to a previous error)
        document.querySelector("#"+formId+" .formError").style.display = 'none';

        // Hide the success message (if it's currently shown)
        if(document.querySelector("#"+formId+" .formSuccess"))
        {
          document.querySelector("#"+formId+" .formSuccess").style.display = 'none';
        }


        // Create an empty payload object.
        var payload = {};

        // this.elements is an object containing the inputs and buttons defined in the html of the form being submitted.
        var elements = this.elements;

        // Load the payload object with the names and values of the elements in the form being submitted. 
        for(var i = 0; i < elements.length; i++)
        {
          if(elements[i].type !== 'submit')
          {
            // Determine class of element and set value accordingly.
            var classOfElement = typeof(elements[i].classList.value) == 'string' && elements[i].classList.value.length > 0 ? elements[i].classList.value : '';
            var valueOfElement = elements[i].type == 'checkbox' && classOfElement.indexOf('multiselect') == -1 ? elements[i].checked : classOfElement.indexOf('intval') == -1 ? elements[i].value : parseInt(elements[i].value);
            var elementIsChecked = elements[i].checked;

            // Override the method of the form if the input's name is _method
            var nameOfElement = elements[i].name;

            if(nameOfElement == '_method')
            {
              method = valueOfElement;
            } 
            else // nameOfElement was something other than '_method'
            {
              // Create a payload field named "method" if the elements name is actually httpmethod
              if(nameOfElement == 'httpmethod')
              {
                nameOfElement = 'method';
              }

              // Create an payload field named "id" if the elements name is actually uid
              if(nameOfElement == 'uid')
              {
                nameOfElement = 'id';
              }

              // If the element has the class "multiselect" add its value(s) as array elements
              if(classOfElement.indexOf('multiselect') > -1)
              {
                if(elementIsChecked)
                {
                  payload[nameOfElement] = typeof(payload[nameOfElement]) == 'object' && payload[nameOfElement] instanceof Array ? payload[nameOfElement] : [];
                  payload[nameOfElement].push(valueOfElement);
                }
              } 
              else // element was not of the class multiselect
              {
                payload[nameOfElement] = valueOfElement;
              }
            } // End of: nameOfElement was something other than '_method'
          } // End of: if(elements[i].type !== 'submit'){...}
        } // End of: for(var 1...
        // End of: Load the payload object with the names and values of the elements in the form.


        // Create and empty queryString Object. Never used but needs to be there.
        var queryStringObject = {};          


        // Call the API
        app.client.request(undefined,path,method,queryStringObject,payload,function(statusCode,responsePayload)
        {
          // Display an error on the form if needed
          if(statusCode !== 200)
          {

            if(statusCode == 403)
            {
               // log the user out
               // app.logUserOut();
            } 
            else // Status code was not 200 nor was it 403
            {
              // Try to get the error from the api, or set a default error message
              var error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';

              // Set the formError field with the error text
              document.querySelector("#"+formId+" .formError").innerHTML = error;

              // Show (unhide) the form error field on the form
              document.querySelector("#"+formId+" .formError").style.display = 'block';
            }
          } 
          else // The submit was successful and we got a response back from the server.
          {
            // Send to form response processor
            app.formResponseProcessor(formId,payload,responsePayload);
          }

        }); // End of: app.client.request(undefined,path,method,queryStringObject,payload,function(statusCode,responsePayload){...}
      }); // End of: allForms[i].addEventListener("submit", function(e){...} What runs when users submits the form.
    } // End of: for(var i = 0; i < allForms.length; i++){...}
  } // End of: if(document.querySelector("form")){...}
}; // End of: app.bindForms = function(){...}
// End of: Bind the anonymous function defined above to the submit event of any forms in the DOM.




// Form submit post processor
// This is the last function called from the anonymous function defined in app.bindForms which 
// executes on a form's submit event.
// So this function defines what happens after a form has been sucessfully submitted.
app.formResponseProcessor = function(formId,requestPayload,responsePayload)
{
  // Navigate to the list page for this table.
  window.location = formId.slice(0, -3) + '/list';  

}; // End of: app.formResponseProcessor = function(formId,requestPayload,responsePayload){...}
// End of: Form submit post processor - processing after a sucessful form submit.




// Behavior from meta.js at i0hrsc6x02jooocdy71o
// Bind controls to behaviors when the page loads.
app.loadoContactAddPage = function()
{
  // Define the function that fires when the moveObjectUpButton is selected.
  function onClickBehaviorForMoveObjectUpButton (event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // Enable the moveObjectUpButton on the object coming down.
    let moveObjectUpButtonOnTheObjectComingDown = event.target.parentNode.previousElementSibling.querySelectorAll(".moveObjectUpButton")[event.target.parentNode.previousElementSibling.querySelectorAll(".moveObjectUpButton").length - 1];
    moveObjectUpButtonOnTheObjectComingDown.classList.remove('disabled');
    moveObjectUpButtonOnTheObjectComingDown.removeAttribute("disabled");

    // Find out if we are at the bottom
    if(!event.target.parentNode.nextElementSibling.classList.contains("elementWrapper"))
    {
      // The object coming down will not be able to go down anymore.
      // So no need for the moveObjectDownButton. Disable it.
      let moveObjectDownButtonOnTheObjectComingDown = event.target.parentNode.previousElementSibling.querySelectorAll(".moveObjectDownButton")[event.target.parentNode.previousElementSibling.querySelectorAll(".moveObjectDownButton").length - 1];
      moveObjectDownButtonOnTheObjectComingDown.classList.add("disabled");
      moveObjectDownButtonOnTheObjectComingDown.setAttribute("disabled", "");
    }  

    // Enable the moveObjectDownButton next to the target button.
    // Since we are moving this elementWrapper up we need to be sure the moveObjectDownButton is enabled.
    // Need this in case it was sitting on the bottom where the down button is disabled.
    let moveObjectDownButtonNextToTargetButton = event.target.nextElementSibling
    moveObjectDownButtonNextToTargetButton.classList.remove('disabled');
    moveObjectDownButtonNextToTargetButton.removeAttribute("disabled");
    
    // Move the object up
    if(event.target.parentNode.previousElementSibling)
    {
      event.target.parentNode.parentNode.insertBefore(event.target.parentNode, event.target.parentNode.previousElementSibling);
    }
     
    // Find out if we are at the top
    if(event.target.parentNode === event.target.parentNode.parentNode.firstElementChild)
    {
      // Can't move up anymore than this.
      // Disable the target moveObjectUpButton
      event.target.classList.add("disabled");
      event.target.setAttribute("disabled", "");
    }   

    renumberNamedElementsInGroupWrapper(event.target.parentNode.parentNode);    
    
  } // End of: function onClickBehaviorForMoveObjectUpButton (event)
  // End of: Define the function that fires when the moveObjectUpButton is pressed.


  // Bind the function above to the onClick event of the moveObjectUpButton.
  document.querySelectorAll('.moveObjectUpButton').forEach(function(currentButton)
  {
    currentButton.addEventListener("click", onClickBehaviorForMoveObjectUpButton);
  });


  // Define the function that fires when the moveObjectDownButton is selected.
  function onClickBehaviorForMoveObjectDownButton (event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // Enable the moveObjectDownButton on the object coming up.
    let moveObjectDownButtonOnTheObjectComingUp = event.target.parentNode.nextElementSibling.querySelectorAll(".moveObjectDownButton")[event.target.parentNode.nextElementSibling.querySelectorAll(".moveObjectDownButton").length - 1];    
    moveObjectDownButtonOnTheObjectComingUp.classList.remove('disabled');
    moveObjectDownButtonOnTheObjectComingUp.removeAttribute("disabled");

    // Find out if we are on the top
    if(!event.target.parentNode.previousElementSibling)
    {
      // The object coming up will not be able to go up anymore.
      // So no need for the moveObjectUpButton. Disable it. 
      let moveObjectUpButtonOnTheObjectComingUp = event.target.parentNode.nextElementSibling.querySelectorAll(".moveObjectUpButton")[event.target.parentNode.nextElementSibling.querySelectorAll(".moveObjectUpButton").length - 1];
      moveObjectUpButtonOnTheObjectComingUp.classList.add("disabled");
      moveObjectUpButtonOnTheObjectComingUp.setAttribute("disabled", "");
    } 

    // Since we are moving this elementWrapper down we need to be sure the moveObjectUpButton is enabled. 
    // Need this in case it was sitting at the top where the up button is disabled.
    // Enable the moveObjectUpButton next to the target down button
    let moveObjectUpButtonNextToTargetButton = event.target.previousElementSibling    
    moveObjectUpButtonNextToTargetButton.classList.remove('disabled');
    moveObjectUpButtonNextToTargetButton.removeAttribute("disabled");

    // Move this elementWrapper down
    if(event.target.parentNode.nextElementSibling)
    {
      event.target.parentNode.parentNode.insertBefore(event.target.parentNode.nextElementSibling, event.target.parentNode);
    }
  
    // Find out if we are at the bottom
    if(!event.target.parentNode.nextElementSibling.classList.contains("elementWrapper"))     
    {
      // Can't move down anymore than this.
      // Disable the target moveObjectDownButton.
      event.target.classList.add("disabled");
      event.target.setAttribute("disabled", "");
    }   

    renumberNamedElementsInGroupWrapper(event.target.parentNode.parentNode);

  } // End of: function onClickBehaviorForMoveObjectDownButton (event)
  // End of: Define the function that fires when the moveObjectDownButton is pressed.


  // Bind the function above to the onClick event of the moveObjectDownButton.
  document.querySelectorAll('.moveObjectDownButton').forEach(function(currentButton)
  {
    currentButton.addEventListener("click", onClickBehaviorForMoveObjectDownButton);
  });
  // End of: Bind the function above to the onClick event of the moveObjectDownButton.  


  // Define the function that fires when the removeObjectButton is selected.
  function onClickBehaviorForRemoveObjectButton (event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // If we are on the top
    // if(event.target.parentNode === event.target.parentNode.parentNode.querySelector(".elementWrapper:first-child"))
    if(!event.target.parentNode.previousElementSibling)    
    {
      // The object coming up will not be able to go up anymore.
      // So no need for the moveObjectUpButton. Disable it. 
      let moveObjectUpButtonOnTheObjectComingUp = event.target.parentNode.nextElementSibling.querySelectorAll(".moveObjectUpButton")[event.target.parentNode.nextElementSibling.querySelectorAll(".moveObjectUpButton").length - 1];      
      moveObjectUpButtonOnTheObjectComingUp.classList.add("disabled");
      moveObjectUpButtonOnTheObjectComingUp.setAttribute("disabled", "");

      // If there are only two left
      if(event.target.parentNode.parentNode.childElementCount === 3)      
      {
        // We must never delete the last one
        // So disable the removeObjectButton on the last survivor    
        let removeObjectButtonOnTheObjectComingUp = event.target.parentNode.nextElementSibling.querySelectorAll(".removeObjectButton")[event.target.parentNode.nextElementSibling.querySelectorAll(".removeObjectButton").length - 1];           
        removeObjectButtonOnTheObjectComingUp.classList.add("disabled");
        removeObjectButtonOnTheObjectComingUp.setAttribute("disabled", "");
      }
    } // End of: If there are only two left
    // End of: If we are on the top

    // If we are on the bottom
    if(!event.target.parentNode.nextElementSibling.classList.contains("elementWrapper"))    
    {
      // The object coming down will not be able to go down anymore.
      // So no need for the moveObjectDownButton. Disable it. 
      let moveObjectDownButtonOnTheObjectComingDown = event.target.parentNode.previousElementSibling.querySelectorAll(".moveObjectDownButton")[event.target.parentNode.previousElementSibling.querySelectorAll(".moveObjectDownButton").length - 1];     
      moveObjectDownButtonOnTheObjectComingDown.classList.add("disabled");
      moveObjectDownButtonOnTheObjectComingDown.setAttribute("disabled", "");

      // If there are only two left
      if(event.target.parentNode.parentNode.childElementCount === 3)
      {
        // We must never delete the last one
        // So disable the removeObjectButton on the last survivor
        let removeObjectButtonOnTheObjectComingDown = event.target.parentNode.previousElementSibling.querySelectorAll(".removeObjectButton")[event.target.parentNode.previousElementSibling.querySelectorAll(".removeObjectButton").length - 1];        
        removeObjectButtonOnTheObjectComingDown.classList.add("disabled");
        removeObjectButtonOnTheObjectComingDown.setAttribute("disabled", "");
      } // End of: If there are only two left 
    } // End of: If we are on the bottom

    let groupWrapper = event.target.parentNode.parentNode;

    // Remove the button's parent node.
    event.target.parentNode.remove()

    renumberNamedElementsInGroupWrapper(groupWrapper);    

  } // End of: function onClickBehaviorForRemoveObjectButton (event){...}
  // End of: Define the function that fires when the removeObjectButton is selected.


  // Bind the function above to the onClick event of the removeObjectButtons.
  document.querySelectorAll('.removeObjectButton').forEach(function(currentButton)
  {
    currentButton.addEventListener("click", onClickBehaviorForRemoveObjectButton);
  });
  // End of: Bind the function above to the onClick event of the removeObjectButtons.


  // Define the function that fires when the addNewObjectButton is selected.
  function onClickBehaviorForAddNewObjectButton (event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // Initialize a pointer to the elementWrapper we will clone.
    // We are cloning the last elementWrapper the groupWrapper.
    let lastElementWrapper;

    event.target.parentNode.querySelectorAll(".elementWrapper").forEach(function(elementWrapper)
    {
      if(elementWrapper.parentNode === event.target.parentNode)
      {
        lastElementWrapper = elementWrapper;
      }
    });

    // Here we deep clone the last elementWrapper.
    let cln = lastElementWrapper.cloneNode(true);

    // Remove all the but the first of any elementWappers from the clone groupWrapper
    cln.querySelectorAll(".elementWrapper:not(:first-child)").forEach(function(elementWrapper)
    {
      elementWrapper.remove()
    });

    // Set all the clone's element values to ""
    cln.querySelectorAll(".resetElement").forEach(function(element){element.value = "";});

    // Create an event listener for the onclick event of the clone's removeObjectButtons.
    cln.querySelectorAll(".removeObjectButton").forEach(function(removeObjectButton)
    {
      removeObjectButton.addEventListener("click", onClickBehaviorForRemoveObjectButton);
    });
    
    // Create an event listener for the onclick event of the clone's moveObjectUpButtons.
    cln.querySelectorAll(".moveObjectUpButton").forEach(function(moveObjectUpButton)
    {
      moveObjectUpButton.addEventListener("click", onClickBehaviorForMoveObjectUpButton);
    });    
    
    // Create an event listener for the onclick event of the clone's moveObjectDownButton.
    cln.querySelectorAll(".moveObjectDownButton").forEach(function(moveObjectDownButton)
    {
      moveObjectDownButton.addEventListener("click", onClickBehaviorForMoveObjectDownButton);
    });

    // Create an event listener for the onclick event of the clone's addNewObjectButtons.
    cln.querySelectorAll('.addNewObjectButton').forEach(function(addNewObjectButton)
    {
      addNewObjectButton.addEventListener("click", onClickBehaviorForAddNewObjectButton);
    });

    // Enable the clone's moveObjectUpButtons
    cln.querySelectorAll(".moveObjectUpButton").forEach(function(moveObjectUpButton)
    {
      if(moveObjectUpButton.parentNode === cln)
      {
        moveObjectUpButton.classList.remove('disabled');
        moveObjectUpButton.removeAttribute("disabled");
      }
    });

    // Disable the clone's moveObjectDownButton
    cln.querySelectorAll(".moveObjectDownButton").forEach(function(moveObjectDownButton)
    {
      // if(moveObjectDownButton.parentNode === cln)
      // {
        moveObjectDownButton.classList.add("disabled");
        moveObjectDownButton.setAttribute("disabled", "");
      // }
    }); 

    // Disable all removeObjectButtons on the clone.
    // This is to disable buttons on any children.
    // In the next step after this, the removeObjectButton is enabled at the top level.
    cln.querySelectorAll(".removeObjectButton").forEach(function(removeObjectButton)
    {
      removeObjectButton.classList.add("disabled");
      removeObjectButton.setAttribute("disabled", "");
    }); 


    // Enable the clone's top level removeObjectButton
    cln.querySelectorAll(".removeObjectButton").forEach(function(removeObjectButton)
    {
      if(removeObjectButton.parentNode === cln)
      {
        removeObjectButton.classList.remove('disabled');
        removeObjectButton.removeAttribute("disabled");
      }
    }); 

    // Disable the very top moveObjectUpButton
    event.target.parentNode.querySelectorAll(".moveObjectUpButton").forEach(function(moveObjectUpButton)
    {
      if(moveObjectUpButton.parentNode === event.target.parentNode)
      {
        moveObjectUpButton.classList.add("disabled");
        moveObjectUpButton.setAttribute("disabled", "");
      }
    }); 

    // Enable all but clone's moveObjectDownButton
    event.target.parentNode.querySelectorAll(".moveObjectDownButton").forEach(function(moveObjectDownButton)
    {
      if(moveObjectDownButton.parentNode.parentNode === event.target.parentNode)
      {
        moveObjectDownButton.classList.remove('disabled');
        moveObjectDownButton.removeAttribute("disabled");
      }  
    });

    // Enable all but clone's removeObjectButton
    event.target.parentNode.querySelectorAll(".removeObjectButton").forEach(function(removeObjectButton)
    {
      if(removeObjectButton.parentNode.parentNode === event.target.parentNode)
      {
        removeObjectButton.classList.remove('disabled');
        removeObjectButton.removeAttribute("disabled");  
      }   
    });

    // Append the clone to the object group in the DOM
    let targetGroupWrapper = event.target.parentNode;
    targetGroupWrapper.insertBefore(cln, targetGroupWrapper.childNodes[targetGroupWrapper.childNodes.length -2]);

    renumberNamedElementsInGroupWrapper(event.target.parentNode);

  } // End of: function onClickBehaviorForAddNewObjectButton (event)
  // End of: Define the function that fires when the addNewObjectButton is pressed.


  // Bind the function above to the onClick event of the addNewObjectButtons.
  document.querySelectorAll('.addNewObjectButton').forEach(function(currentButton)
  {
    currentButton.addEventListener("click", onClickBehaviorForAddNewObjectButton);
  });  
  // End of: Bind the function above to the onClick event of the addNewObjectButtons.

}; // End of: app.loadoContactAddPage = function(){...}




// Define a function which renumbers field names in children objects as we create, move, or delete their element wrappers
function renumberNamedElementsInGroupWrapper(groupWrapper)
{
  // Used to determine if we are changing levels of hierarchy in the DOM
  // We haven't looked at an elementWrapper yet so it's undefined.
  let previousElementWrapper = undefined;

  // The length of ancestorWrappers array indicates which number in the name string gets replaced with the numeric value in the array.
  // Example fieldName: field_field0_defaultElement_defaultElement0_elementName  
  // For example: the zero in field0 gets replaced or the zero in defaultElement0 gets replaced.
  // If ancestorWrappers.length = 1 we put the numeric value in the array in the place of the zero in field0
  // A length of two in ancestorWrappers indicates we put the numeric value in the array in the place of the zero in defaultElement0
  let ancestorWrappers = [["previousElementWrappers_PushedHere", 0]];

  // Start at the heighest groupWrapper in the hierarchy defined by the groupWrapper that was passed into the function.
  groupWrapper = groupWrapper.closest("form > .groupWrapper");

  // Loop through the elementWrappers.
  groupWrapper.querySelectorAll('.elementWrapper').forEach(function(elementWrapper, wrapperIndex)
  {
    let incremented = false;

    // Loop through the form elements inside each elementWrapper.
    elementWrapper.querySelectorAll('.resetElement').forEach(function(fieldElement)
    {
      //    prevents error           if current wrapper is inside the previous
      if(previousElementWrapper && previousElementWrapper.contains(elementWrapper))
      {
        // We just jumped down a level in the DOM
        // The length of this array tells us how many wrappers suround this element - How deep
        // Or which number in the element name is to be replaced with the numeric value in the array.
        // The numeric value in the array tells us the replacement value.
        ancestorWrappers.push([previousElementWrapper, 0]);
      }
      else // current wrapper is not inside the previous
      {
        // find out what level we are on
        while (true)
        {
          // If we are at the top level...
          if(ancestorWrappers.length === 1 && !previousElementWrapper)
          {
            break; // Don't do anything.
          }
          // Else If the current wrapper is inside the last ancestorWrapper
          else if(ancestorWrappers.length > 1 && ancestorWrappers[ancestorWrappers.length - 1][0].contains(elementWrapper))
          {
            // We are working with a new elementWrapper at the same level.
            // So increment the numeric value held in the last element of the ancestorWrappers array.
            ancestorWrappers[ancestorWrappers.length - 1][1] = ancestorWrappers[ancestorWrappers.length - 1][1] + 1;
            incremented = true;
            break;
          }
          else // the current wrapper is not inside the last ancestorWrapper
          {
            if(ancestorWrappers.length > 1)
            {
              // Remove the last element and check if the next wrapper up contains the current wrapper.
              ancestorWrappers.pop();

              // We are working with a new elementWrapper at the same level.
              // So increment the numeric value held in the last element of the ancestorWrappers array.
              ancestorWrappers[ancestorWrappers.length - 1][1] = ancestorWrappers[ancestorWrappers.length - 1][1] + 1; 
              incremented = true;   
              
              // Now run through this while loop again to see if the last element contain the current wrapper.
            }
            else // we are back at the top level.
            {
              // We are working with a new elementWrapper at the top level.
              // So increment the numeric value held in the only element of the ancestorWrappers array.
              if(!incremented)
              {
                ancestorWrappers[ancestorWrappers.length - 1][1] = ancestorWrappers[ancestorWrappers.length - 1][1] + 1;
                incremented = true;
              }
              break;   
            } // End of: Else - we are at the top level
          } // End of: Else - the current wrapper is not inside the last ancestorWrapper
        } // End of: while (true)
      } // End of: Else - the current wrapper is not inside the previous

      // Get the form element's name.
      let previousNameAttribute = fieldElement.getAttribute("name");
      
      // Search for the nth occurance of a number according to ancestorWrappers.length
      //  A length of one indicates that we search for the first number in the name string.
      //  A length of two indicates that we search for the second number in the name string.

      // Starting out with an empty string in the reduce function below.
      let initialValue = "";

      // Counts how many times we encounter a number as we run the reduce function below.
      let encountersWithNumbers = 0;

      // Spliting the name string of the current element on the underscore.
      // This makes it easy to find and replace numbers in the string.
      const nameAttributeArray = previousNameAttribute.split("_")

      // Running the reduce function on every element in the nameAttributeArray
      let nextNameAttribute = nameAttributeArray.reduce
      (
        // This is the callback function that reduce runs on every element in the nameAttributeArray
        function (accumulator, currentSplitElement, currentSplitElementIndex) 
        {
          // Check for a number in the currentSplitElement.
          if(hasANumber(currentSplitElement))
          {
            // Note that we countered a number in the currentSplitElement.
            encountersWithNumbers = encountersWithNumbers + 1

            // If this is the place in the form element's name that we need to insert a number showing position in the DOM...
            if(encountersWithNumbers === ancestorWrappers.length)
            {
              // Insert numbers in the form element's name string to show it's position within the DOM
              // This information is needed in order to write a well formed object to the JSON database.
              //                                                       search for numbers      replace with numbers denoting postion
              accumulator = accumulator +  currentSplitElement.replace(/[0-9]+(?!.*[0-9])/, ancestorWrappers[ancestorWrappers.length - 1][1]);

              // Put a dash at the end of the element if it is not the last one.
              if(currentSplitElementIndex < nameAttributeArray.length -1){accumulator = accumulator + "_"};

              return accumulator
            }
            else // There is a number here but we don't want to change it now.
            {
              accumulator = accumulator +  currentSplitElement;

              // Put a dash at the end of the element if it is not the last one.
              if(currentSplitElementIndex < nameAttributeArray.length -1){accumulator = accumulator + "_"};

              return accumulator 
            }

          } // End of: if(helpers.hasANumber(currentSplitElement)){...}
          else // There is no number in the currentSplitElement
          {
            accumulator = accumulator +  currentSplitElement;

            // Put a dash at the end of the element if it is not the last one.
            if(currentSplitElementIndex < nameAttributeArray.length -1){accumulator = accumulator + "_"};

            return accumulator            
          }
        } // End of: function (accumulator, currentSplitElement){...}
        , initialValue // This was an empty string passed in to the reduce function to get things started.
      ); // End of: let nextNameAttribute = nameAttributeArray.reduce(function(){do stuff})
        
      // Set the name of the formElement as calculated above.
      fieldElement.setAttribute("name", nextNameAttribute)

    }); // End of: elementWrapper.querySelectorAll('.resetElement').forEach(function(fieldElement){...}

    previousElementWrapper = elementWrapper;

  }); // End of: groupWrapper.querySelectorAll('.elementWrapper').forEach(function(elementWrapper, wrapperIndex)
} // End of: function renumberNamedElementsInGroupWrapper(groupWrapper){...}
// End of: Define a function which renumbers field names in children objects as we create, move, or delete their element wrappers




// Define a function to check if a string has a number.
function hasANumber(checkString) 
{ 
  let str = String(checkString); 
  
  // Loop through each character of the string.
  for( let i = 0; i < str.length; i++) 
  {
    // If a number is found...
    if(!isNaN(str.charAt(i))) 
    { 
      return true;  
    } 
  } 
  return false; 
}; // End of: Define a function to check if a string has a number.




// Init (bootstrapping)
app.init = function()
{
  // Bind all form submissions
  app.bindForms();

  // Load data on page
  app.loadoContactAddPage();  
};
// End of: Init (bootstrapping)




// Call the init processes after the window loads.
// This is where it all starts.
window.onload = function(){
  app.init();
};

</script>

`        

        // Write out the HTML page to a file.

        let fileExtension = ".html";

        // Call the function which appends a string to a file 
        // then process anonymous callback function defined here.
        meta.append
        (
          recordObject.directory, 
          recordObject.tableName + "Add",
          fileExtension,
          htmlString, 
          function(err)
          {
            if (!err) // The html string was written successfully to a file.
            {
              helpers.log
              (
              5,
              'rf3z3xrz7bquiy9dqeci' + '\n' +
              'The web page ' + recordObject.tableName + "Add" + '.html was written successfully to a file.' + '\n'                                  
              ); // End of: helpers.log(...)
            }
            else // There was an error writing the HTML string to a file.
            {
              helpers.log
              (
              7,
              'b2sbc2t9l2lo06tkwxkj' + '\n' +
              'There was an error writing the html string to a file' + '\n'
              ); // End of: helpers.log(...)
            } // End of: else there was an error writing the HTML string to a file.
          } // End of: callback function(err){...}
        ); // End of: _data.append(...)


      }; // End of: writable.write = function(payload){...}

      // Passes the payload stream to the writable object which calls writable.write 
      // which does something useful with the payload.
      pipeline
      (
        payload,
        writable,
        function(pipelineError)
        {
          if(pipelineError)
          {
            helpers.log // Log the error.
            (
              7,
              'lfywxqkxg2am7df6ozhl' + '\n' + 
              'Pipeline error. The message was as follows' + '\n' +                                             
              pipelineError + '\n'                                                 
            ); // End of: helpers.log // Log the error.
          } // End of: if(pipelineError){...}
        } // End of: function(piplineError){...}
      ); // End of: Pipeline

    } // End of: if(!error) Got the most recent record from getMostRecent
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

}// End of: meta.build.addWebPage = function(metadataId){...}




// Define a function which builds a webpage for 
// listing records from a json table in the database.
meta.build.listWebPage = function(metadataId)
{
  // This object tells the getMostRecent function which record to retrive in the data dictionary (metadata.json)
  let dataObject = {};

  // We are not trying to write to the table so no need to enforce uniqueness.
  // Since this field is never empty in metadata.json, an empty string will pass the uniqueness test in getMostRecent().
  dataObject.uniqueField01Value = "";

  dataObject.uniqueField01Name = "tableName";           
  dataObject.path = '/database/dbMetadata/metadata.json';
  dataObject.queryString = 'WHERE:;metadataId:;MatchesExactly:;' + metadataId + ':;';  

  let recordObject;
  let htmlString = "";

  // Collect information about the webpage from the metadata.
  // 1. Look in metadata.json - Read the object for the given metadataId.
  helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)
  {
    if(!errorFromGetMostRecent) // Got the most recent record from getMostRecent
    {
      // Used to decode the payload buffer into readable text.
      let decoder = new StringDecoder('utf8');    

      // This instance of the Writable object gives us a place for a callback to run when the payload is received.
      const writable = new Writable();

      // Called by pipeline below. 
      // Here is where we process the single line of json returned in the payload and make the webpage.
      writable.write = function(payload)     
      {
        let stringContainer = '';                 
        stringContainer = stringContainer + decoder.write(payload);
        recordObject = JSON.parse(stringContainer);
 
        // All the metadata for the table is in record object.
        // Assemble the webpage string from the metadata in recordObject.

        let tableNameInUpperCase = recordObject.tableName.toUpperCase();   


        htmlString = htmlString +        
        "<!-- This entire file was generated by meta.js at rbo5n3dazk3fszm32ro8 -->" + "\n" +
        "<!-- Any changes to this file will be overwritten when the application is regenerated -->" + "\n" +
        "<!-- Make your changes in the generator meta.js or in the data dictionary metadata.json -->" + "\n";

        
        // If we have specified text for the listPage heading.
        if(recordObject.webPages.listPage.heading)
        {
          htmlString = htmlString +     
          "<h1>" + recordObject.webPages.listPage.heading + "</h1>" + "\n" + "</br>" + "\n";
        }
        else
        {
          htmlString = htmlString +               
          "<h1>SELECT, FILTER, AND SORT, " + tableNameInUpperCase + " RECORDS</h1>" + "\n";
        }


        // If we have specifed text for the form heading.
        if(recordObject.webPages.listPage.forms.listForm.heading)
        {
          htmlString = htmlString +           
          "<h2>" + recordObject.webPages.listPage.forms.listForm.heading + "</h2>" + "\n";
        }
        else // No text was specified in the data dictionary (metadata.json). So use a generic heading for the form.
        {
          htmlString = htmlString +           
          "<h2>" + "\n" +
          "  ALL RECORDS ARE RETURNED IN ORDER OF CREATION IF NO SELECTIONS ARE MADE.</br>" + "\n" + 
          "  PRESS THE SUBMIT BUTTON TO SEE THE RESULTS." + "\n" +
          "</h2>" + "\n";          
        }

        htmlString = htmlString +
        "  <!--Behavior from meta.js at q8911vzpl8wtr8heltqw-->" + "\n" +        
        "<div class=\"formWrapper\"></div>" + "\n" +
        "<div class=\"buttonWrapper\">" + "\n" +
        "  <div class=\"inputWrapper ctaWrapper smallTopMargin\">" + "\n" +
        "    <!--The following button calls code that generates a query string based on user input-->" + "\n" +
        "    <a class=\"cta green\" id=\"generateQueryButton\">Generate Query</a>" + "\n" +
        "    <!--The following button calls code that sends the query string to the server and then processes the results. -->" + "\n" +
        "    <a class=\"cta green\" id=\"submitQueryButton\">Submit Query</a>" + "\n" +
        "  </div>" + "\n" +
        "\n" +
        "  <div class=\"inputWrapper ctaWrapper smallTopMargin\">" + "\n" +
        "    <!--The following button clears all the query controls on the webpage-->" + "\n" +
        "    <a class=\"cta green\" id=\"clearQueryButton\">Clear Query</a>" + "\n" +
        "    <!--The following button removes all the results on the webpage that were returned from the previous query-->" + "\n" +
        "    <a class=\"cta green\" id=\"clearResultsButton\">Clear Results</a>" + "\n" +
        "  </div>" + "\n" +
        "  <div class=\"inputWrapper ctaWrapper smallTopMargin\">" + "\n" +
        "    <!--The following button brings the user to a new webpage where a new record may be added to the table-->" + "\n" +
        "    <a class=\"cta green\" href=\"" + recordObject.tableName + "/add\">Create New</a>" + "\n" +
        "  </div>" + "\n" +
        "</div>" + 
        "\n" + "\n" +
        "<hr />" + 
        "\n" + "\n" +
        "<!--A table filled with results is geneated below by javascript code when the submitQueryButton is pressed.-->" + "\n" +
        "\n" +
        "<script type=\"text/formTemplate\">" + "\n" +
        "  <input type=\"hidden\" name=\"_method\" value=\"GET\"/>" + "\n" +
        "  <div class=\"formError\">There was an error on this form</div>" + "\n" +
        "  <div class=\"formSuccess\">This is what your filter looks like</div>" + "\n" +
        "\n" +
        "  <!--Below is used to select which fields are displayed when the query is returned.-->" + "\n" +
        "  <div class=\"selectClauseWrapper\">Select which fields to display. All fields are displayed if nothing is selected." + "\n" +
        "    <div class=\"inputWrapper fieldToDisplayInputWrapper\">" + "\n" +
        "      <div class=\"inputLabel smallTopMargin\"></div>" + "\n" +
        "      <select class=\"fieldToDisplay\"> " + "\n" +
        "        <option value=\"\" style=\"display: list-item;\"></option>" + "\n" +
        "        <option value=\"" + recordObject.tableName + "Id\" style=\"display: list-item;\">" + recordObject.tableName + "Id</option>" + "\n";

        // Create the HTML text for the option elements which represent fields that are published.
        let fieldsObject = recordObject.fields;

        // Loop through the fieldsObject.
        for (let fieldKey in fieldsObject) 
        {
          // If the field is published.
          if(fieldsObject[fieldKey].published === true)
          {    
            // If this field is an object containing sub elements...
            if(fieldsObject[fieldKey].subObject)
            {
              // Declare a function that we will use to drill into this object
              // We will generate HTML from the fields we find at the end of the branches.
              function drillIntoObject(obj, objKey, startingPath)
              {
                // Get a reference to the recordObject called "obj"
                let objValue = obj;                 

                // Here is where we do the drilling.
                for (let keyPart in objValue[objKey].subObject) 
                {
                  let propertyPath = startingPath + objKey + ".subObject." + keyPart;

                  // if the subfield is also an object then this function calls itself using the subfield parameters.
                  // This will continue drilling in until we are at the end of the branches and
                  if(objValue[objKey].subObject[keyPart].subObject)
                  { 
                    drillIntoObject(objValue[objKey].subObject, keyPart, objKey + ".");
                  }
                  else // We are at the end of a branch. This is a field not an object so create HTML for this field.
                  {
                    if(objValue[objKey].subObject[keyPart].published === true)
                    {
                      // Grab the key of each defaultElement property. 
                      // Use it to make HTML that will populate the select element on the webpage.
                      htmlString = htmlString +
                      "        <option value=\"" + propertyPath + "\" style=\"display: list-item;\">" + propertyPath + "</option>" + "\n";
                    }
                  }
                } 
              };

              // Call the function declare above.
              drillIntoObject(fieldsObject, fieldKey, "")
            }
            else // The field is a string so build the HTML without any dot notation.
            {
              // Create an object of default elements for a field.
              let defaultElementsObject = fieldsObject[fieldKey].defaultElements;

              // Loop through defaultElementsObject.
              for (let elementKey in defaultElementsObject) 
              {
                // Grab each defaultElement make HTML to display it on the webpage.
                htmlString = htmlString +
                "        <option value=\"" + elementKey + "\" style=\"display: list-item;\">" + elementKey + "</option>" + "\n";
              }             
            }
          }
        }

        htmlString = htmlString +
        "        <option value=\"timeStamp\" style=\"display: list-item;\">timeStamp</option>" + "\n" +
        "      </select>" + "\n" +
        "    </div>" + "\n" +
        "  </div>" + "\n" +
        "\n" +
        "  <!-- The controls below define the where clause filter used to choose which records will be displayed.-->" + "\n" +
        "  <div class=\"whereClauseGroupWrapper\">" + "\n" +
        "  Create a filter expression. <br>" + "\n" +
        "  All filters joined by the conjunction AND will be evaluated first.<br>" + "\n" +
        "  All records are selected if filters are left blank." + "\n" +
        "\n" +
        "    <div class=\"whereClauseWrapper\">" + "\n" +
        "      <!--" + "\n" +
        "      The following select element is used to select a field in the table for the where clause." + "\n" +
        "      This should be populated with fields from the table the current webpage supports." + "\n" +
        "      So this will require a separate request just to get the field names." + "\n" +
        "      -->" + "\n" +
        "      <div class=\"inputWrapper\">" + "\n" +
        "        <div class=\"inputLabel smallTopMargin\">Select a field to be examined by the filter.</div>" + "\n" +
        "        <select class=\"fieldToCompare resetElement\">" + "\n" +
        "          <option value=\"\"></option>" + "\n" +
        "          <option value=\"" + recordObject.tableName + "Id\">" + recordObject.tableName + "Id</option>" + "\n";

        // Loop through the fieldsObject.
        for (let fieldKey in fieldsObject) 
        {
          // If the field is published.
          if(fieldsObject[fieldKey].published === true)
          {      
            // If the field is an object we will need to create dot notation in order to refer to the field.
            if(fieldsObject[fieldKey].subObject)
            {
              // Declare a function that we will run if we encounter an object in the data dictionary.
              function drillIntoObject(obj, objKey, startingPath)
              {
                // Drill down into the object so that we can create html for it's subfields.
  
                // Get a reference to the recordObject called "obj"
                let objValue = obj;                 

                // Here is where we do the drilling.
                for (let keyPart in objValue[objKey].subObject) 
                {
                  let propertyPath = startingPath + objKey + "." + keyPart;                                

                  // if the subfield is also an object then this function calls itself using the subfield parameters.
                  // This will continue drilling in until we are at the end of the branches and
                  if(objValue[objKey].subObject[keyPart].subObject)
                  { 
                    drillIntoObject(objValue[objKey].subObject, keyPart, objKey + ".");
                  }
                  else // We are at the end of a branch. This is a field not an object so create HTML for this field.
                  {
                    if(objValue[objKey].subObject[keyPart].published === true)
                    {
                      // Grab the key of each defaultElement property. 
                      // Use it to make HTML that will populate the select element on the webpage.
                      htmlString = htmlString +
                      "          <option value=\"" + propertyPath + "\">" + propertyPath + "</option>" + "\n";
                    }
                  }
                } 
              };

              drillIntoObject(fieldsObject, fieldKey, "")
            }
            else // The field is a string so build the HTML without any dot notation.
            {
              // Create an object of default elements for a field.
              let defaultElementsObject = fieldsObject[fieldKey].defaultElements;

              // Loop through defaultElementsObject.
              for (let elementKey in defaultElementsObject) 
              {
                // Grab each defaultElement make HTML to display it on the webpage.
                htmlString = htmlString +
                "          <option value=\"" + elementKey + "\">" + elementKey + "</option>" + "\n";

              }             
            }
          }
        }

        htmlString = htmlString +        
        "          <option value=\"timeStamp\">timeStamp</option> " + "\n" +
        "        </select>" + "\n" +
        "      </div>" + "\n";

htmlString = htmlString +        
`
      <!--The following is used to select a comparison operator to be used on the field in the where clause-->    
      <div class="inputWrapper">
        <div class="inputLabel smallTopMargin">Select a comparison operator to be used by the filter.</div>
        <select class="comparisonOperator resetElement"> 
          <option value=""></option>
          <optgroup label="Upper Case Letters Are Considered The Same As Lower Case Letters">
            <optgroup label="Positive Matches">             
              <option value="MatchesExactlyNotCaseSensitive">Matches Exactly - Not Case Sensitive</option>
              <option value="BeginsWithNotCaseSensitive">Begins With - Not Case Sensitive</option> 
              <option value="ContainsNotCaseSensitive">Contains - Not Case Sensitive</option> 
              <option value="EndsWithNotCaseSensitive">Ends With - Not Case Sensitive</option>  
            </optgroup>     
            <optgroup label="Negative Matches">
              <option value="DoesNotMatchExactlyNotCaseSensitive">Does Not Match - Not Case Sensitive</option>
              <option value="DoesNotBeginWithNotCaseSensitive">Does Not Begin With - Not Case Sensitive</option> 
              <option value="DoesNotContainNotCaseSensitive">Does Not Contain - Not Case Sensitive</option> 
              <option value="DoesNotEndWithNotCaseSensitive">Does Not End With - Not Case Sensitive</option>
            </optgroup>                               
          </optgroup>             
          <optgroup label="Upper Case Letters Are Considered Different Than Lower Case letters">
            <optgroup label="Positive Matches">
                <option value="MatchesExactly">Matches Exactly - Case Sensitive</option>
                <option value="BeginsWith">Begins With - Case Sensitive</option>  
                <option value="Contains">Contains - Case Sensitive</option>   
                <option value="EndsWith">Ends With - Case Sensitive</option>  
            </optgroup>     
            <optgroup label="Negative Matches">
                <option value="DoesNotMatchExactly">Does Not Match - Case Sensitive</option> 
                <option value="DoesNotBeginWith">Does Not Begin With - Case Sensitive</option>  
                <option value="DoesNotContain">Does Not Contain - Case Sensitive</option> 
                <option value="DoesNotEndWith">Does Not End With - Case Sensitive</option>    
            </optgroup>                                                                          
          </optgroup>                         
          <optgroup label="Numerical Comparisons"></optgroup>
            <option value="IsGreaterThan">Is Greater Than - Characters Ranked Numerically</option>
            <option value="IsGreaterThanOrEqualTo">Is Greater Than Or Equal To - Characters Ranked Numerically</option> 
            <option value="IsLessThan">Is Less Than - Characters Ranked Numerically</option>  
            <option value="IsLessThanOrEqualTo">Is Less Than Or Equal To - Characters Ranked Numerically</option>   
          </optgroup>  
          <optgroup label="Alphabetical Comparisons"></optgroup>
            <option value="IsGreaterThanNotCaseSensitive">Is Greater Than - Characters Ranked Alphabetically</option>
            <option value="IsGreaterThanOrEqualToNotCaseSensitive">Is Greater Than Or Equal To - Characters Ranked Alphabetically</option>
            <option value="IsLessThanNotCaseSensitive">Is Less Than - Characters Ranked Alphabetically</option>
            <option value="IsLessThanOrEqualToNotCaseSensitive">Is Less Than Or Equal To - Characters Ranked Alphabetically</option>              
          </optgroup> 
        </select>
      </div>     

      <!--The following is used to define the match term in the where clause-->      
      <div class="inputWrapper">
        <div class="inputLabel smallTopMargin">Type in a match term to be used by the filter.</div>
        <input class="matchTermInput resetElement" type="text" />
      </div>   

      <!--The following is used to select a conjunction operator that will be used to add and then join where clauses-->    
      <div class="inputWrapper">
        <div class="inputLabel smallTopMargin">Add another filter expression if desired or leave this blank if not.</div>
        <select class="conjunctionSelector resetElement" data-previous=""> 
          <option value=""></option>              
          <option value="ANDWHERE">AND</option>        
          <option value="ORWHERE">OR</option>                                                                         
        </select>
      </div>        
    </div>
  </div>  

`

        htmlString = htmlString + 
        "  <!--Below defines the order by clause used to choose the order in which records will be displayed.-->" + "\n" +
        "  <div class=\"orderByClauseGroupWrapper\">Sort the Results<br>No sort order is applied if left blank." + "\n" +
        "    <div class=\"orderByClauseWrapper\">" + "\n" +
        "      <!--The following is used to select the field to order by -->" + "\n" +
        "      <div class=\"inputWrapper\">" + "\n" +
        "        <div class=\"inputLabel smallTopMargin\">Select a field to use in the order by expression.</div>" + "\n" +
        "        <select class=\"fieldToOrderBy resetElement\">" + "\n" +
        "          <option value=\"\"></option>" + "\n" +
        "          <option value=\"" + recordObject.tableName + "Id\">" + recordObject.tableName + "Id</option>" + "\n";  
        

        // Loop through the fieldsObject.
        for (let fieldKey in fieldsObject) 
        {
          // If the field is published.
          if(fieldsObject[fieldKey].published === true)
          {
            // If the field is an object we will need to create dot notation in order to refer to the field.
            if(fieldsObject[fieldKey].subObject)
            {
              // Declare a function that we will run if we encounter an object in the data dictionary.
              function drillIntoObject(obj, objKey, startingPath)
              {
                // Drill down into the object so that we can create html for it's subfields.
  
                // Get a reference to the recordObject called "obj"
                let objValue = obj;                 

                // Here is where we do the drilling.
                for (let keyPart in objValue[objKey].subObject) 
                {
                  let propertyPath = startingPath + objKey + "." + keyPart;                                

                  // if the subfield is also an object then this function calls itself using the subfield parameters.
                  // This will continue drilling in until we are at the end of the branches and
                  if(objValue[objKey].subObject[keyPart].subObject)
                  { 
                    drillIntoObject(objValue[objKey].subObject, keyPart, objKey + ".");
                  }
                  else // We are at the end of a branch. This is a field not an object so create HTML for this field.
                  {
                    if(objValue[objKey].subObject[keyPart].published === true)
                    {
                      // Grab the key of each defaultElement property. 
                      // Use it to make HTML that will populate the select element on the webpage.
                      htmlString = htmlString +
                      "          <option value=\"" + propertyPath + "\">" + propertyPath + "</option>" + "\n";
                    }
                  }
                } 
              };

              drillIntoObject(fieldsObject, fieldKey, "")
            }
            else // The field is a string so build the HTML without any dot notation.
            {
              // Create an object of default elements for a field.
              let defaultElementsObject = fieldsObject[fieldKey].defaultElements;

              // Loop through defaultElementsObject.
              for (let elementKey in defaultElementsObject) 
              {
                // Grab each defaultElement make HTML to display it on the webpage.
                htmlString = htmlString +
                "          <option value=\"" + elementKey + "\">" + elementKey + "</option>" + "\n";
              }             
            }
          }
        }  
        
        
        htmlString = htmlString +        
        "          <option value=\"timeStamp\">timeStamp</option> " + "\n" +
        "        </select>" + "\n" +
        "      </div>" + "\n";

     
htmlString = htmlString +        
`
      <!--The following is used to select the order by operator ascending or descending-->    
      <div class="inputWrapper">
        <div class="inputLabel smallTopMargin">Select an operator to use in the order by expression.</div>
        <select class="orderByOperator resetElement"> 
          <option value=""></option>   

          <optgroup label="Alphabetical Sorting"></optgroup>  
          <option value="ascendingAlphaSort">ascending - Upper & Lower Case Sorts Together - Slower</option>
          <option value="descendingAlphaSort">descending - Upper & Lower Case Sorts Together - Slower</option>            
          </optgroup>           
          
          <optgroup label="Numerical Sorting"></optgroup>
          <option value="ascendingNumericSort">ascending - Upper & Lower Case WILL NOT Sort Together - Faster</option>
          <option value="descendingNumericSort">descending - Upper & Lower Case WILL NOT Sort Together - Faster</option>           
          </optgroup>                                                            
        </select>
      </div> 

      <!--The following is used to add a new order by clause-->    
      <div class="inputWrapper">
        <div class="inputLabel smallTopMargin">Add another order by expression if desired.</div>
        <select class="orderByConjunctionSelector resetElement" data-previous=""> 
          <option value=""></option>        
          <option value="ThenOrderBy">Then Order By</option>                                                                       
        </select>
      </div> 
    </div>
  </div>

  <!--The following textarea is used to display and edit the query string.-->    
  <div class="queryExpressionWrapper">          
    <div class="inputWrapper">
      <div class="inputLabel smallTopMargin">Query Expression</div>
      <textarea class="queryExpressionTextArea" name="queryExpression" rows="10" cols="30"></textarea>
    </div>
  </div>         
</script>
`  

htmlString = htmlString +
`
<script>
/*
 * Frontend Browser JavaScript For ${recordObject.tableName}List Webpage
 *
 */

"use strict";

// Container for frontend application
var app = {};

// AJAX Client (for RESTful API)
// Create an empty object to contain the client.
app.client = {}




// Define interface function for making API calls.
app.client.request = function(headers,path,method,queryStringObject,payload,callback)
{
  // Set defaults
  headers = typeof(headers) == 'object' && headers !== null ? headers : {};
  path = typeof(path) == 'string' ? path : '/';
  method = typeof(method) == 'string' && ['POST','GET','PUT','DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
  queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
  payload = typeof(payload) == 'object' && payload !== null ? payload : {};
  callback = typeof(callback) == 'function' ? callback : false;

  // For each query string parameter sent, add it to the path
  var requestUrl = path+'?';
  var counter = 0;
  for(var queryKey in queryStringObject)
  {
    if(queryStringObject.hasOwnProperty(queryKey))
    {
      counter++;

      // If at least one query string parameter has already been added, preprend new ones with an ampersand
      if(counter > 1)
      {
        requestUrl+='&';
      }

      // Add the key and value
      requestUrl+=queryKey+'='+queryStringObject[queryKey];
    }
  }

  // Form the http request as a JSON type
  var xhr = new XMLHttpRequest();
  xhr.open(method, requestUrl, true);
  xhr.setRequestHeader("Content-type", "application/json");

  // For each header sent, add it to the request
  for(var headerKey in headers)
  {
     if(headers.hasOwnProperty(headerKey))
     {
       xhr.setRequestHeader(headerKey, headers[headerKey]);
     }
  }

  // If there is a current session token set, add that as a header
  // if(app.config.sessionToken)
  // {
  //   xhr.setRequestHeader("token", app.config.sessionToken.id);
  // }

  // When the request comes back, handle the response
  xhr.onreadystatechange = function()
  {
      if(xhr.readyState == XMLHttpRequest.DONE) 
      {
        var statusCode = xhr.status;
        var responseReturned = xhr.responseText;

        // Callback if requested
        if(callback)
        {
          try
          {
            var parsedResponse = JSON.parse(responseReturned);
            callback(statusCode,parsedResponse);
          } 
          catch(e)
          {
            callback(statusCode,false);
          }

        }
      }
  }

  // Send the payload as JSON
  var payloadString = JSON.stringify(payload);
  xhr.send(payloadString);

}; // End of: app.client.request = function(headers,path,method,queryStringObject,payload,callback){...}
// End of: Interface for making API calls




// Populate the ${recordObject.tableName}List webpage with controls and ${recordObject.tableName} records from the table.
app.load${recordObject.tableName}ListPage = async function()
{  
  // Create an HTML table here so all functions below will have access to it.
  let table = document.createElement('table');  

  // Create a handle for the query form template here so all functions below will have access to it.
  // This template is in the webpage html at the bottom between <script> tags.
  let formTemplate = document.querySelector('[type="text/formTemplate"]'); 


  // Define a function to load the query form from the template.
  function loadQueryForm()
  {
  let templateClone = formTemplate.cloneNode(true);
  let templateHTMl = templateClone.textContent;
  let templateTarget = document.querySelector(".formWrapper");
  templateTarget.innerHTML = templateHTMl; 
  };

  // Call the function above to load a new clean queryForm onto the webpage.
  loadQueryForm();


  // Define the function that fires when the fieldToOrderBy selector changes.
  function onChangeBehaviorForFieldToOrderBySelector (event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // Start of: Hide options which contain fields that are already displayed on select elements.
    // 1. Create an empty array to hold the values contained in the select elements.
    let selectorElementValues = [];

    // 2. Look at each select element and store their values in the array.
    document.querySelectorAll(".fieldToOrderBy").forEach(function(element) 
    {
      // if the select elements are not blank
      if(element.value != "")
      {
        // Push the values onto the array.
        selectorElementValues.push(element.value);
      }
    });   
    
    // 3. Examine the menu options of the selector having focus and hide any 
    //    options that exist in the selectElementValues array.
    //    So if an item has already been selected then it won't show in the 
    //    list of items to select.
    document.querySelectorAll(".fieldToOrderBy").forEach(function(element) 
    {
      let optionElements = element.querySelectorAll('option');  
  
      for (let optionElement of optionElements) 
      {
        if(selectorElementValues.indexOf(optionElement.innerHTML) > -1)
        {
          optionElement.style.display = "none";
        }    
        else
        {
          optionElement.style.display = "list-item";
        }  
      }
    }); 
    // End of: Hide options which contain fields that are already displayed on select elements.

  } // End of: function onChangeBehaviorForfieldToOrderBySelector (event)
  // End of: Define the function that fires when the fieldToOrderBy selector changes.  

  // Bind the function above to the onChange event of the first (and only for now) fieldToDisplay select element.
  document.querySelectorAll(".fieldToOrderBy")[0].addEventListener("change", onChangeBehaviorForFieldToOrderBySelector);  



  // Define function that fires when the clear query button is clicked.
  function onClickEventBehaviorOfClearQueryButton(event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // Remove the old query form if any from the webpage.
    let templateTarget = document.querySelector(".formWrapper");
    templateTarget.innerHTML = ""; 

    // Call the loadQueryForm function above to load a new clean queryForm onto the webpage.
    loadQueryForm();

    // Now add back the onChange event listeners for the controls on the form.
    document.querySelectorAll(".fieldToOrderBy")[0].addEventListener("change", onChangeBehaviorForFieldToOrderBySelector);
    document.querySelectorAll(".fieldToDisplay")[0].addEventListener("change", onChangeBehaviorForFieldToDisplaySelector);
    document.querySelectorAll(".conjunctionSelector")[0].addEventListener("change", onChangeBehaviorForConjunctionSelector);    
    document.querySelectorAll(".orderByConjunctionSelector")[0].addEventListener("change", onChangeBehaviorForOrderByConjunctionSelector);

  }; // End of: function onClickEventBehaviorOfClearQueryButton(event) = function(){...}
  // End of: Define function that fires when the clear query button is clicked.

  // Bind the function above to the onClick event of the clear query button.
  document.querySelector("#clearQueryButton").addEventListener("click", onClickEventBehaviorOfClearQueryButton); 



  // Define function that fires when the submit query button is clicked.
  async function onClickEventBehaviorOfSubmitQueryButton(event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // Create an empty array to hold the values contained in each fieldToDisplay selector control.
    let arrayOfFieldsToDisplay = [];     

    // Create a title for the table.    
    let tableCaption = document.createElement('caption');
    tableCaption.innerHTML = 'List ${tableNameInUpperCase} Records';
    tableCaption.className = "tableCaption";
    // Only apply the title if one does not already exist.
    if(!document.querySelector(".tableCaption"))
    {
      table.appendChild(tableCaption);
    }


    // This will populate arrayOfFieldsToDisplay with the values of every fieldToDisplay 
    // selector control (except the last empty one) shown on the webpage.
    // In other words: Populate the array with all the selections made by the user.
    document.querySelectorAll('.fieldToDisplay').forEach(function(node, nodeIndex, nodeList)
    {
      if(nodeIndex < nodeList.length - 1)
      {
        arrayOfFieldsToDisplay.push(node.value);
      }
      else if(nodeIndex = nodeList.length - 1 && node.value != "")
      {
        arrayOfFieldsToDisplay.push(node.value);
      }
    });

    // Make the first empty row for the headers and put it in the table
    let tableRow = document.createElement('tr'); 
    table.appendChild(tableRow);   

    // Check if the user did not select any fields to display.
    // Nothing selected means all fields should be displayed.
    if(arrayOfFieldsToDisplay.length == 0) // Nothing selected so display all fields as they are positioned in the table.
    {
      // Clear out the array
      arrayOfFieldsToDisplay = [];
      
      // Repopulate arrayOfFieldsToDisplay with all possible options except the first empty option.
      // In other words: populate the array with every field name it is possble to display.
      document.querySelector('.fieldToDisplay').querySelectorAll("option").forEach(function(node, nodeIndex)
      {
        if (nodeIndex != 0)
        {
            arrayOfFieldsToDisplay.push(node.value);
        }
      });
    } // End of: if(arrayOfFieldsToDisplay[0] == "") // Nothing selected

    // Populate the first row with headers containing the names of each field.
    arrayOfFieldsToDisplay.forEach(function(arrayElement)
    {
      // Make a header for row 1 and put it in the row.
      let tableHeader = document.createElement('th');  
      tableHeader.innerHTML = arrayElement  
      tableRow.appendChild(tableHeader);
    });    

    // Make an extra header for row 1 so that the user can drill into the record and edit the detail or delete it.
    let tableHeader = document.createElement('th');  
    tableHeader.innerHTML = 'Details'  
    tableRow.appendChild(tableHeader);     

    // The first record in any table will be the primary key. This a global sequential unique Id
    // Used here to populate the last cell of each row in a table with a control to drill in on that record.
    let nameOfPrimaryKey = document.querySelector('.fieldToDisplay').querySelectorAll("option")[1].value;

    // Check if there is an order-by clause in the queryExpression.
    let queryExpression = document.querySelector(".queryExpressionTextArea").value;

    let indexOfOrderByClause = queryExpression.indexOf("ORDERBY:;");

    // If no order-by clause exists in the query expression fetch the data and stream the results directly to the page.
    if(indexOfOrderByClause === -1)
    {
      // Run the query defined in the textarea on the form.
      // This call to the server is used when NO sort order is specified by the user.
      runQueryThenStreamToDisplay(queryExpression, arrayOfFieldsToDisplay, nameOfPrimaryKey);
    }
    else // The user specified an order so await for all the results and then sort before presenting to the user.
    {
      // Get the part of the queryExpression string starting at "ORDERBY:;"
      let orderByString = queryExpression.substring(indexOfOrderByClause);  


      // Fill an array with data from the orderby clause
      // Make an array out of the queryString where each phrase of the query is an element.
      let orderByArray = orderByString.split(":;"); 

      // Get rid of the last element in the array. This is just an empty string.
      orderByArray.splice(orderByArray.length -1, 1);

      // Determine the amount of orderby clauses.
      // There are three elements in the array for each clause.
      let amountOfOrderByClauses = orderByArray.length/3; 
     
      // Make an array for the names of the fields to sort
      let fieldsToOrderByArray = [];

      // Make an array for the type of sort to make on the respective field.
      let typeOfSortArray = []

      // Populate the two new arrays from the orderByArray
      for (let i = 0; i < amountOfOrderByClauses; i++) 
      {
        // Get rid of the first element in the array. It's just the conjunction.
        orderByArray.splice(0, 1);

        // Copy the next element into the fieldsToOrderByArray and then remove the element.
        fieldsToOrderByArray.push(orderByArray.splice(0, 1)[0]);

        // Copy the next element into the typeOfSortArray and then remove the element.
        typeOfSortArray.push(orderByArray.splice(0, 1)[0]);
      }         


      // Run the query defined in the textarea on the form.
      // This call to the server is used when a sort order IS specified by the user.    
      let recordsArray = await runQueryWaitForAllData(queryExpression);


      // Sort the recordsArray which was populated after running the query.
      recordsArray.sort(function(a, b)
      { 
        let loopCounter = 0;
        let sortResult = 0;

        while (loopCounter <= amountOfOrderByClauses - 1) 
        {

  
          function drillIntoObject(obj, orderByArray, orderByIndex)
          {
              // Converting each property key from dot notation to bracket notation.
              // Then using bracket notation to drill down into the object.

              // Get a reference to the recordObject called "value"
              let objValue = obj;

              // Split the property key into an array delimited by the dot if any.
              // The array will be used to drill into nested objects.
              const keyParts = orderByArray[orderByIndex].split(".");

              // Here is where we do the drilling.
              for (let keyPart of keyParts) 
              {
                // Make objValue point to it's sub-object or it's final value when the loop is finished running.
                objValue = objValue[keyPart];

                // Not all records will have the same data structure - 
                // Fields specified in the data dictionary may be missing.
                // So don't try to get a value if it's not there - 
                // That would cause an error and stop the table from loading
                if(objValue === undefined){break};                
              } 

              return objValue;
          };
            
          let aFieldValue = drillIntoObject(a, fieldsToOrderByArray, loopCounter);
          let bFieldValue = drillIntoObject(b, fieldsToOrderByArray, loopCounter);

          // If we are ranking alphabetically:
          if(typeOfSortArray[loopCounter] === 'ascendingAlphaSort')
          {
            // Alphabetic Sort
            sortResult = aFieldValue.toString().toLowerCase().localeCompare(bFieldValue.toString().toLowerCase());

            if(sortResult === 1){return 1;} // Don't change the order.

            if(sortResult === -1){return -1;} // b ranks higher so swap a and b

          }
          if(typeOfSortArray[loopCounter] === 'descendingAlphaSort')
          {
            // Alphabetic Sort
            sortResult = aFieldValue.toString().toLowerCase().localeCompare(bFieldValue.toString().toLowerCase());

            if(sortResult === 1){return -1;} // Don't change the order.

            if(sortResult === -1){return 1;} // b ranks higher so swap a and b

          }          
          else if (typeOfSortArray[loopCounter] === 'ascendingNumericSort')
          {
            // Numeric Sort
            if (aFieldValue < bFieldValue) return -1;

            if (aFieldValue > bFieldValue) return 1;

          }
          else if (typeOfSortArray[loopCounter] === 'descendingNumericSort')
          {
            // Numeric Sort
            if (aFieldValue > bFieldValue) return -1;

            if (aFieldValue < bFieldValue) return 1;

          }          

          // If we got this far then records a and b are the same for the field currently being examined. 
          // Check to see if there are more orderby clauses to test on these two records.
          // If there are then we will go through the loop again using the next clause as a tie breaker.       

          loopCounter = loopCounter + 1;      

          // If there are no more orderby clauses to 
          if (loopCounter === amountOfOrderByClauses)
          {
            return 0
          }         

        } // End of: while (loopCounter <= amountOfOrderByClauses - 1){...}
      }) // End of: recordsArray.sort(function(a, b){...}
      // End of: Sort the recordsArray which was populated after running the query.      


      recordsArray.forEach(function(value)
      {
        // Insert a new row in the table.
        let tr = table.insertRow(-1);            
        
        // Insert a new cell for each field to display and populate with data for that field.
        arrayOfFieldsToDisplay.forEach(function(arrayElement, elementIndex)
        {
          // Converting each property key from dot notation to bracket notation.
          // Then using bracket notation to drill down into the object.

          // Get a reference to the recordObject called "value"
          let objValue = value;

          // Split the property key into an array delimited by the dot if any.
          // The array will be used to drill into nested objects.
          const keyParts = arrayElement.split(".");

          // Here is where we do the drilling.
          for (let keyPart of keyParts) 
          {
            // Make objValue point to it's sub-object or it's final value when the loop is finished running.
            objValue = objValue[keyPart];

            // Not all records will have the same data structure - 
            // Fields specified in the data dictionary may be missing.
            // So don't try to get a value if it's not there - 
            // That would cause an error and stop the table from loading
            if(objValue === undefined){break};            
          } 

          let newCell = tr.insertCell(elementIndex);
          newCell.innerHTML = objValue;               
        });   

        // Add an extra cell to the end of the row that contains a link which sends the user
        // to a new screen where the record can be edited or deleted.
        let lastCell = tr.insertCell(arrayOfFieldsToDisplay.length);             
        lastCell.innerHTML = '<a href="/${recordObject.tableName}/edit?${recordObject.tableName}Id=' + value[nameOfPrimaryKey] + '">View / Edit / Delete</a>';
      }) 
    }

    // Put the table on the webpage.
    let tableParent = document.querySelector('.content');
    tableParent.appendChild(table);    

    // This scrolls the results into view.
    document.querySelector("#submitQueryButton").scrollIntoView();

  }; // End of: function onClickEventBehaviorOfSubmitQueryButton(event) = function(){...}
  // End of: Define function that fires when the submit query button is clicked.

  // Bind the function above to the onClick event of the submit query button.
  document.querySelector("#submitQueryButton").addEventListener("click", onClickEventBehaviorOfSubmitQueryButton);



  // Define a function that fetches data from the server and waits 
  // till all data has been received before passing it along.
  // This is one of 3 ways that we call for data from the server.
  // We use this function when the user specifies a sort order which
  // requires that all the data be present before we can start to work
  // on it.
  async function runQueryWaitForAllData(queryExpression) 
  {
    const res = await fetch('api/${recordObject.tableName}' + queryExpression);

    // Verify that we have some sort of 2xx response that we can use
    if (!res.ok) 
    {
        console.log("Error trying to load the ${tableNameInUpperCase} list: ");
        throw res;
    }
    // If no content, immediately resolve, don't try to parse JSON
    if (res.status === 204)
    {
        return [];
    }
    // Get all the text sent by the server as a single string.
    const content = await res.text();

    // Split the content string on each new line character and put the results into an array called lines.
    const lines = content.split("\\n");

    // Get rid of the last element in the array. This is just a new line character.
    lines.splice(lines.length -1, 1);

    // Return a new array to the calling function consisting of JSON objects which contain each record sent by the server.
    return lines.map(function(line)
    {
      if(line != "")
      {
        return JSON.parse(line);
      }
    });
  } // End of: async function runQueryWaitForAllData(queryExpression){...}
  // End of: Define a function that fetches data from the server...



  // Define function that fires when the clear results button is clicked.
  function onClickEventBehaviorOfClearResultsButton(event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // Clear all results from the table.
    table.remove();
    table.innerHTML = "";

  }; // End of: function onClickEventBehaviorOfClearResultsButton(event) = function(){...}
  // End of: Define function that fires when the clear results button is clicked.

  // Bind the function above to the onClick event of the submit query button.
  document.querySelector("#clearResultsButton").addEventListener("click", onClickEventBehaviorOfClearResultsButton);  



  // Define function that fires when generate query button is clicked.
  // The following function builds a query by examining the control 
  // elements for the filter and the order by clause. 
  // Then it sends the query off to the server and manages the response.
  function onClickEventBehaviorOfGenerateQueryButton(event)
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // This will contain the finished query expression that we will send to the server.
    let queryExpression = "?";


    // Define a function that will check if every element in an array is blank.
    // This will be used to determine if the user filled out the form.
    function allBlanks(arrayOfValues) 
    {
      function isBlank(thisValue) 
      {
        // The following will examine one of the elements of the array  
        // and return true if blank - otherwise it will return false.
        return thisValue == "";
      }  

      // .every is an array method that will call the function isBlank 
      // once for every element in the array selectorElementValues.
      // it will return true if every element is blank.
      return arrayOfValues.every(isBlank);
    } // End of: function allBlanks(arrayOfValues){...} 
    // End of: Define a function that will check if every element in an array is blank.


    // Start of: Begin building a query expression by examining the filter control elements.
    // Only the where and order by clauses matter for the fetch from the server.
    // The select clause controls and records-per-page control can be 
    // examined and used after the records have been returned by the fetch.

    // 1. Make an array from the where clause elements.
    // Create an empty array to hold the values contained in the where clause select elements.

    // Create a handle to address the group wrapper. 
    // We can use this to keep the search for control elements limited to the where clause controls.
    let whereClauseGroupWrapper = document.querySelectorAll(".whereClauseGroupWrapper")[0];

    // Create an empty array to hold the values of the where clause controls elements.
    let whereClauseElementValues = [];

    // Store the values of each select element in the new array.
    // .resetElement is just a class that all the elements of interest have in common.
    whereClauseGroupWrapper.querySelectorAll(".resetElement").forEach(function(element) 
    {
      // Push the values onto the array.
      whereClauseElementValues.push(element.value);

    }); 

    // 2. Ensure all but the last element contains a value or that none of the 
    // elements contain values and then generate the query expression.
    // In other words: 
    // Make sure the user filled out the filter form(s) completely or not at all.
    // If the filter form(s) is/are completely filled out the create the query expression.

    // Find out which element in the array is the first element to contain a blank value.
    // If it's the last one then we know the form has been filled out completely.
    let indexOfFirstWhereClauseBlankSelector = whereClauseElementValues.indexOf("")

    // Find out if all the values in the array selectorElementValues are blank.
    // If they are then we know that the form was not filled out at all in 
    // which case we should ignore the form.

    // If not all the elements are blank then user has made a filter expression.
    let userHasMadeAFilterExpression = !allBlanks(whereClauseElementValues);

    if(userHasMadeAFilterExpression)
    {
      // If the first blank is the very last element in the array then
      // we know that the form has been filled out compelely.
      if(indexOfFirstWhereClauseBlankSelector == whereClauseElementValues.length -1) 
      {

        queryExpression = queryExpression + "WHERE" + ":;"

        // The form has been filled out completely so populate the query expression with data from the controls.
        whereClauseElementValues.forEach(function(element){
          if(element != "")
          {
            queryExpression = queryExpression + element + ":;"
          } 
        });
      }
      else // The user did not fill out the form competely so bail out of the process.
      {
        alert('The filter expression must be filled out completely or must be completely blank' + '\\n' + 'Please check your work.')
        return // Stop the process.
      }

    } // End of: if(userHasMadeAFilterExpression){...}
    // End of: Begin build a query expression by examining the filter control elements.


    // Start of: Add any orderby clauses to the query expression.
    // 1. Make an array from the orderby clause elements.
    // Create an empty array to hold the values contained in the orderby clause select elements.

    // Create a handle to address the group wrapper. 
    // We can use this to keep the search for control elements limited to the orderby clause controls.
    let orderByClauseGroupWrapper = document.querySelectorAll(".orderByClauseGroupWrapper")[0];

    // Create an empty array to hold the values of the orderby clause controls elements.
    let orderByClauseElementValues = [];

    // Store the values of each select element in the new array.
    // .resetElement is just a class that all the elements of interest have in common.
    orderByClauseGroupWrapper.querySelectorAll(".resetElement").forEach(function(element) 
    {
      // Push the values onto the array.
      orderByClauseElementValues.push(element.value);

    }); 

    // 2. Ensure all but the last element contains a value or that none of the 
    // elements contain values and then add to the query expression.
    // In other words: 
    // Make sure the user filled out the orderby form(s) completely or not at all.
    // If the orderby form(s) is/are completely filled out then add to the query expression.

    // Find out which element in the array is the first element to contain a blank value.
    // If it's the last one then we know the form has been filled out completely.
    let indexOfFirstOrderByClauseBlankSelector = orderByClauseElementValues.indexOf("")

    // Find out if all the values in the array selectorElementValues are blank.
    // If they are then we know that the form was not filled out at all in 
    // which case we should ignore the form.

    // If not all the elements are blank then then user has made an orderby expression.
    let userHasMadeAnOrderByExpression = !allBlanks(orderByClauseElementValues);

    if(userHasMadeAnOrderByExpression)
    {
      // If the first blank is the very last element in the array then
      // we know that the form has been filled out compelely.
      if(indexOfFirstOrderByClauseBlankSelector == orderByClauseElementValues.length -1) 
      {

        queryExpression = queryExpression + "ORDERBY" + ":;"

        // The form has been filled out completely so populate the query expression with data from the controls.
        orderByClauseElementValues.forEach(function(element){
          if(element != "")
          {
            queryExpression = queryExpression + element + ":;"
          } 
        });

      }
      else // The user did not fill out the form competely so bail out of the process.
      {
        alert('The order-by expression must be filled out completely or must be completely blank' + '\\n' + 'Please check your work.')
        return // Stop the process.
      }

    } // End of: if(userHasMadeAFilterExpression){...}
    // End of: Add any orderby clauses to the query expression.

    // Start of: Replace troublesome symbols in the query expression

    // DON'T USE THE FOLLOWING SYMBOLS OR THE %ESCAPES IN THE QUERY EXPRESSION
    // CODE BELOW SWAPS THESE FOR SOMETHING COMPLETELY DIFFERENT.
    // PoundStops the Process-%23
    // Ampersand breaks the expression into two parts-%26
    // Equal stops the process-%3D

    // THE FOLLOWING SYMBOLS PRODUCE UNEXPECTED BEHAVIOR:
    // cODE BELOW SWAPS THESE FOR SOMETHING COMPLETELY DIFFERENT.    
    // Backslash is escaped with another backslash no matter what-%5C
    // Single Quote inserts Esc automatically and inserts a back slash in the result-%27
    // Plus shows as a space-%2B 
    
    // THE FOLLOWING SYMBOLS PRODUCE UNEXPECTED BUT HARMLESS BEHAVIOR:
    // IT'S OK TO LEAVE THESE AS IS. WE WON'T NOTICE THEM IN THE FINAL RESULT.
    // Space inserts the Esc automatically-%20
    // DoubleQInsertsEscAutomatically-%22   
    // LessThanInsertsEscAutomatically-%3C
    // GreaterThanInsertsEscAutomatically-%3E     

    // THE FOLLOWING SYMBOLS BEHAVE AS EXPECTED:    
    // Accent-\`
    // Exclaimation-!
    // AtSign-@
    // Dollar-$
    // Percent-%
    // Carrot-^
    // Asterisk-*
    // OpenParen-(
    // CloseParen-)
    // LowDash-_
    // OpenBrace-{
    // CloseBrace-}
    // OpenBracket-[
    // CloseBracket-]
    // Pipe-|
    // Colon-:
    // Semi-;
    // Coma-,
    // Period-.
    // Question-?-
    // ForwardSlash-/-:;

    // We are pulling out these troublesome symbols from the queryExpression and replacing 
    // them with something different before sending them to the server.
    // We will reverse the process at the server.
    queryExpression = queryExpression.replace(/#/g, "{[POUND]}");
    queryExpression = queryExpression.replace(/&/g, "{[AMPERSAND]}");
    queryExpression = queryExpression.replace(/=/g, "{[EQUALS]}");
    // Escaping the following with a backslash now stops the system from inserting an extra backslash in the result.
    queryExpression = queryExpression.replace(/\\\\/g, "{[BACK-SLASH]}");    
    queryExpression = queryExpression.replace(/\\'/g, "{[SINGLE-QUOTE]}");
    queryExpression = queryExpression.replace(/\\+/g, "{[PLUS]}");

    // End of: Replace troublesome symbols in the query expression

    document.querySelector(".queryExpressionTextArea").value = queryExpression;

    // Send the query off with the fetch function below. 
    // Commented out because this now has it's own button to run the query.
    // runQuery(queryExpression);

  } // End of: function onClickEventBehaviorOfGenerateQueryButton(event)
  // End of: Define the function that fires when the generate query button is clicked.  

  // Bind the function above to the onClick event of the query button.
  document.querySelector("#generateQueryButton").addEventListener("click", onClickEventBehaviorOfGenerateQueryButton);



  // Define the function that fires when the order by conjunctionSelector changes.
  function onChangeBehaviorForOrderByConjunctionSelector (event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // Start of: Delete the filter elements directly below or add new ones depending on user's input.

    // Get a count of how many order by expressions already exist.
    let orderByClauseWrapperCount = document.querySelectorAll(".orderByClauseWrapper").length;

    // Get the previous setting if any.
    let previousSetting = event.target.getAttribute('data-previous');

    // Check the value of the conjunction select element chosen by the user.
    if (event.target.value == "") // If the blank option was selected we will delete the filter below.
    {
      // Get the value of the conjunction control we are about to delete because this value joins the next 
      // filter down the line (if one exists). We will move this value into the current conjuction selector.
      event.target.value = event.target.parentNode.parentNode.nextElementSibling.querySelectorAll(".orderByConjunctionSelector")[0].value;

      // Delete the filter below.
      event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode.nextElementSibling);

      // Store the new value as an attribute in case we need to work with this select element in the future.
      event.target.setAttribute('data-previous', event.target.value);
    }
    // otherwise if a conjunction was selected where it was previously blank we will add a new filter.
    else if (event.target.value != "" && previousSetting == "")
    {
      // Blank out the attribute that tracks the previous setting so that the cloned control starts out clean.
      event.target.setAttribute('data-previous','');

      // Clone a new wrapper, the child select element, and children options from the previous and append it to the DOM
      let elmnt = document.querySelectorAll(".orderByClauseWrapper")[orderByClauseWrapperCount - 1];
      let cln = elmnt.cloneNode(true);
  
      // Set all the element values to ""
      cln.querySelectorAll(".resetElement").forEach(function(element){element.value = "";}); 

      cln.querySelectorAll(".fieldToOrderBy")[0].addEventListener("change", onChangeBehaviorForFieldToOrderBySelector);  

      // Create an event listener for the onchange event of the newly cloned select element and bind this function to it.
      cln.querySelectorAll(".orderByConjunctionSelector")[0].addEventListener("change", onChangeBehaviorForOrderByConjunctionSelector);
  
      // Append the new clone to the new where-clause group
      document.querySelectorAll(".orderByClauseGroupWrapper")[0].appendChild(cln);     

      // Now that cloning is done we can use this attribute to keep track of the 
      // new value of the current conjunction control in case we need to change it again.
      event.target.setAttribute('data-previous', event.target.value);
    }
   
    // End of: Delete the filter elements directly below or add new ones depending on user's input.

  } // End of: function onChangeBehaviorForOrderByConjunctionSelector (event)
  // End of: Define the function that fires when the order by conjunctionSelector changes.

  // Bind the function above to the onChange event of the first (and only for now) conjunctionSelector element.
  document.querySelectorAll(".orderByConjunctionSelector")[0].addEventListener("change", onChangeBehaviorForOrderByConjunctionSelector);



  // Define the function that fires when the conjunctionSelector changes.
  function onChangeBehaviorForConjunctionSelector (event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // Start of: Delete the filter elements directly below or add new ones depending on user's input.

    // Get a count of how many filter expressions already exist.
    let whereClauseWrapperCount = document.querySelectorAll(".whereClauseWrapper").length;

    // Get the previous setting if any.
    let previousSetting = event.target.getAttribute('data-previous');

    // Check the value of the conjunction select element chosen by the user.
    if (event.target.value == "") // If the blank option was selected we will delete the filter below.
    {
      // Get the value of the conjunction control we are about to delete because this value joins the next 
      // filter down the line (if one exists). We will move this value into the current conjuction selector.
      event.target.value = event.target.parentNode.parentNode.nextElementSibling.querySelectorAll(".conjunctionSelector")[0].value;

      // Delete the filter below.
      event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode.nextElementSibling);

      // Store the new value as an attribute in case we need to work with this select element in the future.
      event.target.setAttribute('data-previous', event.target.value);
    }
    // otherwise if a conjunction was selected where it was previously blank we will add a new filter.
    else if ((event.target.value == "ANDWHERE" || event.target.value == "ORWHERE") && (previousSetting == ""))
    {
      // Blank out the attribute that tracks the previous setting so that the cloned control starts out clean.
      event.target.setAttribute('data-previous','');

      // Clone a new wrapper, the child select element, and children options from the previous and append it to the DOM
      let elmnt = document.querySelectorAll(".whereClauseWrapper")[whereClauseWrapperCount - 1];
      let cln = elmnt.cloneNode(true);
  
      // Set all the element values to ""
      cln.querySelectorAll(".resetElement").forEach(function(element){element.value = "";}); 
  
      // Create an event listener for the onchange event of the newly cloned select element and bind this function to it.
      cln.querySelectorAll(".conjunctionSelector")[0].addEventListener("change", onChangeBehaviorForConjunctionSelector);
  
      // Append the new clone to the new where-clause group
      document.querySelectorAll(".whereClauseGroupWrapper")[0].appendChild(cln);     

      // Now that cloning is done we can use this attribute to keep track of the 
      // new value of the current conjunction control in case we need to change it again.
      event.target.setAttribute('data-previous', event.target.value);
    }
   
    // End of: Delete the filter elements directly below or add new ones depending on user's input.

  } // End of: function onChangeBehaviorForConjunctionSelector (event)
  // End of: Define the function that fires when the conjunctionSelector changes.

  // Bind the function above to the onChange event of the first (and only for now) conjunctionSelector element.
  document.querySelectorAll(".conjunctionSelector")[0].addEventListener("change", onChangeBehaviorForConjunctionSelector);



  // Define the function that fires when the fieldToDisplay selector changes.
  function onChangeBehaviorForFieldToDisplaySelector (event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // Start of: Hide options which contain fields that are already displayed on select elements.
    // 1. Create an empty array to hold the values contained in the select elements.
    let selectorElementValues = [];

    // 2. Look at each select element and store their values in the array.
    document.querySelectorAll(".fieldToDisplay").forEach(function(element) 
    {
      // if the select elements are not blank
      if(element.value != "")
      {
        // Push the values onto the array.
        selectorElementValues.push(element.value);
      }
    });   
    
    // 3. Examine the menu options of the selector having focus and hide any 
    //    options that exist in the selectElementValues array.
    //    So if an item has already been selected then it won't show in the 
    //    list of items to select.
    document.querySelectorAll(".fieldToDisplay").forEach(function(element) 
    {
      let optionElements = element.querySelectorAll('option');  
  
      for (let optionElement of optionElements) 
      {
        if(selectorElementValues.indexOf(optionElement.innerHTML) > -1)
        {
          optionElement.style.display = "none";
        }    
        else
        {
          optionElement.style.display = "list-item";
        }  
      }
    }); 
    // End of: Hide options which contain fields that are already displayed on select elements.

    // Start of: Remove select elements when blanked out by user or add new blank select elements when needed.

    // Either of the two lines below will work. 
    // They both seem to return an array-like objects which are either an HTMLCollection or a NodeList
    // See the following page for a good explaination of the difference:
    // http://xahlee.info/js/js_array_vs_nodelist_vs_html_collection.html
    // querySelectorAll uses css selectors and it returns a NodeList that will respond to many array methods.
    // On the down side querySelectorAll is a bit slower and returns static elements which has advantages and disadvantages.
    // getElementsByClassName is a bit faster and it returns live elements but responds to fewer array methods.
    // See the following pages for a good explaination of what's the difference and how to work with these:
    // http://xahlee.info/js/js_get_elements.html or https://javascript.info/searching-elements-dom
    // let selectorCount = document.getElementsByClassName("fieldToDisplay").length;    
    let selectorCount = document.querySelectorAll(".fieldToDisplay").length;     

    // Get the amount of options contained in the select element.
    let optionsCount = document.querySelectorAll(".fieldToDisplay")[0].childElementCount;

    // Get the amount of fields contained in the select element.
    // This is the options count minus 1 because there is one option besides the fields.
    // The blank option is the extra option.
    let fieldsCount = optionsCount - 1;


    // Define a function to check that no blank select elements exist.
    let noBlanksExist = function ()
    {
      let foundBlank = false;

      // Look at each select element to see if any are blank.
      // Note: getElementsByClassName does not work with .forEach() the way 
      // querySelectorAll does but it will work with a regular for loop
      document.querySelectorAll(".fieldToDisplay").forEach(function(element)      
      {
        if(element.value == "")
        {
          foundBlank = true;
        }
      });

      if(foundBlank)
      {
        return false;
      }
      else
      {
        return true;
      }
    };
    // End of: Define a function that will check that no blank select elements exist.


    // if the user has selected the blank option and there is more than one select element showing:
    if(event.target.value == "" && selectorCount > 1)
    {
      // Remove the selector and it's wrapper. 
      // Normally the following would work to remove the selector - event.target.remove;
      // But we have to go up two ancestors to remove the wrapper as well.
      event.target.parentNode.parentNode.removeChild(event.target.parentNode);

      selectorCount = selectorCount - 1;
    }    

    // If there are still less selectors than there are fields avaliable for display and there are no blank select elements already:
    if(selectorCount < fieldsCount && noBlanksExist()) 
    {
      // Clone a new wrapper, the child select element, and children options from the previous and append it to the DOM
      let elmnt = document.querySelectorAll(".fieldToDisplayInputWrapper")[selectorCount - 1];
      let cln = elmnt.cloneNode(true);
      document.querySelectorAll(".selectClauseWrapper")[0].appendChild(cln);     

      // Create an event listener for the onchange event of the newly cloned select element and bind this function to it.
      document.querySelectorAll(".fieldToDisplay")[selectorCount].addEventListener("change", onChangeBehaviorForFieldToDisplaySelector);                 
    }
    // End of: Remove select elements when blanked out by user or add new blank select elements when needed.

  } // End of: function onChangeBehaviorForFieldToDisplaySelector (event)
  // End of: Define the function that fires when the fieldToDisplay selector changes.  

  // Bind the function above to the onChange event of the first (and only for now) fieldToDisplay select element.
  document.querySelectorAll(".fieldToDisplay")[0].addEventListener("change", onChangeBehaviorForFieldToDisplaySelector);
  
  

  // Define a function that calls for data from the server.
  // This is one of 3 ways that we call for data from the server.
  // This function is called when the submit query button is pressed and there is no sort order specified by the user.
  // As there is no sort order to process, there is no reason to wait for all the data to arrive before displaying it.
  // So this function streams data right to the webpage without waiting for all of it to arrive.
  async function runQueryThenStreamToDisplay(queryExpression, arrayOfFieldsToDisplay, nameOfPrimaryKey)
  {
    // Define a client function that calls for data from the server.
    const fetchPromise = fetch('api/${recordObject.tableName}' + queryExpression)
    .then
    (
      (res) => 
      {
        // Verify that we have some sort of 2xx response that we can use
        if (!res.ok) 
        {
          // throw res;         
          console.log("Error trying to load the ${tableNameInUpperCase} list: ");        
        }

        // If no content, immediately resolve, don't try to parse JSON
        if (res.status === 204) 
        {
          return;
        }

        // Initialize variable to hold chunks of data as they come across.
        let textBuffer = '';

        // Process the stream.
        return res.body

        // Decode as UTF-8 Text
        .pipeThrough
        (
          new TextDecoderStream()
        )

        // Split on lines
        .pipeThrough
        (
          new TransformStream
          (
            {
              transform(chunk, controller) 
              {
                textBuffer += chunk;            

                // Split the string of records on the new line character and store the result in an array named lines.
                const lines = textBuffer.split('\\n');

                // Cycle through all elements in the array except for the last one which is only holding a new line character.
                for (const line of lines.slice(0, -1))
                {
                  // Put the element from the array into the controller que.
                  controller.enqueue(line);
                } // End of: for (const line ...)

                // Put the last element from the array (the new line character) into the textBuffer but don't put it in the que.
                textBuffer = lines.slice(-1)[0];             
              }, // End of: Transform(chunk, controller){do stuff}

              flush(controller) 
              {
                if (textBuffer) 
                {
                  controller.enqueue(textBuffer);
                } // End of: if (textBuffer)
              } // End of: flush(controller){do stuff}
            } // End of: parameters for new TransformStream
          ) // End of: call to constructor new TransformStream
        ) // End of: parameters for pipeThrough - Split on lines

        // Parse JSON objects
        .pipeThrough
        (
          new TransformStream
          (
            {
              transform(line, controller) 
              {
                if (line) 
                {
                  controller.enqueue
                  (
                    JSON.parse(line)
                  ); //End of: call to controller.enqueue function
                } // End of: if (line)
              } // End of: transform function
            } // End of: parameter object for new TransformStream
          ) // End of: new TransformStream parameters
        ); // End of: parameters for .pipeThrough - Parse JSON objects
      } // End of: .then callback function instruction for fetch
    ); // End of: .then callback parameters for fetch


    // Call to function which asks server for data.
    const res = await fetchPromise;

    const reader = res.getReader();

    function read() 
    {
      reader.read()
      .then
      (
        ({value, done}) => 
        {
          if (value) 
          {
            // Your object (value) will be here   
            
            // Insert a new row in the table.
            var tr = table.insertRow(-1);            
            
            // Insert a new cell for each field to display and populate with data for that field.
            arrayOfFieldsToDisplay.forEach(function(arrayElement, elementIndex)
            {
              // Converting each property key from dot notation to bracket notation.
              // Then using bracket notation to drill down into the object.

              // Get a reference to the recordObject called "value"
              let objValue = value;

              // Split the property key into an array delimited by the dot if any.
              // The array will be used to drill into nested objects.
              const keyParts = arrayElement.split(".");

              // Here is where we do the drilling.
              for (let keyPart of keyParts) 
              {
                // Make objValue point to it's sub-object or it's final value when the loop is finished running.
                objValue = objValue[keyPart];

                // Not all records will have the same data structure - 
                // Fields specified in the data dictionary may be missing.
                // So don't try to get a value if it's not there - 
                // That would cause an error and stop the table from loading
                if(objValue === undefined){break};                
              } 

              let newCell = tr.insertCell(elementIndex);
              newCell.innerHTML = objValue;               
            });   

            let lastCell = tr.insertCell(arrayOfFieldsToDisplay.length);             
            lastCell.innerHTML = '<a href="/${recordObject.tableName}/edit?${recordObject.tableName}Id=' + value[nameOfPrimaryKey] + '">View / Edit / Delete</a>';

          } // End of: if(value){do stuff}

          if (done) {return;}

          read();

        } // End of: the actual anonymous callback arrow function.
      ); // End of: .then callback after read function completes.
    } // End of: function definition: function read(){do stuff}

    // Call the "read" function defined above when the submit query button is pressed.
    read();

  }; // End of: async function runQueryStreamToDisplay(queryExpression)  

} // End of: app.load${recordObject.tableName}ListPage = async function(){...}
// End of: Populate the ${recordObject.tableName}List webpage with ${tableNameInUpperCase} records.




// Init (bootstrapping)
app.init = function()
{
  window.addEventListener( "pageshow", function ( event ) 
  {
    var historyTraversal = event.persisted || ( typeof window.performance != "undefined" && window.performance.navigation.type === 2 );

    if ( historyTraversal ) 
    {
      // This will clear out everything that might have been cached.
      // Otherwise some form controls will have old data if navagating 
      // with the back button.
      window.location.reload();
    }
  });  

  // Load data on page
  app.load${recordObject.tableName}ListPage();  

};
// End of: Init (bootstrapping)




// Call the init processes after the window loads.
// This is where it all starts.
window.onload = function()
{
  app.init();
};
</script>
`


        // Write out the HTML page to a file.

        let fileExtension = ".html";

        // Call the function which appends a string to a file 
        // then process anonymous callback function defined here.
        meta.append
        (
          recordObject.directory, 
          recordObject.tableName + "List", 
          fileExtension,
          htmlString, 
          function(err)
          {
            if (!err) // The html string was written successfully to a file.
            {
              helpers.log
              (
              5,
              'df3zrxrz74quiy9dqeci' + '\n' +
              'The web page ' + recordObject.tableName + "List" + '.html was written successfully to a file.' + '\n'                                  
              ); // End of: helpers.log(...)
            }
            else // There was an error writing the HTML string to a file.
            {
              helpers.log
              (
              7,
              'p2sbc2t8l2lo06tkwxke' + '\n' +
              'There was an error writing the html string to a file' + '\n'
              ); // End of: helpers.log(...)
            } // End of: else there was an error writing the HTML string to a file.
          } // End of: callback function(err){...}
        ); // End of: _data.append(...)


      }; // End of: writable.write = function(payload){...}

      // Passes the payload stream to the writable object which calls writable.write 
      // which does something useful with the payload.
      pipeline
      (
        payload,
        writable,
        function(pipelineError)
        {
          if(pipelineError)
          {
            helpers.log // Log the error.
            (
              7,
              '4fywxqxxg2am7df6ozhs' + '\n' + 
              'Pipeline error. The message was as follows' + '\n' +                                             
              pipelineError + '\n'                                                 
            ); // End of: helpers.log // Log the error.
          } // End of: if(pipelineError){...}
        } // End of: function(piplineError){...}
      ); // End of: Pipeline

    } // End of: if(!error) Got the most recent record from getMostRecent
    else // There was indeed an error returned by getMostRecent when attempting to get the most current record.
    {
      helpers.log // Log the error.
      (
        7,
        'txpa2v2t7ps3wrd1dquw' + '\n' + 
        'The following was the error message from getMostRecent:' + '\n' +                                             
        errorFromGetMostRecent + '\n'                                                 
      ); // End of: helpers.log // Log the error.
    } // End of: Else // There was indeed an error returned by getHashedPass when attempting to get the most current record. 
  }); //End of: helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)  

}// End of: meta.build.listWebPage = function(metadataId){...}
// End of: Define a function which builds a webpage for listing records from a json table in the database.




// Define a function which builds a web page for 
// editing records to a json table in the database.
meta.build.editWebPage = function(metadataId)
{
  let dataObject = {};

  // We are not trying to write to the table so no need to enforce uniqueness.
  // Since this field is never empty in metadata.json, an empty string will pass the uniqueness test in getMostRecent().
  dataObject.uniqueField01Value = "";

  dataObject.uniqueField01Name = "tableName";           
  dataObject.path = '/database/dbMetadata/metadata.json';
  dataObject.queryString = 'WHERE:;metadataId:;MatchesExactly:;' + metadataId + ':;';  

  // Declare at top of function so that we will have access throughout.
  let recordObject; 
  let htmlString = "";

  // Collect information about the webpage from the metadata.
  // 1. Look in metadata.json - Read the object for the given metadataId.
  helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)
  {
    if(!errorFromGetMostRecent) // Got the most recent record from getMostRecent
    {
      // Used to decode the payload buffer into readable text.
      let decoder = new StringDecoder('utf8');    

      // This instance of the Writable object gives us a place for a callback to run when the payload is received.
      const writable = new Writable();

      // Called by pipeline below.
      // Here is where we process the single line of json returned in the payload and make the webpage.
      writable.write = function(payload)     
      {
        let stringContainer = '';                 
        stringContainer = stringContainer + decoder.write(payload);
        recordObject = JSON.parse(stringContainer);
 
        // All the metadata for the table is in record object above.
        // Now we can assemble the webpage HTML string from the metadata in recordObject.

        // Create a variable that contains the name of the table with the first letter capitalized.
        let tableNameInTitleCase = recordObject.tableName[0].toUpperCase() + recordObject.tableName.slice(1);   
        
        htmlString = htmlString +        
        "<!-- This entire file was generated by meta.js at hw3zdcege0x3r50ua3mq -->" + "\n" +
        "<!-- Any changes to this file will be overwritten when the application is regenerated -->" + "\n" +
        "<!-- Make your changes in the generator meta.js or in the data dictionary metadata.json -->" + "\n";


        // If we have specified text for the editPage heading
        if(recordObject.webPages.editPage.heading)
        {
          // Make the heading according the entry in the data dictionary.
          htmlString = htmlString +      
          "<h1>" + recordObject.webPages.editPage.heading + "</h1>" + "\n" + "\n" +
          "<hr />" + "\n" +"\n";          
        }
        else // We did not specify text for the editPage heading. Make a generic heading programmatically.
        {
          htmlString = htmlString +     
          "<h1>Edit This Record From The " + tableNameInTitleCase + " Table</h1>" + "\n" + "\n" +
          "<hr />" + "\n" +"\n"; 
        } // End of: If we have specifed...


        // Get the forms object of the edit page.
        let editPageFormsObject = recordObject.webPages.editPage.forms;


        // Loop through editPageFormsObject to build each form.
        for (let key in editPageFormsObject) 
        {
          // Form headings will be different for each type of form.
          // Form headings are handled here.
          if(key === "editForm")
          {
            // If we have specified heading text on the editForm on the editPage:
            if(editPageFormsObject[key].heading)
            {
              // Make the heading according the entry in the data dictionary.
              htmlString = htmlString +         
              "<h2>" + editPageFormsObject[key].heading + "</h2>" + "\n";        
            }
            else // We did not specify text for the editForm heading. Make a generic heading programmatically.
            {
              htmlString = htmlString + 
              "<h2>Edit This " + tableNameInTitleCase + "</h2>" + "\n";
            } // End of: If we have specifed...

          } // End of: if(key === "editForm"){...}
          // NOT the editForm and NOT the deleteForm so must be SPECIAL like maybe the password form.
          else if (key != "deleteForm") 
          {
            // If we have specified a heading text on the special custom form on the editPage:
            if(editPageFormsObject[key].heading)
            {
              // Make the heading according the entry in the data dictionary.
              htmlString = htmlString +         
              "<h2>" + editPageFormsObject[key].heading + "</h2>" + "\n";        
            }
            else // We did not specify text for the custom form's heading. Make a generic heading programmatically.
            {
              htmlString = htmlString + 
              "<h2>No heading was specified for this form.</h2>" + "\n";
            } // End of: If we have specifed...

          }
          else //This has to be the deleteForm
          {
            // If we have specified heading text on the deleteForm on the editPage:
            if(editPageFormsObject[key].heading)
            {
              // Make the heading according the entry in the data dictionary.
              htmlString = htmlString +         
              "<h2>" + editPageFormsObject[key].heading + "</h2>" + "\n";        
            }
            else // We did not specify text for the deleteForm heading. Make a generic heading programmatically.
            {
              htmlString = htmlString + 
              "<h2>Delete This " + tableNameInTitleCase + "</h2>" + "\n";
            } // End of: If we have specifed...

          } // End of: else: this has to be the deleteForm


          // Get the key with the first letter converted to upper case.
          let keyInTitleCase = key[0].toUpperCase() + key.slice(1);

          htmlString = htmlString + 
          "<div class=\"formWrapper\">" + "\n" +
          "  <form id=\"" + recordObject.tableName + keyInTitleCase + "\" action=\"/api/" + recordObject.tableName + "\" method=\"PUT\">" + "\n" +
          "    <input type=\"hidden\" name=\"_method\" value=\"PUT\"/>"  + "\n" +
          "    <div class=\"formError\"></div>" + "\n";     
          
          // console.log("0. This is the current key in the editPageFormsObject: ", key, "\n");          


          // The following lines will be different for each type of form.
          if(key === "editForm")
          {

            // If we have specified the success message for the editForm on the editPage:
            if(editPageFormsObject[key].successMessage)
            {
              // Make the success message HTML according the entry in the data dictionary.
              htmlString = htmlString +         
              "    <div class=\"formSuccess\">" + editPageFormsObject[key].successMessage + "</div>" + "\n";        
            }
            else // We did not specify a success message. Make a generic message programmatically.
            {
              htmlString = htmlString + 
              "    <div class=\"formSuccess\">Changes to " + tableNameInTitleCase + " have been saved.</div>" + "\n";
            } // End of: If we have specifed...


            htmlString = htmlString +             
            "    <div class=\"inputWrapper\">" + "\n" +
            "      <div class=\"inputLabel\">" + recordObject.tableName + "Id</div>" + "\n" +
            "      <input class=\"disabled\" type=\"text\" name=\"" + recordObject.tableName + "Id" + "\" value=\"{selected." + recordObject.tableName + "Id"  + "}\" disabled/>"  + "\n" +
            "    </div>" + "\n";

                                

            // call the function which builds the HTML for the form element.
            htmlString = htmlString + meta.makeEditPageElementHtml(key, recordObject);



            htmlString = htmlString +             
            "    <div class=\"inputWrapper\">" + "\n" +
            "      <div class=\"inputLabel\">Time Stamp</div>" + "\n" +
            "      <input class=\"timeStampInput\" type=\"text\" name=\"timeStamp\" disabled/>" + "\n" +
            "    </div>" + "\n" +       
            "    <div class=\"inputWrapper ctaWrapper smallTopMargin\">" + "\n";


            // If we have specified text for the Save button on the editForm on the editPage
            if(recordObject.webPages.editPage.forms.editForm.submitButtonText)
            {
              // Make the HTML according the entry in the data dictionary.              
              htmlString = htmlString + 
              "      <button type=\"submit\" class=\"cta green\">" + recordObject.webPages.editPage.forms.editForm.submitButtonText + "</button>" + "\n";
            }
            else // We did not specify text for the Save button. Make generic text programmatically.
            {
              htmlString = htmlString +
              "      <button type=\"submit\" class=\"cta green\">Save Edits</button>" + "\n";
            } // End of: If we have specifed...


            htmlString = htmlString +             
            "    </div>" + "\n" +
            "  </form>" + "\n" +
            "</div>" + "\n" + "\n" +
            "<hr />" + "\n" + "\n";

          } // End of: if(key === "editForm"){...}
          // NOT the editForm and NOT the deleteForm so must be SPECIAL like maybe the password form.
          else if (key != "deleteForm") 
          {

            // If we have specified the success message for the special form on the editPage:
            if(editPageFormsObject[key].successMessage)
            {
              // Make the success message HTML according the entry in the data dictionary.
              htmlString = htmlString +         
              "    <div class=\"formSuccess\">" + editPageFormsObject[key].successMessage + "</div>" + "\n";       
            }
            else // We did not specify a success message. Make a generic message programmatically.
            {
              htmlString = htmlString + 
              "    <div class=\"formSuccess\">Changes to " + tableNameInTitleCase + " have been saved.</div>" + "\n";
            } // End of: If we have specifed...


            htmlString = htmlString +           
            "    <input class=\"hiddenInput\"  type=\"hidden\" name=\"" + recordObject.tableName + "Id" + "\" value=\"{selected." + recordObject.tableName + "Id"  + "}\"/>" + "\n";

            // Insert HTML for any elements if any that were specified in the data dictionary (metadata.json).
            htmlString = htmlString +
            meta.makeEditPageElementHtml(key, recordObject);              
            

            htmlString = htmlString +             
            "    <div class=\"inputWrapper ctaWrapper smallTopMargin\">" + "\n";


            // If we have specified text for the Submit button on the special form on the editPage
            if(recordObject.webPages.editPage.forms[key].submitButtonText)
            {
              // Make the HTML according the entry in the data dictionary.              
              htmlString = htmlString + 
              "      <button type=\"submit\" class=\"cta green\">" + recordObject.webPages.editPage.forms[key].submitButtonText + "</button>" + "\n";
            }
            else // We did not specify text for the Submit button. Make generic text programmatically.
            {
              htmlString = htmlString +
              "      <button type=\"submit\" class=\"cta green\">Commit Edits</button>" + "\n";
            } // End of: If we have specifed...


            htmlString = htmlString + 
            "    </div>" + "\n" +
            "  </form>" + "\n" +
            "</div>" + "\n" + "\n" +
            "<hr />" + "\n" + "\n";            
          }
          else //This has to be the deleteForm
          {

            htmlString = htmlString + 
            "    <div class=\"warning\">Warning: This action cannot be undone. <br>" + "\n" + "      Don't click this button on accident!</div>" + "\n" +
            "      <input class=\"hiddenInput\"  type=\"hidden\" name=\"" + recordObject.tableName + "Id" + "\" value=\"{selected." + recordObject.tableName + "Id"  + "}\"/>" + "\n"+
            "      <input class=\"hiddenInput\"  type=\"hidden\" name=\"deleted\" value=\"true\"/>" + "\n" +
            "    <div class=\"inputWrapper ctaWrapper smallTopMargin\">" + "\n";


            // If we have specified text for the delete button
            if(recordObject.webPages.editPage.forms.deleteForm.submitButtonText)
            {
              // Make the HTML according the entry in the data dictionary.              
              htmlString = htmlString + 
              "      <button type=\"submit\" class=\"cta red\">" + recordObject.webPages.editPage.forms.deleteForm.submitButtonText + "</button>" + "\n";
            }
            else // We did not specify text for the delete button. Make generic text programmatically.
            {
              htmlString = htmlString +
              "      <button type=\"submit\" class=\"cta red\"> Delete " + tableNameInTitleCase + "</button>" + "\n";
            } // End of: If we have specifed...


            htmlString = htmlString + 
            "    </div>" + "\n" +
            "  </form>" + "\n" +
            "</div>" + "\n" + "\n";                       
          } // End of: else: This has to be the delete form.
          
        } // End of: for (let key in formsObject)    
        
        htmlString = htmlString +        
`
<script>
/*
 * Frontend Logic for application
 *
 */

"use strict";

// Container for frontend application
var app = {};


// AJAX Client (for RESTful API)
// Create an empty object to contain the client.
app.client = {}

// Define interface function for making API calls.
app.client.request = function(headers,path,method,queryStringObject,payload,callback)
{
  // Set defaults
  headers = typeof(headers) == 'object' && headers !== null ? headers : {};
  path = typeof(path) == 'string' ? path : '/';
  method = typeof(method) == 'string' && ['POST','GET','PUT','DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
  queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
  payload = typeof(payload) == 'object' && payload !== null ? payload : {};
  callback = typeof(callback) == 'function' ? callback : false;

  // For each query string parameter sent, add it to the path
  var requestUrl = path+'?';
  var counter = 0;
  for(var queryKey in queryStringObject)
  {
    if(queryStringObject.hasOwnProperty(queryKey))
    {
      counter++;

      // If at least one query string parameter has already been added, preprend new ones with an ampersand
      if(counter > 1)
      {
        requestUrl+='&';
      }

      // Add the key and value
      requestUrl+=queryKey+'='+queryStringObject[queryKey];
    }
  }

  // Form the http request as a JSON type
  var xhr = new XMLHttpRequest();
  xhr.open(method, requestUrl, true);
  xhr.setRequestHeader("Content-type", "application/json");

  // For each header sent, add it to the request
  for(var headerKey in headers)
  {
     if(headers.hasOwnProperty(headerKey))
     {
       xhr.setRequestHeader(headerKey, headers[headerKey]);
     }
  }

  // If there is a current session token set, add that as a header
  // if(app.config.sessionToken)
  // {
  //   xhr.setRequestHeader("token", app.config.sessionToken.id);
  // }

  // When the request comes back, handle the response
  xhr.onreadystatechange = function()
  {
      if(xhr.readyState == XMLHttpRequest.DONE) 
      {
        var statusCode = xhr.status;
        var responseReturned = xhr.responseText;

        // Callback if requested
        if(callback)
        {
          try
          {
            var parsedResponse = JSON.parse(responseReturned);
            callback(statusCode,parsedResponse);
          } 
          catch(e)
          {
            callback(statusCode,false);
          }

        }
      }
  }

  // Send the payload as JSON
  var payloadString = JSON.stringify(payload);
  xhr.send(payloadString);

}; // End of: app.client.request = function(headers,path,method,queryStringObject,payload,callback){...}
// End of: Interface for making API calls




// Add a listener to the submit event of all forms in the DOM and bind the anonymous 
// function declared below to the listener using addEventListener.
// bindForms is called from app.init when the webpage is loaded but the anonymous 
// function declared using addEventListener only runs when the form is submitted.
// The function takes the submit event object (e) as the argument.
app.bindForms = function()
{
  // If the DOM contains the CSS selector "form"
  if(document.querySelector("form"))
  {

    // Create an interface to manipulate all the forms in the DOM.
    var allForms = document.querySelectorAll("form");

    // Add a listener to the submit event of every form in the DOM and bind the anonymous function declared here.
    for(var i = 0; i < allForms.length; i++)
    {
      // The following is what runs when the user submits the form.
      allForms[i].addEventListener("submit", function(e)
      {
        // Stop it from submitting
        e.preventDefault();

        // The key word "this" below refers to the html (more accurately the DOM) of the form being submitted.
        // The formId from the html (DOM) is used when loading the form with data.
        var formId = this.id;
        //path and method will determine which api handler will get called.
        var path = this.action;
        var method = this.method.toUpperCase();

        // Hide the error message (if it's currently shown due to a previous error)
        document.querySelector("#"+formId+" .formError").style.display = 'none';

        // Hide the success message (if it's currently shown)
        if(document.querySelector("#"+formId+" .formSuccess"))
        {
          document.querySelector("#"+formId+" .formSuccess").style.display = 'none';
        }


        // Create an empty payload object.
        var payload = {};

        // this.elements is an object containing the inputs and buttons defined in the html of the form being submitted.
        var elements = this.elements;

        // Load the payload object with the names and values of the elements in the form being submitted. 
        for(var i = 0; i < elements.length; i++)
        {
          if(elements[i].type !== 'submit')
          {
            // Determine class of element and set value accordingly.
            var classOfElement = typeof(elements[i].classList.value) == 'string' && elements[i].classList.value.length > 0 ? elements[i].classList.value : '';
            var valueOfElement = elements[i].type == 'checkbox' && classOfElement.indexOf('multiselect') == -1 ? elements[i].checked : classOfElement.indexOf('intval') == -1 ? elements[i].value : parseInt(elements[i].value);
            var elementIsChecked = elements[i].checked;

            // Override the method of the form if the input's name is _method
            var nameOfElement = elements[i].name;

            if(nameOfElement == '_method')
            {
              method = valueOfElement;
            } 
            else // nameOfElement was something other than '_method'
            {
              // Create a payload field named "method" if the elements name is actually httpmethod
              if(nameOfElement == 'httpmethod')
              {
                nameOfElement = 'method';
              }

              // Create an payload field named "id" if the elements name is actually uid
              if(nameOfElement == 'uid')
              {
                nameOfElement = 'id';
              }

              // If the element has the class "multiselect" add its value(s) as array elements
              if(classOfElement.indexOf('multiselect') > -1)
              {
                if(elementIsChecked)
                {
                  payload[nameOfElement] = typeof(payload[nameOfElement]) == 'object' && payload[nameOfElement] instanceof Array ? payload[nameOfElement] : [];
                  payload[nameOfElement].push(valueOfElement);
                }
              } 
              else // element was not of the class multiselect
              {
                payload[nameOfElement] = valueOfElement;
              }
            } // End of: nameOfElement was something other than '_method'
          } // End of: if(elements[i].type !== 'submit'){...}
        } // End of: for(var 1...
        // End of: Load the payload object with the names and values of the elements in the form.



        // If the method is DELETE, the payload should be a queryStringObject instead
        var queryStringObject = method == 'DELETE' ? payload : {};              

        // Call the API
        app.client.request(undefined,path,method,queryStringObject,payload,function(statusCode,responsePayload)
        {
          // Display an error on the form if needed
          if(statusCode !== 200)
          {
            // Try to get the error from the api, or set a default error message
            var error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';

            // Set the formError field with the error text
            document.querySelector("#"+formId+" .formError").innerHTML = error;

            // Show (unhide) the form error field on the form
            document.querySelector("#"+formId+" .formError").style.display = 'block';
            // }
          } 
          else // The submit was successful and we got a response back from the server.
          {
            // Send to form response processor
            app.formResponseProcessor(formId,payload,responsePayload);
          }

        }); // End of: app.client.request(undefined,path,method,queryStringObject,payload,function(statusCode,responsePayload){...}
      }); // End of: allForms[i].addEventListener("submit", function(e){...} What runs when users submit the form.
    } // End of: for(var i = 0; i < allForms.length; i++){...}
  } // End of: if(document.querySelector("form")){...}
}; // End of: app.bindForms = function(){...}
// End of: Bind the anonymous function defined above to the submit event of any forms in the DOM.




// Form submit post processor
// This is the last function called from the anonymous function defined in app.bindForms which 
// executes on a form's submit event.
// So this function defines what happens after a form has been sucessfully submitted.
app.formResponseProcessor = function(formId,requestPayload,responsePayload)
{
  // If the administrator just deleted a record then navigate back to the list page for this table.
  if(formId.slice(-10) === 'DeleteForm')
  {
    window.location = formId.slice(0, -10) + '/list';
  }

  // If the form has success message:
  if(document.querySelector("#"+formId+" .formSuccess"))
  {
    // Display the success Message
    document.querySelector("#"+formId+" .formSuccess").style.display = 'block';
  }

}; // End of: app.formResponseProcessor = function(formId,requestPayload,responsePayload){...}
// End of: Form submit post processor - processing after a sucessful form submit.




// Load the ${recordObject.tableName}Edit page with data from the server.
app.load${recordObject.tableName}EditPage = async function()
{
  // Get the published fields and the timeStamp.
  // Get ${recordObject.tableName}Id
  // The template function inserts the ${recordObject.tableName}Id into the html before serving it to the client.
  let ${recordObject.tableName}Id = document.querySelector("form input[name=${recordObject.tableName}Id]").value;

  // Create a queryExpression with a key of ${recordObject.tableName}Id and a value of the 
  // particular ${recordObject.tableName}Id that the user clicked on in the list.
  let queryExpression = "?WHERE:;${recordObject.tableName}Id:;MatchesExactly:;" + ${recordObject.tableName}Id + ":;";

  // Run the query defined below to get the published fields and the timeStamp for the ${recordObject.tableName}ID.    
  let recordArray = await runQueryOn${recordObject.tableName}Id(queryExpression);

  // Get the record object from the array returned by the query.
  let recordObject = recordArray[0];

  // Define the function that fires when the moveObjectUpButton is selected.
  function onClickBehaviorForMoveObjectUpButton (event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // Enable the moveObjectUpButton on the object coming down.
    let moveObjectUpButtonOnTheObjectComingDown = event.target.parentNode.previousElementSibling.querySelectorAll(".moveObjectUpButton")[event.target.parentNode.previousElementSibling.querySelectorAll(".moveObjectUpButton").length - 1];
    moveObjectUpButtonOnTheObjectComingDown.classList.remove('disabled');
    moveObjectUpButtonOnTheObjectComingDown.removeAttribute("disabled");

    // Find out if we are at the bottom
    if(!event.target.parentNode.nextElementSibling.classList.contains("elementWrapper"))
    {
      // The object coming down will not be able to go down anymore.
      // So no need for the moveObjectDownButton. Disable it.
      let moveObjectDownButtonOnTheObjectComingDown = event.target.parentNode.previousElementSibling.querySelectorAll(".moveObjectDownButton")[event.target.parentNode.previousElementSibling.querySelectorAll(".moveObjectDownButton").length - 1];
      moveObjectDownButtonOnTheObjectComingDown.classList.add("disabled");
      moveObjectDownButtonOnTheObjectComingDown.setAttribute("disabled", "");
    }  

    // Enable the moveObjectDownButton next to the target button.
    // Since we are moving this elementWrapper up we need to be sure the moveObjectDownButton is enabled.
    // Need this in case it was sitting on the bottom where the down button is disabled.
    let moveObjectDownButtonNextToTargetButton = event.target.nextElementSibling
    moveObjectDownButtonNextToTargetButton.classList.remove('disabled');
    moveObjectDownButtonNextToTargetButton.removeAttribute("disabled");
    
    // Move the object up
    if(event.target.parentNode.previousElementSibling)
    {
      event.target.parentNode.parentNode.insertBefore(event.target.parentNode, event.target.parentNode.previousElementSibling);
    }
     
    // Find out if we are at the top
    if(event.target.parentNode === event.target.parentNode.parentNode.firstElementChild)
    {
      // Can't move up anymore than this.
      // Disable the target moveObjectUpButton
      event.target.classList.add("disabled");
      event.target.setAttribute("disabled", "");
    }   

    renumberNamedElementsInGroupWrapper(event.target.parentNode.parentNode);    
    
  } // End of: function onClickBehaviorForMoveObjectUpButton (event)
  // End of: Define the function that fires when the moveObjectUpButton is pressed.


  // Bind the function above to the onClick event of the moveObjectUpButton.
  document.querySelectorAll('.moveObjectUpButton').forEach(function(currentButton)
  {
    currentButton.addEventListener("click", onClickBehaviorForMoveObjectUpButton);
  });


  // Define the function that fires when the moveObjectDownButton is selected.
  function onClickBehaviorForMoveObjectDownButton (event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // Enable the moveObjectDownButton on the object coming up.
    let moveObjectDownButtonOnTheObjectComingUp = event.target.parentNode.nextElementSibling.querySelectorAll(".moveObjectDownButton")[event.target.parentNode.nextElementSibling.querySelectorAll(".moveObjectDownButton").length - 1];    
    moveObjectDownButtonOnTheObjectComingUp.classList.remove('disabled');
    moveObjectDownButtonOnTheObjectComingUp.removeAttribute("disabled");

    // Find out if we are on the top
    if(!event.target.parentNode.previousElementSibling)
    {
      // The object coming up will not be able to go up anymore.
      // So no need for the moveObjectUpButton. Disable it. 
      let moveObjectUpButtonOnTheObjectComingUp = event.target.parentNode.nextElementSibling.querySelectorAll(".moveObjectUpButton")[event.target.parentNode.nextElementSibling.querySelectorAll(".moveObjectUpButton").length - 1];
      moveObjectUpButtonOnTheObjectComingUp.classList.add("disabled");
      moveObjectUpButtonOnTheObjectComingUp.setAttribute("disabled", "");
    } 

    // Since we are moving this elementWrapper down we need to be sure the moveObjectUpButton is enabled. 
    // Need this in case it was sitting at the top where the up button is disabled.
    // Enable the moveObjectUpButton next to the target down button
    let moveObjectUpButtonNextToTargetButton = event.target.previousElementSibling    
    moveObjectUpButtonNextToTargetButton.classList.remove('disabled');
    moveObjectUpButtonNextToTargetButton.removeAttribute("disabled");

    // Move this elementWrapper down
    if(event.target.parentNode.nextElementSibling)
    {
      event.target.parentNode.parentNode.insertBefore(event.target.parentNode.nextElementSibling, event.target.parentNode);
    }
  
    // Find out if we are at the bottom
    if(!event.target.parentNode.nextElementSibling.classList.contains("elementWrapper"))     
    {
      // Can't move down anymore than this.
      // Disable the target moveObjectDownButton.
      event.target.classList.add("disabled");
      event.target.setAttribute("disabled", "");
    }   

    renumberNamedElementsInGroupWrapper(event.target.parentNode.parentNode);

  } // End of: function onClickBehaviorForMoveObjectDownButton (event)
  // End of: Define the function that fires when the moveObjectDownButton is pressed.


  // Bind the function above to the onClick event of the moveObjectDownButton.
  document.querySelectorAll('.moveObjectDownButton').forEach(function(currentButton)
  {
    currentButton.addEventListener("click", onClickBehaviorForMoveObjectDownButton);
  });
  // End of: Bind the function above to the onClick event of the moveObjectDownButton.  


  // Define the function that fires when the removeObjectButton is selected.
  function onClickBehaviorForRemoveObjectButton (event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // If we are on the top
    // if(event.target.parentNode === event.target.parentNode.parentNode.querySelector(".elementWrapper:first-child"))
    if(!event.target.parentNode.previousElementSibling)    
    {
      // The object coming up will not be able to go up anymore.
      // So no need for the moveObjectUpButton. Disable it. 
      let moveObjectUpButtonOnTheObjectComingUp = event.target.parentNode.nextElementSibling.querySelectorAll(".moveObjectUpButton")[event.target.parentNode.nextElementSibling.querySelectorAll(".moveObjectUpButton").length - 1];      
      moveObjectUpButtonOnTheObjectComingUp.classList.add("disabled");
      moveObjectUpButtonOnTheObjectComingUp.setAttribute("disabled", "");

      // If there are only two left
      if(event.target.parentNode.parentNode.childElementCount === 3)      
      {
        // We must never delete the last one
        // So disable the removeObjectButton on the last survivor    
        let removeObjectButtonOnTheObjectComingUp = event.target.parentNode.nextElementSibling.querySelectorAll(".removeObjectButton")[event.target.parentNode.nextElementSibling.querySelectorAll(".removeObjectButton").length - 1];           
        removeObjectButtonOnTheObjectComingUp.classList.add("disabled");
        removeObjectButtonOnTheObjectComingUp.setAttribute("disabled", "");
      }
    } // End of: If there are only two left
    // End of: If we are on the top

    // If we are on the bottom
    if(!event.target.parentNode.nextElementSibling.classList.contains("elementWrapper"))    
    {
      // The object coming down will not be able to go down anymore.
      // So no need for the moveObjectDownButton. Disable it. 
      let moveObjectDownButtonOnTheObjectComingDown = event.target.parentNode.previousElementSibling.querySelectorAll(".moveObjectDownButton")[event.target.parentNode.previousElementSibling.querySelectorAll(".moveObjectDownButton").length - 1];     
      moveObjectDownButtonOnTheObjectComingDown.classList.add("disabled");
      moveObjectDownButtonOnTheObjectComingDown.setAttribute("disabled", "");

      // If there are only two left
      if(event.target.parentNode.parentNode.childElementCount === 3)
      {
        // We must never delete the last one
        // So disable the removeObjectButton on the last survivor
        let removeObjectButtonOnTheObjectComingDown = event.target.parentNode.previousElementSibling.querySelectorAll(".removeObjectButton")[event.target.parentNode.previousElementSibling.querySelectorAll(".removeObjectButton").length - 1];        
        removeObjectButtonOnTheObjectComingDown.classList.add("disabled");
        removeObjectButtonOnTheObjectComingDown.setAttribute("disabled", "");
      } // End of: If there are only two left 
    } // End of: If we are on the bottom

    let groupWrapper = event.target.parentNode.parentNode;

    // Remove the button's parent node.
    event.target.parentNode.remove()

    renumberNamedElementsInGroupWrapper(groupWrapper);    

  } // End of: function onClickBehaviorForRemoveObjectButton (event){...}
  // End of: Define the function that fires when the removeObjectButton is selected.


  // Bind the function above to the onClick event of the removeObjectButtons.
  document.querySelectorAll('.removeObjectButton').forEach(function(currentButton)
  {
    currentButton.addEventListener("click", onClickBehaviorForRemoveObjectButton);
  });
  // End of: Bind the function above to the onClick event of the removeObjectButtons.


  // Define the function that fires when the addNewObjectButton is selected.
  function onClickBehaviorForAddNewObjectButton (event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // Initialize a pointer to the elementWrapper we will clone.
    // We are cloning the last elementWrapper the groupWrapper.
    let lastElementWrapper;

    event.target.parentNode.querySelectorAll(".elementWrapper").forEach(function(elementWrapper)
    {
      if(elementWrapper.parentNode === event.target.parentNode)
      {
        lastElementWrapper = elementWrapper;
      }
    });

    // Here we deep clone the last elementWrapper.
    let cln = lastElementWrapper.cloneNode(true);

    // Remove all the but the first of any elementWappers from the clone groupWrapper
    cln.querySelectorAll(".elementWrapper:not(:first-child)").forEach(function(elementWrapper)
    {
      elementWrapper.remove()
    });

    // Set all the clone's element values to ""
    cln.querySelectorAll(".resetElement").forEach(function(element){element.value = "";});

    // Create an event listener for the onclick event of the clone's removeObjectButtons.
    cln.querySelectorAll(".removeObjectButton").forEach(function(removeObjectButton)
    {
      removeObjectButton.addEventListener("click", onClickBehaviorForRemoveObjectButton);
    });
    
    // Create an event listener for the onclick event of the clone's moveObjectUpButtons.
    cln.querySelectorAll(".moveObjectUpButton").forEach(function(moveObjectUpButton)
    {
      moveObjectUpButton.addEventListener("click", onClickBehaviorForMoveObjectUpButton);
    });    
    
    // Create an event listener for the onclick event of the clone's moveObjectDownButton.
    cln.querySelectorAll(".moveObjectDownButton").forEach(function(moveObjectDownButton)
    {
      moveObjectDownButton.addEventListener("click", onClickBehaviorForMoveObjectDownButton);
    });

    // Create an event listener for the onclick event of the clone's addNewObjectButtons.
    cln.querySelectorAll('.addNewObjectButton').forEach(function(addNewObjectButton)
    {
      addNewObjectButton.addEventListener("click", onClickBehaviorForAddNewObjectButton);
    });

    // Enable the clone's moveObjectUpButtons
    cln.querySelectorAll(".moveObjectUpButton").forEach(function(moveObjectUpButton)
    {
      if(moveObjectUpButton.parentNode === cln)
      {
        moveObjectUpButton.classList.remove('disabled');
        moveObjectUpButton.removeAttribute("disabled");
      }
    });

    // Disable the clone's moveObjectDownButton
    cln.querySelectorAll(".moveObjectDownButton").forEach(function(moveObjectDownButton)
    {
      // if(moveObjectDownButton.parentNode === cln)
      // {
        moveObjectDownButton.classList.add("disabled");
        moveObjectDownButton.setAttribute("disabled", "");
      // }
    }); 

    // Disable all removeObjectButtons on the clone.
    // This is to disable buttons on any children.
    // In the next step after this, the removeObjectButton is enabled at the top level.
    cln.querySelectorAll(".removeObjectButton").forEach(function(removeObjectButton)
    {
      removeObjectButton.classList.add("disabled");
      removeObjectButton.setAttribute("disabled", "");
    }); 


    // Enable the clone's top level removeObjectButton
    cln.querySelectorAll(".removeObjectButton").forEach(function(removeObjectButton)
    {
      if(removeObjectButton.parentNode === cln)
      {
        removeObjectButton.classList.remove('disabled');
        removeObjectButton.removeAttribute("disabled");
      }
    }); 

    // Disable the very top moveObjectUpButton
    event.target.parentNode.querySelectorAll(".moveObjectUpButton").forEach(function(moveObjectUpButton)
    {
      if(moveObjectUpButton.parentNode === event.target.parentNode)
      {
        moveObjectUpButton.classList.add("disabled");
        moveObjectUpButton.setAttribute("disabled", "");
      }
    }); 

    // Enable all but clone's moveObjectDownButton
    event.target.parentNode.querySelectorAll(".moveObjectDownButton").forEach(function(moveObjectDownButton)
    {
      if(moveObjectDownButton.parentNode.parentNode === event.target.parentNode)
      {
        moveObjectDownButton.classList.remove('disabled');
        moveObjectDownButton.removeAttribute("disabled");
      }  
    });

    // Enable all but clone's removeObjectButton
    event.target.parentNode.querySelectorAll(".removeObjectButton").forEach(function(removeObjectButton)
    {
      if(removeObjectButton.parentNode.parentNode === event.target.parentNode)
      {
        removeObjectButton.classList.remove('disabled');
        removeObjectButton.removeAttribute("disabled");  
      }   
    });

    // Append the clone to the object group in the DOM
    let targetGroupWrapper = event.target.parentNode;
    targetGroupWrapper.insertBefore(cln, targetGroupWrapper.childNodes[targetGroupWrapper.childNodes.length -2]);

    renumberNamedElementsInGroupWrapper(event.target.parentNode);

  } // End of: function onClickBehaviorForAddNewObjectButton (event)
  // End of: Define the function that fires when the addNewObjectButton is pressed.


  // Bind the function above to the onClick event of the addNewObjectButtons.
  document.querySelectorAll('.addNewObjectButton').forEach(function(currentButton)
  {
    currentButton.addEventListener("click", onClickBehaviorForAddNewObjectButton);
  });  
  // End of: Bind the function above to the onClick event of the addNewObjectButtons.


  // Create a handle for the last element we loaded with information.
  let lastElement; 

  // Traverse recordObject from the server loading property values into elements. 
  // Clone elements where required. 
  for (let key in recordObject)
  {
    // If this top level property is itself an object containing more objects inside...
    if (typeof recordObject[key] === 'object')
    {
      // Keep track of how deep we have drilled into the object.
      let objectNestLevel = 0;

      // Call the function defined below. 
      drillIntoObject(recordObject, key, objectNestLevel, "")

      // Declare the function that we will use to drill into the recordObject from the server.
      // This function will call itself several times if drilling into nested objects is required.      
      function drillIntoObject(address, objKey, objectNestLevel, previousPath)
      {
        // Check each property to see if it too is an object.
        for (let property in address[objKey])
        {
          // If the current property is also an object...
          if (typeof address[objKey][property] === 'object')
          {
            // If property value has a numeral at the end and the numeral is greater than zero...
            // Then we will need to clone a new element wrapper by activating the correct 
            // addNewObjectButton in the current hierarchy as determined by nestLevel.
            if(hasANumber(property) && property.match(/[0-9]+(?!.*[0-9])/)[0] > 0)
            {
              // The nestLevel along with the levelCounter tells us how far up the hierarchy
              // we need to go in order to reach the addNewObjectButton we are looking for.
              let levelCounter = lastElement[1];
              let targetGroupWrapper = lastElement[0];

              do 
              {
                levelCounter = levelCounter - 2;
                targetGroupWrapper = targetGroupWrapper.parentNode.closest(".groupWrapper");
              } 
              while (levelCounter > objectNestLevel);
              

              // Make a handle for the addNewObjectButton we have been looking for.
              const addButton = targetGroupWrapper.lastElementChild;

              // Clone a new elementWrapper with all required form elements for us to write to.                
              addButton.click();                
            }

            // This function calls itself so as to go deeper into the object
            drillIntoObject(address[objKey], property, objectNestLevel + 1, previousPath + objKey + "_");              
          }
          else // This property is not an object. We are at the end of the branch where we encounter a data field.
          { 
            // Assemble the path through the current object to a property at the end of a branch.
            let objectPath = objKey + "_" + property;

            // If the current object is nested then prepend the path to include the parent objects.
            objectPath = previousPath.length === 0 ? objectPath : previousPath + objectPath;

            // Climb to the end of this branch so we can read the property value.
            let finalBranch = address[objKey];

            // Write to the form element from the recordObject sent to us by the server.
            document.getElementsByName(objectPath).forEach(function (element){element.value = finalBranch[property]}); 

            // Remember the form element we just wrote to so that we will know where we need to write next.
            lastElement = [document.getElementsByName(objectPath)[0], objectNestLevel]
            
          } // End of: else - This property is not an object.
        } // End of: for-let Check each property to see if it too is an object.
      }; // End of: function drillIntoObject(address, objKey, objectNestLevel, previousPath){...}
    } // End of: If this top level property is itself an object containing more objects inside...
    else // This top level property is not an object - It's just a holds a field value.
    {
      // Insert this field value into the apropriate form control.
      document.querySelectorAll("." + key + "Input").forEach(function (element){element.value = recordObject[key]});

    } // End of: Else - This top level property is not an object - It's just a holds a field value.
  } // End of: for (let key in recordObject){...}
  // End of: Traverse record object loading property values into form elements. Clone form elements where required.


  document.querySelectorAll(".timeStampInput").forEach(function(element){element.value = recordObject.timeStamp});  


  document.querySelectorAll(".groupWrapper").forEach(function(currentWrapper){renumberNamedElementsInGroupWrapper(currentWrapper)});


  // Define a function to get the published fields and the timeStamp from the ${recordObject.tableName}ID
  async function runQueryOn${recordObject.tableName}Id(queryExpression) 
  {
    const res = await fetch('api/${recordObject.tableName}' + queryExpression);

    // Verify that we have some sort of 2xx response that we can use
    if (!res.ok) 
    {
        console.log("Error trying to load the ${recordObject.tableName} record: ");
        // throw res;
    }
    // If no content, immediately resolve, don't try to parse JSON
    if (res.status === 204)
    {
        return [];
    }
    // Get all the text sent by the server as a single string.
    const content = await res.text();

    // Split the content string on each new line character and put the results into an array called lines.
    const lines = content.split("\\n");

    // Get rid of the last element in the array. This is just a new line character.
    lines.splice(lines.length -1, 1);

    // Return a new array to the calling function consisting of JSON objects which contain each record sent by the server.
    return lines.map(function(line)
    {
      if(line != "")
      {
        return JSON.parse(line);
      }
    });
  } // End of: async function runQueryOn${recordObject.tableName}Id(queryExpression){...}
  // End of: Define a function to get the published fields and the timeStamp from the ${recordObject.tableName}ID

}; // End of: app.load${recordObject.tableName}EditPage = function(){...}




// Define a function which renumbers field names in children objects as we create, move, or delete their element wrappers
function renumberNamedElementsInGroupWrapper(groupWrapper)
{
  // Used to determine if we are changing levels of hierarchy in the DOM
  // We haven't looked at an elementWrapper yet so it's undefined.
  let previousElementWrapper = undefined;

  // The length of ancestorWrappers array indicates which number in the name string gets replaced with the numeric value in the array.
  // Example fieldName: field_field0_defaultElement_defaultElement0_elementName  
  // For example: the zero in field0 gets replaced or the zero in defaultElement0 gets replaced.
  // If ancestorWrappers.length = 1 we put the numeric value in the array in the place of the zero in field0
  // A length of two in ancestorWrappers indicates we put the numeric value in the array in the place of the zero in defaultElement0
  let ancestorWrappers = [["previousElementWrappers_PushedHere", 0]];

  // Start at the heighest groupWrapper in the hierarchy defined by the groupWrapper that was passed into the function.
  groupWrapper = groupWrapper.closest("form > .groupWrapper");

  // Loop through the elementWrappers.
  groupWrapper.querySelectorAll('.elementWrapper').forEach(function(elementWrapper, wrapperIndex)
  {
    let incremented = false;

    // Loop through the form elements inside each elementWrapper.
    elementWrapper.querySelectorAll('.resetElement').forEach(function(fieldElement)
    {
      //    prevents error           if current wrapper is inside the previous
      if(previousElementWrapper && previousElementWrapper.contains(elementWrapper))
      {
        // We just jumped down a level in the DOM
        // The length of this array tells us how many wrappers suround this element - How deep
        // Or which number in the element name is to be replaced with the numeric value in the array.
        // The numeric value in the array tells us the replacement value.
        ancestorWrappers.push([previousElementWrapper, 0]);
      }
      else // current wrapper is not inside the previous
      {
        // find out what level we are on
        while (true)
        {
          // If we are at the top level...
          if(ancestorWrappers.length === 1 && !previousElementWrapper)
          {
            break; // Don't do anything.
          }
          // Else If the current wrapper is inside the last ancestorWrapper
          else if(ancestorWrappers.length > 1 && ancestorWrappers[ancestorWrappers.length - 1][0].contains(elementWrapper))
          {
            // We are working with a new elementWrapper at the same level.
            // So increment the numeric value held in the last element of the ancestorWrappers array.
            ancestorWrappers[ancestorWrappers.length - 1][1] = ancestorWrappers[ancestorWrappers.length - 1][1] + 1;
            incremented = true;
            break;
          }
          else // the current wrapper is not inside the last ancestorWrapper
          {
            if(ancestorWrappers.length > 1)
            {
              // Remove the last element and check if the next wrapper up contains the current wrapper.
              ancestorWrappers.pop();

              // We are working with a new elementWrapper at the same level.
              // So increment the numeric value held in the last element of the ancestorWrappers array.
              ancestorWrappers[ancestorWrappers.length - 1][1] = ancestorWrappers[ancestorWrappers.length - 1][1] + 1; 
              incremented = true;   
              
              // Now run through this while loop again to see if the last element contain the current wrapper.
            }
            else // we are back at the top level.
            {
              // We are working with a new elementWrapper at the top level.
              // So increment the numeric value held in the only element of the ancestorWrappers array.
              if(!incremented)
              {
                ancestorWrappers[ancestorWrappers.length - 1][1] = ancestorWrappers[ancestorWrappers.length - 1][1] + 1;
                incremented = true;
              }
              break;   
            } // End of: Else - we are at the top level
          } // End of: Else - the current wrapper is not inside the last ancestorWrapper
        } // End of: while (true)
      } // End of: Else - the current wrapper is not inside the previous

      // Get the form element's name.
      let previousNameAttribute = fieldElement.getAttribute("name");
      
      // Search for the nth occurance of a number according to ancestorWrappers.length
      //  A length of one indicates that we search for the first number in the name string.
      //  A length of two indicates that we search for the second number in the name string.

      // Starting out with an empty string in the reduce function below.
      let initialValue = "";

      // Counts how many times we encounter a number as we run the reduce function below.
      let encountersWithNumbers = 0;

      // Spliting the name string of the current element on the underscore.
      // This makes it easy to find and replace numbers in the string.
      const nameAttributeArray = previousNameAttribute.split("_")

      // Running the reduce function on every element in the nameAttributeArray
      let nextNameAttribute = nameAttributeArray.reduce
      (
        // This is the callback function that reduce runs on every element in the nameAttributeArray
        function (accumulator, currentSplitElement, currentSplitElementIndex) 
        {
          // Check for a number in the currentSplitElement.
          if(hasANumber(currentSplitElement))
          {
            // Note that we countered a number in the currentSplitElement.
            encountersWithNumbers = encountersWithNumbers + 1

            // If this is the place in the form element's name that we need to insert a number showing position in the DOM...
            if(encountersWithNumbers === ancestorWrappers.length)
            {
              // Insert numbers in the form element's name string to show it's position within the DOM
              // This information is needed in order to write a well formed object to the JSON database.
              //                                                       search for numbers      replace with numbers denoting postion
              accumulator = accumulator +  currentSplitElement.replace(/[0-9]+(?!.*[0-9])/, ancestorWrappers[ancestorWrappers.length - 1][1]);

              // Put a dash at the end of the element if it is not the last one.
              if(currentSplitElementIndex < nameAttributeArray.length -1){accumulator = accumulator + "_"};

              return accumulator
            }
            else // There is a number here but we don't want to change it now.
            {
              accumulator = accumulator +  currentSplitElement;

              // Put a dash at the end of the element if it is not the last one.
              if(currentSplitElementIndex < nameAttributeArray.length -1){accumulator = accumulator + "_"};

              return accumulator 
            }

          } // End of: if(helpers.hasANumber(currentSplitElement)){...}
          else // There is no number in the currentSplitElement
          {
            accumulator = accumulator +  currentSplitElement;

            // Put a dash at the end of the element if it is not the last one.
            if(currentSplitElementIndex < nameAttributeArray.length -1){accumulator = accumulator + "_"};

            return accumulator            
          }
        } // End of: function (accumulator, currentSplitElement){...}
        , initialValue // This was an empty string passed in to the reduce function to get things started.
      ); // End of: let nextNameAttribute = nameAttributeArray.reduce(function(){do stuff})
        
      // Set the name of the formElement as calculated above.
      fieldElement.setAttribute("name", nextNameAttribute)

    }); // End of: elementWrapper.querySelectorAll('.resetElement').forEach(function(fieldElement){...}

    previousElementWrapper = elementWrapper;

  }); // End of: groupWrapper.querySelectorAll('.elementWrapper').forEach(function(elementWrapper, wrapperIndex)
} // End of: function renumberNamedElementsInGroupWrapper(groupWrapper){...}
// End of: Define a function which renumbers field names in children objects as we create, move, or delete their element wrappers




// Define a function to check if a string has a number.
function hasANumber(checkString) 
{ 
  let str = String(checkString); 
  
  // Loop through each character of the string.
  for( let i = 0; i < str.length; i++) 
  {
    // If a number is found...
    if(!isNaN(str.charAt(i))) 
    { 
      return true;  
    } 
  } 
  return false; 
}; // End of: Define a function to check if a string has a number.




// Init (bootstrapping)
app.init = function(){

  // Bind all form submissions
  app.bindForms();

  // Load data on page
  app.load${recordObject.tableName}EditPage();
};
// End of: Init (bootstrapping)



// Call the init processes after the window loads.
// This is where it all starts.
window.onload = function(){
  app.init();
};
</script>
`


        // Write out the HTML page to a file.

        let fileExtension = ".html";

        // Call the function which appends a string to a file 
        // then process anonymous callback function defined here.
        meta.append
        (
          recordObject.directory, 
          recordObject.tableName + "Edit", 
          fileExtension,
          htmlString, 
          function(err)
          {
            if (!err) // The html string was written successfully to a file.
            {
              helpers.log
              (
              5,
              'uf3z3xrznbquiy9dqecz' + '\n' +
              'The web page ' + recordObject.tableName + "Edit" + '.html was written successfully to a file.' + '\n'                                      
              ); // End of: helpers.log(...)
            }
            else // There was an error writing the HTML string to a file.
            {
              helpers.log
              (
              7,
              '6f3z3xrzdbquiy9dqeci' + '\n' +
              'There was an error writing the html string to a file' + '\n'
              ); // End of: helpers.log(...)
            } // End of: else there was an error writing the HTML string to a file.
          } // End of: callback function(err){...}
        ); // End of: _data.append(...)


      }; // End of: writable.write = function(payload){...}

      // Passes the payload stream to the writable object which calls writable.write 
      // which does something useful with the payload.
      pipeline
      (
        payload,
        writable,
        function(pipelineError)
        {
          if(pipelineError)
          {
            helpers.log // Log the error.
            (
              7,
              'dfygxqkxg2am4df6ozzl' + '\n' + 
              'Pipeline error. The message was as follows' + '\n' +                                             
              pipelineError + '\n'                                                 
            ); // End of: helpers.log // Log the error.
          } // End of: if(pipelineError){...}
        } // End of: function(piplineError){...}
      ); // End of: Pipeline
    } // End of: if(!error) Got the most recent record from getMostRecent
    else // There was indeed an error returned by getMostRecent when attempting to get the most current record.
    {
      helpers.log // Log the error.
      (
        7,
        'gxpa2m2t2psewrd1d1u7' + '\n' + 
        'The following was the error message from getMostRecent:' + '\n' +                                             
        errorFromGetMostRecent + '\n'                                                 
      ); // End of: helpers.log // Log the error.
    } // End of: Else // There was indeed an error returned by getHashedPass when attempting to get the most current record. 
  }); //End of: helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)  
}// End of: meta.build.editWebPage = function(metadataId){...}




// Define a function to make HTML text for data entry controls on the addPage.
meta.makeAddPageElementHtml = function(elementName, recordObject)
{
  // Declare the variable to hold the HTML code that we are putting together.
  // This will get passed back to the calling function.
  let elementString = "";  

  // If we encounter a formElement which contains more form elements then 
  // make an HTML container and create HTML for the sub elements.
  if(recordObject.webPages.addPage.forms.addForm.formElements[elementName][elementName + "0"])
  {
    // Add a label to the object container if one was provided.
    if(recordObject.webPages.addPage.forms.addForm.formElements[elementName].labelText)
    {
      elementString = elementString +
      "    <div class=\"objectLabel\">" + recordObject.webPages.addPage.forms.addForm.formElements[elementName].labelText + "</div>" + "\n" +
      "    <div class=\"objectWrapper groupWrapper\">" + "\n" +
      "      <div class=\"objectWrapper elementWrapper\">" + "\n";      
    }
    else // No label was provided in the data dictionary for the object container so leave it blank.
    {
      elementString = elementString +
      "    <div class=\"objectWrapper\">" + "\n";
    }
    
    // Declare a function that we will use to drill into the object and make HTML as we traverse the branches.
    function drillIntoObject(formElementObj, objKey, fieldsObject, objectNestLevel, previousPath)
    {
      // Check each property of the container object to see if any are also containers.
      for (let property in formElementObj[objKey][objKey + "0"])
      {
        // Only work with properties which are objects or are at the end of a branch.
        if(typeof formElementObj[objKey][objKey + "0"][property] != 'object'){continue;}

        // If the property is also a container.
        if (formElementObj[objKey][objKey + "0"][property][property + "0"])
        {
          // A label on numbered container objects interferes with the operation of the up and down controls.
          // Checking that a label exists for this property and that the property key does not contain a number.
          if(formElementObj[objKey][objKey + "0"][property].labelText && !helpers.hasANumber(property))
          {
            // objectNestLevel handles indentation as we make HTML for the addPage.
            elementString = elementString +
            "    ".repeat(objectNestLevel) + "    <div class=\"objectLabel\">" + formElementObj[objKey][objKey + "0"][property].labelText + "</div>" + "\n";
          }
          
          // Group wrappers should not be applied where the property contains a number.
          if(!helpers.hasANumber(property))
          {
            elementString = elementString +
            "    ".repeat(objectNestLevel) + "    <div class=\"objectWrapper groupWrapper\">" + "\n"; 
            
            elementString = elementString + "  ".repeat(objectNestLevel) +            
            "      ".repeat(objectNestLevel) + "  <div class=\"objectWrapper elementWrapper\">" + "\n";              
          }

          // This function calls itself so as to go deeper into the object
          drillIntoObject(formElementObj[objKey][objKey + "0"], property, fieldsObject[objKey][objKey + "0"], objectNestLevel + 1, previousPath + objKey + "_" + objKey + "0_");

          //// If we were working with a container object then it's time to make buttons.
          if(formElementObj[objKey][objKey + "0"])
          {
            elementString = elementString + 
            "      ".repeat(objectNestLevel) + "      <button type=\"button\" class=\"disabled controlObjectButton moveObjectUpButton blue\" disabled>Move Up</button>"  + "\n" + 
            "      ".repeat(objectNestLevel) + "      <button type=\"button\" class=\"disabled controlObjectButton moveObjectDownButton blue\" disabled>Move Down</button>"  + "\n" + 
            "      ".repeat(objectNestLevel) + "      <button type=\"button\" class=\"disabled controlObjectButton removeObjectButton red\" disabled>Remove</button>"  + "\n" +                         
            "      ".repeat(objectNestLevel) + "    </div>"  + "\n";

            elementString = elementString + "      ".repeat(objectNestLevel) +
            "    <button type=\"button\" class=\"addNewObjectButton\">Add New</button>"  + "\n"; 


            // Close the object container
            elementString = elementString + 
            "        </div>"  + "\n";

          }
          else
          {
            elementString = elementString + 
            "      ".repeat(objectNestLevel) + "    </div>"  + "\n";              
          }

        }
        else // Not a container object. We are at the end of the branch where we encounter a formElement.
        { 
          // Assemble the path through the current object to the current formElement.
          let objectPath = objKey + "_" + objKey + "0_" + property;

          // If the current object is nested then prepend the path to include the parent objects.
          objectPath = previousPath.length === 0 ? objectPath : previousPath + objectPath;             

          // console.log("10. This is the objectPath\n", objectPath, "\n")

          // Now we need to merge the form element with it's default field element.
          // To start, create an object of default elements for the current field.
          let defaultElementsObject = fieldsObject[objKey][objKey + "0"][property].defaultElements[property];

          // console.log("11. This is the defaultElementObject\n", defaultElementsObject, "\n\n");
        
          // Deep merge the defaultElements with formElements - formElements taking precedence.
          let mergedElements = extend(true, defaultElementsObject, formElementObj[objKey][objKey + "0"][property]);

          // console.log("13. These are the mergedElements: ", mergedElements)

          // The next element tag must be built in a loop because we won't know what or 
          // how many attributes there will be. 
          // Also, it is possible that there will be no elementType and/or no attributes 
          // in which case we will need to asign properties and attributes programmatically
          // based on the following properties:  
          // unique, published, and defaultElements.
          // These are the required fields in the data dictionary (metadata.json)
          // The defaultElement's keys must have one at least one object in it's
          // value in order to get on a webpage. The key for this child object 
          // will be the name of a control element such as an input that is placed 
          // on a form. Thats how the field and form element are linked.
          // Usually, the name will be the same as the field but it could be different.
          // This child must also have an elementType property such as "input" or "select".
          // This child must also have an attribute property which contains a value such as
          // "text" or "password" if the default element is an input.
          // That's all we can count on. We may have to figure out what's best
          // from that information.

          // Start by making the HTML for the attributes from the mergedElements object.
          let attributeText = ""; // holds the attribute text for the element tag.

          // Loop through mergedElements.attributes.
          for (let key in mergedElements.attributes) 
          {
            // build HTML for the attribute.
            attributeText = attributeText + 
            " " + key;  
            
            if(mergedElements.attributes[key])
            {
              attributeText = attributeText + 
              "=\"" + mergedElements.attributes[key] + "\"";
            }

          } // End of: Loop through mergedElements.attributes.


          if(mergedElements.elementType === "input")
          {
            // An input element is self closing - it needs the forward slash
            attributeText = attributeText + "/>";
          }
          else if(mergedElements.elementType === "select")
          {
            // The select element is closed with a tag - no closing forward slash needed.
            attributeText = attributeText + ">";
          }

          // console.log("14. The attributeText is:" + "\n", attributeText, "\n");

          elementString = elementString + "    ".repeat(objectNestLevel) +
          "    <div class=\"inputWrapper\">" + "\n";

          // Get the current field with the first letter capitalized.
          // We will use this for the labelText if none was specifed.
          let elementNameInTitleCase = elementName[0].toUpperCase() + elementName.slice(1); 

          // console.log("15. The elementNameInTitleCase is:" + "\n", elementNameInTitleCase, "\n");

          // If we have specified lableText for the element:
          if(mergedElements.labelText)
          {
            // Make the label according the entry in the data dictionary.
            elementString = elementString + "    ".repeat(objectNestLevel) +         
            "      <div class=\"inputLabel\">" + mergedElements.labelText + "</div>" + "\n";        
          }
          else // We did not specify labelText. Make a generic label programmatically.
          {
            elementString = elementString + "    ".repeat(objectNestLevel) + 
            "      <div class=\"inputLabel\">" + elementNameInTitleCase + "</div>" + "\n";
          } // End of: If we have specifed...


          if(mergedElements.elementType === "input")
          {
            // If we have specified attributes for the element:
            if(attributeText.length > 2)
            {
              // Make the element's HTML according the entry in the data dictionary.
              elementString = elementString + "    ".repeat(objectNestLevel) +         
              "      <" + mergedElements.elementType + " class=\"resetElement\" name=\"" + objectPath + "\"" + attributeText + "\n" +
              "    ".repeat(objectNestLevel) + "    </div>"  + "\n";      
            }
            else // We did not specify attributes. Remove code that produces HTML for attributes.
            {
              elementString = elementString + "    ".repeat(objectNestLevel) + 
              "      <" + mergedElements.elementType + " class=\"resetElement\" name=\"" + objectPath + "\"" + ">" + "\n" +
              "    ".repeat(objectNestLevel) + "    </div>"  + "\n";
            } // End of: If we have specifed...
          }
          else if(mergedElements.elementType === "select")
          {
            // If we have specified attributes for the element:
            if(attributeText.length > 2)
            {
              // Make the element's HTML according the entry in the data dictionary.
              elementString = elementString + "    ".repeat(objectNestLevel) +         
              "      <" + mergedElements.elementType + " class=\"resetElement\" name=\"" + objectPath + "\"" + attributeText + "\n";
            }
            else // We did not specify attributes. Remove code that produces HTML for attributes.
            {
              elementString = elementString + "    ".repeat(objectNestLevel) + 
              "      <" + mergedElements.elementType + " class=\"resetElement\" name=\"" + objectPath + "\"" + ">" + "\n";
            } // End of: Else - We did not specify attributes{...}

            let optionText = ""

            // Loop through mergedElements.options
            for (let key in mergedElements.options) 
            {
              // Make the current option HTML for the current form element.
              optionText = optionText + 
              "    ".repeat(objectNestLevel) + "        <option value=\"" + key + "\" style=\"display: list-item;\">" + mergedElements.options[key] + "</option>" + "\n";
            } // End of: Loop through mergedElements.attributes
      
            elementString = elementString + optionText;

            elementString = elementString +
            "    ".repeat(objectNestLevel) + "      </" + mergedElements.elementType + ">" + "\n" +                
            "    ".repeat(objectNestLevel) + "    </div>"  + "\n";
          } // End of: Else If(mergedElements.elementType === "select"){...}

          // console.log("16. The following is the elementString: " + "\n", elementString, "\n");

        } // End of: else - This property is not an object.
      } // End of: for-let Check each property of the subobject to see if it too is an object.
    }; // End of: function drillIntoObject(obj, objKey, previousObjKey, previousKeyPart){...}
    
    // Keep track of how deep we have drilled into the object.
    let objectNestLevel = 1;

    // Call the function defined above. 
    // This function will call itself several times if drilling into nested objects is required.
    drillIntoObject(recordObject.webPages.addPage.forms.addForm.formElements, elementName, recordObject.fields, objectNestLevel, "")   


    elementString = elementString + 
    "  ".repeat(objectNestLevel) + "      <button type=\"button\" class=\"disabled controlObjectButton moveObjectUpButton blue\" disabled>Move Up</button>"  + "\n" + 
    "  ".repeat(objectNestLevel) + "      <button type=\"button\" class=\"disabled controlObjectButton moveObjectDownButton blue\" disabled>Move Down</button>"  + "\n" + 
    "  ".repeat(objectNestLevel) + "      <button type=\"button\" class=\"disabled controlObjectButton removeObjectButton red\" disabled>Remove</button>"  + "\n" +                         
    "  ".repeat(objectNestLevel) + "    </div>"  + "\n";

    elementString = elementString + "  ".repeat(objectNestLevel) +
    "    <button type=\"button\" class=\"addNewObjectButton\">Add New</button>"  + "\n";    
    
    // Close the object container
    elementString = elementString + 
    "    </div>"  + "\n";    

    // console.log("17. The following is the elementString: " + "\n", elementString, "\n");
            
    return elementString;  
    
  }
  else // The formElement is not an object but rather an input, select, or textarea.
  { 


    // Start of: Create one defaultElements object combining the key/value pairs of all the defaultElements objects that might exist in a table.

    // These defaultElements may not have the same name as the table fields.
    // For instance: The "hashedPassword" field in the user file is fed from the "password" defaultElement.
    // We do this because the password is hashed before it is written to the table. 
    // hashedPassword is a calculated field. It is not fed directly from the user's input.
    // So first make an array of the field names.
    let keysOfFieldsArray = Object.keys(recordObject.fields);

    // console.log("2. The keysOfFieldsArray is: ", keysOfFieldsArray, "\n"); 

    // Make a single object containing the key/value pairs found inside the defaultElements of each field.
    let combinedDefaultElementsObject = {};

    // There may be more than one default element for each field 
    // (Consider velocity calculated from both time and distance elements.) 
    // Or there may be no default elements for a field in which case they can still 
    // be assigned later in the formElements object if desired.
    // So loop through keysOfFieldsArray add key/value pairs found in the defaultElements 
    // object of each field and add them to combinedDefaultElementObject.
    keysOfFieldsArray.forEach(function (keysOfFieldsArrayElementValue)
    {
      // Create an object of default elements for the current field.
      let defaultElementsObject = recordObject.fields[keysOfFieldsArrayElementValue].defaultElements;

      // Loop through defaultElementsObject.
      for (let key in defaultElementsObject) 
      {
        // Grab each defaultElement and copy to an object which will hold all defaultElements for the table.
        combinedDefaultElementsObject[key] = defaultElementsObject[key];
      }

    }); // End of: keysOfFieldsArray.forEach(function (elementValue, elementIndex, keysOfFieldsArray)
    // End of: Create one combinedDefaultElementsObject object combining the key/value pairs of all the defaultElements objects that might exist for each field.      
    
    // console.log("3. The combinedDefaultElementsObject is:" + "\n", combinedDefaultElementsObject, "\n");

    // Deep merge the defaultElements with formElements - formElements taking precedence.
    let mergedElements = extend(true, combinedDefaultElementsObject[elementName], recordObject.webPages.addPage.forms.addForm.formElements[elementName]);

    // Now we have enough information to build the input elements for the webpage.
    
    // console.log("5. The mergedElements are as follows: " + "\n", mergedElements, "\n");  

    // Start by making the HTML for the attributes from the mergedElements object.
    let attributeText = ""; // holds the attribute text for the element tag.

    // Loop through mergedElements.attributes
    for (let key in mergedElements.attributes) 
    {
      // Make the attribute HTML for the current form element.
      attributeText = attributeText + 
      " " + key;  
      
      if(mergedElements.attributes[key])
      {
        attributeText = attributeText + 
        "=\"" + mergedElements.attributes[key] + "\"";
      }

    } // End of: Loop through mergedElements.attributes


    if(mergedElements.elementType === "input")
    {
      // An input element is self closing - it needs the forward slash
      attributeText = attributeText + "/>";
    }
    else if(mergedElements.elementType === "select")
    {
      // The select element is closed with a tag - no closing forward slash needed.
      attributeText = attributeText + ">";
    }

    // console.log("6. The attributeText is:" + "\n", attributeText, "\n");

    elementString = 
    "    <div class=\"inputWrapper\">" + "\n";

    // Get the current field with the first letter capitalized.
    // We will use this for the labelText if none was specifed.
    let elementNameInTitleCase = elementName[0].toUpperCase() + elementName.slice(1); 

    // console.log("7. The elementNameInTitleCase is:" + "\n", elementNameInTitleCase, "\n");

    // If we have specified lableText for the element:
    if(mergedElements.labelText)
    {
      // Make the label according the entry in the data dictionary.
      elementString = elementString +         
      "      <div class=\"inputLabel\">" + mergedElements.labelText + "</div>" + "\n";        
    }
    else // We did not specify labelText. Make a generic label programmatically.
    {
      elementString = elementString + 
      "      <div class=\"inputLabel\">" + elementNameInTitleCase + "</div>" + "\n";
    } // End of: If we have specifed...


    if(mergedElements.elementType === "input")
    {
      // If we have specified attributes for the element:
      if(attributeText.length > 2)
      {
        // Make the element's HTML according the entry in the data dictionary.
        elementString = elementString +         
        "      <" + mergedElements.elementType + " name=\"" + elementName + "\"" + attributeText + "\n" +
        "    </div>"  + "\n";      
      }
      else // We did not specify attributes. Remove and code that produces HTML for attributes.
      {
        elementString = elementString + 
        "      <" + mergedElements.elementType + " name=\"" + elementName + "\"" + ">" + "\n" +
        "    </div>"  + "\n";
      } // End of: If we have specifed...
    }
    else if(mergedElements.elementType === "select")
    {
      // If we have specified attributes for the element:
      if(attributeText.length > 2)
      {
        // Make the element's HTML according the entry in the data dictionary.
        elementString = elementString +         
        "      <" + mergedElements.elementType + " name=\"" + elementName + "\"" + attributeText + "\n";     
      }
      else // We did not specify attributes. Remove and code that produces HTML for attributes.
      {
        elementString = elementString + 
        "      <" + mergedElements.elementType + " name=\"" + elementName + "\"" + ">" + "\n";

      } // End of: Else - We did not specify attributes{...}

      let optionText = ""

      // Loop through mergedElements.options
      for (let key in mergedElements.options) 
      {
        // Make the current option HTML for the current form element.
        optionText = optionText + 
        "        <option value=\"" + key + "\" style=\"display: list-item;\">" + mergedElements.options[key] + "</option>" + "\n";
      } // End of: Loop through mergedElements.attributes

      elementString = elementString + optionText;

      elementString = elementString + 
      "      </" + mergedElements.elementType + ">" + "\n" +      
      "    </div>"  + "\n";
    } // End of: Else If(mergedElements.elementType === "select"){...}

    // console.log("8. The following is the elementString: " + "\n", elementString, "\n");

    return elementString;  
  } // End of: else - the formElement is not an object but rather an input, select, or textarea.
}; // End of: meta.makeAddPageElementHtml = function(elementName, recordObject)
// End of: Define a function to make HTML text for data entry controls on the AddPage



// Define a function to generate HTML text for data entry controls on the edit page.
meta.makeEditPageElementHtml = function(key, recordObject)
{
  // console.log("1. The key is: ", key, "\n");

  // Declare the variables to hold the HTML code that we are putting together.
  // These will get passed back to the calling function.
  let combinedElementsString = ""
  let elementString = ""; 
  let keysOfFormElementsArray = undefined;

  // Checking something is there. Otherwise Object.keys() will throw an error.
  if(recordObject.webPages.editPage.forms[key].formElements)
  {
    // Make an array from keys the in the formElements object. 
    // This is used to deep merge defaultElements with formElements.     
    keysOfFormElementsArray = Object.keys(recordObject.webPages.editPage.forms[key].formElements);
  }

  // If no form elements were specified for this form in the data dictionary (metadata.json)
  // then return an empty string.
  if(!keysOfFormElementsArray){return "";} 

  // console.log("4. The keysOfFormElementsArray is/are : ", keysOfFormElementsArray, "\n");

  // Deep merge the defaultElements with formElements - formElements taking precedence.
  keysOfFormElementsArray.forEach(function (elementValue)
  {
    // If we encounter a formElement which is an object then make an HTML container and create HTML for the sub elements.
    // if(recordObject.webPages.editPage.forms[key].formElements[elementValue].subObject)
    if(recordObject.webPages.editPage.forms[key].formElements[elementValue][elementValue + 0])
        {
      // Add a label to the object container if one was provided.
      if(recordObject.webPages.editPage.forms[key].formElements[elementValue].labelText)
      {
        elementString =
        "    <div class=\"objectLabel\">" + recordObject.webPages.editPage.forms[key].formElements[elementValue].labelText + "</div>" + "\n" +
        "    <div class=\"objectWrapper groupWrapper\">" + "\n" +
        "      <div class=\"objectWrapper elementWrapper\">" + "\n";        
      }
      else // No label was provided in the data dictionary for the object container so leave it blank.
      {
        elementString =
        "    <div class=\"objectWrapper\">" + "\n";       
      }
      
      // Declare a function that we will use to drill into the object and make HTML as we traverse the branches.
      function drillIntoObject(formElementObj, objKey, fieldsObject, objectNestLevel, previousPath)
      {    
        // Check each property of the container object to see if any are also containers.
        for (let property in formElementObj[objKey][objKey + "0"])
        {
          // Only work with properties which are objects or are at the end of a branch.
          if(typeof formElementObj[objKey][objKey + "0"][property] != 'object'){continue;}

          // If the property is also a container.
          if (formElementObj[objKey][objKey + "0"][property][property + "0"])
          {
            // A label on numbered container objects interferes with the operation of the up and down controls.
            // Checking that a label exists for this property and that the property key does not contain a number.
            if(formElementObj[objKey][objKey + "0"][property].labelText && !helpers.hasANumber(property))
            {
              // objectNestLevel handles indentation as we make HTML for the editPage. 
              elementString = elementString +
              "    ".repeat(objectNestLevel) + "    <div class=\"objectLabel\">" + formElementObj[objKey][objKey + "0"][property].labelText + "</div>" + "\n";
            }


            // Group wrappers should not be applied where the property contains a number.
            if(!helpers.hasANumber(property))
            {
              elementString = elementString +
              "    ".repeat(objectNestLevel) + "    <div class=\"objectWrapper groupWrapper\">" + "\n"; 
              
              elementString = elementString + "  ".repeat(objectNestLevel) +
              "      ".repeat(objectNestLevel) + "  <div class=\"objectWrapper elementWrapper\">" + "\n";            
            }


            // This function calls itself so as to go deeper into the object
            drillIntoObject(formElementObj[objKey][objKey + "0"], property, fieldsObject[objKey][objKey + "0"], objectNestLevel + 1, previousPath + objKey + "_" + objKey + "0_");


            // If stripping the last character presumably a zero from property gives the objectKey then it's time to make buttons.
            if(formElementObj[objKey][objKey + "0"])
            {
              elementString = elementString + 
              "      ".repeat(objectNestLevel) + "      <button type=\"button\" class=\"disabled controlObjectButton moveObjectUpButton blue\" disabled>Move Up</button>"  + "\n" + 
              "      ".repeat(objectNestLevel) + "      <button type=\"button\" class=\"disabled controlObjectButton moveObjectDownButton blue\" disabled>Move Down</button>"  + "\n" + 
              "      ".repeat(objectNestLevel) + "      <button type=\"button\" class=\"disabled controlObjectButton removeObjectButton red\" disabled>Remove</button>"  + "\n" +                         
              "      ".repeat(objectNestLevel) + "    </div>"  + "\n";
  
              elementString = elementString + "      ".repeat(objectNestLevel) +
              "    <button type=\"button\" class=\"addNewObjectButton\">Add New</button>"  + "\n"; 


              // Close the object container
              elementString = elementString + 
              "        </div>"  + "\n";
            }
            else
            {
              elementString = elementString + 
              "      ".repeat(objectNestLevel) + "    </div>"  + "\n";              
            }

          }
          else // Not a container object. We are at the end of the branch where we encounter a formElement.
          { 
            // Assemble the path through the current object to the current formElement.
            let objectPath = objKey + "_" + objKey + "0_" + property;

            // If the current object is nested then prepend the path to include the parent objects.
            objectPath = previousPath.length === 0 ? objectPath : previousPath + objectPath;             

            // console.log("10. This is the objectPath\n", objectPath, "\n")

            // Now we need to merge the form element with it's default field element.
            // To start, create an object of default elements for the current field.
            let defaultElementsObject = fieldsObject[objKey][objKey + "0"][property].defaultElements[property];

            // console.log("11. This is the defaultElementsObject\n", defaultElementsObject, "\n\n");
          
            // Deep merge the defaultElements with formElements - formElements taking precedence.
            let mergedElements = extend(true, defaultElementsObject, formElementObj[objKey][objKey + "0"][property]);
            
            // console.log("13. These are the mergedElements: ", mergedElements)

            // The next element tag must be built in a loop because we won't know what or 
            // how many attributes there will be. 
            // Also, it is possible that there will be no elementType and/or no attributes 
            // in which case we will need to asign properties and attributes programmatically
            // based on the following properties:  
            // unique, published, and defaultElements.
            // These are the required fields in the data dictionary (metadata.json)
            // The defaultElement's keys must have one at least one object in it's
            // value in order to get on a webpage. The key for this child object 
            // will be the name of a control element such as an input that is placed 
            // on a form. Thats how the field and form element are linked.
            // Usually, the name will be the same as the field but it could be different.
            // This child must also have an elementType property such as "input" or "select".
            // This child must also have an attribute property which contains a value such as
            // "text" or "password" if the default element is an input.
            // That's all we can count on. We may have to figure out what's best
            // from that information.

            // Start by making the HTML for the attributes from the mergedElements object.
            let attributeText = ""; // holds the attribute text for the element tag.

            // Loop through mergedElements.attributes and generate HTML
            for (let key in mergedElements.attributes) 
            {
              attributeText = attributeText + 
              " " + key;  
              
              if(mergedElements.attributes[key])
              {
                attributeText = attributeText + 
                "=\"" + mergedElements.attributes[key] + "\"";
              }

            } // End of: Loop through mergedElements.attributes...


            if(mergedElements.elementType === "input")
            {
              // An input element is self closing - it needs the forward slash
              attributeText = attributeText + "/>";
            }
            else if(mergedElements.elementType === "select")
            {
              // The select element is closed with a tag - no closing forward slash needed.
              attributeText = attributeText + ">";
            }

            // console.log("14. The attributeText is:" + "\n", attributeText, "\n");

            elementString = elementString + "    ".repeat(objectNestLevel) +
            "    <div class=\"inputWrapper\">" + "\n";

            // Get the current field with the first letter capitalized.
            // We will use this for the labelText if none was specifed.
            let elementNameInTitleCase = elementValue[0].toUpperCase() + elementValue.slice(1); 

            // console.log("15. The elementNameInTitleCase is:" + "\n", elementNameInTitleCase, "\n");

            // If we have specified lableText for the element:
            if(mergedElements.labelText)
            {
              // Make the label according the entry in the data dictionary.
              elementString = elementString + "    ".repeat(objectNestLevel) +         
              "      <div class=\"inputLabel\">" + mergedElements.labelText + "</div>" + "\n";        
            }
            else // We did not specify labelText. Make a generic label programmatically.
            {
              elementString = elementString + "    ".repeat(objectNestLevel) + 
              "      <div class=\"inputLabel\">" + elementNameInTitleCase + "</div>" + "\n";
            } // End of: If we have specified lableText for the element:


            if(key === "editForm") // We are building HTML for the editForm on the editPage.
            {
              if(mergedElements.elementType === "input")
              {
                // If we have specified attributes for the element:
                if(attributeText.length > 2)
                {
                  elementString = elementString + "    ".repeat(objectNestLevel) +       
                  "      <" + mergedElements.elementType + " class=\"resetElement " + objectPath + "Input\" name=\"" + objectPath + "\"" + attributeText + "\n" +
                  "    ".repeat(objectNestLevel) + "    </div>"  + "\n";
                }
                else // We did not specify attributes. Remove code that produces HTML for attributes.
                {
                  // The code below is orginal code for this section. It shows us that the class attribute matters. It has been changed to eliminte attributes.
                  elementString = elementString + "    ".repeat(objectNestLevel) +       
                  "      <" + mergedElements.elementType + " class=\"resetElement " + objectPath + "Input\" name=\"" + objectPath + "\"" + ">" + "\n" +
                  "    ".repeat(objectNestLevel) + "    </div>"  + "\n";
                } // End of: Else - we have not specifed attributes
              }
              else if(mergedElements.elementType === "select")
              {
                // If we have specified attributes for the element:
                if(attributeText.length > 2)
                {
                  // Make the element's HTML according the entry in the data dictionary.
                  elementString = elementString + "    ".repeat(objectNestLevel) +         
                  "      <" + mergedElements.elementType + " class=\"resetElement " + objectPath + "Input\" name=\"" + objectPath + "\"" + attributeText + "\n";
                  // The code above is from makeAddPage. It tells us how to make HTML for select elements with attributes.
                }
                else // We did not specify attributes. Remove code that produces HTML for attributes.
                {
                  elementString = elementString + "    ".repeat(objectNestLevel) + 
                  "      <" + mergedElements.elementType + " class=\"resetElement " + objectPath + "Input\" name=\"" + objectPath + "\"" + ">" + "\n";
                } // End of: Else - We did not specify attributes{...}
  
                let optionText = ""
  
                // Loop through mergedElements.options
                for (let key in mergedElements.options) 
                {
                  // Make the current option HTML for the current form element.
                  optionText = optionText + 
                  "    ".repeat(objectNestLevel) + "        <option value=\"" + key + "\" style=\"display: list-item;\">" + mergedElements.options[key] + "</option>" + "\n";
                } // End of: Loop through mergedElements.attributes
          
                elementString = elementString + optionText;
  
                elementString = elementString +
                "    ".repeat(objectNestLevel) + "      </" + mergedElements.elementType + ">" + "\n" +                
                "    ".repeat(objectNestLevel) + "    </div>"  + "\n";
              } // End of: Else If(mergedElements.elementType === "select"){...}

            }
            else // We are building HTML for a special form on the editPage such as perhaps the passwordForm for changing passwords.
            {
              if(mergedElements.elementType === "input")
              {
                // If we have specified attributes for the element:
                if(attributeText.length > 2)
                {
                  elementString = elementString + "    ".repeat(objectNestLevel) +       
                  "      <" + mergedElements.elementType + " name=\"" + objectPath + "\"" + attributeText + "\n" +
                  "    ".repeat(objectNestLevel) + "    </div>"  + "\n";
                }
                else // We did not specify attributes. Remove code that produces HTML for attributes.
                {
                  // The code below is orginal code for this section. It shows us that the class attribute matters. It has been changed to eliminte attributes.
                  elementString = elementString + "    ".repeat(objectNestLevel) +       
                  "      <" + mergedElements.elementType + " name=\"" + objectPath + "\"" + ">" + "\n" +
                  "    ".repeat(objectNestLevel) + "    </div>"  + "\n";
                } // End of: Else - we have not specifed attributes
              }
              else if(mergedElements.elementType === "select")
              {
                // If we have specified attributes for the element:
                if(attributeText.length > 2)
                {
                  // Make the element's HTML according the entry in the data dictionary.
                  elementString = elementString + "    ".repeat(objectNestLevel) +         
                  "      <" + mergedElements.elementType + " name=\"" + objectPath + "\"" + attributeText + "\n";
                  // The code above is from makeAddPage. It tells us how to make HTML for select elements with attributes.
                }
                else // We did not specify attributes. Remove code that produces HTML for attributes.
                {
                  elementString = elementString + "    ".repeat(objectNestLevel) + 
                  "      <" + mergedElements.elementType + " name=\"" + objectPath + "\"" + ">" + "\n";
                } // End of: Else - We did not specify attributes{...}
  
                let optionText = ""
  
                // Loop through mergedElements.options
                for (let key in mergedElements.options) 
                {
                  // Make the current option HTML for the current form element.
                  optionText = optionText + 
                  "    ".repeat(objectNestLevel) + "        <option value=\"" + key + "\" style=\"display: list-item;\">" + mergedElements.options[key] + "</option>" + "\n";
                } // End of: Loop through mergedElements.attributes
          
                elementString = elementString + optionText;
  
                elementString = elementString +
                "    ".repeat(objectNestLevel) + "      </" + mergedElements.elementType + ">" + "\n" +                
                "    ".repeat(objectNestLevel) + "    </div>"  + "\n";
              } // End of: Else If(mergedElements.elementType === "select"){...}

            } // End of: Else - we are building HTML for a special form on the editPage

            // console.log("16. The following is the elementString: " + "\n", elementString, "\n");

          } // End of: else - This property is not an object.
        } // End of: for-let Check each property of the subobject to see if it too is an object.

      }; // End of: function drillIntoObject(obj, objKey, previousObjKey, previousKeyPart){...}
      
      // Keep track of how deep we have drilled into the object.
      let objectNestLevel = 1;   

      // Call the function defined above. 
      // This function will call itself several times if drilling into nested objects is required.
      drillIntoObject(recordObject.webPages.editPage.forms[key].formElements, elementValue, recordObject.fields, objectNestLevel, "")

      elementString = elementString + 
      "  ".repeat(objectNestLevel) + "      <button type=\"button\" class=\"disabled controlObjectButton moveObjectUpButton blue\" disabled>Move Up</button>"  + "\n" + 
      "  ".repeat(objectNestLevel) + "      <button type=\"button\" class=\"disabled controlObjectButton moveObjectDownButton blue\" disabled>Move Down</button>"  + "\n" + 
      "  ".repeat(objectNestLevel) + "      <button type=\"button\" class=\"disabled controlObjectButton removeObjectButton red\" disabled>Remove</button>"  + "\n" +                         
      "  ".repeat(objectNestLevel) + "    </div>"  + "\n";

      elementString = elementString + "  ".repeat(objectNestLevel) +
      "    <button type=\"button\" class=\"addNewObjectButton\">Add New</button>"  + "\n";    

      // Close the object container
      elementString = elementString + 
      "    </div>"  + "\n";      
              
    }
    else // The formElement is not an object but rather an input, select, or textarea.
    { 

      // Start of: Create one defaultElements object combining the key/value pairs of all the defaultElements objects that might exist in a table.

      // These defaultElements may not have the same name as the table fields.
      // For instance: The "hashedPassword" field in the user file is fed from the "password" defaultElement.
      // We do this because the password is hashed before it is written to the table. 
      // hashedPassword is a calculated field. It is not fed directly from the user's input.
      // So first make an array of the field names.
      let keysOfFieldsArray = Object.keys(recordObject.fields);

      // console.log("2. The keysOfFieldsArray is: ", keysOfFieldsArray, "\n"); 

      // Make a single object containing the key/value pairs found inside the defaultElements of each field.
      let combinedDefaultElementsObject = {};

      // There may be more than one default element for each field 
      // (Consider velocity calculated from both time and distance elements.) 
      // Or there may be no default elements for a field in which case they can still 
      // be assigned later in the formElements object if desired.
      // So loop through keysOfFieldsArray add key/value pairs found in the defaultElements 
      // object of each field and add them to combinedDefaultElementObject.
      keysOfFieldsArray.forEach(function (keysOfFieldsArrayElementValue)
      {
        // Create an object of default elements for the current field.
        let defaultElementsObject = recordObject.fields[keysOfFieldsArrayElementValue].defaultElements;

        // Loop through defaultElementsObject.
        for (let key in defaultElementsObject) 
        {
          // Grab each defaultElement and copy to an object which will hold all defaultElements for the table.
          combinedDefaultElementsObject[key] = defaultElementsObject[key];
        }

      }); // End of: keysOfFieldsArray.forEach(function (elementValue, elementIndex, keysOfFieldsArray)
      // End of: Create one combinedDefaultElementsObject object combining the key/value pairs of all the defaultElements objects that might exist for each field.      
      
      // console.log("3. The combinedDefaultElementsObject is:" + "\n", combinedDefaultElementsObject, "\n");

      // Deep merge the defaultElements with formElements - formElements taking precedence.
      let mergedElements = extend(true, combinedDefaultElementsObject[elementValue], recordObject.webPages.editPage.forms[key].formElements[elementValue]);

      // Now we have enough information to build the input elements for the webpage.
      
      // console.log("5. The mergedElements are as follows: " + "\n", mergedElements, "\n");  

      // Start by making the HTML for the attributes from the mergedElements object.
      let attributeText = ""; // holds the attribute text for the element tag.

      // Loop through mergedElements.attributes and generate HTML for the form controls.
      for (let key in mergedElements.attributes) 
      {
      
        attributeText = attributeText + 
        " " + key;  
        
        if(mergedElements.attributes[key])
        {
          attributeText = attributeText + 
          "=\"" + mergedElements.attributes[key] + "\"";
        }

      } // End of: Loop through mergedElements.attributes...


      if(mergedElements.elementType === "input")
      {
        // An input element is self closing - it needs the forward slash
        attributeText = attributeText + "/>";
      }
      else if(mergedElements.elementType === "select")
      {
        // The select element is closed with a tag - no closing forward slash needed.
        attributeText = attributeText + ">";
      }

      // console.log("6. The attributeText is:" + "\n", attributeText, "\n");

      elementString = 
      "    <div class=\"inputWrapper\">" + "\n";

      // Get the current field with the first letter capitalized.
      // We will use this for the labelText if none was specifed.
      let elementValueInTitleCase = elementValue[0].toUpperCase() + elementValue.slice(1); 

      // console.log("7. The elementValueInTitleCase is:" + "\n", elementValueInTitleCase, "\n");

      // If we have specified lableText for the element:
      if(mergedElements.labelText)
      {
        // Make the label according the entry in the data dictionary.
        elementString = elementString +         
        "      <div class=\"inputLabel\">" + mergedElements.labelText + "</div>" + "\n";        
      }
      else // We did not specify labelText. Make a generic label programmatically.
      {
        elementString = elementString + 
        "      <div class=\"inputLabel\">" + elementValueInTitleCase + "</div>" + "\n";
      } // End of: If we have specifed labelText for the element


      if(key === "editForm") // We are building HTML for the editForm on the editPage.
      {
        if(mergedElements.elementType === "input")
        {
          // If we have specified attributes for the element:
          if(attributeText.length > 2)
          {
            // Make the element's HTML according the entry in the data dictionary.            
            elementString = elementString +           
            "      <" + mergedElements.elementType + " class=\"" + elementValue + "Input\" name=\"" + elementValue + "\"" + attributeText + "\n" +
            "    </div>"  + "\n";    
          }
          else // We did not specify attributes. Remove and code that produces HTML for attributes.
          {
            // Keep this after making changes.
            elementString = elementString +           
            "      <" + mergedElements.elementType + " class=\"" + elementValue + "Input\" name=\"" + elementValue + "\"" + ">" + "\n" +
            "    </div>"  + "\n";
          } // End of: If we have specifed...
        }
        else if(mergedElements.elementType === "select")
        {
          // If we have specified attributes for the element:
          if(attributeText.length > 2)
          {
            // Build the select element HTML tag with attributes specified in the data dictionary
            elementString = elementString +         
            "      <" + mergedElements.elementType + " class=\"" + elementValue + "Input\" name=\"" + elementValue + "\"" + attributeText + "\n";     
          }
          else // We did not specify attributes. Remove and code that produces HTML for attributes.
          {

            // Build the select element HTML tag when no attributes are specified in the data dictionary
            elementString = elementString +         
            "      <" + mergedElements.elementType + " class=\"" + elementValue + "Input\" name=\"" + elementValue + "\"" + ">" + "\n";

          } // End of: Else - We did not specify attributes{...}
    
          let optionText = ""
    
          // Loop through mergedElements.options
          for (let key in mergedElements.options) 
          {
            // Make the current option HTML for the current form element.
            optionText = optionText + 
            "        <option value=\"" + key + "\" style=\"display: list-item;\">" + mergedElements.options[key] + "</option>" + "\n";
          } // End of: Loop through mergedElements.attributes
    
          elementString = elementString + optionText;
    
          elementString = elementString + 
          "      </" + mergedElements.elementType + ">" + "\n" +      
          "    </div>"  + "\n";
        } // End of: Else If(mergedElements.elementType === "select"){...}

      }
      else // We are building HTML for a special form on the editPage such as perhaps the passwordForm for changing passwords.
      {
        if(mergedElements.elementType === "input")
        {
          // If we have specified attributes for the element:
          if(attributeText.length > 2)
          {
            // Make the element's HTML according the entry in the data dictionary.            
            elementString = elementString +           
            "      <" + mergedElements.elementType + " name=\"" + elementValue + "\"" + attributeText + "\n" +
            "    </div>"  + "\n";    
          }
          else // We did not specify attributes. Remove and code that produces HTML for attributes.
          {
            // Keep this after making changes.
            elementString = elementString +           
            "      <" + mergedElements.elementType + " name=\"" + elementValue + "\"" + ">" + "\n" +
            "    </div>"  + "\n";
          } // End of: If we have specifed...
        }
        else if(mergedElements.elementType === "select")
        {
          // If we have specified attributes for the element:
          if(attributeText.length > 2)
          {
            // Build the select element HTML tag with attributes specified in the data dictionary
            elementString = elementString +         
            "      <" + mergedElements.elementType + " name=\"" + elementValue + "\"" + attributeText + "\n";     
          }
          else // We did not specify attributes. Remove and code that produces HTML for attributes.
          {

            // Build the select element HTML tag when no attributes are specified in the data dictionary
            elementString = elementString +         
            "      <" + mergedElements.elementType + " name=\"" + elementValue + "\"" + ">" + "\n";

          } // End of: Else - We did not specify attributes{...}
    
          let optionText = ""
    
          // Loop through mergedElements.options
          for (let key in mergedElements.options) 
          {
            // Make the current option HTML for the current form element.
            optionText = optionText + 
            "        <option value=\"" + key + "\" style=\"display: list-item;\">" + mergedElements.options[key] + "</option>" + "\n";
          } // End of: Loop through mergedElements.attributes
    
          elementString = elementString + optionText;
    
          elementString = elementString + 
          "      </" + mergedElements.elementType + ">" + "\n" +      
          "    </div>"  + "\n";
        } // End of: Else If(mergedElements.elementType === "select"){...}
      } // End of: Else - we are building HTML for a special form on the editPage

      // console.log("8. The following is the elementString: " + "\n", elementString, "\n");
  
    } // End of: else - the formElement is not an object but rather an input, select, or textarea.

    combinedElementsString = combinedElementsString +  elementString;
  
  }); // End of: keysOfFormElementsArray.forEach(function (elementValue){...}

  return combinedElementsString; 

}; // End of: meta.makeEditPageElementHtml = function(key, recordObject)
// End of: Define a function to make HTML text for data entry controls.




// Define function to append a string to a file.  
// Create the file if it does not exist.  
meta.append = function(dir, fileName, extension, appendString, callback)
{
  // console.log(meta.baseDir + dir + '/' + fileName + extension)
  // Create a readable stream.
  const sourceStream = new Readable();

  // Load the readable stream with data.
  sourceStream.push(appendString + '\n');

  // Tell the stream no more data is coming.
  sourceStream.push(null);

  // Create a writable stream and specify the file which will receive the data from the readable stream.
  let destinationStream = fs.createWriteStream(meta.baseDir + dir + '/' + fileName + extension, {flags : 'w'});

  pipeline
  (
    sourceStream,
    destinationStream,
    function(error)
    {
      if (!error) // If the string was appended successfully:
      {
        callback(false); // Report back there was no error
      } 
      else // The string was not appended successfully.
      {
        helpers.log
        (
          7,
          'h0fcemkti8xkdkdn4dl9' + '\n' +
          'Error appending to file ' + meta.baseDir + dir + '/' + fileName + extension + '\n' +
          'This was the error:' + '\n' +
          JSON.stringify(error) + '\n'
        );

        callback
        (
          'jd5z9g7dn55v7bpfv3tl' + '\n' +
          'Error appending to file ' + meta.baseDir + dir + '/' + fileName + extension + '\n' +
          'This was the error:' + '\n' +
          JSON.stringify(error)
        );        
      }
    }
  );
}; // End of: meta.append = function(...
// End of: Append a string to a file. 



/*!
 * Thank you Chris Ferdinandi 
 * Merge two or more objects together.
 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param   {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
 * @param   {Object}   objects  The objects to merge together
 * @returns {Object}            Merged values of defaults and options
 * 
 * Use the function as follows:
 * let shallowMerge = extend(obj1, obj2);
 * let deepMerge = extend(true, obj1, obj2)
 */
// Define function for deep merging of objects.
let extend = function () {

	// Variables
	var extended = {};
	var deep = false;
	var i = 0;

	// Check if a deep merge
	if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
	    deep = arguments[0];
	    i++;
	}

	// Merge the object into the extended object
	var merge = function (obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				// If property is an object, merge properties
				if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
					extended[prop] = extend(extended[prop], obj[prop]);
				} else {
					extended[prop] = obj[prop];
				}
			}
		}
	};

	// Loop through each object and conduct a merge
	for (; i < arguments.length; i++) {
		merge(arguments[i]);
	}

	return extended;

}; // End of: // Define function for deep merging of objects.




// Define a function which inserts routes and dependencies into server.js for interacting with the generated code.
// Currently I am doing this manually.
// server.js will be completely built by this function so any changes to server.js must be made here and then
// this function must be run in order to obtain the updated server.js file.
meta.build.routesAndDependencies = function()
{
  // Loop through metadata.json building an array of tables which require routes and dependencies in server.js
  // 1. Build an array of all the primary keys in metadata.json that have not been deleted.
  //   A. Call function readEveryRecordInMetaData.JsonAndGenerateAnArrayOfEveryPrimaryKeyThatHasNotBeenDeletedAndGetTheValueOfaddRoutes.
  //    1. This function is going to be very much like getMostRecent()
  //       The question is, can I use getMost recent to first get an array of all primary keys and then run it again from
  //       inside the function to get the data I am interested in. 
  //       So really what I need to do is run a function similar to the function which lists all records in the get handlers.
  //       Search: async function onClickEventBehaviorOfSubmitQueryButton(event) for example on the client side.

           // The following is kind of what we need to do.
           // Run the query defined in the textarea on the form.
           // This call to the server is used when a sort order IS specified by the user.    
           // let recordsArray = await runQueryWaitForAllData(queryExpression);    
           // I see now from looking at runQueryWaitForAllData() that I need to make a custom api function for metadata.js
           // I wonder if the generator meta.build.serverSideLogic() will work for this.
           // First the will need to be an entry in metadata.js for metadata.js
           // Then lets try running all the builders agains the metadata.json record in the metadata.json table.


} // End of: meta.build.routesAndDependencies = function(){...}




// Export the module
module.exports = meta;