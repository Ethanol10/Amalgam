const Discord = require("discord.js");
const client = new Discord.Client();
const botConfig = require("./config.json");
const specChar = require("./specialCharacter.json");
const request = require(`request`);
const fs = require(`fs`);

//chat command imports
const mshrug = require('./chatCommands/mshrg.js');
const embedMessage = require('./chatCommands/embedMessage.js');
const {CRIfunction, criHelp} = require('./chatCommands/cri.js');
const coin = require('./chatCommands/coin.js');
const {calculator} = require('./chatCommands/calculator.js');
const {time, remind} = require('./chatCommands/remind.js');
const {gatekeepingClap} = require('./chatCommands/gatekeeping.js');
const {mainHelpDialog} = require('./chatCommands/mainHelp.js');

//AWS imports
const AWS = require('aws-sdk');
const { S3 } = require("aws-sdk");

//Parses the message and figures out what command has been typed by the user
function parseCommand(message) {
	var i;
	//Get the message and split it
	var messageContent = message.content.substring(botConfig.prefix.length);
	var messageSplit = messageContent.split(" ");

	console.log("parseCommand function called!");
	//Check if the Convert Regional Indicator function should be called.
	switch(messageSplit[0]){
		case "cri":
			message.delete(1000);
			(messageSplit[1] === '-embed') ?
			 			CRIfunction(message, true) : CRIfunction(message, false);
			break;
		case "help":
			message.delete(1000);
			mainHelpDialog(message, client);
			break;	
		case "command":
			message.delete(1000);
			mainHelpDialog(message);
			break;
		case "crihelp":
			message.delete(1000);
			criHelp(message, client);
			break;
		case "calchelp":
			inputStr = "**" + botConfig.prefix + "calchelp**\n Available operands are as follows: \n Addition: + \n Subtraction: - \n Multiplication: * \n Division: / \n Modulo: % \n Exponent:^"
			embedMessage(message, inputStr);
			break;	
		case "number":
			console.log("number command called!");
			if(isNaN(messageSplit[1])){
				message.channel.send("Please input a number after the command.");
			}
			else{
				message.channel.send(Math.floor((Math.random() * messageSplit[1]) + 1));
			}
			break;
		case "clone":
			if(isNaN(messageSplit[1])){
				message.channel.send("Please input a number after the command.");
			}
			else{
				message.channel.send((messageContent.slice(messageSplit[0].length + messageSplit[1].length + 2) + " ").repeat(messageSplit[1]));
			}
			break;
		case "remind":
			(messageSplit[1] === '-noAuthor') ? remind(message, true) : remind(message, false);
			(messageSplit[1] === '-noAuthor') ? time(message, true) : time(message, false);
			break;	
		case "coin":
			coin(message);
			break;
		case "calc":
			calculator(message, messageContent);
			break;
		case "mshrg":
			mshrug(message);
			break;	
		case "clap":
			message.delete(1000);
			(messageSplit[1].toLowerCase() === '-embed') ? gatekeepingClap(message, true): gatekeepingClap(message, false);	
			break;	
		case "mask":
			console.log("mask command called!");
			maskMessage(message, messageContent);
			break;	
		case "botCreator":
			embedMessage(message, "Bot collaborately created by Ethanol 10(Ethan) and Jelly(Julian).");
			console.log("botCreator called");
			break;
		case "botSourceCode":
			embedMessage(message, "Here's how I work. It ain't perfect tho. https://github.com/Ethanol10/Amalgam");
			break;
		case "upload":
			uploadImg(messageSplit[1], message);
			break;
		case "getimg":
			retrieveImg(messageSplit[1], message);
			break;
		case "deleteimg":
			deleteImg(messageSplit[1], message);
			break;
		case "listkey":
			listAllKeycodes(message);
			break;
		case "randomimg":
			randomKeyword(message);
			break;
	}
}

function importToDynamoDB(){
	//for each element in rows
		//retrieve the doc
		//store _id, jsonData, author, link into a JSON
		//
}

function dbExport(){
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

//Inital boot
client.on("ready", () => {
	console.log("Amalgam is ready to serve!");
	client.user.setActivity(botConfig.prefix + "help");
	//db export
	//dbExport();
	
	//AWS SETUP
	AWS.config.update({region: botConfig.region});
	AWS.config.loadFromPath('./config.json');
	AWS.config.getCredentials(function(err) {
		if (err) console.log(err.stack);
		// credentials not loaded
		else {
		  console.log("Access key:", AWS.config.credentials.accessKeyId);
		}
	});
});

//Check for message and send it to the parser
client.on("message", (message) => {
  //Don't check the message if it does not start with the prefix or is from a bot.
	if (message.author.bot || message.content.indexOf(botConfig.prefix) !== 0) return;
	
	console.log("Message Recieved!");
	parseCommand(message);	
});

//image output
function imageOutput(imagePath, message){
	console.log("imageOutput function called!");
	message.channel.send({files:[imagePath]});
}

function maskMessage(message, messageContent){
	//Get the mentioned user from the message
	var memberUser = message.mentions.users.first();
	/*
		messageContent is sent with data
		mask <user> <message>
		we are going to remove mask and <user> and reconstruct the message.
	*/

	if(memberUser === undefined){
		message.channel.send("You didn't specify a user! Please specify a user!\n(They must be in the same server as I am for this function to work)");
		return;
	}

	var messageSplit = messageContent.split(" ");
	var result = "";
	
	for(i = 2; i < messageSplit.length; i++){
		result += messageSplit[i] + " ";
	}

	console.log("user message= " + result);
	//send the message and mask the message with a user's chosen victim
	message.channel.send({embed: {
		color: Math.floor(Math.random()*16777215),  //random colour
		author: {
			name: memberUser.username,
			icon_url: memberUser.avatarURL
		},
		title: "",
		description: result
	}
	});
}

function uploadImg(keyCode, message){
	console.log("uploadImg function called");
	var PouchDB = require('pouchdb');
	var db = new PouchDB('imgLinkDatabase');

	//Check if keycode exists in database
	db.get(keyCode)
	.then(function (result){
		console.log("DUPLICATE DETECTED.");
		message.channel.send("This keyword already exists! You cannot have two images assigned to one keyword!");
	}).catch(function (err){
		console.log("Move along, nothing to see here.");
		//Check Attachment exists
		if(message.attachments.first()){
			console.log("Stage 1 passed: " + message.attachments.first().filename);
			download(message.attachments.first().url, message, keyCode); //Continue to this function to download and upload
		}
		else{
			message.channel.send("Yo! There's no image attached!");		
		}
	});
}

//Download function called by uploadImg()
function download(url, message, keyCode){
	console.log("download function called")
	var w = fs.createWriteStream('imgStore/img.png');
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
	console.log("uploadImgToImgur function called!")
	var PouchDB = require('pouchdb');
	var imgur = require('imgur');
	var db = new PouchDB('imgLinkDatabase');

	imgur.setClientId(botConfig.imgurClientID);
	imgur.setCredentials(botConfig.imgurEmail, botConfig.imgurPassword, botConfig.imgurClientID);

	imgur.uploadBase64(file)
    .then(function (json) {
		message.channel.send("Image successfully uploaded! \nHere's your raw link: " + json.data.link );
		//put code into db to allow retrieval for later.
		db.put({
			_id: keyCode,
			link: json.data.link,
			author: message.author.id,
			jsonData: json.data
		}).then(function (response){
			//handle response
			console.log(json.data);
			message.channel.send("Your image can be retrieved by typing **" + botConfig.prefix + "getimg " + keyCode + "**.");
		}).catch(function (err){
			message.channel.send("Image/Keyword link was not established! Image cannot be retrieved later!");
			console.log(err);
		});
    })
    .catch(function (err) {
		console.error(err.message);
		message.channel.send("Image not uploaded! Please try again later!");
    });
}

function retrieveImg(keyCode, message){
	var PouchDB = require('pouchdb');
	var db = new PouchDB('imgLinkDatabase');
	console.log("retrieveImg function called")

	db.get(keyCode)
	.then(function (doc){
		message.channel.send("Here is your image! " + doc.link);
	}).catch(function (err){
		console.log(err);
		message.channel.send("Image could not be retrieved, please check your keycode and try again.");
	})
}

//Delete image
function deleteImg(keyCode, message){
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
}

//Lists all the keycodes in the database.
function listAllKeycodes(message){
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
}

//Choose a random keyword and retrieve the image
function randomKeyword(message){
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
}

function base64_encode(file) {
    // read binary data
    return fs.readFileSync(file, 'base64');
    // convert binary data to base64 encoded string
}

//refer to the JSON config file for the token
client.login(botConfig.token);