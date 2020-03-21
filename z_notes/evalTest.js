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
