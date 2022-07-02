# IOTA-Secure-Airgapped-Accounting-and-Banking-System  
## For Government, Enterprise, Individuals, and Machines  
This Air-gapped, stand alone, accounting system for IOTA, Ethereum, and Cardano is a NodeJS client/server database and application generator **with no dependencies other than the javascript libraries for the currencies you may wish to use**.  
This makes for manageable security auditing.  
A code generator reads metadata from a data dictionary and creates the client side user interface and the server side code which is the same for all tables in the system. So once the generator and the data dictionary have been audited, then the system as a whole is largely proven to be secure. That's because the generator creates the same basic code throughout the entire system. Changes to the code are made in one place a ripple down to all parts of the system automatically when the system is regenerated.  
The server side code will run on most any computer using most any operating system.  
The generated user interface runs in the browser.  

This software generates secure accounting/banking systems for cryptocurrency that individuals, corporations, and governments can use for managing their business and for cooperating with each other.      

Built to run on a single airgapped [PrivateKeyVault](https://github.com/johnshearing/PrivateKeyVault) for individuals or on an airgapped network for large institutions or government. All this code will run on any device that can run NodeJS.  
This is the last piece of the puzzle in [The PrivateKeyVault family of repositories](https://github.com/johnshearing).   
 
The code generator and all the generated code is extremely well commented and very easy read so as to facilitate an audit. Everything including the generator was written in plain vanilla javascript, HTML, and CSS without using anyone else's frameworks, databases or tools. A video tutorial will be made soon explaining how it all works and what each line of code does. This will also facilitate an audit.  

#### Features:
* Database Functionality.  
  * JSON database is human readable and easy to reason about.  
  * Locking is used to make the application multiuser. 
   * An unlimited amount of users and very complex behavior can be supported through the interactions of these simple systems with smart contracts.  
  * Transactions are rolled back if any part of a transaction fails.  
  * All records in the database (no matter from what table) get their unique ids from a [single incremented source](https://github.com/johnshearing/IOTA-Secure-Airgapped-Accounting-and-Banking-System/blob/master/accounting/database/dbHistory/gsuid.json) so that every record has a system wide unique id that identifies when it was created with respect to all the other records in the database.    
  * Any adds, changes, or deletes to a record are recorded in a [log](https://github.com/johnshearing/IOTA-Secure-Airgapped-Accounting-and-Banking-System/blob/master/accounting/database/dbHistory/history.json) that captures the entire record in it's new state. This along with the system wide unique ids allows the entire database to be reconstructed to represent any point in history.  
* A Code Generator - Meta-Programming:
  * Rather than writing code such as: [server-side page handlers along with Post, Get, Put, and Delete Validation code](https://github.com/johnshearing/IOTA-Secure-Airgapped-Accounting-and-Banking-System/blob/master/accounting/database/dbMetadata/metadataLogic.js), and then writing the client-side HTML forms and supporting javascript for [queries](https://github.com/johnshearing/IOTA-Secure-Airgapped-Accounting-and-Banking-System/blob/master/accounting/database/dbMetadata/metadataList.html), [adds](https://github.com/johnshearing/IOTA-Secure-Airgapped-Accounting-and-Banking-System/blob/master/accounting/database/dbMetadata/metadataAdd.html), [updates, and deletes](https://github.com/johnshearing/IOTA-Secure-Airgapped-Accounting-and-Banking-System/blob/master/accounting/database/dbMetadata/metadataAdd.html) for every table in the database, we have a script called [meta.js](https://github.com/johnshearing/IOTA-Secure-Airgapped-Accounting-and-Banking-System/blob/master/lib/meta.js) to do that for us. It's a program written entirely in vanilla javascript which contains instructions for building working sofware. This code generator reads metadata from the [data dictionary](https://github.com/johnshearing/IOTA-Secure-Airgapped-Accounting-and-Banking-System/blob/master/accounting/database/dbMetadata/metadata.json) which is a JSON file containing data definitions, and the business rules that make each table, each record, and each field unique. Also in the data dictionary are any customized code snippets for behaviors which must depart from the business rules in the generator. Running the generator assembles all this information into well commented, working software that is the accounting/banking system. The final code is very easy to read and reason about because all the looping was done when the code was generated to produce simple javascript and HTML that needs to do only one job. This method of programming (Meta-Programming) is compatible with Procedural Programming, Object Oriented Programming, and Functional Programming.  
   
   
   
    
#### Generates a query screen for each table.
Search for records and save your queries to use again.  
<img src="/images/SearchDatabase.jpg">
   
   
   
   
#### Each record is just a JSON entry.
#### The generated apps just a collection of JSON editors.
#### Unlimited length, unlimited nesting levels, schema enforced.  
<img src="/images/NestingStruct01.jpg">  
  
  
  
  
#### Embed custom functionality into generic screens or generate them completely custom.   
<img src="/images/CustomFunctions.jpg">  
   
   
   
   
#### The application is even used to describe and build itself.  
<img src="/images/NestingStruct03.jpg"> 
   
   
   
   
  * First a simple database application was written and tested. Then code templates were modeled into the generator and data dictionary from the programs in the simple application. From that point on, changes to the application have been made in the generator and in the data dictionary. After any changes are made, the application is regenerated by running the generator. This way, major changes to functionality ripple down through the entire system without having to change the handlers for each table and their user interfaces. This eliminates most programming errors, enforces a uniform user experience, and allows us to make big changes to the system in a very short amount of time. Any fixes are made in one place and ripple down to all affected parts.  
  * The big payoff here is in the audit. As a system grows in size it becomes exponentially harder to audit. So rather than trying to audit the generated code. All we need to do is audit the code generator and the metadata used to generate the application. This is a much smaller and more manageable job thats lead to much tighter security and faster fixes when security flaws are discovered.  
* [Generate truly random seeds](https://github.com/johnshearing/IOTA-Airgapped-NodeJS-Console-Wallet#generating-seeds-with-a-true-random-number-generator) (not pseudo-random) with special hardware built into every raspberry pi 2, or use another method if you want,
* Generate keystore files for seeds.  
  * This is an encrypted file containing just a seed.  
  * You can give the file to other people to hold for you but they will not be able to access the seed without your password.  
  * This provides a secure way to store seeds in another location before putting IOTAs in any addresses generated by that seed.     
* [Generate addresses and check balances for a single address or for a list of addresses](https://github.com/johnshearing/IOTA-Airgapped-NodeJS-Console-Wallet#check-your-balance-at-address-a0),   
  * The airgapped accounting system does NOT check seed or master key balances directly. This is for security and performance reasons.  
  * Instead, a list of addresses is generated by the airgapped database and is supplied to the online database. The balances of each address can be checked individually by the online database which may query the Distributed Public Ledger and add up the address balances to give the seed's total balance if required. This way you can get the seed balance without exposing your seed to any other device. Working this way also eliminates the problem of false balances created by snap shots in the case of IOTA or a block of 21 or more empty addresses in the case of Cardano.  
  * It should not be necessary, however, to go to the Distributed Public Ledger in order to get the balance for a seed in the case of IOTA or master key in the case of Cardano. The online database/accounting system which broadcasts all transactions should keep track of the account balances. Think of it this way: The controller of a company does not ask the bank how much he has in his bank account - he already knows from looking in his own accounting system. In the same way a modern accounting system for cryptocurrency must track balances without needing to query the blockchain. This system works as follows: When your customer is ready to pay, an address is provided by you, the seller to the buyer. The buyer's wallet uses the provided payment address to generate encrypted transaction instructions as usual. But instead of broadcasting the encrypted payment instructions directly to the Distributed Public Ledger, the buyer sends the encrypted instructions to you, the seller, instead. The seller now broadcasts the transaction to the Distributed Public Ledger from his online database/accounting system and records of the amount in the new address. Now the seller can see the balance of his account by looking in his own accounting system without ever needing to query the Distributed Public Ledger. This gets rid of the false balance problem when spanning 21 or more empty Cardano addresses, the false balance problem after an IOTA snapshot is also fixed, this eliminates the need to dust so bloat is reduced and transaction fees are minimized as well, need for bandwidth is reduced, and performance is increased by a factor of thousands.  
* [Bundle Transactions Offline then Broadcast Transactions Online,](https://github.com/johnshearing/IOTA-Airgapped-NodeJS-Console-Wallet#make-a-signed-transaction-bundle-and-broadcast-it-to-the-tangle)   
  * Users will see a visual representation of actions the bundle will perform as check before broadcasting bundle.  
  * If the bundle does not make it onto the tangle within a set period of time the bundle will be promoted, reattached, or rebroadcast.  
  * And if the bundle is still not accepted after several attempts then a text message will be transmitted to the sender's phone.    
* [Handle Multi-Signatures building upon work found here](https://www.mobilefish.com/services/cryptocurrency/iota_multisig.html),  
* [GPG Messaging](https://www.youtube.com/watch?v=qUWWuHium30),  
* MAM Masked Authenticated Messaging,  
* Implement all the functionality available through Qubic as that comes online,  
* Implement typical accounting functions such as AP, AR, GL, Inv ...  

#### What's Different and Where's the Opportunity?
Large centralized systems are very hard to secure. That's why we keep hearing about hacks at large institutions. Large means lots of vulnerabilities and complex means that these weaknesses are very hard to see. This doesn't matter so much with a large accounting system when the actual funds they track are secured by banks. But an accounting system for cryptocurrency also protects the currency from theft. It must be both accounting system and bank.  

Small simple systems are inherently more secure and easier to protect because small means fewer vulnerabilities and simple means those weaknesses are easier to spot.  
 
Since the accounting/banking system we are building is for a decentralized ledger, it does not have to be big or complicated as in centralized systems. Think about how [very simple creatures, like bees, when grouped together perform complex behaviours, like voting, in a very efficient manner without any centralized system to count the votes - without a centralized system to get hacked](https://youtu.be/AonV_MkUFSs). There will be many of these simple accounting/banking systems (bees if you will) that when working together will provide the complex behaviors society needs for efficient collaboration.      

* Smart Contracts - How Our Small Accounting/Banking Systems Interact With Each Other To Do Big Things  
Think: smart money, Think: smart information  
Now we can embed computer software into the money and data we send which defines how we want them to behave.  
These smart contracts are created and authorized by our accounting/banking systems and then executed on special distributed ledgers called blockchains.  

* Keeping Control of the Process  
We don't want our busy little accounting/banking systems moving money, casting votes, or transceiving any kind of information without our explicit knowledge and consent. This is why we have developed this [open source airgapped computer called the PrivateKeyVault](https://github.com/johnshearing/PrivateKeyVault) to run our little accounting/banking systems. This computer ensures that no information moves in or out of the system without a human gatekeeper reviewing the content and explicitly granting permission to allow the transmission. Any computer can be used but is should be airgapped and physically secured to prevent tampering.   

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
 
Since this project depends upon the IOTA JavaScript library there are unaudited dependencies. So we are trusting that the IOTA foundation as taken all the necessary steps to secure this library and all it's dependencies. In the future we can write and audit our own library to interact with the IOTA Tangle but this is not an appropriate place to start our work.  

#### An Unexpected Result  
This code has evolved into a system which is capable of describing and changing its own data dictionary - its own DNA if you will. The generator reads JSON from the data dictionary which contain instructions to build all the forms and code required to make and manage JSON documents. These generated forms and code are descriptive enough to make valid entries in the data dictionary which created the forms and code in the first place. So this application generator can now be used to build, maintain, and change itself as well as to build other types of database applications and data transformation utilities. Oddly, while the JSON produced from the generated forms can contain all the same data as the JSON in the data dictionary from which it was produced, the data structure of the new JSON is different from the original and so will require a different generator to produce a form which is capable of replicating the original JSON from the data dictionary. It seems it may be difficult or impossible to build a machine that can reproduce it's own exact form. I wonder if we are bumping into [Godel's Incompleteness Theorems](https://en.wikipedia.org/wiki/G%C3%B6del%27s_incompleteness_theorems). In any case, this experiment shows that it is possible for a machine to produce a different (complementary) machine which is capable of producing it's parent in exact detail. This is how DNA replicates.   

[This video animation](https://youtu.be/gG7uCskUOrA) shows how DNA is used to manufacture proteins.  
The JSON in the data dictionary holds this same relationship with the generator and the HTML forms produced.  
The JSON tells the generator how to make forms in the same way that DNA tells RNA how to make proteins.  

[This video animation](https://youtu.be/TNKWgcFPHqw) shows how proteins are used in the replication of DNA.  
It shows the complementary nature of the two strands which make the double helix.  
This is the same complementary relationship between the two lines of JSON in the data dictionary.  
So it appears that I bumped into the same problem that nature encountered when building a replicating machine.  
It also appears that my solution was the same.  
This is not surprising - as you will see in the next section - my methods are the very same as those used by nature.

#### Credits  
Trust the Lord with all thine heart; and lean not unto thine own understanding.  
In all thy ways acknowledge him, and he shall direct thy paths.  
Proverbs 3:3-6  

When I started this project I had only a vague idea of what I was trying to accomplish.  
I wanted to make an accounting system for cryptocurrency that would be easy to audit.  
All I do is write, test, meditate on the results, study, delete the bad stuff, and write again.  
I'm doing the work but I'm not trying to control were it's going.  
Perhaps some will understand when I say that the experience is spiritual and that the entire project is a demonstration of faith.    

Most people need to know what they are going to make before they start their work.  
But I have discovered that it is possible to accomplish tasks that are way beyond the limits of my own intellect by letting go of the big plan and just doing the work set down in front of me. This is exactly what nature does.  
I feel blessed and I love God. The work you see here is the result.  

Thanks, John  

## <a href="https://johnshearing.github.io/">Click Here To See Our Other Projects</a> 
