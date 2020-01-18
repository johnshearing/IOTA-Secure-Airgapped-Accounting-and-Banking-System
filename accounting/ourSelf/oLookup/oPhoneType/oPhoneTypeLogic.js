
/*
/ Handlers for the "oPhoneType" table.
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
let oPhoneType = {};




// Define the handler function that serves up the HTML page for searching and listing oPhoneType records.
// Behavior from meta.js at gg9ec14lo9rqjk7kxz7f
oPhoneType.serveListPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : 'OPhoneType List',
      'body.class' : 'oPhoneTypeList',     
      'tableName':'oPhoneType',
      "tableLabel":"OPhoneType",    
      'head.clientCode' : '', // The HTML header template must see something or an empty string.         
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/ourSelf/oLookup/oPhoneType/oPhoneTypeList', templateData, function(errorGetTemplate, str)
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
              '1ex3q5cqddqp6vvjvny2' + '\n' +
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
          '8e6f5voyo1otob3x2lud' + '\n' +
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
      '4euo460st8d4xcn7wp3s' + '\n' +
      'Method not get. Only gets allowed.' + '\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: oPhoneType.serveListPage = function(data, callback){...}
// End of:// Define the handler function that serves up the HTML page for searching and listing oPhoneType records.




// Define the handler function that serves up the HTML page for creating new oPhoneType records.
// Behavior from meta.js at xenz5eipqot8nym0eev3
oPhoneType.serveAddPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : 'Create a New OPhoneType',
      'head.description' : 'For creating a new oPhoneType record',
      'body.class' : 'oPhoneTypeAdd', 
      'head.clientCode' : '', // The HTML header template must see something or an empty string.      
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/ourSelf/oLookup/oPhoneType/oPhoneTypeAdd', templateData, function(errorGetTemplate, str)
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
              '5o6b1fbh568czt869905' + '\n' +
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
          'wbnxqcqrkpu0rwfmx2c0' + '\n' +
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
      'vqrj164ym8rdvwvax8ai' + '\n' +
      'Method not get. Only gets allowed.' + '\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: oPhoneType.serveAddPage = function(data, callback){...}
// End of: Define the handler function that serves up the HTML page for creating new oPhoneType records.




// Define the handler function that serves up the HTML page for editing oPhoneType records.
// Behavior from meta.js at 2a4tb24fsq3de66ti8c4
oPhoneType.serveEditPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : 'Edit a OPhoneType',     
      'body.class' : 'oPhoneTypeEdit',
      'selected.oPhoneTypeId' : data.queryStringObject.oPhoneTypeId,  
      'head.clientCode' : '', // The HTML header template must see something or an empty string.     
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/ourSelf/oLookup/oPhoneType/oPhoneTypeEdit', templateData, function(errorGetTemplate, str)
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
              'zlwbjes2szwpdcb1j9s4' + '\n' +
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
          'b20ug0gjm5przz98uo5d' + '\n' +
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
      'nelyg7ian163ms23orir' + '\n' +
      'Method not get. Only gets allowed.' + '\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: oPhoneType.serveEditPage = function(data, callback){...}
// End of: Define the handler function that serves up the HTML page for editing oPhoneType records.




// Router for oPhoneType functions
// Define a function which calls the requested get, post, put, or delete subhandler function for oPhoneType 
// and passes to the chosen subhandler the client's request object and the callback function.
// Behavior from meta.js at lw39etuyhw7wb82hv9ct
oPhoneType.oPhoneType = function(data, callback)
{
  // Create an array of acceptable methods.
  var acceptableMethods = ['post', 'get', 'put'];

  // if the requested method is one of the acceptable methods:
  if (acceptableMethods.indexOf(data.method) > -1) 
  {
    // then call the appropriate oPhoneType subhandler.
    oPhoneType._oPhoneType[data.method](data, callback);
  } 
  // Otherwise the method was not one of the acceptable methods:
  else 
  {
    helpers.log
    (
      5,
      'fb8garbljp26o8lmxodm' + '\n' +
      'The method was not one of the acceptable methods' + '\n'
    ); 

    // so send back status 405 (Not Allowed).
    callback(405);
  }
}; // End of: oPhoneType.oPhoneType = function(data, callback){...}
//End of: Router for oPhoneType functions




// Create a subobject within the handlers object for the oPhoneType submethods (post, get, put, and delete)
oPhoneType._oPhoneType = {};




// oPhoneType - post subhandler
// Define the oPhoneType post subhandler function.
// This function appends a record to the oPhoneType file.
// Behavior from meta.js at 1723qxikk1l3ru0vfrny 
oPhoneType._oPhoneType.post = function(data, callback)
{
  // Field validation starts here.
  // Get phoneType from payload
  let phoneType = data.payload.phoneType;

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(phoneType) != 'string'){return callback(400, {'Error' : 'phoneType must be of datatype string'});}
  if(!phoneType || phoneType.trim().length === 0){return callback(400, {'Error' : 'No phoneType was entered'});}else{phoneType = phoneType.trim()}

  // Enforcing uniqueness of the phoneType field.
  // Will toggle this to false if we find the phoneType already exists in oPhoneType.
  // Behavior from meta.js at rmkfkaef7xo3gyvnvgm4
  let phoneTypeIsUnused = true;

  // Using this to track the primary key of a record that we might encounter with the candidate phoneType.
  // If we encounter this primary key again we will check to see if the phoneType has been changed.
  // If it has then the candidate phoneType will be marked as available again.
  let uniqueIdOfRecordHoldingCandidatePhoneType = false; 
                        

  // To ensure the phoneType is unique we will read every record in 
  // oPhoneType and compare with the phoneType provided.

  // This function sets up a stream where each chunk of data is a complete line in the oPhoneType file.
  let readInterface = readline.createInterface
  (
    { // specify the file to be read.
      input: fs.createReadStream(_data.baseDir + '/ourSelf/oLookup/oPhoneType' + '/' + 'oPhoneType' + '.json')
    }
  );
  
  // Look at each record in the file and set a flag if the phoneType matches the phoneType provided by the user.
  readInterface.on('line', function(line) 
  {
    // Convert the JSON string from oPhoneType into an object.
    lineObject = JSON.parse(line);

    // Several different record sets with the supplied phoneType and the same oPhoneTypeId 
    // may exist already if the record has been changed or deleted prior to this operation.

    // A modified record is simply a new record with the same oPhoneTypeId as an existing record.
    // The newest record is the valid record and the older record is history.  
    // So position matters. These tables should never be sorted.
    // These tables can be packed however to get rid of historical records.

    // The transaction log also maintains the history and the current state of the entire database.
    // So the transaction log can be used to check the integrity of the every table.
    // No records in the transaction log should be removed.

    // A deleted record in this system is simply an identical record appended with 
    // the deleted field set to true. 
    // So depending on how many times the phoneType has been added and deleted there may 
    // be several sets of records in the oPhoneType table currently 
    // that have the same phoneType and the same oPhoneTypeId.
    // The table can be packed occasionally to get rid of these deleted record sets. 
    // Deletes are handled as appends with the deleted field set to true because real 
    // deletes tie up the table for a long time.

    // In this table, the phoneType is a unique key as well as the oPhoneTypeId.
    // The oPhoneTypeId also serves as the primary key.
    // The difference is that the oPhoneTypeId may never change whereas the phoneType
    // may be changed to something different if a valid record for that phoneType
    // does not already exist.    

    // When adding a record we first make sure that the record does NOT already exist.
    // There should be no record with the current phoneType or if there is then 
    // the last record with this phoneType must have the deleted field set to true.

    // When changing a record we:
    // 1. Make sure that the record with this phoneType does indeed exist and...
    // 2. that the last instance of a record with this phoneType is not deleted.
  
    // It is ok to add a new record with this same phoneType again when the last instance 
    // of this record encountered in the stream has the deleted flag set to true. 
    // In that case, the oPhoneTypeId will be different but the phoneType will be the same.         

    // As explained above, only the last matching record for a particular phoneType matters.
    // It's like that old game "She loves me, She loves me not".

    if (phoneType == lineObject.phoneType) // we found a matching entry
    {
      if (lineObject.deleted == false) // The record has not been deleted so it's a duplicate. Not unique.
      {
        phoneTypeIsUnused = false; // This flag used in the on close event listener below. 

        // If this record (record with this primary key) is encountered further down where it has been deleted 
        // or where the phoneType has been changed with a put operation:
        // Then the candidate phoneType will be available again as we continue searching through the records.
        // We are already checking if this phoneType becomes available again by deletion.
        // Now we need to check if the phoneType becomes available because the record with this primary 
        // key gets changed with a new phoneType.
        // That will make the candidate phoneType unique and available again.
        // So record this global sequential unique id (the oPhoneTypeId in this case).
        // If we find the gsuid again, then check if the phoneType has changed.
        // If it has been changed then:
        // 1. Set the phoneTypeIsUnused flag to true again
        // 2. clear out the variable tracking the uniqueId of the record.
        uniqueIdOfRecordHoldingCandidatePhoneType = lineObject.oPhoneTypeId;
      }
      // The matching record we found has been deleted so it may as well not exist. The new record is still unique.
      else 
      {
        phoneTypeIsUnused = true;
      } 
    } // End of: if we found a matching entry

    // If we have seen this primary key before and flagged the phoneType already taken 
    // because it was identical to the phoneType we are trying to add and it had not been deleted:

    // Ok, the current record is not holding the candidate phoneType but 
    // maybe it was in the past and someone changed it.
    // if the candidate phoneType is flagged unavailable and we are looking at the record that was flagged:
    else if(phoneTypeIsUnused === false && uniqueIdOfRecordHoldingCandidatePhoneType === lineObject.oPhoneTypeId)
    {
      // Check if the phoneType is no longer holding the candidate phoneType.
      // If it is not holding the candidate phoneType then flag the phoneType 
      // available again and clear out the variable tracking this primary key.
      phoneTypeIsUnused = true;
      uniqueIdOfRecordHoldingCandidatePhoneType = false;
    }

  }); // End of: readInterface.on('line', function(line){...}
  // End of: Look at each record...




  // This listener fires after we have discovered if the phoneType is 
  // unique or not, and have then closed the readable stream from oPhoneType.
  // The callback function defined here will append the record if the phoneType 
  // was found to be unique.
  // Behavior from meta.js at aiwaoocd1uegzjbqeydk
  readInterface.on('close', function() 
  {
    // If the phoneType already exists then exit this process without appending the record.
    if (!phoneTypeIsUnused) 
    {      
      helpers.log
      (
        5,
        'wcq0bc62kz6ia0qnel21' + '\n' +
        'The phoneType : ' + phoneType + ' already exists' + '\n'                                  
      ); // End of: helpers.log(...)

      return callback(400, {'Error' : 'The phoneType already exists'});
    }

    // If we made it to this point then the candidate phoneType is unique so continue on with the append opperation.
    // Behavior from meta.js at gwwelr17hmxvq4spdrcl    

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
          'rwl0kpljumhgsunirav7' + '\n' +
          'Unable to get the next gsuid.' + '\n' +
          'The following was the error' + '\n' +
          JSON.stringify(error) + '\n'                                   
        ); // End of: helpers.log(...)

        return callback(423, {'Error' : 'Database is Locked'});
      }


      // If we got this far then we were able to lock the gsuid.json file and get the next 
      // unique id number for this record so continue on.



      // Create the oPhoneType object. 
      // This object will be appended to oPhoneType.json.
      var oPhoneTypeObject = 
      {
          "oPhoneTypeId" : nextIdObject.nextId,
          "phoneType" : phoneType,
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
        "process" : "oPhoneType._oPhoneType.post",
        "comment" : "Post new record",
        "who" : "No login yet",    
        "oPhoneType" : oPhoneTypeObject   
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
              's89rve8qk1o50w6eu1qv' + '\n' +
              'There was an error appending to the history file' + '\n' +
              'An error here does not necessarily mean the append to history did not happen.' + '\n' +  
              'But an error at this point in the code surely means there was no append to oPhoneType' + '\n' +                                          
              'CHECK TO SEE IF history and oPhoneType ARE STILL IN SYNC' + '\n' +                    
              'The following was the record we tried to append:' + '\n' +
              JSON.stringify(logObject) + '\n' +                   
              'The following is the error message:' + '\n' +                  
              err  + '\n'
            );

            return callback(500, {'Error' : 'Could not create a new oPhoneType record.'});
          }



          // The history file has been appended to successfully so continue on.



          // Calling the function which appends a record to the file oPhoneType.json
          _data.append
          (
          '/ourSelf/oLookup/oPhoneType', 
          'oPhoneType', 
          oPhoneTypeObject, 
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
                    'i2pdysb5acv0scbz1t9q' + '\n' +
                    'Successful write to oPhoneType but unable to remove lock on database' + '\n' +
                    'The following record was appended to the oPhoneType file:' + '\n' +                            
                    JSON.stringify(logObject) + '\n' +   
                    'The following was the error message:' + '\n' +                                             
                    error + '\n'
                  ); // End of: helpers.log. Log the error.

                  return callback(500, {'Error' : 'Successful write to oPhoneType but unable to remove lock on database'});

                } // End of: else Good write but unable to remove lock on database.

              } // End of callback code which is run after attempting to remove the lock.
              ); // End of: _data.removeLock(function(error){...}
              // End of: Call to function which removes lock

            }    // End of: if (!err)  //The file has been appended to successfully.
            else // There was an error appending to oPhoneType.
            {
              helpers.log // Log the error.
              (
                5,
                'kbfg6cm4pr55uw4n2x9p' + '\n' +
                'There was an error when appending to the oPhoneType file.' + '\n' +
                'The following record may or may not have been appended to the oPhoneType file:' + '\n' +                            
                JSON.stringify(logObject) + '\n' +
                'Attempting to rollback the entry.' + '\n' +    
                'The following was the error message:' + '\n' +                                             
                err + '\n'            
              );

              // Assemble rollback record for the oPhoneType file which will negate previous entry if any.  
              oPhoneTypeObject = 
              {
                "oPhoneTypeId" : nextIdObject.nextId,
                "phoneType" : "phoneType",
                "timeStamp" : Date.now(),
                "deleted" : true
              };                        

              // Assemble rollback record for the history file which will negate previous entry if any.
              logObject =
              {
                "historyId" : nextIdObject.nextId + 3,                             
                "transactionId" : nextIdObject.nextId + 2,                        
                "rollback" : true,
                "process" : "oPhoneType._oPhoneType.post",
                "comment" : "Error posting. Appending a delete.",                        
                "who" : "Function needed",    
                "oPhoneType" : oPhoneTypeObject   
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
                    // Calling the function which appends a record to the file oPhoneType.json
                    _data.append
                    (
                      '/ourSelf/oLookup/oPhoneType', 
                      'oPhoneType', 
                      oPhoneTypeObject, 
                      function(err)
                      {
                        if (!err) // The rollback record for oPhoneType was appended successfully.
                        {
                          helpers.log
                          (
                            5,
                            'm8uw8y2h9kf8xxpah81p' + '\n' +
                            'Rollback entry in the oPhoneType file was appended successfully' + '\n' +
                            'The following was the record we rolled back:' + '\n' +
                            JSON.stringify(logObject) + '\n'                                   
                          ); // End of: helpers.log(...)
                        }
                        else // There was an error when rolling back record for oPhoneType.
                        {
                          helpers.log
                          (
                            7,
                            '00bkqozt2y4375r3npwa' + '\n' +
                            'There was an error appending a rollback entry in the oPhoneType file' + '\n' +
                            'The following record may or may not have been rolled back:' + '\n' +
                            JSON.stringify(logObject) + '\n' +   
                            'An error here does not necessarily mean the deleting append to oPhoneType did not happen.' + '\n' +                                        
                            'CHECK TO SEE IF history and oPhoneType ARE STILL IN SYNC' + '\n' + 
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
                      'b7e9b26k8d4rl1z1lr9k' + '\n' +
                      'There was an error appending a rollback entry in the history file' + '\n' +
                      'A rollback entry may or may not have been written in the oPhoneType file' + '\n' +  
                      'CHECK TO SEE IF history and oPhoneType ARE STILL IN SYNC' + '\n' +                                      
                      'The following was the record we tried to roll back:' + '\n' +
                      JSON.stringify(logObject) + '\n' +        
                      'The following is the error message:' + '\n' +
                      err  + '\n'
                    );
                  } // End of: else There was an error when appending a rollback entry in history.
                } // End of: callback function(err){...}
              ); // End of: _data.append(...) Append a rollback entry in history.

              return callback(500, {'Error' : 'Could not create the new oPhoneType.'});              

            } // End of: else // There was an error appending to oPhoneType.
          } // End of: callback function
          ); // End of: Calling the function which appends a record to the file oPhoneType.json 
        } // End of: callback function
      ); // End of: _data.append(dbHistory...)
      // End of: Calling the function which creates an entry into history. 
    }); // End of: lib.nextId(function(err, nextIdObject)
  }); // End of: readInterface.on('close', function(){...}
}; // End of: oPhoneType._oPhoneType.post = function(...
// End of: oPhoneType - post subhandler




// oPhoneType - put handler
// Define the oPhoneType put subhandler function 
// This function updates a record.
// Required data: oPhoneTypeId
// Note: At least one other field must be specified.
// Behavior from meta.js at mzimrkdf1we1bjw96zgp
oPhoneType._oPhoneType.put = function(data, callback)
{
  // Field validation starts here.
  // Get oPhoneTypeId from payload
  let oPhoneTypeId = data.payload.oPhoneTypeId;

  // PrimaryKey validation. 
  // Default behavior from meta.js at o65yzg6ddze2fkvcgw5s
  // If oPhoneTypeId is a valid string then convert it to a number.  
  if (typeof(oPhoneTypeId) === 'string'){oPhoneTypeId = parseInt(oPhoneTypeId, 10);}else{return callback(400, {'Error' : 'oPhoneTypeId must be a of string type'});}

  // Get phoneType from payload
  let phoneType = data.payload.phoneType;

  // passIfString&NotEmptyThenTrim
  // Default behavior from meta.js at yif5xwczgr4ebln99trd 
  // If phoneType is of string type and is not empty 
  if (typeof(phoneType) === 'string' && phoneType.trim().length > 0) 
  { 
    // The user entered something in the edit form
    phoneType = phoneType.trim()
  } 
  // Else, the user may have entered some other datatype like a number or 
  // perhaps nothing at all if using the Delete form. 
  else 
  { 
    // If the user entered nothing: 
    if(phoneType === undefined) 
    { 
      // Then user is likely trying to delete a record.
      // So change the value to false and continue processing.
      phoneType = false 
    } 
    else // The user entered something invalid so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid phoneType'}); 
    } 
  }

  // Check if the deleted flag is of type string and that the value is exactly equal to "true".
  // That would mean the user wants to delete the record. Otherwise the users does not want to delete the record.
  // Set deleted to boolean true if validation is passed otherwise set it to false.
  // Behavior from meta.js at ts2g5rn5uw6mvup58vph
  let deleted = typeof(data.payload.deleted) === 'string' && data.payload.deleted === "true" ? true : false;

  
  //if all fields fail validation then exit this process without writing changes to the table.
  if(!phoneType && !deleted)
  {
    helpers.log
    (
      5,
      'swdukvl6wvc8cqefcf35' + '\n' +
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
        'k8dw1t54n5xryxt7h4p3' + '\n' +
        'Unable to get the next gsuid.' + '\n' +
        'The following was the error' + '\n' +
        JSON.stringify(error) + '\n'                                   
      ); // End of: helpers.log(...)

      return callback(423, {'Error' : 'Database is Locked'});
    } // End of: If lock failed or unable to get the next gsuid.


    // If we made it here then we were able to lock the gsuid.json file and get 
    // the next unique id number for this record. So continue with the process.


    // Create the oPhoneType object. 
    // This object will be appended to oPhoneType.json.
    // Add in all fields even if no data is available yet. 
    // This is to establish the order in which the fields will be writen to the table. 
    // Behavior from 3bd1sa5ve4aqrfspunrt in meta.js         
    let oPhoneTypeObject = 
    {
      "oPhoneTypeId" : oPhoneTypeId,
      "phoneType" : phoneType,
      "timeStamp" : Date.now(),
      "deleted" : ""
    };

    dataObject = {};
    dataObject.uniqueField01Name = "phoneType";
    dataObject.uniqueField01Value = oPhoneTypeObject.phoneType;
    dataObject.path = '/ourSelf/oLookup/oPhoneType/oPhoneType.json';
    dataObject.queryString = 'WHERE:;oPhoneTypeId:;MatchesExactly:;' + oPhoneTypeId + ':;';

    // This function returns the most recent record for this oPhoneTypeId after checking that 
    // data for unique fields is indeed unique and that the a record with the supplied oPhoneTypeId exists to modify.
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
                '20b1f6qswyzczrchlzxe' + '\n' + 
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
                'z684ir6tw9wjza0gm2x6' + '\n' +
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


        // Preprocessing for phoneType
        if(phoneType) // If the user supplied data for phoneType
        {
          // No preprocessing was specifed for phoneType. Use it as was supplied by the user.
        }
        else // If the user did not supply data for phoneType
        {
          // Save phoneType from the most recent record.
          oPhoneTypeObject.phoneType = recordObject.phoneType;
        }
        // If we are appending a delete make sure that everything else is coming from the most recent saved record.
        if(deleted)
        {
          oPhoneTypeObject.phoneType = recordObject.phoneType;
          oPhoneTypeObject.deleted = true;
        }
        else
        {
          oPhoneTypeObject.deleted = false;
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
          "process" : "oPhoneType._oPhoneType.put",
          "comment" : "Changing a record",
          "who" : "No login yet.",    
          "oPhoneType" : oPhoneTypeObject   
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
              // Calling the function which appends a record to the file oPhoneType.json
              _data.append
              (
                '/ourSelf/oLookup/oPhoneType', 
                'oPhoneType', 
                oPhoneTypeObject, 
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
                          '8ix51a7guu5ybe6gc7vm' + '\n' +
                          'Successful write to oPhoneType but unable to remove lock on database' + '\n' +
                          'The following record was appended to oPhoneType:' + '\n' +                            
                          JSON.stringify(logObject) + '\n' +   
                          'The following was the error message:' + '\n' +                                             
                          error + '\n'
                        ); // End of: helpers.log // Log the error.

                        callback(500, {'Error' : 'Successful write to oPhoneType but unable to remove lock on database'});

                      } // End of: else Good write but unable to remove lock on database.

                    } // End of callback code which is run after attempting to remove the lock.
                    ); // End of: _data.removeLock(function(error){...}
                    // End of: Call to function which removes lock

                  }    // End of: if (!err)  //The file has been appended to successfully.
                  else // There was an error appending to oPhoneType.
                  {
                    helpers.log // Log the error.
                    (
                      5,
                      '0phgbkbv8s0imk0bp51j' + '\n' +
                      'There was an error when appending to the oPhoneType file.' + '\n' +
                      'The following record may or may not have been appended to oPhoneType:' + '\n' +                            
                      JSON.stringify(logObject) + '\n' +
                      'Attempting to rollback the entry.' + '\n' +    
                      'The following was the error message:' + '\n' +                                             
                      err + '\n'
                    );

                    // Assemble rollback record for the oPhoneType file which will negate previous entry if any.
                    // Behavior from meta.js at 8l4zwqs63qwmp81rjcpw  
                    oPhoneTypeObject = 
                    {
                        "oPhoneTypeId" : recordObject.nextId,
                        "phoneType" : recordObject.phoneType,
                        "timeStamp" : recordObject.timeStamp,
                        "deleted" : recordObject.deleted
                    };                        

                    // Assemble rollback record for the history file which will negate previous entry if any.
                    logObject =
                    {                    
                      "historyId" : nextIdObject.nextId + 3,    
                      "transactionId" : nextIdObject.nextId + 2,                                
                      "rollback" : true,
                      "process" : "oPhoneType._oPhoneType.put",
                      "comment" : "Error during Put. Appending rollback",                        
                      "who" : "No login yet",    
                      "oPhoneType" : oPhoneTypeObject   
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
                          // Calling the function which appends a record to the file oPhoneType.json
                          _data.append
                          (
                            '/ourSelf/oLookup/oPhoneType', 
                            'oPhoneType', 
                            oPhoneTypeObject, 
                            function(err)
                            {
                              if (!err) // The rollback record for oPhoneType was appended successfully.
                              {
                                helpers.log
                                (
                                  5,
                                  '78ecbtflkeej1qwa05nk' + '\n' +
                                  'Rollback entry in the oPhoneType file was appended successfully' + '\n' +
                                  'The following was the record we rolled back:' + '\n' +
                                  JSON.stringify(logObject) + '\n'                                   
                                ); // End of: helpers.log(...)
                              }
                              else // There was an error when rolling back record for oPhoneType.
                              {
                                helpers.log
                                (
                                  7,
                                  'qyrn1q00nmliltkshrf8' + '\n' +
                                  'There was an error appending a rollback entry in the oPhoneType file' + '\n' +
                                  'The following record may or may not have been rolled back:' + '\n' +
                                  JSON.stringify(logObject) + '\n' +   
                                  'An error here does not necessarily mean the deleting append to oPhoneType did not happen.' + '\n' +                                        
                                  'CHECK TO SEE IF history and oPhoneType ARE STILL IN SYNC' + '\n' + 
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
                            'z44vvgte3w67t955mlkz' + '\n' +
                            'There was an error appending a rollback entry in the history file' + '\n' +
                            'A rollback entry may or may not have been written in the oPhoneType file' + '\n' +  
                            'CHECK TO SEE IF history and oPhoneType ARE STILL IN SYNC' + '\n' +                                      
                            'The following was the record we tried to roll back:' + '\n' +
                            JSON.stringify(logObject) + '\n' +        
                            'The following is the error message:' + '\n' +
                            err  + '\n'
                          );
                        } // End of: else There was an error when appending a rollback entry in history.
                      } // End of: callback function(err){...}
                    ); // End of: _data.append(...)

                    callback(500, {'Error' : 'Could not create the new oPhoneType.'});

                  } // End of: else // There was an error appending to oPhoneType.
                } // End of: callback function
                ); // End of: Calling the function which appends a record to the file oPhoneType.json 

            } //End of: The history file has been appended to successfully.
            else // There was an error appending to the history file.
            {
              helpers.log
              (
                7,
                'htwg2gadxw6cqgmmludg' + '\n' +
                'There was an error appending to the history file' + '\n' +
                'An error here does not necessarily mean the append to history did not happen.' + '\n' +  
                'But an error at this point in the code surely means there was no append to oPhoneType' + '\n' +                                          
                'CHECK TO SEE IF history and oPhoneType ARE STILL IN SYNC' + '\n' +                    
                'The following was the record we tried to append:' + '\n' +
                JSON.stringify(logObject) + '\n' +                   
                'The following is the error message:' + '\n' +                  
                err  + '\n'
              );

              callback(500, {'Error' : 'Could not create the new oPhoneType.'});
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
              'q5me7ziqp3k33u1k0nbx' + '\n' + 
              'Pipeline error. The message was as follows' + '\n' +                                             
              pipelineError + '\n'                                                 
            ); // End of: helpers.log // Log the error.
          } // End of: if(pipelineError){...}
        } // End of: function(piplineError){...}
      ); // End of: Pipeline
    }); //End of: helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)
  }); // End of: lib.nextId(function(err, nextIdObject)
}; // End of: handlers._oPhoneType.put = function(...
// End of: Define the oPhoneType put subhandler function




// Define the oPhoneType get subhandler function.
// Streams the oPhoneType file or part of it back to the client.
oPhoneType._oPhoneType.get = function(data, callback)
{
  let amountOfWhereClauses = 0; // We haven't found any yet.
  let amountOfOrderByClauses = 0; // We haven't found any yet.

  // No value set but declared here because we need access to these thoughout the entire function.
  let queryArray, queryString;

  // If there is a query expression.
  if (data.hasOwnProperty('queryString') || typeof(Object.keys(data.queryStringObject)[0]) != 'undefined')
  {

    if (data.hasOwnProperty('queryString'))
    {
      // In this case the queryString is coming from oPhoneTypeEdit page.
      queryString = data.queryString
    }
    else
    {
      // In this case the queryString is coming from the oPhoneTypeList page.
      // For some reason the string comes in as an array element in the object's 
      // key instead of it's value. That's why the Object.keys(...)[0] method.
      queryString = Object.keys(data.queryStringObject)[0];
    }

    // Make an array out of the queryString where each phrase of the query is an element.
    queryArray = queryString.split(":;");

    // Define a function to restore encoded characters that the 
    // client may pass to the server in the query string.
    function restoreCharacters(elementValue, elementIndex, queryArray) 
    {
      switch(elementValue) {
        case "{[POUND]}":
          queryArray[elementIndex] = "#";
        break;
        case "{[AMPERSAND]}":
          queryArray[elementIndex] = "&";
        break;
        case "{[EQUALS]}":
          queryArray[elementIndex] = "=";
        break;
        case "{[BACK-SLASH]}":
          queryArray[elementIndex] = "\\";
        break;
        case "{[SINGLE-QUOTE]}":
          queryArray[elementIndex] = "'";
        break;
        case "{[PLUS]}":
          queryArray[elementIndex] = "+";
        break;                                        
      }
    }

    // Call the function defined above once for each element in the queryArray to decode
    // special characters that the client may have passed to the server in the query string.
    queryArray.forEach(restoreCharacters);    
    
    let lengthOfQueryArray = queryArray.length;    

    // Look at the first element to find out if we have a where clause or an orderby clause.
    let firstQueryElement = queryArray[0];
    let indexOfNextPossibleOrderBy = 0

    if(firstQueryElement == 'WHERE') // The user filled out a where clause.
    {
      // Find out howmany ANDWHERE clauses there are starting at index 4 and counting forward by 4 until ANDWHERE is not found.
      // We are counting by four because we only want to check elements where the ANDWHERE value would carry the correct context.
      // In other words we only want to look where a conjuction would be found. Not a field value and not a comparison operator. 
      amountOfWhereClauses = 1; // We know about the first one so far.
      let indexOfNextPossibleANDORWHERE = amountOfWhereClauses * 4
      let proceedWithLoop = true;

      while (indexOfNextPossibleANDORWHERE < lengthOfQueryArray -1 && proceedWithLoop == true) 
      {
        if(queryArray[indexOfNextPossibleANDORWHERE] == "ANDWHERE" || queryArray[indexOfNextPossibleANDORWHERE] == "ORWHERE")
        {
          amountOfWhereClauses = amountOfWhereClauses + 1;
          indexOfNextPossibleANDORWHERE = amountOfWhereClauses * 4
        }
        else
        {
          indexOfNextPossibleOrderBy = indexOfNextPossibleANDORWHERE
          proceedWithLoop = false;
        }
      }
    }
    else // The firstQueryElement wasn't 'WHERE' So it must be 'ORDERBY'
    {
      // If we have something and there are no where clauses then we must be starting with an orderby clause.
      amountOfOrderByClauses = 1
    }

    // Now we are going to find out how many orderby clauses there are.
    proceedWithLoop = true;

    while (indexOfNextPossibleOrderBy < lengthOfQueryArray - 1 && proceedWithLoop == true) 
    {
      if(queryArray[indexOfNextPossibleOrderBy] == "ORDERBY" || queryArray[indexOfNextPossibleOrderBy] == "ThenOrderBy")
      {
        amountOfOrderByClauses = amountOfOrderByClauses + 1;
        indexOfNextPossibleOrderBy = indexOfNextPossibleOrderBy + 3;
      }
      else
      {
        proceedWithLoop = false;
      }
    }

  } // End of: if (typeof(data.queryStringObject[0]) !== 'undefined'){...}
  // End of: If the user created a query expression.


  
  // Create an empty map data structure which will be used to merge oPhoneType records that have the same unique fields.
  // Chose map data structure over objects because maps are guaranteed to maintain the same order where as objects are not.
  let oPhoneTypeMap = new Map();
  
  // This function sets up a stream where each chunk of data is a complete line in the oPhoneType file.
  let readInterface = readline.createInterface
  (
    { // specify the file to be read.
      input: fs.createReadStream(_data.baseDir + '/ourSelf/oLookup/oPhoneType' + '/' + 'oPhoneType' + '.json'),
    }
  );



  // Look at each record in the file.
  readInterface.on('line', function(line) 
  {
    // Convert the JSON string (a single line from the oPhoneType file) into lineValueObject.
    // These objects will written back to a new file after deleting some un-needed key/value pairs.
    let lineValueObject = JSON.parse(line);
    let recordWasDeleted = false;    

    // Declare a variable to serve as a key in the map to manage the lineValueObject.
    let oPhoneTypeId = lineValueObject.oPhoneTypeId;      

    if(lineValueObject.deleted === true) // if the record in the file oPhoneType.json had the delete field set to true:
    {
      // Remove this record from the map 
      oPhoneTypeMap.delete(oPhoneTypeId);
      recordWasDeleted = true;
    }
    else if(amountOfWhereClauses > 0) // else if the user created one or more filter expressions
    {
      let whereClauseCount = 1; // Represents the filter expression we are currently evaluating.
      let index = 1; // Used to navigate the queryArray.
      let shouldDeleteThisRecord = false;
      let shouldLoopAgain = true;
  
      while(whereClauseCount <= amountOfWhereClauses && shouldLoopAgain === true)
      {
        switch(queryArray[index + 1]) 
        {
          case 'MatchesExactly': // 1
          {
            if(lineValueObject[queryArray[index]] != queryArray[index + 2])
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;

          case 'MatchesExactlyNotCaseSensitive': // 2
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase() != queryArray[index + 2].toString().toLowerCase())
            {
              shouldDeleteThisRecord = true;
            }             
          }
          break;
          
          case 'DoesNotMatchExactly': // 3
            {
              if(lineValueObject[queryArray[index]] == queryArray[index + 2])
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;

          case 'DoesNotMatchExactlyNotCaseSensitive': // 4
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase() == queryArray[index + 2].toString().toLowerCase())
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;

          case 'BeginsWith': // 5
          {
            if(lineValueObject[queryArray[index]].toString().indexOf(queryArray[index + 2].toString()) != 0)
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;
          
          case 'BeginsWithNotCaseSensitive': // 6
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase().indexOf(queryArray[index + 2].toString().toLowerCase()) != 0)
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;    

          case 'DoesNotBeginWith': // 7
          {
            if(lineValueObject[queryArray[index]].toString().indexOf(queryArray[index + 2].toString()) == 0)
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;

          case 'DoesNotBeginWithNotCaseSensitive': // 8
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase().indexOf(queryArray[index + 2].toString().toLowerCase()) == 0)          
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;          

          case 'Contains': // 9
          {
            if(lineValueObject[queryArray[index]].toString().indexOf(queryArray[index + 2].toString()) == -1)
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;

          case 'ContainsNotCaseSensitive': // 10
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase().indexOf(queryArray[index + 2].toString().toLowerCase()) == -1)          
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;

          case 'DoesNotContain': // 11
          {
            if(lineValueObject[queryArray[index]].toString().indexOf(queryArray[index + 2].toString()) > -1)
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;

          case 'DoesNotContainNotCaseSensitive': // 12
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase().indexOf(queryArray[index + 2].toString().toLowerCase()) > -1)          
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;

          case 'EndsWith': // 13
          {
            if(!lineValueObject[queryArray[index]].toString().endsWith(queryArray[index + 2].toString()))
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;
          
          case 'EndsWithNotCaseSensitive': // 14
          {
            if(!lineValueObject[queryArray[index]].toString().toLowerCase().endsWith(queryArray[index + 2].toString().toLowerCase()))
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;
          
          case 'DoesNotEndWith': // 15
          {
            if(lineValueObject[queryArray[index]].toString().endsWith(queryArray[index + 2].toString()))
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;
          
          case 'DoesNotEndWithNotCaseSensitive': // 16
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase().endsWith(queryArray[index + 2].toString().toLowerCase()))
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;

          case 'IsGreaterThan': // 17
          {
            if(lineValueObject[queryArray[index]] <= queryArray[index + 2])
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;          
          
          case 'IsGreaterThanNotCaseSensitive': // 18
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase() <= queryArray[index + 2].toString().toLowerCase())
            {
              shouldDeleteThisRecord = true;
            }
          }
          break; 
          
          case 'IsGreaterThanOrEqualTo': // 19
          {
            if(lineValueObject[queryArray[index]] < queryArray[index + 2])
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;
          
          case 'IsGreaterThanOrEqualToNotCaseSensitive': // 20
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase() < queryArray[index + 2].toString().toLowerCase())
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;
          
          case 'IsLessThan': // 21
          {
            if(lineValueObject[queryArray[index]] >= queryArray[index + 2])
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;

          case 'IsLessThanNotCaseSensitive': // 22
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase() >= queryArray[index + 2].toString().toLowerCase())
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;                
          
          case 'IsLessThanOrEqualTo': // 23
          {
            if(lineValueObject[queryArray[index]] > queryArray[index + 2])
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;          
          
          case 'IsLessThanOrEqualToNotCaseSensitive': // 24
          {
            if(lineValueObject[queryArray[index]].toString().toLowerCase() > queryArray[index + 2].toString().toLowerCase())
            {
              shouldDeleteThisRecord = true;
            }
          }
          break;          
                      
          default: // When there are no case matches then do this.
          {

          }

        } // End of: switch(queryArray[index + 1])               
             
        // All (ANDWHERE) clauses will be evaluated first.
        // The order of the clauses will matter.


        // If the record failed the specified match condition and has set the delete flag:
        // Then we need to look for an ORWHERE clause further along in the queryArray that might pass this record.
        // Any ANDWHERE clauses between are already failures because all AND conditions must pass or none should pass.
        if(shouldDeleteThisRecord === true)
        {      
          let indexOfNextPossibleOrWhere = index + 3;
          let proceedWithThisWhileLoop = true;     
          let foundForwardOrWhereClause = false; // Haven't found any yet.


          while (indexOfNextPossibleOrWhere <= amountOfWhereClauses * 4 && proceedWithThisWhileLoop == true) 
          {                       
            if(queryArray[indexOfNextPossibleOrWhere] == "ORWHERE") //We found a filter that may pass this record.
            {
              foundForwardOrWhereClause = true;
              proceedWithThisWhileLoop = false;
              // Need to repeat the outside while loop (not this one) at the index for the ORWHERE filter just found.
            }
            else // We did not find an ORWHERE filter this time through the while loop
            {
              // lets loop again to look further along the queryArray.
              indexOfNextPossibleOrWhere = indexOfNextPossibleOrWhere + 4;
              proceedWithThisWhileLoop = true;                           
            }
          } // End of: while (indexOfNextPossibleOrWhere < amountOfWhereClauses * 4 -1 && proceedWithLoop == true){...}

          
          if(foundForwardOrWhereClause === true) // Another ORWHERE clause exists that might pass this record.
          {
            // index = index + 4;
            index = indexOfNextPossibleOrWhere + 1
            whereClauseCount = whereClauseCount + 1;   
            shouldLoopAgain = true;  
            recordWasDeleted = false;    
            shouldDeleteThisRecord = false;              
          }

          // FAILING THIS RECORD!!!
          // Breaking out of both while loops and deleting this record. 
          else // Else: there are no more ORWHERE filters that could save this record
          {
            // Finally remove this record from the map 
            oPhoneTypeMap.delete(oPhoneTypeId);
            recordWasDeleted = true;  
            shouldLoopAgain = false;  
            shouldDeleteThisRecord = false;  
          // There is no more processing for this particular record in readInterface.on    
          // IT ALL ENDS HERE FOR THIS RECORD!!!                  
          }

        } //End of: if(shouldDeleteThisRecord === true){...}

        // Else: the current filter passed this record.
        else // shouldDeleteThisRecord was false.
        {

        // Since the record passed through this current filter we need to 
        // see if there is an ANDWHERE filter right next to this current filter. 
        // Any further ANDWHERE filters right next to this current one must also 
        // pass the record until there are no more filters or an ORWHERE filter is 
        // encountered. In that case the loop is stopped and the record is passed.

          let indexOfNextPossibleAndWhere = index + 3; 
    
          // If we found an ANDWHERE filter that must pass this record.  
          if(queryArray[indexOfNextPossibleAndWhere] == "ANDWHERE") 
          {
            // Need to repeat the outside while loop (not this one) at the index for the ANDWHERE filter just found.
            // If the filter is passed then we will be back here again looking for another ANDWHERE clause.
            index = index + 4;
            whereClauseCount = whereClauseCount + 1;   
            shouldLoopAgain = true;  
            recordWasDeleted = false;    
            shouldDeleteThisRecord = false; 
          }
          else // We did not find an ANDWHERE filter this time through the while loop
          {
            // PASSING THIS RECORD!!!
            // Breaking out of both while loops and passing this record.
            shouldLoopAgain = false; 
            recordWasDeleted = false;  
          }

        } // End of: else: shouldDeleteThisRecord was false
        

      } // End of: while(whereClauseCount <= amountOfWhereClauses && shouldLoopAgain === true)
      
    } //End of: else if(amountOfWhereClauses > 0) // else if the user created one or more filter expressions

    //If the record was not marked for deletion and passed through the filters above:
    if(recordWasDeleted === false)
    {
            // Remove the deleted key/value pair from the lineValueObject before returning it to the requester.
      delete lineValueObject.deleted;            

      // Update this record in the map.
      oPhoneTypeMap.set(oPhoneTypeId, lineValueObject);
    }

  }); // End of: readInterface.on('line', function(line){...}
  // End of: Look at each record...


  // This listener fires after we have looked through all the records in the oPhoneType file.
  // The callback function defined here will stream the oPhoneType list back to the clients browser.
  readInterface.on('close', function() 
  {          
    // This readable stream will be used to write the result of the merge to a new file.
    const sourceStream = new Readable(); 

    for (const [key, valueObject] of oPhoneTypeMap)
    {
      // Convert the data object to a string.
      let stringData = JSON.stringify(valueObject);     

      // Load the readable stream with data.
      sourceStream.push(stringData + '\n');                  
    }       

    // Tell the stream no more data is coming.
    sourceStream.push(null);     

    callback(200, sourceStream, 'stream');             

  }); // End of: readInterface.on('close', function(){...}   

}; // End of: handlers._oPhoneType.get = function(data, callback){do stuff}
// End of: Define the oPhoneType get subhandler function.  




// Export the module
module.exports = oPhoneType;


