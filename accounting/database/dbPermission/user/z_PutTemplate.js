// user - put handler
// Define the user put subhandler function 
// This function updates a record.
// Required data: userId
// Optional data: email, password
// Note: At least one of the optional arguments must be specified.
user._user.put = function(data, callback){

  // Several different record sets with the supplied email and the same userId 
  // may exist already if the record has been changed or deleted prior to this operation.

  // A modified record is simply a new record with the same userId as an existing record.
  // The newest record is the valid record and the older record is history.  
  // So position matters. These tables should never be sorted.
  // These tables can be packed however to get rid of historical records.

  // The transaction log (history.json) also maintains the history and the current 
  // state of the entire database.
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

  // In this table, the email is a unique key and the userId is a primary key.
  // The difference is that the userId may never change whereas the email
  // may be changed to something different if a valid record for that email
  // does not already exist.

  // When adding a record we first make sure that the record does NOT already exist.
  // There should be no record with the current email or if there is then 
  // the last record with this email address must have the deleted field set to true.

  // When changing a record we:
  // 1. Make sure that the record with this userId does indeed exist and...
  // 2. that the last instance of a record with this userId is not deleted.

  // It is ok to add a new record with this same email again when the last instance 
  // of this record encountered in the stream has the deleted flag set to true. 
  // In that case, the userId will be different but the email will be the same.         

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
        // Add in the data that is currently available.            
        var userObject = 
        {
            "userId" : userId,      
            "email" : email,                            
        };

        dataObject = {};
        dataObject.uniqueField01Name = "email";         
        dataObject.uniqueField01Value = userObject.email;   
        dataObject.path = '/database/dbPermission/user/user.json';
        dataObject.queryString = 'WHERE:;userId:;MatchesExactly:;' + userId + ':;';

        // This function returns the most recent record for this userId after checking that 
        // email is unique and that the a record with the supplied userId exists to modify.
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
              // This object will be written to history.json which maintains a history of 
              // all changes to all tables in the database.
              var logObject =
              {           
                "historyId" : nextIdObject.nextId + 1,    
                "transactionId" : nextIdObject.nextId + 2,                 
                "rollback" : false,
                "process" : "aHandlers._user.put",
                "comment" : "Appending an edit",
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
                                'k9qw26hj7wa1od4u2bvs' + '\n' +
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
                            '24vg75vjixquqw7s1gdi' + '\n' +
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
                            "process" : "aHandlers._user.put",
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
                                        '421raafd6z79q6ohh3tp' + '\n' +
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
                                        'pbdomte2gk74n1vrimeb' + '\n' +
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
                                  'v8oyld7ijegkj2hujvty' + '\n' +
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
                      'wp1m0m4ebxz01wcls8qd' + '\n' +
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
                    'jfywxqkxg2ambdf6ozrc' + '\n' + 
                    'Pipeline error. The message was as follows' + '\n' +                                             
                    pipelineError + '\n'                                                 
                  ); // End of: helpers.log // Log the error.
                } // End of: if(pipelineError){...}
              } // End of: function(piplineError){...}
            ); // End of: Pipeline

          } // End of: if(!error) Got the most recent record from gitHashedPass
          else // There was indeed an error returned by getMostRecent when attempting to get the most current record.
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
            // End of: Call to function which removes lock after failed read from getMostRecent
          } // End of: Else // There was indeed an error returned by getMostRecent when attempting to get the most current record.
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
}; // End of: handlers._user.put = function(...
// End of: Define the user's put subhandler function