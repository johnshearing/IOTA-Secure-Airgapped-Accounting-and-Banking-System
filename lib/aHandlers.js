/*
/
/Request handlers
/
*/

// Dependencies
const fs = require('fs');
const readline = require('readline');
const { pipeline, Readable, Writable } = require('stream');
const StringDecoder = require('string_decoder').StringDecoder;
const _data = require('./aData');
const helpers = require('./aHelpers');




// Define the container for all the handlers.
var handlers = {};


/*
* HTML handler functions are defined in this section.
* Below this HTML handler section you will find the JSON handlers section.
*
* There is one HTML handler for each defined route (client request) which is
* expecting an html webpage to be returned to the client browser. 
* For instance: if the client requests http://localhost:3000/account/create then
* the request is received by req.on('end'... which routes the request to handlers.accountCreate
* which sends back to the client browser the HTML for the account creation web page.
*
* 
* All the HTML handler functions below are called as follows:
* chosenHandler(data, function(statusCode, payload, contentType){do stuff with info called back}
* The "data" object passed in contains the following from the client:
* trimmedPath, queryStringObject, method, headers, payload
* The HTML handler functions are expected to run the callback defined in chosenHandler with the following:
*   http status code, the html to display in the browser, and the content type 'html'
*
*/


// Define the index handler function.
// This function serves up the homepage to the client.
// This function is executed when the user specifies the home page without a route.
handlers.index = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // Prepare data for interpolation
    var templateData = 
    {
      'head.title' : 'PrivateKeyVault',
      'head.description' : 'Secure Client/Server Air-Gapped Wallet, Accounting System, and Banking System for IOTA',
      'body.class' : 'index',
      'head.clientCode' : 'public/app.js'
    };

    // Read in a template as a string
    helpers.getTemplate('index', templateData, function(err, str)
    {
      if(!err && str) // If there were no errors and a template was returned
      {
        // Add the universal header and footer.
        helpers.addUniversalTemplates(str, templateData, function(err, str)
        {
          if(!err && str) // if no error and template was returned:
          {          
            // Return that page as html
            callback(200, str, 'html');
          } 
          else // there was an error or the template was not returned
          {
            callback(500, undefined, 'html');
          }
        }); //End of: helpers.addUniversalTemplates(str...

      } // End of: If there were no errors and a template was returned
      else // There was an error or no template was returned.
      {
        // Send back status code for Internal Server Error, an undefined payload, and contentType of html.
        callback(500, undefined, 'html');
      }
    }); // End of: call to helpers.getTemplate(...

  } // End of: if the method is get
  else // Method not get. Only gets allowed for an empty request (the home page)
  {
    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get

}; // End of: handlers.index = function(...
// End of: Define the index handler.




// Define the public assets handler function.
// This function returns public asset files in the public folder to the client browser.
// Such asset files might be of types: plain text, css, png, jpg, and ico
handlers.public = function(data, callback)
{
  // This handler only allows the get method
  if(data.method == 'get')
  {
    //Get the file name being requested
    var trimmedAssetName = data.trimmedPath.replace('public', '').trim();

    // if there were characters after the word public in the client's request
    if(trimmedAssetName.length > 0)
    {
      // Read in the asset's data
      helpers.getStaticAsset('handlers.public', trimmedAssetName, function(errorGetStaticAsset, data)
      {
        if(!errorGetStaticAsset && data) // if the public asset was returned without error
        {
          // Determine the content type and default to plain text if undetermined.
          var contentType = 'plain';

          if(trimmedAssetName.indexOf('.css') > -1)
          {
            contentType = 'css';
          }

          if(trimmedAssetName.indexOf('.png') > -1)
          {
            contentType = 'png';
          }   
          
          if(trimmedAssetName.indexOf('.jpg') > -1)
          {
            contentType = 'jpg';
          }
          
          if(trimmedAssetName.indexOf('.ico') > -1)
          {
            contentType = 'favicon';
          }
          
          // Return the status code OK, the contents of the file, and the contentType determined above.
          callback(200, data, contentType);

        } //End of: if the public asset was returned without error
        else // there was an error or the public asset was not returned.
        { 
          helpers.log
          (
            5,
            '4ewnigpmfh8juu4ied73' + '\n' +
            'There was an error or the public asset was not returned.' + '\n' +
            'This was the error:' + '\n' +
            JSON.stringify(errorGetStaticAsset) + '\n'            
          ); 

          callback(404); // http status code 404 is: Not found
        } // End of: else - there was an error or the public asset was not returned.
      }); // End of: call to helpers.getStaticAsset(...

    } // End of: if there were characters after the word public in the client's request
    else // there were no characters after the word "public" in the client's request.
    {
      helpers.log
      (
        5,
        'fnzn7xf5jbfuwdzjrtcj' + '\n' +
        'There were no characters after the word public in the clients request.' + '\n'
      );   

      callback(404) // http status code 404 is not found
    } // End of: else there were no characters after the word "public" in the client's request

  } // End of: If the method is 'get'
  else // A method other than get was specifed by the client so report back method not allowed.
  {
    helpers.log
    (
      5,
      'xnzn7xf5jbfuwdzxrtcj' + '\n' +
      'A method other than get was specifed by the client' + '\n'
    );    

    callback(405); //http status code 405 is: Method not allowed
  }
} // End of: handlers.public = function(...
// End of: Define the public assets handler function.    




// Define the favicon handler function.
handlers.favicon = function(data, callback)
{
  // This handler only allows the get method
  if(data.method == 'get')
  {
    // Call function to read in the favicon's data
    helpers.getStaticAsset('handlers.favicon', 'favicon.ico', function(errorGetStaticAsset, data)
    {
      if(!errorGetStaticAsset && data) // if the favicon was returned without error
      {
        callback(200, data, 'favicon');
      }
      else // there was an error or the favicon was not returned.
      { 
        helpers.log
        (
          5,
          'ztlujurrnwku025348jr' + '\n' +
          'There was an error or the favicon was not returned' + '\n' +
          'This was the error:' + '\n' +
          JSON.stringify(errorGetStaticAsset) + '\n'
        );

        callback(500); // http status code 500 is: internal server error
      }
    }); // End of: call to helpers.getStaticAsset('favicon.ico'...

  } // End of: if(data.method == 'get')
  else // a method other than get was specifed by the client so report back method not allowed.
  {
    helpers.log
    (
      5,
      'bkoofw1pnj4qt5vi9k3t' + '\n' +
      'A method other than get was specifed by the client' + '\n'
    );

    callback(405); //http status code 405 is: Method not allowed
  }
} // End of: handlers.favicon = function(...
// Define the favicon handler function.




/*
* JSON API handlers
* JSON API handler functions are defined in this section.
*
* There is one JSON API handler for each defined route (client request) which is
* expecting an html webpage to be returned to the client browser. 
* For instance: if the client presses the post button on the page for adding new users then
* the request is received by req.on('end'... which routes the request to the handlers._user.post function
* which creates a new users file as defined by the information entered int the form on the webpage.
*
* All the JSON API handler functions below are called from the client browser as follows:
* app.client.request(headers,path,method,queryStringObject,payload, function(statusCode,responsePayload){do something});
* The JSON API handler functions are expected to run the callback defined in app.client.request with the following info
* passed in to the function: http status code, and responsePayload.
*
* Here is the cool and tricky part: 
* Where does the client get the function app.client.request to run?
* It is passed in as javascript when the webpage is served to the client. 
* Look in _header.html for the following line of html to see how app.client.request is passed to the client browser
* <script type="text/javascript" charset="utf-8" src="public/app.js"></script>
*/




// Router for token functions
// Define a function which calls the requested get, post, put, or delete subhandler function for tokens 
// and passes to the chosen subhandler the client's request object and the callback function.
handlers.tokens = function(data, callback)
{
  // Create an array of acceptable methods.
  var acceptableMethods = ['post', 'get', 'put', 'delete'];

  // if the requested method is one of the acceptable methods:
  if (acceptableMethods.indexOf(data.method) > -1) 
  {
    // then call the appropriate tokens subhandler.
    handlers._tokens[data.method](data, callback);
  } 
  // Otherwise the method was not one of the acceptable methods:
  else 
  {
    // so send back status 405 (Not Allowed).
    callback(405);
  }
}; // End of: handlers.tokens = function(...
// End of: Define a function which calls the requested get, post, put, or delete subhandler function for tokens 
// End of: Router for token functions



// Create a subobject within the handlers object for the tokens submethods (post, get, put, and delete)
handlers._tokens = {};




// Tokens - post subhandler
// Define the tokens post subhandler function.
// This function creates a new token file in the tokens directory.
// Required data: phone, password.
// Optional data: none
handlers._tokens.post = function(data, callback)
{
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  // if phone and password are of the correct datatypes and the values are not empty
  if(phone && password) 
  {
    //Lookup the user who matches that phone number.
    _data.read('users', phone, function(err, userData)
    {    
      if(!err && userData) //if the user was found
      {
        // Hash the sent password and compare it to the hashed password returned from user data.
        var hashedPassword = helpers.hash(password);

        // if hashed password supplied matches hashed password stored:
        if(hashedPassword == userData.hashedPassword)
        {
          // Create a new token with a random name and set to expire 1 hour in the future.
          var tokenId = helpers.createRandomString(20); 
          var expires = Date.now() + 1000 * 60 * 60;

          // This is the token.
          var tokenObject = 
          {
            'phone' : phone,
            'id': tokenId,
            'expires' : expires
          };

          // Store the token
          _data.create('tokens', tokenId, tokenObject, function(err)
          {
            if(!err) // The token was successfully stored in a new file.
            {
              callback(200, tokenObject);
            }
            else // The token was not successfully stored in a new file.
            {
              callback(500, {'Error' : 'Could not create the new token'});
            }
          }); // End of: call to _data.create(...
          // End of: Store the token

        }
        else // the password supplied is not correct.
        {
          callback(400, {'Error' : 'The password supplied did not match the specifed user\'s stored password'});
        }var expires = Date.now() + 1000 * 60 * 60;


      }
      else // the user was not found
      {
        callback(400, {'Error' : 'Could not find the specifed user'});
      };

    }); // End of call to _data.read(...
    // End of: Lookup the user who matches that phone number.

  } // End of: if phone and password are of the correct datatypes and the values are not empty:
  else // Phone and or password is not of the correct data type or one of the values is empty:
  {
    callback(400, {'Error' : 'Missing required field(s)'});
  }

}; //End of: handlers._tokens.post = function(...
// End of: Define the tokens post subhandler function.
// End of: Tokens - post subhandler




// Tokens - get subhandler
// Define the token get subhandler function.
// This function gets the single record from a token file in the token directory.
// It selects the correct file by using the id provided as lookup against the file name.
// Required data: id
// Optional data: none
handlers._tokens.get = function(data, callback)
{
  // Check that the id is valid.
  // Checking that the type is string and that the length is equal to 20 characters.
  // Create the id variable for the get from the clients query string.
  // The variable will be loaded from the query string if validation is passed otherwise will be assigned the value false.
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  
  // if the validation was passed:
  if(id)
  {
    // Look for the token file and retrive the record inside. 
    // Calling the -data.read function. 
    // Passing in the directory to look in, 
    // the id to look up the correct file,
    // and a callback function to perform after an attempt was made to retrive the record in the file.
    _data.read('tokens', id, function(err, tokenData)
    { 
      // if there was no error and the token record was returned
      if(!err && tokenData)
      {
        // Run the callback function that was passed into this handler.
        callback(200, tokenData);
      } // End of: if(!err && data)

      else // There was an error or no record was returned.
      {
        callback(404); // 404 is http status code: Not Found
      }  // End of: There was an error or no record was returned.

    }); // End of call to _data.read
  } 
  else // The id did not pass validation.
  {
    callback(400, {'Error' : 'Missing required field'});
  } // End of: else the id did not pass validation.
}; // End of: handlers._tokens.get = function(...
// Define the token get subhandler function.
// End of: Tokens - get subhandler




// Tokens - put subhandler
// Define the tokens put subhandler function
// This function changes the record in a tokens file. 
// The old record is erased and a new record is added.
// The only thing the user will be allowed to do with the record is extend the expiration time.
// Required data: id of type string, and extend of type boolean.
// Optional data: none
// @TODO: Only let an authenticated user update their own object. 
// @ Do not let them update anyone else's
handlers._tokens.put = function(data, callback)
{
  // Validate the data passed in to this function.
  // Check if id is of type string and that it has a length of 20 characters. If not then set to boolean false.
  var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;

  // Check if extend is of type boolean and that it is set to true. If not then set to boolean type and value false.
  var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;

  if(id && extend) // If the data passsed validation
  {
    // Lookup the token
    _data.read('tokens', id , function(err, tokenData)
    {
      if(!err && tokenData) // if the token was found and the record was read successfully
      {
        // Check to make sure the token isn't already expired
        if(tokenData.expires > Date.now()) // if the token has not expired
        {
          // Set the expiration an hour from now
          tokenData.expires = Date.now() + 1000 * 60 * 60;

          // Store the new updates to the token file
          _data.update('tokens', id, tokenData, function(err)
          {
            if(!err) // If the new expire time was written to the token file
            {
              callback(200);
            }
            else // the expire time was not successfully written to the token file
            {
              callback(500, {'Error' : 'Could not update the token\'s expiration'});
            }
          }); // End of: _data.update(...
          // End of: Store the new updates to the token file

        } // End of: if the token has not expired
        else // the token has already expired
        {
          callback(400, {'Error' : 'The token has already expired and can not be extended'});
        }

      } // End of: if the token was found and the record was read successfully
      else // the token was not found
      {
        callback(400, {'Error' : 'Specified token does not exist'});
      }
    }); // End of: call to _data.read(...
    // End of: Lookup the token

  } // End of: if the data passed validation
  else // The data did not pass validation
  {
    callback(400, {'Error' : 'Missing required field(s) or fields are invalid'});
  }
}; // End of: handlers._tokens.put = function(...
// End of: Define the tokens put subhandler function
// End of: Tokens - put subhandler



// Tokens - delete
// Define the tokens delete subhandler function.
// This function deletes a user's token file.
// This is how logging out is accomplished.
// Required field: id
handlers._tokens.delete = function(data, callback){

  // Check that the id is valid.
  // Must be of type string and have length of 20 characters.
  // Create the id variable for the delete from the clients query string.
  // The id variable will be loaded from the query string if validation is passed. 
  // Otherwise id will be assigned the type boolean and the value false.
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  
  // if the id validation was passed:
  if(id)
  {
    // Look for the token file and retrive the record. 
    // Calling the -data.read function. 
    // Just checking to see that the file exists to delete.
    // Passing in the directory to look in, 
    // the id to look up the correct file,
    // and a callback function to perform after an attempt was made to retrive the record in the file.
    _data.read('tokens', id, function(err, data)
    { 
      // if there was no error and the token record was returned we know that the file exists.
      if(!err && data)
      {
        // Now delete the token record
        _data.delete('tokens', id, function(err)
        {
          if(!err) // If the token file was deleted successfully:
          {
            // Send back http status code 200: Everything OK.
            callback(200);
          } 
          else // There was an error. The token file was not deleted.
          {
            // Send back http status Code 500: Internal Server Error
            callback(500, {'Error' : 'Could not delete the specified token file.'}); 
          }
        }); // End of: Now delete the token record

      } // End of: if there was no error and the token record was returned we know that the file exists.
      else // There was an error or no record was returned. Likely not found.
      {
        // Send back http status code 404: Not Found
        callback(404); 
      }  // End of: There was an error or no record was returned. Likely not found.

    }); // End of call to _data.read(...
  } 
  else // The id number did not pass validation.
  {
    callback(400, {'Error' : 'Missing required field'}); // 400 is http status code: Bad Request
  } // End of: else the id did not pass validation.

}; // End of: handlers._tokens.delete = function(...
// End of: Define the tokens delete subhandler function. 
// End of: Tokens - delete



// Verify token is valid
// Define function to verify that a given token id is currently valid for a given user.
handlers._tokens.verifyToken = function(id, phone, callback)
{
  // Look up the token
  _data.read('tokens', id, function(err, tokenData)
  {
    // if the token file was found and the record was read:
    if(!err && tokenData)
    {
      // Check that the token is for the given user and that it has not expired.
      if(tokenData.phone == phone && tokenData.expires > Date.now())
      {
        // If the token is good:
        callback(true); 
      }
      else // the token is not good:
      {
        callback(false);
      }
    }
    else // the token file was not found or the record was not successfully read.
    {      
      callback(false);
    }

  }); // End of: _data.read('tokens'...

}; // End of: handlers._tokens.verifyToken = function(...)
// End of: Verify token is valid




/*
*
* End of: JSON API handlers
*
*/




// Ping handler
handlers.ping = function(data, callback){
  //Callback an http status code of 200.
  helpers.log
  (
    5,
    'iqnce9u6hswg7wpt385b' + '\n' +
    'Getting pinged' + '\n'
  ); 

  callback(200);
};




// Not found handler
handlers.notFound = function(data, callback)
{
  helpers.log
  (
    5,
    'did73726cbp1qltpyjy2' + '\n' +
    'The requested page was not found' + '\n'
  );

  callback(404);
}; 




// Export the module.
module.exports = handlers;