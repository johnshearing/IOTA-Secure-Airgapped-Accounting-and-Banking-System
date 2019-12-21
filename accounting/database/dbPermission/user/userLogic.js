
/*
/ Handlers for the "user" table.
*/


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
              '6ntlmr5hsqipa1enu5mf' + '\n' +
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
          'fgumzwtaiux6yc62owk9' + '\n' +
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
      'uefkxnz7cikk4ns1epvv' + '\n' +
      'Method not get. Only gets allowed.' + '\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: user.serveListPage = function(data, callback){...}
// End of:// Define the handler function that serves up the HTML page for searching and listing user records.




// Define the handler function that serves up the HTML page for creating new user records.
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
              '30ozld2hc0h1i3xkr5id' + '\n' +
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
          '08gkv6lkce1oxobzmi65' + '\n' +
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
      'n4vz2tfjwu1c82b2b5y3' + '\n' +
      'Method not get. Only gets allowed.' + '\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: user.serveAddPage = function(data, callback){...}
// End of: Define the handler function that serves up the HTML page for creating new user records.




// Define the handler function that serves up the HTML page for editing user records.
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
              '5zwx9blpm1urpnilmig2' + '\n' +
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
          'fmratl91qv1mglq7dgiz' + '\n' +
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
      '7gfn20u89gfgx493v4xf' + '\n' +
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
      'zoey4o0kfysaafz4srr7' + '\n' +
      'The method was not one of the acceptable methods' + '\n'
    ); 

    // so send back status 405 (Not Allowed).
    callback(405);
  }
}; // End of: user.user = function(data, callback){...}
//End of: Router for user functions




// Create a subobject within the handlers object for the user's submethods (post, get, put, and delete)
user._user = {};




// user - post subhandler
// Define the user post subhandler function.
// This function appends a record to the user file.
user._user.post = function(data, callback)
{
  // Create variables for the post from the clients request object.
  // The variables will be loaded from the object if validation is passed otherwise will be assigned the value false.
  var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  //if every field passed the validation process above then do the following.
  if(email && password)
  {
    // Will toggle this to false if we find the email already exists in the user table.
    let emailIsUnused = true;

    // Using this to track the primary key of a record that we might encounter with the candidate email address.
    // If we encounter this primary key again we will check to see if the email has been changed.
    // If it has then the candidate email will be marked as available again.
    let uniqueIdOfRecordHoldingCandidateEmail = false; 
                         

    // To ensure the email is unique we will read every record in the 
    // user table and compare with the email provided.

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
      lineObject = JSON.parse(line);

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
      // be several sets of records in the user table currently that have the same email 
      // and the same userId.
      // The table can be packed occasionally to get rid of these deleted record sets. 
      // Deletes are handled as appends with the deleted field set to true because real 
      // deletes tie up the table for a long time.

      // In this table, the email is a unique key as well as the userId.

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
          emailIsUnused = false; // This flag used in the on close event listener below. 

          // If this record (record with this primary key) is encountered further down where it has been deleted 
          // or where the email has been changed with a put operation:
          // Then the candidate email will be available again as we continue searching through the records.
          // We are already checking if this email becomes available again by deletion.
          // Now we need to check if the email becomes available because the record with this primary 
          // key gets changed with a new email address.
          // That will make the candidate email unique and available again.
          // So record this global sequential unique id (the userId in this case).
          // If we find the gsuid again, then check if the email has changed.
          // If it has been changed then:
          // 1. Set the emailIsUnused flag to true again
          // 2. clear out the variable tracking the uniqueId of the record.
          uniqueIdOfRecordHoldingCandidateEmail = lineObject.userId;
        }
        // The matching record we found has been deleted so it may as well not exist. The new record is still unique.
        else 
        {
          emailIsUnused = true;
        } 
      } // End of: if we found a matching entry

      // If we have seen this primary key before and flagged the email already taken 
      // because it was identical to the email we are trying to add and it had not been deleted:

      // Ok, the current record is not holding the candidate email but 
      // maybe it was in the past and someone changed it.
      // if the candidate email is flagged unavailable and we are looking at the record that was flagged:
      else if(emailIsUnused === false && uniqueIdOfRecordHoldingCandidateEmail === lineObject.userId)
      {
        // Check if the email is no longer holding the candidate email address.
        // If it is not holding the candidate email then flag the email 
        // available again and clear out the variable tracking this primary key.
        emailIsUnused = true;
        uniqueIdOfRecordHoldingCandidateEmail = false;
      }

    }); // End of: readInterface.on('line', function(line){...}
    // End of: Look at each record...

    // This listener fires after we have discovered if the email is 
    // unique or not, and have then closed the readable stream from user.
    // The callback function defined here will append the record if the email 
    // was found to be unique.
    readInterface.on('close', function() 
    {
      if (emailIsUnused) // The email is unique so proceed with append operation.
      {
        // Hash the password
        let hashedPassword = helpers.hash(password);

        if(hashedPassword) // The hash function successfully returned the hashed password.
        {
          // Get the next global sequential unique Id and lock the database
          // Locking the database makes the system multiuser.
          // All writes to any table must first get a lock on gsuid.json
          // gsuid.json stays locked until the operation is completely finished and _data.removeLock is called.
          // This ensures that only one process is writing to the database at any one time.          
          _data.nextId(function(error, nextIdObject)
          {
            // if we were able to lock the gsuid.json file and get the next unique id number for this record
            if(!error && nextIdObject)
            {
              // Create the user object. 
              // This object will be appended to user.json.
              var userObject = 
              {
                  "userId" : nextIdObject.nextId,
                  "email" : email,
                  "hashedPassword" : hashedPassword,
                  "timeStamp" : Date.now(),
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
                "process" : "user._user.post",
                "comment" : "Post new record",
                "who" : "No login yet",    
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
                  if (!err)  // The history file has been appended to successfully.
                  {
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
                                'j0nzk9z788r26r884yt1' + '\n' +
                                'Successful write to user table but unable to remove lock on database' + '\n' +
                                'The following record was appended to user:' + '\n' +                            
                                JSON.stringify(logObject) + '\n' +   
                                'The following was the error message:' + '\n' +                                             
                                error + '\n'
                              ); // End of: helpers.log. Log the error.

                              callback(500, {'Error' : 'Successful write to user table but unable to remove lock on database'});

                            } // End of: else Good write but unable to remove lock on database.

                          } // End of callback code which is run after attempting to remove the lock.
                          ); // End of: _data.removeLock(function(error){...}
                          // End of: Call to function which removes lock

                        }    // End of: if (!err)  //The file has been appended to successfully.
                        else // There was an error appending to user table.
                        {
                          helpers.log // Log the error.
                          (
                            5,
                            'aayydtvjtdc5zi99dqoh' + '\n' +
                            'There was an error when appending to the user file.' + '\n' +
                            'The following record may or may not have been appended to user:' + '\n' +                            
                            JSON.stringify(logObject) + '\n' +
                            'Attempting to rollback the entry.' + '\n' +    
                            'The following was the error message:' + '\n' +                                             
                            err + '\n'
                          );

                          // Assemble rollback record for the user file which will negate previous entry if any.  
                          userObject = 
                          {
                              "userId" : nextIdObject.nextId,
                              "email" : email,
                              "hashedPassword" : hashedPassword,
                              "timeStamp" : Date.now(),
                              "deleted" : true
                          };                        

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
                                        '54r52lo4zdd4bdicyoa4' + '\n' +
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
                                        'sy421bfalfi08a97rm26' + '\n' +
                                        'There was an error appending a rollback entry in the user file' + '\n' +
                                        'The following record may or may not have been rolled back:' + '\n' +
                                        JSON.stringify(logObject) + '\n' +   
                                        'An error here does not necessarily mean the deleteing append to user did not happen.' + '\n' +                                        
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
                                  'fyd0mzu9i8jcipq5vpwq' + '\n' +
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

                          callback(500, {'Error' : 'Could not create the new user record.'});

                        } // End of: else // There was an error appending to user.
                      } // End of: callback function
                      ); // End of: Calling the function which appends a record to the file user.json 

                  } //End of: The history file has been appended to successfully.
                  else // There was an error appending to the history file.
                  {
                    helpers.log
                    (
                      7,
                      '4v5wc5kcjxl5045xa5tz' + '\n' +
                      'There was an error appending to the history file' + '\n' +
                      'An error here does not necessarily mean the append to history did not happen.' + '\n' +  
                      'But an error at this point in the code surely means there was no append to user' + '\n' +                                          
                      'CHECK TO SEE IF history and user ARE STILL IN SYNC' + '\n' +                    
                      'The following was the record we tried to append:' + '\n' +
                      JSON.stringify(logObject) + '\n' +                   
                      'The following is the error message:' + '\n' +                  
                      err  + '\n'
                    );

                    callback(500, {'Error' : 'Could not create the new user record.'});
                  }
                } // End of: callback function
              ); // End of: _data.append(dbHistory...)
              // End of: Calling the function which creates an entry into history. 

            } // End of: if we were able to lock the gsuid.json file and get the next unique id number for this record
            else // We were unable to get the next gsuid.
            {
              helpers.log
              (
                5,
                'odvz0rolampt4usu0tia' + '\n' +
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
            'c0pzkeutsxlixeaiw0gd' + '\n' +
            'Could not hash the password' + '\n'                                  
          ); // End of: helpers.log(...)

          callback(500, {'Error' : 'Could not hash the password'});
        } // End of: else the password was not hashed successfully.

      }
      else // The email already exists so exit this process without appending the record.
      {      
        helpers.log
        (
          5,
          'svctd6z82sv1joqfw5zz' + '\n' +
          'The email address: ' + email + ' already exists' + '\n'                                  
        ); // End of: helpers.log(...)

        callback(400, {'Error' : 'The email already exists'});
      }      

    }); // End of: readInterface.on('close', function(){...}

  } // End of: If field validation has been passed successfully.
  else // Field validation failed.
  {
    helpers.log
    (
      5,
      '4ukvasgzs6rtzq7fo319' + '\n' +
      'Missing required fields' + '\n'                                  
    ); // End of: helpers.log(...)

      callback(400, {'Error' : 'Missing required fields'});
  } // End of: else field validation failed.

}; // End of: user._user.post = function(...
// End of: user - post subhandler




