
/*
/ Handlers for the "oAddressType" table.
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
let oAddressType = {};




// Define the handler function that serves up the HTML page for searching and listing oAddressType records.
// Behavior from meta.js at gg9ec14lo9rqjk7kxz7f
oAddressType.serveListPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : 'OAddressType List',
      'body.class' : 'oAddressTypeList',     
      'tableName':'oAddressType',
      "tableLabel":"OAddressType",    
      'head.clientCode' : '', // The HTML header template must see something or an empty string.         
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/ourSelf/oLookup/oAddressType/oAddressTypeList', templateData, function(errorGetTemplate, str)
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
              '1k8b1rstaypobplspm2f' + '\n' +
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
          'ks3z2tmz6a55puf5ah7m' + '\n' +
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
      'ctdymxtyzz5dy5wj79db' + '\n' +
      'Method not get. Only gets allowed.' + '\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: oAddressType.serveListPage = function(data, callback){...}
// End of:// Define the handler function that serves up the HTML page for searching and listing oAddressType records.




// Define the handler function that serves up the HTML page for creating new oAddressType records.
// Behavior from meta.js at xenz5eipqot8nym0eev3
oAddressType.serveAddPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : 'Create a New OAddressType',
      'head.description' : 'For creating a new oAddressType record',
      'body.class' : 'oAddressTypeAdd', 
      'head.clientCode' : '', // The HTML header template must see something or an empty string.      
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/ourSelf/oLookup/oAddressType/oAddressTypeAdd', templateData, function(errorGetTemplate, str)
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
              'o4k15pjgutadeaduvuf2' + '\n' +
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
          '5gouw5sw8egc285gwhu0' + '\n' +
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
      '1yp6cfy6maw81ui3r0v0' + '\n' +
      'Method not get. Only gets allowed.' + '\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: oAddressType.serveAddPage = function(data, callback){...}
// End of: Define the handler function that serves up the HTML page for creating new oAddressType records.




// Define the handler function that serves up the HTML page for editing oAddressType records.
// Behavior from meta.js at 2a4tb24fsq3de66ti8c4
oAddressType.serveEditPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : 'Edit a OAddressType',     
      'body.class' : 'oAddressTypeEdit',
      'selected.oAddressTypeId' : data.queryStringObject.oAddressTypeId,  
      'head.clientCode' : '', // The HTML header template must see something or an empty string.     
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/ourSelf/oLookup/oAddressType/oAddressTypeEdit', templateData, function(errorGetTemplate, str)
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
              '9gi1iu39e7q07pkvt8xx' + '\n' +
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
          '55iwtzpwzra1c4ipupvt' + '\n' +
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
      'tjabwstfz2wx5o0j4c19' + '\n' +
      'Method not get. Only gets allowed.' + '\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: oAddressType.serveEditPage = function(data, callback){...}
// End of: Define the handler function that serves up the HTML page for editing oAddressType records.




// Router for oAddressType functions
// Define a function which calls the requested get, post, put, or delete subhandler function for oAddressType 
// and passes to the chosen subhandler the client's request object and the callback function.
// Behavior from meta.js at lw39etuyhw7wb82hv9ct
oAddressType.oAddressType = function(data, callback)
{
  // Create an array of acceptable methods.
  var acceptableMethods = ['post', 'get', 'put'];

  // if the requested method is one of the acceptable methods:
  if (acceptableMethods.indexOf(data.method) > -1) 
  {
    // then call the appropriate oAddressType subhandler.
    oAddressType._oAddressType[data.method](data, callback);
  } 
  // Otherwise the method was not one of the acceptable methods:
  else 
  {
    helpers.log
    (
      5,
      'qe9y41iulum9cjnowh2w' + '\n' +
      'The method was not one of the acceptable methods' + '\n'
    ); 

    // so send back status 405 (Not Allowed).
    callback(405);
  }
}; // End of: oAddressType.oAddressType = function(data, callback){...}
//End of: Router for oAddressType functions




// Create a subobject within the handlers object for the oAddressType submethods (post, get, put, and delete)
oAddressType._oAddressType = {};




// oAddressType - post subhandler
// Define the oAddressType post subhandler function.
// This function appends a record to the oAddressType file.
// Behavior from meta.js at 1723qxikk1l3ru0vfrny 
oAddressType._oAddressType.post = function(data, callback)
{
  // Field validation starts here.
  // Get addressType from payload
  let addressType = data.payload["addressType"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(addressType) != 'string'){return callback(400, {'Error' : 'addressType must be of datatype string'});}
  if(!addressType || addressType.trim().length === 0){return callback(400, {'Error' : 'No addressType was entered'});}else{addressType = addressType.trim()}


  // Enforcing uniqueness of the addressType field.
  // Will toggle this to false if we find the addressType already exists in oAddressType.
  // Behavior from meta.js at rmkfkaef7xo3gyvnvgm4
  let addressType_IsUnused = true;

  // Using this to track the primary key of a record that we might encounter with the candidate addressType.
  // If we encounter this primary key again we will check to see if the addressType has been changed.
  // If it has then the candidate addressType will be marked as available again.
  let uniqueIdOfRecordHoldingCandidate_AddressType = false; 
                        

  // To ensure the addressType is unique we will read every record in 
  // oAddressType and compare with the addressType provided.

  // This function sets up a stream where each chunk of data is a complete line in the oAddressType file.
  let readInterface = readline.createInterface
  (
    { // specify the file to be read.
      input: fs.createReadStream(_data.baseDir + '/ourSelf/oLookup/oAddressType' + '/' + 'oAddressType' + '.json')
    }
  );
  
  // Look at each record in the file and set a flag if the addressType matches the addressType provided by the user.
  readInterface.on('line', function(line) 
  {
    // Convert the JSON string from oAddressType into an object.
    lineObject = JSON.parse(line);

    // Several different record sets with the supplied addressType and the same oAddressTypeId 
    // may exist already if the record has been changed or deleted prior to this operation.

    // A modified record is simply a new record with the same oAddressTypeId as an existing record.
    // The newest record is the valid record and the older record is history.  
    // So position matters. These tables should never be sorted.
    // These tables can be packed however to get rid of historical records.

    // The transaction log also maintains the history and the current state of the entire database.
    // So the transaction log can be used to check the integrity of the every table.
    // No records in the transaction log should be removed.

    // A deleted record in this system is simply an identical record appended with 
    // the deleted field set to true. 
    // So depending on how many times the addressType has been added and deleted there may 
    // be several sets of records in the oAddressType table currently 
    // that have the same addressType and the same oAddressTypeId.
    // The table can be packed occasionally to get rid of these deleted record sets. 
    // Deletes are handled as appends with the deleted field set to true because real 
    // deletes tie up the table for a long time.

    // In this table, the addressType is a unique key as well as the oAddressTypeId.
    // The oAddressTypeId also serves as the primary key.
    // The difference is that the oAddressTypeId may never change whereas the addressType
    // may be changed to something different if a valid record for that addressType
    // does not already exist.    

    // When adding a record we first make sure that the record does NOT already exist.
    // There should be no record with the current addressType or if there is then 
    // the last record with this addressType must have the deleted field set to true.

    // When changing a record we:
    // 1. Make sure that the record with this addressType does indeed exist and...
    // 2. that the last instance of a record with this addressType is not deleted.
  
    // It is ok to add a new record with this same addressType again when the last instance 
    // of this record encountered in the stream has the deleted flag set to true. 
    // In that case, the oAddressTypeId will be different but the addressType will be the same.         

    // As explained above, only the last matching record for a particular addressType matters.
    // It's like that old game "She loves me, She loves me not".

    if (addressType == lineObject.addressType) // we found a matching entry
    {
      if (lineObject.deleted == false) // The record has not been deleted so it's a duplicate. Not unique.
      {
        addressType_IsUnused = false; // This flag used in the on close event listener below. 

        // If this record (record with this primary key) is encountered further down where it has been deleted 
        // or where the addressType has been changed with a put operation:
        // Then the candidate addressType will be available again as we continue searching through the records.
        // We are already checking if this addressType becomes available again by deletion.
        // Now we need to check if the addressType becomes available because the record with this primary 
        // key gets changed with a new addressType.
        // That will make the candidate addressType unique and available again.
        // So record this global sequential unique id (the oAddressTypeId in this case).
        // If we find the gsuid again, then check if the addressType has changed.
        // If it has been changed then:
        // 1. Set the addressType_IsUnused flag to true again
        // 2. clear out the variable tracking the uniqueId of the record.
        uniqueIdOfRecordHoldingCandidate_AddressType = lineObject.oAddressTypeId;
      }
      // The matching record we found has been deleted so it may as well not exist. The new record is still unique.
      else 
      {
        addressType_IsUnused = true;
      } 
    } // End of: if we found a matching entry

    // If we have seen this primary key before and flagged the addressType already taken 
    // because it was identical to the addressType we are trying to add and it had not been deleted:

    // Ok, the current record is not holding the candidate addressType but 
    // maybe it was in the past and someone changed it.
    // if the candidate addressType is flagged unavailable and we are looking at the record that was flagged:
    else if(addressType_IsUnused === false && uniqueIdOfRecordHoldingCandidate_AddressType === lineObject.oAddressTypeId)
    {
      // Check if the addressType is no longer holding the candidate addressType.
      // If it is not holding the candidate addressType then flag the addressType 
      // available again and clear out the variable tracking this primary key.
      addressType_IsUnused = true;
      uniqueIdOfRecordHoldingCandidate_AddressType = false;
    }

  }); // End of: readInterface.on('line', function(line){...}
  // End of: Look at each record...




  // This listener fires after we have discovered if the addressType is 
  // unique or not, and have then closed the readable stream from oAddressType.
  // The callback function defined here will append the record if the addressType 
  // was found to be unique.
  // Behavior from meta.js at aiwaoocd1uegzjbqeydk
  readInterface.on('close', function() 
  {
    // If the addressType already exists then exit this process without appending the record.
    if (!addressType_IsUnused) 
    {      
      helpers.log
      (
        5,
        'eoq6try6ntg4a0kmndga' + '\n' +
        'The addressType : ' + addressType + ' already exists' + '\n'                                  
      ); // End of: helpers.log(...)

      return callback(400, {'Error' : 'The addressType already exists'});
    }

    // If we made it to this point then the candidate addressType is unique so continue on with the append opperation.
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
          'cltk2notjgd0om1f1t4s' + '\n' +
          'Unable to get the next gsuid.' + '\n' +
          'The following was the error' + '\n' +
          JSON.stringify(error) + '\n'                                   
        ); // End of: helpers.log(...)

        return callback(423, {'Error' : 'Database is Locked'});
      }


      // If we got this far then we were able to lock the gsuid.json file and get the next 
      // unique id number for this record so continue on.



      // Create the oAddressType object. 
      // This object will be appended to oAddressType.json.
      let oAddressTypeObject = {};
      oAddressTypeObject.oAddressTypeId = nextIdObject.nextId;
      oAddressTypeObject.addressType = addressType;
      
      oAddressTypeObject.timeStamp = Date.now();
      oAddressTypeObject.deleted = false;

      // Create the logObject.
      // This object will be written to history.json which maintains a history of 
      // all changes to all tables in the database.
      var logObject =
      {
        "historyId" : nextIdObject.nextId + 1,                 
        "transactionId" : nextIdObject.nextId + 2,            
        "rollback" : false,
        "process" : "oAddressType._oAddressType.post",
        "comment" : "Post new record",
        "who" : "No login yet",    
        "oAddressType" : oAddressTypeObject   
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
              'ee85wtmn8vqr0f9rg5hn' + '\n' +
              'There was an error appending to the history file' + '\n' +
              'An error here does not necessarily mean the append to history did not happen.' + '\n' +  
              'But an error at this point in the code surely means there was no append to oAddressType' + '\n' +                                          
              'CHECK TO SEE IF history and oAddressType ARE STILL IN SYNC' + '\n' +                    
              'The following was the record we tried to append:' + '\n' +
              JSON.stringify(logObject) + '\n' +                   
              'The following is the error message:' + '\n' +                  
              err  + '\n'
            );

            return callback(500, {'Error' : 'Could not create a new oAddressType record.'});
          }



          // The history file has been appended to successfully so continue on.



          // Calling the function which appends a record to the file oAddressType.json
          _data.append
          (
          '/ourSelf/oLookup/oAddressType', 
          'oAddressType', 
          oAddressTypeObject, 
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
                    'u2kg07zn7z7t7kryqpfw' + '\n' +
                    'Successful write to oAddressType but unable to remove lock on database' + '\n' +
                    'The following record was appended to the oAddressType file:' + '\n' +                            
                    JSON.stringify(logObject) + '\n' +   
                    'The following was the error message:' + '\n' +                                             
                    error + '\n'
                  ); // End of: helpers.log. Log the error.

                  return callback(500, {'Error' : 'Successful write to oAddressType but unable to remove lock on database'});

                } // End of: else Good write but unable to remove lock on database.

              } // End of callback code which is run after attempting to remove the lock.
              ); // End of: _data.removeLock(function(error){...}
              // End of: Call to function which removes lock

            }    // End of: if (!err)  //The file has been appended to successfully.
            else // There was an error appending to oAddressType.
            {
              helpers.log // Log the error.
              (
                5,
                '68te2avrqdwwhkmip9eb' + '\n' +
                'There was an error when appending to the oAddressType file.' + '\n' +
                'The following record may or may not have been appended to the oAddressType file:' + '\n' +                            
                JSON.stringify(logObject) + '\n' +
                'Attempting to rollback the entry.' + '\n' +    
                'The following was the error message:' + '\n' +                                             
                err + '\n'            
              );

              // Assemble rollback record for the oAddressType file which will negate previous entry if any.                 
              oAddressTypeObject.timeStamp = Date.now();
              oAddressTypeObject.deleted = true;

              // Assemble rollback record for the history file which will negate previous entry if any.
              logObject =
              {
                "historyId" : nextIdObject.nextId + 3,                             
                "transactionId" : nextIdObject.nextId + 2,                        
                "rollback" : true,
                "process" : "oAddressType._oAddressType.post",
                "comment" : "Error posting. Appending a delete.",                        
                "who" : "Function needed",    
                "oAddressType" : oAddressTypeObject   
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
                    // Calling the function which appends a record to the file oAddressType.json
                    _data.append
                    (
                      '/ourSelf/oLookup/oAddressType', 
                      'oAddressType', 
                      oAddressTypeObject, 
                      function(err)
                      {
                        if (!err) // The rollback record for oAddressType was appended successfully.
                        {
                          helpers.log
                          (
                            5,
                            'helo7ggyh2cal47j8ovh' + '\n' +
                            'Rollback entry in the oAddressType file was appended successfully' + '\n' +
                            'The following was the record we rolled back:' + '\n' +
                            JSON.stringify(logObject) + '\n'                                   
                          ); // End of: helpers.log(...)
                        }
                        else // There was an error when rolling back record for oAddressType.
                        {
                          helpers.log
                          (
                            7,
                            '7o6f13t17fomryiswgsr' + '\n' +
                            'There was an error appending a rollback entry in the oAddressType file' + '\n' +
                            'The following record may or may not have been rolled back:' + '\n' +
                            JSON.stringify(logObject) + '\n' +   
                            'An error here does not necessarily mean the deleting append to oAddressType did not happen.' + '\n' +                                        
                            'CHECK TO SEE IF history and oAddressType ARE STILL IN SYNC' + '\n' + 
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
                      'r0rr1sjgzuqkkhmwza5a' + '\n' +
                      'There was an error appending a rollback entry in the history file' + '\n' +
                      'A rollback entry may or may not have been written in the oAddressType file' + '\n' +  
                      'CHECK TO SEE IF history and oAddressType ARE STILL IN SYNC' + '\n' +                                      
                      'The following was the record we tried to roll back:' + '\n' +
                      JSON.stringify(logObject) + '\n' +        
                      'The following is the error message:' + '\n' +
                      err  + '\n'
                    );
                  } // End of: else There was an error when appending a rollback entry in history.
                } // End of: callback function(err){...}
              ); // End of: _data.append(...) Append a rollback entry in history.

              return callback(500, {'Error' : 'Could not create the new oAddressType.'});              

            } // End of: else // There was an error appending to oAddressType.
          } // End of: callback function
          ); // End of: Calling the function which appends a record to the file oAddressType.json 
        } // End of: callback function
      ); // End of: _data.append(dbHistory...)
      // End of: Calling the function which creates an entry into history. 
    }); // End of: lib.nextId(function(err, nextIdObject)
  }); // End of: readInterface.on('close', function(){...}
}; // End of: oAddressType._oAddressType.post = function(...
// End of: oAddressType - post subhandler




