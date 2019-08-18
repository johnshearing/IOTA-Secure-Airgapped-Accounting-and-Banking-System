const iotaLibrary = require('@iota/core'); 
const { generateAddress } = require('@iota/core'); 
const { createPrepareTransfers } = require('@iota/core'); 
const { isTrytes } = require('@iota/validators');
const { isValidChecksum } = require('@iota/checksum');
const { asciiToTrytes } = require('@iota/converter');


function signBundle(): void {


  // Read user input fields
  let seed: string = (<HTMLInputElement>document.getElementById('seed')).value;
  let fromAddress: string = (<HTMLInputElement>document.getElementById('fromAddress')).value;
  let fromAddressIndex: number = Number((<HTMLInputElement>document.getElementById('fromAddressIndex')).value);
  let fromAddressBalance: number = Number((<HTMLInputElement>document.getElementById('fromAddressBalance')).value);
  let toAddress: string = (<HTMLInputElement>document.getElementById('toAddress')).value;
  let securityLevel: number = Number((<HTMLInputElement>document.getElementById('securityLevel')).value);
  let transferAmount: number = Number((<HTMLInputElement>document.getElementById('transferAmount')).value);
  let remainderAddress: string = (<HTMLInputElement>document.getElementById('remainderAddress')).value;
  let message: string = (<HTMLInputElement>document.getElementById('message')).value;
  
  // Find references for feedback and output elements
  let feedbackElement: HTMLInputElement = <HTMLInputElement>document.getElementById('signResult');
  let outputElement: HTMLInputElement = <HTMLInputElement>document.getElementById('signedBundle');
  
  // Clear output fields
  feedbackElement.value = "";
  outputElement.value = "";

  // Validate inputs
  if (isTrytes(seed) !== true || seed.length !== 81) {
    feedbackElement.innerHTML = "Input validation error! Input 'seed' must be 81 trytes long.";
    return;
  }

  if (!Number.isInteger(securityLevel) || ((securityLevel !== 1 && securityLevel !== 2 && securityLevel !== 3))) {
    feedbackElement.innerHTML = "Input validation error! Input 'securityLevel' must be an integer of value '1', '2' or '3'.";
    return;
  }

  if (fromAddress.length !== 90 || isTrytes(fromAddress) !== true) {
    feedbackElement.innerHTML = "Input validation error! Input 'fromAddress' must be 90 trytes long and include the checksum.";
    return;
  }

  if (isValidChecksum(fromAddress) !== true) {
    feedbackElement.innerHTML = "Input validation error! Input 'fromAddress' checksum failed validation check.";
    return;
  }

  if (toAddress.length !== 90 || isTrytes(toAddress) !== true) {
    feedbackElement.innerHTML = "Input validation error! Input 'toAddress' must be 90 trytes long and include the checksum.";
    return;
  }

  if (isValidChecksum(toAddress) !== true) {
    feedbackElement.innerHTML = "Input validation error! Input 'toAddress' checksum failed validation check.";
    return;
  }

  if (Number.isInteger(fromAddressBalance) !== true || fromAddressBalance < 0) {
    feedbackElement.innerHTML = "Input validation error! Input 'fromAddressBalance' must be an integer of value zero or more.";
    return;
  }

  if (Number.isInteger(transferAmount) !== true || transferAmount < 0) {
    feedbackElement.innerHTML = "Input validation error! Input 'transferAmount' must be an integer of value zero or more.";
    return;
  }

  if (transferAmount < fromAddressBalance) {
    if (isTrytes(remainderAddress) !== true) {
      feedbackElement.innerHTML = "Input validation error! Input 'remainderAddress' must be set because the 'transferAmount' is less than the 'fromAddressBalance'. Input 'remainderAddress' must be 90 trytes long and include the checksum.";
      return;
    }
    if (remainderAddress.length !== 90) {
      feedbackElement.innerHTML = "Input validation error! Input 'remainderAddress' must be 90 trytes long and include the checksum.";
      return;
    }
    if (isValidChecksum(remainderAddress) !== true) {
      feedbackElement.innerHTML = "Input validation error! Input 'remainderAddress' checksum failed validation check.";
      return;
    }
  }

  if (transferAmount > fromAddressBalance) {
    feedbackElement.innerHTML = "Input validation error! Input 'transferAmount' should not be more than 'fromAddressBalance'.";
    return;
  }

  if (Number.isInteger(fromAddressIndex) !== true || fromAddressIndex < 0) {
    feedbackElement.innerHTML = "Input validation error! Input 'fromAddressIndex' must be a positive integer of value zero or more.";
    return;
  }

  let fromAddressDeterministic = generateAddress(seed, fromAddressIndex, securityLevel, true);
  if (fromAddress !== fromAddressDeterministic) {
    feedbackElement.innerHTML = "Input validation error! Input 'fromAddress' is not matching the 'fromAddressIndex'.";
    return;
  }

  if ((/^[\x00-\x7F]*$/.test(message)) !== true) {
    feedbackElement.innerHTML = "Input validation error! Input 'message' may only contain ASCII characters";
    return;
  }

  // Construct a transfers object
  let transfers = [{
    'address': toAddress,
    'message': asciiToTrytes(message),
    'value': transferAmount,
    'tag': 'IOTAOFFLINE'
  }];

  // Add a remainder address if specified by the user

  if (remainderAddress) {
    transfers.push({
      'address': remainderAddress,
      'message': asciiToTrytes(message),
      'value': fromAddressBalance - transferAmount,
      'tag': 'IOTAOFFLINE'
    });
  }

  // Construct an options object that includes the input
  let options = {};
  if (transferAmount > 0) {
    options = {
      'inputs': [{
        'keyIndex': fromAddressIndex,
        'address': fromAddress,
        'security': securityLevel,
        'balance': fromAddressBalance
      }]
    };
  }

  // Sign the bundle
  createPrepareTransfers()(seed, transfers, options)
    .then((bundleTrytes: any) => {
      outputElement.value = JSON.stringify(bundleTrytes);
      feedbackElement.innerHTML = "Success! Transaction bundle signed!";
    })
    .catch((err: any) => {
      feedbackElement.innerHTML = "An unexpected error occurred upon signing the bundle! Read the console for additional details.";
      console.log(`Error: ${err}`);
    });
}

// Expose the function to the browser
(<any>window).signBundle = signBundle;

