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




// Define the handler function that serves up the HTML page for editing users.
handlers.dbUsersEdit = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // Prepare data for interpolation
    var templateData = 
    {
      'head.title' : 'Edit a User',     
      'body.class' : 'dbUsersEdit',
      'selected.userId' : data.queryStringObject.userId,
      //'head.clientCode' : 'public/app.js',
      'head.clientCode' :  'accounting/dbPermissions/dbUsers' + '/' + 'dbUsersEdit' + '.js' 
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/dbPermissions/dbUsers/dbUsersEdit', templateData, function(errorGetTemplate, str)
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
              'dikezn1jntu4zdf4ye8c' + '\n' +
              'There was an error or the concatenated templates were not returned.' + '\n' +
              'This was the error:' + '\n' +
              JSON.stringify(errorAddUnivTemplates) + '\n'
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
          'vukvi8rm2ftt0nu7889f' + '\n' +
          'There was an error or no template was returned.' + '\n' +
          'This was the error:' + '\n' +
          JSON.stringify(errorGetTemplate) + '\n'
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
      'qj4olyz0pazithobwb7v' + '\n' +
      'Method not get. Only gets allowed.' + '\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: handlers.dbUsersEdit = function(data, callback){...}
// End of: Define the handler function that serves up the HTML page for editing users.




// Define the handler function that serves up the HTML page for listing users.
handlers.dbUsersList = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // Prepare data for interpolation
    var templateData = 
    {
      'head.title' : 'List Users',
      'body.class' : 'dbUsersList',
      // 'head.clientCode' : 'public/app.js',      
      'head.clientCode' :  'accounting/dbPermissions/dbUsers' + '/' + 'dbUsersList' + '.js'      
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/dbPermissions/dbUsers/dbUsersList', templateData, function(errorGetTemplate, str)
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
              'dikbzn1jntr5zdf2ye8c' + '\n' +
              'There was an error or the concatenated templates were not returned.' + '\n' +
              'This was the error:' + '\n' +
              JSON.stringify(errorAddUnivTemplates) + '\n'
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
          'vugvi8rl2ftt0mu7869f' + '\n' +
          'There was an error or no template was returned.' + '\n' +
          'This was the error:' + '\n' +
          JSON.stringify(errorGetTemplate) + '\n'
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
      'qj4klyz0pazishodwb3v' + '\n' +
      'Method not get. Only gets allowed.' + '\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: handlers.dbUsersList = function(data, callback){...}
// End of: Define the handler function that serves up the HTML page for listing users.




// Define the handler function that serves up the HTML page for creating users.
handlers.dbUsersCreate = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // Prepare data for interpolation
    var templateData = 
    {
      'head.title' : 'Create a New User',
      'head.description' : 'Use a completly random password',
      'body.class' : 'dbUsersCreate', 
      //'head.clientCode' : 'public/app.js',      
      'head.clientCode' :  'accounting/dbPermissions/dbUsers' + '/' + 'dbUsersCreate' + '.js'          
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/dbPermissions/dbUsers/dbUsersCreate', templateData, function(errorGetTemplate, str)
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
              'dikbzn1jntu5zdf4ye8c' + '\n' +
              'There was an error or the concatenated templates were not returned.' + '\n' +
              'This was the error:' + '\n' +
              JSON.stringify(errorAddUnivTemplates) + '\n'
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
          'vugvi8rm2ftt0mu7889f' + '\n' +
          'There was an error or no template was returned.' + '\n' +
          'This was the error:' + '\n' +
          JSON.stringify(errorGetTemplate) + '\n'
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
      'qj4klyz0pazishobwb7v' + '\n' +
      'Method not get. Only gets allowed.' + '\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: handlers.dbUsersCreate = function(data, callback){...}
// End of: Define the handler function that serves up the HTML page for creating users.




// Define the public assets handler function.
// This function returns public asset files in the public folder to the client browser.
// Such asset files might be of types: plain text, css, png, jpg, and ico
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
    // then call the appropriate Users subhandler.
    handlers._users[data.method](data, callback);
  } 
  // Otherwise the method was not one of the acceptable methods:
  else 
  {
    helpers.log
    (
      5,
      '4a9upjlvcfe7yso020i7' + '\n' +
      'The method was not one of the acceptable methods' + '\n'
    ); 

    // so send back status 405 (Not Allowed).
    callback(405);
  }
}; // End of: handlers.users = function(...
//End of: Router for user functions



// Create a subobject within the handlers object for the user's submethods (post, get, put, and delete)
handlers._users = {};




// Users - post subhandler
// Define the user's post subhandler function.
// This function appends a record to the dbUsers file.

// Required data: email, password
handlers._users.post = function(data, callback)
{
  // Create variables for the post from the clients request object.
  // The variables will be loaded from the object if validation is passed otherwise will be assigned the value false.
  var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  //if every field passed the validation process above then do the following.
  if(email && password)
  {
    // Will toggle this to false if we find the email address already exists in dbUsers.
    let emailIsUnused = true; 

    // Using this to track the primary key of a record that we might encounter with the candidate email address.
    // If we encounter this primary key again we will check to see if the email address has been changed.
    // If it has then the candidate email address will be marked as available again.
    let uniqueIdOfRecordHoldingCandidateEmailAddress = false; 
                         

    // To ensure the email address is unique we will read every record in 
    // dbUsers and compare with the email address provided.

    // This function sets up a stream where each chunk of data is a complete line in the dbUsers file.
    let readInterface = readline.createInterface
    (
      { // specify the file to be read.
        input: fs.createReadStream(_data.baseDir + '/dbPermissions/dbUsers' + '/' + 'dbUsers' + '.json'),
      }
    );
    
    // Look at each record in the file and set a flag if the email address matches the email address provide by the user.
    readInterface.on('line', function(line) 
    {
      // Convert the JSON string from dbUsers into an object.
      lineObject = JSON.parse(line);

      // Several different record sets with the supplied email address and the same userId 
      // may exist already if the record has been changed or deleted prior to this operation.

      // A modified record is simply a new record with the same userId as an existing record.
      // The newest record is the valid record and the older record is history.  
      // So position matters. These tables should never be sorted.
      // These tables can be packed however to get rid of historical records.

      // The transaction log also maintains the history and the current state of the entire database.
      // So the transaction log can be used to check the integrity of the every table.
      // No records in the transaction log should be removed.

      // A deleted record in this system is simply an identical record appended with 
      // the deleted field set to true. 
      // So depending on how many times the email address has been added and deleted there may 
      // be several sets of records in the dbUsers table currently that have the same email 
      // address and the same userId.
      // The table can be packed occasionally to get rid of these deleted record sets. 
      // Deletes are handled as appends with the deleted field set to true because real 
      // deletes tie up the table for a long time.

      // In this table, the email address is a unique key as well as the userId.

      // When adding a record we first make sure that the record does NOT already exist.
      // There should be no record with the current email address or if there is then 
      // the last record with this email address must have the deleted field set to true.

      // When changing a record we:
      // 1. Make sure that the record with this email address does indeed exist and...
      // 2. that the last instance of a record with this email address is not deleted.
    
      // It is ok to add a new record with this same email address again when the last instance 
      // of this record encountered in the stream has the deleted flag set to true. 
      // In that case, the userId will be different but the email address will be the same.         

      // As explained above, only the last matching record for a particular email address matters.
      // It's like that old game "She loves me, She loves me not".

      if (email == lineObject.email) // we found a matching entry
      {
        if (lineObject.deleted == false) // The record has not been deleted so it's a duplicate. Not unique.
        {
          emailIsUnused = false; // This flag used in the on close event listener below. 

          // If this record (record with this primary key) is encountered further down where it has been deleted 
          // or where the email address has been changed with a put operation:
          // Then the candidate address will be available again as we continue searching through the records.
          // We are already checking if this email address becomes available again by deletion.
          // Now we need to check if the email address becomes available because the record with this primary 
          // key gets changed with a new email address.
          // That will make the candidate email address unique and available again.
          // So record this global sequential unique id (the userId in this case).
          // If we find the gsuid again, then check if the email address has changed.
          // If it has been changed then:
          // 1. Set the emailIsUnused flag to true again
          // 2. clear out the variable tracking the uniqueId of the record.
          uniqueIdOfRecordHoldingCandidateEmailAddress = lineObject.userId;
        }
        // The matching record we found has been deleted so it may as well not exist. The new record is still unique.
        else 
        {
          emailIsUnused = true;
        } 
      } // End of: if we found a matching entry

      // If we have seen this primary key before and flagged the email address already taken 
      // because it was identical to the email address we are trying to add and it had not been deleted:

      // Ok, the current record is not holding the candidate email address but 
      // maybe it was in the past and someone changed it.
      // if the candidate email address is flagged unavailable and we are looking at the record that was flagged:
      else if(emailIsUnused === false && uniqueIdOfRecordHoldingCandidateEmailAddress === lineObject.userId)
      {
        // Check if the email address is no longer holding the candidate email address.
        // If it is not holding the candidate email address then flag the email address 
        // available again and clear out the variable tracking this primary key.
        emailIsUnused = true;
        uniqueIdOfRecordHoldingCandidateEmailAddress = false;
      }

    }); // End of: readInterface.on('line', function(line){...}
    // End of: Look at each record...

    // This listener fires after we have discovered if the email address is 
    // unique or not, and have then closed the readable stream from dbUsers.
    // The callback function defined here will append the record if the email 
    // address was found to be unique.
    readInterface.on('close', function() 
    {
      if (emailIsUnused) // The email address is unique so proceed with append operation.
      {
        // Hash the password
        var hashedPassword = helpers.hash(password);

        if(hashedPassword) // The hash function successfully returned the hashed password.
        {
          // Specify the amount of unique IDs needed.
          // 1 for userId in dbUsers, 
          // 2 for logId in dbLog,
          // 1 for TransactionId in dbLog to handle a possible rollback.
          // Later a batchId will be added for batch adds, updates, and deletes.s
          let idRange = 4;

          // Get the next global sequential unique Id and lock the database
          // Locking the database makes the system multiuser.
          // All writes to any table must first get a lock on gsuid.json
          // gsuid.json stays locked until the operation is completely finished and _data.removeLock is called.
          // This ensures that only one process is writing to the database at any one time.          
          _data.nextId(idRange, function(error, nextIdObject)
          {
            // if we were able to lock the gsuid.json file and get the next unique id number for this record
            if(!error && nextIdObject)
            {
              // Create the user object. 
              // This object will be appended to dbUsers.json.
              var userObject = 
              {
                  "userId" : nextIdObject.nextId,
                  "email" : email,
                  "hashedPassword" : hashedPassword,
                  "timeStamp" : Date.now(),
                  "deleted" : false
              };

              // Create the logObject.
              // This object will be written to dbLog.json which maintains a history of 
              // all changes to all tables in the database.
              var logObject =
              {
                "TransactionId" : nextIdObject.nextId + 1,            
                "logId" : nextIdObject.nextId + 2,    
                "rollback" : false,
                "process" : "aHandlers._users.post",
                "comment" : "Post new record",
                "who" : "No login yet",    
                "dbUsers" : userObject   
              }

              // Calling the function which creates an entry into the database log file.
              _data.append
              (
                'dbHistory', 
                'dbLog', 
                logObject, 
                function(err)
                {
                  if (!err)  //The dbLog file has been appended to successfully.
                  {
                    // Calling the function which appends a record to the file dbUsers.json
                    _data.append
                    (
                      '/dbPermissions/dbUsers', 
                      'dbUsers', 
                      userObject, 
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
                                'nx0xkbqr92hequnnegto' + '\n' +
                                'Successful write to dbUsers but unable to remove lock on database' + '\n' +
                                'The following record was appended to dbUsers:' + '\n' +                            
                                JSON.stringify(logObject) + '\n' +   
                                'The following was the error message:' + '\n' +                                             
                                error + '\n'
                              ); // End of: helpers.log // Log the error.

                              callback(500, {'Error' : 'Successful write to dbUsers but unable to remove lock on database'});

                            } // End of: else Good write but unable to remove lock on database.

                          } // End of callback code which is run after attempting to remove the lock.
                          ); // End of: _data.removeLock(function(error){...}
                          // End of: Call to function which removes lock

                        }    // End of: if (!err)  //The file has been appended to successfully.
                        else // There was an error appending to dbUsers.
                        {
                          helpers.log // Log the error.
                          (
                            5,
                            'oynxrq4bi74o9efvhzbj' + '\n' +
                            'There was an error when appending to the dbUsers file.' + '\n' +
                            'The following record may or may not have been appended to dbUsers:' + '\n' +                            
                            JSON.stringify(logObject) + '\n' +
                            'Attempting to rollback the entry.' + '\n' +    
                            'The following was the error message:' + '\n' +                                             
                            err + '\n'
                          );

                          // Assemble rollback record for the dbUsers file which will negate previous entry if any.  
                          userObject = 
                          {
                              "userId" : nextIdObject.nextId,
                              "email" : email,
                              "hashedPassword" : hashedPassword,
                              "timeStamp" : Date.now(),
                              "deleted" : true
                          };                        

                          // Assemble rollback record for the dbLog file which will negate previous entry if any.
                          logObject =
                          {
                            "TransactionId" : nextIdObject.nextId + 1,                        
                            "logId" : nextIdObject.nextId + 3,    
                            "rollback" : true,
                            "process" : "aHandlers._users.post",
                            "comment" : "Error posting. Appending a delete.",                        
                            "who" : "Function needed",    
                            "dbUsers" : userObject   
                          }

                          // Start the rollback process.
                          _data.append // Append a rollback the entry in dbLog.
                          (
                            'dbHistory', 
                            'dbLog', 
                            logObject, 
                            function(err)
                            {
                              if (!err) // The roll back entry in dbLog was appended successfully.
                              {
                                // Calling the function which appends a record to the file dbUsers.json
                                _data.append
                                (
                                  '/dbPermissions/dbUsers', 
                                  'dbUsers', 
                                  userObject, 
                                  function(err)
                                  {
                                    if (!err) // The rollback record for dbUsers was appended successfully.
                                    {
                                      helpers.log
                                      (
                                        5,
                                        'uv6z3xrz7bquio9dqeci' + '\n' +
                                        'Rollback entry in the dbUsers file was appended successfully' + '\n' +
                                        'The following was the record we rolled back:' + '\n' +
                                        JSON.stringify(logObject) + '\n'                                   
                                      ); // End of: helpers.log(...)
                                    }
                                    else // There was an error when rolling back record for dbUsers.
                                    {
                                      helpers.log
                                      (
                                        7,
                                        'wp2bc2t9l2lo02tkwxkt' + '\n' +
                                        'There was an error appending a rollback entry in the dbUsers file' + '\n' +
                                        'The following record may or may not have been rolled back:' + '\n' +
                                        JSON.stringify(logObject) + '\n' +   
                                        'An error here does not necessarily mean the deleteing append to dbUsers did not happen.' + '\n' +                                        
                                        'CHECK TO SEE IF dbLog and dbUsers ARE STILL IN SYNC' + '\n' + 
                                        'The following is the error message:' + '\n' +                                                                     
                                        err  + '\n'
                                      ); // End of: helpers.log(...)
                                    }

                                  } // End of: callback function(err){...}
                                ); // End of: _data.append(...)

                              } // End of: The roll back entry in dbLog was appended successfully.
                              else // There was an error when appending a rollback entry in dbLog.
                              { 
                                helpers.log
                                (
                                  7,
                                  'tg5xm6k7vvofwxp789o0' + '\n' +
                                  'There was an error appending a rollback entry in the dbLog file' + '\n' +
                                  'A rollback entry may or may not have been written in the dbUsers file' + '\n' +  
                                  'CHECK TO SEE IF dbLog and dbUsers ARE STILL IN SYNC' + '\n' +                                      
                                  'The following was the record we tried to roll back:' + '\n' +
                                  JSON.stringify(logObject) + '\n' +        
                                  'The following is the error message:' + '\n' +
                                  err  + '\n'
                                );
                              } // End of: else There was an error when appending a rollback entry in dbLog.
                            } // End of: callback function(err){...}
                          ); // End of: _data.append(...)

                          callback(500, {'Error' : 'Could not create the new user.'});

                        } // End of: else // There was an error appending to dbUsers.
                      } // End of: callback function
                      ); // End of: Calling the function which appends a record to the file dbUsers.json 

                  } //End of: The dbLog file has been appended to successfully.
                  else // There was an error appending to the dbLog file.
                  {
                    helpers.log
                    (
                      7,
                      'u9w77t06613xh1b1fwo6' + '\n' +
                      'There was an error appending to the dbLog file' + '\n' +
                      'An error here does not necessarily mean the append to dbLog did not happen.' + '\n' +  
                      'But an error at this point in the code surely means there was no append to dbUsers' + '\n' +                                          
                      'CHECK TO SEE IF dbLog and dbUsers ARE STILL IN SYNC' + '\n' +                    
                      'The following was the record we tried to append:' + '\n' +
                      JSON.stringify(logObject) + '\n' +                   
                      'The following is the error message:' + '\n' +                  
                      err  + '\n'
                    );

                    callback(500, {'Error' : 'Could not create the new user.'});
                  }
                } // End of: callback function
              ); // End of: _data.append(dbHistory, dbLog...)
              // End of: Calling the function which creates an entry into dbLog. 

            } // End of: if we were able to lock the gsuid.json file and get the next unique id number for this record
            else // We were unable to get the next gsuid.
            {
              helpers.log
              (
                5,
                'fkk9ccm69fhi2ihcohr0' + '\n' +
                'Unable to get the next gsuid.' + '\n' +
                'The following was the error' + '\n' +
                JSON.stringify(error) + '\n'                                   
              ); // End of: helpers.log(...)

              callback('Unable to get the next gsuid.');
            }

          }); // End of: lib.nextId(function(err, nextIdObject)

        } // End of: The hash function successfully returned the hashed password.
        else // The password was not hashed successfully.
        {
          helpers.log
          (
            5,
            'ss1dgd6y1qva11tca7s3' + '\n' +
            'Could not hash the user\'s password' + '\n'                                  
          ); // End of: helpers.log(...)

          callback(500, {'Error' : 'Could not hash the user\'s password'});
        } // End of: else the password was not hashed successfully.

      }
      else // The email address already exists so exit this process without appending the record.
      {      
        helpers.log
        (
          5,
          '1trx8iyyv07jk0e6spuh' + '\n' +
          'The email address: ' + email + ' already exists' + '\n'                                  
        ); // End of: helpers.log(...)

        callback(400, {'Error' : 'The email address already exists'});
      }      

    }); // End of: readInterface.on('close', function(){...}

  } // End of: If field validation has been passed successfully.
  else // Field validation failed.
  {
    helpers.log
    (
      5,
      '822ilaf6jt36lxymtdoe' + '\n' +
      'Missing required fields' + '\n'                                  
    ); // End of: helpers.log(...)

      callback(400, {'Error' : 'Missing required fields'});
  } // End of: else field validation failed.

}; // End of: handlers._users.post = function(...
// End of: Users - post subhandler




// Define the users get subhandler function.
// Streams the dbUsers file or part of it back to the client.
handlers._users.get = function(data, callback)
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
      // In this case the queryString is coming from dbUsersEdit page.
      queryString = data.queryString
    }
    else
    {
      // In this case the queryString is comming from the dbUsersList page.
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
          queryArray[elementIndex] = "\\";
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
    proceedWithLoop = true;

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


  
  // Create an empty map data structure which will be used to merge user records with the same email address.
  // Chose map data structure over objects because maps are guaranteed to maintain the same order where as objects are not.
  let usersMap = new Map();
  
  // This function sets up a stream where each chunk of data is a complete line in the dbUsers file.
  let readInterface = readline.createInterface
  (
    { // specify the file to be read.
      input: fs.createReadStream(_data.baseDir + '/dbPermissions/dbUsers' + '/' + 'dbUsers' + '.json'),
    }
  );



  // Look at each record in the file.
  readInterface.on('line', function(line) 
  {
    // Convert the JSON string (a single line from the dbUsers file) into lineValueObject.
    // These objects will written back to a new file after deleting some un-needed key/value pairs.
    let lineValueObject = JSON.parse(line);
    let recordWasDeleted = false;    

    // Declare a variable to serve as a key in the map to manage the lineValueObject.
    let userId = lineValueObject.userId;      

    if(lineValueObject.deleted === true) // if the record in the file dbUsers.json had the delete field set to true:
    {
      // Remove this record from the map 
      usersMap.delete(userId);
      recordWasDeleted = true;
    }
    else if(amountOfWhereClauses > 0) // else if the user created one or more filter expressions
    {
      let whereClauseCount = 1; // Represents the filter expression we are currently evaluating.
      let index = 1; // Used to navigate the queryArray.
      let shouldDeleteThisRecord = false;
      let shouldLoopAgain = true;
  
      while(whereClauseCount <= amountOfWhereClauses && shouldLoopAgain === true)
      {
        switch(queryArray[index + 1]) 
        {
          case 'MatchesExactly': // 1
          {
            if(lineValueObject[queryArray[index]] != queryArray[index + 2])
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;

          case 'MatchesExactlyNotCaseSensitive': // 2
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase() != queryArray[index + 2].toString().toLowerCase())
            {
              shouldDeleteThisRecord = true;
            }             
          }
          break;
          
          case 'DoesNotMatchExactly': // 3
            {
              if(lineValueObject[queryArray[index]] == queryArray[index + 2])
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;

          case 'DoesNotMatchExactlyNotCaseSensitive': // 4
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase() == queryArray[index + 2].toString().toLowerCase())
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;

          case 'BeginsWith': // 5
          {
            if(lineValueObject[queryArray[index]].toString().indexOf(queryArray[index + 2].toString()) != 0)
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;
          
          case 'BeginsWithNotCaseSensitive': // 6
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase().indexOf(queryArray[index + 2].toString().toLowerCase()) != 0)
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;    

          case 'DoesNotBeginWith': // 7
          {
            if(lineValueObject[queryArray[index]].toString().indexOf(queryArray[index + 2].toString()) == 0)
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;

          case 'DoesNotBeginWithNotCaseSensitive': // 8
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase().indexOf(queryArray[index + 2].toString().toLowerCase()) == 0)          
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;          

          case 'Contains': // 9
          {
            if(lineValueObject[queryArray[index]].toString().indexOf(queryArray[index + 2].toString()) == -1)
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;

          case 'ContainsNotCaseSensitive': // 10
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase().indexOf(queryArray[index + 2].toString().toLowerCase()) == -1)          
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;

          case 'DoesNotContain': // 11
          {
            if(lineValueObject[queryArray[index]].toString().indexOf(queryArray[index + 2].toString()) > -1)
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;

          case 'DoesNotContainNotCaseSensitive': // 12
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase().indexOf(queryArray[index + 2].toString().toLowerCase()) > -1)          
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;

          case 'EndsWith': // 13
          {
            if(!lineValueObject[queryArray[index]].toString().endsWith(queryArray[index + 2].toString()))
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;
          
          case 'EndsWithNotCaseSensitive': // 14
          {
            if(!lineValueObject[queryArray[index]].toString().toLowerCase().endsWith(queryArray[index + 2].toString().toLowerCase()))
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;
          
          case 'DoesNotEndWith': // 15
          {
            if(lineValueObject[queryArray[index]].toString().endsWith(queryArray[index + 2].toString()))
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;
          
          case 'DoesNotEndWithNotCaseSensitive': // 16
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase().endsWith(queryArray[index + 2].toString().toLowerCase()))
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;

          case 'IsGreaterThan': // 17
          {
            if(lineValueObject[queryArray[index]] <= queryArray[index + 2])
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;          
          
          case 'IsGreaterThanNotCaseSensitive': // 18
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase() <= queryArray[index + 2].toString().toLowerCase())
            {
              shouldDeleteThisRecord = true;
            }
          }
          break; 
          
          case 'IsGreaterThanOrEqualTo': // 19
          {
            if(lineValueObject[queryArray[index]] < queryArray[index + 2])
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;
          
          case 'IsGreaterThanOrEqualToNotCaseSensitive': // 20
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase() < queryArray[index + 2].toString().toLowerCase())
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;
          
          case 'IsLessThan': // 21
          {
            if(lineValueObject[queryArray[index]] >= queryArray[index + 2])
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;

          case 'IsLessThanNotCaseSensitive': // 22
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase() >= queryArray[index + 2].toString().toLowerCase())
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;                
          
          case 'IsLessThanOrEqualTo': // 23
          {
            if(lineValueObject[queryArray[index]] > queryArray[index + 2])
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;          
          
          case 'IsLessThanOrEqualToNotCaseSensitive': // 24
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase() > queryArray[index + 2].toString().toLowerCase())
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;          
                      
          default: // When there are no case matches then do this.
          {

          }

        } // End of: switch(queryArray[index + 1])               
             
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
            usersMap.delete(userId);
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

    //If the records was not marked for deletion and passed through the filters above:
    if(recordWasDeleted == false)
    {
      // Remove the hashed password key/value pair from the lineValueObject before returning it to the requester.
      delete lineValueObject.hashedPassword; 

      // Remove the deleted key/value pair from the lineValueObject before returning it to the requester.
      delete lineValueObject.deleted;            

      // Update this record in the map.
      usersMap.set(userId, lineValueObject);
    }

  }); // End of: readInterface.on('line', function(line){...}
  // End of: Look at each record...


  // This listener fires after we have looked through all the records in the dbUsers file.
  // The callback function defined here will stream the list of users back to the clients browser.
  readInterface.on('close', function() 
  {          
    // This readable stream will be used to write the result of the merge to a new file.
    const sourceStream = new Readable(); 

    for (const [key, valueObject] of usersMap)
    {
      // Convert the data object to a string.
      let stringData = JSON.stringify(valueObject);     

      // Load the readable stream with data.
      sourceStream.push(stringData + '\n');                  
    }       

    // Tell the stream no more data is coming.
    sourceStream.push(null);     

    callback(200, sourceStream, 'stream');             

  }); // End of: readInterface.on('close', function(){...}   

}; // End of: handlers._users.get = function(data, callback){do stuff}
// End of: Define the users get subhandler function.




// Users - put handler
// Define the user's put subhandler function 
// This function updates a record.
// Required data: userId
// Optional data: email, password
// Note: At least one of the optional arguments must be specified.
handlers._users.put = function(data, callback){

  // Several different record sets with the supplied email address and the same userId 
  // may exist already if the record has been changed or deleted prior to this operation.

  // A modified record is simply a new record with the same userId as an existing record.
  // The newest record is the valid record and the older record is history.  
  // So position matters. These tables should never be sorted.
  // These tables can be packed however to get rid of historical records.

  // The transaction log also maintains the history and the current state of the entire database.
  // So the transaction log can be used to check the integrity of the every table.
  // No records in the transaction log should be removed.

  // A deleted record in this system is simply an identical record appended with 
  // the deleted field set to true. 
  // So depending on how many times the email address has been added and deleted there may 
  // be several sets of records in the dbUsers table currently that have the same email 
  // address and the same userId.
  // The table can be packed occasionally to get rid of these deleted record sets. 
  // Deletes are handled as appends with the deleted field set to true because real 
  // deletes tie up the table for a long time.

  // In this table, the email address is a unique key as well as the userId.
  // The difference is that the userId may never change whereas the email address
  // may be changed to something different if if a valid record for that email
  // address does not already exist.

  // When adding a record we first make sure that the record does NOT already exist.
  // There should be no record with the current email address or if there is then 
  // the last record with this email address must have the deleted field set to true.

  // When changing a record we:
  // 1. Make sure that the record with this userId does indeed exist and...
  // 2. that the last instance of a record with this userId is not deleted.

  // It is ok to add a new record with this same email address again when the last instance 
  // of this record encountered in the stream has the deleted flag set to true. 
  // In that case, the userId will be different but the email address will be the same.         

  // As we are modifying here, only the last matching record for a particular userId matters.
  // It's like that old game "She loves me, She loves me not".  


  // Create variables for the post from the clients request object.
  // The variables will be loaded from the object if validation is passed otherwise will be assigned the value false.

  // Check the required userId is of type string. 
  // If not then set to boolean false.
  // Then convert the userId to a number
  let userId = typeof(data.payload.userId) == 'string' ? parseInt(data.payload.userId, 10) : false;
  let email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
  let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  let deleted = typeof(data.payload.deleted) === 'string' && data.payload.deleted === "true" ? true : false;

  //if either field passed the validation process above then do the following.
  if(userId && (email || password || deleted))
  {
    // Specify the amount of unique IDs needed.
    // 2 for logIds in dbLog,
    // 1 for TransactionId in dbLog to handle a possible rollback.
    // Later a batchId will be added for batch adds, updates, and deletes.s
    let idRange = 3;

    // Get the next global sequential unique Id and lock the database
    // Locking the database makes the system multiuser.
    // All writes to any table must first get a lock on gsuid.json
    // gsuid.json stays locked until the operation is completely finished and _data.removeLock is called.
    // This ensures that only one process is writing to the database at any one time.          
    _data.nextId(idRange, function(error, nextIdObject)
    {
      // if we were able to lock the gsuid.json file and get the next unique id number for this record
      if(!error && nextIdObject)
      {
        // Create the user object. 
        // This object will be appended to dbUsers.json.
        // Add in the data that is currently available.            
        var userObject = 
        {
            "userId" : userId,      
            "email" : email,                            
        };

        dataObject = {};
        dataObject.userId = userObject.userId;
        dataObject.email = userObject.email;        
        dataObject.queryString = 'WHERE:;userId:;MatchesExactly:;' + userId + ':;';


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
              let recordObject = JSON.parse(stringContainer);


              if(password) // The user wants to change the password.
              {
                // Hash the password
                let hashedPassword = helpers.hash(password);
          
                if(!hashedPassword) // The password was not hashed successfully.
                {
                  helpers.log
                  (
                    5,
                    'vcblc3iywlq9wkcr47zu' + '\n' +
                    'Could not hash the user\'s password' + '\n'                                  
                  ); // End of: helpers.log(...)
          
                  return callback(500, {'Error' : 'Could not hash the user\'s password'});

                } // End of: If the password was not hashed successfully.

                // Saving hash of the password supplied by the user.
                userObject.hashedPassword = hashedPassword;  

              } // End of: if(password) // User wants to change the password.
              else// The user did not supply and new password.
              {
                // saving hash of password from the most recent record.
                userObject.hashedPassword = recordObject.hashedPassword;
              }

              if(!email) // The user did not wish to change the email address. No email address was supplied
              {
                // Saving email address from the most recent record.
                userObject.email = recordObject.email;
              }

              userObject.timeStamp = Date.now();   
              
              if(deleted)
              {
                userObject.deleted = true; 
              }
              else
              {
                userObject.deleted = false;                 
              }
                    
              // Everything else I need to do with userObject goes here.    

              // Create the logObject.
              // This object will be written to dbLog.json which maintains a history of 
              // all changes to all tables in the database.
              var logObject =
              {
                "TransactionId" : nextIdObject.nextId + 1,            
                "logId" : nextIdObject.nextId + 2,    
                "rollback" : false,
                "process" : "aHandlers._users.put",
                "comment" : "Appending an edit",
                "who" : "No login yet.",    
                "dbUsers" : userObject   
              }

              // Calling the function which creates an entry into the database log file.
              _data.append
              (
                'dbHistory', 
                'dbLog', 
                logObject, 
                function(err)
                {
                  if (!err)  //The dbLog file has been appended to successfully.
                  {
                    // Calling the function which appends a record to the file dbUsers.json
                    _data.append
                    (
                      '/dbPermissions/dbUsers', 
                      'dbUsers', 
                      userObject, 
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
                                'k9qw26hj7wa1od4u2bvs' + '\n' +
                                'Successful write to dbUsers but unable to remove lock on database' + '\n' +
                                'The following record was appended to dbUsers:' + '\n' +                            
                                JSON.stringify(logObject) + '\n' +   
                                'The following was the error message:' + '\n' +                                             
                                error + '\n'
                              ); // End of: helpers.log // Log the error.

                              callback(500, {'Error' : 'Successful write to dbUsers but unable to remove lock on database'});

                            } // End of: else Good write but unable to remove lock on database.

                          } // End of callback code which is run after attempting to remove the lock.
                          ); // End of: _data.removeLock(function(error){...}
                          // End of: Call to function which removes lock

                        }    // End of: if (!err)  //The file has been appended to successfully.
                        else // There was an error appending to dbUsers.
                        {
                          helpers.log // Log the error.
                          (
                            5,
                            '24vg75vjixquqw7s1gdi' + '\n' +
                            'There was an error when appending to the dbUsers file.' + '\n' +
                            'The following record may or may not have been appended to dbUsers:' + '\n' +                            
                            JSON.stringify(logObject) + '\n' +
                            'Attempting to rollback the entry.' + '\n' +    
                            'The following was the error message:' + '\n' +                                             
                            err + '\n'
                          );

                          // Assemble rollback record for the dbUsers file which will negate previous entry if any.  
                          userObject = 
                          {
                              "userId" : recordObject.nextId,
                              "email" : recordObject.email,
                              "hashedPassword" : recordObject.hashedPassword,
                              "timeStamp" : recordObject.timeStamp,
                              "deleted" : recordObject.deleted
                          };                        

                          // Assemble rollback record for the dbLog file which will negate previous entry if any.
                          logObject =
                          {
                            "TransactionId" : nextIdObject.nextId + 1,                        
                            "logId" : nextIdObject.nextId + 3,    
                            "rollback" : true,
                            "process" : "aHandlers._users.put",
                            "comment" : "Error during Put. Appending rollback",                        
                            "who" : "No login yet",    
                            "dbUsers" : userObject   
                          }

                          // Start the rollback process.
                          _data.append // Append a rollback the entry in dbLog.
                          (
                            'dbHistory', 
                            'dbLog', 
                            logObject, 
                            function(err)
                            {
                              if (!err) // The roll back entry in dbLog was appended successfully.
                              {
                                // Calling the function which appends a record to the file dbUsers.json
                                _data.append
                                (
                                  '/dbPermissions/dbUsers', 
                                  'dbUsers', 
                                  userObject, 
                                  function(err)
                                  {
                                    if (!err) // The rollback record for dbUsers was appended successfully.
                                    {
                                      helpers.log
                                      (
                                        5,
                                        '421raafd6z79q6ohh3tp' + '\n' +
                                        'Rollback entry in the dbUsers file was appended successfully' + '\n' +
                                        'The following was the record we rolled back:' + '\n' +
                                        JSON.stringify(logObject) + '\n'                                   
                                      ); // End of: helpers.log(...)
                                    }
                                    else // There was an error when rolling back record for dbUsers.
                                    {
                                      helpers.log
                                      (
                                        7,
                                        'pbdomte2gk74n1vrimeb' + '\n' +
                                        'There was an error appending a rollback entry in the dbUsers file' + '\n' +
                                        'The following record may or may not have been rolled back:' + '\n' +
                                        JSON.stringify(logObject) + '\n' +   
                                        'An error here does not necessarily mean the deleteing append to dbUsers did not happen.' + '\n' +                                        
                                        'CHECK TO SEE IF dbLog and dbUsers ARE STILL IN SYNC' + '\n' + 
                                        'The following is the error message:' + '\n' +                                                                     
                                        err  + '\n'
                                      ); // End of: helpers.log(...)
                                    }

                                  } // End of: callback function(err){...}
                                ); // End of: _data.append(...)

                              } // End of: The roll back entry in dbLog was appended successfully.
                              else // There was an error when appending a rollback entry in dbLog.
                              { 
                                helpers.log
                                (
                                  7,
                                  'v8oyld7ijegkj2hujvty' + '\n' +
                                  'There was an error appending a rollback entry in the dbLog file' + '\n' +
                                  'A rollback entry may or may not have been written in the dbUsers file' + '\n' +  
                                  'CHECK TO SEE IF dbLog and dbUsers ARE STILL IN SYNC' + '\n' +                                      
                                  'The following was the record we tried to roll back:' + '\n' +
                                  JSON.stringify(logObject) + '\n' +        
                                  'The following is the error message:' + '\n' +
                                  err  + '\n'
                                );
                              } // End of: else There was an error when appending a rollback entry in dbLog.
                            } // End of: callback function(err){...}
                          ); // End of: _data.append(...)

                          callback(500, {'Error' : 'Could not create the new user.'});

                        } // End of: else // There was an error appending to dbUsers.
                      } // End of: callback function
                      ); // End of: Calling the function which appends a record to the file dbUsers.json 

                  } //End of: The dbLog file has been appended to successfully.
                  else // There was an error appending to the dbLog file.
                  {
                    helpers.log
                    (
                      7,
                      'wp1m0m4ebxz01wcls8qd' + '\n' +
                      'There was an error appending to the dbLog file' + '\n' +
                      'An error here does not necessarily mean the append to dbLog did not happen.' + '\n' +  
                      'But an error at this point in the code surely means there was no append to dbUsers' + '\n' +                                          
                      'CHECK TO SEE IF dbLog and dbUsers ARE STILL IN SYNC' + '\n' +                    
                      'The following was the record we tried to append:' + '\n' +
                      JSON.stringify(logObject) + '\n' +                   
                      'The following is the error message:' + '\n' +                  
                      err  + '\n'
                    );

                    callback(500, {'Error' : 'Could not create the new user.'});
                  }
                } // End of: callback function
              ); // End of: _data.append(dbHistory, dbLog...)
              // End of: Calling the function which creates an entry into dbLog. 

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
          else // There was indeed an error returned by getHashedPass when attempting to get the most current record.
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
                    'bxpa2p2t7ps3wrd1dqu7' + '\n' + 
                    'The following was the error message from getMostRecent:' + '\n' +                                             
                    errorFromGetMostRecent + '\n'                                                 
                  ); // End of: helpers.log // Log the error.

                  callback(500, {'Error' : errorFromGetMostRecent});      
                }
              }
              else // Error from getMostRecent and also unable to remove lock on database.
              {
                if(errorFromGetMostRecent)
                {
                  helpers.log // Log the error.
                  (
                    7,
                    'wew0wiqnv6gt502zsqew' + '\n' +
                    'The following was the error message from getMostRecent:' + '\n' +                                             
                    errorFromGetMostRecent + '\n'  +
                    'Also unable to remove lock on database.' + '\n' + 
                    'The following was the error message from removeLock:' + '\n' +                                      
                    errorFromRemoveLock + '\n'
                  ); // End of: helpers.log // Log the error.

                  callback(500, {'Error' : errorFromGetMostRecent + " and " + errorFromRemoveLock});      
                }
              } // End of: else Good write but unable to remove lock on database.

            } // End of callback code which is run after attempting to remove the lock.
            ); // End of: _data.removeLock(function(error){...}
            // End of: Call to function which removes lock after failed read from getHashedPass
          } // End of: Else // There was indeed an error returned by getHashedPass when attempting to get the most current record.
        }); //End of: helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)
      } // End of: if we were able to lock the gsuid.json file and get the next unique id number for this record
      else // We were unable to get the next gsuid.
      {
        helpers.log
        (
          5,
          '4zyouw8e65t2uhg4eytv' + '\n' +
          'Unable to get the next gsuid.' + '\n' +
          'The following was the error' + '\n' +
          JSON.stringify(error) + '\n'                                   
        ); // End of: helpers.log(...)

        callback('Unable to get the next gsuid.');
      } // End of: Else unable to get the next gsuid.

    }); // End of: lib.nextId(function(err, nextIdObject)

  } // End of: If field validation has been passed successfully.
  else // Field validation failed.
  {
    helpers.log
    (
      5,
      '8eaiwh3s1ng6pxwnba3t' + '\n' +
      'Missing required fields' + '\n'                                  
    ); // End of: helpers.log(...)

      callback(400, {'Error' : 'Missing required fields'});
  } // End of: else field validation failed.
}; // End of: handlers._users.put = function(...
// End of: Define the user's put subhandler function




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