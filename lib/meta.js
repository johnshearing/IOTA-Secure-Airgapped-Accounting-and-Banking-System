/*
/
/ For managing data dictionary and for building the accounting system from metadata.
/ Tables must be named in the singular and in camelCase. "customerOrder not customer_orders"
/ 
/
*/

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



// Define a function which builds server-side handlers that
// contain logic for get, post, and put requests.
meta.build.handlers = function(tableId)
{
  // This object tells the getMostRecent function which record to retrive in the data dictionary (metadata.json)
  let dataObject = {};
  dataObject.uniqueField01Value = ""; // We are not trying to write to the table so no need to enforce uniqueness.
  dataObject.uniqueField01Name = "table.tableName";           
  dataObject.path = '/database/dbMetadata/metadata.json';
  dataObject.queryString = 'WHERE:;tableId:;MatchesExactly:;' + tableId + ':;';  

  let recordObject;
  let htmlString = "";

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

      // Called by pipeline below.
      // Here is where we process the single line of json returned in the payload to make the the handlers.
      writable.write = function(payload)     
      {
        let stringContainer = '';                 
        stringContainer = stringContainer + decoder.write(payload);
        recordObject = JSON.parse(stringContainer);
 
        // All the metadata for the table is in record object.
        // Assemble the webpage string from the metadata in recordObject.

        let tableNameInTitleCase = recordObject.table.tableName[0].toUpperCase() + recordObject.table.tableName.slice(1);   

        // Figure out how many directories deep the table is in relation to the root directory of the application.
        // To do this we count the slashes in the directory path for the table we are handling and add two.
        // Thats's how many instances of "../" we need to add the require string to reach code in the lib directory.
        let nestLevel = recordObject.table.directory.split('/').length + 2;

        let nestString = ""

        for (loopCount = 0; loopCount < nestLevel - 1; loopCount = loopCount + 1) 
        { 
          nestString = nestString + "../";
        }
        // End of: Figure out how many directories deep...


        htmlString = htmlString + 
`
/*
/ Handlers for the "${recordObject.table.tableName}" table.
*/


// Dependencies
const fs = require('fs');
const readline = require('readline');
const { pipeline, Readable, Writable } = require('stream');
const StringDecoder = require('string_decoder').StringDecoder;
const _data = require('${nestString}lib/aData');
const helpers = require('${nestString}lib/aHelpers');


// Create a container for all the handlers
let ${recordObject.table.tableName} = {};




// Define the handler function that serves up the HTML page for searching and listing ${recordObject.table.tableName} records.
${recordObject.table.tableName}.serveListPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : '${tableNameInTitleCase} List',
      'body.class' : '${recordObject.table.tableName}List',     
      'tableName':'${recordObject.table.tableName}',
      "tableLabel":"${tableNameInTitleCase}",    
      'head.clientCode' : '', // The HTML header template must see something or an empty string.         
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/${recordObject.table.directory}/${recordObject.table.tableName}List', templateData, function(errorGetTemplate, str)
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
}; // End of: ${recordObject.table.tableName}.serveListPage = function(data, callback){...}
// End of:// Define the handler function that serves up the HTML page for searching and listing ${recordObject.table.tableName} records.




// Define the handler function that serves up the HTML page for creating new ${recordObject.table.tableName} records.
${recordObject.table.tableName}.serveAddPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : 'Create a New ${tableNameInTitleCase}',
      'head.description' : 'For creating a new ${recordObject.table.tableName} record',
      'body.class' : '${recordObject.table.tableName}Add', 
      'head.clientCode' : '', // The HTML header template must see something or an empty string.      
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/${recordObject.table.directory}/${recordObject.table.tableName}Add', templateData, function(errorGetTemplate, str)
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
}; // End of: ${recordObject.table.tableName}.serveAddPage = function(data, callback){...}
// End of: Define the handler function that serves up the HTML page for creating new ${recordObject.table.tableName} records.




// Define the handler function that serves up the HTML page for editing ${recordObject.table.tableName} records.
${recordObject.table.tableName}.serveEditPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : 'Edit a ${tableNameInTitleCase}',     
      'body.class' : '${recordObject.table.tableName}Edit',
      'selected.${recordObject.table.tableName}Id' : data.queryStringObject.${recordObject.table.tableName}Id,  
      'head.clientCode' : '', // The HTML header template must see something or an empty string.     
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/${recordObject.table.directory}/${recordObject.table.tableName}Edit', templateData, function(errorGetTemplate, str)
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
}; // End of: ${recordObject.table.tableName}.serveEditPage = function(data, callback){...}
// End of: Define the handler function that serves up the HTML page for editing ${recordObject.table.tableName} records.




// Router for ${recordObject.table.tableName} functions
// Define a function which calls the requested get, post, put, or delete subhandler function for ${recordObject.table.tableName} 
// and passes to the chosen subhandler the client's request object and the callback function.
${recordObject.table.tableName}.${recordObject.table.tableName} = function(data, callback)
{
  // Create an array of acceptable methods.
  var acceptableMethods = ['post', 'get', 'put'];

  // if the requested method is one of the acceptable methods:
  if (acceptableMethods.indexOf(data.method) > -1) 
  {
    // then call the appropriate ${recordObject.table.tableName} subhandler.
    ${recordObject.table.tableName}._${recordObject.table.tableName}[data.method](data, callback);
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
}; // End of: ${recordObject.table.tableName}.${recordObject.table.tableName} = function(data, callback){...}
//End of: Router for ${recordObject.table.tableName} functions




// Create a subobject within the handlers object for the ${recordObject.table.tableName} submethods (post, get, put, and delete)
${recordObject.table.tableName}._${recordObject.table.tableName} = {};


`


        // Need to handle multiple unique fields at some time in the future.
        // ??? Will need to return here frequently to copy variables from this area.

        // Creating the PUT handler.
        // Start of: Collect information about the fields.       
        // Create one defaultElements object combining the key/value pairs of all the defaultElements objects that might exist in a table.

        // These defaultElements may not have the same name as the table fields.
        // For instance: The "hashedPassword" field in the user file is fed from the "password" defaultElement.
        // We do this because the password is hashed before it is written to the table. 
        // hashedPassword is a calculated field. It is not fed directly from the user's input.
        // So first make an array of the field names.
        let keysOfFieldsArray = Object.keys(recordObject.fields);
        // console.log("0. This is the keysOfFieldsArray: ",keysOfFieldsArray, "\n\n");    

        // Make a single object containing the key/value pairs found inside the defaultElements of each field.
        let combinedDefaultElementsObject = {};
        
        // There may be more than one default element for each field 
        // (Consider velocity calculated from both time and distance elements.) 
        // So loop through keysOfFieldsArray (the fieldNames) add key/value pairs 
        // found in the defaultElements object of each field and add them to 
        // combinedDefaultElementObject. What we are doing is copying defaultElements 
        // from different branches of the recordObject tree into one new object so that 
        // we can work with them.
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
        // console.log("1. This is the combinedDefaultElementsObject: ",combinedDefaultElementsObject, "\n\n");        
        // End of: Create one combinedDefaultElementsObject object combining the key/value pairs of all the defaultElements objects that might exist for each field.      
        // End of: Collect information about the fields.         


        htmlString = htmlString +
`

// ${recordObject.table.tableName} - post subhandler
// Define the ${recordObject.table.tableName} post subhandler function.
// This function appends a record to the ${recordObject.table.tableName} file.
${recordObject.table.tableName}._${recordObject.table.tableName}.post = function(data, callback)
{
  // Field validation starts here.
`

        // Start of: Insert validation code.
        // 1. Loop through the combinedDefaultElementsObject.
        for (let fieldKey in combinedDefaultElementsObject) 
        {
          // console.log("2. This is combinedDefaultElementsObject[" + fieldKey + "]: " + "\n",combinedDefaultElementsObject[fieldKey], "\n\n");

          htmlString = htmlString +          
          "  // Get " + fieldKey + " from payload;" + "\n" +
          "  let " + fieldKey + " = data.payload." + fieldKey + ";" + "\n" +
          "\n";  


          //????
          // Merge the default validation objects with the post validation objects.
          let mergedValidationObject = extend(true, combinedDefaultElementsObject[fieldKey].validation.default, combinedDefaultElementsObject[fieldKey].validation.post);            
          // console.log("2.5 The mergedValidationObject is:\n", mergedValidationObject, "\n")

          // Loop through the validation property of each field.
          for (let validationKey in mergedValidationObject)
          {
            console.log("3. Below is the value of mergedValidationObject[" + validationKey + "] : \n" , mergedValidationObject[validationKey], "\n\n");            

            if(validationKey === "passIfString")
            {
              // If the user supplied the validation string
              if(mergedValidationObject[validationKey])
              {
                htmlString = htmlString + 
                "  // " + validationKey + "\n" +
                "  " + mergedValidationObject[validationKey] + "\n" +
                "\n";
              }
              else // No user supplied validation. Create a generic validation string.
              {
                htmlString = htmlString +                 
                "  // passIfString Default behavior from meta.js" + "\n" +    
                "  // qif5xwvzgr7efln9xtr8" + "\n" +                            
                "  if (typeof(" + fieldKey + ") != 'string'){return callback(400, {'Error' : '" + fieldKey + " must be of datatype string'});};" + "\n" + 
                "\n";
              }
            }
            else if(validationKey === "passIfNotEmpty")
            {
              // If the user supplied the validation string
              if(mergedValidationObject[validationKey])
              {
                htmlString = htmlString + 
                "  // " + validationKey + "\n" +
                "  " + mergedValidationObject[validationKey] + "\n" +
                "\n";
              }
              else // No user supplied validation. Create a generic validation string.
              {
                htmlString = htmlString + 
                "  // passIfNotEmpty Default behavior from meta.js" + "\n" +
                "  // eojwivwlhxkm1b837n2o" + "\n" +                
                "  if(!" + fieldKey + " || " + fieldKey + ".trim().length === 0){return callback(400, {'Error' : 'No " + fieldKey + " was entered'});}else{" + fieldKey + " = " + fieldKey + ".trim()};" + "\n" +
                "\n";
              }
            }            
            else // Must be user defined.
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
            
          } // End of: for (let validationKey in combinedDefaultElementsObject[validationKey].validation)                    
        } // End of: for (let fieldKey in combinedDefaultElementsObject)       
        // End of: Insert validation code.


        // Start of Enforce unique fields. ???
        // This code can only handle one uniqueId for each table for now. 
        // Later we will update this code to handle as many uniqueIds as may be required.
        // Looks like we just need to put this section of code in a loop.
        // Also we need to handle the possibility that no fields are required to be unique.
        // In that case the loop will not run and the following code will not be inserted.

        // 1. Create an array with all the field names for fields which must be unique.
        let uniqueFieldsArray = [];

        keysOfFieldsArray.forEach(function (elementValue)
        {
          if(recordObject.fields[elementValue].unique === true)
          {
            uniqueFieldsArray.push(elementValue);   
          }
        });
        // console.log("4. These fields are unique keys: ", uniqueFieldsArray, "\n\n");

        // If there are unique key fields then insert code that checks uniqueness of the candidate value.
        if(uniqueFieldsArray.length != 0)
        {
          uniqueFieldInTitleCase = uniqueFieldsArray[0][0].toUpperCase() + uniqueFieldsArray[0].slice(1);

          htmlString = htmlString +
`
  // Enforcing uniqueness of the ${uniqueFieldsArray[0]} field.
  // Will toggle this to false if we find the ${uniqueFieldsArray[0]} already exists in ${recordObject.table.tableName}.
  let ${uniqueFieldsArray[0]}IsUnused = true;

  // Using this to track the primary key of a record that we might encounter with the candidate ${uniqueFieldsArray[0]} address.
  // If we encounter this primary key again we will check to see if the ${uniqueFieldsArray[0]} has been changed.
  // If it has then the candidate ${uniqueFieldsArray[0]} will be marked as available again.
  let uniqueIdOfRecordHoldingCandidate${uniqueFieldInTitleCase} = false; 
                        

  // To ensure the ${uniqueFieldsArray[0]} is unique we will read every record in 
  // ${recordObject.table.tableName} and compare with the ${uniqueFieldsArray[0]} provided.

  // This function sets up a stream where each chunk of data is a complete line in the ${recordObject.table.tableName} file.
  let readInterface = readline.createInterface
  (
    { // specify the file to be read.
      input: fs.createReadStream(_data.baseDir + '/${recordObject.table.directory}' + '/' + '${recordObject.table.tableName}' + '.json')
    }
  );
  
  // Look at each record in the file and set a flag if the ${uniqueFieldsArray[0]} matches the ${uniqueFieldsArray[0]} provided by the user.
  readInterface.on('line', function(line) 
  {
    // Convert the JSON string from ${recordObject.table.tableName} into an object.
    lineObject = JSON.parse(line);

    // Several different record sets with the supplied ${uniqueFieldsArray[0]} and the same ${recordObject.table.tableName}Id 
    // may exist already if the record has been changed or deleted prior to this operation.

    // A modified record is simply a new record with the same ${recordObject.table.tableName}Id as an existing record.
    // The newest record is the valid record and the older record is history.  
    // So position matters. These tables should never be sorted.
    // These tables can be packed however to get rid of historical records.

    // The transaction log also maintains the history and the current state of the entire database.
    // So the transaction log can be used to check the integrity of the every table.
    // No records in the transaction log should be removed.

    // A deleted record in this system is simply an identical record appended with 
    // the deleted field set to true. 
    // So depending on how many times the ${uniqueFieldsArray[0]} has been added and deleted there may 
    // be several sets of records in the ${recordObject.table.tableName} table currently 
    // that have the same ${uniqueFieldsArray[0]} and the same ${recordObject.table.tableName}Id.
    // The table can be packed occasionally to get rid of these deleted record sets. 
    // Deletes are handled as appends with the deleted field set to true because real 
    // deletes tie up the table for a long time.

    // In this table, the ${uniqueFieldsArray[0]} is a unique key as well as the ${recordObject.table.tableName}Id.

    // When adding a record we first make sure that the record does NOT already exist.
    // There should be no record with the current ${uniqueFieldsArray[0]} or if there is then 
    // the last record with this ${uniqueFieldsArray[0]} must have the deleted field set to true.

    // When changing a record we:
    // 1. Make sure that the record with this ${uniqueFieldsArray[0]} does indeed exist and...
    // 2. that the last instance of a record with this ${uniqueFieldsArray[0]} is not deleted.
  
    // It is ok to add a new record with this same ${uniqueFieldsArray[0]} again when the last instance 
    // of this record encountered in the stream has the deleted flag set to true. 
    // In that case, the ${recordObject.table.tableName}Id will be different but the ${uniqueFieldsArray[0]} will be the same.         

    // As explained above, only the last matching record for a particular ${uniqueFieldsArray[0]} matters.
    // It's like that old game "She loves me, She loves me not".

    if (${uniqueFieldsArray[0]} == lineObject.${uniqueFieldsArray[0]}) // we found a matching entry
    {
      if (lineObject.deleted == false) // The record has not been deleted so it's a duplicate. Not unique.
      {
        ${uniqueFieldsArray[0]}IsUnused = false; // This flag used in the on close event listener below. 

        // If this record (record with this primary key) is encountered further down where it has been deleted 
        // or where the ${uniqueFieldsArray[0]} has been changed with a put operation:
        // Then the candidate ${uniqueFieldsArray[0]} will be available again as we continue searching through the records.
        // We are already checking if this ${uniqueFieldsArray[0]} becomes available again by deletion.
        // Now we need to check if the ${uniqueFieldsArray[0]} becomes available because the record with this primary 
        // key gets changed with a new ${uniqueFieldsArray[0]} address.
        // That will make the candidate ${uniqueFieldsArray[0]} unique and available again.
        // So record this global sequential unique id (the ${recordObject.table.tableName}Id in this case).
        // If we find the gsuid again, then check if the ${uniqueFieldsArray[0]} has changed.
        // If it has been changed then:
        // 1. Set the ${uniqueFieldsArray[0]}IsUnused flag to true again
        // 2. clear out the variable tracking the uniqueId of the record.
        uniqueIdOfRecordHoldingCandidate${uniqueFieldInTitleCase} = lineObject.${recordObject.table.tableName}Id;
      }
      // The matching record we found has been deleted so it may as well not exist. The new record is still unique.
      else 
      {
        ${uniqueFieldsArray[0]}IsUnused = true;
      } 
    } // End of: if we found a matching entry

    // If we have seen this primary key before and flagged the ${uniqueFieldsArray[0]} already taken 
    // because it was identical to the ${uniqueFieldsArray[0]} we are trying to add and it had not been deleted:

    // Ok, the current record is not holding the candidate ${uniqueFieldsArray[0]} but 
    // maybe it was in the past and someone changed it.
    // if the candidate ${uniqueFieldsArray[0]} is flagged unavailable and we are looking at the record that was flagged:
    else if(${uniqueFieldsArray[0]}IsUnused === false && uniqueIdOfRecordHoldingCandidate${uniqueFieldInTitleCase} === lineObject.${recordObject.table.tableName}Id)
    {
      // Check if the ${uniqueFieldsArray[0]} is no longer holding the candidate ${uniqueFieldsArray[0]}.
      // If it is not holding the candidate ${uniqueFieldsArray[0]} then flag the ${uniqueFieldsArray[0]} 
      // available again and clear out the variable tracking this primary key.
      ${uniqueFieldsArray[0]}IsUnused = true;
      uniqueIdOfRecordHoldingCandidate${uniqueFieldInTitleCase} = false;
    }

  }); // End of: readInterface.on('line', function(line){...}
  // End of: Look at each record...




  // This listener fires after we have discovered if the ${uniqueFieldsArray[0]} is 
  // unique or not, and have then closed the readable stream from ${recordObject.table.tableName}.
  // The callback function defined here will append the record if the ${uniqueFieldsArray[0]} 
  // was found to be unique.
  readInterface.on('close', function() 
  {
    // If the ${uniqueFieldsArray[0]} already exists then exit this process without appending the record.
    if (!${uniqueFieldsArray[0]}IsUnused) 
    {      
      helpers.log
      (
        5,
        '${helpers.createRandomString(20)}' + '\\n' +
        'The ${uniqueFieldsArray[0]} address: ' + ${uniqueFieldsArray[0]} + ' already exists' + '\\n'                                  
      ); // End of: helpers.log(...)

      return callback(400, {'Error' : 'The ${uniqueFieldsArray[0]} already exists'});
    }

    // If we made it to this point then the candidate ${uniqueFieldsArray[0]} is unique so continue on with the append opperation.    
`          

        } // End of: if(uniqueFieldsArray.length != 0){...}
        // End of: Enforce unique fields. 



        //???
        // Start of: Insert code for handling calculated fields.
        // 1. Create an array with all the field names for fields that must be calculated.
        let calculatedFieldsArray = [];

        keysOfFieldsArray.forEach(function (elementValue) // The element value is the name of the field.
        {
          if(recordObject.fields[elementValue].calculation)
          {
            calculatedFieldsArray.push(elementValue);   
          }
        });
        // console.log("5. These fields are calculated: ", calculatedFieldsArray, "\n\n");


        // If there are calculated fields
        calculatedFieldsArray.forEach(function (elementValue, elementIndex)
        {
          calculatedFieldInTitleCase = calculatedFieldsArray[elementIndex][0].toUpperCase() + calculatedFieldsArray[elementIndex].slice(1);

          // Loop through the various fields in the recordObject to get the code for the calculated fields.
          for (let key in recordObject.fields[elementValue].calculation) 
          {
            // Grab the code for the calculated field.
            let fieldCalculationCode = recordObject.fields[elementValue].calculation[key];

            htmlString = htmlString +
`
            
    ${fieldCalculationCode}`

          } // End of: for (let key in recordObject.fields[elementValue].calculation)
        }); // End of: calculatedFieldsArray.forEach(function (elementValue, elementIndex){...}
        // End of: Insert code for handling calculated fields.




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

        return callback('Unable to get the next gsuid.');
      }


      // If we got this far then we were able to lock the gsuid.json file and get the next 
      // unique id number for this record so continue on.



      // Create the ${recordObject.table.tableName} object. 
      // This object will be appended to ${recordObject.table.tableName}.json.
      var ${recordObject.table.tableName}Object = 
      {
          "${recordObject.table.tableName}Id" : nextIdObject.nextId,
`


        //???
        // Insert the field properties into the object we are writing to the database.  
        keysOfFieldsArray.forEach(function (elementValue) // The element value is the name of the field.
        {
          htmlString = htmlString +
            "          \"" + elementValue + "\" : " + elementValue + ",\n";            
        });


        htmlString = htmlString +          
`          "timeStamp" : Date.now(),
          "deleted" : false
      };

      // Create the logObject.
      // This object will be written to history.json which maintains a history of 
      // all changes to all tables in the database.
      var logObject =
      {
        "historyId" : nextIdObject.nextId + 1,                 
        "transactionId" : nextIdObject.nextId + 2,            
        "rollback" : false,
        "process" : "${recordObject.table.tableName}._${recordObject.table.tableName}.post",
        "comment" : "Post new record",
        "who" : "No login yet",    
        "${recordObject.table.tableName}" : ${recordObject.table.tableName}Object   
      }

      // Calling the function which creates an entry into the database log file.
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
              'But an error at this point in the code surely means there was no append to ${recordObject.table.tableName}' + '\\n' +                                          
              'CHECK TO SEE IF history and ${recordObject.table.tableName} ARE STILL IN SYNC' + '\\n' +                    
              'The following was the record we tried to append:' + '\\n' +
              JSON.stringify(logObject) + '\\n' +                   
              'The following is the error message:' + '\\n' +                  
              err  + '\\n'
            );

            return callback(500, {'Error' : 'Could not create a new ${recordObject.table.tableName} record.'});
          }



          // The history file has been appended to successfully so continue on.



          // Calling the function which appends a record to the file ${recordObject.table.tableName}.json
          _data.append
          (
          '/${recordObject.table.directory}', 
          '${recordObject.table.tableName}', 
          ${recordObject.table.tableName}Object, 
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
                    'Successful write to ${recordObject.table.tableName} but unable to remove lock on database' + '\\n' +
                    'The following record was appended to the ${recordObject.table.tableName} file:' + '\\n' +                            
                    JSON.stringify(logObject) + '\\n' +   
                    'The following was the error message:' + '\\n' +                                             
                    error + '\\n'
                  ); // End of: helpers.log. Log the error.

                  return callback(500, {'Error' : 'Successful write to ${recordObject.table.tableName} but unable to remove lock on database'});

                } // End of: else Good write but unable to remove lock on database.

              } // End of callback code which is run after attempting to remove the lock.
              ); // End of: _data.removeLock(function(error){...}
              // End of: Call to function which removes lock

            }    // End of: if (!err)  //The file has been appended to successfully.
            else // There was an error appending to ${recordObject.table.tableName}.
            {
              helpers.log // Log the error.
              (
                5,
                '${helpers.createRandomString(20)}' + '\\n' +
                'There was an error when appending to the ${recordObject.table.tableName} file.' + '\\n' +
                'The following record may or may not have been appended to the ${recordObject.table.tableName} file:' + '\\n' +                            
                JSON.stringify(logObject) + '\\n' +
                'Attempting to rollback the entry.' + '\\n' +    
                'The following was the error message:' + '\\n' +                                             
                err + '\\n'            
              );

              // Assemble rollback record for the ${recordObject.table.tableName} file which will negate previous entry if any.  
              ${recordObject.table.tableName}Object = 
              {
                "${recordObject.table.tableName}Id" : nextIdObject.nextId,
`


        //???
        // Insert the field properties into the object we are writing to the database.  
        keysOfFieldsArray.forEach(function (elementValue) // The element value is the name of the field.
        {
          htmlString = htmlString +
          "                \"" + elementValue + "\" : \"" + elementValue + "\",\n";
        });


        htmlString = htmlString +
`                "timeStamp" : Date.now(),
                "deleted" : true
              };                        

              // Assemble rollback record for the history file which will negate previous entry if any.
              logObject =
              {
                "historyId" : nextIdObject.nextId + 3,                             
                "transactionId" : nextIdObject.nextId + 2,                        
                "rollback" : true,
                "process" : "${recordObject.table.tableName}._${recordObject.table.tableName}.post",
                "comment" : "Error posting. Appending a delete.",                        
                "who" : "Function needed",    
                "${recordObject.table.tableName}" : ${recordObject.table.tableName}Object   
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
                    // Calling the function which appends a record to the file ${recordObject.table.tableName}.json
                    _data.append
                    (
                      '/${recordObject.table.directory}', 
                      '${recordObject.table.tableName}', 
                      ${recordObject.table.tableName}Object, 
                      function(err)
                      {
                        if (!err) // The rollback record for ${recordObject.table.tableName} was appended successfully.
                        {
                          helpers.log
                          (
                            5,
                            '${helpers.createRandomString(20)}' + '\\n' +
                            'Rollback entry in the ${recordObject.table.tableName} file was appended successfully' + '\\n' +
                            'The following was the record we rolled back:' + '\\n' +
                            JSON.stringify(logObject) + '\\n'                                   
                          ); // End of: helpers.log(...)
                        }
                        else // There was an error when rolling back record for ${recordObject.table.tableName}.
                        {
                          helpers.log
                          (
                            7,
                            '${helpers.createRandomString(20)}' + '\\n' +
                            'There was an error appending a rollback entry in the ${recordObject.table.tableName} file' + '\\n' +
                            'The following record may or may not have been rolled back:' + '\\n' +
                            JSON.stringify(logObject) + '\\n' +   
                            'An error here does not necessarily mean the deleting append to ${recordObject.table.tableName} did not happen.' + '\\n' +                                        
                            'CHECK TO SEE IF history and ${recordObject.table.tableName} ARE STILL IN SYNC' + '\\n' + 
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
                      'A rollback entry may or may not have been written in the ${recordObject.table.tableName} file' + '\\n' +  
                      'CHECK TO SEE IF history and ${recordObject.table.tableName} ARE STILL IN SYNC' + '\\n' +                                      
                      'The following was the record we tried to roll back:' + '\\n' +
                      JSON.stringify(logObject) + '\\n' +        
                      'The following is the error message:' + '\\n' +
                      err  + '\\n'
                    );
                  } // End of: else There was an error when appending a rollback entry in history.
                } // End of: callback function(err){...}
              ); // End of: _data.append(...) Append a rollback entry in history.

              return callback(500, {'Error' : 'Could not create the new ${recordObject.table.tableName}.'});              

            } // End of: else // There was an error appending to ${recordObject.table.tableName}.
          } // End of: callback function
          ); // End of: Calling the function which appends a record to the file ${recordObject.table.tableName}.json 
        } // End of: callback function
      ); // End of: _data.append(dbHistory...)
      // End of: Calling the function which creates an entry into history. 
    }); // End of: lib.nextId(function(err, nextIdObject)
  }); // End of: readInterface.on('close', function(){...}
}; // End of: ${recordObject.table.tableName}._${recordObject.table.tableName}.post = function(...
// End of: ${recordObject.table.tableName} - post subhandler


`  
        //???
        // Start of:


        // Write out this javascript to file.

        let fileExtension = ".js";

        // Call the function which appends a string to a file 
        // then process anonymous callback function defined here.
        meta.append
        (
          recordObject.table.directory, 
          recordObject.table.tableName + "Logic", 
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
              'The javascript file ' + recordObject.table.tableName + "Handlers" + '.js was written successfully to a file.' + '\n'                                  
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

}// End of: meta.build.handlers = function(tableId){...}




// Define a function which builds a webpage for 
// adding records to a json table in the database.
meta.build.addWebPage = function(tableId)
{
  // This object tells the getMostRecent function which record to retrive in the data dictionary (metadata.json)
  let dataObject = {};
  dataObject.uniqueField01Value = ""; // We are not trying to write to the table so no need to enforce uniqueness.
  dataObject.uniqueField01Name = "table.tableName";           
  dataObject.path = '/database/dbMetadata/metadata.json';
  dataObject.queryString = 'WHERE:;tableId:;MatchesExactly:;' + tableId + ':;';  

  let recordObject;
  let htmlString = "";

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

      // Called by pipeline below.
      // Here is where we process the single line of json returned in the payload and make the webpage.
      writable.write = function(payload)     
      {
        let stringContainer = '';                 
        stringContainer = stringContainer + decoder.write(payload);
        recordObject = JSON.parse(stringContainer);
 
        // All the metadata for the table is in record object.
        // Assemble the webpage string from the metadata in recordObject.

        let tableNameInTitleCase = recordObject.table.tableName[0].toUpperCase() + recordObject.table.tableName.slice(1);                

        // If we have specified text for the addPage heading.
        if(recordObject.webPages.addPage.heading)
        {
          htmlString = htmlString +     
          "<h1>" + recordObject.webPages.addPage.heading + "</h1>" + "\n";
        }
        else
        {
          htmlString = htmlString +               
          "<h1>Add a Record to the " + tableNameInTitleCase + " Table</h1>" + "\n";
        }


        // If we have specifed text for the form.
        if(recordObject.webPages.addPage.forms.addForm.heading)
        {
          htmlString = htmlString +           
          "<h2>" + recordObject.webPages.addPage.forms.addForm.heading + "</h2>" + "\n" +
          "\n";
        }


        htmlString = htmlString +
        "<div class=\"formWrapper\">" + "\n" +
        "  <form id=\"" + recordObject.table.tableName + "Add\" action=\"/api/" + recordObject.table.tableName + "\" method=\"POST\">" + "\n" +
        "    <div class=\"formError\"></div>" + "\n";

        // Start of: Add field controls to the html.       

        // Start of: Create one defaultElements object combining the key/value pairs of all the defaultElements objects that might exist in a table.

        // These defaultElements may not have the same name as the table fields.
        // For instance: The "hashedPassword" field in the user file is fed from the "password" defaultElement.
        // We do this because the password is hashed before it is written to the table. 
        // hashedPassword is a calculated field. It is not fed directly from the user's input.
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

        // End of: Create one combinedDefaultElementsObject object combining the key/value pairs of all the defaultElements objects that might exist for each field.      
        
        // Make an array of keys in the formElements object. Used to deep merge defaultElements with formElements.
        // There will only be one form on the add page so, for now, no need to loop through the forms object.       
        let keysOfFormElementsArray = Object.keys(recordObject.webPages.addPage.forms.addForm.formElements);

        // Deep merge the defaultElements with formElements - formElements taking precedence.
        keysOfFormElementsArray.forEach(function (elementValue)
        {
          // console.log("0. This is the elementValue of the keysOfFormElementsArray : ", elementValue, "\n"); 

          //??? mergedElements is not used so delete it.
          // Now we have enough information to build the input elements for the webpage.
          let mergedElements = extend(true, combinedDefaultElementsObject[elementValue], recordObject.webPages.addPage.forms.addForm.formElements[elementValue]);

          // console.log("1. The mergedElements are: ", mergedElements, "\n");                            

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
          "      <button type=\"submit\" class=\"cta blue\">" + recordObject.webPages.addPage.forms.addForm.submitButtonText + "</button>" + "\n";
        }
        else
        {
          htmlString = htmlString +               
          "      <button type=\"submit\" class=\"cta blue\">Save New " + tableNameInTitleCase + "</button>" + "\n";
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

// Container for frontend application
var app = {};


// AJAX Client (for RESTful API)
// Create an empty object to contain the client.
app.client = {}




// Define interface function for making API calls.
// This XMLHttpRequest is one of 3 ways that we call for data from the server.
// Here we use XMLHttpRequest to retrive JSON data from a table that contains only one line. 
// Mostly we are using this type of call right now for managing tokens.
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




// Init (bootstrapping)
app.init = function()
{
  // Bind all form submissions
  app.bindForms();
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
          recordObject.table.directory, 
          recordObject.table.tableName + "Add", 
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
              'The web page ' + recordObject.table.tableName + "Add" + '.html was written successfully to a file.' + '\n'                                  
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

}// End of: meta.build.addWebPage = function(tableId){...}




// Define a function which builds a webpage for 
// listing records from a json table in the database.
meta.build.listWebPage = function(tableId)
{
  // This object tells the getMostRecent function which record to retrive in the data dictionary (metadata.json)
  let dataObject = {};
  dataObject.uniqueField01Value = ""; // We are not trying to write to the table so no need to enforce uniqueness.
  dataObject.uniqueField01Name = "table.tableName";           
  dataObject.path = '/database/dbMetadata/metadata.json';
  dataObject.queryString = 'WHERE:;tableId:;MatchesExactly:;' + tableId + ':;';  

  let recordObject;
  let htmlString = "";

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

      // Called by pipeline below. 
      // Here is where we process the single line of json returned in the payload and make the webpage.
      writable.write = function(payload)     
      {
        let stringContainer = '';                 
        stringContainer = stringContainer + decoder.write(payload);
        recordObject = JSON.parse(stringContainer);
 
        // All the metadata for the table is in record object.
        // Assemble the webpage string from the metadata in recordObject.

        let tableNameInUpperCase = recordObject.table.tableName.toUpperCase();                

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


        // If we have specifed text for the form.
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
        "    <a class=\"cta green\" href=\"" +recordObject.table.tableName + "/add\">Create a New " + recordObject.table.tableName + "</a>" + "\n" +
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
        "        <option value=\"" + recordObject.table.tableName + "Id\" style=\"display: list-item;\">" + recordObject.table.tableName + "Id</option>" + "\n";


        // Create the HTML text for the option elements which represent fields that are published.
        let fieldsObject = recordObject.fields;

        // Loop through the fieldsObject.
        for (let key in fieldsObject) 
        {
          // If the field is published.
          if(fieldsObject[key].published === true)
          {
            htmlString = htmlString +
            "        <option value=\"" + key + "\" style=\"display: list-item;\">" + key + "</option>" + "\n";            
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
        "          <option value=\"" + recordObject.table.tableName + "Id\">" + recordObject.table.tableName + "Id</option>" + "\n";

        // Loop through the fieldsObject.
        for (let key in fieldsObject) 
        {
          // If the field is published.
          if(fieldsObject[key].published === true)
          {
            htmlString = htmlString +
            "          <option value=\"" + key + "\">" + key + "</option>" + "\n";        
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
        "          <option value=\"" + recordObject.table.tableName + "Id\">" + recordObject.table.tableName + "Id</option>" + "\n";  
        

        // Loop through the fieldsObject.
        for (let key in fieldsObject) 
        {
          // If the field is published.
          if(fieldsObject[key].published === true)
          {
            htmlString = htmlString +
            "          <option value=\"" + key + "\">" + key + "</option>" + "\n";        
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
 * Frontend Browser JavaScript For ${recordObject.table.tableName}List Webpage
 *
 */

// Container for frontend application
var app = {};

// AJAX Client (for RESTful API)
// Create an empty object to contain the client.
app.client = {}




// Define interface function for making API calls.
// This XMLHttpRequest is one of 3 ways that we call for data from the server.
// Here we use XMLHttpRequest to retrive JSON data from a table that contains only one line. 
// Mostly we are using this type of call right now for managing tokens.
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




// Populate the ${recordObject.table.tableName}List webpage with controls and ${recordObject.table.tableName} records from the table.
app.load${recordObject.table.tableName}ListPage = async function()
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
    tableCaption = document.createElement('caption');
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
    tableHeader = document.createElement('th');  
    tableHeader.innerHTML = 'Details'  
    tableRow.appendChild(tableHeader);     

    // The first record in any table will be the primary key. This a global sequ
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
          // If we are ranking alphabetically:
          if(typeOfSortArray[loopCounter] === 'ascendingAlphaSort')
          {
            // Alphabetic Sort
            sortResult = a[fieldsToOrderByArray[loopCounter]].toString().toLowerCase().localeCompare(b[fieldsToOrderByArray[loopCounter]].toString().toLowerCase());

            if(sortResult === 1){return 1;} // Don't change the order.

            if(sortResult === -1){return -1;} // b ranks higher so swap a and b

          }
          if(typeOfSortArray[loopCounter] === 'descendingAlphaSort')
          {
            // Alphabetic Sort
            sortResult = a[fieldsToOrderByArray[loopCounter]].toString().toLowerCase().localeCompare(b[fieldsToOrderByArray[loopCounter]].toString().toLowerCase());

            if(sortResult === 1){return -1;} // Don't change the order.

            if(sortResult === -1){return 1;} // b ranks higher so swap a and b

          }          
          else if (typeOfSortArray[loopCounter] === 'ascendingNumericSort')
          {
            // Numeric Sort
            if (a[fieldsToOrderByArray[loopCounter]] < b[fieldsToOrderByArray[loopCounter]]) return -1;

            if (a[fieldsToOrderByArray[loopCounter]] > b[fieldsToOrderByArray[loopCounter]]) return 1;

          }
          else if (typeOfSortArray[loopCounter] === 'descendingNumericSort')
          {
            // Numeric Sort
            if (a[fieldsToOrderByArray[loopCounter]] > b[fieldsToOrderByArray[loopCounter]]) return -1;

            if (a[fieldsToOrderByArray[loopCounter]] < b[fieldsToOrderByArray[loopCounter]]) return 1;

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
      }) // end of: recordsArray.sort(function(a, b){...}
      // Sort the recordsArray which was populated after running the query.      


      recordsArray.forEach(function(value)
      {
        // Insert a new row in the table.
        let tr = table.insertRow(-1);            
        
        // Insert a new cell for each field to display and populate with data for that field.
        arrayOfFieldsToDisplay.forEach(function(arrayElement, elementIndex)
        {
          let newCell = tr.insertCell(elementIndex);
          newCell.innerHTML = value[arrayElement];               
        });   

        // Add an extra cell to the end of the row that contains a link which sends the user
        // to a new screen where the record can be edited or deleted.
        let lastCell = tr.insertCell(arrayOfFieldsToDisplay.length);             
        lastCell.innerHTML = '<a href="/${recordObject.table.tableName}/edit?${recordObject.table.tableName}Id=' + value[nameOfPrimaryKey] + '">View / Edit / Delete</a>';
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
    const res = await fetch('api/${recordObject.table.tableName}' + queryExpression);

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
    const fetchPromise = fetch('api/${recordObject.table.tableName}' + queryExpression)
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
              let newCell = tr.insertCell(elementIndex);
              newCell.innerHTML = value[arrayElement];               
            });   

            let lastCell = tr.insertCell(arrayOfFieldsToDisplay.length);             
            lastCell.innerHTML = '<a href="/${recordObject.table.tableName}/edit?${recordObject.table.tableName}Id=' + value[nameOfPrimaryKey] + '">View / Edit / Delete</a>';

          } // End of: if(value){do stuff}

          if (done) {return;}

          read();

        } // End of: the actual anonymous callback arrow function.
      ); // End of: .then callback after read function completes.
    } // End of: function definition: function read(){do stuff}

    // Call the "read" function defined above when the submit query button is pressed.
    read();

  }; // End of: async function runQueryStreamToDisplay(queryExpression)  

} // End of: app.load${recordObject.table.tableName}ListPage = async function(){...}
// End of: Populate the ${recordObject.table.tableName}List webpage with ${tableNameInUpperCase} records.




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
  app.load${recordObject.table.tableName}ListPage();  

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
          recordObject.table.directory, 
          recordObject.table.tableName + "List", 
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
              'The web page ' + recordObject.table.tableName + "List" + '.html was written successfully to a file.' + '\n'                                  
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

}// End of: meta.build.listWebPage = function(tableId){...}
// End of: Define a function which builds a webpage for listing records from a json table in the database.




// Define a function which builds a web page for 
// editing records to a json table in the database.
meta.build.editWebPage = function(tableId)
{
  let dataObject = {};
  dataObject.uniqueField01Value = ""; // We are not trying to write to the table so no need to enforce uniqueness.
  dataObject.uniqueField01Name = "table.tableName";           
  dataObject.path = '/database/dbMetadata/metadata.json';
  dataObject.queryString = 'WHERE:;tableId:;MatchesExactly:;' + tableId + ':;';  

  // Declare at top of function so that we will have access throughout.
  let recordObject; 
  let htmlString = "";

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
        let tableNameInTitleCase = recordObject.table.tableName[0].toUpperCase() + recordObject.table.tableName.slice(1);        


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
          "  <form id=\"" + recordObject.table.tableName + keyInTitleCase + "\" action=\"/api/" + recordObject.table.tableName + "\" method=\"PUT\">" + "\n" +
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
            "      <div class=\"inputLabel\">" + recordObject.table.tableName + "Id</div>" + "\n" +
            "      <input class=\"disabled\" type=\"text\" name=\"" + recordObject.table.tableName + "Id" + "\" value=\"{selected." + recordObject.table.tableName + "Id"  + "}\" disabled/>"  + "\n" +
            "    </div>" + "\n";

            // Insert HTML for any elements, if any, that were specified in the data dictionary (metadata.json).            
            if(meta.makeEditPageElementHtml(key, recordObject)) // if this function returns a string of HTML code:
            {
              htmlString = htmlString +
              meta.makeEditPageElementHtml(key, recordObject);              
            }

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
            "<hr />" + "\n";

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
            "    <input class=\"hiddenInput\"  type=\"hidden\" name=\"" + recordObject.table.tableName + "Id" + "\" value=\"{selected." + recordObject.table.tableName + "Id"  + "}\"/>" + "\n";

            // Insert HTML for any elements if any that were specified in the data dictionary (metadata.json).
            if(meta.makeEditPageElementHtml(key, recordObject)) // if this function returns a string of HTML code:
            {
              htmlString = htmlString +
              meta.makeEditPageElementHtml(key, recordObject);              
            }

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
            "<hr />" + "\n";            
          }
          else //This has to be the deleteForm
          {

            htmlString = htmlString + 
            "    <div class=\"warning\">Warning: This action cannot be undone. <br>" + "\n" + "      Don't click this button on accident!</div>" + "\n" +
            "      <input class=\"hiddenInput\"  type=\"hidden\" name=\"" + recordObject.table.tableName + "Id" + "\" value=\"{selected." + recordObject.table.tableName + "Id"  + "}\"/>" + "\n"+
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

// Container for frontend application
var app = {};


// AJAX Client (for RESTful API)
// Create an empty object to contain the client.
app.client = {}

// Define interface function for making API calls.
// This XMLHttpRequest is one of 3 ways that we call for data from the server.
// Here we use XMLHttpRequest to retrive JSON data from a table that contains only one line. 
// Mostly we are using this type of call right now for managing tokens.
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




// Load the ${recordObject.table.tableName}Edit page with data from the server.
app.load${recordObject.table.tableName}EditPage = async function()
{
  // Get the published fields and the timeStamp.
  // 1. Get the ${recordObject.table.tableName}Id
  // The template function inserts the ${recordObject.table.tableName}Id into the html before serving it to the client.
  let ${recordObject.table.tableName}Id = document.querySelector("form input[name=${recordObject.table.tableName}Id]").value;

  // 2. Create a queryExpression with a key of ${recordObject.table.tableName}Id and a value of the 
  // particular ${recordObject.table.tableName}Id that the user clicked on in the list.
  let queryExpression = "?WHERE:;${recordObject.table.tableName}Id:;MatchesExactly:;" + ${recordObject.table.tableName}Id + ":;";

  // Run the query defined below to get the published fields and the timeStamp for the ${recordObject.table.tableName}ID.    
  let recordArray = await runQueryOn${recordObject.table.tableName}Id(queryExpression);

  // Get the record object from the array returned by the query.
  let recordObject = recordArray[0];

  // Put the data into the forms as values where needed
  `

        //???

        let fieldsObject = recordObject.fields;

        // Loop through the fieldsObject.
        for (let key in fieldsObject) 
        {
          // If the field is published.
          if(fieldsObject[key].published === true)
          {
            htmlString = htmlString +
            "document.querySelectorAll(\"." + key + "Input\").forEach(function (element){element.value = recordObject." + key + "});" + "\n";                      
          }
        }

  htmlString = htmlString + 
  `  document.querySelectorAll(".timeStampInput").forEach(function(element){element.value = recordObject.timeStamp});  

  // Define a function to get the published fields and the timeStamp from the ${recordObject.table.tableName}ID
  async function runQueryOn${recordObject.table.tableName}Id(queryExpression) 
  {
    const res = await fetch('api/${recordObject.table.tableName}' + queryExpression);

    // Verify that we have some sort of 2xx response that we can use
    if (!res.ok) 
    {
        console.log("Error trying to load the ${recordObject.table.tableName} record: ");
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
  } // End of: async function runQueryOn${recordObject.table.tableName}Id(queryExpression){...}
  // End of: Define a function to get the published fields and the timeStamp from the ${recordObject.table.tableName}ID

}; // End of: app.load${recordObject.table.tableName}EditPage = function(){...}




// Init (bootstrapping)
app.init = function(){

  // Bind all form submissions
  app.bindForms();

  // Load data on page
  app.load${recordObject.table.tableName}EditPage();
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
          recordObject.table.directory, 
          recordObject.table.tableName + "Edit", 
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
              'The web page ' + recordObject.table.tableName + "Edit" + '.html was written successfully to a file.' + '\n'                                      
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
}// End of: meta.build.editWebPage = function(tableId){...}




// Define a function to make HTML text for data entry controls.
meta.makeAddPageElementHtml = function(elementName, recordObject)
{
  // Declare the variable to hold the HTML code that we are putting together.
  // This will get passed back to the calling function.
  let elementString;    

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

  //??? keysOfFormElementsArray is never used so delete it.
  // Make an array of keys in the formElements object. Used to deep merge defaultElements with formElements.
  // There will only be one form on the add page so no need to loop through the forms object.       
  let keysOfFormElementsArray = Object.keys(recordObject.webPages.addPage.forms.addForm.formElements);

  // console.log("4. The keysOfFormElementsArray is/are : ", keysOfFormElementsArray, "\n");  

  //????
  // Deep merge the defaultElements with formElements - formElements taking precedence.

  let mergedElements = extend(true, combinedDefaultElementsObject[elementName], recordObject.webPages.addPage.forms.addForm.formElements[elementName]);

  // Now we have enough information to build the input elements for the webpage.
  
  // console.log("5. The mergedElements are as follows: " + "\n", mergedElements, "\n");

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
  // This child object must have the property parentField which points
  // back to the name of the data field in the table that this control represents.
  // This child must also have an elementType property such as "input" or "select".
  // This child must also have an attribute property which contains a value such as
  //  "text" or "password" if the default element is an input.
  // That's all we can count on. We may have to figure out what's best
  // from that information.

  // Start by making the HTML for the attributes from the mergedElements object.
  let attributeText = ""; // holds the attribute text for the element tag.


  // Loop through defaultElementsObject.
  for (let key in mergedElements.attributes) 
  {
    // Grab each defaultElement and copy to an object which will hold all defaultElements for the table.
    attributeText = attributeText + 
    " " + key;  
    
    if(mergedElements.attributes[key])
    {
      attributeText = attributeText + 
      "=\"" + mergedElements.attributes[key] + "\"";
    }

  } // End of: Loop through defaultElementsObject.

  attributeText = attributeText + "/>";

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


  // If we have specified attributes for the element:
  if(attributeText)
  {
    // Make the element's HTML according the entry in the data dictionary.
    elementString = elementString +         
    "      <" + mergedElements.elementType + " name=\"" + elementName + "\"" + attributeText + "\n" +
    "    </div>"  + "\n";      
  }
  else // We did not specify attributes. Remove and code that produces HTML for attributes.
  {
    elementString = elementString + 
    "      <" + mergedElements.elementType + " name=\"" + elementName + "\"" + "\n" +
    "    </div>"  + "\n";
  } // End of: If we have specifed...


  // console.log("8. The following is the elementString: " + "\n", elementString, "\n");

  return elementString;  
}; // End of: meta.makeEditPageElementHtml = function(key, recordObject)
// End of: Define a function to make HTML text for data entry controls.




// Define a function to make HTML text for data entry controls.
meta.makeEditPageElementHtml = function(key, recordObject)
{
  // console.log("1. The key is: ", key, "\n");

  // Declare the variable to hold the HTML code that we are putting together.
  // This will get passed back to the calling function.
  let elementString;    

  // Start of: Create one defaultElements object combining the key/value pairs of all the defaultElements objects that might exist in a table.

  // These defaultElements may not have the same name as the table fields.
  // For instance: The "hashedPassword" field in the user file is fed from the "password" defaultElement.
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

  // Make an array of keys in the formElements object. Used to deep merge defaultElements with formElements.
  // There will only be one form on the add page so no need to loop through the forms object.       
  let keysOfFormElementsArray = Object.keys(recordObject.webPages.editPage.forms[key].formElements);

  // If no form elements were specified for this for in the data dictionary (metadata.json)
  // The bale out of this function and return false to notify the calling function that there is 
  // nothing to do.
  if(!keysOfFormElementsArray){return false;} 

  // console.log("4. The keysOfFormElementsArray is/are : ", keysOfFormElementsArray, "\n");

  // Deep merge the defaultElements with formElements - formElements taking precedence.
  keysOfFormElementsArray.forEach(function (elementValue)
  {
    let mergedElements = extend(true, combinedDefaultElementsObject[elementValue], recordObject.webPages.editPage.forms[key].formElements[elementValue]);

    // Now we have enough information to build the input elements for the webpage.

    // console.log("5. The mergedElements are as follows: " + "\n", mergedElements, "\n");

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
    // This child object must have the property parentField which points
    // back to the name of the data field in the table that this control represents.
    // This child must also have an elementType property such as "input" or "select".
    // This child must also have an attribute property which contains a value such as
    //  "text" or "password" if the default element is an input.
    // That's all we can count on. We may have to figure out what's best
    // from that information.

    // Start by making the HTML for the attributes from the mergedElements object.
    let attributeText = ""; // holds the attribute text for the element tag.


    // Loop through defaultElementsObject.
    for (let key in mergedElements.attributes) 
    {
      // Grab each defaultElement and copy to an object which will hold all defaultElements for the table.
      attributeText = attributeText + 
      " " + key;  
      
      if(mergedElements.attributes[key])
      {
        attributeText = attributeText + 
        "=\"" + mergedElements.attributes[key] + "\"";
      }

    } // End of: Loop through defaultElementsObject.

    attributeText = attributeText + "/>";

    // console.log("6. The attributeText is:" + "\n", attributeText, "\n");


    elementString = 
    "    <div class=\"inputWrapper\">" + "\n";

    // Get the current field with the first letter capitalized.
    // We will use this for the labelText if none was specifed.
    let fieldNameInTitleCase = elementValue[0].toUpperCase() + elementValue.slice(1); 


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
      "      <div class=\"inputLabel\">" + fieldNameInTitleCase + "</div>" + "\n";
    } // End of: If we have specifed...


    // Create an object of default elements for the current field.
    let fieldPropertiesObject = recordObject.fields[combinedDefaultElementsObject[elementValue].parentField];

    // console.log("7. The fieldPropertiesObject is:" + "\n", fieldPropertiesObject, "\n");


    if(key === "editForm") // We are building HTML for the editForm on the editPage.
    {
      elementString = elementString +        
      // "      <" + mergedElements.elementType + " class=\"" + elementValue + "Input\" type=\"" + mergedElements.attributes.type + "\" name=\"" + elementValue + "\"/>" + "\n";             
      "      <" + mergedElements.elementType + " class=\"" + elementValue + "Input\" name=\"" + elementValue + "\"" + attributeText + "\n" +
      "    </div>"  + "\n";
    }
    else // We are building HTML for a special form on the editPage such as perhaps the passwordForm for changing passwords.
    {
      // Specify the elementType according the entry in the data dictionary.
      elementString = elementString +        
      "      <" + mergedElements.elementType + " name=\"" + elementValue + "\"" + attributeText + "\n" +    
      "    </div>"  + "\n";
    }

    // console.log("8. The following is the elementString: " + "\n", elementString, "\n");

  }); // End of: keysOfFormElementsArray.forEach(function (elementValue){...}

  return elementString;  
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




// Export the module
module.exports = meta;