/*
 * Frontend Logic for application
 *
 */

"use strict";

// Container for frontend application
var app = {};

// Create an object to store the session token.
// The session token is a string of 20 random characters.
// You get a session token pressing the submit button at the login page which
// runs the anonymous function defined in app.bindForms
// You keep the session token in localStorage until the browser is completly closed.
// If the tabsheet where this code is hosted is closed while the browser is left open 
// then the token remains in memory for use if you open a new tab and navigate back to 
// the application. 
// The token expires in one hour if you do not have the application open.
app.config = {
  'sessionToken' : false
};


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
  if(app.config.sessionToken)
  {
    xhr.setRequestHeader("token", app.config.sessionToken.id);
  }

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




// Bind the logout button
app.bindLogoutButton = function()
{
  document.getElementById("logoutButton").addEventListener("click", function(e)
  {
    // Stop it from redirecting anywhere
    e.preventDefault();

    // Log the user out
    app.logUserOut();
  });
}; // End of: app.bindLogoutButton = function(){...}




// Log the user out then redirect them
app.logUserOut = function(redirectUser)
{
  // Set redirectUser to default to true
  redirectUser = typeof(redirectUser) == 'boolean' ? redirectUser : true;

  // Get the current token id
  var tokenId = typeof(app.config.sessionToken.id) == 'string' ? app.config.sessionToken.id : false;

  // Send the current token to the tokens endpoint to delete it
  var queryStringObject = {'id' : tokenId};

  app.client.request(undefined,'api/tokens','DELETE',queryStringObject,undefined,function(statusCode,responsePayload)
  {
    // Set app.config.sessionToken and localStorage.token to false then revoke permissions to user specific webpages.
    app.setSessionToken(false);

    // Send the user to the logged out page
    if(redirectUser){
      window.location = '/session/deleted';
    }

  });
}; // End of: app.logUserOut = function(redirectUser){...}





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



        // If the method is DELETE, the payload should be a queryStringObject instead
        var queryStringObject = method == 'DELETE' ? payload : {};              

        // Call the API
        app.client.request(undefined,path,method,queryStringObject,payload,function(statusCode,responsePayload)
        {
          // Display an error on the form if needed
          if(statusCode !== 200)
          {

            if(statusCode == 403)
            {
              // log the user out
              app.logUserOut();
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
  // If the administrator just deleted a user then navigate back to the user list.
  if(formId == 'userEdit3')
  {
    window.location = 'user/list';
  }
  // End of: If the administrator just deleted a user then navigate back to the user list. 

  // If the administrator just created a new user successfully, redirect to a list of users.
  if(formId == 'userAdd')
  {
    window.location = 'user/list';
  }
  // End of: If the administrator just created a new user successfully, redirect to a list of users.


  // If account creation was successful, try to immediately log the user into the new account
  if(formId == 'accountCreate')
  {
    // Take the phone and password, and use it to log the user in
    var newPayload = {
      'phone' : requestPayload.phone,
      'password' : requestPayload.password
    };

    // Request a new token from the server.
    app.client.request(undefined,'api/tokens','POST',undefined,newPayload,function(newStatusCode,newResponsePayload)
    {
      // If there was an error getting the token: 
      if(newStatusCode !== 200)
      {
        // Display an error on the form
        // Set the formError field with the error text
        document.querySelector("#"+formId+" .formError").innerHTML = 'Sorry, an error has occured. Please try again.';

        // Show (unhide) the form error field on the form
        document.querySelector("#"+formId+" .formError").style.display = 'block';

      } 
      else // Request successful - we recieved a token from the server.
      {
        // Write the token to app.config.sessionToken and localStorage.token then grant permission to access user specific pages.
        app.setSessionToken(newResponsePayload);

        // Redirect the user to the /checks/all page.
        window.location = '/checks/all';
      }
    });
  } // End of: If account creation was successful, try to immediately log the user into the new account.


  // If user was on the login page and login was successful:
  if(formId == 'sessionCreate')
  {
    // Write the token to app.config.sessionToken and localStorage.token then grant permission to access user specific pages.
    app.setSessionToken(responsePayload);

    // Redirect the user to the /checks/all page.
    window.location = '/checks/all';
  }
  // End of: If user was on the login page and login was successful:


  // If forms saved successfully and they have success messages, show them.
  // First create an array naming all forms that have success messages.
  var formsWithSuccessMessages = ['accountEdit1', 'accountEdit2','checksEdit1', 'userEditForm', 'userDeleteForm', 'userEdit3'];

  // If the form just successfully submitted is a member of the above array:
  if(formsWithSuccessMessages.indexOf(formId) > -1)
  {
    // Display the success Message
    document.querySelector("#"+formId+" .formSuccess").style.display = 'block';
  }
  // End of: If forms saved successfully and they have success messages, show them.


  // If the user just deleted their account, redirect them to the accountDeleted page instead 
  // of redirecting them to the sessionDeleted page which is the default behavior.
  if(formId == 'accountEdit3')
  {
    app.logUserOut(false);
    window.location = '/account/deleted';
  }
  // End of: If the user just deleted their account, redirect them to the account-delete page


  // If the user just created a new check successfully, redirect back to the dashboard
  if(formId == 'checksCreate')
  {
    window.location = '/checks/all';
  }
  // End of: If the user just created a new check successfully, redirect back to the dashboard  


  // If the user just deleted a check, redirect them to the dashboard
  if(formId == 'checksEdit2')
  {
    window.location = '/checks/all';
  }
  // End of: If the user just deleted a check, redirect them to the dashboard  

}; // End of: app.formResponseProcessor = function(formId,requestPayload,responsePayload){...}
// End of: Form submit post processor - processing after a sucessful form submit.




// Get the session token from localstorage and use it to load the app.config object.
// The only time this function is called is when the page loads. Called from app.init
app.getSessionToken = function()
{
  var tokenString = localStorage.getItem('token');  

  // If there was a value found for the key "token" in localStorage
  if(typeof(tokenString) == 'string')
  {
    try
    {
      // Turn the token string into an object.
      var token = JSON.parse(tokenString);

      // Store the token object in a larger scope for use outside this function.
      app.config.sessionToken = token;

    
      if(typeof(token) == 'object')
      {
        // Grant permission to access user specific webpages.
        app.setLoggedInClass(true);
      } 
      else // token not an object
      {
        // Revoke permission to access user specific webpages.
        app.setLoggedInClass(false);
      }
    }
    catch(e)
    {
      // Delete the globally scoped token object.
      app.config.sessionToken = false;

      // Revoke permission to user specific webpages.
      app.setLoggedInClass(false);
    }

  } // End of: if(typeof(tokenString) == 'string'){...}
}; // End of: app.getSessionToken = function(){...}
// End of: Get the session token from localstorage and use it to load the app.config object.




// Set (or remove) the loggedIn class from the body
// This is where permission to user specific webpages are granted or revoked.
app.setLoggedInClass = function(add)
{
  var target = document.querySelector("body");
  if(add)
  {
    // Grant permission to user specific webpages.
    target.classList.add('loggedIn');
  } 
  else 
  {
    // Revoke permission to user specific webpages.
    target.classList.remove('loggedIn');
  }
}; // End of: app.setLoggedInClass = function(add){...}
// End of: Set (or remove) the loggedIn class from the body




// Write the session token value (or boolean false if none) locally to app.config.sessionToken and to localStorage.token
// Then grant or revoke permission to access user specific pages as appropriate.
app.setSessionToken = function(token)
{
  // Store the token object in a larger scope for use outside this function.
  app.config.sessionToken = token;

  // Turn the token string into an object.
  var tokenString = JSON.stringify(token);

  // Store the stringified token in browser memory.
  // This allows the token (the users session) to persist even if the current browser tab is closed. 
  // If the entire browser is closed then the token will be lost and the user will be required to log in again.
  // !!!!!!!!!! SECURITY ALERT!!!!!!!!!!!
  // It is possible to steal the token.
  // This circumvents the requirment to log in.
  // To simulate this attack, copy the token from localStorage onto the clipboard and then close the browser.
  // Then open a new browser and insert the token into local storage using the console.
  // Then run app.getSessionToken from the console which uses the token in localStorage to
  // get access to the server api and to user specific webpages. 
  localStorage.setItem('token',tokenString);


  if(typeof(token) == 'object')
  {
    // Grant permission to user specific webpages.    
    app.setLoggedInClass(true);
  } 
  else 
  {
    // Revoke permission to user specific webpages.    
    app.setLoggedInClass(false);
  }
}; // End of: app.setSessionToken = function(token){...}
// End of: Write the session token value (or boolean false if none) locally...




// Renew the token
// Called by tokenRenewalLoop
// If the browser was just opened then app.config.sessionToken will be set false and there will be no token in localStorage.
// So this function wiil terminate when currentToken is checked (No renewal).
// If you are not currently logged in then the app.config.sessionToken will be false so again, no renewal.
// If you are currently logged in then your token will be renewed every minute when tokenRenewalLoop calls this function.
// Oddly, if you log in and then close the tab for this application but leave the browser open on another tab then
// you can open a new tab and navigate back to your session (localhost:3000) as long as the token has not expired (1 hour).
// If more than an hour has passed then you will be logged out as soon has you try to make a request to the server.
app.renewToken = function(callback)
{
  var currentToken = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : false;

  if(currentToken) // If a token exists in local memory.
  {
    // Update the token with a new expiration
    var payload = 
    {
      'id' : currentToken.id,
      'extend' : true,
    };

    // Request to update the token file on the server with an expiration time extended to one hour from now.
    app.client.request(undefined,'api/tokens','PUT',undefined,payload,function(statusCode,responsePayload)
    {
      // If the token on the server was updated successfully:
      if(statusCode == 200)
      {
        // Form a query for the new token details.
        var queryStringObject = {'id' : currentToken.id};

        // Get the updated token from the server.
        app.client.request(undefined,'api/tokens','GET',queryStringObject,undefined,function(statusCode,responsePayload)
        {
          // if we successfully retrived the updated token from the server.
          if(statusCode == 200)
          {
            // Write the token to app.config.sessionToken and localStorage.token then grant permission to access user specific pages.
            app.setSessionToken(responsePayload);

            // Call back (no error) to tokenRenewalLoop which logs success to the client's console.
            callback(false);
          } 
          else 
          {
            // Set app.config.sessionToken and localStorage.token to false then revoke permissions to user specific webpages.
            app.setSessionToken(false);

            // Call back to tokenRenewalLoop which just logs success to the client's console.
            callback(true);
          }
        });
      } 
      else // status code was not 200. Something went wrong.
      {
        // Set app.config.sessionToken and localStorage.token to false then revoke permissions to user specific webpages.
        app.setSessionToken(false);

        // Call back error to tokenRenewalLoop which does nothing.
        callback(true);
      }
    });
  } // End of: If a token exists in local memory.
  else // There was no token in local memory.
  {
    // Set app.config.sessionToken and localStorage.token to false then revoke permissions to user specific webpages.
    app.setSessionToken(false);

    // Call back error to tokenRenewalLoop which does nothing.
    callback(true);
  } // End of: Else there was no token in local memory.

}; // app.renewToken = function(callback){...}
// End of: Renew the token




// Load data on the page
// This function is a router. 
// It is called from app.init when the page loads.
// This router calls other functions specific to the page for which data is to be loaded.
app.loadDataOnPage = function()
{
  // Get the current page from the body class
  var bodyClasses = document.querySelector("body").classList;
  var primaryClass = typeof(bodyClasses[0]) == 'string' ? bodyClasses[0] : false;

  // Logic for user's edit page
  if(primaryClass == 'userEdit')
  {
    app.loaduserEditPage();
  }  

  // Logic for user's list page
  if(primaryClass == 'userList')
  {
    app.loaduserListPage();
  }

  // Logic for account settings page
  if(primaryClass == 'accountEdit')
  {
    app.loadAccountEditPage();
  }

  // Logic for dashboard page
  if(primaryClass == 'checksList')
  {
    app.loadChecksListPage();
  }

  // Logic for check details page
  if(primaryClass == 'checksEdit')
  {
    app.loadChecksEditPage();
  }
}; // End of: app.loadDataOnPage = function(){...}
// End of: Load data on the page. This function is a router.



// Load the userEdit page with data from the server.
app.loadUserEditPage = async function()
{
  // Get the email and timeStamp.
  // 1. Get the userId
  // The template function inserts the userId into the html before serving it to the client.
  let userId = document.querySelector("form input[name=userId]").value;

  // 2. Create a queryExpression with a key of userId and a value of the 
  // particular userId that the user clicked on in the list.
  let queryExpression = "?WHERE:;userId:;MatchesExactly:;" + userId + ":;";

  // Run the query defined below to get the email address and timeStamp from the userID.    
  let recordArray = await runQueryOnUserId(queryExpression);

  // Get the record object from the array returned by the query.
  let recordObject = recordArray[0];

  // Put the data into the forms as values where needed
  document.querySelectorAll(".emailInput").forEach(function (element){element.value = recordObject.email});
  document.querySelectorAll(".timeStampInput").forEach(function(element){element.value = recordObject.timeStamp});  

  // Define a function to get the email address and the timeStamp from the userID
  async function runQueryOnUserId(queryExpression) 
  {
    const res = await fetch('api/user' + queryExpression);

    // Verify that we have some sort of 2xx response that we can use
    if (!res.ok) 
    {
        console.log("Error trying to load the list of users: ");
        // throw res;
    }
    // If no content, immediately resolve, don't try to parse JSON
    if (res.status === 204)
    {
        return [];
    }
    // Get all the text sent by the server as a single string.
    const content = await res.text();

    // Split the content string on each new line character and put the results into an array called lines.
    const lines = content.split("\n");

    // Get rid of the last element in the array. This is just a new line character.
    lines.splice(lines.length -1, 1);

    // Return a new array to the calling function consisting of JSON objects which contain each record sent by the server.
    return lines.map(function(line)
    {
      if(line != "")
      {
        return JSON.parse(line);
      }
    });
  } // End of: async function runQueryOnUserId(queryExpression){...}
  // End of: Define a function to get the email address and the timeStamp from the userID

}; // End of: app.loadUserEditPage = function(){...}




// Load the account edit page with data from the server. Log out the user if there are errors.
// This function is called once when the page loads.
app.loadAccountEditPage = function()
{
  // Get the phone number from the current token.
  var phone = typeof(app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;

  if(phone)
  {
    // Fetch the user data
    var queryStringObject = {'phone' : phone};

    app.client.request(undefined,'api/users','GET',queryStringObject,undefined,function(statusCode,responsePayload)
    {
      if(statusCode == 200)
      {
        // Put the data into the forms as values where needed
        document.querySelector("#accountEdit1 .firstNameInput").value = responsePayload.firstName;
        document.querySelector("#accountEdit1 .lastNameInput").value = responsePayload.lastName;  
        document.querySelector("#accountEdit1 .emailInput").value = responsePayload.email;                  
        document.querySelector("#accountEdit1 .displayPhoneInput").value = responsePayload.phone;       

        // Make an array to address both hidden phone inputs on the webpage.
        var hiddenPhoneInputs = document.querySelectorAll("input.hiddenPhoneNumberInput");

        // Cycle through the array and load the user's phone number into each of the two hidden phone inputs.
        for(var i = 0; i < hiddenPhoneInputs.length; i++)
        {
            hiddenPhoneInputs[i].value = responsePayload.phone;
        }

      } 
      else // The server responded with a status code other than 200. Something when wrong.
      {
        // Log the user out on the assumption that the api is temporarily down or the users token is bad
        app.logUserOut();
      }
    });
  } 
  else // The phone number was not a string.
  {
    // Log the user out.
    app.logUserOut();
  }
}; // End of: app.loadAccountEditPage = function()
// End of: Load the account edit page with data from the server.




// Populate the userList webpage with controls and user records from the table.
app.loadUserListPage = async function()
{  
  // Create an HTML table here so all functions below will have access to it.
  let table = document.createElement('table');  

  // Create a handle for the query form template here so all functions below will have access to it.
  // This template is in the webpage html at the bottom between <script> tags.
  let formTemplate = document.querySelector('[type="text/formTemplate"]'); 


  // Define a function to load the query form from the template.
  function loadQueryForm()
  {
  let templateClone = formTemplate.cloneNode(true);
  let templateHTMl = templateClone.textContent;
  let templateTarget = document.querySelector(".formWrapper");
  templateTarget.innerHTML = templateHTMl; 
  };

  // Call the function above to load a new clean queryForm onto the webpage.
  loadQueryForm();


  // Define the function that fires when the fieldToOrderBy selector changes.
  function onChangeBehaviorForFieldToOrderBySelector (event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // Start of: Hide options which contain fields that are already displayed on select elements.
    // 1. Create an empty array to hold the values contained in the select elements.
    let selectorElementValues = [];

    // 2. Look at each select element and store their values in the array.
    document.querySelectorAll(".fieldToOrderBy").forEach(function(element) 
    {
      // if the select elements are not blank
      if(element.value != "")
      {
        // Push the values onto the array.
        selectorElementValues.push(element.value);
      }
    });   
    
    // 3. Examine the menu options of the selector having focus and hide any 
    //    options that exist in the selectElementValues array.
    //    So if an item has already been selected then it won't show in the 
    //    list of items to select.
    document.querySelectorAll(".fieldToOrderBy").forEach(function(element) 
    {
      let optionElements = element.querySelectorAll('option');  
  
      for (let optionElement of optionElements) 
      {
        if(selectorElementValues.indexOf(optionElement.innerHTML) > -1)
        {
          optionElement.style.display = "none";
        }    
        else
        {
          optionElement.style.display = "list-item";
        }  
      }
    }); 
    // End of: Hide options which contain fields that are already displayed on select elements.

  } // End of: function onChangeBehaviorForfieldToOrderBySelector (event)
  // End of: Define the function that fires when the fieldToOrderBy selector changes.  

  // Bind the function above to the onChange event of the first (and only for now) fieldToDisplay select element.
  document.querySelectorAll(".fieldToOrderBy")[0].addEventListener("change", onChangeBehaviorForFieldToOrderBySelector);  



  // Define function that fires when the clear query button is clicked.
  function onClickEventBehaviorOfClearQueryButton(event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // Remove the old query form if any from the webpage.
    let templateTarget = document.querySelector(".formWrapper");
    templateTarget.innerHTML = ""; 

    // Call the loadQueryForm function above to load a new clean queryForm onto the webpage.
    loadQueryForm();

    // Now add back the onChange event listeners for the controls on the form.
    document.querySelectorAll(".fieldToOrderBy")[0].addEventListener("change", onChangeBehaviorForFieldToOrderBySelector);
    document.querySelectorAll(".fieldToDisplay")[0].addEventListener("change", onChangeBehaviorForFieldToDisplaySelector);
    document.querySelectorAll(".conjunctionSelector")[0].addEventListener("change", onChangeBehaviorForConjunctionSelector);    
    document.querySelectorAll(".orderByConjunctionSelector")[0].addEventListener("change", onChangeBehaviorForOrderByConjunctionSelector);

  }; // End of: function onClickEventBehaviorOfClearQueryButton(event) = function(){...}
  // End of: Define function that fires when the clear query button is clicked.

  // Bind the function above to the onClick event of the clear query button.
  document.querySelector("#clearQueryButton").addEventListener("click", onClickEventBehaviorOfClearQueryButton); 



  // Define function that fires when the submit query button is clicked.
  async function onClickEventBehaviorOfSubmitQueryButton(event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // Create an empty array to hold the values contained in each fieldToDisplay selector control.
    let arrayOfFieldsToDisplay = [];     

    // Create a title for the table.    
    tableCaption = document.createElement('caption');
    tableCaption.innerHTML = 'List of Users';
    tableCaption.className = "tableCaption";
    // Only apply the title if one does not already exist.
    if(!document.querySelector(".tableCaption"))
    {
      table.appendChild(tableCaption);
    }


    // This will populate arrayOfFieldsToDisplay with the values of every fieldToDisplay 
    // selector control (except the last empty one) shown on the webpage.
    // In other words: Populate the array with all the selections made by the user.
    document.querySelectorAll('.fieldToDisplay').forEach(function(node, nodeIndex, nodeList)
    {
      if(nodeIndex < nodeList.length - 1)
      {
        arrayOfFieldsToDisplay.push(node.value);
      }
      else if(nodeIndex = nodeList.length - 1 && node.value != "")
      {
        arrayOfFieldsToDisplay.push(node.value);
      }
    });

    // Make the first empty row for the headers and put it in the table
    let tableRow = document.createElement('tr'); 
    table.appendChild(tableRow);   

    // Check if the user did not select any fields to display.
    // Nothing selected means all fields should be displayed.
    if(arrayOfFieldsToDisplay.length == 0) // Nothing selected so display all fields as they are positioned in the table.
    {
      // Clear out the array
      arrayOfFieldsToDisplay = [];
      
      // Repopulate arrayOfFieldsToDisplay with all possible options except the first empty option.
      // In other words: populate the array with every field name it is possble to display.
      document.querySelector('.fieldToDisplay').querySelectorAll("option").forEach(function(node, nodeIndex)
      {
        if (nodeIndex != 0)
        {
            arrayOfFieldsToDisplay.push(node.value);
        }
      });
    } // End of: if(arrayOfFieldsToDisplay[0] == "") // Nothing selected

    // Populate the first row with headers containing the names of each field.
    arrayOfFieldsToDisplay.forEach(function(arrayElement)
    {
      // Make a header for row 1 and put it in the row.
      let tableHeader = document.createElement('th');  
      tableHeader.innerHTML = arrayElement  
      tableRow.appendChild(tableHeader);
    });    

    // Make an extra header for row 1 so that the user can drill into the record and edit the detail or delete it.
    tableHeader = document.createElement('th');  
    tableHeader.innerHTML = 'Details'  
    tableRow.appendChild(tableHeader);     

    // The first record in any table will be the primary key. This a global sequ
    // Used here to populate the last cell of each row in a table with a control to drill in on that record.
    let nameOfPrimaryKey = document.querySelector('.fieldToDisplay').querySelectorAll("option")[1].value;

    // Check if there is an order-by clause in the queryExpression.
    let queryExpression = document.querySelector(".queryExpressionTextArea").value;

    let indexOfOrderByClause = queryExpression.indexOf("ORDERBY:;");

    // If no order-by clause exists in the query expression fetch the data and stream the results directly to the page.
    if(indexOfOrderByClause === -1)
    {
      // Run the query defined in the textarea on the form.
      // This call to the server is used when NO sort order is specified by the user.
      runQueryThenStreamToDisplay(queryExpression, arrayOfFieldsToDisplay, nameOfPrimaryKey);
    }
    else // The user specified an order so await for all the results and then sort before presenting to the user.
    {
      // Get the part of the queryExpression string starting at "ORDERBY:;"
      let orderByString = queryExpression.substring(indexOfOrderByClause);  


      // Fill an array with data from the orderby clause
      // Make an array out of the queryString where each phrase of the query is an element.
      let orderByArray = orderByString.split(":;"); 

      // Get rid of the last element in the array. This is just an empty string.
      orderByArray.splice(orderByArray.length -1, 1);

      // Determine the amount of orderby clauses.
      // There are three elements in the array for each clause.
      let amountOfOrderByClauses = orderByArray.length/3; 
     
      // Make an array for the names of the fields to sort
      let fieldsToOrderByArray = [];

      // Make an array for the type of sort to make on the respective field.
      let typeOfSortArray = []

      // Populate the two new arrays from the orderByArray
      for (let i = 0; i < amountOfOrderByClauses; i++) 
      {
        // Get rid of the first element in the array. It's just the conjunction.
        orderByArray.splice(0, 1);

        // Copy the next element into the fieldsToOrderByArray and then remove the element.
        fieldsToOrderByArray.push(orderByArray.splice(0, 1)[0]);

        // Copy the next element into the typeOfSortArray and then remove the element.
        typeOfSortArray.push(orderByArray.splice(0, 1)[0]);
      }         


      // Run the query defined in the textarea on the form.
      // This call to the server is used when a sort order IS specified by the user.    
      let recordsArray = await runQueryWaitForAllData(queryExpression);


      // Sort the recordsArray which was populated after running the query.
      recordsArray.sort(function(a, b)
      {
        // return a.email.toString().toLowerCase().localeCompare(b.email.toString().toLowerCase());
        
        let loopCounter = 0;
        let sortResult = 0;

        while (loopCounter <= amountOfOrderByClauses - 1) 
        {
          // If we are ranking alphabetically:
          if(typeOfSortArray[loopCounter] === 'ascendingAlphaSort')
          {
            // Alphabetic Sort
            sortResult = a[fieldsToOrderByArray[loopCounter]].toString().toLowerCase().localeCompare(b[fieldsToOrderByArray[loopCounter]].toString().toLowerCase());

            if(sortResult === 1){return 1;} // Don't change the order.

            if(sortResult === -1){return -1;} // b ranks higher so swap a and b

          }
          if(typeOfSortArray[loopCounter] === 'descendingAlphaSort')
          {
            // Alphabetic Sort
            sortResult = a[fieldsToOrderByArray[loopCounter]].toString().toLowerCase().localeCompare(b[fieldsToOrderByArray[loopCounter]].toString().toLowerCase());

            if(sortResult === 1){return -1;} // Don't change the order.

            if(sortResult === -1){return 1;} // b ranks higher so swap a and b

          }          
          else if (typeOfSortArray[loopCounter] === 'ascendingNumericSort')
          {
            // Numeric Sort
            if (a[fieldsToOrderByArray[loopCounter]] < b[fieldsToOrderByArray[loopCounter]]) return -1;

            if (a[fieldsToOrderByArray[loopCounter]] > b[fieldsToOrderByArray[loopCounter]]) return 1;

          }
          else if (typeOfSortArray[loopCounter] === 'descendingNumericSort')
          {
            // Numeric Sort
            if (a[fieldsToOrderByArray[loopCounter]] > b[fieldsToOrderByArray[loopCounter]]) return -1;

            if (a[fieldsToOrderByArray[loopCounter]] < b[fieldsToOrderByArray[loopCounter]]) return 1;

          }          

          // If we got this far then records a and b are the same for the field currently being examined. 
          // Check to see if there are more orderby clauses to test on these two records.
          // If there are then we will go through the loop again using the next clause as a tie breaker.       

          loopCounter = loopCounter + 1;      

          // If there are no more orderby clauses to 
          if (loopCounter === amountOfOrderByClauses)
          {
            return 0
          }         

        } // End of: while (loopCounter <= amountOfOrderByClauses - 1){...}
      }) // end of: recordsArray.sort(function(a, b){...}
      // Sort the recordsArray which was populated after running the query.      


      recordsArray.forEach(function(value)
      {
        // Insert a new row in the table.
        let tr = table.insertRow(-1);            
        
        // Insert a new cell for each field to display and populate with data for that field.
        arrayOfFieldsToDisplay.forEach(function(arrayElement, elementIndex)
        {
          let newCell = tr.insertCell(elementIndex);
          newCell.innerHTML = value[arrayElement];               
        });   

        // Add an extra cell to the end of the row that contains a link which sends the user
        // to a new screen where the record can be edited or deleted.
        let lastCell = tr.insertCell(arrayOfFieldsToDisplay.length);             
        lastCell.innerHTML = '<a href="/user/edit?userId=' + value[nameOfPrimaryKey] + '">View / Edit / Delete</a>';
      }) 
    }

    // Put the table on the webpage.
    let tableParent = document.querySelector('.content');
    tableParent.appendChild(table);    

    // This scrolls the results into view.
    document.querySelector("#submitQueryButton").scrollIntoView();

  }; // End of: function onClickEventBehaviorOfSubmitQueryButton(event) = function(){...}
  // End of: Define function that fires when the submit query button is clicked.

  // Bind the function above to the onClick event of the submit query button.
  document.querySelector("#submitQueryButton").addEventListener("click", onClickEventBehaviorOfSubmitQueryButton);



  // Define a function that fetches data from the server and waits 
  // till all data has been received before passing it along.
  // This is one of 3 ways that we call for data from the server.
  // We use this function when the user specifies a sort order which
  // requires that all the data be present before we can start to work
  // on it.
  async function runQueryWaitForAllData(queryExpression) 
  {
    const res = await fetch('api/user' + queryExpression);

    // Verify that we have some sort of 2xx response that we can use
    if (!res.ok) 
    {
        console.log("Error trying to load the list of users: ");
        throw res;
    }
    // If no content, immediately resolve, don't try to parse JSON
    if (res.status === 204)
    {
        return [];
    }
    // Get all the text sent by the server as a single string.
    const content = await res.text();

    // Split the content string on each new line character and put the results into an array called lines.
    const lines = content.split("\n");

    // Get rid of the last element in the array. This is just a new line character.
    lines.splice(lines.length -1, 1);

    // Return a new array to the calling function consisting of JSON objects which contain each record sent by the server.
    return lines.map(function(line)
    {
      if(line != "")
      {
        return JSON.parse(line);
      }
    });
  } // End of: async function runQueryWaitForAllData(queryExpression){...}
  // End of: Define a function that fetches data from the server...



  // Define function that fires when the clear results button is clicked.
  function onClickEventBehaviorOfClearResultsButton(event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // Clear all results from the table.
    table.remove();
    table.innerHTML = "";

  }; // End of: function onClickEventBehaviorOfClearResultsButton(event) = function(){...}
  // End of: Define function that fires when the clear results button is clicked.

  // Bind the function above to the onClick event of the submit query button.
  document.querySelector("#clearResultsButton").addEventListener("click", onClickEventBehaviorOfClearResultsButton);  



  // Define function that fires when generate query button is clicked.
  // The following function builds a query by examining the control 
  // elements for the filter and the order by clause. 
  // Then it sends the query off to the server and manages the response.
  function onClickEventBehaviorOfGenerateQueryButton(event)
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // This will contain the finished query expression that we will send to the server.
    let queryExpression = "?";


    // Define a function that will check if every element in an array is blank.
    // This will be used to determine if the user filled out the form.
    function allBlanks(arrayOfValues) 
    {
      function isBlank(thisValue) 
      {
        // The following will examine one of the elements of the array  
        // and return true if blank - otherwise it will return false.
        return thisValue == "";
      }  

      // .every is an array method that will call the function isBlank 
      // once for every element in the array selectorElementValues.
      // it will return true if every element is blank.
      return arrayOfValues.every(isBlank);
    } // End of: function allBlanks(arrayOfValues){...} 
    // End of: Define a function that will check if every element in an array is blank.


    // Start of: Begin building a query expression by examining the filter control elements.
    // Only the where and order by clauses matter for the fetch from the server.
    // The select clause controls and records-per-page control can be 
    // examined and used after the records have been returned by the fetch.

    // 1. Make an array from the where clause elements.
    // Create an empty array to hold the values contained in the where clause select elements.

    // Create a handle to address the group wrapper. 
    // We can use this to keep the search for control elements limited to the where clause controls.
    let whereClauseGroupWrapper = document.querySelectorAll(".whereClauseGroupWrapper")[0];

    // Create an empty array to hold the values of the where clause controls elements.
    let whereClauseElementValues = [];

    // Store the values of each select element in the new array.
    // .resetElement is just a class that all the elements of interest have in common.
    whereClauseGroupWrapper.querySelectorAll(".resetElement").forEach(function(element) 
    {
      // Push the values onto the array.
      whereClauseElementValues.push(element.value);

    }); 

    // 2. Ensure all but the last element contains a value or that none of the 
    // elements contain values and then generate the query expression.
    // In other words: 
    // Make sure the user filled out the filter form(s) completely or not at all.
    // If the filter form(s) is/are completely filled out the create the query expression.

    // Find out which element in the array is the first element to contain a blank value.
    // If it's the last one then we know the form has been filled out completely.
    let indexOfFirstWhereClauseBlankSelector = whereClauseElementValues.indexOf("")

    // Find out if all the values in the array selectorElementValues are blank.
    // If they are then we know that the form was not filled out at all in 
    // which case we should ignore the form.

    // If not all the elements are blank then then user has made a filter expression.
    let userHasMadeAFilterExpression = !allBlanks(whereClauseElementValues);

    if(userHasMadeAFilterExpression)
    {
      // If the first blank is the very last element in the array then
      // we know that the form has been filled out compelely.
      if(indexOfFirstWhereClauseBlankSelector == whereClauseElementValues.length -1) 
      {

        queryExpression = queryExpression + "WHERE" + ":;"

        // The form has been filled out completely so populate the query expression with data from the controls.
        whereClauseElementValues.forEach(function(element){
          if(element != "")
          {
            queryExpression = queryExpression + element + ":;"
          } 
        });
      }
      else // The user did not fill out the form competely so bail out of the process.
      {
        alert('The filter expression must be filled out completely or must be completely blank' + '\n' + 'Please check your work.')
        return // Stop the process.
      }

    } // End of: if(userHasMadeAFilterExpression){...}
    // End of: Begin build a query expression by examining the filter control elements.


    // Start of: Add any orderby clauses to the query expression.
    // 1. Make an array from the orderby clause elements.
    // Create an empty array to hold the values contained in the orderby clause select elements.

    // Create a handle to address the group wrapper. 
    // We can use this to keep the search for control elements limited to the orderby clause controls.
    let orderByClauseGroupWrapper = document.querySelectorAll(".orderByClauseGroupWrapper")[0];

    // Create an empty array to hold the values of the orderby clause controls elements.
    let orderByClauseElementValues = [];

    // Store the values of each select element in the new array.
    // .resetElement is just a class that all the elements of interest have in common.
    orderByClauseGroupWrapper.querySelectorAll(".resetElement").forEach(function(element) 
    {
      // Push the values onto the array.
      orderByClauseElementValues.push(element.value);

    }); 

    // 2. Ensure all but the last element contains a value or that none of the 
    // elements contain values and then add to the query expression.
    // In other words: 
    // Make sure the user filled out the orderby form(s) completely or not at all.
    // If the orderby form(s) is/are completely filled out then add to the query expression.

    // Find out which element in the array is the first element to contain a blank value.
    // If it's the last one then we know the form has been filled out completely.
    let indexOfFirstOrderByClauseBlankSelector = orderByClauseElementValues.indexOf("")

    // Find out if all the values in the array selectorElementValues are blank.
    // If they are then we know that the form was not filled out at all in 
    // which case we should ignore the form.

    // If not all the elements are blank then then user has made an orderby expression.
    let userHasMadeAnOrderByExpression = !allBlanks(orderByClauseElementValues);

    if(userHasMadeAnOrderByExpression)
    {
      // If the first blank is the very last element in the array then
      // we know that the form has been filled out compelely.
      if(indexOfFirstOrderByClauseBlankSelector == orderByClauseElementValues.length -1) 
      {

        queryExpression = queryExpression + "ORDERBY" + ":;"

        // The form has been filled out completely so populate the query expression with data from the controls.
        orderByClauseElementValues.forEach(function(element){
          if(element != "")
          {
            queryExpression = queryExpression + element + ":;"
          } 
        });

      }
      else // The user did not fill out the form competely so bail out of the process.
      {
        alert('The order-by expression must be filled out completely or must be completely blank' + '\n' + 'Please check your work.')
        return // Stop the process.
      }

    } // End of: if(userHasMadeAFilterExpression){...}
    // End of: Add any orderby clauses to the query expression.

    // Start of: Replace troublesome symbols in the query expression

    // DON'T USE THE FOLLOWING SYMBOLS OR THE %ESCAPES IN THE QUERY EXPRESSION
    // CODE BELOW SWAPS THESE FOR SOMETHING COMPLETELY DIFFERENT.
    // PoundStops the Process-%23
    // Ampersand breaks the expression into two parts-%26
    // Equal stops the process-%3D

    // THE FOLLOWING SYMBOLS PRODUCE UNEXPECTED BEHAVIOR:
    // cODE BELOW SWAPS THESE FOR SOMETHING COMPLETELY DIFFERENT.    
    // Backslash is escaped with another backslash no matter what-%5C
    // Single Quote inserts Esc automatically and inserts a back slash in the result-%27
    // Plus shows as a space-%2B 
    
    // THE FOLLOWING SYMBOLS PRODUCE UNEXPECTED BUT HARMLESS BEHAVIOR:
    // IT'S OK TO LEAVE THESE AS IS. WE WON'T NOTICE THEM IN THE FINAL RESULT.
    // Space inserts the Esc automatically-%20
    // DoubleQInsertsEscAutomatically-%22   
    // LessThanInsertsEscAutomatically-%3C
    // GreaterThanInsertsEscAutomatically-%3E     

    // THE FOLLOWING SYMBOLS BEHAVE AS EXPECTED:    
    // Accent-`
    // Exclaimation-!
    // AtSign-@
    // Dollar-$
    // Percent-%
    // Carrot-^
    // Asterisk-*
    // OpenParen-(
    // CloseParen-)
    // LowDash-_
    // OpenBrace-{
    // CloseBrace-}
    // OpenBracket-[
    // CloseBracket-]
    // Pipe-|
    // Colon-:
    // Semi-;
    // Coma-,
    // Period-.
    // Question-?-
    // ForwardSlash-/-:;

    // We are pulling out these troublesome symbols from the queryExpression and replacing 
    // them with something different before sending them to the server.
    // We will reverse the process at the server.
    queryExpression = queryExpression.replace(/#/g, "{[POUND]}");
    queryExpression = queryExpression.replace(/&/g, "{[AMPERSAND]}");
    queryExpression = queryExpression.replace(/=/g, "{[EQUALS]}");
    // Escaping the following with a backslash now stops the system from inserting an extra backslash in the result.
    queryExpression = queryExpression.replace(/\\/g, "{[BACK-SLASH]}");    
    queryExpression = queryExpression.replace(/\'/g, "{[SINGLE-QUOTE]}");
    queryExpression = queryExpression.replace(/\+/g, "{[PLUS]}");

    // End of: Replace troublesome symbols in the query expression

    document.querySelector(".queryExpressionTextArea").value = queryExpression;

    // Send the query off with the fetch function below. 
    // Commented out because this now has it's own button to run the query.
    // runQuery(queryExpression);

  } // End of: function onClickEventBehaviorOfGenerateQueryButton(event)
  // End of: Define the function that fires when the generate query button is clicked.  

  // Bind the function above to the onClick event of the query button.
  document.querySelector("#generateQueryButton").addEventListener("click", onClickEventBehaviorOfGenerateQueryButton);



  // Define the function that fires when the order by conjunctionSelector changes.
  function onChangeBehaviorForOrderByConjunctionSelector (event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // Start of: Delete the filter elements directly below or add new ones depending on user's input.

    // Get a count of how many order by expressions already exist.
    let orderByClauseWrapperCount = document.querySelectorAll(".orderByClauseWrapper").length;

    // Get the previous setting if any.
    let previousSetting = event.target.getAttribute('data-previous');

    // Check the value of the conjunction select element chosen by the user.
    if (event.target.value == "") // If the blank option was selected we will delete the filter below.
    {
      // Get the value of the conjunction control we are about to delete because this value joins the next 
      // filter down the line (if one exists). We will move this value into the current conjuction selector.
      event.target.value = event.target.parentNode.parentNode.nextElementSibling.querySelectorAll(".orderByConjunctionSelector")[0].value;

      // Delete the filter below.
      event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode.nextElementSibling);

      // Store the new value as an attribute in case we need to work with this select element in the future.
      event.target.setAttribute('data-previous', event.target.value);
    }
    // otherwise if a conjunction was selected where it was previously blank we will add a new filter.
    else if (event.target.value != "" && previousSetting == "")
    {
      // Blank out the attribute that tracks the previous setting so that the cloned control starts out clean.
      event.target.setAttribute('data-previous','');

      // Clone a new wrapper, the child select element, and children options from the previous and append it to the DOM
      let elmnt = document.querySelectorAll(".orderByClauseWrapper")[orderByClauseWrapperCount - 1];
      let cln = elmnt.cloneNode(true);
  
      // Set all the element values to ""
      cln.querySelectorAll(".resetElement").forEach(function(element){element.value = "";}); 

      cln.querySelectorAll(".fieldToOrderBy")[0].addEventListener("change", onChangeBehaviorForFieldToOrderBySelector);  

      // Create an event listener for the onchange event of the newly cloned select element and bind this function to it.
      cln.querySelectorAll(".orderByConjunctionSelector")[0].addEventListener("change", onChangeBehaviorForOrderByConjunctionSelector);
  
      // Append the new clone to the new where-clause group
      document.querySelectorAll(".orderByClauseGroupWrapper")[0].appendChild(cln);     

      // Now that cloning is done we can use this attribute to keep track of the 
      // new value of the current conjunction control in case we need to change it again.
      event.target.setAttribute('data-previous', event.target.value);
    }
   
    // End of: Delete the filter elements directly below or add new ones depending on user's input.

  } // End of: function onChangeBehaviorForOrderByConjunctionSelector (event)
  // End of: Define the function that fires when the order by conjunctionSelector changes.

  // Bind the function above to the onChange event of the first (and only for now) conjunctionSelector element.
  document.querySelectorAll(".orderByConjunctionSelector")[0].addEventListener("change", onChangeBehaviorForOrderByConjunctionSelector);



  // Define the function that fires when the conjunctionSelector changes.
  function onChangeBehaviorForConjunctionSelector (event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // Start of: Delete the filter elements directly below or add new ones depending on user's input.

    // Get a count of how many filter expressions already exist.
    let whereClauseWrapperCount = document.querySelectorAll(".whereClauseWrapper").length;

    // Get the previous setting if any.
    let previousSetting = event.target.getAttribute('data-previous');

    // Check the value of the conjunction select element chosen by the user.
    if (event.target.value == "") // If the blank option was selected we will delete the filter below.
    {
      // Get the value of the conjunction control we are about to delete because this value joins the next 
      // filter down the line (if one exists). We will move this value into the current conjuction selector.
      event.target.value = event.target.parentNode.parentNode.nextElementSibling.querySelectorAll(".conjunctionSelector")[0].value;

      // Delete the filter below.
      event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode.nextElementSibling);

      // Store the new value as an attribute in case we need to work with this select element in the future.
      event.target.setAttribute('data-previous', event.target.value);
    }
    // otherwise if a conjunction was selected where it was previously blank we will add a new filter.
    else if ((event.target.value == "ANDWHERE" || event.target.value == "ORWHERE") && (previousSetting == ""))
    {
      // Blank out the attribute that tracks the previous setting so that the cloned control starts out clean.
      event.target.setAttribute('data-previous','');

      // Clone a new wrapper, the child select element, and children options from the previous and append it to the DOM
      let elmnt = document.querySelectorAll(".whereClauseWrapper")[whereClauseWrapperCount - 1];
      let cln = elmnt.cloneNode(true);
  
      // Set all the element values to ""
      cln.querySelectorAll(".resetElement").forEach(function(element){element.value = "";}); 
  
      // Create an event listener for the onchange event of the newly cloned select element and bind this function to it.
      cln.querySelectorAll(".conjunctionSelector")[0].addEventListener("change", onChangeBehaviorForConjunctionSelector);
  
      // Append the new clone to the new where-clause group
      document.querySelectorAll(".whereClauseGroupWrapper")[0].appendChild(cln);     

      // Now that cloning is done we can use this attribute to keep track of the 
      // new value of the current conjunction control in case we need to change it again.
      event.target.setAttribute('data-previous', event.target.value);
    }
   
    // End of: Delete the filter elements directly below or add new ones depending on user's input.

  } // End of: function onChangeBehaviorForConjunctionSelector (event)
  // End of: Define the function that fires when the conjunctionSelector changes.

  // Bind the function above to the onChange event of the first (and only for now) conjunctionSelector element.
  document.querySelectorAll(".conjunctionSelector")[0].addEventListener("change", onChangeBehaviorForConjunctionSelector);



  // Define the function that fires when the fieldToDisplay selector changes.
  function onChangeBehaviorForFieldToDisplaySelector (event)  
  {
    // Stop it from redirecting anywhere
    event.preventDefault();

    // Start of: Hide options which contain fields that are already displayed on select elements.
    // 1. Create an empty array to hold the values contained in the select elements.
    let selectorElementValues = [];

    // 2. Look at each select element and store their values in the array.
    document.querySelectorAll(".fieldToDisplay").forEach(function(element) 
    {
      // if the select elements are not blank
      if(element.value != "")
      {
        // Push the values onto the array.
        selectorElementValues.push(element.value);
      }
    });   
    
    // 3. Examine the menu options of the selector having focus and hide any 
    //    options that exist in the selectElementValues array.
    //    So if an item has already been selected then it won't show in the 
    //    list of items to select.
    document.querySelectorAll(".fieldToDisplay").forEach(function(element) 
    {
      let optionElements = element.querySelectorAll('option');  
  
      for (let optionElement of optionElements) 
      {
        if(selectorElementValues.indexOf(optionElement.innerHTML) > -1)
        {
          optionElement.style.display = "none";
        }    
        else
        {
          optionElement.style.display = "list-item";
        }  
      }
    }); 
    // End of: Hide options which contain fields that are already displayed on select elements.

    // Start of: Remove select elements when blanked out by user or add new blank select elements when needed.

    // Either of the two lines below will work. 
    // They both seem to return an array-like objects which are either an HTMLCollection or a NodeList
    // See the following page for a good explaination of the difference:
    // http://xahlee.info/js/js_array_vs_nodelist_vs_html_collection.html
    // querySelectorAll uses css selectors and it returns a NodeList that will respond to many array methods.
    // On the down side querySelectorAll is a bit slower and returns static elements which has advantages and disadvantages.
    // getElementsByClassName is a bit faster and it returns live elements but responds to fewer array methods.
    // See the following pages for a good explaination of what's the difference and how to work with these:
    // http://xahlee.info/js/js_get_elements.html or https://javascript.info/searching-elements-dom
    // let selectorCount = document.getElementsByClassName("fieldToDisplay").length;    
    let selectorCount = document.querySelectorAll(".fieldToDisplay").length;     

    // Get the amount of options contained in the select element.
    let optionsCount = document.querySelectorAll(".fieldToDisplay")[0].childElementCount;

    // Get the amount of fields contained in the select element.
    // This is the options count minus 1 because there is one option besides the fields.
    // The blank option is the extra option.
    let fieldsCount = optionsCount - 1;


    // Define a function to check that no blank select elements exist.
    let noBlanksExist = function ()
    {
      let foundBlank = false;

      // Look at each select element to see if any are blank.
      // Note: getElementsByClassName does not work with .forEach() the way 
      // querySelectorAll does but it will work with a regular for loop
      document.querySelectorAll(".fieldToDisplay").forEach(function(element)      
      {
        if(element.value == "")
        {
          foundBlank = true;
        }
      });

      if(foundBlank)
      {
        return false;
      }
      else
      {
        return true;
      }
    };
    // End of: Define a function that will check that no blank select elements exist.


    // if the user has selected the blank option and there is more than one select element showing:
    if(event.target.value == "" && selectorCount > 1)
    {
      // Remove the selector and it's wrapper. 
      // Normally the following would work to remove the selector - event.target.remove;
      // But we have to go up two ancestors to remove the wrapper as well.
      event.target.parentNode.parentNode.removeChild(event.target.parentNode);

      selectorCount = selectorCount - 1;
    }    

    // If there are still less selectors than there are fields avaliable for display and there are no blank select elements already:
    if(selectorCount < fieldsCount && noBlanksExist()) 
    {
      // Clone a new wrapper, the child select element, and children options from the previous and append it to the DOM
      let elmnt = document.querySelectorAll(".fieldToDisplayInputWrapper")[selectorCount - 1];
      let cln = elmnt.cloneNode(true);
      document.querySelectorAll(".selectClauseWrapper")[0].appendChild(cln);     

      // Create an event listener for the onchange event of the newly cloned select element and bind this function to it.
      document.querySelectorAll(".fieldToDisplay")[selectorCount].addEventListener("change", onChangeBehaviorForFieldToDisplaySelector);                 
    }
    // End of: Remove select elements when blanked out by user or add new blank select elements when needed.

  } // End of: function onChangeBehaviorForFieldToDisplaySelector (event)
  // End of: Define the function that fires when the fieldToDisplay selector changes.  

  // Bind the function above to the onChange event of the first (and only for now) fieldToDisplay select element.
  document.querySelectorAll(".fieldToDisplay")[0].addEventListener("change", onChangeBehaviorForFieldToDisplaySelector);
  
  

  // Define a function that calls for data from the server.
  // This is one of 3 ways that we call for data from the server.
  // This function is called when the submit query button is pressed and there is no sort order specified by the user.
  // As there is no sort order to process, there is no reason to wait for all the data to arrive before displaying it.
  // So this function streams data right to the webpage without waiting for all of it to arrive.
  async function runQueryThenStreamToDisplay(queryExpression, arrayOfFieldsToDisplay, nameOfPrimaryKey)
  {
    // Define a client function that calls for data from the server.
    const fetchPromise = fetch('api/user' + queryExpression)
    .then
    (
      (res) => 
      {
        // Verify that we have some sort of 2xx response that we can use
        if (!res.ok) 
        {
          // throw res;         
          console.log("Error trying to load the list of users: ");        
        }

        // If no content, immediately resolve, don't try to parse JSON
        if (res.status === 204) 
        {
          return;
        }

        // Initialize variable to hold chunks of data as they come across.
        let textBuffer = '';

        // Process the stream.
        return res.body

        // Decode as UTF-8 Text
        .pipeThrough
        (
          new TextDecoderStream()
        )

        // Split on lines
        .pipeThrough
        (
          new TransformStream
          (
            {
              transform(chunk, controller) 
              {
                textBuffer += chunk;            

                // Split the string of records on the new line character and store the result in an array named lines.
                const lines = textBuffer.split('\n');

                // Cycle through all elements in the array except for the last one which is only holding a new line character.
                for (const line of lines.slice(0, -1))
                {
                  // Put the element from the array into the controller que.
                  controller.enqueue(line);
                } // End of: for (const line ...)

                // Put the last element from the array (the new line character) into the textBuffer but don't put it in the que.
                textBuffer = lines.slice(-1)[0];             
              }, // End of: Transform(chunk, controller){do stuff}

              flush(controller) 
              {
                if (textBuffer) 
                {
                  controller.enqueue(textBuffer);
                } // End of: if (textBuffer)
              } // End of: flush(controller){do stuff}
            } // End of: parameters for new TransformStream
          ) // End of: call to constructor new TransformStream
        ) // End of: parameters for pipeThrough - Split on lines

        // Parse JSON objects
        .pipeThrough
        (
          new TransformStream
          (
            {
              transform(line, controller) 
              {
                if (line) 
                {
                  controller.enqueue
                  (
                    JSON.parse(line)
                  ); //End of: call to controller.enqueue function
                } // End of: if (line)
              } // End of: transform function
            } // End of: parameter object for new TransformStream
          ) // End of: new TransformStream parameters
        ); // End of: parameters for .pipeThrough - Parse JSON objects
      } // End of: .then callback function instruction for fetch
    ); // End of: .then callback parameters for fetch


    // Call to function which asks server for data.
    const res = await fetchPromise;

    const reader = res.getReader();

    function read() 
    {
      reader.read()
      .then
      (
        ({value, done}) => 
        {
          if (value) 
          {
            // Your object (value) will be here   
            
            // Insert a new row in the table.
            var tr = table.insertRow(-1);            
            
            // Insert a new cell for each field to display and populate with data for that field.
            arrayOfFieldsToDisplay.forEach(function(arrayElement, elementIndex)
            {
              let newCell = tr.insertCell(elementIndex);
              newCell.innerHTML = value[arrayElement];               
            });   

            let lastCell = tr.insertCell(arrayOfFieldsToDisplay.length);             
            lastCell.innerHTML = '<a href="/user/edit?userId=' + value[nameOfPrimaryKey] + '">View / Edit / Delete</a>';

          } // End of: if(value){do stuff}

          if (done) {return;}

          read();

        } // End of: the actual anonymous callback arrow function.
      ); // End of: .then callback after read function completes.
    } // End of: function definition: function read(){do stuff}

    // Call the "read" function defined above when the submit query button is pressed.
    read();

  }; // End of: async function runQueryStreamToDisplay(queryExpression)  

} // End of: app.loadUsersListPage = async function(){...}
// End of: Populate the userList webpage with user records.




// Load the dashboard page with data from the server.
// This function is called once when the page loads.
app.loadChecksListPage = function()
{
  // Get the phone number from the current token
  var phone = typeof(app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;

  if(phone) 
  {
    // Define which file will be retrieved from the users folder.
    var queryStringObject = {'phone' : phone};

    // Load responsePayload with the user's JSON record found in the user file for which the fileName matches 
    // the user's phone number given in the queryStringObject. What we want from the JSON record is the array of 
    // checks that belong to the user. Then run the callback defined here to load the page with the user's checks.
    app.client.request(undefined,'api/users','GET',queryStringObject,undefined,function(statusCode,responsePayload)
    {
      if(statusCode == 200) // The user's JSON record was retrived successfully.
      {
        // Load allChecks with the array of checks that were found in the user's JSON record.
        var allChecks = typeof(responsePayload.checks) == 'object' && responsePayload.checks instanceof Array && responsePayload.checks.length > 0 ? responsePayload.checks : [];

        // If the user has checks to load on the webpage:
        if(allChecks.length > 0) 
        {
          // Cycle through the array and insert each check as a new row in the table.
          allChecks.forEach(function(checkId)
          {
            // Create a queryStringObject that can be used to ask the server for a check.
            var newQueryStringObject = {'id' : checkId};

            // Ask the server for the JSON record found in the check file for which the file name matches the checkId.
            // Then run the callback function defined here which inserts a row into the checksListTable on the webpage
            // and populates it with data from the JSON record.
            app.client.request(undefined,'api/checks','GET',newQueryStringObject,undefined,function(statusCode,responsePayload)
            {
              // if the JSON record with info about the check was retrieved successfully
              if(statusCode == 200) 
              {
                // Create a handle which can be used to manipulate the table on the webpage.
                var table = document.getElementById("checksListTable");

                // Insert a new row in the table.
                var tr = table.insertRow(-1);
                // Make the new row a member of the class 'checkRow'
                tr.classList.add('checkRow');

                // Insert five new cells into the new row.
                var td0 = tr.insertCell(0);
                var td1 = tr.insertCell(1);
                var td2 = tr.insertCell(2);
                var td3 = tr.insertCell(3);
                var td4 = tr.insertCell(4);

                // load the new cells with data from the responsePayload.
                td0.innerHTML = responsePayload.method.toUpperCase();
                td1.innerHTML = responsePayload.protocol+'://';
                td2.innerHTML = responsePayload.url;
                var state = typeof(responsePayload.state) == 'string' ? responsePayload.state : 'unknown';
                td3.innerHTML = state;
                td4.innerHTML = '<a href="/checks/edit?id='+responsePayload.id+'">View / Edit / Delete</a>';
              } // End of: if the JSON record with info about the check was retrieved successfully
              else // Status code was not 200. There was a problem retriving the JSON record in the check file.
              {
                console.log("Error trying to load check ID: ",checkId);
              }
            }); // End of: app.client.request(undefined,'api/checks','GET'...
          }); //End of: allChecks.forEach(function(checkId){...}

          if(allChecks.length < 5) //Only 5 checks allowed.
          {
            // Show the createCheck CTA
            document.getElementById("createNewRecordCTA").style.display = 'block';
          }

        } // End of: if checks were found in the user's file.
        else // There were no checks found in the user file.
        {
          // Show 'you have no checks' message
          document.getElementById("noChecksMessage").style.display = 'table-row';

          // Show the createCheck CTA
          document.getElementById("createNewRecordCTA").style.display = 'block';

        }
      } // End of: If the user's JSON record was retrieved successfully.
      else // The user's JSON record was not retrived successfully.
      {
        // If the request comes back as something other than 200, log the user out 
        // on the assumption that the api is temporarily down or the users token is bad
        app.logUserOut();
      }
    }); // End of: app.client.request(undefined,'api/users'...
  } //End of: if(phone)
  else // No phone number was found in the session token.
  {
    app.logUserOut();
  }
}; //End of: app.loadChecksListPage = function(){...}
// End of: Load the dashboard page with data from the server.




// Load the checks edit page with data from the server.
// This function is called once when the page loads.
app.loadChecksEditPage = function()
{
  // Get the check id from the query string in the address bar, if none is found then redirect back to dashboard
  var id = typeof(window.location.href.split('=')[1]) == 'string' && window.location.href.split('=')[1].length > 0 ? window.location.href.split('=')[1] : false;

  if(id)
  {
    // Make an object from the id string for use in the server request below.
    var queryStringObject = {'id' : id};

    // Ask the server for the JSON record found in the check file for which the file name matches the queryStringObject.
    // Then run the callback function defined here which populates the forms on the webpage with data from the record.   
    app.client.request(undefined,'api/checks','GET',queryStringObject,undefined,function(statusCode,responsePayload)
    {
      // If the JSON record was retrieved from the file successfully:
      if(statusCode == 200) 
      {
        // Create handles which will be used to manipulate the hiddenIdInputs on the webpage.
        var hiddenIdInputs = document.querySelectorAll("input.hiddenIdInput");

        // Cycle through the hidden inputs on webpage and populate with the checkId
        for(var i = 0; i < hiddenIdInputs.length; i++)
        {
            hiddenIdInputs[i].value = responsePayload.id;
        }

        // Put the data into the top form as values where needed
        document.querySelector("#checksEdit1 .displayIdInput").value = responsePayload.id;
        document.querySelector("#checksEdit1 .displayStateInput").value = responsePayload.state;
        document.querySelector("#checksEdit1 .protocolInput").value = responsePayload.protocol;
        document.querySelector("#checksEdit1 .urlInput").value = responsePayload.url;
        document.querySelector("#checksEdit1 .methodInput").value = responsePayload.method;
        document.querySelector("#checksEdit1 .timeoutInput").value = responsePayload.timeoutSeconds;

        // Create a handle for manipulating the checkboxes on the form.
        var successCodeCheckboxes = document.querySelectorAll("#checksEdit1 input.successCodesInput");

        // Cycle through all the checkboxes on the form.
        for(var i = 0; i < successCodeCheckboxes.length; i++)
        {
          // If the checkbox we are currently looking at on the form is a 
          // member of the success codes stored in the JSON record:
          if(responsePayload.successCodes.indexOf(parseInt(successCodeCheckboxes[i].value)) > -1)
          {
            // Mark the checkbox on the form with a check mark
            successCodeCheckboxes[i].checked = true;
          }
        } // End of: Cycle through all the checkboxes on the form.
      } 
      else // the status code was not 200
      {
        // If the request comes back as something other than 200, redirect back to dashboard
        window.location = '/checks/all';
      }
    }); // app.client.request(undefined,'api/checks','GET'...
  } // End of: If the address bar contained the checkId in the query string.
  else // There was no checkId in the address bar's query string.
  {
    // Send the user to the checks/all webpage.
    window.location = '/checks/all';
  }
}; // End of: app.loadChecksEditPage = function(){...}
// End of: Load the checks edit page with data from the server.




// Loop to renew token often
app.tokenRenewalLoop = function()
{
  setInterval(function()
  {
    app.renewToken(function(err)
    {
      if(!err)
      {
        console.log("Token renewed successfully @ "+Date.now());
      }
    });
  },1000 * 60);
};
// End of: Loop to renew token often



// Init (bootstrapping)
app.init = function(){

  // Bind all form submissions
  app.bindForms();

  // Bind logout button
  app.bindLogoutButton(); 
    
  // Get the token from localstorage
  app.getSessionToken();

  // Renew token
  app.tokenRenewalLoop();

  // Load data on page
  app.loadDataOnPage();

};
// End of: Init (bootstrapping)



// Call the init processes after the window loads.
// This is where it all starts.
window.onload = function(){
  app.init();
};
