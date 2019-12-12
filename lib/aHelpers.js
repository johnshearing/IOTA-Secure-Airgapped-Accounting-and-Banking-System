/*
/ Helpers for various tasks
/ To avoid circular dependencies only require nodejs native modules in this file. 
/ The config module is the exception to this rule.
*/




// Dependencies
const config = require('./config');
const crypto = require('crypto');
const https = require('https');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { pipeline, Readable, Writable } = require('stream');




// Create a container for all the helpers
var helpers = {};



// Define the base directory of the accounting folder.
helpers.baseDir = path.join(__dirname, '/../accounting/');




// Define a function to log messages to the screen and to a log file.
// This is for automatic logging to the activity log only.
// Data is written in plain text.
// This function is independent of lib.append.
// This logging function is mainly for debugging and for generating critical alerts.
helpers.log = function(logLevel, message) 
{
  if (logLevel >= config.logLevel)
  {
    // If the logToDisplay flag above is set to true:
    if (config.logToConsole) 
    { 
      console.log(message);
    }

    // If the writeToLog flag is set to true:
    if (config.logToFile) 
    { 
      // Test if message is an object. Stringify it if it is indeed an object. Otherwise pass it through unchanged.
      message = Object.prototype.toString.call(message) === "[object Object]" ? JSON.stringify(message) : message;

      // Open a writable stream to the activity log file.
      let wLogStream = fs.createWriteStream(helpers.baseDir + 'database/dbActivity' + '/' + 'activity' + '.log', {flags : 'a'});

      // Wait till the file is open before trying to write to it.
      wLogStream.on('open', function() 
      {
        // Call function to append data to the file with a new line character added at the end.
        wLogStream.write(message + '\n'); 

      }); // End of: wStream.on('open', function(){Do stuff}
      // End of: Wait till the file is open before trying to write to it.

    } // End of: if (lib.logToFile){...}
  } //if (logLevel >= config.logLevel){...}
} // End of: helpers.log = function(){...}




// Define a function to retrieve the most current record in a table for a given primary key.
// Serves as table validation for put handlers (editing existing records)
// Checks that a record with the supplied primary key exists to modify.
// Also checks that a candidate values supplied for a unique fields are not already in the table. Enforces uniqueness.
// Streams the most current record back to the calling function.
helpers.getMostRecent = function(data, callback)
{
  // No value set but declared here because we need access to these thoughout the entire function.
  let queryArray, queryString;

  // typical example of a queryString: 'WHERE:;userId:;MatchesExactly:;' + userId + ':;'
  queryString = data.queryString

  // Make an array out of the queryString where each phrase of the query is an element.
  queryArray = queryString.split(":;");       

  // Create an empty map data structure which will be used to merge records with the same primary key. 
  // Hard if not impossible do that with objects.
  let tableMap = new Map();

  // Create a variable to track whether or not candidate values for any unique fields have already been used.
  let uniqueValuesAlreadyUsed = false;

  // Create a variable to track the primary key of a record that we may encounter which 
  // is holding a candidate unique value (perhaps and email address or phone number).
  // If we encounter this primary key again as we proceed through the records then we will 
  // check to see if the candidate unique value has been changed or if the record has been deleted. 
  // If so we will set this variable to false signifying that the candidate unique value is available again.
  let primaryKeyOfRecordHoldingCandidateUniqueValue = false    

  // This function sets up a stream where each chunk of data is a complete line in the table file.
  let readInterface = readline.createInterface
  (
    { 
      // specify the file to be read.
      input: fs.createReadStream(helpers.baseDir + data.path)
    }
  );

  // Look at each record in the file.
  readInterface.on('line', function(line) 
  {

    // Convert the JSON string (a single line from the table file) into lineValueObject.
    let lineValueObject = JSON.parse(line);    

    // Declare a variable to serve as a key in the map to manage the lineValueObject.
    let primaryKey = lineValueObject[queryArray[1]];  
    
    let shouldDeleteThisRecord = false; 

    if(lineValueObject.deleted === true) // if the record in the table file had the delete field set to true:
    {
      // If this record was holding our candidate unique field value:
      if(lineValueObject[queryArray[1]] === primaryKeyOfRecordHoldingCandidateUniqueValue) 
      {
        // The record holding our candidate unique field value has been deleted so...

        // The candidate unique field value is available.
        uniqueValuesAlreadyUsed = false;

        // There is no more reason to track this record.
        primaryKeyOfRecordHoldingCandidateUniqueValue = false;          
      }

      // This is not the record we are trying to modify.
      // Remove this record from the map. 
      shouldDeleteThisRecord = true;      
    }
    else // The record was not deleted
    { 
      // If the current record does not have a primary key matching the record we wish to change:
      if(lineValueObject[queryArray[1]] != queryArray[3])
      {
        // Check if this record has the same unique field value we wish to write. 
        // In other words: Has the unique field value already been used?
        if(lineValueObject[data.uniqueField01Name] === data.uniqueField01Value)
        {
          // Currently this unique field value is taken. 
          // As we proceed, we may encounter a record with this same primary key where the unique field value has been changed.
          // Or, with this same primary key that has been deleted. 
          // Either case will make the unique field value available again as we proceed through the records
          // So we need to compare the primary key of this record to other records that we encounter.

          // Flag that the unique field value is already being used.
          uniqueValuesAlreadyUsed = true;

          // Take note of the primary key so that we can check as we proceed if this record gets 
          // deleted or if the unique field value gets changed.
          primaryKeyOfRecordHoldingCandidateUniqueValue = lineValueObject[queryArray[3]];
        } // End of: Check if this record has the same unique field value we wish to write. Is the unique field value already taken?

        // Well then - Not deleted, not the same key as the record we want to change, not the candidate unique field value so...
        // Check if this record was previously holding the candidate unique field value but is now changed.
        else if
        (
          primaryKeyOfRecordHoldingCandidateUniqueValue === lineValueObject[queryArray[1]]
          &&
          lineValueObject[data.uniqueField01Name] != data.uniqueField01Value 
        )
        {
          // This record was tying up the candidate unique field value but is no longer holding it.
          // The candidate unique field value is available again.
          uniqueValuesAlreadyUsed = false;

          // There is no more reason to track this record.
          primaryKeyOfRecordHoldingCandidateUniqueValue = false;           
        }

        // This is not the record we are trying to modify.
        // Remove this record from the map.
        shouldDeleteThisRecord = true;
      } // End of: If the current record does not have a primary key matching the record we wish to change:
           
    } //End of: else - The record was not deleted

    // If the record was not marked for deletion and has the primary key of the record we wish to change:
    // This is the record we are going to send back to the calling function.
    if(shouldDeleteThisRecord == false)
    {          
      // Update this record in the map.
      tableMap.set(primaryKey, lineValueObject);
    }
    else // shouldDeleteThisRecord is true. This is not the record we are trying to modify. Don't send it back.
    {
      tableMap.delete(primaryKey);
    }

  }); // End of: readInterface.on('line', function(line){...}
  // End of: Look at each record...


  // This listener fires after we have looked through all the records in the table file.
  // The callback function defined here will stream one record back to the clients browser.
  readInterface.on('close', function() 
  {          
    // This readable stream will be used to write the result of the merge to a new file.
    const sourceStream = new Readable(); 

    // Check that the specified record was found.
    if(tableMap.size === 0)
    {
      helpers.log
      (
        4,
        'xwmv16fc90bzrbnvhbg5' + '\n' +
        'No record found for primary key' + '\n'
      );
            //params:  error 
      return callback("No record found for primary key");
    }

    if(uniqueValuesAlreadyUsed === true)
    {
      helpers.log
      (
        4,
        'xwmv16fc90bzrbnvhbg5' + '\n' +
        'This ' +  data.uniqueField01Name + ' value already exists' + '\n'
      );
            //params:  error 
      return callback('This ' +  data.uniqueField01Name + ' value already exists');
    }

    for (const [key, valueObject] of tableMap)
    {
      // Convert the data object to a string.
      let stringData = JSON.stringify(valueObject);     

      // Load the readable stream with data.
      sourceStream.push(stringData + '\n');                  
    }                

    // Tell the stream no more data is coming.
    sourceStream.push(null);     

    //params:  error, json record
    callback(false, sourceStream);             

  }); // End of: readInterface.on('close', function(){...}   

}; // End of: helpers.getMostRecent = function(data, callback){...}
// End of: // Define a function to retrieve the most current record in a table for a given primary key.




// Define a function to create a sha256 hash
// This is used for hashing the user's password.
// We will store the hash of the password rather than the password itself.
helpers.hash = function(str)
{
  if(typeof(str) == 'string' && str.length > 0)
  {
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');

    return hash;
  } 
  else // the input was not of type string or the string was empty.
  {
    return false;
  }

}; // End of: helpers.hash = function(...
// End of: Define a function to create a sha256 hash




// Define a function to parse a JSON string into a json object in all cases without throwing and error.
helpers.parseJsonToObject = function(str)
{
  try
  {
    // Turn the json string into a json object.
    var obj = JSON.parse(str);

    // Return the json object to the calling function.
    return obj;
  }
  catch(e)
  {
    return {};
  }
} // End of: Define a function to parse a JSON string to an object in all cases without throwing and error.




// Define a function to create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function(strLength)
{
  // Assign the type boolean and value false to strLength if it is not a number and not greater than zero.
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;

  if(strLength) // if not false - validation was passed.
  {
    // Define all the possible characters that could go into a string
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Create an empty string
    var str = '';

    // Populate the string with random characters.
    for(i = 1; i <= strLength; i++) 
    {
      // Get a random charactert from the possibleCharacters string
      var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));

      // Append this character to the string
      str+=randomCharacter;
    }

    // Return the final string
    return str;

  } // End of: strLength validation was passed.
  else // validation for strLength was not passed
  {
    return false;
  } // End of: else validation for strLength was not passed

}; // End of: helpers.createRandomString = function(...
// End of: Define a function to create a string of random alphanumeric characters, of a given length
 



// Define a function to get the contents of an html template file and
//   modify the template to suit the current need.
// This is called by html handlers when serving up html for the client browser.
// The data argument is an object containing strings to find in the template and values to replace them with.
helpers.getTemplate = function(templateName, data, callback)
{
  // Make sure the arguments passed in are usable.
  // Use templateName as it was passed in if it's type string and the string is not empty. 
  // Otherwise assign boolean false to the variable templateName
  templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;

  // Use data if it is of type object and is not null. 
  // Otherwise assign an empty object to the variable data.
  data = typeof(data) == 'object' && data !== null ? data : {};  
  
  // if the templateName is a string and has a length greater than zero:
  // The value of templateName would be false if it didn't pass the validation above.
  if(templateName) 
  {
    // Create the folder path were the template is expected to be.
    var templatesDir = path.join(__dirname, '/../templates/');

    // Call function to read the template then run the callback function defined here.
    fs.readFile(templatesDir + templateName + '.html', 'utf8', function(error,str)
    {
      if(!error && str && str.length >0) // if temple was read successfully
      {
        // Call the function which finds place markers in the template (str) and 
        // replace them with values supplied by the object (data).
        var finalString = helpers.interpolate(str, data);

        // Run callback function passed in by calling handler.
        // Report there was no error and pass the template (str) to the callback
        callback(false, finalString);
      }
      else // the template was not read successfully
      {
        helpers.log
        (
          5,
          'cstvfi66yqlqqkhh4g4b' + '\n' +
          'No template could be found.' + '\n' +
          'This was the error:' + '\n' +
          JSON.stringify(error) + '\n'
        );

        callback('No template could be found.');
      }
    }); // End of: call to fs.readFile(...
  }
  else // the template name was not of string type or the string was empty
  {
    helpers.log
    (
      5,
      'rp0pa5ww27natm2w1tdq' + '\n' +
      'A valid template was not specified.' + '\n'
    );

    callback('A valid template was not specified.')
  }

} // End of: helpers.getTemplate = function(...
// End of: Define a function to: get the string content of a template file.




// Define function to find markers in a template and replace with appropriate values.
// The function takes a given template (str), and an object (data).
// The data object holds keys to search for within the template and values to 
// be inserted where the keys currently exist.
helpers.interpolate = function(str, data)
{
  // Make sure the arguments passed in are usable.
  // Use str if it is of string type and not empty. Otherwise default to an empty string.
  str = typeof(str) == 'string' && str.length > 0 ? str : '';

  // Use data if it is of type object and is not null. Otherwise default to an empty object.
  data = typeof(data) == 'object' && data !== null ? data : {};

  // Add the templateGlobals to the data object prepending their key name with "global."
  // So find/replace pairs defined in the config.js file can be used as well as the 
  //   find/replace pairs defined in the route handlers.
  for(var keyName in config.templateGlobals)
  {
    if(config.templateGlobals.hasOwnProperty(keyName))
    {
      data['global.' + keyName] = config.templateGlobals[keyName];
    }
  }

  // Search the template string for each key in the data object.
  // If the key is found in the string then replace the key with the key's 
  //   corresponding value from the data object.
  for(var key in data)
  {
    if(data.hasOwnProperty(key) && typeof(data[key]) == 'string')
    {
  
      var replace = data[key];
      var find = '{' + key + '}';

      // Count how many occurrences there are of the string to find inside the string to be examined.
      // This will allow us to find and replace all occurrences without resorting to regular expressions.
      let findCount = str.split(find).length - 1;

      let loopCount = 0;
      
      while (loopCount < findCount) 
      {
        str = str.replace(find, replace);
        loopCount = loopCount + 1;
      }      

    } // End of: if(data.hasOwnProperty...
  } // End of: for(var key...

  // Send back the template after all markers have been replace with appropriate values.
  return str;

}; // End of: helpers.interpolate = function(...
// End of: Define function to find markers in a template and replace with appropriate values.



// Define a function to add the universal header and footer to an html template
helpers.addUniversalTemplates = function(str, data, callback)
{
  // Make sure the arguments passed in are usable.
  // Use str if it is of string type and not empty otherwise default to an empty string.
  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  // Use data if it is of type object and is not null. Otherwise use and empty object.
  data = typeof(data) == 'object' && data !== null ? data : {};  

  // Get the header
  helpers.getTemplate('_header', data, function(getHeaderError, headerString)
  {
    if(!getHeaderError && headerString) // if there was no error and a header was returned
    {
      //Get the footer
      helpers.getTemplate('_footer', data, function(getFooterError, footerString)
      {
        if(!getFooterError && footerString) //if there was no error and a footer was returned:
        {
          // Concatenate header, body, and footer templates.
          var fullString = headerString + str + footerString;
          callback(false, fullString);
        } // End of: if there was no error and a footer was returned:
        else // There was an error or no footer was returned
        {
          helpers.log
          (
            5,
            'sbadm91axlywth4xppr1' + '\n' +
            'Could not find the footer template' + '\n' +
            'This was the error:' + '\n' +
            JSON.stringify(getFooterError) + '\n'
          );

          callback('Could not find the footer template');
        }
      }); // End of: helpers.getTemplate('_footer'...
      // End of: Get the footer

    } // End of: if there was no error and a header was returned
    else // There was an error or no header was returned
    {
      helpers.log
      (
        5,
        'yagfdjy395jp6xriw1ff' + '\n' +
        'Could not find the header template' + '\n' +
        'This was the error:' + '\n' +
        JSON.stringify(getHeaderError) + '\n'
      );   

      callback('Could not find the header template');
    }

  }); // end of: helpers.getTemplate('_header'...
  //End of: // Get the header

}; // End of: helpers.addUniversalTemplates = function(...
// End of: Define a function to add the universal header and footer to an html template




// Define a function to get the contents of a static (public) asset file
helpers.getStaticAsset = function(whosCalling, fileName, callback)
{
  //Ensure fileName is type string and is not empty, otherwise make fileName boolean false
  fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;

  if(fileName) // If fileName is a type string and is not empty
  {
    // Define a path where the public asset file is expected to be
    let publicDir = path.join(__dirname, '/../public/');  
    
    // Define a path where the accounting asset file is expected to be
    let accountingDir = path.join(__dirname, '/../accounting/');      

    let searchDir // Declared here so we can see it throughout the code block.

    if(whosCalling === 'handlers.public' || whosCalling === 'handlers.favicon')
    {
      searchDir = publicDir;
    }
    else // must have been called by handlers.accounting
    {
      searchDir = accountingDir;    
    }

    // Get the contents of the public asset or accounting file
    fs.readFile(searchDir + fileName, function(errorReadFile, data)
    {

      if(!errorReadFile && data) // if there was no error and the contents of the file was returned
      {
        callback(false, data);
      }
      else // the contents of the file was not returned
      {
        helpers.log
        (
          5,
          '4c6yc2wbxdxywkgvy145' + '\n' +
          'No File could be found' + '\n' +
          'This was the error:' + '\n' +
          JSON.stringify(errorReadFile) + '\n'
        ); 

        callback('No File could be found');
      }

    }); // End of: fs.readFile(...
    // End of: Get the contents of the public asset file

  } // End of: If fileName is a type string and is not empty
  else // the fileName passed in was not string type or it was empty
  {
    helpers.log
    (
      5,
      'yrz6nkq3hnljoo2e9agj' + '\n' +
      'A valid file name was not specified' + '\n'
    );

    callback('A valid file name was not specified')
  }
}; // End of: helpers.getStaticAsset = function(...
// End of: Define a function to get the contents of a static (public) asset file




// Define a function to send a text message.
// This is an example of interacting with an api without using someone else's library.
helpers.sendTwilioSms = function(phone,msg,callback)
{
  // Validate parameters
  phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false;
  msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;

  if(phone && msg) // if the parameters passed validation
  {

    // Configure the request payload
    var payload = 
    {
      'From' : config.twilio.fromPhone,
      'To' : '+1'+phone,
      'Body' : msg
    };

    var stringPayload = querystring.stringify(payload);

    // Configure the request details
    var requestDetails = 
    {
      'protocol' : 'https:',
      'hostname' : 'api.twilio.com',
      'method' : 'POST',
      'path' : '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
      'auth' : config.twilio.accountSid+':'+config.twilio.authToken,
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload)
      }
    };

    // Instantiate the request object and define what happens when the request gets sent.
    var req = https.request(requestDetails,function(res)
    {
        // Grab the status of the sent request
        var status =  res.statusCode;
        // Callback successfully if the request went through
        if(status == 200 || status == 201){
          callback(false);
        } else {
          callback('Status code returned was '+status);
        }
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error',function(e)
    {
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request. This is where the request gets sent.
    req.end();

  } 
  else // The parameters passed into this function did not pass validation.
  {
    callback('Given parameters were missing or invalid');
  }
}; // End of: helpers.sendTwilioSms = function(phone,msg,callback){Do Stuff}
// End of: Define a function to send a text message.




// Export the module
module.exports = helpers;