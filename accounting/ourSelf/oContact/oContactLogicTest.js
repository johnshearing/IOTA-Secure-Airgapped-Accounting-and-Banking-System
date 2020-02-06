
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
              'b55mf7oknxi36wzqui0q' + '\n' +
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
          'ic6ojzwp5tlyi31gv1eq' + '\n' +
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
      '567hlik703s2etncx835' + '\n' +
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
              '3d43i9gddk7plepxt9gg' + '\n' +
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
          '7nun5i74npovij69zuoy' + '\n' +
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
      '8skcfkn6r7tjjcdpn6e6' + '\n' +
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
              'f07pmx6ps57vbwrsjzxk' + '\n' +
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
          'z9787c7upgw5zb39t23e' + '\n' +
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
      '66pic29h2wapvi9py97b' + '\n' +
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
      'ayajtgh5ryw7n94znosv' + '\n' +
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
          'opv42nbdpw1oi1527jiv' + '\n' +
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
      oContactObject.oContactId = nextIdObject.nextId;

      oContactObject.oContact = {};
      oContactObject.oContact.properties = {};
      oContactObject.oContact.properties.firstName = oContact_properties_firstName;
      oContactObject.oContact.properties.lastName = oContact_properties_lastName;
      oContactObject.oContact.properties.email = oContact_properties_email;

      oContactObject.oContact.properties.phone = {};
      oContactObject.oContact.properties.phone.properties = {};

      oContactObject.oContact.properties.phone.properties.phone1 = {};
      oContactObject.oContact.properties.phone.properties.phone1.properties = {};
      oContactObject.oContact.properties.phone.properties.phone1.properties.phoneType = oContact_properties_phone_properties_phone1_properties_phoneType;
      oContactObject.oContact.properties.phone.properties.phone1.properties.phone = oContact_properties_phone_properties_phone1_properties_phone;

      oContactObject.oContact.properties.address = {};
      oContactObject.oContact.properties.address.properties = {};

      oContactObject.oContact.properties.address.properties.address1 = {};
      oContactObject.oContact.properties.address.properties.address1.properties = {};
      oContactObject.oContact.properties.address.properties.address1.properties.addressType = oContact_properties_address_properties_address1_properties_addressType;
      oContactObject.oContact.properties.address.properties.address1.properties.street1 = oContact_properties_address_properties_address1_properties_street1;
      oContactObject.oContact.properties.address.properties.address1.properties.street2 = oContact_properties_address_properties_address1_properties_street2;
      oContactObject.oContact.properties.address.properties.address1.properties.city = oContact_properties_address_properties_address1_properties_city;
      oContactObject.oContact.properties.address.properties.address1.properties.state = oContact_properties_address_properties_address1_properties_state;
      oContactObject.oContact.properties.address.properties.address1.properties.zip = oContact_properties_address_properties_address1_properties_zip;
      
      oContactObject.timeStamp = Date.now();
      oContactdeleted = false;

      // Create the logObject.
      // This object will be written to history.json which maintains a history of 
      // all changes to all tables in the database.
      var logObject =
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
              'xmn3gk7optt2prxp37md' + '\n' +
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
                    'cgt6v43iiwc0lyselnj1' + '\n' +
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
                't78qxbutlw8ngkus5sxs' + '\n' +
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
                            'z1uf65s0w85qv260rdie' + '\n' +
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
                            'sg5a3b5rytx7fsh31080' + '\n' +
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
                      '4no9aj6gd5qzjlpc70an' + '\n' +
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




