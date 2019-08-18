/*
* Create and export configuration variables.
*
*/

// Create a container for all the environments.
var environments = {};

// Create subcontainer for the staging (default) environment.
environments.staging =
{
  'httpPort' : 3000,
  'httpsPort' : 3001,  
  'envName' : 'staging',
'hashingSecret' : 'MyHashingSecretStaging', //  Danger!!! Change this value!!! Keep this value a secret!!!
  'maxChecks' : 5,
  'templateGlobals' : 
  {
    'appName' : 'IOTA Wallet',
    'companyName' : 'www.privateKeyVault.com',
    'yearCreated' : '2019',
    'baseUrl' : 'http://localhost:3000/'
  },
  'twilio' : 
  {
    'accountSid' : '', // Removed for Security - Get this from twilio
    'authToken' : '',  // Removed for Security - Get this from twilio 
    'fromPhone' : ''   // Removed for Security - Get this from twilio
  }
};

// Create subcontainer for the production environment.
environments.production =
{
  'httpPort' : 5000,
  'httpsPort' : 5001,  
  'envName' : 'production',
  'hashingSecret' : 'MyHashingSecretProduction',  //  Danger!!! Change this value!!! Keep this value a secret!!!
  'maxChecks' : 5,    
  'templateGlobals' : 
  {
    'appName' : 'IOTA Wallet',
    'companyName' : 'www.privateKeyVault.com',
    'yearCreated' : '2019',
    'baseUrl' : 'http://localhost:5000/'
  },
  'twilio' : 
  {
    'accountSid' : '',  // Removed for Security - Get this from twilio
    'authToken' : '',   // Removed for Security - Get this from twilio
    'fromPhone' : ''    // Removed for Security - Get this from twilio
  }    
};

// Determine which environment was passed as a command-line argument.
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the currentEnvironment is one of the environments above.
// If not then default to staging.
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

 module.exports = environmentToExport;