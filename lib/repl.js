/*
 * REPL server
 * This is the Command Line Interface
 *
 */




// Dependencies
var repl = require('repl');
const fs = require('fs');
const path = require('path');
const util = require('util');
var os = require('os');
var v8 = require('v8');
var _data = require('./data');
var helpers = require('./helpers');




// Instantiate the CLI module object
var cli = {};

// Define the base directory of the data folder.
cli.baseDir = path.join(__dirname, '/../data/'); 




// Start of Section: Support functions for the response handlers

// Create a vertical space
cli.verticalSpace = function(lines)
{
  lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
  for(i = 0; i < lines; i++)
  {
      console.log('');
  };
}; // End of: cli.verticalSpace = function(lines)
// End of: Create a vertical space



// Create a horizontal line across the screen
cli.horizontalLine = function() // Export the module
{
  var width = process.stdout.columns;

  var line = '';

  // Form a line using dashes that is exactly equal to the width of the screen
  for(i = 0; i < width; i++)
  {
      line += '_';
  };

  console.log(line);

}; // End of: cli.horizontalLine = function(){...}
// End of: Create a horizontal line across the screen




// Pad the left side of a string so that it centers on the screen
cli.centered = function(str)
{
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : ''; 

  // Get the available screen size
  var width = process.stdout.columns;

  // Calculate the left padding required to center the string
  var leftPadding = Math.floor((width - str.length) / 2);

  // Start with an empty line.
  var line = '';

  // Fill the line with the calculated amount of padding on the left side.
  for(i = 0; i < leftPadding; i++)
  {
      line += ' ';
  }
  
  // Append the string to the padding.
  line += str;

  console.log(line);

}; // End of: cli.centered = function(str){...}
// End of: Pad the left side of a string so that it centers on the screen


// End of Section: Support functions for the response 




// help: Output a help menu to the console
cli.help = function()
{
  var commands = 
  {
    'exit' : 'Kill the CLI (and the rest of the application).',   
    'help' : 'Shows this help page.',
    'CTRL+l' : 'Clear the screen. That\'s the control key plus the lower case letter L',                   
    'stats' : 'Get statistics on the underlying operating system and the resource utilization.',
    'list users' : 'Show a list of all the registered (undeleted) users in the system.',
    'more user info --userId' : 'Show details of the specifed user.',
    'list checks [--up] | [--down]' : 'Show a list of all the active checks in the system, including their state.',
    'more check info --checkId' : 'Show details of a specifed check.',
    'list logs' : 'Show a list of all the log files avaiable to be read.',
    'more log info --fileName' : 'Show details of a specifed log file.'
  };

  // Show a header for the help page that is as wide as the screen.
  cli.horizontalLine();
  cli.centered('CLI MANUAL');
  cli.horizontalLine();
  cli.verticalSpace(2);
  

  // Show each command, followed by its explaination, in white and yellow respectively.
  for(var key in commands)
  {
    if(commands.hasOwnProperty(key))
    {
      var value = commands[key];
      var line = '      \x1b[33m '+key+'      \x1b[0m';
      var padding = 60 - line.length;
      for(i = 0; i < padding; i++)
      {
          line += ' ';
      };
      line += value;
      console.log(line);
      cli.verticalSpace();
    };
  };

  cli.verticalSpace(1);
  
  // End with another horizontal line
  cli.horizontalLine();

}; // End of: cli.responders.help = function(){...}
// End of: help / man     Output a help menu to the console




// Stats. Output statistics to the console.
cli.stats = function()
{
  // Compile an object of stats
  var stats = 
  {
    'Load Average' : os.loadavg().join(' '),
    'CPU Count' : os.cpus().length,
    'Free Memory' : os.freemem(),
    'Current Malloced Memory' : v8.getHeapStatistics().malloced_memory,
    'Peak Malloced Memory' : v8.getHeapStatistics().peak_malloced_memory,
    'Allocated Heap Used (%)' : Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
    'Available Heap Allocated (%)' : Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
    'Uptime' : os.uptime() + ' Seconds'                                                        
  };

  // Show a header for the stats page that is as wide as the screen.
  cli.horizontalLine();
  cli.centered('SYSTEM STATISTICS');
  cli.horizontalLine();
  cli.verticalSpace(2);    

    // Cycle through each stat in the object. 
    // We are going to build a string from the for each item in the object showing 
    // each stat, followed by its explaination, in white and yellow respectively.
  for(var key in stats)
  {
    // if the key is on the stats object and not it's ancestor
    if(stats.hasOwnProperty(key))
    {   
      // Get the value paired with the key.
      var value = stats[key];

      // Load the line var with the key first.
      var line = '      \x1b[33m '+key+'      \x1b[0m';
      
      // Figure out how much padding is required to make all the values line up.
      var padding = 60 - line.length;

      //Now pad the line with the amount of spaces calculated above.
      for(i = 0; i < padding; i++)
      {
          line += ' ';
      };

      // finally, append the value after the line
      line += value;

      // Output the finished line to the console.
      console.log(line);

      // Output an empty line to the console.
      cli.verticalSpace();
    };// End of: if the key is on the stats object and not it's ancestor
  }; // End of: Cycle through each stat in the object.
  // Create a vertical space in the console output.
  cli.verticalSpace(1);
  
  // End with another horizontal line.
  cli.horizontalLine();    

}; // End of: cli.responders.stats = function(){...}
// End of: Stats. Output statistics to the console.




// List users to the console.
cli.listUsers = function()
{
    // Returns an object containing fileNames (the phone number) for all registered users.
    _data.list('users', function(err, userIds)
  {
    // if we got an object loaded with fileNames:
    if(!err && userIds && userIds.length > 0)
    {
      // Out put an empty line to the console.
      cli.verticalSpace();

      // Cycle through the fileName object.
      userIds.forEach(function(userId)
      {
        // Get the contents of each file as a JSON object
        _data.read('users', userId, function(err, userData)
        {
          // if we got the file contents
          if(!err && userData)
          { 
            // Count up the number of check keys stored in the check array which was found in the user's file
            var numberOfChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0;
            
            // Build a string that we can output to the console.
            var line = 'Name: '+ userData.firstName + ' ' + userData.lastName + ' Phone: ' + userData.phone + ' Checks: ';

            // append the number of checks to the line we just built.
            line += numberOfChecks;      

            // Output the line we just built to the console.
            console.log(line);

            // output an empty line to the console.
            cli.verticalSpace();

          } // End of: if we got the file contents
        }); // End of: _data.read('users', userId, function(err, userData){...}
      }); // End of: userIds.forEach(function(userId){...}
    } // End of: if we got an object loaded with fileNames:
  }); // End of: _data.list('users', function(err, userIds){...}
}; //End of: cli.responders.listUsers = function(){...}
// End of: List users to the console.




// More user info
// Output info on a specific user to the console
cli.moreUserInfo = function(str)
{
  // Get the userId (phoneNumber) from the string passed in to this function.
  // First create an array with an element for everything before the double dash and another element for everything after.
  var arr = str.split('--');

  // We are interested in the userId which is the second element in the array.
  var userId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;

  if(userId)
  {
    // Look up the user
    _data.read('users', userId, function(err, userData)
    {
      if(!err && userData)
      {
        // Remove the hashed password
        delete userData.hashedPassword;

        // Print the JSON object with text highlighted.
        cli.verticalSpace;
        console.dir(userData, {'colors' : true});
        cli.verticalSpace;
      } // End of: if(!err && userData){...}
    }); // End of: _data.read('users', userId, function(err, userData){...}
  } // End of: if(userId){...}
}; // End of: cli.moreUserInfo = function(str){...}
//End of: More user info 




// List checks to console
cli.listChecks = function(str)
{
  // Read the checks directory and return an array of checkIds
  _data.list('checks', function(err, checkIds)
  {
    // if we got an array of checkIds back from _data.list:
    if(!err && checkIds && checkIds.length > 0)
    {
      // Output a blank line to the console
      cli.verticalSpace();

      // Cycle through all the check files:
      checkIds.forEach(function(checkId)
      {
        // Read the check file and return the record as a JSON object
        _data.read('checks', checkId, function(err, checkData)
        {
          var includeCheck = false;
          var lowerString = str.toLowerCase();       

          // Get the state of the check, Default to down.
          var state = typeof(checkData.state) == 'string' ? checkData.state : 'down';

          // Get the state of the check, Default to unknown.
          var stateOrUnknown = typeof(checkData.state) == 'string' ? checkData.state : 'unknown';        
          
          // If the user has specified the state or hasn't specified any state, include the current check accordingly.
          if(lowerString.indexOf('--' + state) > -1 || (lowerString.indexOf('--down') == -1 && lowerString.indexOf('--up') == -1))
          {
            var line = 'ID: '+checkData.id+' '+checkData.method.toUpperCase()+' '+checkData.protocol+'://'+checkData.url+' State: '+ stateOrUnknown;
            console.log(line);
            cli.verticalSpace();
          }

        }); // End of: _data.read('checks', checkId, function(err, checkData){...}
      });
    }; // End of: if we got an array of checkIds back from _data.list: 

  });   // End of: Read the checks directory and return an array of checkIds
}; // End of: cli.responders.listChecks = function(str){...}
// End of: List checks to console




// More check info
// Output info on a check to the console.
cli.moreCheckInfo = function(str)
{
  // Get the checkId from the string passed in to this function.
  // First create an array with an element for everything before the double dash and another element for everything after.
  // Everything after the double dashes will be the checkId (the fileName)
  var arr = str.split('--');

  // We are interested in the userId which is the second element in the array.
  var checkId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;

  if(checkId)
  {
    // Look up the check and return the record as a JSON object.
    _data.read('checks', checkId, function(err, checkData)
    {
      if(!err && checkData)
      {
        // Print the JSON object with text highlighted.
        cli.verticalSpace;
        console.dir(checkData, {'colors' : true});
        cli.verticalSpace;
      } // End of: if(!err && checkData){...}
    }); // End of: _data.read('checks', checkId, function(err, checkData){...}
  } // End of: if(checkId){...}
}; // End of: cli.moreCheckInfo = function(str){...}
//End of: More check info 




// List logs
cli.listLogs = function()
{
  // Read the directory and return an array of file names.
  _data.list('logs', function(err, logFileNames)
  {
    if(!err && logFileNames && logFileNames.length > 0)
    {
      cli.verticalSpace;
      logFileNames.forEach(function(logFileName)
      {
        cli.verticalSpace;
        console.log(logFileName);
        cli.verticalSpace;
      });
    }
  }); 
}; // End of: cli.listLogs = function(){...} 
// End of:  List logs




// More log info
cli.moreLogInfo = function(str)
{
  // Get the log file name from the string passed in to this function.
  // First create an array with an element for everything before the double dash and another element for everything after.
  // Everything after the double dashes will be the fileName.
  var userInputArray = str.split('--');

  // We are interested in the userId which is the second element in the array.
  var logFileName = typeof(userInputArray[1]) == 'string' && userInputArray[1].trim().length > 0 ? userInputArray[1].trim() : false;

  if(logFileName)
  {
    // Call the nodejs readFile function.
    fs.readFile(cli.baseDir + 'logs' + '/' + logFileName + '.log', 'utf8', function(err, jsonRecordsString)
    {
      // If there is no read error and data was returned then do the following: 
      if(!err && jsonRecordsString)
      {
        // Split it into lines
        var recordsArray = jsonRecordsString.split('\n');
        recordsArray.forEach(function(jsonString){
          var logObject = helpers.parseJsonToObject(jsonString);
          if(logObject){
            var logString = JSON.stringify(logObject);

            if(logString  !== '{}')
            {
              console.log(logString);
              cli.verticalSpace();              
            };
          };
        });

      } // End of: If there was no read error...
      else // There was a problem with the read so:
      {
        console.log('Could not read the log file');
      } // End of: else there was a problem with the read.

    }); // End of: Call fs.readFile(...
  } // End of: if(logFileName)



}; // End of: cli.responders.moreLogInfo = function(str){...}
// End of: More log info



cli.init = function()
{
  // Start the REPL
  repl.start({
    prompt: '>',
    eval: function(str)
    { 
      // If the user said 'fizz', say 'buzz' back to them
      if(str.indexOf('exit') > -1)
      {
        process.exit(0);
      }

      else if(str.indexOf('help') > -1)
      {
        cli.help();
      }

      else if(str.indexOf('stats') > -1)
      {
        cli.stats();
      }    

      else if(str.indexOf('list users') > -1)
      {
        cli.listUsers();
      }

      else if(str.indexOf('more user info') > -1)
      {
        cli.moreUserInfo(str);
      }    

      else if(str.indexOf('list checks') > -1)
      {
        cli.listChecks(str);
      }        

      else if(str.indexOf('more check info') > -1)
      {
        cli.moreCheckInfo(str);
      }        

      else if(str.indexOf('list logs') > -1)
      {
        cli.listLogs();
      }

      else if(str.indexOf('more log info') > -1)
      {
        cli.moreLogInfo(str);
      }    

    }, // End of: eval: function(str){Do stuff}
  }); //End of: repl.start(...)
  // End of: Start the REPL

}; // End of: cli.init = function(){...}


// Export the module
module.exports = cli;