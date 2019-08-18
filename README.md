# IOTA-Secure-Airgapped-Accounting-and-Banking-System  
## For Government, Enterprise, Individuals, and Machines  
This is the last piece of the puzzle in [The PrivateKeyVault family of repositories](https://github.com/johnshearing).  
It's starting out as a NodeJS code generator and database on it's way to becoming a multi-sig wallet for IOTA.  
When it matures it will be the first full blown accounting/banking system for IOTA that machines, individuals, corporations, and governments can use for managing their business and for cooperating with each other.  
This work in progress is a continuation of tutorial [IOTA-Airgapped-NodeJS-Console-Wallet](https://github.com/johnshearing/IOTA-Airgapped-NodeJS-Console-Wallet).  
 
This accounting/banking system is being constructed using the methods shown in the following tutorial:  
[The NodeJS Master Class - No Frameworks, No NPM, No Dependencies](https://pirple.thinkific.com/courses/the-nodejs-master-class)  
No dependencies makes for easy auditing.  

This app runs in the browser using NodeJS Client server architecture.  
Built to run on a single airgapped [PrivateKeyVault](https://github.com/johnshearing/PrivateKeyVault) for individuals or on an airgapped network for large institutions or government. All this code will run on any device that can run NodeJS.  

When this accounting/banking system is finished, a video tutorial will be made explaining each line of code so you can write everything from scratch if you want to. This will facilitate an audit.  

Let's get started.   
To use this application simply follow the instructions below.  

#### Install NodeJS.  
* Install NodeJS on your airgapped computer and your online computer if you are using two machines.  
* If you are just experimenting with small amounts of IOTA then you may prefer to use an online machine only.  
* You may be wondering, how am I supposed to install software on an airgapped machine that does not connect to the Internet?  
* Your airgapped computer does not have any private information on it yet, so for right now it's ok to connect to the Internet.  
* When all the software is installed and you are ready to sign transactions, then you simply pull the plug on the Internet and never connect to it again.  
* Then you will create new seeds and new addresses from behind the airgap and use these instead of the experimental ones you are playing with now.  
* If you are using a PrivateKeyVault or a raspberry pi 2 then NodeJS installation instructions are [here](https://github.com/johnshearing/PrivateKeyVault#install-nodejs-and-npm).  
* Otherwise download NodeJS for your system [here](https://nodejs.org/en/download/).   

#### Install iota.js  
* [Check out the documentation - found here](https://github.com/iotaledger/iota.js/blob/next/api_reference.md)  
* [The iota.js library and install instructions are found here](https://github.com/iotaledger/iota.js).  
* To install:  
  * Make a new directory on each machine. Call it **iotajs**.  
  * At the bash console, cd into the directory.  
  * Execute the following command at the bash console to create a package.json file.  
  * The package.json file is used to manage your project.  
  * `npm init`  Accept all the defaults.  
  * Next install the iota.js library by executing the following command at the bash console.  
  * `npm install @iota/core`  

#### Install the iotaAirgappedClientServerWallet repository    
* Then execute the following command at the BASH console.   
* `git clone https://github.com/johnshearing/IOTA-Secure-Airgapped-Accounting-System.git`  
* Now the Client/Server wallet is installed in a new directory called **IOTA-Secure-Airgapped-Accounting-System**  
* Change the name of the directory to something shorter. Call it **ias** for IOTA Accounting System.  
* At the BASH console, CD into the **ias** directory    

#### Start the Application  
Run the following command to start the NodeJS server:  
`node ./index.js`  
Finally, open your browser and enter the following address:  
`http://localhost:3000/`  
You should see the application running in your browser.
 
The app runs well but it doesn't do anything IOTA related yet.  
IOTA functionality will be built in very shortly.  
The focus now is on getting the framework right.  
Then building on top of this framework will go quickly.  
 
#### What's Different and Where's the Opportunity?
Large centralized systems are very hard to secure. That's why we keep hearing about hacks at large institutions. Large means lots of vulnerabilities and complex means that these weaknesses are very hard to see. This doesn't mater so much with a large accounting system when the actual funds they track are secured by banks. But an accounting system for cryptocurrency also protects the currency from theft. It must be both accounting system and bank.  

Small simple systems are inherently more secure and easier to protect because small means fewer vulnerabilities and simple means those weaknesses are easier to spot. Furthermore, distributed systems are harder to attack and typically yield less profit for the attacker because they tend to be smaller. That's a deterrent which itself is a strong protection.  
 
Since the accounting/banking system we are building is for a decentralized ledger, it does not have to be big or complicated as in centralized systems. Think about how [very simple creatures, like bees, when grouped together perform complex behaviours, like voting, in a very efficient manner without any centralized system to count the votes - without a centralized system to get hacked](https://youtu.be/AonV_MkUFSs). There will be many of these simple accounting/banking systems (bees if you will) that when working together will provide the complex behaviors society needs for efficient collaboration.  

* So Who's In Charge?  
The rules and laws are in charge - the rules and laws that we set up at the local level. Referring back to bees again - each bee responds to a simple set of rules programmed by evolution. We get to define the rules that our accounting/banking systems will follow. Everyone can make different decisions about how their particular system behaves within the boundaries of the law. So that means individuals are in charge.  

* Smart Contracts - How Our Small Accounting/Banking Systems Interact With Each Other To Do Big Things  
Think: smart money, Think: smart information  
Now we can embed computer software into the money and data we send which defines how we want them to behave.  
These smart contracts are created by our accounting/banking systems and then executed on special distributed ledgers called blockchains.  

* Keeping Control of the Process  
We don't want our busy little accounting/banking systems moving money, casting votes, or transceiving any kind of information without our explicit knowledge and consent. This is why we have developed this [open source airgapped computer called the PrivateKeyVault](https://github.com/johnshearing/PrivateKeyVault) to run our little accounting/banking systems. This computer ensures that no information moves in or out of the system without a human gatekeeper reviewing the content and explicitly granting permission to allow the transmission. Any computer can be used but is should be airgapped and physically secured to prevent tampering.  

* So much for the overview - back to the job of building our simple accounting/banking system for IOTA.  

#### Features:  
* Database Functionality.  
  * Table locking is used to make the application multiuser. Row and field locking should not be required because each of these small distributed systems are only supposed to support a small number of users. An unlimited amount of users and complex behavior can be supported through the interactions of these simple systems.  
  * Transaction rollbacks are initiated if any part of a transaction fails.  
  * All records in the database (no matter from what table) get their unique ids from a single incremented source so that every record has a system wide unique id that identifies when it was created with respect to all the other records in the database. You will see why in a minute.  
  * Any adds, changes, or deletes to a record are recorded in a log that captures the entire record in it's new state. This along with the system wide unique ids allows the entire database to be reconstructed to represent any point in history.  
  * The application is being roughed out now with a simple JSON database [taught by Leslie Lewis in his NodeJS Master Class](https://pirple.thinkific.com/courses/the-nodejs-master-class). Once there is something to play with, simple indexing will be added.  
  * [Here you can see what has already been implemented and you see the plan in greater detail.](https://github.com/johnshearing/IOTA-Secure-Airgapped-Accounting-System/blob/master/data/dbHistory/README.md)  
* A Code Generator:
  * Rather than writing post, get, put, delete, validation, and user interface functions for every table, there will be templates instead that get populated with metadata including all the business rules that make each table, each record, and each field unique. It is common practice to use templates and metadata for generating html and JavaScript on the fly for browser consumption. We are simply extending the practice for the server side NodeJS code as well.  
  * First a simple app will be written and tested. Then templates will be made for every type of function using the simple app as a model. From that point on, any changes to the app are made in the templates and the metadata. After any changes are made, the application is regenerated. This way, major changes to functionality ripple down through the system without having to change the handlers for each table and their user interfaces. This eliminates most programming errors and makes it possible to make big changes to the system as we try to figure out what works and what does not. I did this about 20 years ago using Delphi and SQL Server. It worked great. Now I am going to do it again using NodeJS and JavaScript.  
  * The big payoff here is in the audit. As a system grows in size it becomes exponentially harder to audit. So rather than trying to audit the generated code. All we need to do is audit the code generator and the metadata used to generate the application. This is a much smaller and more manageable job that will lead to much tighter security and faster fixes when security flaws are discovered.  
* [Generate truly random seeds](https://github.com/johnshearing/IOTA-Airgapped-NodeJS-Console-Wallet#generating-seeds-with-a-true-random-number-generator) (not pseudo-random) with special hardware built into every raspberry pi 2, or use another method if you want,
* Generate keystore files for seeds.  
  * This is an encrypted file containing just a seed.  
  * You could give the file to other people to hold for you but they would not be able to access the seed without your password.  
  * This provides a secure way to store seeds in another location before putting IOTAs in any addresses generated by that seed.  
  * There will be tears and gnashing of teeth for those who use a seed before making several keystore files and storing them in different secure locations.
* [Identify healthy nodes](https://github.com/johnshearing/IOTA-Airgapped-NodeJS-Console-Wallet#find-a-healthy-computer-on-the-tangle-to-use-for-checking-the-balance-of-your-new-address),   
* [Generate addresses and check balances for a single address or for a list of addresses](https://github.com/johnshearing/IOTA-Airgapped-NodeJS-Console-Wallet#check-your-balance-at-address-a0),   
  * The accounting system does NOT check seed balances directly. This is for security reasons.  
  * Instead, the list of addresses generated by the seed is supplied by the database. The balances of each address can be checked and added up to give the seed's balance. This way you can get the seed balance without exposing your seed to any other device.
  * Working this way also eliminates the confusion created by snap shots.  
* [Bundle Transactions Offline then Broadcast Transactions Online,](https://github.com/johnshearing/IOTA-Airgapped-NodeJS-Console-Wallet#make-a-signed-transaction-bundle-and-broadcast-it-to-the-tangle)   
  * Users will see a visual representation of actions the bundle will perform as check before broadcasting bundle.  
  * If the bundle does not make it onto the tangle within a set period of time the bundle will be promoted, reattached, or rebroadcast.  
  * And if the bundle is still not accepted after several attempts then a text message will be transmitted to the sender's phone.    
* [Handle Multi-Signatures building upon work found here](https://www.mobilefish.com/services/cryptocurrency/iota_multisig.html),  
* [GPG Messaging](https://www.youtube.com/watch?v=qUWWuHium30),  
* MAM Masked Authenticated Messaging,  
* Implement all the functionality available through Qubic as that comes online,  
* Implement typical accounting functions such as AP, AR, GL, Inv ...  

Since this project depends upon the IOTA JavaScript library there are unaudited dependencies. So we are trusting that the IOTA foundation as taken all the necessary steps to secure this library and all it's dependencies. In the future we can write and audit our own library to interact with the IOTA Tangle but this is not an appropriate place to start our work.  
 
Check back often to follow the progress.  
Feel free to make suggestions or help with the coding.  
Thanks, John
