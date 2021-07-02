const AWS = require('aws-sdk');
const botConfig = require("../config.json");
const request = require(`request`);
const fs = require(`fs`);
const embedMessage = require("../chatCommands/embedMessage");

module.exports = {
    //upload an Image to Imgur and AWS dynamoDB
    uploadImg: async function(keyCode, message){
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
    deleteImg: async function(keyCode, message){
        console.log("uploadImg function called");
        var docClient = new AWS.DynamoDB.DocumentClient();
        var imgur = require('imgur');

        var params = {
            TableName: "ImageLink",
            Key:{
                "id": keyCode
            },
            AttributesToGet: [
                'id', 'author','jsonData'
            ]
        }

        docClient.get(params, function(err, data){
            //Item doesn't match anything, stop.
            if(data.Item === undefined){
                console.log("could not find item, can't delete nothing.");
                message.channel.send("That keycode doesn't match anything in our database!")
            }
            else{
                //Item matches author, delete item.
                if(data.Item.author === message.author.id || message.author.id === botConfig.ownerID ){
                    imgur.deleteImage(data.Item.jsonData.deletehash)
                    .then(function(result){
                        console.log(result);
                        //Now that item is deleted, remove item from database
                        var deleteParam = {
                            TableName: "ImageLink",
                            Key:{
                                "id": keyCode
                            }
                        }
                        docClient.delete(params, async function(err, data){
                            if(err){
                                console.log("Unable to delete item. Error JSON: ", JSON.stringify(err, null, 2));
                            }
                            else{
                                console.log("Deletion succeeded: ", JSON.stringify(data, null, 2));
                                message.channel.send("Item " + keyCode + " successfully deleted!");
                                var metadata = await getMetadata();
                                var keyCodes = metadata.Item.contents;
                                var index = keyCodes.findIndex(element => element === keyCode);
                                keyCodes.splice(index, 1);
                                setMetadata(keyCodes);
                            }
                        })
                    })
                    .catch(function(err){
                        console.log(err);
                        message.channel.send("Something went wrong when deleting item, Try again later.");
                    })
                }
                //Can't delete due to incorrect permissions.
                else{
                    message.channel.send("You can't delete this image as you are not the author!")
                }
            }
        });
    },
    //Lists all the keycodes in the database.
    listAllKeycodes: async function(message){
        console.log("Listallkeycodes called!");
        var metadata = await getMetadata();
        var keyCodes = metadata.Item.contents;
        console.log(keyCodes);

        //Generate list
        var outputMessage = "";
        keyCodes.forEach(function(item){
            outputMessage += item + "\n";
        });
        console.log(outputMessage);
        message.channel.send("Here is the list of keycodes!\n");
        embedMessage(message, outputMessage);
    },
    //Choose a random keyword and retrieve the image
    randomKeyword: async function(message){
        console.log("randomimg called!");
        var metadata = await getMetadata();
        var keyCodes = metadata.Item.contents;

        //Randomly choose a valid num, and trigger retrieve img with chosen keycode.
        var choice = Math.floor(Math.random() * keyCodes.length);
        var keycode = (choice === 0) ? keyCodes[choice] : keyCodes[choice - 1];

        message.channel.send("Keycode chosen: " + keycode);
        module.exports.retrieveImg(keycode, message);
    },
    updateImageLinkMetadata: function(){
        var docClient = new AWS.DynamoDB.DocumentClient();

        var params = {
            TableName: "ImageLink"
        }

        docClient.scan(params, scanAndUpload);

        //On finishing scan, upload new metadata to metadata table
        function scanAndUpload(err, data){
            if (err){
                console.log("couldn't scan " + JSON.stringify(err, null, 2));
            } else{
                var metadataObject = {items: []};
                console.log("Scan succeeded.");
                data.Items.forEach(function(item){
                    metadataObject.items.push(item.id);
                });
                
                var params = {
                    TableName: "ImageLinkMetadata",
                    Item:{
                        "docName": "keyCodeList",
                        "contents": metadataObject
                    } 
                }
                
                docClient.put(params, function(err, data){
                    if(err){
                        console.log("Something went wrong: " + JSON.stringify(err, null, 2));
                    }
                    else{
                        console.log("Upload complete!");
                    }
                });
            }
        }
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
async function download(url, message, keyCode){
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
async function uploadImgToImgur(file, message, keyCode){
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

		docClient.put(params, async function(err, data){
            if(err){
                console.log("Unable to add item. Error JSON: " + JSON.stringify(err, null, 2));
                message.channel.send("Image-to-Keyword link was not established for some reason! Image cannot be retrieved later!")
            }
            else{
                message.channel.send("Your image can be retrieved by typing **" + botConfig.prefix + "getimg " + keyCode + "**.");
                var metadata = await getMetadata();
                var keyCodes = metadata.Item.contents.items;
                keyCodes.push(keyCode);
                setMetadata(keyCodes);
            }
        });
    })
    .catch(function (err) {
		console.error(err.message);
		message.channel.send("Image not uploaded! Please try again later!");
    });
}

async function getMetadata(){
    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: "ImageLinkMetadata",
        Key:{
            "docName": "keyCodeList"
        }
    }
    try{
        var data = await docClient.get(params).promise();
        console.log("Successfully retrieved!");
        console.log(data);
        return data;
    } catch(err){
        console.log("failed to retrieve data", JSON.stringify(err, null, 2));
    }
}

function setMetadata(newList){
    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: "ImageLinkMetadata",
        Key:{
            "docName": "keyCodeList"
        },
        UpdateExpression: "set contents = :c",
        ExpressionAttributeValues:{
            ":c": newList
        },
        ReturnValues: "UPDATED_NEW"
    }

    docClient.update(params, function(err, data){
        if(err){
            console.log("Something went wrong: ", JSON.stringify(err, null, 2));
        }
        else{
            console.log("Successfully updated! " + JSON.stringify(data, null, 2));
        }
    });
}

function base64_encode(file) {
    // read binary data
    return fs.readFileSync(file, 'base64');
    // convert binary data to base64 encoded string
}