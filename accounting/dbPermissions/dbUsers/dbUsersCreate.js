/*
 * Frontend Logic for application
 *
 */

// Container for frontend application
var app = {};


// AJAX Client (for RESTful API)
// Create an empty object to contain the client.
app.client = {}




// Define interface function for making API calls.
// This XMLHttpRequest is one of 3 ways that we call for data from the server.
// Here we use XMLHttpRequest to retrive JSON data from a table that contains only one line. 
// Mostly we are using this type of call right now for managing tokens.
app.client.request = function(headers,path,method,queryStringObject,payload,callback)
{
  // Set defaults
  headers = typeof(headers) == 'object' && headers !== null ? headers : {};
  path = typeof(path) == 'string' ? path : '/';
  method = typeof(method) == 'string' && ['POST','GET','PUT','DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
  queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
  payload = typeof(payload) == 'object' && payload !== null ? payload : {};
  callback = typeof(callback) == 'function' ? callback : false;

  // For each query string parameter sent, add it to the path
  var requestUrl = path+'?';
  var counter = 0;
  for(var queryKey in queryStringObject)
  {
    if(queryStringObject.hasOwnProperty(queryKey))
    {
      counter++;

      // If at least one query string parameter has already been added, preprend new ones with an ampersand
      if(counter > 1)
      {
        requestUrl+='&';
      }

      // Add the key and value
      requestUrl+=queryKey+'='+queryStringObject[queryKey];
    }
  }

  // Form the http request as a JSON type
  var xhr = new XMLHttpRequest();
  xhr.open(method, requestUrl, true);
  xhr.setRequestHeader("Content-type", "application/json");

  // For each header sent, add it to the request
  for(var headerKey in headers)
  {
     if(headers.hasOwnProperty(headerKey))
     {
       xhr.setRequestHeader(headerKey, headers[headerKey]);
     }
  }

  // If there is a current session token set, add that as a header
  // if(app.config.sessionToken)
  // {
  //   xhr.setRequestHeader("token", app.config.sessionToken.id);
  // }

  // When the request comes back, handle the response
  xhr.onreadystatechange = function()
  {
      if(xhr.readyState == XMLHttpRequest.DONE) 
      {
        var statusCode = xhr.status;
        var responseReturned = xhr.responseText;

        // Callback if requested
        if(callback)
        {
          try
          {
            var parsedResponse = JSON.parse(responseReturned);
            callback(statusCode,parsedResponse);
          } 
          catch(e)
          {
            callback(statusCode,false);
          }

        }
      }
  }

  // Send the payload as JSON
  var payloadString = JSON.stringify(payload);
  xhr.send(payloadString);

}; // End of: app.client.request = function(headers,path,method,queryStringObject,payload,callback){...}
// End of: Interface for making API calls




// Add a listener to the submit event of all forms in the DOM and bind the anonymous 
// function declared below to the listener using addEventListener.
// bindForms is called from app.init when the webpage is loaded but the anonymous 
// function declared using addEventListener only runs when the form is submitted.
// The function takes the submit event object (e) as the argument.
app.bindForms = function()
{
  // If the DOM contains the CSS selector "form"
  if(document.querySelector("form"))
  {

    // Create an interface to manipulate all the forms in the DOM.
    var allForms = document.querySelectorAll("form");

    // Add a listener to the submit event of every form in the DOM and bind the anonymous function declared here.
    for(var i = 0; i < allForms.length; i++)
    {
      // The following is what runs when the user submits the form.
      allForms[i].addEventListener("submit", function(e)
      {
        // Stop it from submitting
        e.preventDefault();

        // The key word "this" below refers to the html (more accurately the DOM) of the form being submitted.
        // The formId from the html (DOM) is used when loading the form with data.
        var formId = this.id;
        //path and method will determine which api handler will get called.
        var path = this.action;
        var method = this.method.toUpperCase();

        // Hide the error message (if it's currently shown due to a previous error)
        document.querySelector("#"+formId+" .formError").style.display = 'none';

        // Hide the success message (if it's currently shown)
        if(document.querySelector("#"+formId+" .formSuccess"))
        {
          document.querySelector("#"+formId+" .formSuccess").style.display = 'none';
        }


        // Create an empty payload object.
        var payload = {};

        // this.elements is an object containing the inputs and buttons defined in the html of the form being submitted.
        var elements = this.elements;

        // Load the payload object with the names and values of the elements in the form being submitted. 
        for(var i = 0; i < elements.length; i++)
        {
          if(elements[i].type !== 'submit')
          {
            // Determine class of element and set value accordingly.
            var classOfElement = typeof(elements[i].classList.value) == 'string' && elements[i].classList.value.length > 0 ? elements[i].classList.value : '';
            var valueOfElement = elements[i].type == 'checkbox' && classOfElement.indexOf('multiselect') == -1 ? elements[i].checked : classOfElement.indexOf('intval') == -1 ? elements[i].value : parseInt(elements[i].value);
            var elementIsChecked = elements[i].checked;

            // Override the method of the form if the input's name is _method
            var nameOfElement = elements[i].name;

            if(nameOfElement == '_method')
            {
              method = valueOfElement;
            } 
            else // nameOfElement was something other than '_method'
            {
              // Create a payload field named "method" if the elements name is actually httpmethod
              if(nameOfElement == 'httpmethod')
              {
                nameOfElement = 'method';
              }

              // Create an payload field named "id" if the elements name is actually uid
              if(nameOfElement == 'uid')
              {
                nameOfElement = 'id';
              }

              // If the element has the class "multiselect" add its value(s) as array elements
              if(classOfElement.indexOf('multiselect') > -1)
              {
                if(elementIsChecked)
                {
                  payload[nameOfElement] = typeof(payload[nameOfElement]) == 'object' && payload[nameOfElement] instanceof Array ? payload[nameOfElement] : [];
                  payload[nameOfElement].push(valueOfElement);
                }
              } 
              else // element was not of the class multiselect
              {
                payload[nameOfElement] = valueOfElement;
              }
            } // End of: nameOfElement was something other than '_method'
          } // End of: if(elements[i].type !== 'submit'){...}
        } // End of: for(var 1...
        // End of: Load the payload object with the names and values of the elements in the form.


        // Create and empty queryString Object. Never used but needs to be there.
        var queryStringObject = {};          


        // Call the API
        app.client.request(undefined,path,method,queryStringObject,payload,function(statusCode,responsePayload)
        {
          // Display an error on the form if needed
          if(statusCode !== 200)
          {

            if(statusCode == 403)
            {
               // log the user out
               // app.logUserOut();
            } 
            else // Status code was not 200 nor was it 403
            {
              // Try to get the error from the api, or set a default error message
              var error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';

              // Set the formError field with the error text
              document.querySelector("#"+formId+" .formError").innerHTML = error;

              // Show (unhide) the form error field on the form
              document.querySelector("#"+formId+" .formError").style.display = 'block';
            }
          } 
          else // The submit was successful and we got a response back from the server.
          {
            // Send to form response processor
            app.formResponseProcessor(formId,payload,responsePayload);
          }

        }); // End of: app.client.request(undefined,path,method,queryStringObject,payload,function(statusCode,responsePayload){...}
      }); // End of: allForms[i].addEventListener("submit", function(e){...} What runs when users submits the form.
    } // End of: for(var i = 0; i < allForms.length; i++){...}
  } // End of: if(document.querySelector("form")){...}
}; // End of: app.bindForms = function(){...}
// End of: Bind the anonymous function defined above to the submit event of any forms in the DOM.




// Form submit post processor
// This is the last function called from the anonymous function defined in app.bindForms which 
// executes on a form's submit event.
// So this function defines what happens after a form has been sucessfully submitted.
app.formResponseProcessor = function(formId,requestPayload,responsePayload)
{
  // If the administrator just created a new user successfully, redirect to a list of users.
  if(formId == 'userCreate')
  {
    window.location = 'users/list';
  }
  // End of: If the administrator just created a new user successfully, redirect to a list of users.

}; // End of: app.formResponseProcessor = function(formId,requestPayload,responsePayload){...}
// End of: Form submit post processor - processing after a sucessful form submit.




// Init (bootstrapping)
app.init = function()
{
  // Bind all form submissions
  app.bindForms();
};
// End of: Init (bootstrapping)



// Call the init processes after the window loads.
// This is where it all starts.
window.onload = function(){
  app.init();
};
