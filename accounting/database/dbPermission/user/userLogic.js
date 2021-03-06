/*
/ Handlers for the "user" table.
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
const _data = require('../../../../lib/aData');
const helpers = require('../../../../lib/aHelpers');


// Create a container for all the handlers
let user = {};




// Define the handler function that serves up the HTML page for searching and listing user records.
// Behavior from meta.js at gg9ec14lo9rqjk7kxz7f
user.serveListPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : 'User List',
      'body.class' : 'userList',     
      'tableName':'user',
      "tableLabel":"User",    
      'head.clientCode' : '', // The HTML header template must see something or an empty string.         
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/database/dbPermission/user/userList', templateData, function(errorGetTemplate, str)
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
              'yj3wysqqq4mp7jzq1h4b' + '\n' +
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
          'f07iragc6fl6u48ghzqp' + '\n' +
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
      'uj4nh57p68p0fxrdeur8' + '\n' +
      'Method not get. Only gets allowed.' + '\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: user.serveListPage = function(data, callback){...}
// End of:// Define the handler function that serves up the HTML page for searching and listing user records.




// Define the handler function that serves up the HTML page for creating new user records.
// Behavior from meta.js at xenz5eipqot8nym0eev3
user.serveAddPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : 'Create a New User',
      'head.description' : 'For creating a new user record',
      'body.class' : 'userAdd', 
      'head.clientCode' : '', // The HTML header template must see something or an empty string.      
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/database/dbPermission/user/userAdd', templateData, function(errorGetTemplate, str)
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
              'nu8wxpsmka5luel5jc6p' + '\n' +
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
          'qzh30rn6tl513yaurslq' + '\n' +
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
      'n0ij9hjyxguzm1lekbdc' + '\n' +
      'Method not get. Only gets allowed.' + '\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: user.serveAddPage = function(data, callback){...}
// End of: Define the handler function that serves up the HTML page for creating new user records.




// Define the handler function that serves up the HTML page for editing user records.
// Behavior from meta.js at 2a4tb24fsq3de66ti8c4
user.serveEditPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : 'Edit a User',     
      'body.class' : 'userEdit',
      'selected.userId' : data.queryStringObject.userId,  
      'head.clientCode' : '', // The HTML header template must see something or an empty string.     
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/database/dbPermission/user/userEdit', templateData, function(errorGetTemplate, str)
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
              'uk1fwfwn4d2j9b495rku' + '\n' +
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
          'ntnko8zg2rtbg09sfacy' + '\n' +
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
      'ltes923oxx9fvk3kp4hx' + '\n' +
      'Method not get. Only gets allowed.' + '\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: user.serveEditPage = function(data, callback){...}
// End of: Define the handler function that serves up the HTML page for editing user records.




// Router for user functions
// Define a function which calls the requested get, post, put, or delete subhandler function for user 
// and passes to the chosen subhandler the client's request object and the callback function.
// Behavior from meta.js at lw39etuyhw7wb82hv9ct
user.user = function(data, callback)
{
  // Create an array of acceptable methods.
  var acceptableMethods = ['post', 'get', 'put'];

  // if the requested method is one of the acceptable methods:
  if (acceptableMethods.indexOf(data.method) > -1) 
  {
    // then call the appropriate user subhandler.
    user._user[data.method](data, callback);
  } 
  // Otherwise the method was not one of the acceptable methods:
  else 
  {
    helpers.log
    (
      5,
      'z4yt9e5udhgty4unamde' + '\n' +
      'The method was not one of the acceptable methods' + '\n'
    ); 

    // so send back status 405 (Not Allowed).
    callback(405);
  }
}; // End of: user.user = function(data, callback){...}
//End of: Router for user functions




// Create a subobject within the handlers object for the user submethods (post, get, put, and delete)
user._user = {};




// user - post subhandler
// Define the user post subhandler function.
// This function appends a record to the user file.
// Behavior from meta.js at 1723qxikk1l3ru0vfrny 
user._user.post = function(data, callback)
{
  // Field validation starts here.
  // Get email from payload
  let email = data.payload["email"];

  // passIfString Default behavior from meta.js at qif5xwvzgr7efln9xtr8
  if(typeof(email) != 'string'){return callback(400, {'Error' : 'email must be of datatype string'});}

  // passIfNotEmpty Default behavior from meta.js at eojwivwlhxkm1b837n2o
  if(!email || email.trim().length === 0){return callback(400, {'Error' : 'No email was entered'});}else{email = email.trim()}

  // passIfHasAmpersand
  // Behavior from data dictionary at uet9z3uuzgy5hmytmsxf 
  if(email.indexOf("@") === -1){return callback(400, {'Error' : 'Not a valid email'});}

  // Get password from payload
  let password = data.payload["password"];

  // passIfString Default behavior from meta.js at qif5xwvzgr7efln9xtr8
  if(typeof(password) != 'string'){return callback(400, {'Error' : 'password must be of datatype string'});}

  // passIfNotEmpty
  // Behavior from data dictionary at bet9z4ufzg97hmfdhmxt 
  if(!password){return callback(400, {'Error' : 'No password was entered'});}

  // passIfHasNumber
  // Behavior from data dictionary at 5et9z9uuzgy5hmfdmmxf 
  // declare a function used to check if the password has a number in it. 
  function passwordDoesNotHaveNumber (password) 
  { 
    let str = String(password); 

    for( let i = 0; i < str.length; i++) 
    { 
      if(!isNaN(str.charAt(i))) 
      { 
        return false; 
        break; 
      } 
    } 
    return true; 
  }; 

  if(passwordDoesNotHaveNumber(password)){return callback(400, {'Error' : 'password must contain a number.'});}; 


  // Enforcing uniqueness of the email field.
  // Will toggle this to false if we find the email already exists in user.
  // Behavior from meta.js at rmkfkaef7xo3gyvnvgm4
  let email_IsUnused = true;  

  // Using this to track the primary key of a record that we might encounter with the candidate email.
  // If we encounter this primary key again we will check to see if the email has been changed.
  // If it has then the candidate email will be marked as available again.
  let uniqueIdOfRecordHoldingCandidate_Email = false; 
                        

  // To ensure the email is unique we will read every record in 
  // user and compare with the email provided.

  // This function sets up a stream where each chunk of data is a complete line in the user file.
  let readInterface = readline.createInterface
  (
    { // specify the file to be read.
      input: fs.createReadStream(_data.baseDir + '/database/dbPermission/user' + '/' + 'user' + '.json')
    }
  );
  
  // Look at each record in the file and set a flag if the email matches the email provided by the user.
  readInterface.on('line', function(line) 
  {
    // Convert the JSON string from user into an object.
    let lineObject = JSON.parse(line);

    // Several different record sets with the supplied email and the same userId 
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
    // So depending on how many times the email has been added and deleted there may 
    // be several sets of records in the user table currently 
    // that have the same email and the same userId.
    // The table can be packed occasionally to get rid of these deleted record sets. 
    // Deletes are handled as appends with the deleted field set to true because real 
    // deletes tie up the table for a long time.

    // In this table, the email is a unique key as well as the userId.
    // The userId also serves as the primary key.
    // The difference is that the userId may never change whereas the email
    // may be changed to something different if a valid record for that email
    // does not already exist.    

    // When adding a record we first make sure that the record does NOT already exist.
    // There should be no record with the current email or if there is then 
    // the last record with this email must have the deleted field set to true.

    // When changing a record we:
    // 1. Make sure that the record with this email does indeed exist and...
    // 2. that the last instance of a record with this email is not deleted.
  
    // It is ok to add a new record with this same email again when the last instance 
    // of this record encountered in the stream has the deleted flag set to true. 
    // In that case, the userId will be different but the email will be the same.         

    // As explained above, only the last matching record for a particular email matters.
    // It's like that old game "She loves me, She loves me not".

    if (email == lineObject.email) // we found a matching entry
    {
      if (lineObject.deleted == false) // The record has not been deleted so it's a duplicate. Not unique.
      {
        email_IsUnused = false; // This flag used in the on close event listener below. 

        // If this record (record with this primary key) is encountered further down where it has been deleted 
        // or where the email has been changed with a put operation:
        // Then the candidate email will be available again as we continue searching through the records.
        // We are already checking if this email becomes available again by deletion.
        // Now we need to check if the email becomes available because the record with this primary 
        // key gets changed with a new email.
        // That will make the candidate email unique and available again.
        // So record this global sequential unique id (the userId in this case).
        // If we find the gsuid again, then check if the email has changed.
        // If it has been changed then:
        // 1. Set the email_IsUnused flag to true again
        // 2. clear out the variable tracking the uniqueId of the record.
        uniqueIdOfRecordHoldingCandidate_Email = lineObject.userId;
      }
      // The matching record we found has been deleted so it may as well not exist. The new record is still unique.
      else 
      {
        email_IsUnused = true;
      } 
    } // End of: if we found a matching entry

    // If we have seen this primary key before and flagged the email already taken 
    // because it was identical to the email we are trying to add and it had not been deleted:

    // Ok, the current record is not holding the candidate email but 
    // maybe it was in the past and someone changed it.
    // if the candidate email is flagged unavailable and we are looking at the record that was flagged:
    else if(email_IsUnused === false && uniqueIdOfRecordHoldingCandidate_Email === lineObject.userId)
    {
      // Check if the email is no longer holding the candidate email.
      // If it is not holding the candidate email then flag the email 
      // available again and clear out the variable tracking this primary key.
      email_IsUnused = true;
      uniqueIdOfRecordHoldingCandidate_Email = false;
    }

  }); // End of: readInterface.on('line', function(line){...}
  // End of: Look at each record...




  // This listener fires after we have discovered if the email is 
  // unique or not, and have then closed the readable stream from user.
  // The callback function defined here will append the record if the email 
  // was found to be unique.
  // Behavior from meta.js at aiwaoocd1uegzjbqeydk
  readInterface.on('close', function() 
  {
    // If the email already exists then exit this process without appending the record.
    if (!email_IsUnused) 
    {      
      helpers.log
      (
        5,
        'wj46frmx6ho39b22a222' + '\n' +
        'The email : ' + email + ' already exists' + '\n'                                  
      ); // End of: helpers.log(...)

      return callback(400, {'Error' : 'The email already exists'});
    }

    // If we made it to this point then the candidate email is unique so continue on with the append opperation.
    // Behavior from meta.js at gwwelr17hmxvq4spdrcl
    

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
          'fqn83ve3q4p02g9p1v9d' + '\n' +
          'Unable to get the next gsuid.' + '\n' +
          'The following was the error' + '\n' +
          JSON.stringify(error) + '\n'                                   
        ); // End of: helpers.log(...)

        return callback(423, {'Error' : 'Database is Locked'});
      }


      // If we got this far then we were able to lock the gsuid.json file and get the next 
      // unique id number for this record so continue on.



      // Create the user object. 
      // This object will be appended to user.json.
      // Behavior from meta.js at cmqbrt7gkxkex9z8a1qb
      let userObject = {};
      userObject.userId = nextIdObject.nextId;

      userObject.email = email;
      userObject.hashedPassword = undefined;
      
      userObject.timeStamp = Date.now();
      userObject.deleted = false;


      // Code from the data dictionary marked postHandlerPreprocessing, if any, will be inserted below.

      // Behavior from data dictionary at het9z9uuzgy5hmfwdgkz
      // Password calculation
      // Hash the password
      userObject.hashedPassword = helpers.hash(password);

      // If the password was not hashed successfully then exit this process without appending the record.
      if(!userObject.hashedPassword)
      {
        helpers.log
        (
          5,
          'het9z9uuzgy5hmfwdgkz' + '\n' +
          'Could not hash the password' + '\n'
        ); // End of: helpers.log(...)

        return callback(500, {'Error' : 'Could not hash the password'});
      } // End of: else the password was not hashed successfully.
      // End of: Password calculation
      
          
                

      // Create the logObject.
      // This object will be written to history.json which maintains a history of 
      // all changes to all tables in the database.
      var logObject =
      {
        "historyId" : nextIdObject.nextId + 1,                 
        "transactionId" : nextIdObject.nextId + 2,            
        "rollback" : false,
        "process" : "user._user.post",
        "comment" : "Post new record",
        "who" : "No login yet",    
        "user" : userObject   
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
              'nf8zn4rmyeww6gihie8i' + '\n' +
              'There was an error appending to the history file' + '\n' +
              'An error here does not necessarily mean the append to history did not happen.' + '\n' +  
              'But an error at this point in the code surely means there was no append to user' + '\n' +                                          
              'CHECK TO SEE IF history and user ARE STILL IN SYNC' + '\n' +                    
              'The following was the record we tried to append:' + '\n' +
              JSON.stringify(logObject) + '\n' +                   
              'The following is the error message:' + '\n' +                  
              err  + '\n'
            );

            return callback(500, {'Error' : 'Could not create a new user record.'});
          }



          // The history file has been appended to successfully so continue on.



          // Calling the function which appends a record to the file user.json
          _data.append
          (
          '/database/dbPermission/user', 
          'user', 
          userObject, 
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
                    'k91em7uup8h11lh30ays' + '\n' +
                    'Successful write to user but unable to remove lock on database' + '\n' +
                    'The following record was appended to the user file:' + '\n' +                            
                    JSON.stringify(logObject) + '\n' +   
                    'The following was the error message:' + '\n' +                                             
                    error + '\n'
                  ); // End of: helpers.log. Log the error.

                  return callback(500, {'Error' : 'Successful write to user but unable to remove lock on database'});

                } // End of: else Good write but unable to remove lock on database.

              } // End of callback code which is run after attempting to remove the lock.
              ); // End of: _data.removeLock(function(error){...}
              // End of: Call to function which removes lock

            }    // End of: if (!err)  //The file has been appended to successfully.
            else // There was an error appending to user.
            {
              helpers.log // Log the error.
              (
                5,
                '736vuh45awm8lzi1nmli' + '\n' +
                'There was an error when appending to the user file.' + '\n' +
                'The following record may or may not have been appended to the user file:' + '\n' +                            
                JSON.stringify(logObject) + '\n' +
                'Attempting to rollback the entry.' + '\n' +    
                'The following was the error message:' + '\n' +                                             
                err + '\n'            
              );

              // Assemble rollback record for the user file which will negate previous entry if any.                 
              userObject.timeStamp = Date.now();
              userObject.deleted = true;

              // Assemble rollback record for the history file which will negate previous entry if any.
              logObject =
              {
                "historyId" : nextIdObject.nextId + 3,                             
                "transactionId" : nextIdObject.nextId + 2,                        
                "rollback" : true,
                "process" : "user._user.post",
                "comment" : "Error posting. Appending a delete.",                        
                "who" : "Function needed",    
                "user" : userObject   
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
                    // Calling the function which appends a record to the file user.json
                    _data.append
                    (
                      '/database/dbPermission/user', 
                      'user', 
                      userObject, 
                      function(err)
                      {
                        if (!err) // The rollback record for user was appended successfully.
                        {
                          helpers.log
                          (
                            5,
                            'mjy48qzl9ez0ecjpu8rs' + '\n' +
                            'Rollback entry in the user file was appended successfully' + '\n' +
                            'The following was the record we rolled back:' + '\n' +
                            JSON.stringify(logObject) + '\n'                                   
                          ); // End of: helpers.log(...)
                        }
                        else // There was an error when rolling back record for user.
                        {
                          helpers.log
                          (
                            7,
                            'mnifl3u387ojmsxakf2s' + '\n' +
                            'There was an error appending a rollback entry in the user file' + '\n' +
                            'The following record may or may not have been rolled back:' + '\n' +
                            JSON.stringify(logObject) + '\n' +   
                            'An error here does not necessarily mean the deleting append to user did not happen.' + '\n' +                                        
                            'CHECK TO SEE IF history and user ARE STILL IN SYNC' + '\n' + 
                            'The following is the error message:' + '\n' +                                                                     
                            err  + '\n'
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
                      'us39zmwym4pi5zfu5xjr' + '\n' +
                      'There was an error appending a rollback entry in the history file' + '\n' +
                      'A rollback entry may or may not have been written in the user file' + '\n' +  
                      'CHECK TO SEE IF history and user ARE STILL IN SYNC' + '\n' +                                      
                      'The following was the record we tried to roll back:' + '\n' +
                      JSON.stringify(logObject) + '\n' +        
                      'The following is the error message:' + '\n' +
                      err  + '\n'
                    );
                  } // End of: else There was an error when appending a rollback entry in history.
                } // End of: callback function(err){...}
              ); // End of: _data.append(...) Append a rollback entry in history.

              return callback(500, {'Error' : 'Could not create the new user.'});              

            } // End of: else // There was an error appending to user.
          } // End of: callback function
          ); // End of: Calling the function which appends a record to the file user.json 
        } // End of: callback function
      ); // End of: _data.append(dbHistory...)
      // End of: Calling the function which creates an entry into history. 
    }); // End of: lib.nextId(function(err, nextIdObject)
  }); // End of: readInterface.on('close', function(){...}
}; // End of: user._user.post = function(...
// End of: user - post subhandler




// user - put handler
// Define the user put subhandler function 
// This function updates a record.
// Required data: userId
// Note: At least one other field must be specified.
// Behavior from meta.js at mzimrkdf1we1bjw96zgp
user._user.put = function(data, callback)
{
  // Field validation starts here.
  // Get userId from payload
  let userId = data.payload.userId;

  // PrimaryKey validation. 
  // Default behavior from meta.js at o65yzg6ddze2fkvcgw5s
  // If userId is a valid string then convert it to a number.  
  if (typeof(userId) === 'string'){userId = parseInt(userId, 10);}else{return callback(400, {'Error' : 'userId must be a of string type'});}

  // Get email from payload
  let email = data.payload["email"];

  // stringTypeTrimAmpersand
  // Behavior from data dictionary at og5gtmcsk6od74wkr9vj 
  // If email is of string type and is not empty 
  if (typeof(email) === 'string' && email.trim().length > 0) 
  { 
    // The user entered something in the edit form so check for an ampersand. 
    if(email.indexOf('@') != -1) 
    { 
      // pass if ampersand 
      email = email.trim() 
    } 
    else // No ampersand so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid email'}); 
    } 
  } 
  // Else, the user may have entered some other datatype like a number or 
  // perhaps nothing at all if using the Delete form or the Password form. 
  else 
  { 
    // If the user entered nothing: 
    if(email === undefined) 
    { 
      // Then user is trying to delete a record or change the password 
      email = false 
    } 
    else // The user entered something invalid so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid email'}); 
    } 
  }

  // Get password from payload
  let password = data.payload["password"];

  // passwordValidation
  // Behavior from data dictionary at e09hmheqvsxzbi50n4ny 
  // If password is of string type and is not empty 
  if (typeof(password) === 'string' && password.trim().length > 0) 
  { 
    // The user entered something in the password form so check that the 
    // user put a number in the password to make it more secure. 
    // Start out assuming that there is no number in the password. 

    // declare a function used to check if the password has a number in it. 
    function passwordHasNumber (password) 
    { 
      let str = String(password); 

      for( let i = 0; i < str.length; i++) 
      { 
        if(!isNaN(str.charAt(i))) 
        { 
          return true; 
          break; 
        } 
      } 

      return false; 
    }; 

    if(passwordHasNumber(password)) 
    { 
      // If we are here then the user inserted a number in the password. 
      // There is no need to do anything but let it pass through as is. 
      // Notice we are not trimming the password. 
      // If the user wants white space in the password, that's ok. 
    } 
    else // No number in the password so reject the edit. 
    { 
      return callback(400, {'Error' : 'password must contain a number.'}); 
    } 
  } 
  // Else, the user may have entered some other datatype like an array or 
  // perhaps nothing at all if using the Delete form or the Edit form. 
  else 
  { 
    // If the user entered nothing: 
    if(password === undefined) 
    { 
      // Then user is using the Delete form or the Edit form. 
      password = false 
    } 
    else // The user entered something invalid so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid password'}); 
    } 
  }

  
  // Check if the deleted flag is of type string and that the value is exactly equal to "true".
  // That would mean the user wants to delete the record. Otherwise the users does not want to delete the record.
  // Set deleted to boolean true if validation is passed otherwise set it to false.
  // Behavior from meta.js at ts2g5rn5uw6mvup58vph
  let deleted = typeof(data.payload.deleted) === 'string' && data.payload.deleted === "true" ? true : false;

  
  //if all fields fail validation then exit this process without writing changes to the table.
  if
  (
    !email
    &&  !password
    &&  !deleted
  )
  {
    helpers.log
    (
      5,
      'e40ococ2p7gbibyj5pju' + '\n' +
      'No fields pass the validation process' + '\n'                                  
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
        '47wkkc7dkcckxpjkx6b4' + '\n' +
        'Unable to get the next gsuid.' + '\n' +
        'The following was the error' + '\n' +
        JSON.stringify(error) + '\n'                                   
      ); // End of: helpers.log(...)

      return callback(423, {'Error' : 'Database is Locked'});
    } // End of: If lock failed or unable to get the next gsuid.


    // If we made it here then we were able to lock the gsuid.json file and get 
    // the next unique id number for this record. So continue with the process.


    // Create the user object. 
    // This object will be appended to user.json.
    // Add in all fields even if no data is available yet. 
    // This is to establish the order in which the fields will be written to the table. 
    // Behavior from 3bd1sa5ve4aqrfspunrt in meta.js         
    let userObject = {};
    userObject.userId = userId;

    userObject.email = email;
    userObject.hashedPassword = undefined;
    userObject.timeStamp = Date.now();
    userObject.deleted = false;

    let dataObject = {};
    dataObject.uniqueField01Name = "email";
    dataObject.uniqueField01Value = userObject.email;
    dataObject.path = '/database/dbPermission/user/user.json';
    dataObject.queryString = 'WHERE:;userId:;MatchesExactly:;' + userId + ':;';

    // This function returns the most recent record for this userId after checking that 
    // data for unique fields is indeed unique and that the a record with the supplied userId exists to modify.
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
                '95w48nthmorvjna7wjx9' + '\n' + 
                'The following was the error message from getMostRecent:' + '\n' +                                             
                errorFromGetMostRecent + '\n'                                                 
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
                'b9h1oto7d2utb6a4iq4w' + '\n' +
                'The following was the error message from getMostRecent:' + '\n' +                                             
                errorFromGetMostRecent + '\n'  +
                'Also unable to remove lock on database.' + '\n' + 
                'The following was the error message from removeLock:' + '\n' +                                      
                errorFromRemoveLock + '\n'
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


        // Preprocessing for email
        if(email) // If the user supplied data for email
        {
          // No preprocessing was specifed for email. Use it as was supplied by the user.
        }
        else // If the user did not supply data for email
        {
          // Save email from the most recent record.
          userObject.email = recordObject.email;
        }

        // Preprocessing for hashedPassword
        // Behavior from data dictionary at jet9znuuzg95hmfdmmx5
        // If the user supplied a valid password
        if(password)
        {
          // Hash the password
          userObject.hashedPassword = helpers.hash(password);

          // If the password was not hashed successfully then exit this process without appending the record.
          if(!userObject.hashedPassword)
          {
            helpers.log
            (
              5,
              'jet9znuuzg95hmfdmmx5' + '\n' +
              'Could not hash the password' + '\n'
            ); // End of: helpers.log(...)

            return callback(500, {'Error' : 'Could not hash the password'});
          } // End of: If the password was not hashed successfully.
        }
        // Else: the user did not supply a password. 
        // Probably using editForm or deleteForm where there is no password control element
        else 
        {
          // So use the password from the most recent saved record.
          userObject.hashedPassword = recordObject.hashedPassword;
        }
        // End of: // Preprocessing for hashedPassword


        // If we are appending a delete make sure that everything else is coming from the most recent saved record.
        if(deleted)
        {
          userObject = {};
          userObject.userId = userId;
          userObject.email = recordObject.email;
          userObject.hashedPassword = recordObject.hashedPassword;
          userObject.timeStamp = Date.now();
          userObject.deleted = true;
        }
        else
        {
          userObject.deleted = false;
        }


        // Create the logObject.
        // This object will be written to history.json which maintains a history of 
        // all changes to all tables in the database.
        // Behavior from meta.js at 8ymdma3uxbjrggohz977
        var logObject =
        {           
          "historyId" : nextIdObject.nextId + 1,    
          "transactionId" : nextIdObject.nextId + 2,                 
          "rollback" : false,
          "process" : "user._user.put",
          "comment" : "Changing a record",
          "who" : "No login yet.",    
          "user" : userObject   
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
              // Calling the function which appends a record to the file user.json
              _data.append
              (
                '/database/dbPermission/user', 
                'user', 
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
                          '3n7xbdky84zrq3tq1im9' + '\n' +
                          'Successful write to user but unable to remove lock on database' + '\n' +
                          'The following record was appended to user:' + '\n' +                            
                          JSON.stringify(logObject) + '\n' +   
                          'The following was the error message:' + '\n' +                                             
                          error + '\n'
                        ); // End of: helpers.log // Log the error.

                        callback(500, {'Error' : 'Successful write to user but unable to remove lock on database'});

                      } // End of: else Good write but unable to remove lock on database.

                    } // End of callback code which is run after attempting to remove the lock.
                    ); // End of: _data.removeLock(function(error){...}
                    // End of: Call to function which removes lock

                  }    // End of: if (!err)  //The file has been appended to successfully.
                  else // There was an error appending to user.
                  {
                    helpers.log // Log the error.
                    (
                      5,
                      '6gb9kvh3tsctet9jlq7f' + '\n' +
                      'There was an error when appending to the user file.' + '\n' +
                      'The following record may or may not have been appended to user:' + '\n' +                            
                      JSON.stringify(logObject) + '\n' +
                      'Attempting to rollback the entry.' + '\n' +    
                      'The following was the error message:' + '\n' +                                             
                      err + '\n'
                    );

                    // Assemble rollback record for the user file which will negate previous entry if any.
                    // Behavior from meta.js at 8l4zwqs63qwmp81rjcpw  
                    userObject = 
                    {
                        "userId" : recordObject.nextId,
                        "email" : recordObject.email,
                        "hashedPassword" : recordObject.hashedPassword,
                        "timeStamp" : recordObject.timeStamp,
                        "deleted" : recordObject.deleted
                    };                        

                    // Assemble rollback record for the history file which will negate previous entry if any.
                    logObject =
                    {                    
                      "historyId" : nextIdObject.nextId + 3,    
                      "transactionId" : nextIdObject.nextId + 2,                                
                      "rollback" : true,
                      "process" : "user._user.put",
                      "comment" : "Error during Put. Appending rollback",                        
                      "who" : "No login yet",    
                      "user" : userObject   
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
                          // Calling the function which appends a record to the file user.json
                          _data.append
                          (
                            '/database/dbPermission/user', 
                            'user', 
                            userObject, 
                            function(err)
                            {
                              if (!err) // The rollback record for user was appended successfully.
                              {
                                helpers.log
                                (
                                  5,
                                  '3xww421zhgwbfmtp3klz' + '\n' +
                                  'Rollback entry in the user file was appended successfully' + '\n' +
                                  'The following was the record we rolled back:' + '\n' +
                                  JSON.stringify(logObject) + '\n'                                   
                                ); // End of: helpers.log(...)
                              }
                              else // There was an error when rolling back record for user.
                              {
                                helpers.log
                                (
                                  7,
                                  'jz2n0t4c8off1oiex393' + '\n' +
                                  'There was an error appending a rollback entry in the user file' + '\n' +
                                  'The following record may or may not have been rolled back:' + '\n' +
                                  JSON.stringify(logObject) + '\n' +   
                                  'An error here does not necessarily mean the deleting append to user did not happen.' + '\n' +                                        
                                  'CHECK TO SEE IF history and user ARE STILL IN SYNC' + '\n' + 
                                  'The following is the error message:' + '\n' +                                                                     
                                  err  + '\n'
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
                            'hgf9a20i4xobpeb5jumw' + '\n' +
                            'There was an error appending a rollback entry in the history file' + '\n' +
                            'A rollback entry may or may not have been written in the user file' + '\n' +  
                            'CHECK TO SEE IF history and user ARE STILL IN SYNC' + '\n' +                                      
                            'The following was the record we tried to roll back:' + '\n' +
                            JSON.stringify(logObject) + '\n' +        
                            'The following is the error message:' + '\n' +
                            err  + '\n'
                          );
                        } // End of: else There was an error when appending a rollback entry in history.
                      } // End of: callback function(err){...}
                    ); // End of: _data.append(...)

                    callback(500, {'Error' : 'Could not create the new user.'});

                  } // End of: else // There was an error appending to user.
                } // End of: callback function
                ); // End of: Calling the function which appends a record to the file user.json 

            } //End of: The history file has been appended to successfully.
            else // There was an error appending to the history file.
            {
              helpers.log
              (
                7,
                'u75p3wn3dvrld856yi0l' + '\n' +
                'There was an error appending to the history file' + '\n' +
                'An error here does not necessarily mean the append to history did not happen.' + '\n' +  
                'But an error at this point in the code surely means there was no append to user' + '\n' +                                          
                'CHECK TO SEE IF history and user ARE STILL IN SYNC' + '\n' +                    
                'The following was the record we tried to append:' + '\n' +
                JSON.stringify(logObject) + '\n' +                   
                'The following is the error message:' + '\n' +                  
                err  + '\n'
              );

              callback(500, {'Error' : 'Could not create the new user.'});
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
              '9ge5m9bbo6z52an8x7nu' + '\n' + 
              'Pipeline error. The message was as follows' + '\n' +                                             
              pipelineError + '\n'                                                 
            ); // End of: helpers.log // Log the error.
          } // End of: if(pipelineError){...}
        } // End of: function(piplineError){...}
      ); // End of: Pipeline
    }); //End of: helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)
  }); // End of: lib.nextId(function(err, nextIdObject)
}; // End of: handlers._user.put = function(...
// End of: Define the user put subhandler function




// Define the user get subhandler function.
// Streams the user file or part of it back to the client.
user._user.get = function(data, callback)
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
      // In this case the queryString is coming from userEdit page.
      queryString = data.queryString
    }
    else
    {
      // In this case the queryString is coming from the userList page.
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


  
  // Create an empty map data structure which will be used to merge user records that have the same unique fields.
  // Chose map data structure over objects because maps are guaranteed to maintain the same order where as objects are not.
  let userMap = new Map();
  
  // This function sets up a stream where each chunk of data is a complete line in the user file.
  let readInterface = readline.createInterface
  (
    { // specify the file to be read.
      input: fs.createReadStream(_data.baseDir + '/database/dbPermission/user' + '/' + 'user' + '.json'),
    }
  );



  // Look at each record in the file.
  readInterface.on('line', function(line) 
  {
    // Convert the JSON string (a single line from the user file) into lineValueObject.
    // These objects will written back to a new file after deleting some un-needed key/value pairs.
    let lineValueObject = JSON.parse(line);
    let recordWasDeleted = false;    

    // Declare a variable to serve as a key in the map to manage the lineValueObject.
    let userId = lineValueObject.userId;      

    if(lineValueObject.deleted === true) // if the record in the file user.json had the delete field set to true:
    {
      // Remove this record from the map 
      userMap.delete(userId);
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
            userMap.delete(userId);
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
      // Remove the hashedPassword key/value pair from the lineValueObject before returning it to the requester.
      delete lineValueObject.hashedPassword;

      // Remove the deleted key/value pair from the lineValueObject before returning it to the requester.
      delete lineValueObject.deleted;            

      // Update this record in the map.
      userMap.set(userId, lineValueObject);
    }

  }); // End of: readInterface.on('line', function(line){...}
  // End of: Look at each record...


  // This listener fires after we have looked through all the records in the user file.
  // The callback function defined here will stream the user list back to the clients browser.
  readInterface.on('close', function() 
  {          
    // This readable stream will be used to write the result of the merge to a new file.
    const sourceStream = new Readable(); 

    for (const [key, valueObject] of userMap)
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

}; // End of: handlers._user.get = function(data, callback){do stuff}
// End of: Define the user get subhandler function.  




// A payloadArray is used to validate and save nested data to the database.
// Declaring function used to load a payloadArray dynamically once the payload is known.  
// Behavior from meta.js at defq4ols90h44rvcw8st
function loadPayloadArray(payloadKeyArray, payloadObject)
{     
  let payloadArray = Object.entries(payloadObject).filter
  (
    // Checking if this object property belongs in our payloadArray.
    function(examElement)
    {
      let passExamElement = true;

      let splitExamElementArray = examElement[0].split("_");

      payloadKeyArray.forEach
      (
        function(payloadKeyArrayElement, payloadKeyArrayIndex)
        {

          // If this is the first element in payloadKeyArray
          if(payloadKeyArrayIndex === 0)
          {
            if(splitExamElementArray[0] != payloadKeyArrayElement)
            {
              passExamElement = false;
            }
          }
          // Else If: Not first nor the last element in payloadKeyArray
          else if(payloadKeyArrayIndex != payloadKeyArray.length - 1) 
          {
            if(splitExamElementArray[payloadKeyArrayIndex * 2] != payloadKeyArrayElement)
            {
              passExamElement = false;
            }
          }
          // Else: Must be the last element in payloadKeyArray
          else 
          {
            if(splitExamElementArray[splitExamElementArray.length -1] != payloadKeyArrayElement)
            {
              passExamElement = false;
            }
          }

        } // End of: function(payloadKeyArrayElement, payloadKeyArrayIndex){...}
      ) // End of: payloadKeyArray.forEach(...)

      return passExamElement

    } // End of: function(examElement){...}
  ); // End of: let payloadArray = Object.entries(payloadObject).filter

  return payloadArray

}; // End of: function loadPayloadArray(payloadKeyArray, payloadObject){...}
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
module.exports = user;


