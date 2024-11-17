This folder contains two files besides this README.md:  
The first file is called gsuid.json.  
The name is an acronym for Global Sequential Unique ID.  
This is text file contains just a single JSON object which looks like this: `{"nextId":1}`  
If the file does not exist then it must be created when before the system is used.  
An initialization script will be be created for this.  

All records in the database (no matter from what table) get their unique ids from this Global Sequential Unique ID so that every record has a system wide unique identifier that tells in what order it was created with respect to all the other records in the database.  

Most of this logic has already been implemented.  
Look in `data.js`. The functions are `gsuidLockReadIncUnlock()` and `nextId()`  

* Working with the gsuid.json goes as follows:  
  * Lock: The file is locked.  
  * Read: The nextId is read.  
    * This number is used to uniquely and chronologically identify all records in the database.  
    * The number is also used to track adds, updates, and deletes to all records in all tables.  
  * Incremented: The nextId is incremented.  
    * You can increment by more than one if you need to secure a range of numbers.  
  * The file is unlocked.  

* The gsuid.json file is locked by creating a new folder called ("gsuid.lock") inside the dbHistory folder before the read is attempted.  
* The operating system will not allow a second folder of the same name to be created in the dbHistory folder.  
* So if a second user attempts to lock and then read the gsuid.json file the while the lock folder exists then the code will throw an error stating that the lock folder can not be created because a folder of the same name already exists.  
* This stops the second user's code from running which prevents a read of the nextId until the first user reads it, increments it, and removes the lock.  
* The second user's error is caught silently behind the scenes with several retries to lock the file before finally notifying the administrator if a lock can not be obtained.  
* The system signs the lock folder for the user by placing a text document into the folder which identifies the user. I may choose to let nodejs modify the properties of the folder instead.  
* The system will not allow anyone else to remove the folder and then only through the program logic to enforce security.  

The second file in this folder is called transaction.json. If it does not exist then it must be created when the system is first used. This will be done in an initialization script. Any adds, changes, or deletes to a record will be recorded in transaction.json which captures the entire record in it's new state and tells who made the entry, by what method and when the entry was made.  

This along with the Global Sequential Unique ID allows the entire database to be reconstructed to represent any point in history.  

The transaction.json file only gets appended to but it will be locked along with all other files that are part of the transaction. When the entire transaction has been completed then all the files will be unlocked. If the transaction can not be completed then everything will be rolled back to it's original state.  

Most of the database system will be relational (table-joins and indexes) but the parts that deal with seeds and addresses will be NoSQL. Relational because most accounting functionality involves reporting which requires indexes and normalization for speed and schema so that there is consistent data to report on. However, when dealing with seeds and addresses, no reporting is involved but rather security is the primary concern.  

Both the Relational and NoSQL databases will be implemented as JSON text files.  
Inserting and deleting records in the middle of a text file is troublesome and slow so only appends will be allowed.  
Adding a new record is no problem - just append it to the file.  
To update a record, a new JSON record will be appended to the file with updated information and the older record will be ignored.  
Deleted records will be marked as deleted and ignored.  
When accessing data it might make sense to [stream the file backwards when reading](https://github.com/dominictarr/fs-reverse) so that the newest record is encountered first at which point the system stops searching.  
Transaction rollbacks should be very easy with this method - here's why: To roll back a transaction just mark for deletion all the new records at the end of the JSON files which were part of the incomplete transaction. Then everything will read as before.  
At regular intervals the database can be taken offline so that outdated and deleted records can actually be removed from tables. 
I think this was called packing in the days of xbase.  

While the system is offline, tables can be sorted to provide faster responses to common searches.  
Indexes can be built anytime the system is not busy. [It might be well to use this repository](https://github.com/nextapps-de/flexsearch) or [this repository](https://github.com/nextapps-de/bulksearch) for building indexes because neither one uses any dependencies. So we can fork the repository, audit it once, and from then on we know that the code has not been compromised. I imagine that a main index for a particular sort order is built while the system is offline or at least not busy and then a second index for new records is maintained while the system is running and serving records. The idea is that the secondary index is checked first because, being that it has the newer records, those are the ones you are more likely to need, and also because the index is smaller, so it's easier to check. If your record is not found in the second index then it will surely be found in the first. Periodically when the system is offline (or not very busy), the records from the second index can be spliced into the first and then the second index can be deleted. Actually, I guess the way that works is a new index file is created by shuffling the two indexes together and then both older indexes are deleted while the table is locked, and then the new index is named the same as the original. Now the table lock is released and any appends to it are once again indexed in a second index file.

I have done plenty of work with available databases so why not just use MySQL or Mongo?  
Because it is impossible to know if someone else's code has been backdoored or compromised.  
Because I want to make something small and simple and without dependencies, so that it's easy to audit.  
Because accounting systems for cryptocurrency are by definition decentralized.  
So they do not need to be big and complex.  
To the contrary, they must be as small and simple as possible.  
Oddly, there is no advice on the Internet for how to build a database except to look at MySql or Mongo source code.  
The field is becoming centralized because individuals have stopped believing in there own abilities to get the job done.  
Well if I can, then anyone can, and that means you can.  
Lets have some fun.   
:)
