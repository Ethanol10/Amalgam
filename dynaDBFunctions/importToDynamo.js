const fs = require('fs');
const AWS = require('aws-sdk');

module.exports = {
    importToDynamoDB: function(){
        //for each element in rows
            //retrieve the doc
            //store _id, jsonData, author, link into a JSON
            //store JSON under unique ID(the _id) and store into dynamoDB
            //repeat for all docs in rows
        
        var docClient = new AWS.DynamoDB.DocumentClient();
        var parsedJSON = null;
        var inputJSON = fs.readFile('./output.json', function(err, data){
            if(err){
                throw err;
            }
            parsedJSON = JSON.parse(data);

            parsedJSON.rows.forEach(element => {
                console.log(element);
                //Prep items for database
                var params = {
                    TableName: "ImageLink",
                    Item:{
                        "id": element.doc._id,
                        "link": element.doc.link,
                        "author": element.doc.author,
                        "jsonData": element.doc.jsonData
                    }
                }

                //Put into database
                docClient.put(params, function(err, data){
                    if(err){
                        console.log("Unable to add item, Error: " + JSON.stringify(err, null, 2));
                    }
                    else{
                        console.log("Added item: " + JSON.stringify(data, null, 2));
                    }
                })
            });
        })
        
    },

    dbExport: function(){
        var PouchDB = require('pouchdb');
        var db = new PouchDB('imgLinkDatabase');
        db.allDocs({include_docs: true, attachments: true}).then( function(result){
            var JSONexport = JSON.stringify(result);
            fs.writeFile("output.json", JSONexport, 'utf8', function(err){
                if(err){
                    console.log("An error occurred writing to file");
                    return console.log(err);
                }
        
                console.log("JSON file successfully written");
            })
        });
    }
}