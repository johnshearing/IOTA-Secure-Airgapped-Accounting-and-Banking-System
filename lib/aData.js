/*
/Library for storing and editing data
*/

// Dependencies
const fs = require('fs');
const path = require('path');
const { pipeline, Readable } = require('stream');
const config = require('./config')
const helpers = require('./ahelpers');




// Create container for the module to be exported.
var lib = {};

// Define the base directory of the accounting folder.
lib.baseDir = path.join(__dirname, '/../accounting/');

// Define the path were the lock folder is to be created.
var dbHistoryDir = lib.baseDir + 'database/dbHistory/';



// Define a function to lock, read, increment and unlock the the Global Sequential Unique Id.
// This function hands out gsuids to processes that want to write records to the database.
// A gsuid uniquely identifies a record and the order of it's creation with respect to all the other records in the database.
// This function also prevents two people from writing to the database at the same time.
// When person1 wants to write to the database this function is called which creates a folder called "gsuid.lock".
// Once this folder has been created no one else will be able run this code.
// If person2 tries to write to the database then this function will be called again and an error will be thrown as follows:
// {error : "A folder called "gsuid.lock" already exists"}.
// This prevents execution of any code that follows. 
// When person1 is finished writing then the folder is deleted and person2 can 
// run this function which again creates the folder that locks the database and initiates the write process.

// ToDo:  
// Check that no lock file exists on startup.
// Make an initialization script for the first time we use the system that creates gsuid.json if it does not exist. 
// Start making testing functions for the app.


lib.gsuidLockReadIncUnlock = function(callback)
{
  // Specifies how many IDs to increment.
  // 1 for primary key in table we may be adding a record to, 
  // 2 for historyId the primary key in history.json, The second one is incase we need a rollback entry.
  // 1 for transactionId in history.json. This number stays the same on a rollback so we know what the rollback is for.
  // 1 Because later a batchId field will be added for batch adds, updates, and deletes.  
  let idRange = 5;

  // Make the folder gsuid.lock and then run the anonymous callback function defined below.
  fs.mkdir(dbHistoryDir + 'gsuid.lock', function(error)
  {
    if(!error) // the file was created successfully.
    {
      // Call read function to get the nextId JSON object from the gsuid file then run the callback function defined here.
      lib.read('database/dbHistory', 'gsuid', function(error, nextIdObject)
      {
        // If we obtained the nextIdObject without error.
        if(!error && nextIdObject)
        {
          // Increment nextId
          nextIdObject.nextId = nextIdObject.nextId + idRange;     

          // Call the update function to write the incremented nextId object back to the gsuid.json file.
          lib.update('database/dbHistory', 'gsuid', nextIdObject, function(error)
          {
            if(!error) // There was no error writing the incremented nextId back to the file.
            {
              // Erase the lock folder so that other users can read and increment the nextId.  
              // COMMENTED OUT. 
              // We will release the lock elsewhere in the code after
              // the entire write operation has been completed successfully

              helpers.log
              (
                4,
                'qtjwjum5b9l4ww8wo1rb' + '\n' +
                'Got a good locked read' + '\n'
              );

                    //params:   stopTrying,  error, nextIdObject 
              return callback(      true,    false, nextIdObject);            
            }
            else // There was an error writing the incremented nextId back to the file.
            {
              // We are not going make anymore attempts for a locked read and write to the gsuid.json file.
              // Erase the lock folder so that other users can read and increment the nextId.         
              lib.removeLock(function(lockError){
                if(!lockError)
                {
                  helpers.log
                  (
                    7,
                    '97xxiel6uubzxgzc1j14' + '\n' +
                    'There was an error writing the incremented nextId back to the file:' + '\n' +
                    'This was the error:' + '\n' +
                    JSON.stringify(error) + '\n'
                  );
    
                        //params:   stopTrying,   error, nextIdObject 
                  return callback(      true,     error,     false      ); 
                }
                else
                {
                  helpers.log
                  (
                    7,
                    '5tj1x8c9a7lsb830v8de' + '\n' +
                    'There was an error writing the incremented nextId back to the file:' + '\n' +                   
                    'This was the error:' + '\n' +
                    JSON.stringify(error) + '\n' +
                    'Also there was an error removing the lock on the database' + '\n' +   
                    JSON.stringify(lockError) + '\n'                                      
                  );
    
                        //params:   stopTrying,   error, nextIdObject 
                  return callback(      true,     error,     false      ); 
                }
              });

            }
          }); // End of: lib.update('database/dbHistory', 'gsuid', nextIdObject,...

        }
        else // Problem reading gsuid.json. There was an error or no data was returned.
        {
          // We are not going make anymore attempts for a locked read and write to the gsuid.json file.
          // Erase the lock folder so that other users can read and increment the nextId. 
          lib.removeLock(function(lockError){
            if(!lockError)
            {
              helpers.log
              (
                7,
                'vqihr0azmm9vasc21885' + '\n' +
                'Problem reading gsuid.json.' + '\n' +
                'This is the error:' + '\n' +
                JSON.stringify(error) + '\n'
              );
    
                    //params:    stopTrying, error, nextIdObject 
              return callback(       true,     error,      false      ); 
            }
            else
            {
              helpers.log
              (
                7,
                '25gxd13111p9f2yn0sx6' + '\n' +
                'Problem reading gsuid.json.' + '\n' +                 
                'This was the error:' + '\n' +
                JSON.stringify(error) + '\n' +
                'Also there was an error removing the lock on the database' + '\n' +   
                JSON.stringify(lockError) + '\n'                                      
              );

                    //params:   stopTrying,   error, nextIdObject 
              return callback(      true,     error,     false      ); 
            }
          });
        }

      }); // End of: call to lib.read(...
    }
    else // There was an error creating the gsuid.lock folder
    {
      // If the file was locked by another user
      if(error.syscall == 'mkdir' && error.code == 'EEXIST')
      {   
        helpers.log
        (
          5,
          'zz1iv0q1o0702wk5e3so' + '\n' +
          'Could not get a lock.' + '\n'
        );

        // No nextIdObject to send back. 
        // We are sending back the boolean false instead.
              //params:      stopTrying,    error, nextIdObject
        return callback(        false,      error,     false       ); 
      }
      else // The file was not already locked but there was another problem.
      {

        // We are not going make anymore attempts for a locked read and write to the gsuid.json file.
        // Erase the lock folder so that other users can read and increment the nextId.     
        lib.removeLock(function(lockError){
          if(!lockError)
          {
            helpers.log
            (
              7,
              'clp1z82jq8wauo0y7fbc' + '\n' +
              'An error occured when trying to get a locked read on the Global Sequential Unique ID' + '\n' +
              'This was the error:' + '\n' +
              JSON.stringify(error) + '\n'
            );
    
            // No nextIdObject to send back. 
            // We are sending back the boolean false instead.
    
                  //params: stopTrying,  error, nextIdObject
            return callback(    true,      error,     false       ); 
          }
          else
          {
            helpers.log
            (
              7,
              '03jkj6w0yugvvqo3xwkt' + '\n' +
              'An error occured when trying to get a locked read on the Global Sequential Unique ID' + '\n' +               
              'This was the error:' + '\n' +
              JSON.stringify(error) + '\n' +
              'Also there was an error removing the lock on the database' + '\n' +   
              JSON.stringify(lockError) + '\n'                                      
            );

                  //params:   stopTrying,   error, nextIdObject 
            return callback(      true,     error,     false      ); 
          }
        })
      }
    } 
  }); // End of: fs.mkdir(dbHistoryDir + 'gsuid.lock', function(error){...}
} // End of: lib.gsuidLockReadIncUnlock = function(){...}
// End of: Define a function to lock, read, increment and unlock the the Global Sequential Unique Id.




// Unlock the database so that a new proccess can write to it.
// All we are doing is erasing the folder gsuid.lock
lib.removeLock = function(callback)
{
  fs.rmdir
  (
    dbHistoryDir + 'gsuid.lock', 
    function(error)
    {
      if (!error) // We were able to remove the lock
      {
        callback(false);
      }
      else // We were not able to remove the lock
      {

        helpers.log
        (
          7,
          'ln7klp18i66ak5s4owwq' + '\n' +
          'Can not unlock the database.' + '\n' +
          'This was the error:' + '\n' +
          JSON.stringify(error) + '\n'
        );

        callback(JSON.stringify(error));
      } // End of: else we wer not able to remove the lock

    } // End of the callback
  ); // End of: fs.rmdir(...){...}
}; // End of: lib.removeLock = function(callback){...}
// End of: Unlock the database so that a new proccess can write to it.




// Define a function to manage lock attemps on the Global Sequential Unique Id.
lib.nextId = function(callback)
{
  // Holds the count of how many times we attempt to get a lock.
  var tryCount = 1;

  // Call without delay the function which attempts a locked read and increment of the global sequential unique ID.
  // Then run the callback defined here.
  lib.gsuidLockReadIncUnlock(function(stopTrying, error, nextIdObject)
  {
    helpers.log
    (
      4,
      'r2rffhtkfpobma6qsj5l' + '\n' +
      'The try count is ' + tryCount + '\n'
    );

    // If the gsuid file was locked we are going to try again in hopes it is now released.
    if(stopTrying == false && nextIdObject == false)
    {
      // Call setInterval to attempt a locked read after every 3 seconds.
      // The intervalControlObject is created when we call setInterval.
      // This will be used to stop setInterval from firing after we get a lock or after the
      // maximum number of lock attempts have been exceeded. 
      // setInterval will call lib.gsuidLockReadIncUnlock every 3 seconds.
      // The anonymous function defined below is the callback from gsuidLockReadIncUnlock.
      // So it runs when gsuidLockReadIncUnlock calls back with the nextIdObject or 
      // with boolean false if there was a problem.
      var intervalControlObject = 
      setInterval(lib.gsuidLockReadIncUnlock, 3000, function(stopTrying, error, nextIdObject)
      {
        // Increment the tryCount.
        tryCount = tryCount + 1;

        // if gsuidLockReadIncUnlock was not able to get a lock on the gsuid.json file.
        // We are letting setInterval run in hopes of getting a lock on gsuid.json next time
        if (stopTrying == false && nextIdObject == false)
        {
          // Report the current number of lock attemps to the console.
          helpers.log
          (
            4,
            'gnx7bp81kmswpajdo06g' + '\n' +
            'The try count is ' + tryCount + '\n'
          );
        } //End of: if (stopTrying == false && nextIdObject == false)


        // We got a lock on gsuid.json but could not read the file.
        // We are giving up on getting a locked read until we figure out what went wrong.
        else if(stopTrying == true && nextIdObject == false) 
        {
          // Stop calling lib.gsuidLockReadIncUnlock every 3 seconds
          clearInterval(intervalControlObject); 

          helpers.log
          (
            7,
            'p9hjguitshfc7vxxxs93' + '\n' +
            'We got a lock on the gsuid file but there was a problem reading it.' + '\n' +
            'This was the error:' + '\n' +
            JSON.stringify(error) + '\n'
          );        
    
                 //params:  error,  nextIdObject
          return callback(  error,      false      );      
        }


        else // We finally got a locked read on the gsuid.json file and were able
             // to increment the id and write it back to the file.
        {
          // Stop calling lib.gsuidLockReadIncUnlock every 3 seconds
          clearInterval(intervalControlObject);

          // Report the Global Sequential Unique Id to the console.
          helpers.log
          (
            4,
            'kv323g8n4otmv5m08zfw' + '\n' +
            'Success! The next Id is the following:' + '\n' +
            JSON.stringify(nextIdObject) + '\n'
          );

                 //params:   error,     nextIdObject
          return callback(   false,     nextIdObject   );
        }


        // If the maximum number of attemps have been exceeded.
        if(tryCount == 5)
        {
          // Stop calling lib.gsuidLockReadIncUnlock every 3 seconds
          clearInterval(intervalControlObject);

          helpers.log
          (
            5,
            '1xjvjk25hsx1z81ov41b' + '\n' +
            'Maximum number of tries has been exceeded.' + '\n'
          );

                 //params:     error,  nextIdObject
          return callback(     error,      false      );
        }; // End of: If the maximum number of attemps have been exceeded.

      }); // End of: Call setInterval to attempt a lock every 3 seconds.
      
    } // End of: If the gsuid file was locked
    else if(stopTrying == true && nextIdObject == false) // We got a lock on gsuid.json but could not read the file.
    {
      helpers.log
      (
        7,
        'egnqfq48ru4319c7sa4b' + '\n' +
        'We got a lock on the gsuid file but there was a problem reading or writing to it.' + '\n' +
        'This was the error:' + '\n' +
        JSON.stringify(error) + '\n'
      );

             //params:   error,  nextIdObject
      return callback(   error,      false      );      
    }
    else // Success! We got a lock and read on the first try.
    {
      helpers.log
      (
        4,
        'q2ba5ibvz4fa8cu6r6ch' + '\n' + 
        'Success! The next Id is the following:' + '\n' + 
        JSON.stringify(nextIdObject) + '\n'
      );

             //params:   error,      nextIdObject
      return callback(   false,      nextIdObject   );      
    } // End of: Success! We got a lock and read on the first try.

  }); // End of: lib.gsuidLockReadIncUnlock(undefined, function(nextIdObject)
}; // End of: lib.nextId = function(callback){...}
// End of: Define a function to manage lock attemps on the Global Sequential Unique Id.




// Define function to append a string to a file.  
// Create the file if it does not exist.  
lib.append = function(dir, fileName, appendObject, callback)
{
  // Convert the data object to a string.
  let stringData = JSON.stringify(appendObject);

  // Create a readable stream.
  const sourceStream = new Readable();

  // Load the readable stream with data.
  sourceStream.push(stringData + '\n');

  // Tell the stream no more data is coming.
  sourceStream.push(null);

  // Create a writable stream and specify the file which will receive the data from the readable stream.
  let destinationStream = fs.createWriteStream(lib.baseDir + dir + '/' + fileName + '.json', {flags : 'a'});

  /*
  // Use this code to test rollbacks. 
  // Uncomment this code and coment out the line above.
  // Be sure to change the fileName variable to match the file you are testing.
  if(fileName === "oContact")
  {
    // This line throws an error if the file already exists. That's what the x does in the flag object.
    var destinationStream = fs.createWriteStream(lib.baseDir + dir + '/' + fileName + '.json', {flags : 'ax'});
  }
  else
  {
    var destinationStream = fs.createWriteStream(lib.baseDir + dir + '/' + fileName + '.json', {flags : 'a'});
  }
  */

  pipeline
  (
    sourceStream,
    destinationStream,
    function(error)
    {
      if (!error) // If the string was appended successfully:
      {
        callback(false); // Report back there was no error
      } 
      else // The string was not appended successfully.
      {
        helpers.log
        (
          7,
          'h0fceuftq8xkdkvh4dl9' + '\n' +
          'Error appending to file ' + fileName + '\n' +
          'This was the error:' + '\n' +
          JSON.stringify(error) + '\n'
        );

        callback
        (
          '9d5ztg7dq55v78p1v3tl' + '\n' +
          'Error appending to file ' + fileName + '\n' +
          'This was the error:' + '\n' +
          JSON.stringify(error)
        );        
      }
    }
  );
}; // End of: lib.append = function(...
// End of: Append a string to a file. 




// Define function to log general comments.
// The destination folder is hard coded to "dbActivity".
// arguments:
// fileName is the name of the log file. A .json extension will be added.
// "user" is the name of the user making the comment. This will be fun to tokenize for security.
// comment is a string. It's what the user wants to say.
// Data is written as JSON objects.
lib.logComment = function(fileName, user, comment)
{
  // Define the target directory.
  // It might be good to put this variable in the config file.
  var dir = 'database/dbActivity'

  //create a JSON object from the input.
  var objToLog = {
    "user" : user,
    "comment" : comment
  };

  // Call the function which appends the logString to a file.
  lib.append(dir, fileName, objToLog, function(err)
  {
    if(!err) // If the append was successful:
    {
      console.log('Logging to ' + fileName + ' file succeeded.');
    }
    else // The append was not successful.
    {
      console.log('logging to ' + fileName + ' file did not succeed.');
      console.log(err);
    }
  }); // End of: lib.append(...
  // End of: Call the function which appends the logString to a file.

}; // End of: lib.logObj = function(...
// End of: Define function to Log a comment




// Define a function for reading data from a file.
// Used for reading files that have only one json record like gsuid.json
// Also used for now when client is sending a get request from the browser. 
// Will be changing this function to use read and write streams soon.
lib.read = function(dir, file, callback)
{  
  // Call the nodejs readFile function.
  fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function(err, data)
  {
    // If there is no read error and data was returned then do the following: 
    if(!err && data)
    {
      // Create a JSON object from the JSON string that was returned from the read.
      var parsedData = helpers.parseJsonToObject(data);

      // Pass the JSON object to the callback function and run it.
      callback(false, parsedData)

    } // End of: If there was no read error...
    else // There was a problem with the read so:
    {
      helpers.log
      (
        7,
        'qs9tayvevafco6598owy' + '\n' +
        'Could not read file ' + '\n' +
        'This was the error:' + '\n' +
        JSON.stringify(err) + '\n'
      );

      // Pass the error object and the data from the read to the callback and run it.
      callback(err, data);
    } // End of: else there was a problem with the read.

  }); // End of: Call fs.readFile(...
} // End of: Define a function for reading data from a file.




// Define a function to update data in a file.
// This function clears out any previous data in the file.
// Used for updating files that have only one json record like gsuid.json, token files, and check files.
// There is a lib.append function above that adds new lines without erasing the previous data.
// lib.append (not this function) is used for put requests where files contain multiple json records.
lib.update = function(dir, file, data, callback)
{
  //Open the file for writing.
  fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', function(err, fileDescriptor)
  {
    // if the file was opened successfully
    if(!err && fileDescriptor) 
    {
      // Turn the clients payload from a json object to a string 
      var stringData = JSON.stringify(data);

      //Truncate the file. That is to say clear out any data in the file.
      fs.ftruncate(fileDescriptor, function(err)
      {
        if(!err)
        {
          // Write to the file and close it.
          fs.writeFile(fileDescriptor, stringData, function(err)
          {
            if(!err)
            {
              fs.close(fileDescriptor, function(err)
              {
                if(!err)
                {
                  callback(false);
                } 
                else 
                {
                  helpers.log
                  (
                    7,
                    'ans83rc3oh0y2z86dxu7' + '\n' +
                    'Could not close file ' + '\n' +
                    'This was the error:' + '\n' +
                    JSON.stringify(err) + '\n'
                  );

                  callback('There was an error closing the file');
                }
              });
            } 
            else 
            {
              helpers.log
              (
                7,
                'sq5f7qfn87t98o6ix2pu' + '\n' +
                'Error writing to existing file.' + '\n' +
                'This was the error:' + '\n' +
                JSON.stringify(err) + '\n'
              );

              callback('Error writing to existing file.');
            }
          });  
        } 
        else 
        {
          helpers.log
          (
            7,
            '1hg33z6svppig8tnf4eo' + '\n' +
            'Error truncating the file' + '\n' +
            'This was the error:' + '\n' +
            JSON.stringify(err) + '\n'
          );

          callback('Error truncating the file');
        }
      });

    } // End of: if the file was opened successfully
    else // the file was not opened successfully
    {
      helpers.log
      (
        7,
        '36samm83kf5igbu0y0gt' + '\n' +
        'Could not open file for updating. It may not exist yet' + '\n' +
        'This was the error:' + '\n' +
        JSON.stringify(err) + '\n'
      );

      callback('Could not open file for updating. It may not exist yet');
    }
  }); // End of: Call to fs.open(...
  // End of: Open the file for writing.

}; // End of: lib.update = function(...
// End of: Define a function to update data in a file.




// Export the module
module.exports = lib;





