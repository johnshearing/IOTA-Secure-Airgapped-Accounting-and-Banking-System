///////////////////////////////////////////////////////////////////////////////////////////////////////
/*
* Hash a string at the node console
* enter: var myHash = require('./notes')
* enter: myHash.hash('The rain in Spain')
* Later it will be fun to give this a web interface.
*/

/*
// Dependencies
var crypto = require('crypto');

// Create a container for all the functions
var container = {};

container.hash = function(inputString){
    var hashResult = crypto.createHash('sha256').update(inputString).digest('base64');
    return hashResult;
};


// Export the module
module.exports = container;

*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
// For testing handlers._user.post() in the aHandlers file.
let handlers = require('./aHandlers');
let data = {};
data.payload = {};
data.payload.email = "peter@gmail.com";
data.payload.password = "ok";

let callback = function(statusCode, errorMessage)
{
  // console.log(statusCode);
  // console.log(statusCode, errorMessage);
  console.log(statusCode);
}

handlers._user.post(data, callback);
//////////////////////////////////////////////////////////////////////////////////////////////////////////



/*
Use the following snippet to create a form in the DOM using chrome.
Right click over the HTML and click edit HTML

<form action="/users" method="post">
<textarea id="Message" name="Message"></textarea>
<button type="submit">Send Request</button>
</form>

The following is some data for the form
{
"firstName":"John",
"lastName":"Smith",
"phone":"5555555556",
"email":"john@gmail.com",
"password":"12345",
"tosAgreement":true
}

A valid json object uses double quotes.
*/


// Testing
/*
// Example of creating a file
let _data = require('./aData.js');
_data.create('test', 'newFile', {'foo': 'bar'}, function(err){
  console.log('This was the error ', err);
});

// Example of reading a file.
let _data = require('./aData.js');
_data.read('dbPermissions/user/', 'user', function(err, data){
  console.log('This was the error ', err, ' and this was the data ', data);
});

// Example of updating a file.
let _data = require('./aData.js');
_data.update('test', 'newFile', {'fizz': 'buzz'}, function(err){
  console.log('This was the error ', err);
});


// Example of deleting a file.
_data.delete('test', 'newFile', function(err){
  console.log('This was the error ', err);
});


// Calling the data.append function.
let _data = require('./aData.js');
_data.append('/dbPermissions/user', 'user',{"id":72, "email":"charlie@gmail.com","hashedPassword":"36583a77a098c02ef111e2f2521d77b58e420f2bc7e9bf930ec24b21d42ea2e0"}, function(error){console.log(error)});






// For generating random unique IDs at the console.
// Comment out for production.
// const helpers = require('./aHelpers.js')
// console.log(helpers.createRandomString(20));



