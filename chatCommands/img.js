const AWS = require('aws-sdk');
const botConfig = require("../config.json");
const request = require(`request`);
const fs = require(`fs`);

module.exports = {
    //upload an Image to Imgur and AWS dynamoDB
    uploadImg: function(keyCode, message){
        console.log("uploadImg function called");

        var docClient = new AWS.DynamoDB.DocumentClient();
        
        //Query to search database
        var params = {
            TableName: "ImageLink",
            Key: {
                "id": keyCode
            },
            AttributesToGet:[
                'id'
            ]
        }
        
        //Check if Keycode exists in database
        docClient.get(params, function(err, data){
            //Didn't find a keycode, proceed to prepare upload.
            console.log(data.Item === undefined);
            if(data.Item === undefined){
                console.log("Could not find item, keycode is available");
                //Check Attachment exists
                if(message.attachments.first()){
                    console.log("Stage 1 passed: " + message.attachments.first().filename);
                    download(message.attachments.first().url, message, keyCode);
                }
            }
            //Found an image with associated keyword, abort upload.
            else{
                console.log("Found an item, this key cannot be used for this image");
                message.channel.send("This keyword already exists! You cannot have two images assigned to one keyword!");
            }
        })
    },
    //Delete image
    deleteImg: function(keyCode, message){
        var PouchDB = require('pouchdb');
        var imgur = require('imgur');
        var db = new PouchDB('imgLinkDatabase');
        console.log("deleteImg function called");

        //Get the doc
        db.get(keyCode)
            .then(function (doc){
                //if doc author doesn't match the message author, disallow access.
                if(doc.author === message.author.id){
                    //if it does, remove the database entry
                    imgur.deleteImage(doc.jsonData.deletehash)
                    .then(function (result){
                        console.log(result);
                        message.channel.send("Image was successfully deleted!");
                    }).catch(function (err){
                        console.log(err);
                    });		
                    db.remove(doc);
                }
                else{
                    message.channel.send("You are not the author of this image! You cannot delete this! If you believe this image is offensive, please tell the developer about it. If he doesn't care, too bad I suppose.");
                }
            }).then(function (result){

            }).catch(function (err){
                message.channel.send("Key code doesn't exist! Please check the key code and try again later.");
            });
    },
    //Lists all the keycodes in the database.
    listAllKeycodes: function(message){
        var PouchDB = require('pouchdb');
        var db = new PouchDB('imgLinkDatabase');

        db.allDocs({
            include_docs: true
        }).then(function (result){
            //List all docs
            var outputMessage = "";
            for(var i = 0; i < result.total_rows; i++){
                outputMessage += result.rows[i].id + "\n";
            }
            console.log(outputMessage);
            message.channel.send("Here is the list of keycodes!\n");
            embedMessage(message, outputMessage);
        }).catch(function (err){
            console.log(err);
        });
    },
    //Choose a random keyword and retrieve the image
    randomKeyword: function(message){
        var PouchDB = require('pouchdb');
        var db = new PouchDB('imgLinkDatabase');

        db.allDocs({
            include_docs: true
        }).then(function (result){
            //Choose a random number from the total amount of rows in the list.		
            var choice = Math.floor((Math.random() * result.total_rows));
            var keycode = result.rows[choice].id;
            message.channel.send("Chosen keycode: " + keycode);
            //Get image
            retrieveImg(keycode, message);
        }).catch(function (err){
            console.log(err);
        });
    },
    retrieveImg: function(keyCode, message){
        console.log("retrieveImg function called");

        var docClient = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName: "ImageLink",
            Key: {
                "id": keyCode
            },
            AttributesToGet:[
                'id', 'link'
            ]
        }
        
        //Check if Keycode exists in database
        docClient.get(params, function(err, data){
            //Didn't find a keycode, proceed to prepare upload.
            if(data.Item === undefined){
                console.log("Could not find item!");
                message.channel.send("Image could not be retrieved, please check your keycode and try again.");
            }
            //Found an image with associated keyword, abort upload.
            else if(data){
                console.log("Found an item!" + data.Item);
                message.channel.send("Here's your image! " + data.Item.link);
            }
        })
    }
}

//Download function called by uploadImg()
function download(url, message, keyCode){
	console.log("download function called")
	var w = fs.createWriteStream('./imgStore/img.png');
	request.get(url).on('error', console.error).pipe(w);
	
	//When done, return a base64 string on finish.
	w.on('finish', function() {
		console.log("Image Downloaded!: " + message.attachments.first().filename);
		//Upload image to imgur.
		var base64Img = base64_encode('imgStore/img.png');
		console.log(base64Img);
		uploadImgToImgur(base64Img, message, keyCode);
	})
}

//get a base64 string and upload it to imgur.
function uploadImgToImgur(file, message, keyCode){
	console.log("uploadImgToImgur function called!");
    var imgur = require('imgur');
    var docClient = new AWS.DynamoDB.DocumentClient();

	imgur.setClientId(botConfig.imgurClientID);
	imgur.setCredentials(botConfig.imgurEmail, botConfig.imgurPassword, botConfig.imgurClientID);

	imgur.uploadBase64(file)
    .then(function (json) {
		message.channel.send("Image successfully uploaded! \nHere's your raw link: " + json.data.link );
		//put code into db to allow retrieval for later.
        var params = {
            TableName: "ImageLink",
            Item:{
                "id": keyCode,
                "link": json.data.link,
                "author": message.author.id,
                "jsonData": json.data
            }
        }

		docClient.put(params, function(err, data){
            if(err){
                console.log("Unable to add item. Error JSON: " + JSON.stringify(err, null, 2));
                message.channel.send("Image-to-Keyword link was not established for some reason! Image cannot be retrieved later!")
            }
            else{
                message.channel.send("Your image can be retrieved by typing **" + botConfig.prefix + "getimg " + keyCode + "**.");
            }
        });
    })
    .catch(function (err) {
		console.error(err.message);
		message.channel.send("Image not uploaded! Please try again later!");
    });
}

function base64_encode(file) {
    // read binary data
    return fs.readFileSync(file, 'base64');
    // convert binary data to base64 encoded string
}