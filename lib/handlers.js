/*
/
/Request handlers
/
*/

"use strict";

// Dependencies
const _data = require('./data');
const helpers = require('./helpers');
const config = require('./config')




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


// handlers.index = function...
// Define the index handler function.
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
      'head.clientCode' : 'public/app.js',
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




// Define the handler function for creating user accounts.
handlers.accountCreate = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // Prepare data for interpolation
    var templateData = 
    {
      'head.title' : 'Create an Account',
      'head.description' : 'Sign up is easy and only takes a few seconds',
      'body.class' : 'accountCreate',
      'head.clientCode' : 'public/app.js',      
    };

    // Read in a template as a string
    helpers.getTemplate('accountCreate', templateData, function(err, str)
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
        }); // End of: helpers.addUniversalTemplates(str...

      } // End of: If there were no errors and a template was returned
      else // There was an error or no template was returned.
      {
        // Send back status code for Internal Server Error, an undefined payload, and contentType of html.
        callback(500, undefined, 'html');
      }
    }); // End of: call to helpers.getTemplate(...

  } // End of: if the method is get
  else // Method not get. Only gets allowed.
  {
    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: handlers.accountCreate = function(...
// End of: Define the handler function for creating user accounts.




// Define the handler function for creating a user session.
handlers.sessionCreate = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // Prepare data for interpolation
    var templateData = 
    {
      'head.title' : 'Login to your Account',
      'head.description' : 'Please enter your phone number and password to access your account',
      'body.class' : 'sessionCreate',
      'head.clientCode' : 'public/app.js',      
    };

    // Read in a template as a string
    helpers.getTemplate('sessionCreate', templateData, function(err, str)
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
        }); // End of: helpers.addUniversalTemplates(str...

      } // End of: If there were no errors and a template was returned
      else // There was an error or no template was returned.
      {
        // Send back status code for Internal Server Error, an undefined payload, and contentType of html.
        callback(500, undefined, 'html');
      }
    }); // End of: call to helpers.getTemplate(...

  } // End of: if the method is get
  else // Method not get. Only gets allowed.
  {
    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: handlers.sessionCreate = function(...
// End of: // Define the handler function for creating a user session.




// Define the handler function for presenting the webpage a user is directed to after their session has been deleted.
handlers.sessionDeleted = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // Prepare data for interpolation
    var templateData = 
    {
      'head.title' : 'Logged Out',
      'head.description' : 'You have been logged out of your account.',
      'body.class' : 'sessionDeleted',
      'head.clientCode' : 'public/app.js',      
    };

    // Read in a template as a string
    helpers.getTemplate('sessionDeleted', templateData, function(err, str)
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
        }); // End of: helpers.addUniversalTemplates(str...

      } // End of: // If there were no errors and a template was returned
      else // There was an error or no template was returned.
      {
        // Send back status code for Internal Server Error, an undefined payload, and contentType of html.
        callback(500, undefined, 'html');
      }
    }); // End of: call to helpers.getTemplate(...

  } // End of: if the method is get
  else // Method not get. Only gets allowed.
  {
    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: handlers.sessionDeleted = function(...
// End of: // Define the handler function for presenting the webpage a user is directed to after their session has been deleted.




// Define the handler function for editing a user account.
handlers.accountEdit = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // Prepare data for interpolation
    var templateData = 
    {
      'head.title' : 'Account Settings',
      'body.class' : 'accountEdit',
      'head.clientCode' : 'public/app.js',      
    };

    // Read in a template as a string
    helpers.getTemplate('accountEdit', templateData, function(err, str)
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
        }); // End of: helpers.addUniversalTemplates(str...

      } // End of: // If there were no errors and a template was returned
      else // There was an error or no template was returned.
      {
        // Send back status code for Internal Server Error, an undefined payload, and contentType of html.
        callback(500, undefined, 'html');
      }
    }); // End of: call to helpers.getTemplate(...

  } // End of: if the method is get
  else // Method not get. Only gets allowed.
  {
    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: handlers.accountEdit = function(data, callback){...}
// End of: // Define the handler function for editing a user account.




// Define the handler function for presenting the webpage a user is directed to after their account has been deleted..
handlers.accountDeleted = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // Prepare data for interpolation
    var templateData = 
    {
      'head.title' : 'Account Deleted',
      'head.description' : 'Your account has been deleted',      
      'body.class' : 'accountDeleted',
      'head.clientCode' : 'public/app.js',      
    };

    // Read in a template as a string
    helpers.getTemplate('accountDeleted', templateData, function(err, str)
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
        }); // End of: helpers.addUniversalTemplates(str...

      } // End of: // If there were no errors and a template was returned
      else // There was an error or no template was returned.
      {
        // Send back status code for Internal Server Error, an undefined payload, and contentType of html.
        callback(500, undefined, 'html');
      }
    }); // End of: call to helpers.getTemplate(...

  } // End of: if the method is get
  else // Method not get. Only gets allowed.
  {
    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: handlers.accountDeleted = function(data, callback){...}
// Define the handler function for presenting the webpage a user is directed to after their account has been deleted..




// Define the handler function for creating a new check
handlers.checksCreate = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // Prepare data for interpolation
    var templateData = 
    {
      'head.title' : 'Create a New Check',   
      'body.class' : 'checksCreate',
      'head.clientCode' : 'public/app.js',      
    };

    // Read in a template as a string
    helpers.getTemplate('checksCreate', templateData, function(err, str)
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
        }); // End of: helpers.addUniversalTemplates(str...

      } // End of: // If there were no errors and a template was returned
      else // There was an error or no template was returned.
      {
        // Send back status code for Internal Server Error, an undefined payload, and contentType of html.
        callback(500, undefined, 'html');
      }
    }); // End of: call to helpers.getTemplate(...

  } // End of: if the method is get
  else // Method not get. Only gets allowed.
  {
    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: handlers.checksCreate = function(data, callback){...}
// End of: Define the handler function for creating a new check




// Dashboard (view all checks)
// Define the handler function for listing all the checks
handlers.checksList = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // Prepare data for interpolation
    var templateData = 
    {
      'head.title' : 'Dashboard',   
      'body.class' : 'checksList',
      'head.clientCode' : 'public/app.js',      
    };

    // Read in a template as a string
    helpers.getTemplate('checksList', templateData, function(err, str)
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
        }); // End of: helpers.addUniversalTemplates(str...

      } // End of: // If there were no errors and a template was returned
      else // There was an error or no template was returned.
      {
        // Send back status code for Internal Server Error, an undefined payload, and contentType of html.
        callback(500, undefined, 'html');
      }
    }); // End of: call to helpers.getTemplate(...

  } // End of: if the method is get
  else // Method not get. Only gets allowed.
  {
    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: handlers.checksList = function(data, callback){...}
// End of: Define the handler function for listing all the checks
// End of: Dashboard (view all checks)




// Edit the checks
// Define the handler function for editing checks
handlers.checksEdit = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // Prepare data for interpolation
    var templateData = 
    {
      'head.title' : 'Check Details',   
      'body.class' : 'checksEdit',
      'head.clientCode' : 'public/app.js',      
    };

    // Read in a template as a string
    helpers.getTemplate('checksEdit', templateData, function(err, str)
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
        }); // End of: helpers.addUniversalTemplates(str...

      } // End of: // If there were no errors and a template was returned
      else // There was an error or no template was returned.
      {
        // Send back status code for Internal Server Error, an undefined payload, and contentType of html.
        callback(500, undefined, 'html');
      }
    }); // End of: call to helpers.getTemplate(...

  } // End of: if the method is get
  else // Method not get. Only gets allowed.
  {
    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: handlers.checksEdit = function(data, callback){...}
// End of: Define the handler function for editing checks
// End of: Edit the checks




// Define the favicon handler function.
handlers.favicon = function(data, callback)
{
  // This handler only allows the get method
  if(data.method == 'get')
  {
    // Call function to read in the favicon's data
    helpers.getStaticAsset('favicon.ico', function(err, data)
    {
      if(!err && data) // if the favicon was returned without error
      {
        callback(200, data, 'favicon');
      }
      else // there was an error or the favicon was not returned.
      { 
        callback(500); // http status code 500 is: internal server error
      }
    }); // End of: call to helpers.getStaticAsset('favicon.ico'...

  } // End of: if(data.method == 'get')
  else // a method other than get was specifed by the client so report back method not allowed.
  {
    callback(405); //http status code 405 is: Method not allowed
  }
} // End of: handlers.favicon = function(...
// Define the favicon handler function.




// Define the public assets handler function.
// This function returns public asset files in the public folder to the client browser.
// Such asset files might be of types: plain text, css, png, jpg, and ico
// This is used to get the html files stored next to the table file.
// There is an HTML file for adds, edits, and for listing records.
handlers.accounting = function(data, callback)
{
  // This handler only allows the get method
  if(data.method == 'get')
  {
    //Get the file name being requested
    var trimmedAssetName = data.trimmedPath.replace('accounting', '').trim();

    // if there were characters after the word public in the client's request
    if(trimmedAssetName.length > 0)
    {
      // Read in the asset's data
      helpers.getStaticAsset('handlers.accounting', trimmedAssetName, function(errorGetStaticAsset, data)
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
            '7ewnigpmfh8ju84ied73' + '\n' +
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
        'xnzn7xf5jbfuwdzxrtcj' + '\n' +
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
      helpers.getStaticAsset(trimmedAssetName, function(err, data)
      {
        if(!err && data) // if the public asset was returned without error
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
          callback(404); // http status code 404 is: Not found
        }        
      }); // End of: call to helpers.getStaticAsset(...

    } // End of: if there were characters after the word public in the client's request
    else // there were no characters after the word "public" in the client's request
    {
      callback(404) // http status code 404 is not found
    } // End of: else there were no characters after the word "public" in the client's request

  } // End of: If the method is 'get'
  else // A method other than get was specifed by the client so report back method not allowed.
  {
    callback(405); //http status code 405 is: Method not allowed
  }
} // End of: handlers.public = function(...
// Define the public assets handler function.    


/*
*
* End of: HTML handlers
*
*/






/*
* JSON API handlers
* JSON API handler functions are defined in this section.
*
* There is one JSON API handler for each defined route (client request) which is
* expecting an html webpage to be returned to the client browser. 
* For instance: if the client presses the post button on the page for adding new users then
* the request is received by req.on('end'... which routes the request to the handlers._users.post function
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




// Router for user functions
// Define a function which calls the requested get, post, put, or delete subhandler function for users 
// and passes to the chosen subhandler the client's request object and the callback function.
handlers.users = function(data, callback)
{
  // Create an array of acceptable methods.
  var acceptableMethods = ['post', 'get', 'put', 'delete'];

  // if the requested method is one of the acceptable methods:
  if (acceptableMethods.indexOf(data.method) > -1) 
  {
    // then call the appropriate user subhandler.
    handlers._users[data.method](data, callback);
  } 
  // Otherwise the method was not one of the acceptable methods:
  else 
  {
    // so send back status 405 (Not Allowed).
    callback(405);
  }
}; // End of: handlers.users = function(...
//End of: Router for user functions



// Create a subobject within the handlers object for the user's submethods (post, get, put, and delete)
handlers._users = {};




// user - post subhandler
// Define the user's post subhandler function.
// This function creates a new user file in the users directory.
// There is one user file for each user.
// The file contains only one JSON record for each user containing the following data.
// Required data: firstName, lastName, phone, email, password, tosAgreement.
// Optional data: none
handlers._users.post = function(data, callback)
{
  // Create variables for the post from the clients request object.
  // The variables will be loaded from the object if validation is passed otherwise will be assigned the value false.
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;  
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;


  //if every field passed the validation process above then do the following.
  if(firstName && lastName && phone && email && password && tosAgreement)
  {  
    // We are expecting this read to fail. That's how we know we are not adding a duplicate record.
    _data.read('users',  phone, function(err, data){
      if(err) //The read failed. This is not a duplicate. So go ahead and add the record.
      {
        // Hash the password
        var hashedPassword = helpers.hash(password);

        if(hashedPassword) // The hash function successfully returned the hashed password.
        {
          // Get the next global sequential unique Id
          _data.nextId(function(err, nextIdObject)
          {
            // if we were able to lock the gsuid.json file and get the next unique id number for this record
            if(!err && nextIdObject) 
            {
              // Create the user object. This object will be used to create the single record in each user file.
              // This is notnextIdObject.nextId.toString(); a database. A new file is created for each user which contains only one record.
              var userObject = 
              {
                  'id' : nextIdObject.nextId,
                  'firstName' : firstName,
                  'lastName' : lastName,
                  'phone' : phone,
                  'email' : email,
                  'hashedPassword' : hashedPassword,
                  'tosAgreement' : true
              };

              // Calling the function which creates a user file.
              _data.create(
              'users', 
              phone, 
              userObject, 
              function(err)
              {
                if (!err)  //The file has been created successfully.
                {
                  callback(200);
                } 
                else // There was an error creating the file.
                {
                  console.log(err);
                  callback(500, {'Error' : 'Could not create the new user.'});
                }
              }); // End of: Calling the function which creates a user file.   
          
            } // End of: if we were able to lock the gsuid.json file and get the next unique id number for this record
            else // We were unable to get the next gsuid.
            {
              callback('Error closing new file');
            }
          
          }); // End of: lib.nextId(function(err, nextIdObject)

        } // End of: The hash function successfully returned the hashed password.
        else // The password was not hashed successfully.
        {
          callback(500, {'Error' : 'Could not hash the user\'s password'});
        } // End of: else the password was not hashed successfully.

      } // End of: The read failed. This is not a duplicate. So go ahead and add the record.
      else // The user already exists
      {
        callback(400, {'Error' : 'A user with that phone number already exists'});
      } // End of: else the user already exists

    }); // End of: Attempt a read to ensure the user does not already exist.
  } // End of: If field validation has been passed successfully.
  else // Field validation failed.
  {
      callback(400, {'Error' : 'Missing required fields'});
  } // End of: else field validation failed.
}; // End of: handlers._users.post = function(...
// End of: user - post subhandler




// user - get subhandler
// Define the user's get subhandler function.
// There is one user file for each user.
// This function gets the single JSON record from a user file in the users directory. 
// It selects the correct file by using the phone number provided as lookup against the file name.
// Required data: phone
// Optional data: none
handlers._users.get = function(data, callback)
{
  // Check that the phone number is valid.
  // Checking that the phone number is of type string and that the length is 10 characters.
  // Create the phone variable for the get from the clients query string.
  // The variable will be loaded from the query string if validation is passed otherwise will be assigned the value false.
  var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
  
  // if the validation was passed:
  if(phone)
  {
    // Get the token from the headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    // Checking permission to access this user data.
    // Check if the given token is valid for the users phone number. 
    handlers._tokens.verifyToken(token, phone, function(tokenIsValid)
    {
      if(tokenIsValid)
      {
        // Look for the user's file and retrive the record. 
        // Calling the -data.read function. 
        // Passing in the directory to look in, 
        // the phone number to look up the correct file,
        // and a callback function to perform after an attempt was made to retrive the record in the file.
        _data.read('users', phone, function(err, data)
        { 
          // if there was no error and the user's record was returned
          if(!err && data)
          {
            // Remove the hashed password from the user before returning it to the requester.
            delete data.hashedPassword; 

            // Run the callback function that was passed into this handler.
            // To avoid confusion:
            // The "data" var passed to the callback is not the query string passed into the user's get handler at the top.
            // It is rather the "data" found inside the users file which was returned by the _data.read function.
            // WTF - right? That's because the callback below is inside this callback that we are defining for _data.read.
            // So if _data.read is running this function then _data.read gets to pass it's own data to the data argument above
            // when data.read is called, and that would be the text it finds in the user's file converted to a JSON object.
            // Perhaps it would have been better to give these two "data" variables different names.
            callback(200, data); // Status code 200 is: Everything went OK.
          } // End of: if(!err && data)

          else // There was an error or no record was returned.
          {
            callback(404); // 404 is http status code: Not Found
          }  // End of: There was an error or no record was returned.

        }); // End of call to _data.read('users'...
      } // End of: if tokenIsValid

      else // the token is not valid
      {
        // Status code 403 is forbidden or access denied
        callback(403, {'Error' : 'Missing required token in header or token is invalid.'}); 
      } // End of: the token is not valid

    }); // End of: handlers._tokens.verifyToken(token, phone, function(tokenIsValid)
    // End of: Check if the given token is valid for the users phone number.
    // End of: Checking permission to access this user data.

  } // End of: If phone passed data type and length validation

  else // The phone number did not pass data type and length validation.
  {
    callback(400, {'Error' : 'Missing required field'});
  } // End of: else the phone number did not pass data type and length validation.

}; // End of: handlers._users.get = function(...
// End of: Define the user's get subhandler function.
// End of: user - get subhandler




// user - put handler
// Define the user's put subhandler function
// There is one file for each user.
// This function changes the single JSON record in the user's file. 
// Required data: phone
// Optional data: firstName, lastName, email, password, tosAgreement
// Note: At least one of the optional arguments must be specified.
handlers._users.put = function(data, callback){

  // Check the required phone field. 
  // Must be of type string and have a length of 10 characters. 
  // If not then set to boolean false.
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;


  // Check for the optional fields.
  // Create variables for the post from the clients request object.
  // The variables will be loaded from the object if validation is passed otherwise will be assigned the value false.
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;  
  var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  

  if(phone) // If the phone number passed validation test.
  {
    // If the user supplied items to update and these passed validation
    if(firstName || lastName || email || password)
    {
      // Get the token from the headers
      var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

      // Checking permission to access this user data.
      // Check if the given token is valid for the users phone number. 
      handlers._tokens.verifyToken(token, phone, function(tokenIsValid)
      {
        if(tokenIsValid)
        {
          // Look up the user file and return the record as a JSON object.
          _data.read('users', phone, function(err, userData)
          {
            // If there was no error accessing the user file and data was returned:
            if(!err && userData)
            {
              // Update the fields if necessary
              if(firstName){
                userData.firstName = firstName;
              }
              if(lastName){
                userData.lastName = lastName;
              }
              if(email){
                userData.email = email;
              }
              if(password){
                userData.hashedPassword = helpers.hash(password);
              }
              // Store the new updates
              _data.update('users',phone,userData,function(err){

                if(!err) // If there was no error updating the user file:
                {
                  callback(200); // Send back OK status code
                } 
                else // There was an error updating the user file:
                {
                  console.log(err);
                  callback(500,{'Error' : 'Could not update the user.'}); // 500 means something went wrong on the server.
                }
              }); // End of: Store the new updates

            } // End of: If there was no error accessing the user file and data was returned:
            else // There was an error accessing the user file or data was not returned:
            {
              callback(400,{'Error' : 'Specified user does not exist.'}); // Code 400 is bad request
            } //End of: There was an error accessing the user file or data was not returned:

          }); // End of: _data.read(...

        }
        else // the token is not valid
        {
          // Status code 403 is forbidden or access denied
          callback(403, {'Error' : 'Missing required token in header or token is invalid.'}); 
        } // End of: the token is not valid

      }); //End of: handlers._tokens.verifyToken(token...
      // End of: Check if the given token is valid for the users phone number. 
      // End of: Checking permission to access this user data.

    } // End of: If the user supplied items to update and these passed validation
    else // The user did not supply items to update or they did not pass validation
    {
      callback(400,{'Error' : 'Missing fields to update.'}); // 400 is Bad Request
    } // End of: The user did not supply items to update or they did not pass validation

  } // End of: If the phone is valid.
  else // The phone number did not pass validation test.
  {
    callback(400,{'Error' : 'Missing required field.'}); // 400 is Bad Request
  } // End of: The phone number did not pass validation test.

}; // End of: handlers._users.put = function(...
// End of: Define the user's put subhandler function
// End of: user - put handler



// user - delete
// Define the user's delete subhandler function.
// This function deletes the user's file.
// Required field: phone
handlers._users.delete = function(data, callback){

  // Check that the phone number is valid.
  // Must be of type string and have length of 10 characters.
  // Create the phone variable for the delete from the clients query string.
  // The variable will be loaded from the query string if validation is passed otherwise will be assigned the value false.
  var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
  
  // if the phone number validation was passed:
  if(phone)
  {
    // Get the token from the headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    // Checking permission to access this user data.
    // Check if the given token is valid for the users phone number. 
    handlers._tokens.verifyToken(token, phone, function(tokenIsValid)
    {
      if(tokenIsValid)
      {
        // Look for the user's file and retrive the record. 
        // Calling the -data.read function. 
        // Just checking to see that the file exists to delete.
        // Passing in the directory to look in, 
        // the phone number to look up the correct file,
        // and a callback function to perform after an attempt was made to retrive the record in the file.
        _data.read('users', phone, function(err, userData)
        { 
          // if there was no error and the user's record was returned we know that the file exists.
          if(!err && userData)
          {
            // Now delete the users record
            _data.delete('users', phone, function(err)
            {
              if(!err) // If the users file was deleted successfully:
              {


                // Delete each of the checks associated with the user.



                var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : []; 
                var checksToDelete = userChecks.length;
                if(checksToDelete > 0)
                {
                  let checksDeleted = 0;
                  var deletionErrors = false;

                  // Loop through the checks
                  userChecks.forEach(function(checkId)
                  {
                    // Delete the check
                    _data.delete('checks',checkId,function(err)
                    {
                      
                      if(err)
                      {
                        deletionErrors = true;
                      }

                      checksDeleted++;

                      if(checksDeleted == checksToDelete)
                      {
                        if(!deletionErrors)
                        {
                          callback(200);
                        } 
                        else 
                        {
                          callback(500,{'Error' : "Errors encountered while attempting to delete all of the user's checks. All checks may not have been deleted from the system successfully."})
                        }
                      }

                    });
                  });
     
                }
                else
                {
                  // Send back http status code 200: Everything OK.
                  callback(200);
                }

              } 
              else // There was an error. The users file was not deleted.
              {
                // Send back http status Code 500: Internal Server Error
                callback(500, {'Error' : 'Could not delete the specified user.'}); 
              }
            }); // End of: Now delete the users record

          } // End of: if there was no error and the user's record was returned we know that the file exists.
          else // There was an error or no record was returned. Likely not found.
          {
            // Send back http status code 404: Not Found
            callback(404); 
          }  // End of: There was an error or no record was returned. Likely not found.

        }); // End of call to _data.read(...

      }
      else // the token is not valid
      {
        // Status code 403 is forbidden or access denied
        callback(403, {'Error' : 'Missing required token in header or token is invalid.'}); 
      } // End of: the token is not valid
    }); // End of: handlers._tokens.verifyToken(token...
    // End of: Check if the given token is valid for the users phone number. 
    // End of: Checking permission to access this user data.
  } 
  else // The phone number did not pass validation.
  {
    callback(400, {'Error' : 'Missing required field'}); // 400 is http status code: Bad Request
  } // End of: else the phone number did not pass validation.

}; // End of: handlers._users.delete = function(...
// End of: Define the user's delete subhandler function.
// End of: user - delete




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




// Router for check functions
// Define a function which calls the requested get, post, put, or delete subhandler function for checks 
// and passes to the chosen subhandler the client's request object and the callback function.
handlers.checks = function(data, callback)
{
  // Create an array of acceptable methods.
  var acceptableMethods = ['post', 'get', 'put', 'delete'];

  // if the requested method is one of the acceptable methods:
  if (acceptableMethods.indexOf(data.method) > -1) 
  {
    // then call the appropriate tokens subhandler.
    handlers._checks[data.method](data, callback);
  } 
  // Otherwise the method was not one of the acceptable methods:
  else 
  {
    // so send back status 405 (Not Allowed).
    callback(405);
  }
}; // End of: handlers.checks = function(...
// End of: Define a function which calls the requested get, post, put, or delete subhandler function for checks
// End of: Router for check functions




// Create a subobject within the handlers object for the checks submethods (post, get, put, and delete)
handlers._checks = {};




// Checks - post
// handlers._checks.post = function(data, callback){Do stuff}
// There is a separate check file for each check.
// Each check file contains a single JSON record.
// Each user can have 5 checks so there can be as many as 5 check files for each user.
// Required data: protocol, url, method, successCodes, timeoutSeconds
// Optional data: none
handlers._checks.post = function(data, callback)
{
  // Validate data according to the rules below. Assign false to data that does not pass validation.
  var protocol = typeof(data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
  var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
  var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
  var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
  var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

  // If data passed in is valid:
  if(protocol && url && method && successCodes && timeoutSeconds)
  {
    //Get the token from the headers
    var token = typeof(data.headers.token) == 'string'  ? data.headers.token : false;

    // Look up the user by reading the token
    _data.read('tokens', token, function(err, tokenData){

      // If the token was found:
      if(!err && tokenData)
      {
        // Get the phone number from the token so we can use it to find the user.
        var userPhone = tokenData.phone;

        // Look up the user data. The user's phone number will be the key when matching checks to a user.
        _data.read('users', userPhone, function(err, userData)
        {
          // If we got the record from the user's file without error:
          if(!err && userData)
          {
            var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];                

            // Verify that the user has less than the number of max-checks-per-user
            if(userChecks.length < config.maxChecks)
            {
              // Create a random id to uniquely name this check file
              var checkId = helpers.createRandomString(20);

              // Create the check object and include the users phone
              var checkObject = {
                'id' : checkId,
                'userPhone' : userData.phone,
                'protocol' : protocol,
                'url' : url,
                'method': method,
                'successCodes' : successCodes,
                'timeoutSeconds' : timeoutSeconds 
              };
              // End of: Create the check object and include the users phone
             
              // Create a new check file containing the object above.
              _data.create('checks', checkId, checkObject, function(err)
              {
                if(!err) // if the check file was created successfully.
                {
                  // Add a key for the new check in the user's file so we know which check belongs to which user.
                  // First we update the user object in memory. 
                  // This ensures that an empty array is there to populate in case this is the very first check added.
                  userData.checks = userChecks; 

                  // Now add the new checkId to the array of checkIds in the users object in memory.
                  userData.checks.push(checkId);

                  // Save the new user data in memory to the user's file.
                  // The old data in the file is completly over written with the new userData object.
                  _data.update('users', userPhone, userData, function(err){

                    if(!err) // The new check key was successfully written to the user's file.
                    {
                      // Return the data about the new check to the requester.
                      callback(200, checkObject);
                    }
                    else // Unable to add the check key to the user's file. The new check file, however, now exists.
                    {
                      // 500 is Internal Server Error
                      callback(500, {'Error' : 'Could not update the user with the new check.'});
                    }
                  }); // End of: _data.update('users', userPhone, userData, function(err){Do stuff}

                } // End of: if the check file was created successfully.
                else // The check file was not created.
                {
                  // 500 is Internal Server Error
                  callback(500, {'Error' : 'Could not create the new check'}); 
                }
              }); // End of: _data.create('checks'...
              // End of: Create a new check file...

            } // End of: the user has less than the number of max-checks-per-user
            else // the user already has the maximum of 5 checks.
            {
              callback(400, {'Error' : 'The user already has the maximum number of checks (' + config.maxChecks + ')'});
            }
          } // End of: If we got the record from the user's file without error:
          else // Unable to get the user's record.
          {
            // calling back "Not authorized" even though the user was not found.
            // The justification is that perhaps a bogus token was passed in by the client.
            callback(403);
          }
        }); // End of: _data.read('users'
        // End of: look up the user

      } // End of: If the token was found:
      else // The token was not found
      {
        callback(403); //Not authorized
      }

    }); // End of: _data.read('tokens'..
    // End of lookup the token so we can find the user.

  } // End of: If data passed in is valid:
  else // the data passed in from the client did not pass validation.
  {
    callback(400, {'Error' : 'Missing required inputs or inputs are invalid'});
  }
}; // End of: handlers._checks.post = function(data, callback){Do stuff}
//End of: Checks - post




// Checks - get subhandler
// Define the checks get subhandler function.
// Required data: id
// Optional data: none
// There is a separate check file for each check.
// Each check file contains only a single JSON record.
// Each user can have 5 checks so there can be as many as 5 check files for each user.
// This function gets the single JSON record from a checks file in the checks directory. 
// It selects the correct file by using the checkId provided as lookup against the file name.
handlers._checks.get = function(data, callback)
{
  // Check that the id is valid.
  // Checking that the phone number is of type string and that the length is 20 characters.
  // Create the id variable for the get from the clients query string.
  // The variable will be loaded from the query string if validation is passed otherwise will be assigned the value false.
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  
  // if the validation was passed:
  if(id)
  {
    // Lookup the check.
    _data.read('checks', id, function(err, checkData)
    {
      if(!err && checkData)
      {
        // Get the token from the headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

        // Check that the given token is valid and belongs to the user that created the check.
        handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid)
        {
          if(tokenIsValid)
          {
            // Return the check data
            callback(200, checkData);

          } // End of: if tokenIsValid

          else // the token is not valid
          {
            // Status code 403 is forbidden or access denied
            callback(403);
          } // End of: the token is not valid

        }); // End of: handlers._tokens.verifyToken(token, phone, function(tokenIsValid)
        // End of: Check that the given token is valid and belongs to the user that created the check.

      } //End of: If the check file was found and the JSON record was returned
      else // the check file was not found or the record was not returned.  
      {
        callback(404) // The check file was not found
      }

    }); // End of: _data.read('checks', id, function(err, checkData){Do stuff}

  } // End of: If phone passed data type and length validation

  else // The phone number did not pass data type and length validation.
  {
    callback(400, {'Error' : 'Missing required field'});
  } // End of: else the phone number did not pass data type and length validation.

}; // End of: handlers._checks.get = function(data, callback){Do stuff}
// End of: Define the checks get subhandler function.
// End of: Checks - get subhandler




// Checks - put
// Required data: id
// Optional data: protocol, url, method, successCodes, timeoutSeconds, (one must be sent)
// This function changes the record in a checks file. 
// The old record is erased and a new record is added.
handlers._checks.put = function(data, callback)
{
  // Check the required id field. 
  // Must be of type string and have a length of 20 characters. 
  // If not then set to boolean false.
  var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;

  // Validate data according to the rules below. Assign false to data that does not pass validation.
  var protocol = typeof(data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
  var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
  var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
  var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
  var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;  

  if(id) // the id is of string type and has a length of 20 characters
  {
    // If one of the optional fields above passed validation
    if(protocol || url || method || successCodes || timeoutSeconds)
    {
      // Lookup the check
      _data.read('checks', id, function(err, checkData)
      {
        // if there was no error, and the file was found, and the JSON record was returned
        if(!err && checkData)
        {
          // Get the token from the headers
          var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

          // Check that the given token has not expired and belongs to the user that created the check.
          handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid)
          {
            if(tokenIsValid) // The token is not expired and it matches the users phone number.
            {
              // Update the check where necessary
              if(protocol)
              {
                checkData.protocol = protocol;
              }
              if(url)
              {
                checkData.url = url;
              }
              if(method)
              {
                checkData.method = method;
              }
              if(successCodes)
              {
                checkData.successCodes = successCodes;
              }
              if(timeoutSeconds)
              {
                checkData.timeoutSeconds = timeoutSeconds;
              }               
              
              // Store the new updates
              _data.update('checks', id, checkData, function(err)
              {
                if(!err) // The checks file was updated successfully.
                {
                  callback(200);
                }
                else // Unable to update the checks file.
                {
                  callback(500, {'Error' : 'Could not update the check'});
                }

              }); // End of: _data.update('checks', id, checkData, function(err){Do Stuff}
            }
            else // the token is expired or it does not match the user's phone number
            {
              callback(403); // 403 is: Forbiden
            }

          });  // End of: Call to handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid){Do Stuff}
     
        }
        else // there was an error, or the check file was not found, or no json record was returned
        {
          callback(400, {'Error' : 'Check id did not exist'});
        }

      }); // End of: _data.read('checks', id, function(err, checkData){Do stuff}

    } // End of: If one of the optional field above passed validation
    else // none of the optional fields passed validation.
    {
      callback(400, {'Error' : 'Missing fields to update'});
    }

  } // End of: if the id is valid
  else // the id is not valid
  {
    callback(400, {'Error' : 'Missing required field'});
  }

}; // End of: handlers._checks.put = function(data, callback){Do stuff}
// End of: Checks - put




// Checks - delete
// Define the checks delete subhandler function.
// This function deletes the user's check file and then deletes the check key in the user's file.
// Required field: id
handlers._checks.delete = function(data, callback){

  // Check that the id is valid.
  // Must be of type string and have length of 20 characters.
  // Create the id variable for the delete from the clients query string.
  // The variable will be loaded from the query string if validation is passed otherwise will be assigned the value false.
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  
  // if the id validation was passed:
  if(id)
  {
    // Lookup the check to be deleted.
    _data.read('checks', id, function(err, checkData)
    {
      if(!err && checkData) // the file was read without error and the record was returned.
      {
        // Get the token from the headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

        // Checking permission to access this user data.
        // Check if the given token is valid for the users phone number. 
        handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid)
        {
          if(tokenIsValid)
          {

            //Delete the check data.
            _data.delete('checks', id, function(err)
            {
              if(!err)
              {
                // Look for the user's file and retrive the record. 
                // Calling the -data.read function. 
                // Just checking to see that the file exists to delete.
                // Passing in the directory to look in, 
                // the phone number to look up the correct file,
                // and a callback function to perform after an attempt was made to retrive the record in the file.
                _data.read('users', checkData.userPhone, function(err, userData)
                { 
                  // if there was no error and the user's record was returned we know that the file exists.
                  if(!err && userData)
                  {
                    // Get the list of checks from the user's record object
                    var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : []; 

                    // Find the position of the check key we wish to remove from the array of keys in the user's record object.
                    var checkPosition = userChecks.indexOf(id);

                    if(checkPosition > -1) // if the check key was found in the array:
                    {
                      // Remove the key from the 
                      userChecks.splice(checkPosition, 1);

                        // Now update the user's file with the updated record object.
                        _data.update('users', checkData.userPhone, userData, function(err)
                        {
                          if(!err) // If the users file was deleted successfully:
                          {
                            // Send back http status code 200: Everything OK.
                            callback(200);
                          } 
                          else // There was an error. The users file was not updated.
                          {
                            // Send back http status Code 500: Internal Server Error
                            callback(500, {'Error' : 'Could not update the specified user.'}); 
                          }
                        }); // End of: Now update the user's file with the updated record object.

                    }
                    else // no check key was found in the array to delete.
                    {
                      callback(500, {'Error' : 'Could not fine the check key in the users file so could not remove it'})
                    }

                  } // End of: if there was no error and the user's record was returned we know that the file exists.
                  else // There was an error or no record was returned. Likely not found.
                  {
                    // Send back http status code 500: Internal Server Error
                    callback(500, {'Error' : 'Could not find the user that deleted the check so could not remove the check from the list of checks on the user object'}); 
                  } // End of: There was an error or no record was returned. Likely not found.

                }); // End of call to _data.read(...

              } // End of: if check was deleted successfully
              else // the check was not deleted
              {
                callback(500, {'Error' : 'Could not delete check data'})
              }

            }); // End of: _data.delete('checks', id, function(err){}

          } // End of: if the token is valid.
          else // the token is not valid
          {
            // Status code 403 is forbidden or access denied
            callback(403); 
          } // End of: the token is not valid

        }); // End of: handlers._tokens.verifyToken(token...
        // End of: Check if the given token is valid for the users phone number. 
        // End of: Checking permission to access this user data.

      } // End of: if the file was read without error and the record was returned.
      else // there was an error reading the file or no record was returned.
      {
        callback(400, {'Error' : 'The specifed id does not exist'}) // http status code 400 is Bad Request
      }

    }); //End of: _data.read('checks', id, function(err, checkData){Do Stuff}
    // End of: // Lookup the check to be deleted.

  } // End of: if the id validation was passed
  else // The id did not pass validation.
  {
    callback(400, {'Error' : 'Missing required field'}); // 400 is http status code: Bad Request
  } // End of: else the id did not pass validation.

}; // End of: handlers._checks.delete = function(data, callback){Do Stuff}
// End of: Define the checks delete subhandler function.
// End of: Checks - delete




/*
*
* End of: JSON API handlers
*
*/




// Ping handler
handlers.ping = function(data, callback){
  //Callback an http status code of 200.
  callback(200);
};





// Not found handler
handlers.notFound = function(data, callback){
  callback(404);
}; 




// Export the module.
module.exports = handlers;