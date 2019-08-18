This folder contains two files besides this README.md:  
The first file is called gsuid.json.  
The name is an acronym for Global Sequential Unique ID.  

This is file contains a single number which is:  
1. Locked: A folder called "lock" is created. 
2. Read: The number is read.  
3. Incremented: The number is incremented.  
4. Unlocked: The "lock" folder is deleted.  

The file is locked by creating a new folder called "lock" inside the dbHistory folder before the read is attempted.  
The operating system will not allow a second folder of the same name to be created in the dbHistory folder.  
So if a second user attempts to read the Global Sequential Unique ID while the lock folder exists then the code will throw an error stating that the lock folder can not be created because a folder of the same name already exists. This stops the second user's code from running which prevents a read of the Global Sequential Unique ID until the first user reads it, increments it, and removes the lock. The second user's error will be caught silently behind the scenes with several retries before finally notifying the administrator. The assumption is that if the lock folder has not been removed within some limited amount of time then the previous user's action failed. The system will remain locked until the administrator determines what happend, makes repairs to the database if needed, and then removes the lock folder.  

All records in the database (no matter from what table) will get their unique ids from this Global Sequential Unique ID so that every record has a system wide unique identifier that tells in what order it was created with respect to all the other records in the database.  

The second file in this folder is called dbLog.json. Any adds, changes, or deletes to a record will be recorded in dbLog.json which captures the entire record in it's new state and tells who made the entry and by what method and when the entry was made.  

This along with the Global Sequential Unique ID allows the entire database to be reconstructed to represent any point in history.  
