
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
              'y8vsmxw92kfwoeqkins1' + '\n' +
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
          'enzy9irqlze4ybkwsza1' + '\n' +
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
      '6dnxj5ji88n2kt53lvof' + '\n' +
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
              'sxtj7sj0dj0rme8vjrd0' + '\n' +
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
          'svyv0x7phhcan6sd6e1w' + '\n' +
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
      '4bn4mzrx5iv1a5z74n53' + '\n' +
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
              'am0axuvt5tn4zoajhr6i' + '\n' +
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
          'y8gu72cpnnro3zi0f1lb' + '\n' +
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
      '4f9n6oa06pnudstk473w' + '\n' +
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
      'ppjzktjrebtsvjfai0wr' + '\n' +
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
  // Get firstName from payload
  let firstName = data.payload["firstName"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(firstName) != 'string'){return callback(400, {'Error' : 'firstName must be of datatype string'});}
  if(!firstName || firstName.trim().length === 0){return callback(400, {'Error' : 'No firstName was entered'});}else{firstName = firstName.trim()}

  // Get lastName from payload
  let lastName = data.payload["lastName"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(lastName) != 'string'){return callback(400, {'Error' : 'lastName must be of datatype string'});}
  if(!lastName || lastName.trim().length === 0){return callback(400, {'Error' : 'No lastName was entered'});}else{lastName = lastName.trim()}

  // Get email from payload
  let email = data.payload["email"];

  // passIfString Default behavior from meta.js at qif5xwvzgr7efln9xtr8
  if(typeof(email) != 'string'){return callback(400, {'Error' : 'email must be of datatype string'});}

  // passIfNotEmpty Default behavior from meta.js at eojwivwlhxkm1b837n2o
  if(!email || email.trim().length === 0){return callback(400, {'Error' : 'No email was entered'});}else{email = email.trim()}

  // passIfHasAmpersand
  // Behavior from data dictionary at het5z3uuzgy5hmyjmsxk 
  if(email.indexOf("@") === -1){return callback(400, {'Error' : 'Not a valid email'});}

  // Get phone_properties_phone1_properties_phoneType from payload
  let phone_properties_phone1_properties_phoneType = data.payload["phone_properties_phone1_properties_phoneType"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(phone_properties_phone1_properties_phoneType) != 'string'){return callback(400, {'Error' : 'phone_properties_phone1_properties_phoneType must be of datatype string'});}
  if(!phone_properties_phone1_properties_phoneType || phone_properties_phone1_properties_phoneType.trim().length === 0){return callback(400, {'Error' : 'No phone_properties_phone1_properties_phoneType was entered'});}else{phone_properties_phone1_properties_phoneType = phone_properties_phone1_properties_phoneType.trim()}

  // Get phone_properties_phone1_properties_phone from payload
  let phone_properties_phone1_properties_phone = data.payload["phone_properties_phone1_properties_phone"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(phone_properties_phone1_properties_phone) != 'string'){return callback(400, {'Error' : 'phone_properties_phone1_properties_phone must be of datatype string'});}
  if(!phone_properties_phone1_properties_phone || phone_properties_phone1_properties_phone.trim().length === 0){return callback(400, {'Error' : 'No phone_properties_phone1_properties_phone was entered'});}else{phone_properties_phone1_properties_phone = phone_properties_phone1_properties_phone.trim()}

  // Get address_properties_address1_properties_addressType from payload
  let address_properties_address1_properties_addressType = data.payload["address_properties_address1_properties_addressType"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(address_properties_address1_properties_addressType) != 'string'){return callback(400, {'Error' : 'address_properties_address1_properties_addressType must be of datatype string'});}
  if(!address_properties_address1_properties_addressType || address_properties_address1_properties_addressType.trim().length === 0){return callback(400, {'Error' : 'No address_properties_address1_properties_addressType was entered'});}else{address_properties_address1_properties_addressType = address_properties_address1_properties_addressType.trim()}

  // Get address_properties_address1_properties_street1 from payload
  let address_properties_address1_properties_street1 = data.payload["address_properties_address1_properties_street1"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(address_properties_address1_properties_street1) != 'string'){return callback(400, {'Error' : 'address_properties_address1_properties_street1 must be of datatype string'});}
  if(!address_properties_address1_properties_street1 || address_properties_address1_properties_street1.trim().length === 0){return callback(400, {'Error' : 'No address_properties_address1_properties_street1 was entered'});}else{address_properties_address1_properties_street1 = address_properties_address1_properties_street1.trim()}

  // Get address_properties_address1_properties_street2 from payload
  let address_properties_address1_properties_street2 = data.payload["address_properties_address1_properties_street2"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(address_properties_address1_properties_street2) != 'string'){return callback(400, {'Error' : 'address_properties_address1_properties_street2 must be of datatype string'});}
  if(!address_properties_address1_properties_street2 || address_properties_address1_properties_street2.trim().length === 0){return callback(400, {'Error' : 'No address_properties_address1_properties_street2 was entered'});}else{address_properties_address1_properties_street2 = address_properties_address1_properties_street2.trim()}

  // Get address_properties_address1_properties_city from payload
  let address_properties_address1_properties_city = data.payload["address_properties_address1_properties_city"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(address_properties_address1_properties_city) != 'string'){return callback(400, {'Error' : 'address_properties_address1_properties_city must be of datatype string'});}
  if(!address_properties_address1_properties_city || address_properties_address1_properties_city.trim().length === 0){return callback(400, {'Error' : 'No address_properties_address1_properties_city was entered'});}else{address_properties_address1_properties_city = address_properties_address1_properties_city.trim()}

  // Get address_properties_address1_properties_state from payload
  let address_properties_address1_properties_state = data.payload["address_properties_address1_properties_state"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(address_properties_address1_properties_state) != 'string'){return callback(400, {'Error' : 'address_properties_address1_properties_state must be of datatype string'});}
  if(!address_properties_address1_properties_state || address_properties_address1_properties_state.trim().length === 0){return callback(400, {'Error' : 'No address_properties_address1_properties_state was entered'});}else{address_properties_address1_properties_state = address_properties_address1_properties_state.trim()}

  // Get address_properties_address1_properties_zip from payload
  let address_properties_address1_properties_zip = data.payload["address_properties_address1_properties_zip"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(address_properties_address1_properties_zip) != 'string'){return callback(400, {'Error' : 'address_properties_address1_properties_zip must be of datatype string'});}
  if(!address_properties_address1_properties_zip || address_properties_address1_properties_zip.trim().length === 0){return callback(400, {'Error' : 'No address_properties_address1_properties_zip was entered'});}else{address_properties_address1_properties_zip = address_properties_address1_properties_zip.trim()}


  // Enforcing uniqueness of the email field.
  // Will toggle this to false if we find the email already exists in oContact.
  // Behavior from meta.js at rmkfkaef7xo3gyvnvgm4
  let email_IsUnused = true;  

  // Using this to track the primary key of a record that we might encounter with the candidate email.
  // If we encounter this primary key again we will check to see if the email has been changed.
  // If it has then the candidate email will be marked as available again.
  let uniqueIdOfRecordHoldingCandidate_Email = false; 
                        

  // To ensure the email is unique we will read every record in 
  // oContact and compare with the email provided.

  // This function sets up a stream where each chunk of data is a complete line in the oContact file.
  let readInterface = readline.createInterface
  (
    { // specify the file to be read.
      input: fs.createReadStream(_data.baseDir + '/ourSelf/oContact' + '/' + 'oContact' + '.json')
    }
  );
  
  // Look at each record in the file and set a flag if the email matches the email provided by the user.
  readInterface.on('line', function(line) 
  {
    // Convert the JSON string from oContact into an object.
    lineObject = JSON.parse(line);

    // Several different record sets with the supplied email and the same oContactId 
    // may exist already if the record has been changed or deleted prior to this operation.

    // A modified record is simply a new record with the same oContactId as an existing record.
    // The newest record is the valid record and the older record is history.  
    // So position matters. These tables should never be sorted.
    // These tables can be packed however to get rid of historical records.

    // The transaction log also maintains the history and the current state of the entire database.
    // So the transaction log can be used to check the integrity of the every table.
    // No records in the transaction log should be removed.

    // A deleted record in this system is simply an identical record appended with 
    // the deleted field set to true. 
    // So depending on how many times the email has been added and deleted there may 
    // be several sets of records in the oContact table currently 
    // that have the same email and the same oContactId.
    // The table can be packed occasionally to get rid of these deleted record sets. 
    // Deletes are handled as appends with the deleted field set to true because real 
    // deletes tie up the table for a long time.

    // In this table, the email is a unique key as well as the oContactId.
    // The oContactId also serves as the primary key.
    // The difference is that the oContactId may never change whereas the email
    // may be changed to something different if a valid record for that email
    // does not already exist.    

    // When adding a record we first make sure that the record does NOT already exist.
    // There should be no record with the current email or if there is then 
    // the last record with this email must have the deleted field set to true.

    // When changing a record we:
    // 1. Make sure that the record with this email does indeed exist and...
    // 2. that the last instance of a record with this email is not deleted.
  
    // It is ok to add a new record with this same email again when the last instance 
    // of this record encountered in the stream has the deleted flag set to true. 
    // In that case, the oContactId will be different but the email will be the same.         

    // As explained above, only the last matching record for a particular email matters.
    // It's like that old game "She loves me, She loves me not".

    if (email == lineObject.email) // we found a matching entry
    {
      if (lineObject.deleted == false) // The record has not been deleted so it's a duplicate. Not unique.
      {
        email_IsUnused = false; // This flag used in the on close event listener below. 

        // If this record (record with this primary key) is encountered further down where it has been deleted 
        // or where the email has been changed with a put operation:
        // Then the candidate email will be available again as we continue searching through the records.
        // We are already checking if this email becomes available again by deletion.
        // Now we need to check if the email becomes available because the record with this primary 
        // key gets changed with a new email.
        // That will make the candidate email unique and available again.
        // So record this global sequential unique id (the oContactId in this case).
        // If we find the gsuid again, then check if the email has changed.
        // If it has been changed then:
        // 1. Set the email_IsUnused flag to true again
        // 2. clear out the variable tracking the uniqueId of the record.
        uniqueIdOfRecordHoldingCandidate_Email = lineObject.oContactId;
      }
      // The matching record we found has been deleted so it may as well not exist. The new record is still unique.
      else 
      {
        email_IsUnused = true;
      } 
    } // End of: if we found a matching entry

    // If we have seen this primary key before and flagged the email already taken 
    // because it was identical to the email we are trying to add and it had not been deleted:

    // Ok, the current record is not holding the candidate email but 
    // maybe it was in the past and someone changed it.
    // if the candidate email is flagged unavailable and we are looking at the record that was flagged:
    else if(email_IsUnused === false && uniqueIdOfRecordHoldingCandidate_Email === lineObject.oContactId)
    {
      // Check if the email is no longer holding the candidate email.
      // If it is not holding the candidate email then flag the email 
      // available again and clear out the variable tracking this primary key.
      email_IsUnused = true;
      uniqueIdOfRecordHoldingCandidate_Email = false;
    }

  }); // End of: readInterface.on('line', function(line){...}
  // End of: Look at each record...




  // This listener fires after we have discovered if the email is 
  // unique or not, and have then closed the readable stream from oContact.
  // The callback function defined here will append the record if the email 
  // was found to be unique.
  // Behavior from meta.js at aiwaoocd1uegzjbqeydk
  readInterface.on('close', function() 
  {
    // If the email already exists then exit this process without appending the record.
    if (!email_IsUnused) 
    {      
      helpers.log
      (
        5,
        'i9k3e2yz91rx9mb8skv0' + '\n' +
        'The email : ' + email + ' already exists' + '\n'                                  
      ); // End of: helpers.log(...)

      return callback(400, {'Error' : 'The email already exists'});
    }

    // If we made it to this point then the candidate email is unique so continue on with the append opperation.
    // Behavior from meta.js at gwwelr17hmxvq4spdrcl
    
    // Code from the data dictionary marked postHandlerPreprocessing, if any, will be inserted below.

    // Behavior from Data Dictionary at 2ho18ynd4agk4beilhnf
          
          
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
          '0y4r2spf2v4s6rt32kgz' + '\n' +
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

      oContactObject.firstName = firstName;
      oContactObject.lastName = lastName;
      oContactObject.fullName = undefined;
      oContactObject.email = email;

      oContactObject.phone = {};
      oContactObject.phone.properties = {};

      oContactObject.phone.properties.phone1 = {};
      oContactObject.phone.properties.phone1.properties = {};
      oContactObject.phone.properties.phone1.properties.phoneType = phone_properties_phone1_properties_phoneType;
      oContactObject.phone.properties.phone1.properties.phone = phone_properties_phone1_properties_phone;

      oContactObject.address = {};
      oContactObject.address.properties = {};

      oContactObject.address.properties.address1 = {};
      oContactObject.address.properties.address1.properties = {};
      oContactObject.address.properties.address1.properties.addressType = address_properties_address1_properties_addressType;
      oContactObject.address.properties.address1.properties.street1 = address_properties_address1_properties_street1;
      oContactObject.address.properties.address1.properties.street2 = address_properties_address1_properties_street2;
      oContactObject.address.properties.address1.properties.city = address_properties_address1_properties_city;
      oContactObject.address.properties.address1.properties.state = address_properties_address1_properties_state;
      oContactObject.address.properties.address1.properties.zip = address_properties_address1_properties_zip;
      
      oContactObject.timeStamp = Date.now();
      oContactObject.deleted = false;

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
              'qyngwdvoo10luyecr0rt' + '\n' +
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
                    'fnntxzw75cypbnnrmtv3' + '\n' +
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
                '9cfpv7e99wr4mijx4m3f' + '\n' +
                'There was an error when appending to the oContact file.' + '\n' +
                'The following record may or may not have been appended to the oContact file:' + '\n' +                            
                JSON.stringify(logObject) + '\n' +
                'Attempting to rollback the entry.' + '\n' +    
                'The following was the error message:' + '\n' +                                             
                err + '\n'            
              );

              // Assemble rollback record for the oContact file which will negate previous entry if any.                 
              oContactObject.timeStamp = Date.now();
              oContactObject.deleted = true;

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
                            'yczo195y9m6xkfshjnx1' + '\n' +
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
                            'tsl409uhoabspg4twbyv' + '\n' +
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
                      'b03cohx4ju4wyhlr3qx7' + '\n' +
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
  }); // End of: readInterface.on('close', function(){...}
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

  // Get firstName from payload
  let firstName = data.payload.firstName;

  // passIfString&NotEmptyThenTrim
  // Default behavior from meta.js at yif5xwczgr4ebln99trd 
  // If firstName is of string type and is not empty 
  if (typeof(firstName) === 'string' && firstName.trim().length > 0) 
  { 
    // The user entered something in the edit form
    firstName = firstName.trim()
  } 
  // Else, the user may have entered some other datatype like a number or 
  // perhaps nothing at all if using the Delete form. 
  else 
  { 
    // If the user entered nothing: 
    if(firstName === undefined) 
    { 
      // Then user is likely trying to delete a record.
      // So change the value to false and continue processing.
      firstName = false 
    } 
    else // The user entered something invalid so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid firstName'}); 
    } 
  }
  
  // Get lastName from payload
  let lastName = data.payload.lastName;

  // passIfString&NotEmptyThenTrim
  // Default behavior from meta.js at yif5xwczgr4ebln99trd 
  // If lastName is of string type and is not empty 
  if (typeof(lastName) === 'string' && lastName.trim().length > 0) 
  { 
    // The user entered something in the edit form
    lastName = lastName.trim()
  } 
  // Else, the user may have entered some other datatype like a number or 
  // perhaps nothing at all if using the Delete form. 
  else 
  { 
    // If the user entered nothing: 
    if(lastName === undefined) 
    { 
      // Then user is likely trying to delete a record.
      // So change the value to false and continue processing.
      lastName = false 
    } 
    else // The user entered something invalid so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid lastName'}); 
    } 
  }
  
  // Get email from payload
  let email = data.payload.email;

  // stringTypeTrimAmpersand
  // Behavior from data dictionary at ug5jtmcsk7od74wkr9vt 
  // If email is of string type and is not empty 
  if (typeof(email) === 'string' && email.trim().length > 0) 
  { 
    // The user entered something in the edit form so check for an ampersand. 
    if(email.indexOf('@') != -1) 
    { 
      // pass if ampersand 
      email = email.trim() 
    } 
    else // No ampersand so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid email'}); 
    } 
  } 
  // Else, the user may have entered some other datatype like a number or 
  // perhaps nothing at all if using the Delete form or the Password form. 
  else 
  { 
    // If the user entered nothing: 
    if(email === undefined) 
    { 
      // Then user is trying to delete a record or change the password 
      email = false 
    } 
    else // The user entered something invalid so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid email'}); 
    } 
  }

  // Get phone_properties_phone1_properties_phoneType from payload
  let phone_properties_phone1_properties_phoneType = data.payload.phone_properties_phone1_properties_phoneType;

  // passIfString&NotEmptyThenTrim
  // Default behavior from meta.js at yif5xwczgr4ebln99trd 
  // If phone_properties_phone1_properties_phoneType is of string type and is not empty 
  if (typeof(phone_properties_phone1_properties_phoneType) === 'string' && phone_properties_phone1_properties_phoneType.trim().length > 0) 
  { 
    // The user entered something in the edit form
    phone_properties_phone1_properties_phoneType = phone_properties_phone1_properties_phoneType.trim()
  } 
  // Else, the user may have entered some other datatype like a number or 
  // perhaps nothing at all if using the Delete form. 
  else 
  { 
    // If the user entered nothing: 
    if(phone_properties_phone1_properties_phoneType === undefined) 
    { 
      // Then user is likely trying to delete a record.
      // So change the value to false and continue processing.
      phone_properties_phone1_properties_phoneType = false 
    } 
    else // The user entered something invalid so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid phone_properties_phone1_properties_phoneType'}); 
    } 
  }
  
  // Get phone_properties_phone1_properties_phone from payload
  let phone_properties_phone1_properties_phone = data.payload.phone_properties_phone1_properties_phone;

  // passIfString&NotEmptyThenTrim
  // Default behavior from meta.js at yif5xwczgr4ebln99trd 
  // If phone_properties_phone1_properties_phone is of string type and is not empty 
  if (typeof(phone_properties_phone1_properties_phone) === 'string' && phone_properties_phone1_properties_phone.trim().length > 0) 
  { 
    // The user entered something in the edit form
    phone_properties_phone1_properties_phone = phone_properties_phone1_properties_phone.trim()
  } 
  // Else, the user may have entered some other datatype like a number or 
  // perhaps nothing at all if using the Delete form. 
  else 
  { 
    // If the user entered nothing: 
    if(phone_properties_phone1_properties_phone === undefined) 
    { 
      // Then user is likely trying to delete a record.
      // So change the value to false and continue processing.
      phone_properties_phone1_properties_phone = false 
    } 
    else // The user entered something invalid so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid phone_properties_phone1_properties_phone'}); 
    } 
  }
  
  // Get address_properties_address1_properties_addressType from payload
  let address_properties_address1_properties_addressType = data.payload.address_properties_address1_properties_addressType;

  // passIfString&NotEmptyThenTrim
  // Default behavior from meta.js at yif5xwczgr4ebln99trd 
  // If address_properties_address1_properties_addressType is of string type and is not empty 
  if (typeof(address_properties_address1_properties_addressType) === 'string' && address_properties_address1_properties_addressType.trim().length > 0) 
  { 
    // The user entered something in the edit form
    address_properties_address1_properties_addressType = address_properties_address1_properties_addressType.trim()
  } 
  // Else, the user may have entered some other datatype like a number or 
  // perhaps nothing at all if using the Delete form. 
  else 
  { 
    // If the user entered nothing: 
    if(address_properties_address1_properties_addressType === undefined) 
    { 
      // Then user is likely trying to delete a record.
      // So change the value to false and continue processing.
      address_properties_address1_properties_addressType = false 
    } 
    else // The user entered something invalid so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid address_properties_address1_properties_addressType'}); 
    } 
  }
  
  // Get address_properties_address1_properties_street1 from payload
  let address_properties_address1_properties_street1 = data.payload.address_properties_address1_properties_street1;

  // passIfString&NotEmptyThenTrim
  // Default behavior from meta.js at yif5xwczgr4ebln99trd 
  // If address_properties_address1_properties_street1 is of string type and is not empty 
  if (typeof(address_properties_address1_properties_street1) === 'string' && address_properties_address1_properties_street1.trim().length > 0) 
  { 
    // The user entered something in the edit form
    address_properties_address1_properties_street1 = address_properties_address1_properties_street1.trim()
  } 
  // Else, the user may have entered some other datatype like a number or 
  // perhaps nothing at all if using the Delete form. 
  else 
  { 
    // If the user entered nothing: 
    if(address_properties_address1_properties_street1 === undefined) 
    { 
      // Then user is likely trying to delete a record.
      // So change the value to false and continue processing.
      address_properties_address1_properties_street1 = false 
    } 
    else // The user entered something invalid so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid address_properties_address1_properties_street1'}); 
    } 
  }
  
  // Get address_properties_address1_properties_street2 from payload
  let address_properties_address1_properties_street2 = data.payload.address_properties_address1_properties_street2;

  // passIfString&NotEmptyThenTrim
  // Default behavior from meta.js at yif5xwczgr4ebln99trd 
  // If address_properties_address1_properties_street2 is of string type and is not empty 
  if (typeof(address_properties_address1_properties_street2) === 'string' && address_properties_address1_properties_street2.trim().length > 0) 
  { 
    // The user entered something in the edit form
    address_properties_address1_properties_street2 = address_properties_address1_properties_street2.trim()
  } 
  // Else, the user may have entered some other datatype like a number or 
  // perhaps nothing at all if using the Delete form. 
  else 
  { 
    // If the user entered nothing: 
    if(address_properties_address1_properties_street2 === undefined) 
    { 
      // Then user is likely trying to delete a record.
      // So change the value to false and continue processing.
      address_properties_address1_properties_street2 = false 
    } 
    else // The user entered something invalid so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid address_properties_address1_properties_street2'}); 
    } 
  }
  
  // Get address_properties_address1_properties_city from payload
  let address_properties_address1_properties_city = data.payload.address_properties_address1_properties_city;

  // passIfString&NotEmptyThenTrim
  // Default behavior from meta.js at yif5xwczgr4ebln99trd 
  // If address_properties_address1_properties_city is of string type and is not empty 
  if (typeof(address_properties_address1_properties_city) === 'string' && address_properties_address1_properties_city.trim().length > 0) 
  { 
    // The user entered something in the edit form
    address_properties_address1_properties_city = address_properties_address1_properties_city.trim()
  } 
  // Else, the user may have entered some other datatype like a number or 
  // perhaps nothing at all if using the Delete form. 
  else 
  { 
    // If the user entered nothing: 
    if(address_properties_address1_properties_city === undefined) 
    { 
      // Then user is likely trying to delete a record.
      // So change the value to false and continue processing.
      address_properties_address1_properties_city = false 
    } 
    else // The user entered something invalid so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid address_properties_address1_properties_city'}); 
    } 
  }
  
  // Get address_properties_address1_properties_state from payload
  let address_properties_address1_properties_state = data.payload.address_properties_address1_properties_state;

  // passIfString&NotEmptyThenTrim
  // Default behavior from meta.js at yif5xwczgr4ebln99trd 
  // If address_properties_address1_properties_state is of string type and is not empty 
  if (typeof(address_properties_address1_properties_state) === 'string' && address_properties_address1_properties_state.trim().length > 0) 
  { 
    // The user entered something in the edit form
    address_properties_address1_properties_state = address_properties_address1_properties_state.trim()
  } 
  // Else, the user may have entered some other datatype like a number or 
  // perhaps nothing at all if using the Delete form. 
  else 
  { 
    // If the user entered nothing: 
    if(address_properties_address1_properties_state === undefined) 
    { 
      // Then user is likely trying to delete a record.
      // So change the value to false and continue processing.
      address_properties_address1_properties_state = false 
    } 
    else // The user entered something invalid so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid address_properties_address1_properties_state'}); 
    } 
  }
  
  // Get address_properties_address1_properties_zip from payload
  let address_properties_address1_properties_zip = data.payload.address_properties_address1_properties_zip;

  // passIfString&NotEmptyThenTrim
  // Default behavior from meta.js at yif5xwczgr4ebln99trd 
  // If address_properties_address1_properties_zip is of string type and is not empty 
  if (typeof(address_properties_address1_properties_zip) === 'string' && address_properties_address1_properties_zip.trim().length > 0) 
  { 
    // The user entered something in the edit form
    address_properties_address1_properties_zip = address_properties_address1_properties_zip.trim()
  } 
  // Else, the user may have entered some other datatype like a number or 
  // perhaps nothing at all if using the Delete form. 
  else 
  { 
    // If the user entered nothing: 
    if(address_properties_address1_properties_zip === undefined) 
    { 
      // Then user is likely trying to delete a record.
      // So change the value to false and continue processing.
      address_properties_address1_properties_zip = false 
    } 
    else // The user entered something invalid so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid address_properties_address1_properties_zip'}); 
    } 
  }
  
  // Check if the deleted flag is of type string and that the value is exactly equal to "true".
  // That would mean the user wants to delete the record. Otherwise the users does not want to delete the record.
  // Set deleted to boolean true if validation is passed otherwise set it to false.
  // Behavior from meta.js at ts2g5rn5uw6mvup58vph
  let deleted = typeof(data.payload.deleted) === 'string' && data.payload.deleted === "true" ? true : false;

  
  //if all fields fail validation then exit this process without writing changes to the table.
  if(!firstName && !lastName && !email && !phone.properties.phone1.properties.phoneType && !phone.properties.phone1.properties.phone && !address.properties.address1.properties.addressType && !address.properties.address1.properties.street1 && !address.properties.address1.properties.street2 && !address.properties.address1.properties.city && !address.properties.address1.properties.state && !address.properties.address1.properties.zip && !deleted)
  {
    helpers.log
    (
      5,
      'xvdn91kd3mnt45o86ftx' + '\n' +
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
        'izujc68kic1iu1z9cofv' + '\n' +
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
    // This is to establish the order in which the fields will be written to the table. 
    // Behavior from 3bd1sa5ve4aqrfspunrt in meta.js         
    let oContactObject = {};
    oContactObject.oContactId = oContactId;

    oContactObject.firstName = firstName;
    oContactObject.lastName = lastName;
    oContactObject.fullName = undefined;
    oContactObject.email = email;

    oContactObject.phone = {};
    oContactObject.phone.properties = {};

    oContactObject.phone.properties.phone1 = {};
    oContactObject.phone.properties.phone1.properties = {};
    oContactObject.phone.properties.phone1.properties.phoneType = phone_properties_phone1_properties_phoneType;
    oContactObject.phone.properties.phone1.properties.phone = phone_properties_phone1_properties_phone;

    oContactObject.address = {};
    oContactObject.address.properties = {};

    oContactObject.address.properties.address1 = {};
    oContactObject.address.properties.address1.properties = {};
    oContactObject.address.properties.address1.properties.addressType = address_properties_address1_properties_addressType;
    oContactObject.address.properties.address1.properties.street1 = address_properties_address1_properties_street1;
    oContactObject.address.properties.address1.properties.street2 = address_properties_address1_properties_street2;
    oContactObject.address.properties.address1.properties.city = address_properties_address1_properties_city;
    oContactObject.address.properties.address1.properties.state = address_properties_address1_properties_state;
    oContactObject.address.properties.address1.properties.zip = address_properties_address1_properties_zip;
     
    oContactObject.timeStamp = Date.now();
    oContactObject.deleted = false;

    dataObject = {};
    dataObject.uniqueField01Name = "email";
    dataObject.uniqueField01Value = oContactObject.email;
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
                'ypz5nkujclkgrxxd8nmn' + '\n' + 
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
                'ytvr4bgr0tqre42n5bci' + '\n' +
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


        // Preprocessing for firstName
        if(firstName) // If the user supplied data for firstName
        {
          // No preprocessing was specifed for firstName. Use it as was supplied by the user.
        }
        else // If the user did not supply data for firstName
        {
          // Save firstName from the most recent record.
          oContactObject.firstName = recordObject.firstName;
        }

        // Preprocessing for lastName
        if(lastName) // If the user supplied data for lastName
        {
          // No preprocessing was specifed for lastName. Use it as was supplied by the user.
        }
        else // If the user did not supply data for lastName
        {
          // Save lastName from the most recent record.
          oContactObject.lastName = recordObject.lastName;
        }

        // Preprocessing for fullName
        // Behavior from data dictionary at 4m8yfgakt2w3gwgipr8c
        oContactObject.fullName = oContactObject.firstName + oContactObject.lastName

        // Preprocessing for email
        if(email) // If the user supplied data for email
        {
          // No preprocessing was specifed for email. Use it as was supplied by the user.
        }
        else // If the user did not supply data for email
        {
          // Save email from the most recent record.
          oContactObject.email = recordObject.email;
        }

        // Preprocessing for phone.properties.phone1.properties.phoneType
        if(phone_properties_phone1_properties_phoneType) // If the user supplied data for phone.properties.phone1.properties.phoneType
        {
          // No preprocessing was specifed for phone.properties.phone1.properties.phoneType. Use it as was supplied by the user.
        }
        else // If the user did not supply data for phone.properties.phone1.properties.phoneType
        {
          // Save phone.properties.phone1.properties.phoneType from the most recent record.
          oContactObject.phone.properties.phone1.properties.phoneType = recordObject.phone.properties.phone1.properties.phoneType;
        }

        // Preprocessing for phone.properties.phone1.properties.phone
        if(phone_properties_phone1_properties_phone) // If the user supplied data for phone.properties.phone1.properties.phone
        {
          // No preprocessing was specifed for phone.properties.phone1.properties.phone. Use it as was supplied by the user.
        }
        else // If the user did not supply data for phone.properties.phone1.properties.phone
        {
          // Save phone.properties.phone1.properties.phone from the most recent record.
          oContactObject.phone.properties.phone1.properties.phone = recordObject.phone.properties.phone1.properties.phone;
        }

        // Preprocessing for address.properties.address1.properties.addressType
        if(address_properties_address1_properties_addressType) // If the user supplied data for address.properties.address1.properties.addressType
        {
          // No preprocessing was specifed for address.properties.address1.properties.addressType. Use it as was supplied by the user.
        }
        else // If the user did not supply data for address.properties.address1.properties.addressType
        {
          // Save address.properties.address1.properties.addressType from the most recent record.
          oContactObject.address.properties.address1.properties.addressType = recordObject.address.properties.address1.properties.addressType;
        }

        // Preprocessing for address.properties.address1.properties.street1
        if(address_properties_address1_properties_street1) // If the user supplied data for address.properties.address1.properties.street1
        {
          // No preprocessing was specifed for address.properties.address1.properties.street1. Use it as was supplied by the user.
        }
        else // If the user did not supply data for address.properties.address1.properties.street1
        {
          // Save address.properties.address1.properties.street1 from the most recent record.
          oContactObject.address.properties.address1.properties.street1 = recordObject.address.properties.address1.properties.street1;
        }

        // Preprocessing for address.properties.address1.properties.street2
        if(address_properties_address1_properties_street2) // If the user supplied data for address.properties.address1.properties.street2
        {
          // No preprocessing was specifed for address.properties.address1.properties.street2. Use it as was supplied by the user.
        }
        else // If the user did not supply data for address.properties.address1.properties.street2
        {
          // Save address.properties.address1.properties.street2 from the most recent record.
          oContactObject.address.properties.address1.properties.street2 = recordObject.address.properties.address1.properties.street2;
        }

        // Preprocessing for address.properties.address1.properties.city
        if(address_properties_address1_properties_city) // If the user supplied data for address.properties.address1.properties.city
        {
          // No preprocessing was specifed for address.properties.address1.properties.city. Use it as was supplied by the user.
        }
        else // If the user did not supply data for address.properties.address1.properties.city
        {
          // Save address.properties.address1.properties.city from the most recent record.
          oContactObject.address.properties.address1.properties.city = recordObject.address.properties.address1.properties.city;
        }

        // Preprocessing for address.properties.address1.properties.state
        if(address_properties_address1_properties_state) // If the user supplied data for address.properties.address1.properties.state
        {
          // No preprocessing was specifed for address.properties.address1.properties.state. Use it as was supplied by the user.
        }
        else // If the user did not supply data for address.properties.address1.properties.state
        {
          // Save address.properties.address1.properties.state from the most recent record.
          oContactObject.address.properties.address1.properties.state = recordObject.address.properties.address1.properties.state;
        }

        // Preprocessing for address.properties.address1.properties.zip
        if(address_properties_address1_properties_zip) // If the user supplied data for address.properties.address1.properties.zip
        {
          // No preprocessing was specifed for address.properties.address1.properties.zip. Use it as was supplied by the user.
        }
        else // If the user did not supply data for address.properties.address1.properties.zip
        {
          // Save address.properties.address1.properties.zip from the most recent record.
          oContactObject.address.properties.address1.properties.zip = recordObject.address.properties.address1.properties.zip;
        }

        // If we are appending a delete make sure that everything else is coming from the most recent saved record.
        if(deleted)
        {
          oContactObject.firstName = recordObject.firstName;
          oContactObject.lastName = recordObject.lastName;
          oContactObject.fullName = recordObject.fullName;
          oContactObject.email = recordObject.email;
          oContactObject.phone = recordObject.phone;
          oContactObject.address = recordObject.address;
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
                          '7jiqd0505hel47ox7mbl' + '\n' +
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
                      'j7bo8vcqd75tlpr64dys' + '\n' +
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
                        "firstName" : recordObject.firstName,
                        "lastName" : recordObject.lastName,
                        "fullName" : recordObject.fullName,
                        "email" : recordObject.email,
                        "phone" : recordObject.phone,
                        "address" : recordObject.address,
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
                                  '20frf8ckhu6448yfxmro' + '\n' +
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
                                  '5b99g8duxkdpddpsr8pz' + '\n' +
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
                            'bn5qh3lehq80va65m8wu' + '\n' +
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
                'xhi0wovwagz1uneepdq6' + '\n' +
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
              'n5ko01e66h251tfzejr1' + '\n' + 
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
      // Remove the fullName key/value pair from the lineValueObject before returning it to the requester.
      delete lineValueObject.fullName;

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


