module.exports = {
    importToDynamoDB: function(){
        //for each element in rows
            //retrieve the doc
            //store _id, jsonData, author, link into a JSON
            //store JSON under unique ID(the _id) and store into dynamoDB
            //repeat for all docs in rows
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