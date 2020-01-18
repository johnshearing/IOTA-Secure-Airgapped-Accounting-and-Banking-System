





testRuntimeMods01 = function()
{
  // I get this object at runtime.
  // I won't know anything about the object until runtime.
  let dataObject = {};
  dataObject.metadataId = "This is the property value for metadataID";
  dataObject.table = {};
  dataObject.table.tableName = "myTableName - This is the property value for tableName";
  dataObject.table.directory = "myDirectory - This is the property value for directory";
  dataObject.table.addRoutes = "Yes - Add the routes to system - This is the property value for addRoutes";

  // I will also get an array of property keys at runtime telling me what to display.
  let arrayOfPropertyKeys = ["metadataId", "table.tableName", "table.directory", "table.addRoutes"];

  console.log(); // Just making an empty line on the console so we can see the results better.

  // Running eval() on each property key to see the values of the object.
  arrayOfPropertyKeys.forEach(function(propertyKeyFromArray)
  {
    // Make a string to address the field data we need to list.
    let propertyAddress = "dataObject." + propertyKeyFromArray;
    
    console.log("The following shows me the object properties but I hear it's bad practice to use eval()");
    // console.log(eval(propertyAddress));
    console.log(dataObject[propertyKeyFromArray])
    console.log("There must be another way.");    
    console.log();
  }) 
}; // End of: meta.testRuntimeMods01 = function()

// testRuntimeMods01();

testRuntimeMods02 = function()
{
  // I get this object at runtime.
  // I won't know anything about the object until runtime.
  // The only thing I will know in advance is that I am getting an object.
  let dataObject = {};
  dataObject.metadataId = 1000;
  dataObject.table = {};
  dataObject.table.tableName = "metadata";
  dataObject.table.directory = "database/dbMetadata";
  dataObject.table.addRoutes = "true";

  // I will also get an array of object keys in dot notation at runtime telling me what to display.
  // Sadly, dot notation can not accept variables.
  // So I need to convert these to bracket notation.
  let arrayOfFieldsInDotNotation = ["metadataId", "table.tableName", "table.directory", "table.addRoutes"];

  // Turning dot notation into bracket notation.
  // Then running eval() on the bracket notation to see the values of the object.
  arrayOfFieldsInDotNotation.forEach(function(fieldArrayElement)
  {
    // Start of string we are building to address the field data we are listing.
    let propertyAddress = "dataObject";

    // Break up the field address into it's parts
    let nestParts = fieldArrayElement.split(".");

    // Make bracket notation to address the field from the dot notation we were given.
    nestParts.forEach(function(nestLevel)
    {
      propertyAddress = propertyAddress + "[\"" + nestLevel + "\"]"; 
    });
    
    console.log("The following works but it's evil.");
    console.log("There must be another way.")
    console.log(eval(propertyAddress))
    console.log()
  }) 
}; // End of: meta.testRuntimeMods01 = function()


// The following is the solution.

testRuntimeMods03 = function()
{
  // I get this object at runtime.
  // I won't know anything about the object until runtime.
  let dataObject = {};
  dataObject.metadataId = "1000 - This is the property value for metadataID";
  dataObject.table = {};
  dataObject.table.tableName = "myTableName - This is the property value for tableName";
  dataObject.table.directory = "myDirectory - This is the property value for directory";
  dataObject.table.addRoutes = "Yes - This is the property value for addRoutes";

  // I will also get an array of property keys at runtime telling me what to display.
  let arrayOfPropertyKeys = ["metadataId", "table.tableName", "table.directory", "table.addRoutes"];

  // Converting each property key from dot notation to bracket notation.
  // Then using bracket notation to drill down into the object.
  arrayOfPropertyKeys.forEach(function(propertyKeyFromArray)
  {
    let value = dataObject;

    const keyParts = propertyKeyFromArray.split(".");

    for (let keyPart of keyParts) 
    { 
      console.log("This is the key: ", keyPart)
      value = value[keyPart];
    }

    console.log(value);
    console.log();    
  });
};



testRuntimeMods04 = function()
{
  let someObject = {
    'part1' : {
        'name': 'Part 1',
        'size': '20',
        'qty' : '50'
    },
    'part2' : {
        'name': 'Part 2',
        'size': '15',
        'qty' : '60'
    },
    'part3' : [
        {
            'name': 'Part 3A',
            'size': '10',
            'qty' : '20'
        }, {
            'name': 'Part 3B',
            'size': '5',
            'qty' : '20'
        }, {
            'name': 'Part 3C',
            'size': '7.5',
            'qty' : '20'
        }
    ]
};

  // I will also get an array of property keys at runtime telling me what to display.
  let arrayOfPropertyKeys = ["part1.name", "part2.qty", "part3[0].name"];

  // Converting each property key from dot notation to bracket notation.
  // Then using bracket notation to drill down into the object.
  arrayOfPropertyKeys.forEach(function(propertyKeyFromArray)
  {
    let value = someObject;

    const keyParts = propertyKeyFromArray.split(".");

    for (let keyPart of keyParts) 
    { 
      console.log("This is the key: ", keyPart)
      value = value[keyPart];
    }

    console.log(value);
    console.log();    
  });
};
