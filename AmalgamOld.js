//Node Libraries
const Discord = require('discord.js');
const {Client, GatewayIntentBits} = require('discord.js');
const client = new Client(
	{
		intents:[
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildVoiceStates,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildEmojisAndStickers,
			GatewayIntentBits.MessageContent
		]
	});
const botConfig = require("./config.json");

//chat command imports
const mshrug = require('./chatCommands/mshrg.js');
const embedMessage = require('./chatCommands/embedMessage.js');
const {CRIfunction, criHelp} = require('./chatCommands/cri.js');
const coin = require('./chatCommands/coin.js');
const {calculator} = require('./chatCommands/calculator.js');
const {time, remind} = require('./chatCommands/remind.js');
const {gatekeepingClap} = require('./chatCommands/gatekeeping.js');
const {mainHelpDialog} = require('./chatCommands/mainHelp.js');
const {maskMessage} = require('./chatCommands/maskMessage.js');
const {uploadImg, deleteImg, listAllKeycodes, randomKeyword, retrieveImg} = require('./chatCommands/img.js');
const {play, pause, resume, skip, stop, getMetaIndex, queue} = require('./chatCommands/VCmusic.js');
const { furiganaize } = require('./chatCommands/furiganaWriter');

//AWS imports
const AWS = require('aws-sdk');

var streamMetadata = [];

//DynamoDB stuff
//const {importToDynamoDB} = require('./dynaDBFunctions/importToDynamo.js');

//Parses the message and figures out what command has been typed by the user
async function parseCommand(message) {
	var i;
	//Get the message and split it
	var messageContent = message.content.substring(botConfig.prefix.length);
	var messageSplit = messageContent.split(" ");

	console.log("parseCommand function called!");
	//Check if the Convert Regional Indicator function should be called.
	switch(messageSplit[0]){
		case "cri":
			(messageSplit[1] === '-embed') ?
			 			CRIfunction(message, true) : CRIfunction(message, false);
			break;
		case "help":
			mainHelpDialog(message, client);
			break;	
		case "command":
			mainHelpDialog(message);
			break;
		case "crihelp":
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
				console.log(Math.floor((Math.random() * messageSplit[1]) + 1));
				message.channel.send(Math.floor((Math.random() * messageSplit[1]) + 1) + "");
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
		case "play":
			play(message, messageContent.substring("play ".length), streamMetadata);
			break;
		case "pause":
			pause(message, streamMetadata);
			break;
		case "resume":
			resume(message, streamMetadata);
			break;
		case "skip":
			skip(message, streamMetadata);
			break;
		case "stop":
			stop(message, streamMetadata);
			break;
		case "queue":
			queue(message, streamMetadata);
			break;
		case "furiganaize":
			furiganaize(message);
	}
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

	//db import to DynamoDB
	//importToDynamoDB();
});

//Check for message and send it to the parser
client.on("messageCreate", (message) => {
  //Don't check the message if it does not start with the prefix or is from a bot.
	if (message.author.bot || message.content.indexOf(botConfig.prefix) !== 0) return;
	
	console.log("Message Recieved!");
	parseCommand(message);	
});

//Check if the bot is by itself in the channel, terminate stream for that guild and delete metadata.
client.on("voiceStateUpdate", (oldState, newState) => {
	try{
		if( newState.guild.me.voice.channel.members.size === 1 ){
			var index = getMetaIndex(streamMetadata, newState.guild);
			streamMetadata[index].msg.channel.send("Nobody is in the bound voice channel: <#" + streamMetadata[index].vc + ">, terminating the stream.")
			streamMetadata.splice(index, 1);
			newState.guild.me.voice.channel.leave();
		}
	}
	catch (err){
		if(err instanceof TypeError){
			console.log("TypeError, but bot is probably not in VC, so no problems here.");
		}
	}
});

//refer to the JSON config file for the token
client.login(botConfig.token);