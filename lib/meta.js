/*
/
/ For managing data dictionary and for building the accounting system from metadata.
/ Tables must be named in the singular and camelCase. "customer not customers"
/ 
/
*/

// Dependencies
const fs = require('fs');
const path = require('path');
const { pipeline, Readable, Writable } = require('stream');
const StringDecoder = require('string_decoder').StringDecoder;
const helpers = require('./aHelpers');





// Define the container to hold data and functions for managing the data dictionary and for building the accounting system.
var meta = {};

// Define the base directory of the accounting folder.
meta.baseDir = path.join(__dirname, '/../accounting/');

// Define the branch of the meta object which will hold the functions used to build the accounting system.
meta.build = {}




// Define a function which builds a webpage for 
// adding records to a json table in the database.
meta.build.addWebPage = function(tableId)
{
  // This object tells the getMostRecent function which record to retrive in the data dictionary (metadata.json)
  let dataObject = {};
  dataObject.uniqueField01Value = ""; // We are not trying to write to the table so no need to enforce uniqueness.
  dataObject.uniqueField01Name = "table.tableName";           
  dataObject.path = '/dbMetadata/metadata.json';
  dataObject.queryString = 'WHERE:;tableId:;MatchesExactly:;' + tableId + ':;';  

  let recordObject;

  // Collect information about the webpage from the metadata.
  // 1. Look in metadata.json - Read the object for the given tableId.
  helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)
  {
    if(!errorFromGetMostRecent) // Got the most recent record from getMostRecent
    {
      // Used to decode the payload buffer into readable text.
      let decoder = new StringDecoder('utf8');    

      // This instance of the Writable object gives us a place for a callback to run when the payload is received.
      const writable = new Writable();

      // Called by pipeline below. Does something useful with the payload
      writable.write = function(payload)     
      {
        let stringContainer = '';                 
        stringContainer = stringContainer + decoder.write(payload);
        recordObject = JSON.parse(stringContainer);
 
        // All the metadata for the table is in record object.
        // Assemble the webpage string from the metadata in recordObject

        // This will hold the html text of the webpage.
        let htmlString = 
        "<h1>" + recordObject.webPages.addPage.heading + "</h1>" + "\n" +
        "<h2>" + recordObject.webPages.addPage.forms.addForm.heading + "</h2>" + "\n" +
        "\n" + 
        "<div class=\"formWrapper\">" + "\n" +
        "  <form id=\"" + recordObject.table.tableName + "Add\" action=\"/api/" + recordObject.table.tableName + "\" method=\"POST\">" + "\n" +
        "    <div class=\"formError\"></div>" + "\n";

        // Start of: Add field controls to the html.       

        // Start of: Create one defaultElements object combining the key/value pairs of all the defaultElements objects that might exist in a table.

        // These defaultElements may not have the same name as the table fields.
        // For instance: The "hashedPassword" field in the user file is fed from the "password" defaultElement.
        // So first make an array of the field names.
        let keysOfFieldsArray = Object.keys(recordObject.fields);

        // Make a single object containing the key/value pairs found inside the defaultElements of each field.
        let combinedDefaultElementsObject = {};
        
        // There may be more than one default element for each field 
        // (Consider velocity calculated from both time and distance elements.) 
        // Or there may be no default elements for a field in which case they can still 
        // be assigned later in the formElements object if desired.
        // So loop through keysOfFieldsArray add key/value pairs found in the defaultElements 
        // object of each field and add them to combinedDefaultElementObject.
        keysOfFieldsArray.forEach(function (elementValue)
        {
          // Create an object of default elements for a field.
          let defaultElementsObject = recordObject.fields[elementValue].defaultElements;

          // Loop through defaultElementsObject.
          for (let key in defaultElementsObject) 
          {
            // Grab each defaultElement and copy to an object which will hold all defaultElements for the table.
            combinedDefaultElementsObject[key] = defaultElementsObject[key];
          }

        }); // End of: keysOfFieldsArray.forEach(function (elementValue, elementIndex, keysOfFieldsArray)

        // End of: Create one combinedDefaultElementsObject object combining the key/value pairs of all the defaultElements objects that might exist for each field.      
        
        // Make an array of keys in the formElements object. Used to deep merge defaultElements with formElements.
        // There will only be one form on the add page so, for now, no need to loop through the forms object.       
        let keysOfFormElementsArray = Object.keys(recordObject.webPages.addPage.forms.addForm.formElements);

        // Deep merge the defaultElements with formElements - formElements taking precedence.
        keysOfFormElementsArray.forEach(function (elementValue)
        {
          let mergedElements = extend(true, combinedDefaultElementsObject[elementValue], recordObject.webPages.addPage.forms.addForm.formElements[elementValue]);

          // Now we have enough information to build the input elements for the webpage.
          htmlString = htmlString +
          "    <div class=\"inputWrapper\">" + "\n" +
          "      <div class=\"inputLabel\">" + mergedElements.labelText + "</div>" + "\n" +
          "      <input type=\"" + mergedElements.attributes.type + "\" name=\"" + mergedElements.attributes.name + "\" placeholder=\"" + mergedElements.attributes.placeholder + "\" />" + "\n" +
          "    </div>" + "\n";
        });

        // End of: Add field controls to the html.        

        // Finish the form with the submit button.
        htmlString = htmlString +        
        "    <div class=\"inputWrapper ctaWrapper smallTopMargin\">" + "\n" +
        "      <button type=\"submit\" class=\"cta blue\">" + recordObject.webPages.addPage.forms.addForm.submitButtonText + "</button>" + "\n" +
        "    </div>" + "\n" +
        "  </form>" + "\n" +
        "</div>";

        // Write out the HTML page to a file.

        let fileExtension = ".html";

        // Call the function which appends a string to a file 
        // then process anonymous callback function defined here.
        meta.append
        (
          recordObject.webPages.directory, 
          recordObject.table.tableName + "Add", 
          fileExtension,
          htmlString, 
          function(err)
          {
            if (!err) // The html string was written successfully to a file.
            {
              helpers.log
              (
              5,
              'rf3z3xrz7bquiy9dqeci' + '\n' +
              'The web page ' + recordObject.table.tableName + "Add" + '.html was written successfully to a file.' + '\n'                                  
              ); // End of: helpers.log(...)
            }
            else // There was an error writing the HTML string to a file.
            {
              helpers.log
              (
              7,
              'b2sbc2t9l2lo06tkwxkj' + '\n' +
              'There was an error writing the html string to a file' + '\n'
              ); // End of: helpers.log(...)
            } // End of: else there was an error writing the HTML string to a file.
          } // End of: callback function(err){...}
        ); // End of: _data.append(...)


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
              'lfywxqkxg2am7df6ozhl' + '\n' + 
              'Pipeline error. The message was as follows' + '\n' +                                             
              pipelineError + '\n'                                                 
            ); // End of: helpers.log // Log the error.
          } // End of: if(pipelineError){...}
        } // End of: function(piplineError){...}
      ); // End of: Pipeline

    } // End of: if(!error) Got the most recent record from getMostRecent
    else // There was indeed an error returned by getMostRecent when attempting to get the most current record.
    {
      helpers.log // Log the error.
      (
        7,
        'bxpa2p2t7ps3wrd1dqu7' + '\n' + 
        'The following was the error message from getMostRecent:' + '\n' +                                             
        errorFromGetMostRecent + '\n'                                                 
      ); // End of: helpers.log // Log the error.
    } // End of: Else // There was indeed an error returned by getHashedPass when attempting to get the most current record. 
  }); //End of: helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)  

}// End of: meta.build.addWebPage = function(tableId){...}



/*
// Define a function which builds a web page for 
// editing records to a json table in the database.
meta.build.editWebPage = function(tableId)
{
  let dataObject = {};
  dataObject.uniqueField01Value = ""; // We are not trying to write to the table so no need to enforce uniqueness.
  dataObject.uniqueField01Name = "table.tableName";           
  dataObject.path = '/dbMetadata/metadata.json';
  dataObject.queryString = 'WHERE:;tableId:;MatchesExactly:;' + tableId + ':;';  

  let recordObject; // Declare at top of function so that we will have access to it throughout.

  // Collect information about the webpage from the metadata.
  // 1. Look in metadata.json - Read the object for the given tableId.
  helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)
  {
    if(!errorFromGetMostRecent) // Got the most recent record from getMostRecent
    {
      // Used to decode the payload buffer into readable text.
      let decoder = new StringDecoder('utf8');    

      // This instance of the Writable object gives us a place for a callback to run when the payload is received.
      const writable = new Writable();

      // Called by pipeline below. Does something useful with the payload
      writable.write = function(payload)     
      {
        let stringContainer = '';                 
        stringContainer = stringContainer + decoder.write(payload);
        recordObject = JSON.parse(stringContainer);
 
        // All the metadata for the table is in record object.
        // Assemble the webpage string from the metadata in recordObject

        // This assemble the html text of applicable to the entire webpage.
        let htmlString = 
        "<h1>" + recordObject.webPages.editPage.heading + "</h1>" + "\n" + "\n" +
        "<hr />" + "\n" +"\n" +
        "<h2>" + recordObject.webPages.addPage.forms.editForm.heading + "</h2>" + "\n" + "\n" +
        "\n";

        // Get the forms object of the edit page.
        let formsObject = recordObject.webPages.editPage.forms;


        // Loop through formsObject to build each form.
        for (let key in formsObject) 
        {

          htmlString = htmlString + 
          "<div class=\"formWrapper\">" + "\n" +
          "  <form id=\"" + recordObject.table.tableName + key + "\" action=\"/api/" + recordObject.table.tableName + "\" method=\"PUT\">" + "\n" +
          "    <div class=\"formError\"></div>" + "\n" +
          "<div class=\"formSuccess\">Your Changes Have Been Saved</div>" + "/n" +
          "    <div class=\"inputWrapper\">" + "\n" +
          "      <div class=\"inputLabel\">" + recordObject.table.tableName + "Id</div>" + "\n" +
          "      <input class=\"disabled\" type=\"text\" name=\"" + recordObject.table.tableName + "Id" + "\" value=\"{selected." + recordObject.table.tableName + "Id"  + "}\" disabled/>"  + "\n" +
          "    </div>" + "\n";

          // Start of: Add field controls to the html.       

          // Start of: Create one defaultElements object combining the key/value pairs of all the defaultElements objects that might exist in a table.

          // These defaultElements may not have the same name as the table fields.
          // For instance: The "hashedPassword" field in the user file is fed from the "password" defaultElement.
          // So first make an array of the field names.
          let keysOfFieldsArray = Object.keys(recordObject.fields);

          // Make a single object containing the key/value pairs found inside the defaultElements of each field.
          let combinedDefaultElementsObject = {};
          
          // There may be more than one default element for each field 
          // (Consider velocity calculated from both time and distance elements.) 
          // Or there may be no default elements for a field in which case they can still 
          // be assigned later in the formElements object if desired.
          // So loop through keysOfFieldsArray add key/value pairs found in the defaultElements 
          // object of each field and add them to combinedDefaultElementObject.
          keysOfFieldsArray.forEach(function (elementValue)
          {
            // Create an object of default elements for a field.
            let defaultElementsObject = recordObject.fields[elementValue].defaultElements;

            // Loop through defaultElementsObject.
            for (let key in defaultElementsObject) 
            {
              // Grab each defaultElement and copy to an object which will hold all defaultElements for the table.
              combinedDefaultElementsObject[key] = defaultElementsObject[key];
            }

          }); // End of: keysOfFieldsArray.forEach(function (elementValue, elementIndex, keysOfFieldsArray)

          // End of: Create one combinedDefaultElementsObject object combining the key/value pairs of all the defaultElements objects that might exist for each field.      
          
          // Make an array of keys in the formElements object. Used to deep merge defaultElements with formElements.
          // There will only be one form on the add page so no need to loop through the forms object.       
          let keysOfFormElementsArray = Object.keys(recordObject.webPages.editPage.forms.editForm.formElements);

          // Deep merge the defaultElements with formElements - formElements taking precedence.
          keysOfFormElementsArray.forEach(function (elementValue)
          {
            let mergedElements = extend(true, combinedDefaultElementsObject[elementValue], recordObject.webPages.editPage.forms.editForm.formElements[elementValue]);

            // Now we have enough information to build the input elements for the webpage.


            // The next element tag must be built in a loop because we won't know what or 
            // how many attributes there will be.
            let elementString = 
            "      <" + mergedElements[key].elementType +  " "; 

            for (let key in mergedElements.attributes)
            {
              // Make the input string.


            }


            "      <input type=\"" + mergedElements.attributes.type + "\" name=\"" + mergedElements.attributes.name + "\" placeholder=\"" + mergedElements.attributes.placeholder + "\" />" + "\n" +
            "    </div>" + "\n";
          });

          // End of: Add field controls to the html.        

        } // End of: for (let key in formsObject)         




        // Finish the form with the submit button.
        htmlString = htmlString +        
        "    <div class=\"inputWrapper ctaWrapper smallTopMargin\">" + "\n" +
        "      <button type=\"submit\" class=\"cta blue\">" + recordObject.webPages.addPage.forms.addForm.submitButtonText + "</button>" + "\n" +
        "    </div>" + "\n" +
        "  </form>" + "\n" +
        "</div>";

        // Write out the HTML page to a file.

        let fileExtension = ".html";

        // Call the function which appends a string to a file 
        // then process anonymous callback function defined here.
        meta.append
        (
          recordObject.webPages.directory, 
          recordObject.table.tableName + "Edit", 
          fileExtension,
          htmlString, 
          function(err)
          {
            if (!err) // The html string was written successfully to a file.
            {
              helpers.log
              (
              5,
              '6f3z3xrzdbquiy9dqeci' + '\n' +
              'The web page ' + recordObject.table.tableName + "Edit" + '.html was written successfully to a file.' + '\n'                                      
              ); // End of: helpers.log(...)
            }
            else // There was an error writing the HTML string to a file.
            {
              helpers.log
              (
              7,
              '6f3z3xrzdbquiy9dqeci' + '\n' +
              'There was an error writing the html string to a file' + '\n'
              ); // End of: helpers.log(...)
            } // End of: else there was an error writing the HTML string to a file.
          } // End of: callback function(err){...}
        ); // End of: _data.append(...)


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
              'dfygxqkxg2am4df6ozzl' + '\n' + 
              'Pipeline error. The message was as follows' + '\n' +                                             
              pipelineError + '\n'                                                 
            ); // End of: helpers.log // Log the error.
          } // End of: if(pipelineError){...}
        } // End of: function(piplineError){...}
      ); // End of: Pipeline
    } // End of: if(!error) Got the most recent record from getMostRecent
    else // There was indeed an error returned by getMostRecent when attempting to get the most current record.
    {
      helpers.log // Log the error.
      (
        7,
        'gxpa2m2t2psewrd1d1u7' + '\n' + 
        'The following was the error message from getMostRecent:' + '\n' +                                             
        errorFromGetMostRecent + '\n'                                                 
      ); // End of: helpers.log // Log the error.
    } // End of: Else // There was indeed an error returned by getHashedPass when attempting to get the most current record. 
  }); //End of: helpers.getMostRecent(dataObject, function(errorFromGetMostRecent, payload)  
}// End of: meta.build.editWebPage = function(tableId){...}
*/




// Define a function which builds the client side Javascript 
// for adding records to a table in the database.
meta.build.AddJavascript = function(tableName)
{
  // 

}




// Define a function that builds the handler for serving up the 
// HTML web page for adding records to a table.
meta.build.AddPageHandler = function(tableName)
{
  // 

}




// Define a function that builds the API handler which contains the 
// code for adding records to a table.
meta.build.AddApiHandler = function(tableName)
{
  // 

}




/*!
 * Merge two or more objects together.
 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param   {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
 * @param   {Object}   objects  The objects to merge together
 * @returns {Object}            Merged values of defaults and options
 * 
 * Use the function as follows:
 * let shallowMerge = extend(obj1, obj2);
 * let deepMerge = extend(true, obj1, obj2)
 */
// Define function for deep merging of objects.
var extend = function () {

	// Variables
	var extended = {};
	var deep = false;
	var i = 0;

	// Check if a deep merge
	if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
	    deep = arguments[0];
	    i++;
	}

	// Merge the object into the extended object
	var merge = function (obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				// If property is an object, merge properties
				if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
					extended[prop] = extend(extended[prop], obj[prop]);
				} else {
					extended[prop] = obj[prop];
				}
			}
		}
	};

	// Loop through each object and conduct a merge
	for (; i < arguments.length; i++) {
		merge(arguments[i]);
	}

	return extended;

}; // End of: // Define function for deep merging of objects.



// Define function to append a string to a file.  
// Create the file if it does not exist.  
meta.append = function(dir, fileName, extension, appendString, callback)
{
  // console.log(meta.baseDir + dir + '/' + fileName + extension)
  // Create a readable stream.
  const sourceStream = new Readable();

  // Load the readable stream with data.
  sourceStream.push(appendString + '\n');

  // Tell the stream no more data is coming.
  sourceStream.push(null);

  // Create a writable stream and specify the file which will receive the data from the readable stream.
  let destinationStream = fs.createWriteStream(meta.baseDir + dir + '/' + fileName + extension, {flags : 'w'});

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
        helpers.log
        (
          7,
          'h0fcemkti8xkdkdn4dl9' + '\n' +
          'Error appending to file ' + meta.baseDir + dir + '/' + fileName + extension + '\n' +
          'This was the error:' + '\n' +
          JSON.stringify(error) + '\n'
        );

        callback
        (
          'jd5z9g7dn55v7bpfv3tl' + '\n' +
          'Error appending to file ' + meta.baseDir + dir + '/' + fileName + extension + '\n' +
          'This was the error:' + '\n' +
          JSON.stringify(error)
        );        
      }
    }
  );
}; // End of: meta.append = function(...
// End of: Append a string to a file. 




// Export the module
module.exports = meta;