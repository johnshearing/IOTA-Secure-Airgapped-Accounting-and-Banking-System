/*
/ Helpers for various tasks
*/




// Dependencies
var config = require('./config');
var crypto = require('crypto');
var https = require('https');
var querystring = require('querystring');
var path = require('path');
var fs = require('fs');




// Create a container for all the helpers
var helpers = {};



// Causes helpers.log messages to appear on the screen.
helpers.logToDisplay = true;

// logs messages to the screen if helpers.reportToDisplay is set to true.
helpers.log = function(message) 
{
  if (helpers.logToDisplay) 
  { 
    console.log(message);
  }
}




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

  if(templateName) // if the templateName is a string and has a length greater than zero
  {
    // Create the folder path were the template is expected to be.
    var templatesDir = path.join(__dirname, '/../templates/');

    // Call function to read the template then run the callback function defined here.
    fs.readFile(templatesDir + templateName + '.html', 'utf8', function(err,str)
    {
      if(!err && str && str.length >0) // if temple was read successfully
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
        callback('No template could be found.');
      }
    }); // End of: call to fs.readFile(...
  }
  else // the template name was not of string type or the string was empty
  {
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
      str = str.replace(find, replace);
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
  helpers.getTemplate('_header', data, function(err, headerString)
  {
    if(!err && headerString) // if there was no error and a header was returned
    {
      //Get the footer
      helpers.getTemplate('_footer', data, function(err, footerString)
      {
        if(!err && footerString) //if there was no error and a footer was returned:
        {
          // Concatenate header, body, and footer templates.
          var fullString = headerString + str + footerString;
          callback(false, fullString);
        } // End of: if there was no error and a footer was returned:
        else // There was an error or no footer was returned
        {
          callback('Could not find the footer template');
        }
      }); // End of: helpers.getTemplate('_footer'...
      // End of: Get the footer

    } // End of: if there was no error and a header was returned
    else // There was an error or no header was returned
    {
      callback('Could not find the header template');
    }

  }); // end of: helpers.getTemplate('_header'...
  //End of: // Get the header

}; // End of: helpers.addUniversalTemplates = function(...
// End of: Define a function to add the universal header and footer to an html template




// Define a function to get the contents of a static (public) asset file
helpers.getStaticAsset = function(fileName, callback)
{
  //Ensure fileName is type string and is not empty, otherwise make fileName boolean false
  fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;

  if(fileName) // If fileName is a type string and is not empty
  {
    // Define a path where the public asset file is expected to be
    var publicDir = path.join(__dirname, '/../public/');

    // Get the contents of the public asset file
    fs.readFile(publicDir + fileName, function(err, data)
    {

      if(!err && data) // if there was no error and the contents of the file was returned
      {
        callback(false, data);
      }
      else // the contents of the file was not returned
      {
        callback('No File could be found');
      }

    }); // End of: fs.readFile(...
    // End of: Get the contents of the public asset file

  } // End of: If fileName is a type string and is not empty
  else // the fileName passed in was not string type or it was empty
  {
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



// For generating random unique IDs at the console.
// Comment out for production.
// console.log(helpers.createRandomString(20));


// Export the module
module.exports = helpers;