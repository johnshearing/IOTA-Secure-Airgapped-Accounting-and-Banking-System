//From here to the bottom is saved code. 
//Do not delete until user/list is working and commented.

// Define the users get subhandler function.
// Streams the user file or part of it back to the client.
handlers._user.get = function(data, callback)
{
  // Check that the email address is valid.
  // Checking that the email address in the queryStringObject is of type string and that the length is 10 characters and
  // creating the email variable for the get from the clients query string
  // The email variable will be loaded from the query string if validation passed otherwise will be assigned the value false.
  let email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim() : false;
  
  // This will always evaluate to true.
  // This if statement is just a place holder for a filter function we may wish to write later.
  if(email || !email)
  {

/*  //Sercurity has been disabled for now.  
    // Get the token from the headers
    let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    // Checking permission to access this user data.
    // Check if the given token is valid for the users phone number. 
    // Right now the phone number is hard coded to 1234567890.
    handlers._tokens.verifyToken(token, '1234567890', function(tokenIsValid)
    {
      if(tokenIsValid)
      {
*/        
        // Several records with a particular email address may exist already if the record has 
        // been deleted prior to this operation.
        // That's because a deleted record in this system is simply an identical record appended with 
        // the deleted field set to true. 
        // So depending on how many times the email address has been added and deleted there may 
        // be several pairs of records in the user table with identical email addresses.
        // Each pair will have different userIds.
        // The table can be packed occasionally to get rid of these deleted record pairs. 
        // Deletes are handled as appends with the deleted field set to true because
        // real deletes tie up the table for a long time.

        // Updates to records are also handled as appends in this system for the same reason.
        // Again, only the last record matters because the last record contains the most uptodate information.
        // Since updates are unlimited, there may actually be many records with the same userId.

        // We will look at each record in the user file to check for deletion and to look for the most uptodate record.
        // Only the last record for a particular userId matters.
        // It's like that old game "She loves me, She loves me not".
        // The following code appends the variable userId as the key and lineValueObject as the value to 
        // usersMap when lineValueObject contains a new userId.
        // Or the code merges lineValueObject in userMap when the userId has been seen before, in which 
        // case, the code updates userMap with new information from the current record.
        // The result will be a userMap containing only one most uptodate objects (records) for each userId with 
        // the most recent state of the deleted field and the other fields as well. 

        // Create an empty map data structure which will be used to merge user records with the same email address.
        let usersMap = new Map();

        const sourceStream = new Readable();

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
          // These objects will returned to the client to populate the userList in the browser.
          let lineValueObject = JSON.parse(line);       

          // Declare a variable to serve as a key in the map to manage the lineValueObject.
          let userId = lineValueObject.userId;          

          if(lineValueObject.deleted === true)
          {
            // Remove this record from the map
            usersMap.delete(userId);
          }
          else // this record has not been marked for deletion.
          {
            // Remove the hashed password from the user value object before returning it to the requester.
            delete lineValueObject.hashedPassword; 

            // Remove the deleted flag from the user value object before returning it to the requester.
            delete lineValueObject.deleted;            

            // Update this record in the map.
            usersMap.set(userId, lineValueObject);
          }

        }); // End of: readInterface.on('line', function(line){...}
        // End of: Look at each record...


        // This listener fires after we have looked through all the records in the user file.
        // The callback function defined here will stream the list of users back to the clients browser.
        readInterface.on('close', function() 
        {          
          for (const [key, valueObject] of usersMap)
          {
            // Convert the data object to a string.
            let stringData = JSON.stringify(valueObject);     

            console.log(stringData);

            // Load the readable stream with data.
            sourceStream.push(stringData + '\n');                  
          }       

          // Tell the stream no more data is coming.
          sourceStream.push(null);           

        }); // End of: readInterface.on('close', function(){...}


        // Create a writable stream and specify the file which will receive the data from the readable stream.
        let destinationStream = fs.createWriteStream(_data.baseDir + '/database/dbPermission/user' + '/' + 'test' + '.txt', {flags : 'a'});


        pipeline
        (
          sourceStream,
          destinationStream,
          function(pipelineError)
          {
            if(pipelineError)
            {
              helpers.log // Log the error.
              (
                7,
                'teygxqkxg2ar4df6ozgl' + '\n' + 
                'Pipeline error. The message was as follows' + '\n' +                                             
                pipelineError + '\n'                                                 
              ); // End of: helpers.log // Log the error.
            } // End of: if(pipelineError){...}
          } // End of: function(piplineError){...}
        ); // End of: Pipeline
            
        // Return the status code OK, the contents of the file, and the contentType determined above.
        callback(200, sourceStream);

/* //Security has been disabled for now. 
      } // End of: if tokenIsValid

      else // the token is not valid
      {
        // Status code 403 is forbidden or access denied
        callback(403, {'Error' : 'Missing required token in header or token is invalid.'}); 
      } // End of: the token is not valid

    }); // End of: handlers._tokens.verifyToken(token, phone, function(tokenIsValid)
*/    

    // End of: Check if the given token is valid for the users phone number.
    // End of: Checking permission to access this user data.

  } // End of: if(email || !email)

  else // This condition is unreachable for now.
  {
    callback(400, {'Error' : 'Missing required field'});
  } // End of: else the phone number did not pass data type and length validation.

}; // End of: handlers._user.get = function(...
// End of: Define the user's get subhandler function.
// End of: user - get subhandler