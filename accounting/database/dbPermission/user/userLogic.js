
/*
/ Handlers for the "user" table.
/ This program was built by meta.js starting at yx52pvsi0kn9p5o46hrq
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
              'cfc4jcll2nrxt9ymw6e3' + '\n' +
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
          'sy9n5r7vxfsa4h38o7sw' + '\n' +
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
      '8hpuaexgm92f5q2ezcsk' + '\n' +
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
              'm0nt7fyozux6aamresod' + '\n' +
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
          '59duyih7mdtonl8rtqvv' + '\n' +
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
      'axzkqc0l8od7l6pvz5jn' + '\n' +
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
              'zjna7ryif6ja9gst6cr6' + '\n' +
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
          'ia7f9651kyizskwx1iji' + '\n' +
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
      'depghb5z6hp73xjh1pga' + '\n' +
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
      'kurzs6q9nlgs1ysl1mk0' + '\n' +
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
  let email = data.payload.email;

  // passIfString Default behavior from meta.js at qif5xwvzgr7efln9xtr8
  if(typeof(email) != 'string'){return callback(400, {'Error' : 'email must be of datatype string'});}

  // passIfNotEmpty Default behavior from meta.js at eojwivwlhxkm1b837n2o
  if(!email || email.trim().length === 0){return callback(400, {'Error' : 'No email was entered'});}else{email = email.trim()}

  // passIfHasAmpersand
  // Behavior from data dictionary at uet9z3uuzgy5hmytmsxf 
  if(email.indexOf("@") === -1){return callback(400, {'Error' : 'Not a valid email'});}

  // Get password from payload
  let password = data.payload.password;

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
  let emailIsUnused = true;

  // Using this to track the primary key of a record that we might encounter with the candidate email address.
  // If we encounter this primary key again we will check to see if the email has been changed.
  // If it has then the candidate email will be marked as available again.
  let uniqueIdOfRecordHoldingCandidateEmail = false; 
                        

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
      // Check if the email is no longer holding the candidate email.
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
  // Behavior from meta.js at aiwaoocd1uegzjbqeydk
  readInterface.on('close', function() 
  {
    // If the email already exists then exit this process without appending the record.
    if (!emailIsUnused) 
    {      
      helpers.log
      (
        5,
        '3xz9mkr7hy7naugn61gp' + '\n' +
        'The email address: ' + email + ' already exists' + '\n'                                  
      ); // End of: helpers.log(...)

      return callback(400, {'Error' : 'The email already exists'});
    }

    // If we made it to this point then the candidate email is unique so continue on with the append opperation.
    // Behavior from meta.js at gwwelr17hmxvq4spdrcl    

            
    // Password calculation from data dictionary at het9z9uuzgy5hmfwdgkz is processed here.
    // Hash the password
    let hashedPassword = helpers.hash(password);

    // If the password was not hashed successfully then exit this process without appending the record.
    if(!hashedPassword)
    {
      helpers.log
      (
        5,
        'het9z9uuzgy5hmfwdgkz' + '\n' +
        'Could not hash the password' + '\n'
      ); // End of: helpers.log(...)

      return callback(500, {'Error' : 'Could not hash the password'});
    } // End of: else the password was not hashed successfully.


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
          '4befm91xs04ng9k5rnb5' + '\n' +
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
              'r8yu6e18uw5jir12j7vm' + '\n' +
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
                    'mz2bvy6t9asv1kpcpltk' + '\n' +
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
                'hb8ngow34qat9bfitgwj' + '\n' +
                'There was an error when appending to the user file.' + '\n' +
                'The following record may or may not have been appended to the user file:' + '\n' +                            
                JSON.stringify(logObject) + '\n' +
                'Attempting to rollback the entry.' + '\n' +    
                'The following was the error message:' + '\n' +                                             
                err + '\n'            
              );

              // Assemble rollback record for the user file which will negate previous entry if any.  
              userObject = 
              {
                "userId" : nextIdObject.nextId,
                "email" : "email",
                "hashedPassword" : "hashedPassword",
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
                            'qi0gg94n9lj8cmyewq0n' + '\n' +
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
                            'omv7d30ig8vcwrfm4ech' + '\n' +
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
                      '6ul4mr6meh04j5r98xry' + '\n' +
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
  let email = data.payload.email;

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
  let password = data.payload.password;

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
  if(!email && !password && !deleted)
  {
    helpers.log
    (
      5,
      '55k5bzshow1te78jm4wk' + '\n' +
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
        '84xrzty5c5n68lazjox0' + '\n' +
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
    // This is to establish the order in which the fields will be writen to the table. 
    // Behavior from 3bd1sa5ve4aqrfspunrt in meta.js         
    let userObject = 
    {
      "userId" : userId,
      "email" : email,
      "hashedPassword" : "" ,
      "timeStamp" : Date.now(),
      "deleted" : ""
    };

    dataObject = {};
    dataObject.uniqueField01Name = "email";
    dataObject.uniqueField01Value = userObject.email;
    dataObject.path = '/database/dbPermission/user/user.json';
    dataObject.queryString = 'WHERE:;userId:;MatchesExactly:;' + userId + ':;';

    // This function returns the most recent record for this userId after checking that 
    // email is unique and that the a record with the supplied userId exists to modify.
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
                'oz2sewuwmddwty1ujja0' + '\n' + 
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
                'd371kc3awzs7kyu882f1' + '\n' +
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
        // Preprocessing for password
        if(password) // If the user supplied data for password
        {
          // Password calculation from data dictionary at jet9znuuzg95hmfdmmx5 is processed here.
          // Hash the password
          let hashedPassword = helpers.hash(password);

          // If the password was not hashed successfully then exit this process without appending the record.
          if(!hashedPassword)
          {
            helpers.log
            (
              5,
              'jet9znuuzg95hmfdmmx5' + '\n' +
              'Could not hash the password' + '\n'
            ); // End of: helpers.log(...)

            return callback(500, {'Error' : 'Could not hash the password'});
          } // End of: else the password was not hashed successfully.

          // Saving calculation on password supplied by the user to hashedPassword
          userObject.hashedPassword = hashedPassword;

        } // End of: If the user supplied data for password
        else // If the user did not supply data for password
        {
          // saving hashedPassword from the most recent record.
          userObject.hashedPassword = recordObject.hashedPassword;
        }

        // If we are appending a delete make sure that everything else is coming from the most recent saved record.
        if(deleted)
        {
          userObject.email = recordObject.email;
          userObject.hashedPassword = recordObject.hashedPassword;
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
                          'f8wuama7s58ooh7odwqp' + '\n' +
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
                      '7goodnyul65tan0yyxfm' + '\n' +
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
                                  '4pt1s8ojs44qvr92udca' + '\n' +
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
                                  'iaqcjzwkeqak4bc3n679' + '\n' +
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
                            'sf9qr0zbruhmjewyemwl' + '\n' +
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
                'dapi9qug5fd1bhqpdu3m' + '\n' +
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
              '85qtt3tlilvv0bfso54r' + '\n' + 
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
