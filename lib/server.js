/*
*
* Server related taskes
*
*/



// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const _data = require('./data');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');




// Instantiate the server module object.
var server = {};




// Instantiate the http server.
server.httpServer = http.createServer(function(req, res){
  server.unifiedServer(req, res);
});




// Specify location of the key and certificate for the https server.
server.httpsServerOptions = {
  'key' : fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
  'cert' : fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};




// Instantiate the https server.
server.httpsServer = https.createServer(server.httpsServerOptions, function(req, res){
  server.unifiedServer(req, res);
});




// Define a function to route requests from the client to the handler and to serve back a response.
// All the logic for both the http and https server
server.unifiedServer = function(req, res)
{
  // Get the URL and parse it.
  var parsedUrl = url.parse(req.url, true);

  // Get the path from the URL.
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object.
  var queryStringObject = parsedUrl.query;

  // Get the http method.
  var method = req.method.toLowerCase(); 

  // Get the headers as an Object
  var headers = req.headers;

  // Instantiate decoder that will turn payload buffer into a string.
  var decoder = new StringDecoder('utf8');

  // Create an empty string for the request payload. 
  // It's called buffer but it is not a JavaScript buffer (not binary data) - it's just an empty string.
  // We are going to use it to hold the request payload buffer after it has been decoded and turned into a string.
  var buffer = '';


  // Call to event emitter req.on('data...
  // Watch for a chunk of data from the client's request payload buffer. 
  // The run the callback defined below with the returned data.
  req.on('data', function(data)
  {
    // Decode the chunk and write it to the payload string.
    buffer += decoder.write(data);
  });


  // Call to event emitter req.on('end...    
  // Watch for the end of the payload from the client request.
  // The callback defined here is the action taken after the entire request has been received.
  req.on('end', function()
  {
    // Finish writing to the buffer.
    buffer += decoder.end();


    // Choose the handler the client's request should go to.
    // If one is not found, use the notFound handler.
    // To be clear: A key in the router object below should match the request from the client.
    // chosenHandler becomes an alias for the handler function which is mapped to the key in the router object.
    // This is how we can refer to the handler function without knowing what it is in advance.
    var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

    // If the request is within the public directory, use the public handler instead of what was assigned by the line above.
    // The line below is required because the line above will only match a handler to a client request if
    //   the request exactly matches one of the keys in the request router object at the bottom of this file. 
    //   So if the request is "public" then we have a match with the public handler. But request 
    //   public/app.css would not be matched with a handler.
    chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;


    // Construct the data object to send to the handler.
    var data = 
    {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : helpers.parseJsonToObject(buffer) 
    }; // End of: Construct the data object to send to the handler.


    // Call the handler specified by the client. 
    // Then execute the callback we are passing in as an argument.
    chosenHandler(data, function(statusCode, payload, contentType)
    {
      // Determine the type of response - default to json.
      contentType = typeof(contentType) == 'string' ? contentType : 'json';

      // Use the status code called back by the handler, or default to 200.
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;


      // Return the response parts that are content specific.
      var payloadString = '';

      if(contentType == 'json')
      {
        res.setHeader('Content-Type', 'application/json');    

        // Use the payload called back by the handler, or default to an empty object.
        payload = typeof(payload) =='object' ? payload : {};     
        
        // Convert the payload to a string.
        payloadString =  JSON.stringify(payload);        
      }

      if(contentType == 'html')
      {
        res.setHeader('Content-Type', 'text/html');       
        payloadString = typeof(payload) == 'string' ? payload : '';   
      }     
      
      if(contentType == 'favicon')
      {
        res.setHeader('Content-Type', 'image/x-icon');       
        payloadString = typeof(payload) !== 'undefined' ? payload : '';   
      }  
      
      if(contentType == 'css')
      {
        res.setHeader('Content-Type', 'text/css');       
        payloadString = typeof(payload) !== 'undefined' ? payload : '';   
      }  
      
      if(contentType == 'png')
      {
        res.setHeader('Content-Type', 'image/png');       
        payloadString = typeof(payload) !== 'undefined' ? payload : '';   
      }  
      
      if(contentType == 'jpg')
      {
        res.setHeader('Content-Type', 'image/jpeg');       
        payloadString = typeof(payload) !== 'undefined' ? payload : '';   
      }  
      
      if(contentType == 'plain')
      {
        res.setHeader('Content-Type', 'text/plain');       
        payloadString = typeof(payload) !== 'undefined' ? payload : '';   
      }        

      // Return the response parts that are common to all content-types.
      res.writeHead(statusCode);
      res.end(payloadString);      

      console.log('Returning this response: ', statusCode);
    }); // End of: call to chosenHandler(...
  }); // End of: call to req.on('end', function(...
}; // End of: var unifiedServer = function(...
// End of: Define a function to route requests from the client to the handler and to serve back a response.




// Define a request router.
server.router = {
  '' : handlers.index,
  'account/create' : handlers.accountCreate,
  'account/edit' : handlers.accountEdit,
  'account/deleted' : handlers.accountDeleted,
  'session/create' : handlers.sessionCreate,
  'session/deleted' : handlers.sessionDeleted,
  'checks/all': handlers.checksList,
  'checks/create' : handlers.checksCreate,
  'checks/edit' : handlers.checksEdit,
  'ping' : handlers.ping,
  'api/users' : handlers.users,
  'api/tokens' : handlers.tokens,
  'api/checks' : handlers.checks,
  'favicon.ico' : handlers.favicon,
  'public' : handlers.public,
};




// Init script
server.init = function()
{
  // Start the http server
  server.httpServer.listen(config.httpPort, function()
  {
    console.log('The server is listening on port ' + config.httpPort + ' in ' + config.envName + ' mode.');
  });    

  // Start the https server.
  // Note: https is not working on ports 3001 and 5001 - 
  // probably because the certificates were not created on this computer but were rather copied from another.
  // To fix this:
  // I will need to install the openssl library and run the following command at the console from the https directory:
  // openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
  server.httpsServer.listen(config.httpsPort, function()
  {
    console.log('The server is listening on port ' + config.httpsPort + ' in ' + config.envName + ' mode.');
  }); 

};




// Export the module.
module.exports = server;