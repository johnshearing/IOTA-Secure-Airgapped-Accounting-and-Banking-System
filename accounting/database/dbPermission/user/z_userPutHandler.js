// user - put handler
// Define the user's put subhandler function 
// This function updates a record.
// Required data: userId
// Optional data: email, password
// Note: At least one of the optional arguments must be specified.
user._user.put = function(data, callback)
{
  // Field validation starts here.
  // Get userId from payload
  let userId = data.payload.userId;

  // PrimaryKey validation. Default behavior from meta.js
  // Random Number
  // If userId is a valid string then convert it to a number.  
  if (typeof(userId) === 'string'){userId = parseInt(userId, 10);}else{return callback(400, {'Error' : 'userId must be a of string type'});}

  // Get email from payload
  let email = data.payload.email;

  // email validation
  // Random Number
  // If email is of string type and is not empty
  if (typeof(email) === 'string' && email.trim().length > 0)
  {
    // The user entered something in the edit form so check for an ampersand.
    if(email.indexOf("@") != -1)
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
  // Random Number
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
  let deleted = typeof(data.payload.deleted) === 'string' && data.payload.deleted === "true" ? true : false;
  
  //if all fields fail validation then exit this process without writing changes to the table.
  if(!email && !password && !deleted)    
  {
    helpers.log
    (
      5,
      '8eaiwh3s1ng6pxwnba3t' + '\n' +
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
  _data.nextId(function(error, nextIdObject)
  {
    // If lock failed or unable to get the next gsuid.
    if(error || !nextIdObject)
    {
      helpers.log
      (
        5,
        '4zyouw8e65t2uhg4eytv' + '\n' +
        'Unable to get the next gsuid.' + '\n' +
        'The following was the error' + '\n' +
        JSON.stringify(error) + '\n'                                   
      ); // End of: helpers.log(...)

      return callback('Unable to get the next gsuid.');
    } // End of: If lock failed or unable to get the next gsuid.


    // If we made it here then we were able to lock the gsuid.json file and get 
    // the next unique id number for this record. So continue with the process.


    // Create the user object. 
    // This object will be appended to user.json.
    // Add in all fields even if no data is available yet. 
    // This is to establish the order in which the fields will be writen to the table.           
    var userObject = 
    {
        "userId" : userId,      
        "email" : email, 
        "hashedPassword" : "",
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
                'bxpa2p2t7ps3wrd1dqu7' + '\n' + 
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
                'wew0wiqnv6gt502zsqew' + '\n' +
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
      writable.write = function(payload)
      {
        let stringContainer = '';                 
        stringContainer = stringContainer + decoder.write(payload);
        let recordObject = JSON.parse(stringContainer);

        // if no email was supplied. 
        // Maybe using a special form like perhaps the password form or
        // perhaps the delete form was used.
        if(!email) 
        {
          // Saving email address from the most recent record.
          userObject.email = recordObject.email;
        }         

        if(password) // The user wants to change the password. Password form was used.
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
        else// The user did not supply a new password.
        {
          // saving hash of password from the most recent record.
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
             
        // Everything else I need to do with userObject goes here.    

        // Create the logObject.
        // This object will be written to history.json which maintains a history of 
        // all changes to all tables in the database.
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
    }); //End of: helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)
  }); // End of: lib.nextId(function(err, nextIdObject)
}; // End of: handlers._user.put = function(...
// End of: Define the user's put subhandler function