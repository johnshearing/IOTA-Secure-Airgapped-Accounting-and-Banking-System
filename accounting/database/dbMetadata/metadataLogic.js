/*
/ Handlers for the "metadata" table.
/ This program was built by meta.js starting at yx52pvsi0kn9p5o46hrq
/ Any changes made to this program will be overwritten next time the application is generated.
/ Make your changes in the generator meta.js or in the data dictionary metadata.json
*/

"use strict";

// Dependencies
const fs = require('fs');
const readline = require('readline');
const { pipeline, Readable, Writable } = require('stream');
const StringDecoder = require('string_decoder').StringDecoder;
const _data = require('../../../lib/aData');
const helpers = require('../../../lib/aHelpers');


// Create a container for all the handlers
let metadata = {};




// Define the handler function that serves up the HTML page for searching and listing metadata records.
// Behavior from meta.js at gg9ec14lo9rqjk7kxz7f
metadata.serveListPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : 'Metadata List',
      'body.class' : 'metadataList',     
      'tableName':'metadata',
      "tableLabel":"Metadata",    
      'head.clientCode' : '', // The HTML header template must see something or an empty string.         
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/database/dbMetadata/metadataList', templateData, function(errorGetTemplate, str)
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
              'ymacvgwu482l0zvcd0e6' + '\n' +
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
          '8dapzbeevlsr60jeq2d2' + '\n' +
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
      'abog0ns1rxrgyw452cr9' + '\n' +
      'Method not get. Only gets allowed.' + '\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: metadata.serveListPage = function(data, callback){...}
// End of:// Define the handler function that serves up the HTML page for searching and listing metadata records.




// Define the handler function that serves up the HTML page for creating new metadata records.
// Behavior from meta.js at xenz5eipqot8nym0eev3
metadata.serveAddPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : 'Create a New Metadata',
      'head.description' : 'For creating a new metadata record',
      'body.class' : 'metadataAdd', 
      'head.clientCode' : '', // The HTML header template must see something or an empty string.      
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/database/dbMetadata/metadataAdd', templateData, function(errorGetTemplate, str)
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
              'lpev7ynf2b46sdkdg058' + '\n' +
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
          'd6xh4fjglimgwvf202g0' + '\n' +
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
      'grjwixs7sw0unhv7ygvh' + '\n' +
      'Method not get. Only gets allowed.' + '\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: metadata.serveAddPage = function(data, callback){...}
// End of: Define the handler function that serves up the HTML page for creating new metadata records.




// Define the handler function that serves up the HTML page for editing metadata records.
// Behavior from meta.js at 2a4tb24fsq3de66ti8c4
metadata.serveEditPage = function(data, callback)
{
  // Reject any request that isn't a get
  if(data.method == 'get')
  {
    // The following values will be inserted into the webpage at the corresponding key locations in the templates.
    var templateData = 
    {
      'head.title' : 'Edit a Metadata',     
      'body.class' : 'metadataEdit',
      'selected.metadataId' : data.queryStringObject.metadataId,  
      'head.clientCode' : '', // The HTML header template must see something or an empty string.     
    };

    // Read in a template as a string
    helpers.getTemplate('../accounting/database/dbMetadata/metadataEdit', templateData, function(errorGetTemplate, str)
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
              'i24411b9bdwrujmzpsn1' + '\n' +
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
          'a4z1ycjkyhxa1nqtoctk' + '\n' +
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
      'fz99lsl61k5i538ecc5t' + '\n' +
      'Method not get. Only gets allowed.' + '\n'
    );

    // Send back status code for Not Allowed, an undefined payload, and contentType of html,
    callback(405, undefined, 'html');
  } // End of: else method not a get  
}; // End of: metadata.serveEditPage = function(data, callback){...}
// End of: Define the handler function that serves up the HTML page for editing metadata records.




// Router for metadata functions
// Define a function which calls the requested get, post, put, or delete subhandler function for metadata 
// and passes to the chosen subhandler the client's request object and the callback function.
// Behavior from meta.js at lw39etuyhw7wb82hv9ct
metadata.metadata = function(data, callback)
{
  // Create an array of acceptable methods.
  var acceptableMethods = ['post', 'get', 'put'];

  // if the requested method is one of the acceptable methods:
  if (acceptableMethods.indexOf(data.method) > -1) 
  {
    // then call the appropriate metadata subhandler.
    metadata._metadata[data.method](data, callback);
  } 
  // Otherwise the method was not one of the acceptable methods:
  else 
  {
    helpers.log
    (
      5,
      'zenbk4adbfd5cdh42mkn' + '\n' +
      'The method was not one of the acceptable methods' + '\n'
    ); 

    // so send back status 405 (Not Allowed).
    callback(405);
  }
}; // End of: metadata.metadata = function(data, callback){...}
//End of: Router for metadata functions




// Create a subobject within the handlers object for the metadata submethods (post, get, put, and delete)
metadata._metadata = {};




// metadata - post subhandler
// Define the metadata post subhandler function.
// This function appends a record to the metadata file.
// Behavior from meta.js at 1723qxikk1l3ru0vfrny 
metadata._metadata.post = function(data, callback)
{
  // Field validation starts here.
  // Get tableName from payload
  let tableName = data.payload["tableName"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(tableName) != 'string'){return callback(400, {'Error' : 'tableName must be of datatype string'});}
  if(!tableName || tableName.trim().length === 0){return callback(400, {'Error' : 'No tableName was entered'});}else{tableName = tableName.trim()}

  // Get directory from payload
  let directory = data.payload["directory"];

  // passIfString&NotEmptyThenTrim Default behavior from meta.js at ulg5xxvzgr7efln9xur9
  if(typeof(directory) != 'string'){return callback(400, {'Error' : 'directory must be of datatype string'});}
  if(!directory || directory.trim().length === 0){return callback(400, {'Error' : 'No directory was entered'});}else{directory = directory.trim()}

  // Get addRoutes from payload
  let addRoutes = data.payload["addRoutes"];

  // Behavior from meta.js at ettt3o23onrmd04b94jq
  if(typeof(addRoutes) != 'string')
  {
    return callback(400, {'Error' : 'addRoutes must be of datatype string'});
  }
  
  if
  (
      addRoutes !== "yes"
      && addRoutes !== "no"
    
  )
  {
    return callback(400, {'Error' : 'No addRoutes was selected from menu'});
  }
  else
  {
    addRoutes = addRoutes.trim()
  }

  // Get allowCodeGeneration from payload
  let allowCodeGeneration = data.payload["allowCodeGeneration"];

  // Behavior from meta.js at ettt3o23onrmd04b94jq
  if(typeof(allowCodeGeneration) != 'string')
  {
    return callback(400, {'Error' : 'allowCodeGeneration must be of datatype string'});
  }
  
  if
  (
      allowCodeGeneration !== "yes"
      && allowCodeGeneration !== "no"
    
  )
  {
    return callback(400, {'Error' : 'No allowCodeGeneration was selected from menu'});
  }
  else
  {
    allowCodeGeneration = allowCodeGeneration.trim()
  }


  // Start of: Load the dataTypeArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let dataTypeKeyArray = ["field", "dataType"]

  let dataTypeArray = loadPayloadArray(dataTypeKeyArray, data.payload);
  // End of: Load the dataTypeArray dynamically once the payload is known. 
  
  // Start of: Validate elements in the dataTypeArray
  // passMenuItemsOnly
  // Behavior from meta.js at 69nq4ck9lcdakwpb58o6
  dataTypeArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string')
    {
      return callback(400, {'Error' : 'dataType must be of datatype string'});
    }
  
    if
    (
      arrayElement[1] !== "string"
      && arrayElement[1] !== "object"
    )
    {
      return callback(400, {'Error' : 'dataType does not match menu options'});
    }
  });
  // End of: Validate elements in the dataTypeArray


  // Start of: Load the fieldNameArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let fieldNameKeyArray = ["field", "fieldName"]

  let fieldNameArray = loadPayloadArray(fieldNameKeyArray, data.payload);
  // End of: Load the fieldNameArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the fieldNameArray
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at fkb3ulfqr09ryyc0rb0d
  fieldNameArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'fieldName must be of datatype string'});}
    if(!arrayElement[1] || arrayElement[1].trim().length === 0){return callback(400, {'Error' : 'No fieldName was entered'});}else{arrayElement[1] = arrayElement[1].trim()}
  });
  // End of: Validate elements in the fieldNameArray


  // Start of: Load the uniqueArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let uniqueKeyArray = ["field", "unique"]

  let uniqueArray = loadPayloadArray(uniqueKeyArray, data.payload);
  // End of: Load the uniqueArray dynamically once the payload is known. 
  
  // Start of: Validate elements in the uniqueArray
  // passMenuItemsOnly
  // Behavior from meta.js at 69nq4ck9lcdakwpb58o6
  uniqueArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string')
    {
      return callback(400, {'Error' : 'unique must be of datatype string'});
    }
  
    if
    (
      arrayElement[1] !== "yes"
      && arrayElement[1] !== "no"
    )
    {
      return callback(400, {'Error' : 'unique does not match menu options'});
    }
  });
  // End of: Validate elements in the uniqueArray


  // Start of: Load the publishedArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let publishedKeyArray = ["field", "published"]

  let publishedArray = loadPayloadArray(publishedKeyArray, data.payload);
  // End of: Load the publishedArray dynamically once the payload is known. 
  
  // Start of: Validate elements in the publishedArray
  // passMenuItemsOnly
  // Behavior from meta.js at 69nq4ck9lcdakwpb58o6
  publishedArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string')
    {
      return callback(400, {'Error' : 'published must be of datatype string'});
    }
  
    if
    (
      arrayElement[1] !== "yes"
      && arrayElement[1] !== "no"
    )
    {
      return callback(400, {'Error' : 'published does not match menu options'});
    }
  });
  // End of: Validate elements in the publishedArray


  // Start of: Load the elementNameArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let elementNameKeyArray = ["field", "defaultElement", "elementName"]

  let elementNameArray = loadPayloadArray(elementNameKeyArray, data.payload);
  // End of: Load the elementNameArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the elementNameArray
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at fkb3ulfqr09ryyc0rb0d
  elementNameArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'elementName must be of datatype string'});}
    if(!arrayElement[1] || arrayElement[1].trim().length === 0){return callback(400, {'Error' : 'No elementName was entered'});}else{arrayElement[1] = arrayElement[1].trim()}
  });
  // End of: Validate elements in the elementNameArray


  // Start of: Load the labelTextArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let labelTextKeyArray = ["field", "defaultElement", "labelText"]

  let labelTextArray = loadPayloadArray(labelTextKeyArray, data.payload);
  // End of: Load the labelTextArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the labelTextArray
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at fkb3ulfqr09ryyc0rb0d
  labelTextArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'labelText must be of datatype string'});}
    if(!arrayElement[1] || arrayElement[1].trim().length === 0){return callback(400, {'Error' : 'No labelText was entered'});}else{arrayElement[1] = arrayElement[1].trim()}
  });
  // End of: Validate elements in the labelTextArray


  // Start of: Load the elementTypeArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let elementTypeKeyArray = ["field", "defaultElement", "elementType"]

  let elementTypeArray = loadPayloadArray(elementTypeKeyArray, data.payload);
  // End of: Load the elementTypeArray dynamically once the payload is known. 
  
  // Start of: Validate elements in the elementTypeArray
  // passMenuItemsOnly
  // Behavior from meta.js at 69nq4ck9lcdakwpb58o6
  elementTypeArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string')
    {
      return callback(400, {'Error' : 'elementType must be of datatype string'});
    }
  
    if
    (
      arrayElement[1] !== "input"
      && arrayElement[1] !== "select"
    )
    {
      return callback(400, {'Error' : 'elementType does not match menu options'});
    }
  });
  // End of: Validate elements in the elementTypeArray


  // Start of: Load the attributeNameArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let attributeNameKeyArray = ["field", "defaultElement", "attribute", "attributeName"]

  let attributeNameArray = loadPayloadArray(attributeNameKeyArray, data.payload);
  // End of: Load the attributeNameArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the attributeNameArray
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at fkb3ulfqr09ryyc0rb0d
  attributeNameArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'attributeName must be of datatype string'});}
    if(!arrayElement[1] || arrayElement[1].trim().length === 0){return callback(400, {'Error' : 'No attributeName was entered'});}else{arrayElement[1] = arrayElement[1].trim()}
  });
  // End of: Validate elements in the attributeNameArray


  // Start of: Load the attributeValueArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let attributeValueKeyArray = ["field", "defaultElement", "attribute", "attributeValue"]

  let attributeValueArray = loadPayloadArray(attributeValueKeyArray, data.payload);
  // End of: Load the attributeValueArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the attributeValueArray
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at fkb3ulfqr09ryyc0rb0d
  attributeValueArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'attributeValue must be of datatype string'});}
    if(!arrayElement[1] || arrayElement[1].trim().length === 0){return callback(400, {'Error' : 'No attributeValue was entered'});}else{arrayElement[1] = arrayElement[1].trim()}
  });
  // End of: Validate elements in the attributeValueArray


  // Start of: Load the defaultValidationNameArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let defaultValidationNameKeyArray = ["field", "defaultElement", "validation", "default", "defaultValidationName"]

  let defaultValidationNameArray = loadPayloadArray(defaultValidationNameKeyArray, data.payload);
  // End of: Load the defaultValidationNameArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the defaultValidationNameArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  defaultValidationNameArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'defaultValidationName must be of datatype string'});}
  });
  // End of: Validate elements in the defaultValidationNameArray


  // Start of: Load the defaultValidationValueArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let defaultValidationValueKeyArray = ["field", "defaultElement", "validation", "default", "defaultValidationValue"]

  let defaultValidationValueArray = loadPayloadArray(defaultValidationValueKeyArray, data.payload);
  // End of: Load the defaultValidationValueArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the defaultValidationValueArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  defaultValidationValueArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'defaultValidationValue must be of datatype string'});}
  });
  // End of: Validate elements in the defaultValidationValueArray


  // Start of: Load the postValidationNameArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let postValidationNameKeyArray = ["field", "defaultElement", "validation", "post", "postValidationName"]

  let postValidationNameArray = loadPayloadArray(postValidationNameKeyArray, data.payload);
  // End of: Load the postValidationNameArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the postValidationNameArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  postValidationNameArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'postValidationName must be of datatype string'});}
  });
  // End of: Validate elements in the postValidationNameArray


  // Start of: Load the postValidationValueArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let postValidationValueKeyArray = ["field", "defaultElement", "validation", "post", "postValidationValue"]

  let postValidationValueArray = loadPayloadArray(postValidationValueKeyArray, data.payload);
  // End of: Load the postValidationValueArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the postValidationValueArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  postValidationValueArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'postValidationValue must be of datatype string'});}
  });
  // End of: Validate elements in the postValidationValueArray


  // Start of: Load the putValidationNameArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let putValidationNameKeyArray = ["field", "defaultElement", "validation", "put", "putValidationName"]

  let putValidationNameArray = loadPayloadArray(putValidationNameKeyArray, data.payload);
  // End of: Load the putValidationNameArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the putValidationNameArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  putValidationNameArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'putValidationName must be of datatype string'});}
  });
  // End of: Validate elements in the putValidationNameArray


  // Start of: Load the putValidationValueArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let putValidationValueKeyArray = ["field", "defaultElement", "validation", "put", "putValidationValue"]

  let putValidationValueArray = loadPayloadArray(putValidationValueKeyArray, data.payload);
  // End of: Load the putValidationValueArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the putValidationValueArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  putValidationValueArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'putValidationValue must be of datatype string'});}
  });
  // End of: Validate elements in the putValidationValueArray


  // Start of: Load the calculationNameArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let calculationNameKeyArray = ["field", "calculation", "calculationName"]

  let calculationNameArray = loadPayloadArray(calculationNameKeyArray, data.payload);
  // End of: Load the calculationNameArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the calculationNameArray
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at fkb3ulfqr09ryyc0rb0d
  calculationNameArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'calculationName must be of datatype string'});}
    if(!arrayElement[1] || arrayElement[1].trim().length === 0){return callback(400, {'Error' : 'No calculationName was entered'});}else{arrayElement[1] = arrayElement[1].trim()}
  });
  // End of: Validate elements in the calculationNameArray


  // Start of: Load the calculationValueArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let calculationValueKeyArray = ["field", "calculation", "calculationValue"]

  let calculationValueArray = loadPayloadArray(calculationValueKeyArray, data.payload);
  // End of: Load the calculationValueArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the calculationValueArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  calculationValueArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'calculationValue must be of datatype string'});}
  });
  // End of: Validate elements in the calculationValueArray


  // Start of: Load the webPageTypeArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let webPageTypeKeyArray = ["webPage", "webPageType"]

  let webPageTypeArray = loadPayloadArray(webPageTypeKeyArray, data.payload);
  // End of: Load the webPageTypeArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the webPageTypeArray
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at fkb3ulfqr09ryyc0rb0d
  webPageTypeArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'webPageType must be of datatype string'});}
    if(!arrayElement[1] || arrayElement[1].trim().length === 0){return callback(400, {'Error' : 'No webPageType was entered'});}else{arrayElement[1] = arrayElement[1].trim()}
  });
  // End of: Validate elements in the webPageTypeArray


  // Start of: Load the webPageHeadingArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let webPageHeadingKeyArray = ["webPage", "webPageHeading"]

  let webPageHeadingArray = loadPayloadArray(webPageHeadingKeyArray, data.payload);
  // End of: Load the webPageHeadingArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the webPageHeadingArray
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at fkb3ulfqr09ryyc0rb0d
  webPageHeadingArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'webPageHeading must be of datatype string'});}
    if(!arrayElement[1] || arrayElement[1].trim().length === 0){return callback(400, {'Error' : 'No webPageHeading was entered'});}else{arrayElement[1] = arrayElement[1].trim()}
  });
  // End of: Validate elements in the webPageHeadingArray


  // Start of: Load the formTypeArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let formTypeKeyArray = ["webPage", "form", "formType"]

  let formTypeArray = loadPayloadArray(formTypeKeyArray, data.payload);
  // End of: Load the formTypeArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the formTypeArray
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at fkb3ulfqr09ryyc0rb0d
  formTypeArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'formType must be of datatype string'});}
    if(!arrayElement[1] || arrayElement[1].trim().length === 0){return callback(400, {'Error' : 'No formType was entered'});}else{arrayElement[1] = arrayElement[1].trim()}
  });
  // End of: Validate elements in the formTypeArray


  // Start of: Load the formHeadingArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let formHeadingKeyArray = ["webPage", "form", "formHeading"]

  let formHeadingArray = loadPayloadArray(formHeadingKeyArray, data.payload);
  // End of: Load the formHeadingArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the formHeadingArray
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at fkb3ulfqr09ryyc0rb0d
  formHeadingArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'formHeading must be of datatype string'});}
    if(!arrayElement[1] || arrayElement[1].trim().length === 0){return callback(400, {'Error' : 'No formHeading was entered'});}else{arrayElement[1] = arrayElement[1].trim()}
  });
  // End of: Validate elements in the formHeadingArray


  // Start of: Load the successMessageArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let successMessageKeyArray = ["webPage", "form", "successMessage"]

  let successMessageArray = loadPayloadArray(successMessageKeyArray, data.payload);
  // End of: Load the successMessageArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the successMessageArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  successMessageArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'successMessage must be of datatype string'});}
  });
  // End of: Validate elements in the successMessageArray


  // Start of: Load the submitButtonTextArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let submitButtonTextKeyArray = ["webPage", "form", "submitButtonText"]

  let submitButtonTextArray = loadPayloadArray(submitButtonTextKeyArray, data.payload);
  // End of: Load the submitButtonTextArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the submitButtonTextArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  submitButtonTextArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'submitButtonText must be of datatype string'});}
  });
  // End of: Validate elements in the submitButtonTextArray


  // Start of: Load the formElementNameArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let formElementNameKeyArray = ["webPage", "form", "formElement", "formElementName"]

  let formElementNameArray = loadPayloadArray(formElementNameKeyArray, data.payload);
  // End of: Load the formElementNameArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the formElementNameArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  formElementNameArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'formElementName must be of datatype string'});}
  });
  // End of: Validate elements in the formElementNameArray


  // Start of: Load the formElementLabelTextArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let formElementLabelTextKeyArray = ["webPage", "form", "formElement", "formElementLabelText"]

  let formElementLabelTextArray = loadPayloadArray(formElementLabelTextKeyArray, data.payload);
  // End of: Load the formElementLabelTextArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the formElementLabelTextArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  formElementLabelTextArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'formElementLabelText must be of datatype string'});}
  });
  // End of: Validate elements in the formElementLabelTextArray


  // Start of: Load the feAttributeNameArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let feAttributeNameKeyArray = ["webPage", "form", "formElement", "attribute", "feAttributeName"]

  let feAttributeNameArray = loadPayloadArray(feAttributeNameKeyArray, data.payload);
  // End of: Load the feAttributeNameArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the feAttributeNameArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  feAttributeNameArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'feAttributeName must be of datatype string'});}
  });
  // End of: Validate elements in the feAttributeNameArray


  // Start of: Load the feAttributeValueArray dynamically once the payload is known.
  // Behavior from meta.js at lefq4oks90h34rvcw8sg
  let feAttributeValueKeyArray = ["webPage", "form", "formElement", "attribute", "feAttributeValue"]

  let feAttributeValueArray = loadPayloadArray(feAttributeValueKeyArray, data.payload);
  // End of: Load the feAttributeValueArray dynamically once the payload is known. 
                  
  // Start of: Validate elements in the feAttributeValueArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  feAttributeValueArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'feAttributeValue must be of datatype string'});}
  });
  // End of: Validate elements in the feAttributeValueArray


  // Enforcing uniqueness of the tableName field.
  // Will toggle this to false if we find the tableName already exists in metadata.
  // Behavior from meta.js at rmkfkaef7xo3gyvnvgm4
  let tableName_IsUnused = true;  

  // Using this to track the primary key of a record that we might encounter with the candidate tableName.
  // If we encounter this primary key again we will check to see if the tableName has been changed.
  // If it has then the candidate tableName will be marked as available again.
  let uniqueIdOfRecordHoldingCandidate_TableName = false; 
                        

  // To ensure the tableName is unique we will read every record in 
  // metadata and compare with the tableName provided.

  // This function sets up a stream where each chunk of data is a complete line in the metadata file.
  let readInterface = readline.createInterface
  (
    { // specify the file to be read.
      input: fs.createReadStream(_data.baseDir + '/database/dbMetadata' + '/' + 'metadata' + '.json')
    }
  );
  
  // Look at each record in the file and set a flag if the tableName matches the tableName provided by the user.
  readInterface.on('line', function(line) 
  {
    // Convert the JSON string from metadata into an object.
    let lineObject = JSON.parse(line);

    // Several different record sets with the supplied tableName and the same metadataId 
    // may exist already if the record has been changed or deleted prior to this operation.

    // A modified record is simply a new record with the same metadataId as an existing record.
    // The newest record is the valid record and the older record is history.  
    // So position matters. These tables should never be sorted.
    // These tables can be packed however to get rid of historical records.

    // The transaction log also maintains the history and the current state of the entire database.
    // So the transaction log can be used to check the integrity of the every table.
    // No records in the transaction log should be removed.

    // A deleted record in this system is simply an identical record appended with 
    // the deleted field set to true. 
    // So depending on how many times the tableName has been added and deleted there may 
    // be several sets of records in the metadata table currently 
    // that have the same tableName and the same metadataId.
    // The table can be packed occasionally to get rid of these deleted record sets. 
    // Deletes are handled as appends with the deleted field set to true because real 
    // deletes tie up the table for a long time.

    // In this table, the tableName is a unique key as well as the metadataId.
    // The metadataId also serves as the primary key.
    // The difference is that the metadataId may never change whereas the tableName
    // may be changed to something different if a valid record for that tableName
    // does not already exist.    

    // When adding a record we first make sure that the record does NOT already exist.
    // There should be no record with the current tableName or if there is then 
    // the last record with this tableName must have the deleted field set to true.

    // When changing a record we:
    // 1. Make sure that the record with this tableName does indeed exist and...
    // 2. that the last instance of a record with this tableName is not deleted.
  
    // It is ok to add a new record with this same tableName again when the last instance 
    // of this record encountered in the stream has the deleted flag set to true. 
    // In that case, the metadataId will be different but the tableName will be the same.         

    // As explained above, only the last matching record for a particular tableName matters.
    // It's like that old game "She loves me, She loves me not".

    if (tableName == lineObject.tableName) // we found a matching entry
    {
      if (lineObject.deleted == false) // The record has not been deleted so it's a duplicate. Not unique.
      {
        tableName_IsUnused = false; // This flag used in the on close event listener below. 

        // If this record (record with this primary key) is encountered further down where it has been deleted 
        // or where the tableName has been changed with a put operation:
        // Then the candidate tableName will be available again as we continue searching through the records.
        // We are already checking if this tableName becomes available again by deletion.
        // Now we need to check if the tableName becomes available because the record with this primary 
        // key gets changed with a new tableName.
        // That will make the candidate tableName unique and available again.
        // So record this global sequential unique id (the metadataId in this case).
        // If we find the gsuid again, then check if the tableName has changed.
        // If it has been changed then:
        // 1. Set the tableName_IsUnused flag to true again
        // 2. clear out the variable tracking the uniqueId of the record.
        uniqueIdOfRecordHoldingCandidate_TableName = lineObject.metadataId;
      }
      // The matching record we found has been deleted so it may as well not exist. The new record is still unique.
      else 
      {
        tableName_IsUnused = true;
      } 
    } // End of: if we found a matching entry

    // If we have seen this primary key before and flagged the tableName already taken 
    // because it was identical to the tableName we are trying to add and it had not been deleted:

    // Ok, the current record is not holding the candidate tableName but 
    // maybe it was in the past and someone changed it.
    // if the candidate tableName is flagged unavailable and we are looking at the record that was flagged:
    else if(tableName_IsUnused === false && uniqueIdOfRecordHoldingCandidate_TableName === lineObject.metadataId)
    {
      // Check if the tableName is no longer holding the candidate tableName.
      // If it is not holding the candidate tableName then flag the tableName 
      // available again and clear out the variable tracking this primary key.
      tableName_IsUnused = true;
      uniqueIdOfRecordHoldingCandidate_TableName = false;
    }

  }); // End of: readInterface.on('line', function(line){...}
  // End of: Look at each record...




  // This listener fires after we have discovered if the tableName is 
  // unique or not, and have then closed the readable stream from metadata.
  // The callback function defined here will append the record if the tableName 
  // was found to be unique.
  // Behavior from meta.js at aiwaoocd1uegzjbqeydk
  readInterface.on('close', function() 
  {
    // If the tableName already exists then exit this process without appending the record.
    if (!tableName_IsUnused) 
    {      
      helpers.log
      (
        5,
        'nee73kpmlyv28e5fe9jf' + '\n' +
        'The tableName : ' + tableName + ' already exists' + '\n'                                  
      ); // End of: helpers.log(...)

      return callback(400, {'Error' : 'The tableName already exists'});
    }

    // If we made it to this point then the candidate tableName is unique so continue on with the append opperation.
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
          '91m2btbov71vow0gyr9n' + '\n' +
          'Unable to get the next gsuid.' + '\n' +
          'The following was the error' + '\n' +
          JSON.stringify(error) + '\n'                                   
        ); // End of: helpers.log(...)

        return callback(423, {'Error' : 'Database is Locked'});
      }


      // If we got this far then we were able to lock the gsuid.json file and get the next 
      // unique id number for this record so continue on.



      // Create the metadata object. 
      // This object will be appended to metadata.json.
      // Behavior from meta.js at cmqbrt7gkxkex9z8a1qb
      let metadataObject = {};
      metadataObject.metadataId = nextIdObject.nextId;

      metadataObject.tableName = tableName;
      metadataObject.directory = directory;
      metadataObject.addRoutes = addRoutes;
      metadataObject.allowCodeGeneration = allowCodeGeneration;

      // Add any fields named "dataTypeArray" to the object we will write to the database.
      metadataObject = buildBranches(dataTypeArray, metadataObject);

      // Add any fields named "fieldNameArray" to the object we will write to the database.
      metadataObject = buildBranches(fieldNameArray, metadataObject);

      // Add any fields named "uniqueArray" to the object we will write to the database.
      metadataObject = buildBranches(uniqueArray, metadataObject);

      // Add any fields named "publishedArray" to the object we will write to the database.
      metadataObject = buildBranches(publishedArray, metadataObject);

      // Add any fields named "elementNameArray" to the object we will write to the database.
      metadataObject = buildBranches(elementNameArray, metadataObject);

      // Add any fields named "labelTextArray" to the object we will write to the database.
      metadataObject = buildBranches(labelTextArray, metadataObject);

      // Add any fields named "elementTypeArray" to the object we will write to the database.
      metadataObject = buildBranches(elementTypeArray, metadataObject);

      // Add any fields named "attributeNameArray" to the object we will write to the database.
      metadataObject = buildBranches(attributeNameArray, metadataObject);

      // Add any fields named "attributeValueArray" to the object we will write to the database.
      metadataObject = buildBranches(attributeValueArray, metadataObject);

      // Add any fields named "defaultValidationNameArray" to the object we will write to the database.
      metadataObject = buildBranches(defaultValidationNameArray, metadataObject);

      // Add any fields named "defaultValidationValueArray" to the object we will write to the database.
      metadataObject = buildBranches(defaultValidationValueArray, metadataObject);

      // Add any fields named "postValidationNameArray" to the object we will write to the database.
      metadataObject = buildBranches(postValidationNameArray, metadataObject);

      // Add any fields named "postValidationValueArray" to the object we will write to the database.
      metadataObject = buildBranches(postValidationValueArray, metadataObject);

      // Add any fields named "putValidationNameArray" to the object we will write to the database.
      metadataObject = buildBranches(putValidationNameArray, metadataObject);

      // Add any fields named "putValidationValueArray" to the object we will write to the database.
      metadataObject = buildBranches(putValidationValueArray, metadataObject);

      // Add any fields named "calculationNameArray" to the object we will write to the database.
      metadataObject = buildBranches(calculationNameArray, metadataObject);

      // Add any fields named "calculationValueArray" to the object we will write to the database.
      metadataObject = buildBranches(calculationValueArray, metadataObject);


      // Add any fields named "webPageTypeArray" to the object we will write to the database.
      metadataObject = buildBranches(webPageTypeArray, metadataObject);

      // Add any fields named "webPageHeadingArray" to the object we will write to the database.
      metadataObject = buildBranches(webPageHeadingArray, metadataObject);

      // Add any fields named "formTypeArray" to the object we will write to the database.
      metadataObject = buildBranches(formTypeArray, metadataObject);

      // Add any fields named "formHeadingArray" to the object we will write to the database.
      metadataObject = buildBranches(formHeadingArray, metadataObject);

      // Add any fields named "successMessageArray" to the object we will write to the database.
      metadataObject = buildBranches(successMessageArray, metadataObject);

      // Add any fields named "submitButtonTextArray" to the object we will write to the database.
      metadataObject = buildBranches(submitButtonTextArray, metadataObject);

      // Add any fields named "formElementNameArray" to the object we will write to the database.
      metadataObject = buildBranches(formElementNameArray, metadataObject);

      // Add any fields named "formElementLabelTextArray" to the object we will write to the database.
      metadataObject = buildBranches(formElementLabelTextArray, metadataObject);

      // Add any fields named "feAttributeNameArray" to the object we will write to the database.
      metadataObject = buildBranches(feAttributeNameArray, metadataObject);

      // Add any fields named "feAttributeValueArray" to the object we will write to the database.
      metadataObject = buildBranches(feAttributeValueArray, metadataObject);

      
      metadataObject.timeStamp = Date.now();
      metadataObject.deleted = false;


      // Code from the data dictionary marked postHandlerPreprocessing, if any, will be inserted below.
      

      // Create the logObject.
      // This object will be written to history.json which maintains a history of 
      // all changes to all tables in the database.
      var logObject =
      {
        "historyId" : nextIdObject.nextId + 1,                 
        "transactionId" : nextIdObject.nextId + 2,            
        "rollback" : false,
        "process" : "metadata._metadata.post",
        "comment" : "Post new record",
        "who" : "No login yet",    
        "metadata" : metadataObject   
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
              'zzubetml2e2jwclozg6c' + '\n' +
              'There was an error appending to the history file' + '\n' +
              'An error here does not necessarily mean the append to history did not happen.' + '\n' +  
              'But an error at this point in the code surely means there was no append to metadata' + '\n' +                                          
              'CHECK TO SEE IF history and metadata ARE STILL IN SYNC' + '\n' +                    
              'The following was the record we tried to append:' + '\n' +
              JSON.stringify(logObject) + '\n' +                   
              'The following is the error message:' + '\n' +                  
              err  + '\n'
            );

            return callback(500, {'Error' : 'Could not create a new metadata record.'});
          }



          // The history file has been appended to successfully so continue on.



          // Calling the function which appends a record to the file metadata.json
          _data.append
          (
          '/database/dbMetadata', 
          'metadata', 
          metadataObject, 
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
                    '72w8zku7tyx4xa6xrlcb' + '\n' +
                    'Successful write to metadata but unable to remove lock on database' + '\n' +
                    'The following record was appended to the metadata file:' + '\n' +                            
                    JSON.stringify(logObject) + '\n' +   
                    'The following was the error message:' + '\n' +                                             
                    error + '\n'
                  ); // End of: helpers.log. Log the error.

                  return callback(500, {'Error' : 'Successful write to metadata but unable to remove lock on database'});

                } // End of: else Good write but unable to remove lock on database.

              } // End of callback code which is run after attempting to remove the lock.
              ); // End of: _data.removeLock(function(error){...}
              // End of: Call to function which removes lock

            }    // End of: if (!err)  //The file has been appended to successfully.
            else // There was an error appending to metadata.
            {
              helpers.log // Log the error.
              (
                5,
                'iyzo0o0qmociiswxwatg' + '\n' +
                'There was an error when appending to the metadata file.' + '\n' +
                'The following record may or may not have been appended to the metadata file:' + '\n' +                            
                JSON.stringify(logObject) + '\n' +
                'Attempting to rollback the entry.' + '\n' +    
                'The following was the error message:' + '\n' +                                             
                err + '\n'            
              );

              // Assemble rollback record for the metadata file which will negate previous entry if any.                 
              metadataObject.timeStamp = Date.now();
              metadataObject.deleted = true;

              // Assemble rollback record for the history file which will negate previous entry if any.
              logObject =
              {
                "historyId" : nextIdObject.nextId + 3,                             
                "transactionId" : nextIdObject.nextId + 2,                        
                "rollback" : true,
                "process" : "metadata._metadata.post",
                "comment" : "Error posting. Appending a delete.",                        
                "who" : "Function needed",    
                "metadata" : metadataObject   
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
                    // Calling the function which appends a record to the file metadata.json
                    _data.append
                    (
                      '/database/dbMetadata', 
                      'metadata', 
                      metadataObject, 
                      function(err)
                      {
                        if (!err) // The rollback record for metadata was appended successfully.
                        {
                          helpers.log
                          (
                            5,
                            '6nhic1uocu4olbake8gy' + '\n' +
                            'Rollback entry in the metadata file was appended successfully' + '\n' +
                            'The following was the record we rolled back:' + '\n' +
                            JSON.stringify(logObject) + '\n'                                   
                          ); // End of: helpers.log(...)
                        }
                        else // There was an error when rolling back record for metadata.
                        {
                          helpers.log
                          (
                            7,
                            'hqkpt1k4g7izk4p7xxt6' + '\n' +
                            'There was an error appending a rollback entry in the metadata file' + '\n' +
                            'The following record may or may not have been rolled back:' + '\n' +
                            JSON.stringify(logObject) + '\n' +   
                            'An error here does not necessarily mean the deleting append to metadata did not happen.' + '\n' +                                        
                            'CHECK TO SEE IF history and metadata ARE STILL IN SYNC' + '\n' + 
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
                      'ar81a0yqqqeys9o8royv' + '\n' +
                      'There was an error appending a rollback entry in the history file' + '\n' +
                      'A rollback entry may or may not have been written in the metadata file' + '\n' +  
                      'CHECK TO SEE IF history and metadata ARE STILL IN SYNC' + '\n' +                                      
                      'The following was the record we tried to roll back:' + '\n' +
                      JSON.stringify(logObject) + '\n' +        
                      'The following is the error message:' + '\n' +
                      err  + '\n'
                    );
                  } // End of: else There was an error when appending a rollback entry in history.
                } // End of: callback function(err){...}
              ); // End of: _data.append(...) Append a rollback entry in history.

              return callback(500, {'Error' : 'Could not create the new metadata.'});              

            } // End of: else // There was an error appending to metadata.
          } // End of: callback function
          ); // End of: Calling the function which appends a record to the file metadata.json 
        } // End of: callback function
      ); // End of: _data.append(dbHistory...)
      // End of: Calling the function which creates an entry into history. 
    }); // End of: lib.nextId(function(err, nextIdObject)
  }); // End of: readInterface.on('close', function(){...}
}; // End of: metadata._metadata.post = function(...
// End of: metadata - post subhandler




// metadata - put handler
// Define the metadata put subhandler function 
// This function updates a record.
// Required data: metadataId
// Note: At least one other field must be specified.
// Behavior from meta.js at mzimrkdf1we1bjw96zgp
metadata._metadata.put = function(data, callback)
{
  // Field validation starts here.
  // Get metadataId from payload
  let metadataId = data.payload.metadataId;

  // PrimaryKey validation. 
  // Default behavior from meta.js at o65yzg6ddze2fkvcgw5s
  // If metadataId is a valid string then convert it to a number.  
  if (typeof(metadataId) === 'string'){metadataId = parseInt(metadataId, 10);}else{return callback(400, {'Error' : 'metadataId must be a of string type'});}

  // Get tableName from payload
  let tableName = data.payload["tableName"];

  // passIfString&NotEmptyThenTrim
  // Default behavior from meta.js at ulg5xxvzgr7efln9xur9 
  // If tableName is of string type and is not empty 
  if (typeof(tableName) === 'string' && tableName.trim().length > 0) 
  { 
    // The user entered something in the edit form
    tableName = tableName.trim()
  } 
  // Else, the user may have entered some other datatype like a number or 
  // perhaps nothing at all if using the Delete form or if just using the API. 
  else 
  { 
    // If the user entered nothing: 
    if(tableName === undefined) 
    { 
      // Then user is likely trying to delete a record.
      // So change the value to false and continue processing.
      tableName = false 
    } 
    else // The user entered something invalid so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid tableName'}); 
    } 
  }

  // Get directory from payload
  let directory = data.payload["directory"];

  // passIfString&NotEmptyThenTrim
  // Default behavior from meta.js at ulg5xxvzgr7efln9xur9 
  // If directory is of string type and is not empty 
  if (typeof(directory) === 'string' && directory.trim().length > 0) 
  { 
    // The user entered something in the edit form
    directory = directory.trim()
  } 
  // Else, the user may have entered some other datatype like a number or 
  // perhaps nothing at all if using the Delete form or if just using the API. 
  else 
  { 
    // If the user entered nothing: 
    if(directory === undefined) 
    { 
      // Then user is likely trying to delete a record.
      // So change the value to false and continue processing.
      directory = false 
    } 
    else // The user entered something invalid so reject the edit. 
    { 
      return callback(400, {'Error' : 'Not a valid directory'}); 
    } 
  }

  // Get addRoutes from payload
  let addRoutes = data.payload["addRoutes"];

  // Behavior from meta.js at p9ddngfx5873pjgmalzb
  if(typeof(addRoutes) === 'string')
  {
    if
    (
        addRoutes !== "yes"
        && addRoutes !== "no"
    )
    {
      return callback(400, {'Error' : 'No addRoutes was selected from menu'});
    }
    else
    {
      addRoutes = addRoutes.trim()
    }
  }
  else // Not a string
  {
    // If the user entered nothing: 
    if(addRoutes === undefined) 
    { 
      // Then user is likely trying to delete a record.
      // So change the value to false and continue processing.
      addRoutes = false
    } 
    else
    {
      return callback(400, {'Error' : 'addRoutes must be of datatype string'});
    }
  }

  // Get allowCodeGeneration from payload
  let allowCodeGeneration = data.payload["allowCodeGeneration"];

  // Behavior from meta.js at p9ddngfx5873pjgmalzb
  if(typeof(allowCodeGeneration) === 'string')
  {
    if
    (
        allowCodeGeneration !== "yes"
        && allowCodeGeneration !== "no"
    )
    {
      return callback(400, {'Error' : 'No allowCodeGeneration was selected from menu'});
    }
    else
    {
      allowCodeGeneration = allowCodeGeneration.trim()
    }
  }
  else // Not a string
  {
    // If the user entered nothing: 
    if(allowCodeGeneration === undefined) 
    { 
      // Then user is likely trying to delete a record.
      // So change the value to false and continue processing.
      allowCodeGeneration = false
    } 
    else
    {
      return callback(400, {'Error' : 'allowCodeGeneration must be of datatype string'});
    }
  }

  // Start of: Load the dataTypeArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let dataTypeKeyArray = ["field", "dataType"]

  let dataTypeArray = loadPayloadArray(dataTypeKeyArray, data.payload);
  // End of: Load the dataTypeArray dynamically once the payload is known. 

  // Start of: Validate elements in the dataTypeArray
  // passMenuItemsOnly
  // Behavior from meta.js at v4a99s97u4c9idr0b71g
  dataTypeArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) === 'string')
    {
      if
      (
        arrayElement[1] !== "string"
        && arrayElement[1] !== "object"
      )
      {
        return callback(400, {'Error' : 'dataType does not match menu options'});
      }
    }
    else // Not a string
    {
      // If the user entered nothing: 
      if(dataType === undefined) 
      { 
        // Then user is likely trying to delete a record.
        // So change the value to false and continue processing.
        dataType = false
      } 
      else
      {
        return callback(400, {'Error' : 'dataType must be of datatype string'});
      }  
    }                    
  });
  // End of: Validate elements in the dataTypeArray

  // Start of: Load the fieldNameArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let fieldNameKeyArray = ["field", "fieldName"]

  let fieldNameArray = loadPayloadArray(fieldNameKeyArray, data.payload);
  // End of: Load the fieldNameArray dynamically once the payload is known. 

  // Start of: Validate elements in the fieldNameArray
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at ohw0ivijs2au0nt2rwf1
  fieldNameArray.forEach(function(arrayElement)
  {
    // If fieldName is of string type and is not empty 
    if (typeof(arrayElement[1]) === 'string' && arrayElement[1].trim().length > 0) 
    { 
      // The user entered something in the edit form
      arrayElement[1] = arrayElement[1].trim()
    } 
    // Else, the user may have entered some other datatype like a number or 
    // perhaps nothing at all if using the Delete form or if just using the API. 
    else 
    { 
      // If the user entered nothing: 
      if(arrayElement[1] === undefined) 
      { 
        // Then user is likely trying to delete a record.
        // So change the value to false and continue processing.
        arrayElement[1] = false 
      } 
      else // The user entered something invalid so reject the edit. 
      { 
        return callback(400, {'Error' : 'Not a valid ' + arrayElement[1]}); 
      } 
    }
  }); // End of: fieldNameArray.forEach(function(arrayElement)
  // End of: Validate elements in the fieldNameArray 

  // Start of: Load the uniqueArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let uniqueKeyArray = ["field", "unique"]

  let uniqueArray = loadPayloadArray(uniqueKeyArray, data.payload);
  // End of: Load the uniqueArray dynamically once the payload is known. 

  // Start of: Validate elements in the uniqueArray
  // passMenuItemsOnly
  // Behavior from meta.js at v4a99s97u4c9idr0b71g
  uniqueArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) === 'string')
    {
      if
      (
        arrayElement[1] !== "yes"
        && arrayElement[1] !== "no"
      )
      {
        return callback(400, {'Error' : 'unique does not match menu options'});
      }
    }
    else // Not a string
    {
      // If the user entered nothing: 
      if(unique === undefined) 
      { 
        // Then user is likely trying to delete a record.
        // So change the value to false and continue processing.
        unique = false
      } 
      else
      {
        return callback(400, {'Error' : 'unique must be of datatype string'});
      }  
    }                    
  });
  // End of: Validate elements in the uniqueArray

  // Start of: Load the publishedArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let publishedKeyArray = ["field", "published"]

  let publishedArray = loadPayloadArray(publishedKeyArray, data.payload);
  // End of: Load the publishedArray dynamically once the payload is known. 

  // Start of: Validate elements in the publishedArray
  // passMenuItemsOnly
  // Behavior from meta.js at v4a99s97u4c9idr0b71g
  publishedArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) === 'string')
    {
      if
      (
        arrayElement[1] !== "yes"
        && arrayElement[1] !== "no"
      )
      {
        return callback(400, {'Error' : 'published does not match menu options'});
      }
    }
    else // Not a string
    {
      // If the user entered nothing: 
      if(published === undefined) 
      { 
        // Then user is likely trying to delete a record.
        // So change the value to false and continue processing.
        published = false
      } 
      else
      {
        return callback(400, {'Error' : 'published must be of datatype string'});
      }  
    }                    
  });
  // End of: Validate elements in the publishedArray

  // Start of: Load the elementNameArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let elementNameKeyArray = ["field", "defaultElement", "elementName"]

  let elementNameArray = loadPayloadArray(elementNameKeyArray, data.payload);
  // End of: Load the elementNameArray dynamically once the payload is known. 

  // Start of: Validate elements in the elementNameArray
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at ohw0ivijs2au0nt2rwf1
  elementNameArray.forEach(function(arrayElement)
  {
    // If elementName is of string type and is not empty 
    if (typeof(arrayElement[1]) === 'string' && arrayElement[1].trim().length > 0) 
    { 
      // The user entered something in the edit form
      arrayElement[1] = arrayElement[1].trim()
    } 
    // Else, the user may have entered some other datatype like a number or 
    // perhaps nothing at all if using the Delete form or if just using the API. 
    else 
    { 
      // If the user entered nothing: 
      if(arrayElement[1] === undefined) 
      { 
        // Then user is likely trying to delete a record.
        // So change the value to false and continue processing.
        arrayElement[1] = false 
      } 
      else // The user entered something invalid so reject the edit. 
      { 
        return callback(400, {'Error' : 'Not a valid ' + arrayElement[1]}); 
      } 
    }
  }); // End of: elementNameArray.forEach(function(arrayElement)
  // End of: Validate elements in the elementNameArray 

  // Start of: Load the labelTextArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let labelTextKeyArray = ["field", "defaultElement", "labelText"]

  let labelTextArray = loadPayloadArray(labelTextKeyArray, data.payload);
  // End of: Load the labelTextArray dynamically once the payload is known. 

  // Start of: Validate elements in the labelTextArray
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at ohw0ivijs2au0nt2rwf1
  labelTextArray.forEach(function(arrayElement)
  {
    // If labelText is of string type and is not empty 
    if (typeof(arrayElement[1]) === 'string' && arrayElement[1].trim().length > 0) 
    { 
      // The user entered something in the edit form
      arrayElement[1] = arrayElement[1].trim()
    } 
    // Else, the user may have entered some other datatype like a number or 
    // perhaps nothing at all if using the Delete form or if just using the API. 
    else 
    { 
      // If the user entered nothing: 
      if(arrayElement[1] === undefined) 
      { 
        // Then user is likely trying to delete a record.
        // So change the value to false and continue processing.
        arrayElement[1] = false 
      } 
      else // The user entered something invalid so reject the edit. 
      { 
        return callback(400, {'Error' : 'Not a valid ' + arrayElement[1]}); 
      } 
    }
  }); // End of: labelTextArray.forEach(function(arrayElement)
  // End of: Validate elements in the labelTextArray 

  // Start of: Load the elementTypeArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let elementTypeKeyArray = ["field", "defaultElement", "elementType"]

  let elementTypeArray = loadPayloadArray(elementTypeKeyArray, data.payload);
  // End of: Load the elementTypeArray dynamically once the payload is known. 

  // Start of: Validate elements in the elementTypeArray
  // passMenuItemsOnly
  // Behavior from meta.js at v4a99s97u4c9idr0b71g
  elementTypeArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) === 'string')
    {
      if
      (
        arrayElement[1] !== "input"
        && arrayElement[1] !== "select"
      )
      {
        return callback(400, {'Error' : 'elementType does not match menu options'});
      }
    }
    else // Not a string
    {
      // If the user entered nothing: 
      if(elementType === undefined) 
      { 
        // Then user is likely trying to delete a record.
        // So change the value to false and continue processing.
        elementType = false
      } 
      else
      {
        return callback(400, {'Error' : 'elementType must be of datatype string'});
      }  
    }                    
  });
  // End of: Validate elements in the elementTypeArray

  // Start of: Load the attributeNameArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let attributeNameKeyArray = ["field", "defaultElement", "attribute", "attributeName"]

  let attributeNameArray = loadPayloadArray(attributeNameKeyArray, data.payload);
  // End of: Load the attributeNameArray dynamically once the payload is known. 

  // Start of: Validate elements in the attributeNameArray
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at ohw0ivijs2au0nt2rwf1
  attributeNameArray.forEach(function(arrayElement)
  {
    // If attributeName is of string type and is not empty 
    if (typeof(arrayElement[1]) === 'string' && arrayElement[1].trim().length > 0) 
    { 
      // The user entered something in the edit form
      arrayElement[1] = arrayElement[1].trim()
    } 
    // Else, the user may have entered some other datatype like a number or 
    // perhaps nothing at all if using the Delete form or if just using the API. 
    else 
    { 
      // If the user entered nothing: 
      if(arrayElement[1] === undefined) 
      { 
        // Then user is likely trying to delete a record.
        // So change the value to false and continue processing.
        arrayElement[1] = false 
      } 
      else // The user entered something invalid so reject the edit. 
      { 
        return callback(400, {'Error' : 'Not a valid ' + arrayElement[1]}); 
      } 
    }
  }); // End of: attributeNameArray.forEach(function(arrayElement)
  // End of: Validate elements in the attributeNameArray 

  // Start of: Load the attributeValueArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let attributeValueKeyArray = ["field", "defaultElement", "attribute", "attributeValue"]

  let attributeValueArray = loadPayloadArray(attributeValueKeyArray, data.payload);
  // End of: Load the attributeValueArray dynamically once the payload is known. 

  // Start of: Validate elements in the attributeValueArray
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at ohw0ivijs2au0nt2rwf1
  attributeValueArray.forEach(function(arrayElement)
  {
    // If attributeValue is of string type and is not empty 
    if (typeof(arrayElement[1]) === 'string' && arrayElement[1].trim().length > 0) 
    { 
      // The user entered something in the edit form
      arrayElement[1] = arrayElement[1].trim()
    } 
    // Else, the user may have entered some other datatype like a number or 
    // perhaps nothing at all if using the Delete form or if just using the API. 
    else 
    { 
      // If the user entered nothing: 
      if(arrayElement[1] === undefined) 
      { 
        // Then user is likely trying to delete a record.
        // So change the value to false and continue processing.
        arrayElement[1] = false 
      } 
      else // The user entered something invalid so reject the edit. 
      { 
        return callback(400, {'Error' : 'Not a valid ' + arrayElement[1]}); 
      } 
    }
  }); // End of: attributeValueArray.forEach(function(arrayElement)
  // End of: Validate elements in the attributeValueArray 

  // Start of: Load the defaultValidationNameArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let defaultValidationNameKeyArray = ["field", "defaultElement", "validation", "default", "defaultValidationName"]

  let defaultValidationNameArray = loadPayloadArray(defaultValidationNameKeyArray, data.payload);
  // End of: Load the defaultValidationNameArray dynamically once the payload is known. 

                  
  // Start of: Validate elements in the defaultValidationNameArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  defaultValidationNameArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'defaultValidationName must be of datatype string'});}
  });
  // End of: Validate elements in the defaultValidationNameArray

  // Start of: Load the defaultValidationValueArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let defaultValidationValueKeyArray = ["field", "defaultElement", "validation", "default", "defaultValidationValue"]

  let defaultValidationValueArray = loadPayloadArray(defaultValidationValueKeyArray, data.payload);
  // End of: Load the defaultValidationValueArray dynamically once the payload is known. 

                  
  // Start of: Validate elements in the defaultValidationValueArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  defaultValidationValueArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'defaultValidationValue must be of datatype string'});}
  });
  // End of: Validate elements in the defaultValidationValueArray

  // Start of: Load the postValidationNameArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let postValidationNameKeyArray = ["field", "defaultElement", "validation", "post", "postValidationName"]

  let postValidationNameArray = loadPayloadArray(postValidationNameKeyArray, data.payload);
  // End of: Load the postValidationNameArray dynamically once the payload is known. 

                  
  // Start of: Validate elements in the postValidationNameArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  postValidationNameArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'postValidationName must be of datatype string'});}
  });
  // End of: Validate elements in the postValidationNameArray

  // Start of: Load the postValidationValueArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let postValidationValueKeyArray = ["field", "defaultElement", "validation", "post", "postValidationValue"]

  let postValidationValueArray = loadPayloadArray(postValidationValueKeyArray, data.payload);
  // End of: Load the postValidationValueArray dynamically once the payload is known. 

                  
  // Start of: Validate elements in the postValidationValueArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  postValidationValueArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'postValidationValue must be of datatype string'});}
  });
  // End of: Validate elements in the postValidationValueArray

  // Start of: Load the putValidationNameArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let putValidationNameKeyArray = ["field", "defaultElement", "validation", "put", "putValidationName"]

  let putValidationNameArray = loadPayloadArray(putValidationNameKeyArray, data.payload);
  // End of: Load the putValidationNameArray dynamically once the payload is known. 

                  
  // Start of: Validate elements in the putValidationNameArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  putValidationNameArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'putValidationName must be of datatype string'});}
  });
  // End of: Validate elements in the putValidationNameArray

  // Start of: Load the putValidationValueArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let putValidationValueKeyArray = ["field", "defaultElement", "validation", "put", "putValidationValue"]

  let putValidationValueArray = loadPayloadArray(putValidationValueKeyArray, data.payload);
  // End of: Load the putValidationValueArray dynamically once the payload is known. 

                  
  // Start of: Validate elements in the putValidationValueArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  putValidationValueArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'putValidationValue must be of datatype string'});}
  });
  // End of: Validate elements in the putValidationValueArray

  // Start of: Load the calculationNameArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let calculationNameKeyArray = ["field", "calculation", "calculationName"]

  let calculationNameArray = loadPayloadArray(calculationNameKeyArray, data.payload);
  // End of: Load the calculationNameArray dynamically once the payload is known. 

  // Start of: Validate elements in the calculationNameArray
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at ohw0ivijs2au0nt2rwf1
  calculationNameArray.forEach(function(arrayElement)
  {
    // If calculationName is of string type and is not empty 
    if (typeof(arrayElement[1]) === 'string' && arrayElement[1].trim().length > 0) 
    { 
      // The user entered something in the edit form
      arrayElement[1] = arrayElement[1].trim()
    } 
    // Else, the user may have entered some other datatype like a number or 
    // perhaps nothing at all if using the Delete form or if just using the API. 
    else 
    { 
      // If the user entered nothing: 
      if(arrayElement[1] === undefined) 
      { 
        // Then user is likely trying to delete a record.
        // So change the value to false and continue processing.
        arrayElement[1] = false 
      } 
      else // The user entered something invalid so reject the edit. 
      { 
        return callback(400, {'Error' : 'Not a valid ' + arrayElement[1]}); 
      } 
    }
  }); // End of: calculationNameArray.forEach(function(arrayElement)
  // End of: Validate elements in the calculationNameArray 

  // Start of: Load the calculationValueArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let calculationValueKeyArray = ["field", "calculation", "calculationValue"]

  let calculationValueArray = loadPayloadArray(calculationValueKeyArray, data.payload);
  // End of: Load the calculationValueArray dynamically once the payload is known. 

                  
  // Start of: Validate elements in the calculationValueArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  calculationValueArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'calculationValue must be of datatype string'});}
  });
  // End of: Validate elements in the calculationValueArray

  // Start of: Load the webPageTypeArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let webPageTypeKeyArray = ["webPage", "webPageType"]

  let webPageTypeArray = loadPayloadArray(webPageTypeKeyArray, data.payload);
  // End of: Load the webPageTypeArray dynamically once the payload is known. 

  // Start of: Validate elements in the webPageTypeArray
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at ohw0ivijs2au0nt2rwf1
  webPageTypeArray.forEach(function(arrayElement)
  {
    // If webPageType is of string type and is not empty 
    if (typeof(arrayElement[1]) === 'string' && arrayElement[1].trim().length > 0) 
    { 
      // The user entered something in the edit form
      arrayElement[1] = arrayElement[1].trim()
    } 
    // Else, the user may have entered some other datatype like a number or 
    // perhaps nothing at all if using the Delete form or if just using the API. 
    else 
    { 
      // If the user entered nothing: 
      if(arrayElement[1] === undefined) 
      { 
        // Then user is likely trying to delete a record.
        // So change the value to false and continue processing.
        arrayElement[1] = false 
      } 
      else // The user entered something invalid so reject the edit. 
      { 
        return callback(400, {'Error' : 'Not a valid ' + arrayElement[1]}); 
      } 
    }
  }); // End of: webPageTypeArray.forEach(function(arrayElement)
  // End of: Validate elements in the webPageTypeArray 

  // Start of: Load the webPageHeadingArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let webPageHeadingKeyArray = ["webPage", "webPageHeading"]

  let webPageHeadingArray = loadPayloadArray(webPageHeadingKeyArray, data.payload);
  // End of: Load the webPageHeadingArray dynamically once the payload is known. 

  // Start of: Validate elements in the webPageHeadingArray
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at ohw0ivijs2au0nt2rwf1
  webPageHeadingArray.forEach(function(arrayElement)
  {
    // If webPageHeading is of string type and is not empty 
    if (typeof(arrayElement[1]) === 'string' && arrayElement[1].trim().length > 0) 
    { 
      // The user entered something in the edit form
      arrayElement[1] = arrayElement[1].trim()
    } 
    // Else, the user may have entered some other datatype like a number or 
    // perhaps nothing at all if using the Delete form or if just using the API. 
    else 
    { 
      // If the user entered nothing: 
      if(arrayElement[1] === undefined) 
      { 
        // Then user is likely trying to delete a record.
        // So change the value to false and continue processing.
        arrayElement[1] = false 
      } 
      else // The user entered something invalid so reject the edit. 
      { 
        return callback(400, {'Error' : 'Not a valid ' + arrayElement[1]}); 
      } 
    }
  }); // End of: webPageHeadingArray.forEach(function(arrayElement)
  // End of: Validate elements in the webPageHeadingArray 

  // Start of: Load the formTypeArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let formTypeKeyArray = ["webPage", "form", "formType"]

  let formTypeArray = loadPayloadArray(formTypeKeyArray, data.payload);
  // End of: Load the formTypeArray dynamically once the payload is known. 

  // Start of: Validate elements in the formTypeArray
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at ohw0ivijs2au0nt2rwf1
  formTypeArray.forEach(function(arrayElement)
  {
    // If formType is of string type and is not empty 
    if (typeof(arrayElement[1]) === 'string' && arrayElement[1].trim().length > 0) 
    { 
      // The user entered something in the edit form
      arrayElement[1] = arrayElement[1].trim()
    } 
    // Else, the user may have entered some other datatype like a number or 
    // perhaps nothing at all if using the Delete form or if just using the API. 
    else 
    { 
      // If the user entered nothing: 
      if(arrayElement[1] === undefined) 
      { 
        // Then user is likely trying to delete a record.
        // So change the value to false and continue processing.
        arrayElement[1] = false 
      } 
      else // The user entered something invalid so reject the edit. 
      { 
        return callback(400, {'Error' : 'Not a valid ' + arrayElement[1]}); 
      } 
    }
  }); // End of: formTypeArray.forEach(function(arrayElement)
  // End of: Validate elements in the formTypeArray 

  // Start of: Load the formHeadingArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let formHeadingKeyArray = ["webPage", "form", "formHeading"]

  let formHeadingArray = loadPayloadArray(formHeadingKeyArray, data.payload);
  // End of: Load the formHeadingArray dynamically once the payload is known. 

  // Start of: Validate elements in the formHeadingArray
  // passIfString&NotEmptyThenTrim
  // Behavior from meta.js at ohw0ivijs2au0nt2rwf1
  formHeadingArray.forEach(function(arrayElement)
  {
    // If formHeading is of string type and is not empty 
    if (typeof(arrayElement[1]) === 'string' && arrayElement[1].trim().length > 0) 
    { 
      // The user entered something in the edit form
      arrayElement[1] = arrayElement[1].trim()
    } 
    // Else, the user may have entered some other datatype like a number or 
    // perhaps nothing at all if using the Delete form or if just using the API. 
    else 
    { 
      // If the user entered nothing: 
      if(arrayElement[1] === undefined) 
      { 
        // Then user is likely trying to delete a record.
        // So change the value to false and continue processing.
        arrayElement[1] = false 
      } 
      else // The user entered something invalid so reject the edit. 
      { 
        return callback(400, {'Error' : 'Not a valid ' + arrayElement[1]}); 
      } 
    }
  }); // End of: formHeadingArray.forEach(function(arrayElement)
  // End of: Validate elements in the formHeadingArray 

  // Start of: Load the successMessageArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let successMessageKeyArray = ["webPage", "form", "successMessage"]

  let successMessageArray = loadPayloadArray(successMessageKeyArray, data.payload);
  // End of: Load the successMessageArray dynamically once the payload is known. 

                  
  // Start of: Validate elements in the successMessageArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  successMessageArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'successMessage must be of datatype string'});}
  });
  // End of: Validate elements in the successMessageArray

  // Start of: Load the submitButtonTextArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let submitButtonTextKeyArray = ["webPage", "form", "submitButtonText"]

  let submitButtonTextArray = loadPayloadArray(submitButtonTextKeyArray, data.payload);
  // End of: Load the submitButtonTextArray dynamically once the payload is known. 

                  
  // Start of: Validate elements in the submitButtonTextArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  submitButtonTextArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'submitButtonText must be of datatype string'});}
  });
  // End of: Validate elements in the submitButtonTextArray

  // Start of: Load the formElementNameArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let formElementNameKeyArray = ["webPage", "form", "formElement", "formElementName"]

  let formElementNameArray = loadPayloadArray(formElementNameKeyArray, data.payload);
  // End of: Load the formElementNameArray dynamically once the payload is known. 

                  
  // Start of: Validate elements in the formElementNameArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  formElementNameArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'formElementName must be of datatype string'});}
  });
  // End of: Validate elements in the formElementNameArray

  // Start of: Load the formElementLabelTextArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let formElementLabelTextKeyArray = ["webPage", "form", "formElement", "formElementLabelText"]

  let formElementLabelTextArray = loadPayloadArray(formElementLabelTextKeyArray, data.payload);
  // End of: Load the formElementLabelTextArray dynamically once the payload is known. 

                  
  // Start of: Validate elements in the formElementLabelTextArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  formElementLabelTextArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'formElementLabelText must be of datatype string'});}
  });
  // End of: Validate elements in the formElementLabelTextArray

  // Start of: Load the feAttributeNameArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let feAttributeNameKeyArray = ["webPage", "form", "formElement", "attribute", "feAttributeName"]

  let feAttributeNameArray = loadPayloadArray(feAttributeNameKeyArray, data.payload);
  // End of: Load the feAttributeNameArray dynamically once the payload is known. 

                  
  // Start of: Validate elements in the feAttributeNameArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  feAttributeNameArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'feAttributeName must be of datatype string'});}
  });
  // End of: Validate elements in the feAttributeNameArray

  // Start of: Load the feAttributeValueArray dynamically once the payload is known.
  // Behavior from meta.js at 8cz4imaqb2wagvl14q9t
  let feAttributeValueKeyArray = ["webPage", "form", "formElement", "attribute", "feAttributeValue"]

  let feAttributeValueArray = loadPayloadArray(feAttributeValueKeyArray, data.payload);
  // End of: Load the feAttributeValueArray dynamically once the payload is known. 

                  
  // Start of: Validate elements in the feAttributeValueArray
  // passIfString
  // Behavior from meta.js at 7n1wj6bz5asgucz6nmkp
  feAttributeValueArray.forEach(function(arrayElement)
  {
    if(typeof(arrayElement[1]) != 'string'){return callback(400, {'Error' : 'feAttributeValue must be of datatype string'});}
  });
  // End of: Validate elements in the feAttributeValueArray

  
  // Check if the deleted flag is of type string and that the value is exactly equal to "true".
  // That would mean the user wants to delete the record. Otherwise the users does not want to delete the record.
  // Set deleted to boolean true if validation is passed otherwise set it to false.
  // Behavior from meta.js at ts2g5rn5uw6mvup58vph
  let deleted = typeof(data.payload.deleted) === 'string' && data.payload.deleted === "true" ? true : false;

  
  //if all fields fail validation then exit this process without writing changes to the table.
  if
  (
    !tableName
    &&  !directory
    &&  !addRoutes
    &&  !allowCodeGeneration
    &&  !dataTypeArray.some(function(element){if(element){return true;}})
    &&  !fieldNameArray.some(function(element){if(element){return true;}})
    &&  !uniqueArray.some(function(element){if(element){return true;}})
    &&  !publishedArray.some(function(element){if(element){return true;}})
    &&  !elementNameArray.some(function(element){if(element){return true;}})
    &&  !labelTextArray.some(function(element){if(element){return true;}})
    &&  !elementTypeArray.some(function(element){if(element){return true;}})
    &&  !attributeNameArray.some(function(element){if(element){return true;}})
    &&  !attributeValueArray.some(function(element){if(element){return true;}})
    &&  !defaultValidationNameArray.some(function(element){if(element){return true;}})
    &&  !defaultValidationValueArray.some(function(element){if(element){return true;}})
    &&  !postValidationNameArray.some(function(element){if(element){return true;}})
    &&  !postValidationValueArray.some(function(element){if(element){return true;}})
    &&  !putValidationNameArray.some(function(element){if(element){return true;}})
    &&  !putValidationValueArray.some(function(element){if(element){return true;}})
    &&  !calculationNameArray.some(function(element){if(element){return true;}})
    &&  !calculationValueArray.some(function(element){if(element){return true;}})
    &&  !webPageTypeArray.some(function(element){if(element){return true;}})
    &&  !webPageHeadingArray.some(function(element){if(element){return true;}})
    &&  !formTypeArray.some(function(element){if(element){return true;}})
    &&  !formHeadingArray.some(function(element){if(element){return true;}})
    &&  !successMessageArray.some(function(element){if(element){return true;}})
    &&  !submitButtonTextArray.some(function(element){if(element){return true;}})
    &&  !formElementNameArray.some(function(element){if(element){return true;}})
    &&  !formElementLabelTextArray.some(function(element){if(element){return true;}})
    &&  !feAttributeNameArray.some(function(element){if(element){return true;}})
    &&  !feAttributeValueArray.some(function(element){if(element){return true;}})
    &&  !deleted
  )
  {
    helpers.log
    (
      5,
      'jvtcvfkbdtjymyand336' + '\n' +
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
        '89drhk0nn4heagh13web' + '\n' +
        'Unable to get the next gsuid.' + '\n' +
        'The following was the error' + '\n' +
        JSON.stringify(error) + '\n'                                   
      ); // End of: helpers.log(...)

      return callback(423, {'Error' : 'Database is Locked'});
    } // End of: If lock failed or unable to get the next gsuid.


    // If we made it here then we were able to lock the gsuid.json file and get 
    // the next unique id number for this record. So continue with the process.


    // Create the metadata object. 
    // This object will be appended to metadata.json.
    // Add in all fields even if no data is available yet. 
    // This is to establish the order in which the fields will be written to the table. 
    // Behavior from 3bd1sa5ve4aqrfspunrt in meta.js         
    let metadataObject = {};
    metadataObject.metadataId = metadataId;

    metadataObject.tableName = tableName;
    metadataObject.directory = directory;
    metadataObject.addRoutes = addRoutes;
    metadataObject.allowCodeGeneration = allowCodeGeneration;

    // Add any fields named "dataTypeArray" to the object we will write to the database.
    metadataObject = buildBranches(dataTypeArray, metadataObject);

    // Add any fields named "fieldNameArray" to the object we will write to the database.
    metadataObject = buildBranches(fieldNameArray, metadataObject);

    // Add any fields named "uniqueArray" to the object we will write to the database.
    metadataObject = buildBranches(uniqueArray, metadataObject);

    // Add any fields named "publishedArray" to the object we will write to the database.
    metadataObject = buildBranches(publishedArray, metadataObject);

    // Add any fields named "elementNameArray" to the object we will write to the database.
    metadataObject = buildBranches(elementNameArray, metadataObject);

    // Add any fields named "labelTextArray" to the object we will write to the database.
    metadataObject = buildBranches(labelTextArray, metadataObject);

    // Add any fields named "elementTypeArray" to the object we will write to the database.
    metadataObject = buildBranches(elementTypeArray, metadataObject);

    // Add any fields named "attributeNameArray" to the object we will write to the database.
    metadataObject = buildBranches(attributeNameArray, metadataObject);

    // Add any fields named "attributeValueArray" to the object we will write to the database.
    metadataObject = buildBranches(attributeValueArray, metadataObject);

    // Add any fields named "defaultValidationNameArray" to the object we will write to the database.
    metadataObject = buildBranches(defaultValidationNameArray, metadataObject);

    // Add any fields named "defaultValidationValueArray" to the object we will write to the database.
    metadataObject = buildBranches(defaultValidationValueArray, metadataObject);

    // Add any fields named "postValidationNameArray" to the object we will write to the database.
    metadataObject = buildBranches(postValidationNameArray, metadataObject);

    // Add any fields named "postValidationValueArray" to the object we will write to the database.
    metadataObject = buildBranches(postValidationValueArray, metadataObject);

    // Add any fields named "putValidationNameArray" to the object we will write to the database.
    metadataObject = buildBranches(putValidationNameArray, metadataObject);

    // Add any fields named "putValidationValueArray" to the object we will write to the database.
    metadataObject = buildBranches(putValidationValueArray, metadataObject);

    // Add any fields named "calculationNameArray" to the object we will write to the database.
    metadataObject = buildBranches(calculationNameArray, metadataObject);

    // Add any fields named "calculationValueArray" to the object we will write to the database.
    metadataObject = buildBranches(calculationValueArray, metadataObject);


    // Add any fields named "webPageTypeArray" to the object we will write to the database.
    metadataObject = buildBranches(webPageTypeArray, metadataObject);

    // Add any fields named "webPageHeadingArray" to the object we will write to the database.
    metadataObject = buildBranches(webPageHeadingArray, metadataObject);

    // Add any fields named "formTypeArray" to the object we will write to the database.
    metadataObject = buildBranches(formTypeArray, metadataObject);

    // Add any fields named "formHeadingArray" to the object we will write to the database.
    metadataObject = buildBranches(formHeadingArray, metadataObject);

    // Add any fields named "successMessageArray" to the object we will write to the database.
    metadataObject = buildBranches(successMessageArray, metadataObject);

    // Add any fields named "submitButtonTextArray" to the object we will write to the database.
    metadataObject = buildBranches(submitButtonTextArray, metadataObject);

    // Add any fields named "formElementNameArray" to the object we will write to the database.
    metadataObject = buildBranches(formElementNameArray, metadataObject);

    // Add any fields named "formElementLabelTextArray" to the object we will write to the database.
    metadataObject = buildBranches(formElementLabelTextArray, metadataObject);

    // Add any fields named "feAttributeNameArray" to the object we will write to the database.
    metadataObject = buildBranches(feAttributeNameArray, metadataObject);

    // Add any fields named "feAttributeValueArray" to the object we will write to the database.
    metadataObject = buildBranches(feAttributeValueArray, metadataObject);

    metadataObject.timeStamp = Date.now();
    metadataObject.deleted = false;

    let dataObject = {};
    dataObject.uniqueField01Name = "tableName";
    dataObject.uniqueField01Value = metadataObject.tableName;
    dataObject.uniqueField02Name = "directory";
    dataObject.uniqueField02Value = metadataObject.directory;
    dataObject.path = '/database/dbMetadata/metadata.json';
    dataObject.queryString = 'WHERE:;metadataId:;MatchesExactly:;' + metadataId + ':;';

    // This function returns the most recent record for this metadataId after checking that 
    // data for unique fields is indeed unique and that the a record with the supplied metadataId exists to modify.
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
                'csxl1wn8lqmua27rv1lz' + '\n' + 
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
                'o9r6hl2yyjfm1y3bnltz' + '\n' +
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


        // Preprocessing for tableName
        if(tableName) // If the user supplied data for tableName
        {
          // No preprocessing was specifed for tableName. Use it as was supplied by the user.
        }
        else // If the user did not supply data for tableName
        {
          // Save tableName from the most recent record.
          metadataObject.tableName = recordObject.tableName;
        }

        // Preprocessing for directory
        if(directory) // If the user supplied data for directory
        {
          // No preprocessing was specifed for directory. Use it as was supplied by the user.
        }
        else // If the user did not supply data for directory
        {
          // Save directory from the most recent record.
          metadataObject.directory = recordObject.directory;
        }

        // Preprocessing for addRoutes
        if(addRoutes) // If the user supplied data for addRoutes
        {
          // No preprocessing was specifed for addRoutes. Use it as was supplied by the user.
        }
        else // If the user did not supply data for addRoutes
        {
          // Save addRoutes from the most recent record.
          metadataObject.addRoutes = recordObject.addRoutes;
        }

        // Preprocessing for allowCodeGeneration
        if(allowCodeGeneration) // If the user supplied data for allowCodeGeneration
        {
          // No preprocessing was specifed for allowCodeGeneration. Use it as was supplied by the user.
        }
        else // If the user did not supply data for allowCodeGeneration
        {
          // Save allowCodeGeneration from the most recent record.
          metadataObject.allowCodeGeneration = recordObject.allowCodeGeneration;
        }

        for (let arrayIndex = 0; arrayIndex < dataTypeArray.length; arrayIndex++) 
        {
          // Preprocessing for field.fieldX.dataType
          if(dataTypeArray[arrayIndex]) // If the user supplied data for field.fieldX.dataType
          {
            // No preprocessing was specifed for field.fieldX.dataType. Use it as was supplied by the user.
          }
          else // If the user did not supply data for field.fieldX.dataType
          {
            // Save field.fieldX.dataType from the most recent record.
            metadataObject.field["field" + arrayIndex.toString()]["dataType"] = dataTypeArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < fieldNameArray.length; arrayIndex++) 
        {
          // Preprocessing for field.fieldX.fieldName
          if(fieldNameArray[arrayIndex]) // If the user supplied data for field.fieldX.fieldName
          {
            // No preprocessing was specifed for field.fieldX.fieldName. Use it as was supplied by the user.
          }
          else // If the user did not supply data for field.fieldX.fieldName
          {
            // Save field.fieldX.fieldName from the most recent record.
            metadataObject.field["field" + arrayIndex.toString()]["fieldName"] = fieldNameArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < uniqueArray.length; arrayIndex++) 
        {
          // Preprocessing for field.fieldX.unique
          if(uniqueArray[arrayIndex]) // If the user supplied data for field.fieldX.unique
          {
            // No preprocessing was specifed for field.fieldX.unique. Use it as was supplied by the user.
          }
          else // If the user did not supply data for field.fieldX.unique
          {
            // Save field.fieldX.unique from the most recent record.
            metadataObject.field["field" + arrayIndex.toString()]["unique"] = uniqueArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < publishedArray.length; arrayIndex++) 
        {
          // Preprocessing for field.fieldX.published
          if(publishedArray[arrayIndex]) // If the user supplied data for field.fieldX.published
          {
            // No preprocessing was specifed for field.fieldX.published. Use it as was supplied by the user.
          }
          else // If the user did not supply data for field.fieldX.published
          {
            // Save field.fieldX.published from the most recent record.
            metadataObject.field["field" + arrayIndex.toString()]["published"] = publishedArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < elementNameArray.length; arrayIndex++) 
        {
          // Preprocessing for defaultElement.defaultElementX.elementName
          if(elementNameArray[arrayIndex]) // If the user supplied data for defaultElement.defaultElementX.elementName
          {
            // No preprocessing was specifed for defaultElement.defaultElementX.elementName. Use it as was supplied by the user.
          }
          else // If the user did not supply data for defaultElement.defaultElementX.elementName
          {
            // Save defaultElement.defaultElementX.elementName from the most recent record.
            metadataObject.defaultElement["defaultElement" + arrayIndex.toString()]["elementName"] = elementNameArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < labelTextArray.length; arrayIndex++) 
        {
          // Preprocessing for defaultElement.defaultElementX.labelText
          if(labelTextArray[arrayIndex]) // If the user supplied data for defaultElement.defaultElementX.labelText
          {
            // No preprocessing was specifed for defaultElement.defaultElementX.labelText. Use it as was supplied by the user.
          }
          else // If the user did not supply data for defaultElement.defaultElementX.labelText
          {
            // Save defaultElement.defaultElementX.labelText from the most recent record.
            metadataObject.defaultElement["defaultElement" + arrayIndex.toString()]["labelText"] = labelTextArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < elementTypeArray.length; arrayIndex++) 
        {
          // Preprocessing for defaultElement.defaultElementX.elementType
          if(elementTypeArray[arrayIndex]) // If the user supplied data for defaultElement.defaultElementX.elementType
          {
            // No preprocessing was specifed for defaultElement.defaultElementX.elementType. Use it as was supplied by the user.
          }
          else // If the user did not supply data for defaultElement.defaultElementX.elementType
          {
            // Save defaultElement.defaultElementX.elementType from the most recent record.
            metadataObject.defaultElement["defaultElement" + arrayIndex.toString()]["elementType"] = elementTypeArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < attributeNameArray.length; arrayIndex++) 
        {
          // Preprocessing for attribute.attributeX.attributeName
          if(attributeNameArray[arrayIndex]) // If the user supplied data for attribute.attributeX.attributeName
          {
            // No preprocessing was specifed for attribute.attributeX.attributeName. Use it as was supplied by the user.
          }
          else // If the user did not supply data for attribute.attributeX.attributeName
          {
            // Save attribute.attributeX.attributeName from the most recent record.
            metadataObject.attribute["attribute" + arrayIndex.toString()]["attributeName"] = attributeNameArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < attributeValueArray.length; arrayIndex++) 
        {
          // Preprocessing for attribute.attributeX.attributeValue
          if(attributeValueArray[arrayIndex]) // If the user supplied data for attribute.attributeX.attributeValue
          {
            // No preprocessing was specifed for attribute.attributeX.attributeValue. Use it as was supplied by the user.
          }
          else // If the user did not supply data for attribute.attributeX.attributeValue
          {
            // Save attribute.attributeX.attributeValue from the most recent record.
            metadataObject.attribute["attribute" + arrayIndex.toString()]["attributeValue"] = attributeValueArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < defaultValidationNameArray.length; arrayIndex++) 
        {
          // Preprocessing for default.defaultX.defaultValidationName
          if(defaultValidationNameArray[arrayIndex]) // If the user supplied data for default.defaultX.defaultValidationName
          {
            // No preprocessing was specifed for default.defaultX.defaultValidationName. Use it as was supplied by the user.
          }
          else // If the user did not supply data for default.defaultX.defaultValidationName
          {
            // Save default.defaultX.defaultValidationName from the most recent record.
            metadataObject.default["default" + arrayIndex.toString()]["defaultValidationName"] = defaultValidationNameArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < defaultValidationValueArray.length; arrayIndex++) 
        {
          // Preprocessing for default.defaultX.defaultValidationValue
          if(defaultValidationValueArray[arrayIndex]) // If the user supplied data for default.defaultX.defaultValidationValue
          {
            // No preprocessing was specifed for default.defaultX.defaultValidationValue. Use it as was supplied by the user.
          }
          else // If the user did not supply data for default.defaultX.defaultValidationValue
          {
            // Save default.defaultX.defaultValidationValue from the most recent record.
            metadataObject.default["default" + arrayIndex.toString()]["defaultValidationValue"] = defaultValidationValueArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < postValidationNameArray.length; arrayIndex++) 
        {
          // Preprocessing for post.postX.postValidationName
          if(postValidationNameArray[arrayIndex]) // If the user supplied data for post.postX.postValidationName
          {
            // No preprocessing was specifed for post.postX.postValidationName. Use it as was supplied by the user.
          }
          else // If the user did not supply data for post.postX.postValidationName
          {
            // Save post.postX.postValidationName from the most recent record.
            metadataObject.post["post" + arrayIndex.toString()]["postValidationName"] = postValidationNameArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < postValidationValueArray.length; arrayIndex++) 
        {
          // Preprocessing for post.postX.postValidationValue
          if(postValidationValueArray[arrayIndex]) // If the user supplied data for post.postX.postValidationValue
          {
            // No preprocessing was specifed for post.postX.postValidationValue. Use it as was supplied by the user.
          }
          else // If the user did not supply data for post.postX.postValidationValue
          {
            // Save post.postX.postValidationValue from the most recent record.
            metadataObject.post["post" + arrayIndex.toString()]["postValidationValue"] = postValidationValueArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < putValidationNameArray.length; arrayIndex++) 
        {
          // Preprocessing for put.putX.putValidationName
          if(putValidationNameArray[arrayIndex]) // If the user supplied data for put.putX.putValidationName
          {
            // No preprocessing was specifed for put.putX.putValidationName. Use it as was supplied by the user.
          }
          else // If the user did not supply data for put.putX.putValidationName
          {
            // Save put.putX.putValidationName from the most recent record.
            metadataObject.put["put" + arrayIndex.toString()]["putValidationName"] = putValidationNameArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < putValidationValueArray.length; arrayIndex++) 
        {
          // Preprocessing for put.putX.putValidationValue
          if(putValidationValueArray[arrayIndex]) // If the user supplied data for put.putX.putValidationValue
          {
            // No preprocessing was specifed for put.putX.putValidationValue. Use it as was supplied by the user.
          }
          else // If the user did not supply data for put.putX.putValidationValue
          {
            // Save put.putX.putValidationValue from the most recent record.
            metadataObject.put["put" + arrayIndex.toString()]["putValidationValue"] = putValidationValueArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < calculationNameArray.length; arrayIndex++) 
        {
          // Preprocessing for calculation.calculationX.calculationName
          if(calculationNameArray[arrayIndex]) // If the user supplied data for calculation.calculationX.calculationName
          {
            // No preprocessing was specifed for calculation.calculationX.calculationName. Use it as was supplied by the user.
          }
          else // If the user did not supply data for calculation.calculationX.calculationName
          {
            // Save calculation.calculationX.calculationName from the most recent record.
            metadataObject.calculation["calculation" + arrayIndex.toString()]["calculationName"] = calculationNameArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < calculationValueArray.length; arrayIndex++) 
        {
          // Preprocessing for calculation.calculationX.calculationValue
          if(calculationValueArray[arrayIndex]) // If the user supplied data for calculation.calculationX.calculationValue
          {
            // No preprocessing was specifed for calculation.calculationX.calculationValue. Use it as was supplied by the user.
          }
          else // If the user did not supply data for calculation.calculationX.calculationValue
          {
            // Save calculation.calculationX.calculationValue from the most recent record.
            metadataObject.calculation["calculation" + arrayIndex.toString()]["calculationValue"] = calculationValueArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < webPageTypeArray.length; arrayIndex++) 
        {
          // Preprocessing for webPage.webPageX.webPageType
          if(webPageTypeArray[arrayIndex]) // If the user supplied data for webPage.webPageX.webPageType
          {
            // No preprocessing was specifed for webPage.webPageX.webPageType. Use it as was supplied by the user.
          }
          else // If the user did not supply data for webPage.webPageX.webPageType
          {
            // Save webPage.webPageX.webPageType from the most recent record.
            metadataObject.webPage["webPage" + arrayIndex.toString()]["webPageType"] = webPageTypeArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < webPageHeadingArray.length; arrayIndex++) 
        {
          // Preprocessing for webPage.webPageX.webPageHeading
          if(webPageHeadingArray[arrayIndex]) // If the user supplied data for webPage.webPageX.webPageHeading
          {
            // No preprocessing was specifed for webPage.webPageX.webPageHeading. Use it as was supplied by the user.
          }
          else // If the user did not supply data for webPage.webPageX.webPageHeading
          {
            // Save webPage.webPageX.webPageHeading from the most recent record.
            metadataObject.webPage["webPage" + arrayIndex.toString()]["webPageHeading"] = webPageHeadingArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < formTypeArray.length; arrayIndex++) 
        {
          // Preprocessing for form.formX.formType
          if(formTypeArray[arrayIndex]) // If the user supplied data for form.formX.formType
          {
            // No preprocessing was specifed for form.formX.formType. Use it as was supplied by the user.
          }
          else // If the user did not supply data for form.formX.formType
          {
            // Save form.formX.formType from the most recent record.
            metadataObject.form["form" + arrayIndex.toString()]["formType"] = formTypeArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < formHeadingArray.length; arrayIndex++) 
        {
          // Preprocessing for form.formX.formHeading
          if(formHeadingArray[arrayIndex]) // If the user supplied data for form.formX.formHeading
          {
            // No preprocessing was specifed for form.formX.formHeading. Use it as was supplied by the user.
          }
          else // If the user did not supply data for form.formX.formHeading
          {
            // Save form.formX.formHeading from the most recent record.
            metadataObject.form["form" + arrayIndex.toString()]["formHeading"] = formHeadingArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < successMessageArray.length; arrayIndex++) 
        {
          // Preprocessing for form.formX.successMessage
          if(successMessageArray[arrayIndex]) // If the user supplied data for form.formX.successMessage
          {
            // No preprocessing was specifed for form.formX.successMessage. Use it as was supplied by the user.
          }
          else // If the user did not supply data for form.formX.successMessage
          {
            // Save form.formX.successMessage from the most recent record.
            metadataObject.form["form" + arrayIndex.toString()]["successMessage"] = successMessageArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < submitButtonTextArray.length; arrayIndex++) 
        {
          // Preprocessing for form.formX.submitButtonText
          if(submitButtonTextArray[arrayIndex]) // If the user supplied data for form.formX.submitButtonText
          {
            // No preprocessing was specifed for form.formX.submitButtonText. Use it as was supplied by the user.
          }
          else // If the user did not supply data for form.formX.submitButtonText
          {
            // Save form.formX.submitButtonText from the most recent record.
            metadataObject.form["form" + arrayIndex.toString()]["submitButtonText"] = submitButtonTextArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < formElementNameArray.length; arrayIndex++) 
        {
          // Preprocessing for formElement.formElementX.formElementName
          if(formElementNameArray[arrayIndex]) // If the user supplied data for formElement.formElementX.formElementName
          {
            // No preprocessing was specifed for formElement.formElementX.formElementName. Use it as was supplied by the user.
          }
          else // If the user did not supply data for formElement.formElementX.formElementName
          {
            // Save formElement.formElementX.formElementName from the most recent record.
            metadataObject.formElement["formElement" + arrayIndex.toString()]["formElementName"] = formElementNameArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < formElementLabelTextArray.length; arrayIndex++) 
        {
          // Preprocessing for formElement.formElementX.formElementLabelText
          if(formElementLabelTextArray[arrayIndex]) // If the user supplied data for formElement.formElementX.formElementLabelText
          {
            // No preprocessing was specifed for formElement.formElementX.formElementLabelText. Use it as was supplied by the user.
          }
          else // If the user did not supply data for formElement.formElementX.formElementLabelText
          {
            // Save formElement.formElementX.formElementLabelText from the most recent record.
            metadataObject.formElement["formElement" + arrayIndex.toString()]["formElementLabelText"] = formElementLabelTextArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < feAttributeNameArray.length; arrayIndex++) 
        {
          // Preprocessing for attribute.attributeX.feAttributeName
          if(feAttributeNameArray[arrayIndex]) // If the user supplied data for attribute.attributeX.feAttributeName
          {
            // No preprocessing was specifed for attribute.attributeX.feAttributeName. Use it as was supplied by the user.
          }
          else // If the user did not supply data for attribute.attributeX.feAttributeName
          {
            // Save attribute.attributeX.feAttributeName from the most recent record.
            metadataObject.attribute["attribute" + arrayIndex.toString()]["feAttributeName"] = feAttributeNameArray[arrayIndex];
          }
        } 

        for (let arrayIndex = 0; arrayIndex < feAttributeValueArray.length; arrayIndex++) 
        {
          // Preprocessing for attribute.attributeX.feAttributeValue
          if(feAttributeValueArray[arrayIndex]) // If the user supplied data for attribute.attributeX.feAttributeValue
          {
            // No preprocessing was specifed for attribute.attributeX.feAttributeValue. Use it as was supplied by the user.
          }
          else // If the user did not supply data for attribute.attributeX.feAttributeValue
          {
            // Save attribute.attributeX.feAttributeValue from the most recent record.
            metadataObject.attribute["attribute" + arrayIndex.toString()]["feAttributeValue"] = feAttributeValueArray[arrayIndex];
          }
        } 

        // If we are appending a delete make sure that everything else is coming from the most recent saved record.
        if(deleted)
        {
          metadataObject = {};
          metadataObject.metadataId = metadataId;
          metadataObject.tableName = recordObject.tableName;
          metadataObject.directory = recordObject.directory;
          metadataObject.addRoutes = recordObject.addRoutes;
          metadataObject.allowCodeGeneration = recordObject.allowCodeGeneration;
          metadataObject.field = recordObject.field;
          metadataObject.webPage = recordObject.webPage;
          metadataObject.timeStamp = Date.now();
          metadataObject.deleted = true;
        }
        else
        {
          metadataObject.deleted = false;
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
          "process" : "metadata._metadata.put",
          "comment" : "Changing a record",
          "who" : "No login yet.",    
          "metadata" : metadataObject   
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
              // Calling the function which appends a record to the file metadata.json
              _data.append
              (
                '/database/dbMetadata', 
                'metadata', 
                metadataObject, 
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
                          'o8d504j7c7vjldeqz89a' + '\n' +
                          'Successful write to metadata but unable to remove lock on database' + '\n' +
                          'The following record was appended to metadata:' + '\n' +                            
                          JSON.stringify(logObject) + '\n' +   
                          'The following was the error message:' + '\n' +                                             
                          error + '\n'
                        ); // End of: helpers.log // Log the error.

                        callback(500, {'Error' : 'Successful write to metadata but unable to remove lock on database'});

                      } // End of: else Good write but unable to remove lock on database.

                    } // End of callback code which is run after attempting to remove the lock.
                    ); // End of: _data.removeLock(function(error){...}
                    // End of: Call to function which removes lock

                  }    // End of: if (!err)  //The file has been appended to successfully.
                  else // There was an error appending to metadata.
                  {
                    helpers.log // Log the error.
                    (
                      5,
                      'd4a2j5ykxl7ndu52oqyj' + '\n' +
                      'There was an error when appending to the metadata file.' + '\n' +
                      'The following record may or may not have been appended to metadata:' + '\n' +                            
                      JSON.stringify(logObject) + '\n' +
                      'Attempting to rollback the entry.' + '\n' +    
                      'The following was the error message:' + '\n' +                                             
                      err + '\n'
                    );

                    // Assemble rollback record for the metadata file which will negate previous entry if any.
                    // Behavior from meta.js at 8l4zwqs63qwmp81rjcpw  
                    metadataObject = 
                    {
                        "metadataId" : recordObject.nextId,
                        "tableName" : recordObject.tableName,
                        "directory" : recordObject.directory,
                        "addRoutes" : recordObject.addRoutes,
                        "allowCodeGeneration" : recordObject.allowCodeGeneration,
                        "field" : recordObject.field,
                        "webPage" : recordObject.webPage,
                        "timeStamp" : recordObject.timeStamp,
                        "deleted" : recordObject.deleted
                    };                        

                    // Assemble rollback record for the history file which will negate previous entry if any.
                    logObject =
                    {                    
                      "historyId" : nextIdObject.nextId + 3,    
                      "transactionId" : nextIdObject.nextId + 2,                                
                      "rollback" : true,
                      "process" : "metadata._metadata.put",
                      "comment" : "Error during Put. Appending rollback",                        
                      "who" : "No login yet",    
                      "metadata" : metadataObject   
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
                          // Calling the function which appends a record to the file metadata.json
                          _data.append
                          (
                            '/database/dbMetadata', 
                            'metadata', 
                            metadataObject, 
                            function(err)
                            {
                              if (!err) // The rollback record for metadata was appended successfully.
                              {
                                helpers.log
                                (
                                  5,
                                  'qhsaixeznnh21qo9mh5e' + '\n' +
                                  'Rollback entry in the metadata file was appended successfully' + '\n' +
                                  'The following was the record we rolled back:' + '\n' +
                                  JSON.stringify(logObject) + '\n'                                   
                                ); // End of: helpers.log(...)
                              }
                              else // There was an error when rolling back record for metadata.
                              {
                                helpers.log
                                (
                                  7,
                                  'fs3cev9otwbsjdiw02mj' + '\n' +
                                  'There was an error appending a rollback entry in the metadata file' + '\n' +
                                  'The following record may or may not have been rolled back:' + '\n' +
                                  JSON.stringify(logObject) + '\n' +   
                                  'An error here does not necessarily mean the deleting append to metadata did not happen.' + '\n' +                                        
                                  'CHECK TO SEE IF history and metadata ARE STILL IN SYNC' + '\n' + 
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
                            '1cuzvt2l1muakjdowbpx' + '\n' +
                            'There was an error appending a rollback entry in the history file' + '\n' +
                            'A rollback entry may or may not have been written in the metadata file' + '\n' +  
                            'CHECK TO SEE IF history and metadata ARE STILL IN SYNC' + '\n' +                                      
                            'The following was the record we tried to roll back:' + '\n' +
                            JSON.stringify(logObject) + '\n' +        
                            'The following is the error message:' + '\n' +
                            err  + '\n'
                          );
                        } // End of: else There was an error when appending a rollback entry in history.
                      } // End of: callback function(err){...}
                    ); // End of: _data.append(...)

                    callback(500, {'Error' : 'Could not create the new metadata.'});

                  } // End of: else // There was an error appending to metadata.
                } // End of: callback function
                ); // End of: Calling the function which appends a record to the file metadata.json 

            } //End of: The history file has been appended to successfully.
            else // There was an error appending to the history file.
            {
              helpers.log
              (
                7,
                'asqhmk3xqk6wpaomhmrk' + '\n' +
                'There was an error appending to the history file' + '\n' +
                'An error here does not necessarily mean the append to history did not happen.' + '\n' +  
                'But an error at this point in the code surely means there was no append to metadata' + '\n' +                                          
                'CHECK TO SEE IF history and metadata ARE STILL IN SYNC' + '\n' +                    
                'The following was the record we tried to append:' + '\n' +
                JSON.stringify(logObject) + '\n' +                   
                'The following is the error message:' + '\n' +                  
                err  + '\n'
              );

              callback(500, {'Error' : 'Could not create the new metadata.'});
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
              'gc1yjpz44dk9kd7cu7by' + '\n' + 
              'Pipeline error. The message was as follows' + '\n' +                                             
              pipelineError + '\n'                                                 
            ); // End of: helpers.log // Log the error.
          } // End of: if(pipelineError){...}
        } // End of: function(piplineError){...}
      ); // End of: Pipeline
    }); //End of: helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)
  }); // End of: lib.nextId(function(err, nextIdObject)
}; // End of: handlers._metadata.put = function(...
// End of: Define the metadata put subhandler function




// Define the metadata get subhandler function.
// Streams the metadata file or part of it back to the client.
metadata._metadata.get = function(data, callback)
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
      // In this case the queryString is coming from metadataEdit page.
      queryString = data.queryString
    }
    else
    {
      // In this case the queryString is coming from the metadataList page.
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
    let proceedWithLoop = true;

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


  
  // Create an empty map data structure which will be used to merge metadata records that have the same unique fields.
  // Chose map data structure over objects because maps are guaranteed to maintain the same order where as objects are not.
  let metadataMap = new Map();
  
  // This function sets up a stream where each chunk of data is a complete line in the metadata file.
  let readInterface = readline.createInterface
  (
    { // specify the file to be read.
      input: fs.createReadStream(_data.baseDir + '/database/dbMetadata' + '/' + 'metadata' + '.json'),
    }
  );



  // Look at each record in the file.
  readInterface.on('line', function(line) 
  {
    // Convert the JSON string (a single line from the metadata file) into lineValueObject.
    // These objects will written back to a new file after deleting some un-needed key/value pairs.
    let lineValueObject = JSON.parse(line);
    let recordWasDeleted = false;    

    // Declare a variable to serve as a key in the map to manage the lineValueObject.
    let metadataId = lineValueObject.metadataId;      

    if(lineValueObject.deleted === true) // if the record in the file metadata.json had the delete field set to true:
    {
      // Remove this record from the map 
      metadataMap.delete(metadataId);
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
            metadataMap.delete(metadataId);
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
      metadataMap.set(metadataId, lineValueObject);
    }

  }); // End of: readInterface.on('line', function(line){...}
  // End of: Look at each record...


  // This listener fires after we have looked through all the records in the metadata file.
  // The callback function defined here will stream the metadata list back to the clients browser.
  readInterface.on('close', function() 
  {          
    // This readable stream will be used to write the result of the merge to a new file.
    const sourceStream = new Readable(); 

    for (const [key, valueObject] of metadataMap)
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

}; // End of: handlers._metadata.get = function(data, callback){do stuff}
// End of: Define the metadata get subhandler function.  




// A payloadArray is used to validate and save nested data to the database.
// Declaring function used to load a payloadArray dynamically once the payload is known.  
// Behavior from meta.js at defq4ols90h44rvcw8st
function loadPayloadArray(payloadKeyArray, payloadObject)
{     
  let payloadArray = Object.entries(payloadObject).filter
  (
    // Checking if this object property belongs in our payloadArray.
    function(examElement)
    {
      let passExamElement = true;

      let splitExamElementArray = examElement[0].split("_");

      payloadKeyArray.forEach
      (
        function(payloadKeyArrayElement, payloadKeyArrayIndex)
        {

          // If this is the first element in payloadKeyArray
          if(payloadKeyArrayIndex === 0)
          {
            if(splitExamElementArray[0] != payloadKeyArrayElement)
            {
              passExamElement = false;
            }
          }
          // Else If: Not first nor the last element in payloadKeyArray
          else if(payloadKeyArrayIndex != payloadKeyArray.length - 1) 
          {
            if(splitExamElementArray[payloadKeyArrayIndex * 2] != payloadKeyArrayElement)
            {
              passExamElement = false;
            }
          }
          // Else: Must be the last element in payloadKeyArray
          else 
          {
            if(splitExamElementArray[splitExamElementArray.length -1] != payloadKeyArrayElement)
            {
              passExamElement = false;
            }
          }

        } // End of: function(payloadKeyArrayElement, payloadKeyArrayIndex){...}
      ) // End of: payloadKeyArray.forEach(...)

      return passExamElement

    } // End of: function(examElement){...}
  ); // End of: let payloadArray = Object.entries(payloadObject).filter

  return payloadArray

}; // End of: function loadPayloadArray(payloadKeyArray, payloadObject){...}
// End of: Declare a function that we will use to load the payloadArray dynamically once the payload is known. 




// Define a function to load nested data which has been validated into the object we will write to the database.
function buildBranches(fieldArray, persistObject)
{
  // Loop through the fieldArray which contains nested data from the client.
  fieldArray.forEach
  (
    // Perform the following function on every element in the fieldArray.
    function(fieldArrayElement)
    {
      // Get a reference to the object tree so we can build branches.
      let objectBranch = persistObject;  

      // Make an array from the path string splitting it on the underscore.
      // The elements tell us what to name the branches.
      fieldArrayElement[0].split("_").forEach
      (
        // Perform the following function for every element in fieldArrayElement.
        function(pathArrayElement, pathArrayIndex, pathArray)
        {
          // If we are not on the last one - we are building branches of this object.
          if(pathArrayIndex < pathArray.length - 1)
          {
            // If the branch does not exist...
            if(!objectBranch[pathArrayElement])
            {
              // Create the branch
              objectBranch[pathArrayElement] = {};

              // Jump onto the new branch
              objectBranch = objectBranch[pathArrayElement];
            } // End of: If the branch does not exist.
            else // The branch exists. It was made in a previous loop
            {
              // Jump onto the existing branch
              objectBranch = objectBranch[pathArrayElement];                  
            } // End of: Else - The branch exists. It was made in a previous loop
          } // End of: If we are not on the last one...
          else // This is the last element which holds the name of the field. We are inserting the value.
          {
            // Put a leaf at the end of the current branch and asign the value for the field we are saving to the database.
            objectBranch[pathArrayElement] = fieldArrayElement[1];
          } // End of: Else - This is the last element ...
        } // End of: function(pathArrayElement, pathArrayIndex, pathArray){...}
      ) // fieldArrayElement[0].split("_").forEach(...)
    } // End of: function(fieldArrayElement){...}
  ) // End of: fieldArray.forEach(...)

  return persistObject;

} // End of: function buildBranches(fieldArray, persistObject){...}
// End of: Define a function to load nested data which has been validated into the object we will write to the database.


// Export the module
module.exports = metadata;


