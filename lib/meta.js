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
  dataObject.path = '/database/dbMetadata/metadata.json';
  dataObject.queryString = 'WHERE:;tableId:;MatchesExactly:;' + tableId + ':;';  

  let recordObject;
  let htmlString = "";

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
        // Assemble the webpage string from the metadata in recordObject.

        let tableNameInTitleCase = recordObject.table.tableName[0].toUpperCase() + recordObject.table.tableName.slice(1);                

        // If we have specified text for the addPage heading.
        if(recordObject.webPages.addPage.heading)
        {
          htmlString = htmlString +     
          "<h1>" + recordObject.webPages.addPage.heading + "</h1>" + "\n";
        }
        else
        {
          htmlString = htmlString +               
          "<h1>Add a Record to the " + tableNameInTitleCase + " Table</h1>" + "\n";
        }


        // If we have specifed text for the form.
        if(recordObject.webPages.addPage.forms.addForm.heading)
        {
          htmlString = htmlString +           
          "<h2>" + recordObject.webPages.addPage.forms.addForm.heading + "</h2>" + "\n" +
          "\n";
        }


        htmlString = htmlString +
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
          console.log("0. This is the elementValue of the keysOfFormElementsArray : ", elementValue, "\n"); 

          // Now we have enough information to build the input elements for the webpage.
          let mergedElements = extend(true, combinedDefaultElementsObject[elementValue], recordObject.webPages.addPage.forms.addForm.formElements[elementValue]);

          console.log("1. The mergedElements are: ", mergedElements, "\n");                            

          // call the function which builds the HTML for the form element.
          htmlString = htmlString + meta.makeAddPageElementHtml(elementValue, recordObject);
        }); // End of: keysOfFormElementsArray.forEach(function (elementValue){...}

        // End of: Add field controls to the html.      
        
        
        // Finish the form with the submit button.
        htmlString = htmlString +        
        "    <div class=\"inputWrapper ctaWrapper smallTopMargin\">" + "\n";        


        // If we have specified text for the submit button.
        if(recordObject.webPages.addPage.forms.addForm.submitButtonText)
        {
          htmlString = htmlString +     
          "      <button type=\"submit\" class=\"cta blue\">" + recordObject.webPages.addPage.forms.addForm.submitButtonText + "</button>" + "\n";
        }
        else
        {
          htmlString = htmlString +               
          "      <button type=\"submit\" class=\"cta blue\">Save New " + tableNameInTitleCase + "</button>" + "\n";
        }


        htmlString = htmlString + 
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




// Define a function which builds a web page for 
// editing records to a json table in the database.
meta.build.editWebPage = function(tableId)
{
  let dataObject = {};
  dataObject.uniqueField01Value = ""; // We are not trying to write to the table so no need to enforce uniqueness.
  dataObject.uniqueField01Name = "table.tableName";           
  dataObject.path = '/database/dbMetadata/metadata.json';
  dataObject.queryString = 'WHERE:;tableId:;MatchesExactly:;' + tableId + ':;';  

  // Declare at top of function so that we will have access throughout.
  let recordObject; 
  let htmlString = "";

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
 
        // All the metadata for the table is in record object above.
        // Now we can assemble the webpage HTML string from the metadata in recordObject.

        // Create a variable that contains the name of the table with the first letter capitalized.
        let tableNameInTitleCase = recordObject.table.tableName[0].toUpperCase() + recordObject.table.tableName.slice(1);        


        // If we have specified text for the editPage heading
        if(recordObject.webPages.editPage.heading)
        {
          // Make the heading according the entry in the data dictionary.
          htmlString = htmlString +      
          "<h1>" + recordObject.webPages.editPage.heading + "</h1>" + "\n" + "\n" +
          "<hr />" + "\n" +"\n";          
        }
        else // We did not specify text for the editPage heading. Make a generic heading programmatically.
        {
          htmlString = htmlString +     
          "<h1>Edit This Record From The " + tableNameInTitleCase + " Table</h1>" + "\n" + "\n" +
          "<hr />" + "\n" +"\n"; 
        } // End of: If we have specifed...


        // Get the forms object of the edit page.
        let editPageFormsObject = recordObject.webPages.editPage.forms;


        // Loop through editPageFormsObject to build each form.
        for (let key in editPageFormsObject) 
        {
          // Form headings will be different for each type of form.
          // Form headings are handled here.
          if(key === "editForm")
          {
            // If we have specified heading text on the editForm on the editPage:
            if(editPageFormsObject[key].heading)
            {
              // Make the heading according the entry in the data dictionary.
              htmlString = htmlString +         
              "<h2>" + editPageFormsObject[key].heading + "</h2>" + "\n";        
            }
            else // We did not specify text for the editForm heading. Make a generic heading programmatically.
            {
              htmlString = htmlString + 
              "<h2>Edit This " + tableNameInTitleCase + "</h2>" + "\n";
            } // End of: If we have specifed...

          } // End of: if(key === "editForm"){...}
          // NOT the editForm and NOT the deleteForm so must be SPECIAL like maybe the password form.
          else if (key != "deleteForm") 
          {
            // If we have specified a heading text on the special custom form on the editPage:
            if(editPageFormsObject[key].heading)
            {
              // Make the heading according the entry in the data dictionary.
              htmlString = htmlString +         
              "<h2>" + editPageFormsObject[key].heading + "</h2>" + "\n";        
            }
            else // We did not specify text for the custom form's heading. Make a generic heading programmatically.
            {
              htmlString = htmlString + 
              "<h2>No heading was specified for this form.</h2>" + "\n";
            } // End of: If we have specifed...

          }
          else //This has to be the deleteForm
          {
            // If we have specified heading text on the deleteForm on the editPage:
            if(editPageFormsObject[key].heading)
            {
              // Make the heading according the entry in the data dictionary.
              htmlString = htmlString +         
              "<h2>" + editPageFormsObject[key].heading + "</h2>" + "\n";        
            }
            else // We did not specify text for the deleteForm heading. Make a generic heading programmatically.
            {
              htmlString = htmlString + 
              "<h2>Delete This " + tableNameInTitleCase + "</h2>" + "\n";
            } // End of: If we have specifed...

          } // End of: else: this has to be the deleteForm


          // Get the key with the first letter converted to upper case.
          let keyInTitleCase = key[0].toUpperCase() + key.slice(1);

          htmlString = htmlString + 
          "<div class=\"formWrapper\">" + "\n" +
          "  <form id=\"" + recordObject.table.tableName + keyInTitleCase + "\" action=\"/api/" + recordObject.table.tableName + "\" method=\"PUT\">" + "\n" +
          "    <input type=\"hidden\" name=\"_method\" value=\"PUT\"/>"  + "\n" +
          "    <div class=\"formError\"></div>" + "\n";     
          
          console.log("0. This is the current key in the editPageFormsObject: ", key, "\n");          


          // The following lines will be different for each type of form.
          if(key === "editForm")
          {

            // If we have specified the success message for the editForm on the editPage:
            if(editPageFormsObject[key].successMessage)
            {
              // Make the success message HTML according the entry in the data dictionary.
              htmlString = htmlString +         
              "    <div class=\"formSuccess\">" + editPageFormsObject[key].successMessage + "</div>" + "\n";        
            }
            else // We did not specify a success message. Make a generic message programmatically.
            {
              htmlString = htmlString + 
              "    <div class=\"formSuccess\">Changes to " + tableNameInTitleCase + " have been saved.</div>" + "\n";
            } // End of: If we have specifed...


            htmlString = htmlString +             
            "    <div class=\"inputWrapper\">" + "\n" +
            "      <div class=\"inputLabel\">" + recordObject.table.tableName + "Id</div>" + "\n" +
            "      <input class=\"disabled\" type=\"text\" name=\"" + recordObject.table.tableName + "Id" + "\" value=\"{selected." + recordObject.table.tableName + "Id"  + "}\" disabled/>"  + "\n" +
            "    </div>" + "\n";

            // Insert HTML for any elements, if any, that were specified in the data dictionary (metadata.json).            
            if(meta.makeEditPageElementHtml(key, recordObject)) // if this function returns a string of HTML code:
            {
              htmlString = htmlString +
              meta.makeEditPageElementHtml(key, recordObject);              
            }

            htmlString = htmlString +             
            "    <div class=\"inputWrapper\">" + "\n" +
            "      <div class=\"inputLabel\">Time Stamp</div>" + "\n" +
            "      <input class=\"timeStampInput\" type=\"text\" name=\"timeStamp\" disabled/>" + "\n" +
            "    </div>" + "\n" +       
            "    <div class=\"inputWrapper ctaWrapper smallTopMargin\">" + "\n";


            // If we have specified text for the Save button on the editForm on the editPage
            if(recordObject.webPages.editPage.forms.editForm.submitButtonText)
            {
              // Make the HTML according the entry in the data dictionary.              
              htmlString = htmlString + 
              "      <button type=\"submit\" class=\"cta green\">" + recordObject.webPages.editPage.forms.editForm.submitButtonText + "</button>" + "\n";
            }
            else // We did not specify text for the Save button. Make generic text programmatically.
            {
              htmlString = htmlString +
              "      <button type=\"submit\" class=\"cta green\">Save Edits</button>" + "\n";
            } // End of: If we have specifed...


            htmlString = htmlString +             
            "    </div>" + "\n" +
            "  </form>" + "\n" +
            "</div>" + "\n" + "\n" +
            "<hr />" + "\n";

          } // End of: if(key === "editForm"){...}
          // NOT the editForm and NOT the deleteForm so must be SPECIAL like maybe the password form.
          else if (key != "deleteForm") 
          {

            // If we have specified the success message for the special form on the editPage:
            if(editPageFormsObject[key].successMessage)
            {
              // Make the success message HTML according the entry in the data dictionary.
              htmlString = htmlString +         
              "    <div class=\"formSuccess\">" + editPageFormsObject[key].successMessage + "</div>" + "\n";       
            }
            else // We did not specify a success message. Make a generic message programmatically.
            {
              htmlString = htmlString + 
              "    <div class=\"formSuccess\">Changes to " + tableNameInTitleCase + " have been saved.</div>" + "\n";
            } // End of: If we have specifed...


            htmlString = htmlString +           
            "    <input class=\"hiddenInput\"  type=\"hidden\" name=\"" + recordObject.table.tableName + "Id" + "\" value=\"{selected." + recordObject.table.tableName + "Id"  + "}\"/>" + "\n";

            // Insert HTML for any elements if any that were specified in the data dictionary (metadata.json).
            if(meta.makeEditPageElementHtml(key, recordObject)) // if this function returns a string of HTML code:
            {
              htmlString = htmlString +
              meta.makeEditPageElementHtml(key, recordObject);              
            }

            htmlString = htmlString +             
            "    <div class=\"inputWrapper ctaWrapper smallTopMargin\">" + "\n";


            // If we have specified text for the Submit button on the special form on the editPage
            if(recordObject.webPages.editPage.forms[key].submitButtonText)
            {
              // Make the HTML according the entry in the data dictionary.              
              htmlString = htmlString + 
              "      <button type=\"submit\" class=\"cta green\">" + recordObject.webPages.editPage.forms[key].submitButtonText + "</button>" + "\n";
            }
            else // We did not specify text for the Submit button. Make generic text programmatically.
            {
              htmlString = htmlString +
              "      <button type=\"submit\" class=\"cta green\">Commit Edits</button>" + "\n";
            } // End of: If we have specifed...


            htmlString = htmlString + 
            "    </div>" + "\n" +
            "  </form>" + "\n" +
            "</div>" + "\n" + "\n" +
            "<hr />" + "\n";            
          }
          else //This has to be the deleteForm
          {

            htmlString = htmlString + 
            "    <div class=\"warning\">Warning: This action cannot be undone. <br>" + "\n" + "      Don't click this button on accident!</div>" + "\n" +
            "      <input class=\"hiddenInput\"  type=\"hidden\" name=\"" + recordObject.table.tableName + "Id" + "\" value=\"{selected." + recordObject.table.tableName + "Id"  + "}\"/>" + "\n"+
            "      <input class=\"hiddenInput\"  type=\"hidden\" name=\"deleted\" value=\"true\"/>" + "\n" +
            "    <div class=\"inputWrapper ctaWrapper smallTopMargin\">" + "\n";


            // If we have specified text for the delete button
            if(recordObject.webPages.editPage.forms.deleteForm.submitButtonText)
            {
              // Make the HTML according the entry in the data dictionary.              
              htmlString = htmlString + 
              "      <button type=\"submit\" class=\"cta red\">" + recordObject.webPages.editPage.forms.deleteForm.submitButtonText + "</button>" + "\n";
            }
            else // We did not specify text for the delete button. Make generic text programmatically.
            {
              htmlString = htmlString +
              "      <button type=\"submit\" class=\"cta red\"> Delete " + tableNameInTitleCase + "</button>" + "\n";
            } // End of: If we have specifed...


            htmlString = htmlString + 
            "    </div>" + "\n" +
            "  </form>" + "\n" +
            "</div>" + "\n" + "\n";                       
          }
          

        } // End of: for (let key in formsObject)         

        // Write out the HTML page to a file.

        let fileExtension = ".html";

        // Call the function which appends a string to a file 
        // then process anonymous callback function defined here.
        meta.append
        (
          recordObject.webPages.directory, 
          recordObject.table.tableName + "EditTest", 
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




// Define a function which builds the client side Javascript 
// for adding records to a table in the database.
meta.build.AddJavascript = function(tableName)
{ 

}




// Define a function that builds the handler for serving up the 
// HTML web page for adding records to a table.
meta.build.AddPageHandler = function(tableName)
{

}




// Define a function that builds the API handler which contains the 
// code for adding records to a table.
meta.build.AddApiHandler = function(tableName)
{


}



// Define a function to make HTML text for data entry controls.
meta.makeAddPageElementHtml = function(elementName, recordObject)
{
  // Declare the variable to hold the HTML code that we are putting together.
  // This will get passed back to the calling function.
  let elementString;    

  // Start of: Create one defaultElements object combining the key/value pairs of all the defaultElements objects that might exist in a table.

  // These defaultElements may not have the same name as the table fields.
  // For instance: The "hashedPassword" field in the user file is fed from the "password" defaultElement.
  // So first make an array of the field names.
  let keysOfFieldsArray = Object.keys(recordObject.fields);

  // console.log("2. The keysOfFieldsArray is: ", keysOfFieldsArray, "\n"); 

  // Make a single object containing the key/value pairs found inside the defaultElements of each field.
  let combinedDefaultElementsObject = {};

  // There may be more than one default element for each field 
  // (Consider velocity calculated from both time and distance elements.) 
  // Or there may be no default elements for a field in which case they can still 
  // be assigned later in the formElements object if desired.
  // So loop through keysOfFieldsArray add key/value pairs found in the defaultElements 
  // object of each field and add them to combinedDefaultElementObject.
  keysOfFieldsArray.forEach(function (keysOfFieldsArrayElementValue)
  {
    // Create an object of default elements for the current field.
    let defaultElementsObject = recordObject.fields[keysOfFieldsArrayElementValue].defaultElements;

    // Loop through defaultElementsObject.
    for (let key in defaultElementsObject) 
    {
      // Grab each defaultElement and copy to an object which will hold all defaultElements for the table.
      combinedDefaultElementsObject[key] = defaultElementsObject[key];
    }

  }); // End of: keysOfFieldsArray.forEach(function (elementValue, elementIndex, keysOfFieldsArray)
  // End of: Create one combinedDefaultElementsObject object combining the key/value pairs of all the defaultElements objects that might exist for each field.      
  
  // console.log("3. The combinedDefaultElementsObject is:" + "\n", combinedDefaultElementsObject, "\n");

  // Make an array of keys in the formElements object. Used to deep merge defaultElements with formElements.
  // There will only be one form on the add page so no need to loop through the forms object.       
  let keysOfFormElementsArray = Object.keys(recordObject.webPages.addPage.forms.addForm.formElements);

  // console.log("4. The keysOfFormElementsArray is/are : ", keysOfFormElementsArray, "\n");  

  // Deep merge the defaultElements with formElements - formElements taking precedence.

  let mergedElements = extend(true, combinedDefaultElementsObject[elementName], recordObject.webPages.addPage.forms.addForm.formElements[elementName]);

  // Now we have enough information to build the input elements for the webpage.
  
  // console.log("5. The mergedElements are as follows: " + "\n", mergedElements, "\n");

  // The next element tag must be built in a loop because we won't know what or 
  // how many attributes there will be. 
  // Also, it is possible that there will be no elementType and/or no attributes 
  // in which case we will need to asign properties and attributes programmatically
  // based on the following properties:  
  // dataType, required, unique, published, and defaultElements.
  // These are all required fields in the data dictionary (metadata.json)
  // The defaultElement's keys must have one at least one object in it's
  // value in order to get on a webpage. The key for this child object 
  // will be the name of a control element such as an input that is placed 
  // on a form. Thats how the field and form element are linked.
  // Usually, the name will be the same as the field but it could be different.
  // This child object must have the property parentField which points
  // back to the name of the data field in the table that this control represents.
  // This child must also have an elementType property such as "input" or "select".
  // This child must also have an attribute property which contains a value such as
  //  "text" or "password" if the default element is an input.
  // That's all we can count on. We may have to figure out what's best
  // from that information.

  // Start by making the HTML for the attributes from the mergedElements object.
  let attributeText = ""; // holds the attribute text for the element tag.


  // Loop through defaultElementsObject.
  for (let key in mergedElements.attributes) 
  {
    // Grab each defaultElement and copy to an object which will hold all defaultElements for the table.
    attributeText = attributeText + 
    " " + key;  
    
    if(mergedElements.attributes[key])
    {
      attributeText = attributeText + 
      "=\"" + mergedElements.attributes[key] + "\"";
    }

  } // End of: Loop through defaultElementsObject.

  attributeText = attributeText + "/>";

  // console.log("6. The attributeText is:" + "\n", attributeText, "\n");

  elementString = 
  "    <div class=\"inputWrapper\">" + "\n";

  // Get the current field with the first letter capitalized.
  // We will use this for the labelText if none was specifed.
  let elementNameInTitleCase = elementName[0].toUpperCase() + elementName.slice(1); 

  // console.log("7. The elementNameInTitleCase is:" + "\n", elementNameInTitleCase, "\n");

  // If we have specified lableText for the element:
  if(mergedElements.labelText)
  {
    // Make the label according the entry in the data dictionary.
    elementString = elementString +         
    "      <div class=\"inputLabel\">" + mergedElements.labelText + "</div>" + "\n";        
  }
  else // We did not specify labelText. Make a generic label programmatically.
  {
    elementString = elementString + 
    "      <div class=\"inputLabel\">" + elementNameInTitleCase + "</div>" + "\n";
  } // End of: If we have specifed...


  // If we have specified attributes for the element:
  if(attributeText)
  {
    // Make the element's HTML according the entry in the data dictionary.
    elementString = elementString +         
    "      <" + mergedElements.elementType + " name=\"" + elementName + "\"" + attributeText + "\n" +
    "    </div>"  + "\n";      
  }
  else // We did not specify attributes. Remove and code that produces HTML for attributes.
  {
    elementString = elementString + 
    "      <" + mergedElements.elementType + " name=\"" + elementName + "\"" + "\n" +
    "    </div>"  + "\n";
  } // End of: If we have specifed...


  // console.log("8. The following is the elementString: " + "\n", elementString, "\n");

  return elementString;  
}; // End of: meta.makeEditPageElementHtml = function(key, recordObject)
// End of: Define a function to make HTML text for data entry controls.




// Define a function to make HTML text for data entry controls.
meta.makeEditPageElementHtml = function(key, recordObject)
{
  console.log("1. The key is: ", key, "\n");

  // Declare the variable to hold the HTML code that we are putting together.
  // This will get passed back to the calling function.
  let elementString;    

  // Start of: Create one defaultElements object combining the key/value pairs of all the defaultElements objects that might exist in a table.

  // These defaultElements may not have the same name as the table fields.
  // For instance: The "hashedPassword" field in the user file is fed from the "password" defaultElement.
  // So first make an array of the field names.
  let keysOfFieldsArray = Object.keys(recordObject.fields);

  console.log("2. The keysOfFieldsArray is: ", keysOfFieldsArray, "\n"); 

  // Make a single object containing the key/value pairs found inside the defaultElements of each field.
  let combinedDefaultElementsObject = {};

  // There may be more than one default element for each field 
  // (Consider velocity calculated from both time and distance elements.) 
  // Or there may be no default elements for a field in which case they can still 
  // be assigned later in the formElements object if desired.
  // So loop through keysOfFieldsArray add key/value pairs found in the defaultElements 
  // object of each field and add them to combinedDefaultElementObject.
  keysOfFieldsArray.forEach(function (keysOfFieldsArrayElementValue)
  {
    // Create an object of default elements for the current field.
    let defaultElementsObject = recordObject.fields[keysOfFieldsArrayElementValue].defaultElements;

    // Loop through defaultElementsObject.
    for (let key in defaultElementsObject) 
    {
      // Grab each defaultElement and copy to an object which will hold all defaultElements for the table.
      combinedDefaultElementsObject[key] = defaultElementsObject[key];
    }

  }); // End of: keysOfFieldsArray.forEach(function (elementValue, elementIndex, keysOfFieldsArray)
  // End of: Create one combinedDefaultElementsObject object combining the key/value pairs of all the defaultElements objects that might exist for each field.      
  
  console.log("3. The combinedDefaultElementsObject is:" + "\n", combinedDefaultElementsObject, "\n");

  // Make an array of keys in the formElements object. Used to deep merge defaultElements with formElements.
  // There will only be one form on the add page so no need to loop through the forms object.       
  let keysOfFormElementsArray = Object.keys(recordObject.webPages.editPage.forms[key].formElements);

  // If no form elements were specified for this for in the data dictionary (metadata.json)
  // The bale out of this function and return false to notify the calling function that there is 
  // nothing to do.
  if(!keysOfFormElementsArray){return false;} 

  console.log("4. The keysOfFormElementsArray is/are : ", keysOfFormElementsArray, "\n");

  // Deep merge the defaultElements with formElements - formElements taking precedence.
  keysOfFormElementsArray.forEach(function (elementValue)
  {
    let mergedElements = extend(true, combinedDefaultElementsObject[elementValue], recordObject.webPages.editPage.forms[key].formElements[elementValue]);

    // Now we have enough information to build the input elements for the webpage.

    console.log("5. The mergedElements are as follows: " + "\n", mergedElements, "\n");

    // The next element tag must be built in a loop because we won't know what or 
    // how many attributes there will be. 
    // Also, it is possible that there will be no elementType and/or no attributes 
    // in which case we will need to asign properties and attributes programmatically
    // based on the following properties:  
    // dataType, required, unique, published, and defaultElements.
    // These are all required fields in the data dictionary (metadata.json)
    // The defaultElement's keys must have one at least one object in it's
    // value in order to get on a webpage. The key for this child object 
    // will be the name of a control element such as an input that is placed 
    // on a form. Thats how the field and form element are linked.
    // Usually, the name will be the same as the field but it could be different.
    // This child object must have the property parentField which points
    // back to the name of the data field in the table that this control represents.
    // This child must also have an elementType property such as "input" or "select".
    // This child must also have an attribute property which contains a value such as
    //  "text" or "password" if the default element is an input.
    // That's all we can count on. We may have to figure out what's best
    // from that information.

    // Start by making the HTML for the attributes from the mergedElements object.
    let attributeText = ""; // holds the attribute text for the element tag.


    // Loop through defaultElementsObject.
    for (let key in mergedElements.attributes) 
    {
      // Grab each defaultElement and copy to an object which will hold all defaultElements for the table.
      attributeText = attributeText + 
      " " + key;  
      
      if(mergedElements.attributes[key])
      {
        attributeText = attributeText + 
        "=\"" + mergedElements.attributes[key] + "\"";
      }

    } // End of: Loop through defaultElementsObject.

    attributeText = attributeText + "/>";

    console.log("6. The attributeText is:" + "\n", attributeText, "\n");


    elementString = 
    "    <div class=\"inputWrapper\">" + "\n";

    // Get the current field with the first letter capitalized.
    // We will use this for the labelText if none was specifed.
    let fieldNameInTitleCase = elementValue[0].toUpperCase() + elementValue.slice(1); 


    // If we have specified lableText for the element:
    if(mergedElements.labelText)
    {
      // Make the label according the entry in the data dictionary.
      elementString = elementString +         
      "      <div class=\"inputLabel\">" + mergedElements.labelText + "</div>" + "\n";        
    }
    else // We did not specify labelText. Make a generic label programmatically.
    {
      elementString = elementString + 
      "      <div class=\"inputLabel\">" + fieldNameInTitleCase + "</div>" + "\n";
    } // End of: If we have specifed...


    // Create an object of default elements for the current field.
    let fieldPropertiesObject = recordObject.fields[combinedDefaultElementsObject[elementValue].parentField];

    console.log("7. The fieldPropertiesObject is:" + "\n", fieldPropertiesObject, "\n");


    if(key === "editForm") // We are building HTML for the editForm on the editPage.
    {
      elementString = elementString +        
      // "      <" + mergedElements.elementType + " class=\"" + elementValue + "Input\" type=\"" + mergedElements.attributes.type + "\" name=\"" + elementValue + "\"/>" + "\n";             
      "      <" + mergedElements.elementType + " class=\"" + elementValue + "Input\" name=\"" + elementValue + "\"" + attributeText + "\n" +
      "    </div>"  + "\n";
    }
    else // We are building HTML for a special form on the editPage such as perhaps the passwordForm for changing passwords.
    {
      // Specify the elementType according the entry in the data dictionary.
      elementString = elementString +        
      "      <" + mergedElements.elementType + "\" name=\"" + elementValue + "\"" + attributeText + "\n" +    
      "    </div>"  + "\n";
    }

    console.log("8. The following is the elementString: " + "\n", elementString, "\n");

  }); // End of: keysOfFormElementsArray.forEach(function (elementValue){...}

  return elementString;  
}; // End of: meta.makeEditPageElementHtml = function(key, recordObject)
// End of: Define a function to make HTML text for data entry controls.




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
let extend = function () {

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




// Export the module
module.exports = meta;