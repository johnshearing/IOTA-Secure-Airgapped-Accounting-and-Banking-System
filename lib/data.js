/*
/Library for storing and editing data
*/

// Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');




// Create container for the module to be exported.
var lib = {};




// Define the base directory of the data folder.
lib.baseDir = path.join(__dirname, '/../data/');




// Define a function to lock, read, increment and unlock the the Global Sequential Unique Id.
lib.gsuidLockReadIncUnlock = function(callback)
{
  // ToDo:  
  // Check that no lock file exists on startup.
  // Make an initialization script for the first time we use the system that creates gsuid.json if it does not exist. 
  // Define the path were the lock folder is to be created.
  var dbHistoryDir = lib.baseDir + 'database/dbHistory/';

  try 
  {
    // Create a folder called "lock" in the dbHistory folder.
    // Once this folder has been created no one else will be able run this code.
    // If someone else tries then an error will be thrown (folder called "lock" already exists).
    // This prevents execution of any code that follows.
    fs.mkdirSync(dbHistoryDir + 'gsuid.lock'); 

    // Call read function to get the nextId JSON object from the gsuid file then run the callback function defined here.
    lib.read('database/dbHistory', 'gsuid', function(err, nextIdObject)
    {
      // We obtained the nextIdObject without error.
      if(!err && nextIdObject)
      {
        // Increment nextId
        nextIdObject.nextId = nextIdObject.nextId + 1;     

        // Call the update function to write the incremented nextId object back to the gsuid.json file.
        lib.update('database/dbHistory', 'gsuid', nextIdObject, function(err)
        {
          if(!err) // There was no error writing the incremented nextId back to the file.
          {
            // Erase the lock folder so that other users can read and increment the nextId.         
            fs.rmdirSync(dbHistoryDir + 'gsuid.lock');

            helpers.log('qtjwjum5b9l4ww8wo1ra');
            helpers.log('Got a good locked read');
            helpers.log('');

                   //params:   stopTrying, error, nextIdObject 
            return callback(      true,    false, nextIdObject);            
          }
          else // There was an error writing the incremented nextId back to the file.
          {
            // We are not going make anymore attempts for a locked read and write to the gsuid.json file.
            // Erase the lock folder so that other users can read and increment the nextId.         
            fs.rmdirSync(dbHistoryDir + 'gsuid.lock');

            helpers.log('97xxiel6uubzxgzc1j13');
            helpers.log('There was an error writing the incremented nextId back to the file:');
            helpers.log('This was the error:');
            helpers.log(err);            
            helpers.log('');

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

        helpers.log('vqihr0azmm9vasc21884');
        helpers.log('Problem reading gsuid.json.');
        helpers.log('This is the error:');
        helpers.log(err);
        helpers.log('');

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
      helpers.log('zz1iv0q1o0702wk5e3sn')
      helpers.log('Could not get a lock.');    
      helpers.log('');

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

      helpers.log('clp1z82jq8wauo0y7fbb');
      helpers.log('An error occured when trying to get a locked read on the Global Sequential Unique ID');
      helpers.log('This was the error:');
      helpers.log(err); 
      helpers.log('');

      // No nextIdObject to send back. 
      // We are sending back the boolean false instead.

             //params: stopTrying,  error, nextIdObject
      return callback(    true,      err,     false       ); 
    }

  } // End of: catch block
}; // End of: lib.gsuidLockReadIncUnlock = function(){...}
// End of: Define a function to lock, read, increment and unlock the the Global Sequential Unique Id.




// Define a function to manage lock attemps on the Global Sequential Unique Id.
lib.nextId = function(callback)
{
  // Holds the count of how many time we attempt to get a lock.
  var tryCount = 1;

  // Call without delay the function which attempts a locked read and increment of the global sequential unique ID.
  // Then run the callback defined here.
  lib.gsuidLockReadIncUnlock(function(stopTrying, error, nextIdObject)
  {
    helpers.log('r2rffhtkfpobma6qsj5k');
    helpers.log('The tryCount is ' + tryCount);
    helpers.log('');

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
          helpers.log('gnx7bp81kmswpajdo06f');
          helpers.log('The try count is ' + tryCount);
          helpers.log(''); 
        }


        // We got a lock on gsuid.json but could not read the file.
        // We are giving up on getting a locked read until we figure out what went wrong.
        else if(stopTrying == true && nextIdObject == false) 
        {
          // Stop calling lib.gsuidLockReadIncUnlock every 3 seconds
          clearInterval(intervalControlObject); 

          helpers.log('p9hjguitshfc7vxxxs92');
          helpers.log('We got a lock on the gsuid file but there was a problem reading it.');
          helpers.log('This was the error:');
          helpers.log(error);    
          helpers.log('');        
    
                 //params:  error,  nextIdObject
          return callback(  error,      false      );      
        }


        else // We finally got a locked read on the gsuid.json file and were able
             // to increment the id and write it back to the file.
        {
          // Stop calling lib.gsuidLockReadIncUnlock every 3 seconds
          clearInterval(intervalControlObject);

          // Report the Global Sequential Unique Id to the console.
          helpers.log('kv323g8n4otmv5m08zfv');
          helpers.log('Success! ', nextIdObject);
          helpers.log('');

                 //params:   error,     nextIdObject
          return callback(   false,     nextIdObject   );
        }


        // If the maximum number of attemps have been exceeded.
        if(tryCount == 5)
        {
          // Stop calling lib.gsuidLockReadIncUnlock every 3 seconds
          clearInterval(intervalControlObject);

          helpers.log('1xjvjk25hsx1z81ov41a');
          helpers.log('Maximum number of tries has been exceeded.');
          helpers.log('');

                 //params:     error,  nextIdObject
          return callback(     error,      false      );
        }; // End of: If the maximum number of attemps have been exceeded.

      }); // End of: Call setInterval to attempt a lock every 3 seconds.
      
    } // End of: If the gsuid file was locked
    else if(stopTrying == true && nextIdObject == false) // We got a lock on gsuid.json but could not read the file.
    {
      helpers.log('egnqfq48ru4319c7sa4a');
      helpers.log('We got a lock on the gsuid file but there was a problem reading or writing to it.');
      helpers.log('This was the error:');
      helpers.log(error);   
      helpers.log('');

             //params:   error,  nextIdObject
      return callback(   error,      false      );      
    }
    else // Success! We got a lock and read on the first try.
    {
      helpers.log('q2ba5ibvz4fa8cu6r6cg');
      helpers.log('Success! ', nextIdObject);
      helpers.log('');

             //params:   error,      nextIdObject
      return callback(   false,      nextIdObject   );      
    } // End of: Success! We got a lock and read on the first try.

  }); // End of: lib.gsuidLockReadIncUnlock(undefined, function(nextIdObject)
}; // End of: lib.nextId = function(callback){...}
// End of: Define a function to manage lock attemps on the Global Sequential Unique Id.





// Define a function to create a new file and write json data to it.
// Used when client is posting from browser.
lib.create = function(dir, file, data, callback)
{
  // Create file and open for writing.
  fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', function(err, fileDescriptor)
  {
    if(!err && fileDescriptor) // if the file was created and opened successfully:
    {
      //Convert data to string.
      var stringData = JSON.stringify(data);

      // Write to file.
      fs.writeFile(fileDescriptor, stringData, function(err)
      {
        if(!err) // if the file was written to successfully:
        {
          // Close the file.
          fs.close(fileDescriptor, function(err)
          {
            if(!err) // if the file was closed successfully
            {
              callback(false); // Report there was no error
            } 
            else // the file was not closed successfully.
            {
              callback('Error closing new file');
            }
          }); // End of: call fs.close(...
        } 
        else // The file was not written to successfully
        {
          callback('Error writing to new file.');
        }
      }); // End of: call to fs.writeFile(...
    } 
    else // the file was not created and opened successfully:
    {
      callback('Could not create new file, it may already exist.');
    }
  }); // Call fs.open(...
}; //lib.create = function(...
// End of: Define a function to create a new file and write json data to it.




// Define a function for reading data from a file.
// Used when client is sending a get request from the browser
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
      // Pass the error object and the data from the read to the callback and run it.
      callback(err, data);
    } // End of: else there was a problem with the read.

  }); // End of: Call fs.readFile(...
} // End of: Define a function for reading data from a file.





// Define a function to update data in a file.
// Used when client is sending a put request from the browser.
// This function clears out any previous data in the file.
// There is a lib.append function further down that adds new lines without erasing the previous data.
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
                  callback('There was an error closing the file');
                }
              });
            } 
            else 
            {
              callback('Error writing to existing file.');
            }
          });  
        } 
        else 
        {
          callback('Error truncating the file');
        }
      });

    } // End of: if the file was opened successfully
    else // the file was not opened successfully
    {
      callback('Could not open file for updating. It may not exist yet');
    }
  }); // End of: Call to fs.open(...
  // End of: Open the file for writing.

}; // End of: lib.update = function(...
// End of: Define a function to update data in a file.



// Define a function to delete a file.
lib.delete = function(dir, file, callback)
{
  //Unlink the file
  fs.unlink(lib.baseDir + dir + '/' + file + '.json', function(err)
  {
    if(!err) // if the file was unlinked (deleted) successfully:
    {
      callback(false);
    } 
    else // the file was not deleted successfully.
    {
      callback('Error deleting file.');  
    }
  }); // End of: call to fs.unlink(...

}; // End of: lib.delete = function(...
// End of: Define a function to delete a file.




// Define a function to call and test the lib.list function below.
// This is just to test the list function below to see what it returns under various conditions.
// This can be deleted. It is no longer needed.
lib.listCall = function(dir)
{

  // Call the list function. 
  // Pass in a directory and a callback function argument.
  lib.list(dir, function(err, data)
  {
    if(!err) // If the directory exists and it was not empty
    {
      console.log('On success, the directory list is of datatype ' + typeof(data));
      console.log('The statement data isArray is shown to be ' + Array.isArray(data));
      console.log('And the data is as follows');
      console.log(data);
      console.log('The error is ** ' + err + '**');
      console.log('On success, err is of datatype ' + typeof(err));      
    }
    else // the directory does not exist or the directory was empty.
    {
      console.log('On failure, the directory list is of datatype ' + typeof(data));
      console.log('And the data is as follows');
      console.log(data);
      console.log('The error is ** ' + err + '**');      
      console.log('On failure, err is of datatype ' + typeof(err));        
    }
  }); // End of: lib.list(...
  // End of: Call the list function.

}; // lib.listCall = function(dir){...
// end of: Define a function to call and test the lib.list function below.




// Define function to List all the items in a directory
lib.list = function(dir,callback)
{
  // Call function to read the contents of a directory.
  fs.readdir(lib.baseDir + dir + '/', function(err,data)
  {
    // If the directory exists and it contains files:
    //  then fs.readdir will return err as a boolean with a value of false
    //  so !err will be true if files are found.
    //  and data will be an array populated with file names.
    if(!err && data && data.length > 0) 
    {
      // Create and empty array to hold file names.
      var trimmedFileNames = [];

      // Fill the trimmedFileName array with file names from the 
      //data array that have the .json extension stripped off if it's there.
      data.forEach(function(fileName)
      {
        trimmedFileNames.push(fileName.replace('.json',''));
      });

      // Report back to caller that there was no error and return the truncated filenames.
      callback(false,trimmedFileNames);
    } 
    else // The directory was not found or it was empty.
    {
      // If no directory was found then fs.readdir will return data as an undefined datatype with a value of undefined of course.
      // err will be returned as an object with an error message stating that no directory was found.
 
      // If the directory was empty then fs.readdir will return data as an empty array
      //   and err will be returned as an object with a value of null
      callback(err,data);
    }
  }); // End of: fs.readdir(...
  // End of: Call function to read the contents of a directory.

}; // End of: lib.list = function(...
// End of: Define function to List all the items in a directory




// Define function to Log a comment
// arguments:
// fileName is the name of the log file. It will go into the log folder with the .log extension appended to the file name.
// user is the name of the user making the comment. This will be fun to tokenize for security.
// comment is a string. It's what the user want's to say.
lib.logComment = function(fileName, user, comment)
{
  // Define the target directory.
  // It might be good to put this variable in the config file.
  var dir = 'logs'

  //create a JSON object from the input.
  var objToLog = {
    "user" : user,
    "comment" : comment
  };

  // Convert the JSON object to a string so it can go into a text file.
  var logString = JSON.stringify(objToLog);

  // Call the function which appends the logString to a file.
  lib.append(dir, fileName, logString, function(err)
  {
    if(!err) // If the append was successful:
    {
      console.log('Logging to ' + fileName + ' file succeeded.');
    }
    else // The append was not successful.
    {
      console.log('logging to ' + fileName + ' file did not succeed.');
    }
  }); // End of: lib.append(...
  // End of: Call the function which appends the logString to a file.

}; // End of: lib.logObj = function(...
// End of: Define function to Log a comment




// Define function to append a string to a file. 
// Create the file if it does not exist.  
lib.append = function(dir, fileName, appendString, callback)
{
  // Call function to open the file for appending. 
  // Create the file if it does not already exist.
  fs.open(lib.baseDir + dir + '/' + fileName + '.log', 'a', function(err, fileDescriptor){

    if(!err && fileDescriptor) // If the file was opened successfully:
    {
      // Call function to append the string to the file with a new line character added at the end.
      fs.appendFile(fileDescriptor, appendString + '\n', function(err){

        if(!err) // If the string was appended successfully:
        {
          // Call function to close the file.
          fs.close(fileDescriptor, function(err){

            if(!err) // If the file was closed successfully:
            {
              callback(false); // Report back there was no error
            }
            else // The file was not closed successfully.
            {
              callback('Error closing file ' + fileName + '.log');
            }
          }); // End of: fs.close(...
          // End of: Call function to close the file.

        } // End of: If the string was appended successfully:
        else // The string was not appended successfully.
        {
          callback('Error appending to file ' + fileName + '.log')
        } // End of: else The string was not appended successfully.

      }); //End of: fs.appendFile(...
      // End of: Call function to append the string to the file with a new line character added at the end.      

    } // End of: If the file was opened successfully:
    else // The file was not opened successfully:
    {
      callback('Could not open file ' + fileName + ' for appending');
    } // End of: The file was not opened successfully:

  }); // End of: fs.open(...
  // End of: Call function to open the file for appending. 

}; // End of: lib.append = function(...
// End of: Append a string to a file. 




// For testing the nextId function from the console.
// Comment out for production.
/*
lib.nextId(function(error, nextIdObject)
{
  console.log('sgqdqaz0d7o4e2siu9ue');
  console.log('This is the nextIdObject: ', nextIdObject);
  console.log('Below is the error. A value of false would indicate there was no error. \n', error); 
});
*/



// Export the module
module.exports = lib;





