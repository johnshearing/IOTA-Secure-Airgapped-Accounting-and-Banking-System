/*
 * Worker-related tasks
 *
 */

// Dependencies
var path = require('path');
var fs = require('fs');
var _data = require('./data');
var https = require('https');
var http = require('http');
var helpers = require('./helpers');
var url = require('url');
var _logs = require('./logs')
 



// Instantiate the worker module object
var workers = {};
 



// Define a function to lookup all checks, get their data, send to validator
workers.gatherAllChecks = function()
{
    // Get all the checks found in the check directory
    _data.list('checks',function(err,checks)
    {
        if(!err && checks && checks.length > 0) // checks were found
        {
            // Loop through the checks.
            checks.forEach(function(check)
            {
                // Read check data from the file
                _data.read('checks',check,function(err,originalCheckData)
                {           
                    if(!err && originalCheckData) // the check json record was successfully read from the file
                    {
                        // Pass it to the check validator, and let that function continue the function or log the error(s) as needed
                        workers.validateCheckData(originalCheckData);
                    } 
                    else // there was a problem reading the check file
                    {
                        console.log("Error reading one of the check's data: ",err);
                    }
                }); // End of: Read check data from the file
            }); // End of: // Loop through the checks.
        } // End of: checks were found
        else // there were no checks found.
        {
            console.log('Error: Could not find any checks to process');
        }
    });
}; //End of: workers.gatherAllChecks = function(){Do stuff}
// End of: Define a function to lookup all checks, get their data, send to validator 




// Sanity-check the check-data,
workers.validateCheckData = function(originalCheckData)
{
    // Validate each item of information
    originalCheckData = typeof(originalCheckData) == 'object' && originalCheckData !== null ? originalCheckData : {};
    originalCheckData.id = typeof(originalCheckData.id) == 'string' && originalCheckData.id.trim().length == 20 ? originalCheckData.id.trim() : false;
    originalCheckData.userPhone = typeof(originalCheckData.userPhone) == 'string' && originalCheckData.userPhone.trim().length == 10 ? originalCheckData.userPhone.trim() : false;
    originalCheckData.protocol = typeof(originalCheckData.protocol) == 'string' && ['http','https'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol : false;
    originalCheckData.url = typeof(originalCheckData.url) == 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim() : false;
    originalCheckData.method = typeof(originalCheckData.method) == 'string' &&  ['post','get','put','delete'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method : false;
    originalCheckData.successCodes = typeof(originalCheckData.successCodes) == 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ? originalCheckData.successCodes : false;
    originalCheckData.timeoutSeconds = typeof(originalCheckData.timeoutSeconds) == 'number' && originalCheckData.timeoutSeconds % 1 === 0 && originalCheckData.timeoutSeconds >= 1 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds : false;
    // Set the keys that may not be set (if the workers have never seen this check before)
    originalCheckData.state = typeof(originalCheckData.state) == 'string' && ['up','down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down';
    originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) == 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;

    // If all checks pass, pass the data along to the next step in the process
    if(originalCheckData.id &&
    originalCheckData.userPhone &&
    originalCheckData.protocol &&
    originalCheckData.url &&
    originalCheckData.method &&
    originalCheckData.successCodes &&
    originalCheckData.timeoutSeconds)
    {
        // pass the validated data on to the next function and execute function.
        workers.performCheck(originalCheckData);
    } 
    else // one or more items passed in did not pass it's validation test
    {
        // If checks fail, log the error and fail silently
        console.log("Error: one of the checks is not properly formatted. Skipping.");
    }
};




// Perform the check, send the originalCheck data and the outcome of the check process to the next step in the process
workers.performCheck = function(originalCheckData)
{
    // Prepare the intial check outcome object
    var checkOutcome = 
    {
        'error' : false,
        'responseCode' : false
    };

    // Mark that the outcome has not been sent yet
    var outcomeSent = false;

    // Parse the hostname and path out of the originalCheckData
    var parsedUrl = url.parse(originalCheckData.protocol+'://'+originalCheckData.url, true);
    var hostName = parsedUrl.hostname;
    var path = parsedUrl.path; // Using path not pathname because we want the query string

    // Construct the request object
    var requestDetails = 
    {
        'protocol' : originalCheckData.protocol+':',
        'hostname' : hostName,
        'method' : originalCheckData.method.toUpperCase(),
        'path' : path,
        'timeout' : originalCheckData.timeoutSeconds * 1000
    };

    // Instantiate the request object (using either the http or https module)
    var _moduleToUse = originalCheckData.protocol == 'http' ? http : https;

    // Define what will happen when the request is executed and if no error was encountered.
    var req = _moduleToUse.request(requestDetails,function(res)
    {
        // Grab the status of the sent request
        var status =  res.statusCode;

        // Update the checkOutcome and pass the data along
        checkOutcome.responseCode = status;

        if(!outcomeSent)
        {   // call the next function
            workers.processCheckOutcome(originalCheckData,checkOutcome);
            outcomeSent = true;
        }
    });
    // End of: Define what will happen when the request is executed and if no error was encountered.

    // Bind to the error event so it doesn't get thrown.
    // This defines what happens instead if there is an error.
    req.on('error',function(e)
    {
        // Update the checkOutcome and pass the data along
        checkOutcome.error = {'error' : true, 'value' : e};

        if(!outcomeSent)
        {
            workers.processCheckOutcome(originalCheckData,checkOutcome);
            outcomeSent = true;
        }
    });
    // End of: Bind to the error event so it doesn't get thrown.

    // Bind to the timeout event
    // And this defines what happens instead if the request times out.
    req.on('timeout',function()
    {
        // Update the checkOutcome and pass the data along
        checkOutcome.error = {'error' : true, 'value' : 'timeout'};

        if(!outcomeSent)
        {
            workers.processCheckOutcome(originalCheckData,checkOutcome);
            outcomeSent = true;
        }
    });
    // End of: Bind to the timeout event

    // End the request. This is where the request gets sent and one of the req callbacks above gets executed.
    req.end();
}; // End of: workers.performCheck = function(originalCheckData){Do stuff}
// End of: Perform the check, send the originalCheck data and the outcome of the check process to the next step in the process



 
// Process the check outcome, update the check data as needed, trigger an alert if needed
// Special logic for accomodating a check that has never been tested before (don't alert on that one)
workers.processCheckOutcome = function(originalCheckData,checkOutcome)
{
    // Decide if the check is considered up or down
    var state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

    // Decide if an alert is warranted
    var alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;

    var timeOfCheck = Date.now();

    // Log the outcome of the check
    workers.log(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck);

    // Update the check data
    var newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = timeOfCheck;

    // Save the updates
    _data.update('checks',newCheckData.id,newCheckData,function(err){
        if(!err)
        {
            // Send the new check data to the next phase in the process if needed
            if(alertWarranted)
            {
                // Call the next function if alert is required
                workers.alertUserToStatusChange(newCheckData);
            } 
            else 
            {
                console.log("Check outcome has not changed, no alert needed");
            }
        } 
        else 
        {
            console.log("Error trying to save updates to one of the checks");
        }
    });
}; // End of: workers.processCheckOutcome = function(originalCheckData,checkOutcome){Do stuff}
// End of: Process the check outcome, update the check data as needed, trigger an alert if needed




// Alert the user as to a change in their check status
workers.alertUserToStatusChange = function(newCheckData)
{
  var msg = 'Alert: Your check for '+newCheckData.method.toUpperCase()+' '+newCheckData.protocol+'://'+newCheckData.url+' is currently '+newCheckData.state;

  // Send the alert
  helpers.sendTwilioSms(newCheckData.userPhone,msg,function(err)
  {
    if(!err)
    {
    console.log("Success: User was alerted to a status change in their check, via sms: ",msg);
    } 
    else 
    {
    console.log("Error: Could not send sms alert to user who had a state change in their check",err);
    }
  });
}; // End of: workers.alertUserToStatusChange = function(newCheckData){Do Stuff}
// End of: Alert the user as to a change in their check status




// Define a function to log results from the checks.
workers.log = function(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck)
{
  // Form the log data object
  var logData = 
  {
    'check' : originalCheckData, 'outcome' : checkOutcome, 'state' : state, 'alert' : alertWarranted, 'time' : timeOfCheck
  };

  // Convert logData object to a JSON string for storage in a file. 
  var logString = JSON.stringify(logData);
  
  // Determine the name of the log file.
  var logFileName = originalCheckData.id;

  // Determine folder where the log file will be stored.
  var logFolder = 'logs';
  
  // Call the function which appends the logString to a file.
  _data.append(logFolder, logFileName, logString, function(err)
  {
    if(!err) // If the append was successful:
    {
      console.log('Logging to ' + logFileName + ' file succeeded.');
    }
    else // The append was not successful.
    {
      console.log('logging to ' + logFileName + ' file did not succeed.');
    }
  }); // End of: _logs.append(logFileName, logString, function(err){Do something}
  // End of: Call the function which appends the logString to a file.

}; // End of: workers.log = function(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck){}
// End of: Define a function to log results from the checks.




// Timer to execute the worker-process once per minute
workers.loop = function()
{
  setInterval(function()
  {
    workers.gatherAllChecks();
  }
  ,1000 * 60 * 5);
  // End of: setInterval(...
}; // End of: workers.loop = function(){Do stuff}
// End of: Timer to execute the worker-process once per minute




// Init script
workers.init = function()
{
    // Execute all the checks immediately
    workers.gatherAllChecks();

    // Call the loop so the checks will execute later on
    workers.loop();
};
// End of: Init script




// Export the module
module.exports = workers;
 