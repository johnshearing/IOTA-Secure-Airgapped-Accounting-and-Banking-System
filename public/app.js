/*
 * Frontend Logic for application
 *
 */

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

// Interface for making API calls
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
  var formsWithSuccessMessages = ['accountEdit1', 'accountEdit2','checksEdit1'];

  // If the form just successfully submitted is a member of the above array:
  if(formsWithSuccessMessages.indexOf(formId) > -1)
  {
    // Display the success Message
    document.querySelector("#"+formId+" .formSuccess").style.display = 'block';
  }
  // End of: If forms saved successfully and they have success messages, show them.


  // If the user just deleted their account, redirect them to the account-delete page
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
            document.getElementById("createCheckCTA").style.display = 'block';
          }

        } // End of: if checks were found in the user's file.
        else // There were no checks found in the user file.
        {
          // Show 'you have no checks' message
          document.getElementById("noChecksMessage").style.display = 'table-row';

          // Show the createCheck CTA
          document.getElementById("createCheckCTA").style.display = 'block';

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

  // Bind logout logout button
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
