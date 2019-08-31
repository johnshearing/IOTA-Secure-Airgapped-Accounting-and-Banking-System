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




// Define a function to log messages to the screen and to a log file.
lib.log = function(message) 
{
  // If the logToDisplay flag above is set to true:
  if (config.logToConsole) 
  { 
    console.log(message);
  }

  // If the writeToLog flag is set to true:
  if (config.writeToLog) 
  { 

    // Test if message is an object. Stringify it if it is indeed an object. Otherwise pass it through unchanged.
    message = Object.prototype.toString.call(message) === "[object Object]" ? JSON.stringify(message) : message;

    // Open a writable stream to the activityLog file.
    let wLogStream = fs.createWriteStream(lib.baseDir + 'dbLogs' + '/' + 'activityLog' + '.json', {flags : 'a'});

    // Wait till the file is open before trying to write to it.
    wLogStream.on('open', function() 
    {
      // Call function to append data to the file with a new line character added at the end.
      wLogStream.write(message + '\n'); 

    }); // End of: wStream.on('open', function(){Do stuff}
    // End of: Wait till the file is open before trying to write to it.

  } // End of: if (lib.writeToLog){...}

} // End of: lib.log = function(){...}




// Define a function to lock, read, increment and unlock the the Global Sequential Unique Id.
// The idRange parameter specifies how many IDs to return.
lib.gsuidLockReadIncUnlock = function(idRange, callback)
{
  // ToDo:  
  // Check that no lock file exists on startup.
  // Make an initialization script for the first time we use the system that creates gsuid.json if it does not exist. 
  // Log failures to get a lock. The log obviously must not depend on the gsuid.
  // Start making testing functions for the app.

  // Define the path were the lock folder is to be created.
  var dbHistoryDir = lib.baseDir + 'dbHistory/';

  try 
  {
    // Create a folder called "lock" in the dbHistory folder.
    // Once this folder has been created no one else will be able run this code.
    // If someone else tries then an error will be thrown (folder called "lock" already exists).
    // This prevents execution of any code that follows.
    fs.mkdirSync(dbHistoryDir + 'gsuid.lock'); 

    // Call read function to get the nextId JSON object from the gsuid file then run the callback function defined here.
    lib.read('dbHistory', 'gsuid', function(err, nextIdObject)
    {
      // We obtained the nextIdObject without error.
      if(!err && nextIdObject)
      {
        // Increment nextId
        nextIdObject.nextId = nextIdObject.nextId + idRange;     

        // Call the update function to write the incremented nextId object back to the gsuid.json file.
        lib.update('dbHistory', 'gsuid', nextIdObject, function(err)
        {
          if(!err) // There was no error writing the incremented nextId back to the file.
          {
            // Erase the lock folder so that other users can read and increment the nextId.         
            fs.rmdirSync(dbHistoryDir + 'gsuid.lock');

            lib.log
            (
              'qtjwjum5b9l4ww8wo1rb' + '\n' +
              'Got a good locked read' + '\n' +
              '\n'
            );

                   //params:   stopTrying, error, nextIdObject 
            return callback(      true,    false, nextIdObject);            
          }
          else // There was an error writing the incremented nextId back to the file.
          {
            // We are not going make anymore attempts for a locked read and write to the gsuid.json file.
            // Erase the lock folder so that other users can read and increment the nextId.         
            fs.rmdirSync(dbHistoryDir + 'gsuid.lock');

            lib.log
            (
              '97xxiel6uubzxgzc1j14' + '\n' +
              'There was an error writing the incremented nextId back to the file:' + '\n' +
              'This was the error:' + '\n' +
              JSON.stringify(err) + '\n' +           
              '\n'
            );

                   //params:   stopTrying, error, nextIdObject 
            return callback(      true,     err,     false      ); 
          }
        }); // End of: lib.update('dbHistory', 'gsuid', nextIdObject,...

      }
      else // Problem reading gsuid.json. There was an error or no data was returned.
      {

        // We are not going make anymore attempts for a locked read and write to the gsuid.json file.
        // Erase the lock folder so that other users can read and increment the nextId.         
        fs.rmdirSync(dbHistoryDir + 'gsuid.lock');

        lib.log
        (
          'vqihr0azmm9vasc21885' + '\n' +
          'Problem reading gsuid.json.' + '\n' +
          'This is the error:' + '\n' +
          JSON.stringify(err) + '\n' +
          '\n'
        );

               //params:    stopTrying, error, nextIdObject 
        return callback(       true,     err,      false      ); 
      }

    }); // End of: call to lib.read(...
  } // End of: try block
  catch(err) 
  {
    // If the file was locked by another user
    if(err.syscall == 'mkdir' && err.code == 'EEXIST')
    {   
      lib.log
      (
        'zz1iv0q1o0702wk5e3so' + '\n' +
        'Could not get a lock.' + '\n' +    
        '\n'
      );

      // No nextIdObject to send back. 
      // We are sending back the boolean false instead.
             //params:      stopTrying,  error, nextIdObject
      return callback(        false,      err,     false       ); 
    }
    else // The file was not already locked but there was another problem.
    {

      // We are not going make anymore attempts for a locked read and write to the gsuid.json file.
      // Erase the lock folder so that other users can read and increment the nextId.         
      fs.rmdirSync(dbHistoryDir + 'gsuid.lock');    

      lib.log
      (
        'clp1z82jq8wauo0y7fbc' + '\n' +
        'An error occured when trying to get a locked read on the Global Sequential Unique ID' + '\n' +
        'This was the error:' + '\n' +
        JSON.stringify(err) + '\n' +
        '\n'
      );

      // No nextIdObject to send back. 
      // We are sending back the boolean false instead.

             //params: stopTrying,  error, nextIdObject
      return callback(    true,      err,     false       ); 
    }

  } // End of: catch block
}; // End of: lib.gsuidLockReadIncUnlock = function(){...}
// End of: Define a function to lock, read, increment and unlock the the Global Sequential Unique Id.




// Define a function to manage lock attemps on the Global Sequential Unique Id.
lib.nextId = function(idRange, callback)
{
  // Holds the count of how many time we attempt to get a lock.
  var tryCount = 1;

  // Call without delay the function which attempts a locked read and increment of the global sequential unique ID.
  // Then run the callback defined here.
  // The idRange parameter specifies how many IDs to return.
  lib.gsuidLockReadIncUnlock(idRange, function(stopTrying, error, nextIdObject)
  {
    lib.log
    (
      'r2rffhtkfpobma6qsj5l' + '\n' +
      'The try count is ' + tryCount + '\n' +
      '\n'
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
      setInterval(lib.gsuidLockReadIncUnlock, 3000, idRange, function(stopTrying, error, nextIdObject)
      {
        // Increment the tryCount.
        tryCount = tryCount + 1;

        // if gsuidLockReadIncUnlock was not able to get a lock on the gsuid.json file.
        // We are letting setInterval run in hopes of getting a lock on gsuid.json next time
        if (stopTrying == false && nextIdObject == false)
        {
          // Report the current number of lock attemps to the console.
          lib.log
          (
            'gnx7bp81kmswpajdo06g' + '\n' +
            'The try count is ' + tryCount + '\n' +
            '\n'
          );
        } //End of: if (stopTrying == false && nextIdObject == false)


        // We got a lock on gsuid.json but could not read the file.
        // We are giving up on getting a locked read until we figure out what went wrong.
        else if(stopTrying == true && nextIdObject == false) 
        {
          // Stop calling lib.gsuidLockReadIncUnlock every 3 seconds
          clearInterval(intervalControlObject); 

          lib.log
          (
            'p9hjguitshfc7vxxxs93' + '\n' +
            'We got a lock on the gsuid file but there was a problem reading it.' + '\n' +
            'This was the error:' + '\n' +
            JSON.stringify(error) + '\n' +
            '\n'
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
          lib.log
          (
            'kv323g8n4otmv5m08zfw' + '\n' +
            'Success! The next Id is the following:' + '\n' +
            JSON.stringify(nextIdObject) + '\n' +
            '\n'
          );

                 //params:   error,     nextIdObject
          return callback(   false,     nextIdObject   );
        }


        // If the maximum number of attemps have been exceeded.
        if(tryCount == 5)
        {
          // Stop calling lib.gsuidLockReadIncUnlock every 3 seconds
          clearInterval(intervalControlObject);

          lib.log
          (
            '1xjvjk25hsx1z81ov41b' + '\n' +
            'Maximum number of tries has been exceeded.' + '\n' +
            '\n'
          );

                 //params:     error,  nextIdObject
          return callback(     error,      false      );
        }; // End of: If the maximum number of attemps have been exceeded.

      }); // End of: Call setInterval to attempt a lock every 3 seconds.
      
    } // End of: If the gsuid file was locked
    else if(stopTrying == true && nextIdObject == false) // We got a lock on gsuid.json but could not read the file.
    {
      lib.log
      (
        'egnqfq48ru4319c7sa4b' + '\n' +
        'We got a lock on the gsuid file but there was a problem reading or writing to it.' + '\n' +
        'This was the error:' + '\n' +
        JSON.stringify(error) + '\n' +
        '\n'
      );

             //params:   error,  nextIdObject
      return callback(   error,      false      );      
    }
    else // Success! We got a lock and read on the first try.
    {
      lib.log
      (
        'q2ba5ibvz4fa8cu6r6ch' + '\n' + 
        'Success! The next Id is the following:' + '\n' + 
        JSON.stringify(nextIdObject) + '\n' + 
        '\n'
      );

             //params:   error,      nextIdObject
      return callback(   false,      nextIdObject   );      
    } // End of: Success! We got a lock and read on the first try.

  }); // End of: lib.gsuidLockReadIncUnlock(undefined, function(nextIdObject)
}; // End of: lib.nextId = function(callback){...}
// End of: Define a function to manage lock attemps on the Global Sequential Unique Id.




// Define function to Log a comment
// arguments:
// fileName is the name of the log file. 
// The comment will go into the log folder with the .log extension appended to the file name.
// user is the name of the user making the comment. This will be fun to tokenize for security.
// comment is a string. It's what the user want's to say.
lib.logComment = function(fileName, user, comment)
{
  // Define the target directory.
  // It might be good to put this variable in the config file.
  var dir = 'dbLogs'

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




// Define function to append a string to a file.  
// Create the file if it does not exist.  
lib.append = function(dir, fileName, appendObject, callback)
{
  // Convert the data object to a string.
  let stringData = JSON.stringify(appendObject);

  const sourceStream = new Readable();

  sourceStream.push(stringData + '\n');
  sourceStream.push(null);

  let destinationStream = fs.createWriteStream(lib.baseDir + dir + '/' + fileName + '.json', {flags : 'a'});


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
        lib.log
        (
          'h0fceuftq8xkdkvh4dl9' + '\n' +
          'Error appending to file ' + fileName + '\n' +
          'This was the error:' + '\n' +
          JSON.stringify(error) + '\n' + 
          '\n'
        );

        callback
        (
          'h0fceuftq8xkdkvh4dl9' + '\n' +
          'Error appending to file ' + fileName + '\n' +
          'This was the error:' + '\n' +
          JSON.stringify(error) + '\n'
        );        

        // callback('Error appending to file ' + fileName)
      }
    }
  );
}; // End of: lib.append = function(...
// End of: Append a string to a file. 




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
      lib.log
      (
        'qs9tayvevafco6598owy' + '\n' +
        'Could not read file ' + '\n' +
        'This was the error:' + '\n' +
        JSON.stringify(err) + '\n' +  
        '\n'
      );

      // Pass the error object and the data from the read to the callback and run it.
      callback(err, data);
    } // End of: else there was a problem with the read.

  }); // End of: Call fs.readFile(...
} // End of: Define a function for reading data from a file.




// Define a function to update data in a file.
// This function clears out any previous data in the file.
// Used for updating files that have only one json record like gsuid.json
// Also used when client is sending a put request from the browser.
// There is a lib.append function above that adds new lines without erasing the previous data.
// Likely, lib.append will be used for put requests where there are files containing multiple json records.
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
                  lib.log
                  (
                    'ans83rc3oh0y2z86dxu7' + '\n' +
                    'Could not close file ' + '\n' +
                    'This was the error:' + '\n' +
                    JSON.stringify(err) + '\n' +
                    '\n'
                  );

                  callback('There was an error closing the file');
                }
              });
            } 
            else 
            {
              lib.log
              (
                'sq5f7qfn87t98o6ix2pu' + '\n' +
                'Error writing to existing file.' + '\n' +
                'This was the error:' + '\n' +
                JSON.stringify(err) + '\n' + 
                '\n'
              );

              callback('Error writing to existing file.');
            }
          });  
        } 
        else 
        {
          lib.log
          (
            '1hg33z6svppig8tnf4eo' + '\n' +
            'Error truncating the file' + '\n' +
            'This was the error:' + '\n' +
            JSON.stringify(err) + '\n' +
            '\n'
          );

          callback('Error truncating the file');
        }
      });

    } // End of: if the file was opened successfully
    else // the file was not opened successfully
    {
      lib.log
      (
        '36samm83kf5igbu0y0gt' + '\n' +
        'Could not open file for updating. It may not exist yet' + '\n' +
        'This was the error:' + '\n' +
        JSON.stringify(err) + '\n' +
        '\n'
      );

      callback('Could not open file for updating. It may not exist yet');
    }
  }); // End of: Call to fs.open(...
  // End of: Open the file for writing.

}; // End of: lib.update = function(...
// End of: Define a function to update data in a file.




// Export the module
module.exports = lib;





