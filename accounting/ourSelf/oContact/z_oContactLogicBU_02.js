
/*
/ Handlers for the "oContact" table.
/ This program was built by meta.js starting at yx52pvsi0kn9p5o46hrq
*/


// Dependencies
const fs = require('fs');
const readline = require('readline');
const { pipeline, Readable, Writable } = require('stream');
const StringDecoder = require('string_decoder').StringDecoder;
const _data = require('../../../lib/aData');
const helpers = require('../../../lib/aHelpers');


// Create a container for all the handlers
let oContact = {};




// Define the handler function that serves up the HTML page for searching and listing oContact records.
// Behavior from meta.js at gg9ec14lo9rqjk7kxz7f
oContact.serveListPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : 'OContact List',
      'body.class' : 'oContactList',     
      'tableName':'oContact',
      "tableLabel":"OContact",    
      'head.clientCode' : '', // The HTML header template must see something or an empty string.         
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/ourSelf/oContact/oContactList', templateData, function(errorGetTemplate, str)
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
              'sxu21i8wlpuhidd8uio1' + '\n' +
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
          'bg1hfd5v7pibaico3gtv' + '\n' +
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
      'oigkg59p3d9lk6ng4agc' + '\n' +
      'Method not get. Only gets allowed.' + '\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: oContact.serveListPage = function(data, callback){...}
// End of:// Define the handler function that serves up the HTML page for searching and listing oContact records.




// Define the handler function that serves up the HTML page for creating new oContact records.
// Behavior from meta.js at xenz5eipqot8nym0eev3
oContact.serveAddPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : 'Create a New OContact',
      'head.description' : 'For creating a new oContact record',
      'body.class' : 'oContactAdd', 
      'head.clientCode' : '', // The HTML header template must see something or an empty string.      
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/ourSelf/oContact/oContactAdd', templateData, function(errorGetTemplate, str)
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
              'ux4ljv95jgurgzzhjgcw' + '\n' +
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
          'mnhh3nhr0ss2so3d2dio' + '\n' +
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
      'ygvge4qdnugftuzupdu4' + '\n' +
      'Method not get. Only gets allowed.' + '\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: oContact.serveAddPage = function(data, callback){...}
// End of: Define the handler function that serves up the HTML page for creating new oContact records.




// Define the handler function that serves up the HTML page for editing oContact records.
// Behavior from meta.js at 2a4tb24fsq3de66ti8c4
oContact.serveEditPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : 'Edit a OContact',     
      'body.class' : 'oContactEdit',
      'selected.oContactId' : data.queryStringObject.oContactId,  
      'head.clientCode' : '', // The HTML header template must see something or an empty string.     
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/ourSelf/oContact/oContactEdit', templateData, function(errorGetTemplate, str)
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
              'a9o3org6zg701joxx6va' + '\n' +
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
          'p3zv4d30tcu0umth6tbl' + '\n' +
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
      'zjqclojycxwpgm7sm4wf' + '\n' +
      'Method not get. Only gets allowed.' + '\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: oContact.serveEditPage = function(data, callback){...}
// End of: Define the handler function that serves up the HTML page for editing oContact records.




// Router for oContact functions
// Define a function which calls the requested get, post, put, or delete subhandler function for oContact 
// and passes to the chosen subhandler the client's request object and the callback function.
// Behavior from meta.js at lw39etuyhw7wb82hv9ct
oContact.oContact = function(data, callback)
{
  // Create an array of acceptable methods.
  var acceptableMethods = ['post', 'get', 'put'];

  // if the requested method is one of the acceptable methods:
  if (acceptableMethods.indexOf(data.method) > -1) 
  {
    // then call the appropriate oContact subhandler.
    oContact._oContact[data.method](data, callback);
  } 
  // Otherwise the method was not one of the acceptable methods:
  else 
  {
    helpers.log
    (
      5,
      'f7wigod0qegq9drgbvjw' + '\n' +
      'The method was not one of the acceptable methods' + '\n'
    ); 

    // so send back status 405 (Not Allowed).
    callback(405);
  }
}; // End of: oContact.oContact = function(data, callback){...}
//End of: Router for oContact functions




// Create a subobject within the handlers object for the oContact submethods (post, get, put, and delete)
oContact._oContact = {};




// oContact - post subhandler
// Define the oContact post subhandler function.
// This function appends a record to the oContact file.
// Behavior from meta.js at 1723qxikk1l3ru0vfrny 
oContact._oContact.post = function(data, callback)
{
  // Field validation starts here.
  // Get oContact_properties_firstName from payload
  let oContact_properties_firstName = data.payload["oContact_properties_firstName"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(oContact_properties_firstName) != 'string'){return callback(400, {'Error' : 'oContact_properties_firstName must be of datatype string'});}
  if(!oContact_properties_firstName || oContact_properties_firstName.trim().length === 0){return callback(400, {'Error' : 'No oContact_properties_firstName was entered'});}else{oContact_properties_firstName = oContact_properties_firstName.trim()}

  // Get oContact_properties_lastName from payload
  let oContact_properties_lastName = data.payload["oContact_properties_lastName"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(oContact_properties_lastName) != 'string'){return callback(400, {'Error' : 'oContact_properties_lastName must be of datatype string'});}
  if(!oContact_properties_lastName || oContact_properties_lastName.trim().length === 0){return callback(400, {'Error' : 'No oContact_properties_lastName was entered'});}else{oContact_properties_lastName = oContact_properties_lastName.trim()}

  // Get oContact_properties_email from payload
  let oContact_properties_email = data.payload["oContact_properties_email"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(oContact_properties_email) != 'string'){return callback(400, {'Error' : 'oContact_properties_email must be of datatype string'});}
  if(!oContact_properties_email || oContact_properties_email.trim().length === 0){return callback(400, {'Error' : 'No oContact_properties_email was entered'});}else{oContact_properties_email = oContact_properties_email.trim()}

  // Get oContact_properties_phone_properties_phone1_properties_phoneType from payload
  let oContact_properties_phone_properties_phone1_properties_phoneType = data.payload["oContact_properties_phone_properties_phone1_properties_phoneType"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(oContact_properties_phone_properties_phone1_properties_phoneType) != 'string'){return callback(400, {'Error' : 'oContact_properties_phone_properties_phone1_properties_phoneType must be of datatype string'});}
  if(!oContact_properties_phone_properties_phone1_properties_phoneType || oContact_properties_phone_properties_phone1_properties_phoneType.trim().length === 0){return callback(400, {'Error' : 'No oContact_properties_phone_properties_phone1_properties_phoneType was entered'});}else{oContact_properties_phone_properties_phone1_properties_phoneType = oContact_properties_phone_properties_phone1_properties_phoneType.trim()}

  // Get oContact_properties_phone_properties_phone1_properties_phone from payload
  let oContact_properties_phone_properties_phone1_properties_phone = data.payload["oContact_properties_phone_properties_phone1_properties_phone"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(oContact_properties_phone_properties_phone1_properties_phone) != 'string'){return callback(400, {'Error' : 'oContact_properties_phone_properties_phone1_properties_phone must be of datatype string'});}
  if(!oContact_properties_phone_properties_phone1_properties_phone || oContact_properties_phone_properties_phone1_properties_phone.trim().length === 0){return callback(400, {'Error' : 'No oContact_properties_phone_properties_phone1_properties_phone was entered'});}else{oContact_properties_phone_properties_phone1_properties_phone = oContact_properties_phone_properties_phone1_properties_phone.trim()}

  // Get oContact_properties_address_properties_address1_properties_addressType from payload
  let oContact_properties_address_properties_address1_properties_addressType = data.payload["oContact_properties_address_properties_address1_properties_addressType"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(oContact_properties_address_properties_address1_properties_addressType) != 'string'){return callback(400, {'Error' : 'oContact_properties_address_properties_address1_properties_addressType must be of datatype string'});}
  if(!oContact_properties_address_properties_address1_properties_addressType || oContact_properties_address_properties_address1_properties_addressType.trim().length === 0){return callback(400, {'Error' : 'No oContact_properties_address_properties_address1_properties_addressType was entered'});}else{oContact_properties_address_properties_address1_properties_addressType = oContact_properties_address_properties_address1_properties_addressType.trim()}

  // Get oContact_properties_address_properties_address1_properties_street1 from payload
  let oContact_properties_address_properties_address1_properties_street1 = data.payload["oContact_properties_address_properties_address1_properties_street1"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(oContact_properties_address_properties_address1_properties_street1) != 'string'){return callback(400, {'Error' : 'oContact_properties_address_properties_address1_properties_street1 must be of datatype string'});}
  if(!oContact_properties_address_properties_address1_properties_street1 || oContact_properties_address_properties_address1_properties_street1.trim().length === 0){return callback(400, {'Error' : 'No oContact_properties_address_properties_address1_properties_street1 was entered'});}else{oContact_properties_address_properties_address1_properties_street1 = oContact_properties_address_properties_address1_properties_street1.trim()}

  // Get oContact_properties_address_properties_address1_properties_street2 from payload
  let oContact_properties_address_properties_address1_properties_street2 = data.payload["oContact_properties_address_properties_address1_properties_street2"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(oContact_properties_address_properties_address1_properties_street2) != 'string'){return callback(400, {'Error' : 'oContact_properties_address_properties_address1_properties_street2 must be of datatype string'});}
  if(!oContact_properties_address_properties_address1_properties_street2 || oContact_properties_address_properties_address1_properties_street2.trim().length === 0){return callback(400, {'Error' : 'No oContact_properties_address_properties_address1_properties_street2 was entered'});}else{oContact_properties_address_properties_address1_properties_street2 = oContact_properties_address_properties_address1_properties_street2.trim()}

  // Get oContact_properties_address_properties_address1_properties_city from payload
  let oContact_properties_address_properties_address1_properties_city = data.payload["oContact_properties_address_properties_address1_properties_city"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(oContact_properties_address_properties_address1_properties_city) != 'string'){return callback(400, {'Error' : 'oContact_properties_address_properties_address1_properties_city must be of datatype string'});}
  if(!oContact_properties_address_properties_address1_properties_city || oContact_properties_address_properties_address1_properties_city.trim().length === 0){return callback(400, {'Error' : 'No oContact_properties_address_properties_address1_properties_city was entered'});}else{oContact_properties_address_properties_address1_properties_city = oContact_properties_address_properties_address1_properties_city.trim()}

  // Get oContact_properties_address_properties_address1_properties_state from payload
  let oContact_properties_address_properties_address1_properties_state = data.payload["oContact_properties_address_properties_address1_properties_state"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(oContact_properties_address_properties_address1_properties_state) != 'string'){return callback(400, {'Error' : 'oContact_properties_address_properties_address1_properties_state must be of datatype string'});}
  if(!oContact_properties_address_properties_address1_properties_state || oContact_properties_address_properties_address1_properties_state.trim().length === 0){return callback(400, {'Error' : 'No oContact_properties_address_properties_address1_properties_state was entered'});}else{oContact_properties_address_properties_address1_properties_state = oContact_properties_address_properties_address1_properties_state.trim()}

  // Get oContact_properties_address_properties_address1_properties_zip from payload
  let oContact_properties_address_properties_address1_properties_zip = data.payload["oContact_properties_address_properties_address1_properties_zip"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(oContact_properties_address_properties_address1_properties_zip) != 'string'){return callback(400, {'Error' : 'oContact_properties_address_properties_address1_properties_zip must be of datatype string'});}
  if(!oContact_properties_address_properties_address1_properties_zip || oContact_properties_address_properties_address1_properties_zip.trim().length === 0){return callback(400, {'Error' : 'No oContact_properties_address_properties_address1_properties_zip was entered'});}else{oContact_properties_address_properties_address1_properties_zip = oContact_properties_address_properties_address1_properties_zip.trim()}


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
          'n9v6ftqfwp946erj2ami' + '\n' +
          'Unable to get the next gsuid.' + '\n' +
          'The following was the error' + '\n' +
          JSON.stringify(error) + '\n'                                   
        ); // End of: helpers.log(...)

        return callback(423, {'Error' : 'Database is Locked'});
      }


      // If we got this far then we were able to lock the gsuid.json file and get the next 
      // unique id number for this record so continue on.



      // Create the oContact object. 
      // This object will be appended to oContact.json.
      let oContactObject = {};
      oContactObject.oContactId = nextIdObject.nextId

      oContactObject.oContact = {}
      oContactObject.oContact.properties = {};
      oContactObject.oContact.properties.firstName = oContact_properties_firstName
      oContactObject.oContact.properties.lastName = oContact_properties_lastName
      // oContactObject.oContact.properties.fullName = oContact_properties_fullName,
      oContactObject.oContact.properties.email = oContact_properties_email

      oContactObject.oContact.properties.phone = {};
      oContactObject.oContact.properties.phone.properties = {};
      oContactObject.oContact.properties.phone.properties.phone1 = {};
      oContactObject.oContact.properties.phone.properties.phone1.properties = {};
      oContactObject.oContact.properties.phone.properties.phone1.properties.phoneType = oContact_properties_phone_properties_phone1_properties_phoneType
      oContactObject.oContact.properties.phone.properties.phone1.properties.phone = oContact_properties_phone_properties_phone1_properties_phone      

      oContactObject.oContact.properties.address = {};
      oContactObject.oContact.properties.address.properties = {};
      oContactObject.oContact.properties.address.properties.address1 = {};
      oContactObject.oContact.properties.address.properties.address1.properties = {};
      oContactObject.oContact.properties.address.properties.address1.properties.addressType = oContact_properties_address_properties_address1_properties_addressType
      oContactObject.oContact.properties.address.properties.address1.properties.street1 = oContact_properties_address_properties_address1_properties_street1
      oContactObject.oContact.properties.address.properties.address1.properties.street2 = oContact_properties_address_properties_address1_properties_street2
      oContactObject.oContact.properties.address.properties.address1.properties.city = oContact_properties_address_properties_address1_properties_city
      oContactObject.oContact.properties.address.properties.address1.properties.state = oContact_properties_address_properties_address1_properties_state
      oContactObject.oContact.properties.address.properties.address1.properties.zip = oContact_properties_address_properties_address1_properties_zip

      oContactObject.timeStamp = Date.now()
      oContactObject.deleted = false
      

      // Create the logObject.
      // This object will be written to history.json which maintains a history of 
      // all changes to all tables in the database.
      let logObject =
      {
        "historyId" : nextIdObject.nextId + 1,                 
        "transactionId" : nextIdObject.nextId + 2,            
        "rollback" : false,
        "process" : "oContact._oContact.post",
        "comment" : "Post new record",
        "who" : "No login yet",    
        "oContact" : oContactObject   
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
              'vax0lq1u24w7pbxpvcwx' + '\n' +
              'There was an error appending to the history file' + '\n' +
              'An error here does not necessarily mean the append to history did not happen.' + '\n' +  
              'But an error at this point in the code surely means there was no append to oContact' + '\n' +                                          
              'CHECK TO SEE IF history and oContact ARE STILL IN SYNC' + '\n' +                    
              'The following was the record we tried to append:' + '\n' +
              JSON.stringify(logObject) + '\n' +                   
              'The following is the error message:' + '\n' +                  
              err  + '\n'
            );

            return callback(500, {'Error' : 'Could not create a new oContact record.'});
          }



          // The history file has been appended to successfully so continue on.



          // Calling the function which appends a record to the file oContact.json
          _data.append
          (
          '/ourSelf/oContact', 
          'oContact', 
          oContactObject, 
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
                    'rrxmoqt2s2vw0qhd6am3' + '\n' +
                    'Successful write to oContact but unable to remove lock on database' + '\n' +
                    'The following record was appended to the oContact file:' + '\n' +                            
                    JSON.stringify(logObject) + '\n' +   
                    'The following was the error message:' + '\n' +                                             
                    error + '\n'
                  ); // End of: helpers.log. Log the error.

                  return callback(500, {'Error' : 'Successful write to oContact but unable to remove lock on database'});

                } // End of: else Good write but unable to remove lock on database.

              } // End of callback code which is run after attempting to remove the lock.
              ); // End of: _data.removeLock(function(error){...}
              // End of: Call to function which removes lock

            }    // End of: if (!err)  //The file has been appended to successfully.
            else // There was an error appending to oContact.
            {
              helpers.log // Log the error.
              (
                5,
                'fm289ag515drtznrmjds' + '\n' +
                'There was an error when appending to the oContact file.' + '\n' +
                'The following record may or may not have been appended to the oContact file:' + '\n' +                            
                JSON.stringify(logObject) + '\n' +
                'Attempting to rollback the entry.' + '\n' +    
                'The following was the error message:' + '\n' +                                             
                err + '\n'            
              );

              // Assemble rollback record for the oContact file which will negate previous entry if any.  
              oContactObject = 
              {
                "oContactId" : nextIdObject.nextId,
                "oContact_properties_firstName" : "oContact_properties_firstName",
                "oContact_properties_lastName" : "oContact_properties_lastName",
                "oContact_properties_fullName" : "oContact_properties_fullName",
                "oContact_properties_email" : "oContact_properties_email",
                "oContact_properties_phone_properties_phone1_properties_phoneType" : "oContact_properties_phone_properties_phone1_properties_phoneType",
                "oContact_properties_phone_properties_phone1_properties_phone" : "oContact_properties_phone_properties_phone1_properties_phone",
                "oContact_properties_address_properties_address1_properties_addressType" : "oContact_properties_address_properties_address1_properties_addressType",
                "oContact_properties_address_properties_address1_properties_street1" : "oContact_properties_address_properties_address1_properties_street1",
                "oContact_properties_address_properties_address1_properties_street2" : "oContact_properties_address_properties_address1_properties_street2",
                "oContact_properties_address_properties_address1_properties_city" : "oContact_properties_address_properties_address1_properties_city",
                "oContact_properties_address_properties_address1_properties_state" : "oContact_properties_address_properties_address1_properties_state",
                "oContact_properties_address_properties_address1_properties_zip" : "oContact_properties_address_properties_address1_properties_zip",
                "timeStamp" : Date.now(),
                "deleted" : true
              };                        

              // Assemble rollback record for the history file which will negate previous entry if any.
              logObject =
              {
                "historyId" : nextIdObject.nextId + 3,                             
                "transactionId" : nextIdObject.nextId + 2,                        
                "rollback" : true,
                "process" : "oContact._oContact.post",
                "comment" : "Error posting. Appending a delete.",                        
                "who" : "Function needed",    
                "oContact" : oContactObject   
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
                    // Calling the function which appends a record to the file oContact.json
                    _data.append
                    (
                      '/ourSelf/oContact', 
                      'oContact', 
                      oContactObject, 
                      function(err)
                      {
                        if (!err) // The rollback record for oContact was appended successfully.
                        {
                          helpers.log
                          (
                            5,
                            '0jyytafier9uwj638d2n' + '\n' +
                            'Rollback entry in the oContact file was appended successfully' + '\n' +
                            'The following was the record we rolled back:' + '\n' +
                            JSON.stringify(logObject) + '\n'                                   
                          ); // End of: helpers.log(...)
                        }
                        else // There was an error when rolling back record for oContact.
                        {
                          helpers.log
                          (
                            7,
                            '1l5cquk8pzdrplh4hcwd' + '\n' +
                            'There was an error appending a rollback entry in the oContact file' + '\n' +
                            'The following record may or may not have been rolled back:' + '\n' +
                            JSON.stringify(logObject) + '\n' +   
                            'An error here does not necessarily mean the deleting append to oContact did not happen.' + '\n' +                                        
                            'CHECK TO SEE IF history and oContact ARE STILL IN SYNC' + '\n' + 
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
                      '1ynip8vpq7lwfm7d1lfu' + '\n' +
                      'There was an error appending a rollback entry in the history file' + '\n' +
                      'A rollback entry may or may not have been written in the oContact file' + '\n' +  
                      'CHECK TO SEE IF history and oContact ARE STILL IN SYNC' + '\n' +                                      
                      'The following was the record we tried to roll back:' + '\n' +
                      JSON.stringify(logObject) + '\n' +        
                      'The following is the error message:' + '\n' +
                      err  + '\n'
                    );
                  } // End of: else There was an error when appending a rollback entry in history.
                } // End of: callback function(err){...}
              ); // End of: _data.append(...) Append a rollback entry in history.

              return callback(500, {'Error' : 'Could not create the new oContact.'});              

            } // End of: else // There was an error appending to oContact.
          } // End of: callback function
          ); // End of: Calling the function which appends a record to the file oContact.json 
        } // End of: callback function
      ); // End of: _data.append(dbHistory...)
      // End of: Calling the function which creates an entry into history. 
    }); // End of: lib.nextId(function(err, nextIdObject)
}; // End of: oContact._oContact.post = function(...
// End of: oContact - post subhandler




// oContact - put handler
// Define the oContact put subhandler function 
// This function updates a record.
// Required data: oContactId
// Note: At least one other field must be specified.
// Behavior from meta.js at mzimrkdf1we1bjw96zgp
oContact._oContact.put = function(data, callback)
{
  // Field validation starts here.
  // Get oContactId from payload
  let oContactId = data.payload.oContactId;

  // PrimaryKey validation. 
  // Default behavior from meta.js at o65yzg6ddze2fkvcgw5s
  // If oContactId is a valid string then convert it to a number.  
  if (typeof(oContactId) === 'string'){oContactId = parseInt(oContactId, 10);}else{return callback(400, {'Error' : 'oContactId must be a of string type'});}

  // Check if the deleted flag is of type string and that the value is exactly equal to "true".
  // That would mean the user wants to delete the record. Otherwise the users does not want to delete the record.
  // Set deleted to boolean true if validation is passed otherwise set it to false.
  // Behavior from meta.js at ts2g5rn5uw6mvup58vph
  let deleted = typeof(data.payload.deleted) === 'string' && data.payload.deleted === "true" ? true : false;

  
  //if all fields fail validation then exit this process without writing changes to the table.
  if(!deleted)
  {
    helpers.log
    (
      5,
      '38bicmtcb37usx0pmh29' + '\n' +
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
        'up3k9na8yuzct9z4uvcv' + '\n' +
        'Unable to get the next gsuid.' + '\n' +
        'The following was the error' + '\n' +
        JSON.stringify(error) + '\n'                                   
      ); // End of: helpers.log(...)

      return callback(423, {'Error' : 'Database is Locked'});
    } // End of: If lock failed or unable to get the next gsuid.


    // If we made it here then we were able to lock the gsuid.json file and get 
    // the next unique id number for this record. So continue with the process.


    // Create the oContact object. 
    // This object will be appended to oContact.json.
    // Add in all fields even if no data is available yet. 
    // This is to establish the order in which the fields will be writen to the table. 
    // Behavior from 3bd1sa5ve4aqrfspunrt in meta.js         
    let oContactObject = 
    {
      "oContactId" : oContactId,
      "oContact" : oContact,
      "timeStamp" : Date.now(),
      "deleted" : ""
    };

    dataObject = {};
    dataObject.path = '/ourSelf/oContact/oContact.json';
    dataObject.queryString = 'WHERE:;oContactId:;MatchesExactly:;' + oContactId + ':;';

    // This function returns the most recent record for this oContactId after checking that 
    // data for unique fields is indeed unique and that the a record with the supplied oContactId exists to modify.
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
                '2ljiuhl4kg9ibdo4hvl4' + '\n' + 
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
                'mz1820fwys6mmk4umjue' + '\n' +
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


        // If we are appending a delete make sure that everything else is coming from the most recent saved record.
        if(deleted)
        {
          oContactObject.oContact = recordObject.oContact;
          oContactObject.deleted = true;
        }
        else
        {
          oContactObject.deleted = false;
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
          "process" : "oContact._oContact.put",
          "comment" : "Changing a record",
          "who" : "No login yet.",    
          "oContact" : oContactObject   
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
              // Calling the function which appends a record to the file oContact.json
              _data.append
              (
                '/ourSelf/oContact', 
                'oContact', 
                oContactObject, 
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
                          '8tdc0q97ep32indwy5u8' + '\n' +
                          'Successful write to oContact but unable to remove lock on database' + '\n' +
                          'The following record was appended to oContact:' + '\n' +                            
                          JSON.stringify(logObject) + '\n' +   
                          'The following was the error message:' + '\n' +                                             
                          error + '\n'
                        ); // End of: helpers.log // Log the error.

                        callback(500, {'Error' : 'Successful write to oContact but unable to remove lock on database'});

                      } // End of: else Good write but unable to remove lock on database.

                    } // End of callback code which is run after attempting to remove the lock.
                    ); // End of: _data.removeLock(function(error){...}
                    // End of: Call to function which removes lock

                  }    // End of: if (!err)  //The file has been appended to successfully.
                  else // There was an error appending to oContact.
                  {
                    helpers.log // Log the error.
                    (
                      5,
                      'wg1mr7nw3am4u5vustp0' + '\n' +
                      'There was an error when appending to the oContact file.' + '\n' +
                      'The following record may or may not have been appended to oContact:' + '\n' +                            
                      JSON.stringify(logObject) + '\n' +
                      'Attempting to rollback the entry.' + '\n' +    
                      'The following was the error message:' + '\n' +                                             
                      err + '\n'
                    );

                    // Assemble rollback record for the oContact file which will negate previous entry if any.
                    // Behavior from meta.js at 8l4zwqs63qwmp81rjcpw  
                    oContactObject = 
                    {
                        "oContactId" : recordObject.nextId,
                        "oContact" : recordObject.oContact,
                        "timeStamp" : recordObject.timeStamp,
                        "deleted" : recordObject.deleted
                    };                        

                    // Assemble rollback record for the history file which will negate previous entry if any.
                    logObject =
                    {                    
                      "historyId" : nextIdObject.nextId + 3,    
                      "transactionId" : nextIdObject.nextId + 2,                                
                      "rollback" : true,
                      "process" : "oContact._oContact.put",
                      "comment" : "Error during Put. Appending rollback",                        
                      "who" : "No login yet",    
                      "oContact" : oContactObject   
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
                          // Calling the function which appends a record to the file oContact.json
                          _data.append
                          (
                            '/ourSelf/oContact', 
                            'oContact', 
                            oContactObject, 
                            function(err)
                            {
                              if (!err) // The rollback record for oContact was appended successfully.
                              {
                                helpers.log
                                (
                                  5,
                                  'uz123r3n2qmmrh2qyive' + '\n' +
                                  'Rollback entry in the oContact file was appended successfully' + '\n' +
                                  'The following was the record we rolled back:' + '\n' +
                                  JSON.stringify(logObject) + '\n'                                   
                                ); // End of: helpers.log(...)
                              }
                              else // There was an error when rolling back record for oContact.
                              {
                                helpers.log
                                (
                                  7,
                                  'bspvk04kau8i201680b6' + '\n' +
                                  'There was an error appending a rollback entry in the oContact file' + '\n' +
                                  'The following record may or may not have been rolled back:' + '\n' +
                                  JSON.stringify(logObject) + '\n' +   
                                  'An error here does not necessarily mean the deleting append to oContact did not happen.' + '\n' +                                        
                                  'CHECK TO SEE IF history and oContact ARE STILL IN SYNC' + '\n' + 
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
                            '1218gsclrnmkawy92074' + '\n' +
                            'There was an error appending a rollback entry in the history file' + '\n' +
                            'A rollback entry may or may not have been written in the oContact file' + '\n' +  
                            'CHECK TO SEE IF history and oContact ARE STILL IN SYNC' + '\n' +                                      
                            'The following was the record we tried to roll back:' + '\n' +
                            JSON.stringify(logObject) + '\n' +        
                            'The following is the error message:' + '\n' +
                            err  + '\n'
                          );
                        } // End of: else There was an error when appending a rollback entry in history.
                      } // End of: callback function(err){...}
                    ); // End of: _data.append(...)

                    callback(500, {'Error' : 'Could not create the new oContact.'});

                  } // End of: else // There was an error appending to oContact.
                } // End of: callback function
                ); // End of: Calling the function which appends a record to the file oContact.json 

            } //End of: The history file has been appended to successfully.
            else // There was an error appending to the history file.
            {
              helpers.log
              (
                7,
                'x8yt2zcu5pn4is5n4ewk' + '\n' +
                'There was an error appending to the history file' + '\n' +
                'An error here does not necessarily mean the append to history did not happen.' + '\n' +  
                'But an error at this point in the code surely means there was no append to oContact' + '\n' +                                          
                'CHECK TO SEE IF history and oContact ARE STILL IN SYNC' + '\n' +                    
                'The following was the record we tried to append:' + '\n' +
                JSON.stringify(logObject) + '\n' +                   
                'The following is the error message:' + '\n' +                  
                err  + '\n'
              );

              callback(500, {'Error' : 'Could not create the new oContact.'});
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
              'wgsaatfgp81cjbdxt82d' + '\n' + 
              'Pipeline error. The message was as follows' + '\n' +                                             
              pipelineError + '\n'                                                 
            ); // End of: helpers.log // Log the error.
          } // End of: if(pipelineError){...}
        } // End of: function(piplineError){...}
      ); // End of: Pipeline
    }); //End of: helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)
  }); // End of: lib.nextId(function(err, nextIdObject)
}; // End of: handlers._oContact.put = function(...
// End of: Define the oContact put subhandler function




// Define the oContact get subhandler function.
// Streams the oContact file or part of it back to the client.
oContact._oContact.get = function(data, callback)
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
      // In this case the queryString is coming from oContactEdit page.
      queryString = data.queryString
    }
    else
    {
      // In this case the queryString is coming from the oContactList page.
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


  
  // Create an empty map data structure which will be used to merge oContact records that have the same unique fields.
  // Chose map data structure over objects because maps are guaranteed to maintain the same order where as objects are not.
  let oContactMap = new Map();
  
  // This function sets up a stream where each chunk of data is a complete line in the oContact file.
  let readInterface = readline.createInterface
  (
    { // specify the file to be read.
      input: fs.createReadStream(_data.baseDir + '/ourSelf/oContact' + '/' + 'oContact' + '.json'),
    }
  );



  // Look at each record in the file.
  readInterface.on('line', function(line) 
  {
    // Convert the JSON string (a single line from the oContact file) into lineValueObject.
    // These objects will written back to a new file after deleting some un-needed key/value pairs.
    let lineValueObject = JSON.parse(line);
    let recordWasDeleted = false;    

    // Declare a variable to serve as a key in the map to manage the lineValueObject.
    let oContactId = lineValueObject.oContactId;      

    if(lineValueObject.deleted === true) // if the record in the file oContact.json had the delete field set to true:
    {
      // Remove this record from the map 
      oContactMap.delete(oContactId);
      recordWasDeleted = true;
    }
    else if(amountOfWhereClauses > 0) // else if the user created one or more filter expressions
    {
      let whereClauseCount = 1; // Represents the filter expression we are currently evaluating.
      let index = 1; // Used to navigate the queryArray.
      let shouldDeleteThisRecord = false;
      let shouldLoopAgain = true;


      function drillIntoObject(jsonRecordObject, queryItemArray, itemIndex)
      {
          // Converting each property key from dot notation to bracket notation.
          // Then using bracket notation to drill down into the object.

          // Get a reference to the recordObject called "value"
          let objValue = jsonRecordObject;

          // Split the property key into an array delimited by the dot if any.
          // The array will be used to drill into nested objects.
          const keyParts = queryItemArray[itemIndex].split(".");

          // Here is where we do the drilling.
          for (let keyPart of keyParts) 
          {
            // Make objValue point to it's sub-object or it's final value when the loop is finished running.
            objValue = objValue[keyPart];

            // Not all records will have the same data structure - 
            // Fields specified in the data dictionary may be missing.
            // So don't try to get a value if it's not there - 
            // That would cause an error and stop the table from loading
            if(objValue === undefined){break};            
          } 

          return objValue;
      };


      let fieldValue = drillIntoObject(lineValueObject, queryArray, index);


      while(whereClauseCount <= amountOfWhereClauses && shouldLoopAgain === true)
      {
        if (fieldValue === undefined) // Not all records will have the same structure. The field may not exist.
        {
          shouldDeleteThisRecord = true;
        }
        else
        {
          switch(queryArray[index + 1]) 
          {
            case 'MatchesExactly': // 1
            {
              if(fieldValue != queryArray[index + 2])
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;

            case 'MatchesExactlyNotCaseSensitive': // 2
            {
              if(fieldValue.toString().toLowerCase() != queryArray[index + 2].toString().toLowerCase())
              {
                shouldDeleteThisRecord = true;
              }             
            }
            break;
            
            case 'DoesNotMatchExactly': // 3
              {
                if(fieldValue == queryArray[index + 2])
                {
                  shouldDeleteThisRecord = true;
                }
              }
              break;

            case 'DoesNotMatchExactlyNotCaseSensitive': // 4
            {
              if(fieldValue.toString().toLowerCase() == queryArray[index + 2].toString().toLowerCase())
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;

            case 'BeginsWith': // 5
            {
              if(fieldValue.toString().indexOf(queryArray[index + 2].toString()) != 0)
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;
            
            case 'BeginsWithNotCaseSensitive': // 6
            {
              if(fieldValue.toString().toLowerCase().indexOf(queryArray[index + 2].toString().toLowerCase()) != 0)
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;    

            case 'DoesNotBeginWith': // 7
            {
              if(fieldValue.toString().indexOf(queryArray[index + 2].toString()) == 0)
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;

            case 'DoesNotBeginWithNotCaseSensitive': // 8
            {
              if(fieldValue.toString().toLowerCase().indexOf(queryArray[index + 2].toString().toLowerCase()) == 0)          
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;          

            case 'Contains': // 9
            {
              if(fieldValue.toString().indexOf(queryArray[index + 2].toString()) == -1)
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;

            case 'ContainsNotCaseSensitive': // 10
            {
              if(fieldValue.toString().toLowerCase().indexOf(queryArray[index + 2].toString().toLowerCase()) == -1)          
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;

            case 'DoesNotContain': // 11
            {
              if(fieldValue.toString().indexOf(queryArray[index + 2].toString()) > -1)
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;

            case 'DoesNotContainNotCaseSensitive': // 12
            {
              if(fieldValue.toString().toLowerCase().indexOf(queryArray[index + 2].toString().toLowerCase()) > -1)          
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;

            case 'EndsWith': // 13
            {
              if(!fieldValue.toString().endsWith(queryArray[index + 2].toString()))
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;
            
            case 'EndsWithNotCaseSensitive': // 14
            {
              if(!fieldValue.toString().toLowerCase().endsWith(queryArray[index + 2].toString().toLowerCase()))
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;
            
            case 'DoesNotEndWith': // 15
            {
              if(fieldValue.toString().endsWith(queryArray[index + 2].toString()))
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;
            
            case 'DoesNotEndWithNotCaseSensitive': // 16
            {
              if(fieldValue.toString().toLowerCase().endsWith(queryArray[index + 2].toString().toLowerCase()))
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;

            case 'IsGreaterThan': // 17
            {
              if(fieldValue <= queryArray[index + 2])
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;          
            
            case 'IsGreaterThanNotCaseSensitive': // 18
            {
              if(fieldValue.toString().toLowerCase() <= queryArray[index + 2].toString().toLowerCase())
              {
                shouldDeleteThisRecord = true;
              }
            }
            break; 
            
            case 'IsGreaterThanOrEqualTo': // 19
            {
              if(fieldValue < queryArray[index + 2])
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;
            
            case 'IsGreaterThanOrEqualToNotCaseSensitive': // 20
            {
              if(fieldValue.toString().toLowerCase() < queryArray[index + 2].toString().toLowerCase())
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;
            
            case 'IsLessThan': // 21
            {
              if(fieldValue >= queryArray[index + 2])
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;

            case 'IsLessThanNotCaseSensitive': // 22
            {
              if(fieldValue.toString().toLowerCase() >= queryArray[index + 2].toString().toLowerCase())
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;                
            
            case 'IsLessThanOrEqualTo': // 23
            {
              if(fieldValue > queryArray[index + 2])
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;          
            
            case 'IsLessThanOrEqualToNotCaseSensitive': // 24
            {
              if(fieldValue.toString().toLowerCase() > queryArray[index + 2].toString().toLowerCase())
              {
                shouldDeleteThisRecord = true;
              }
            }
            break;          
                        
            default: // When there are no case matches then do this.
            {

            }

          } // End of: switch(queryArray[index + 1])  
        } // End of: if (fieldValue === undefined){...}
             
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
            oContactMap.delete(oContactId);
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
      oContactMap.set(oContactId, lineValueObject);
    }

  }); // End of: readInterface.on('line', function(line){...}
  // End of: Look at each record...


  // This listener fires after we have looked through all the records in the oContact file.
  // The callback function defined here will stream the oContact list back to the clients browser.
  readInterface.on('close', function() 
  {          
    // This readable stream will be used to write the result of the merge to a new file.
    const sourceStream = new Readable(); 

    for (const [key, valueObject] of oContactMap)
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

}; // End of: handlers._oContact.get = function(data, callback){do stuff}
// End of: Define the oContact get subhandler function.  




// Export the module
module.exports = oContact;


