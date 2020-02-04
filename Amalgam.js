const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const specChar = require("./specialCharacter.json");

//Parses the message and figures out what command has been typed by the user
function parseCommand(message) {
	var i;
	//Get the message and split it
	var messageContent = message.content.substring(config.prefix.length);
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
			mainHelpDialog(message);
			break;	
		case "command":
			message.delete(1000);
			mainHelpDialog(message);
			break;
		case "crihelp":
			message.delete(1000);
			criHelp(message);
			break;
		case "calchelp":
			inputStr = "**" + config.prefix + "calchelp**\n Available operands are as follows: \n Addition: + \n Subtraction: - \n Multiplication: * \n Division: / \n Modulo: % \n Exponent:^"
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
			message.delete(1000);
			console.log("mshrg command called!");
			embedMessage(message, "¯\\\_(ツ)_/¯");
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
		}
}

//Inital boot
client.on("ready", () => {
	console.log("Amalgam is ready to serve!");
	client.user.setActivity(config.prefix + "help");
});

//Check for message and send it to the parser
client.on("message", (message) => {
  //Don't check the message if it does not start with the prefix or is from a bot.
	if (message.author.bot || message.content.indexOf(config.prefix) !== 0) return;
	
	console.log("Message Recieved!");
	parseCommand(message);	
});

//image output
function imageOutput(imagePath, message){
	console.log("imageOutput function called!");
	message.channel.send({files:[imagePath]});
}

function regionalIndicatorGenerator(char){
	var regIndStdString = "regional_indicator_";
	var alphabet = "abcdefghijklmnopqrstuvwxyz";

	console.log("char: " + char);
	char = char.toLowerCase();

	if(char.length != 1){
		console.log("Hold up, that's illegal.");
		console.log("ERROR: MORE THAN ONE CHAR PASSED TO FUNCTION: regionalIndicatorGenerator");
		return;
	}

	if(alphabet.includes(char)){
		return regIndStdString + char + ":";
	}

	for (j = 0; j < specChar.specialCharacter.length; j++) {
		
		if(char === specChar.specialCharacter[j].inputChar){
			return specChar.specialCharacter[j].returnChar;
		}
	}

	return char;
}

function CRIfunction(message, isEmbed){

	if(isEmbed){
		var messageContent = message.content.substring(config.prefix.length + "CRI -embed".length);
	}
	else{
		var messageContent = message.content.substring(config.prefix.length + "CRI ".length);
	}
	var messageSplit = messageContent.split("");
	var result = "";
	var isCRIed = false;

	console.log("CRIfunction called!");
	console.log("Input message: " + messageContent);

	for(i = 0; i < messageContent.length; i++){
		//Check if the message should be CRI-ed
		if(messageSplit[i] === "{"){
			isCRIed = true;
			i++; //Increment past the character
		}
		else if(messageSplit[i] === "}"){
			isCRIed = false;
			i++; //Increment past the character
		}
		
		//Start CRIing if the message requires to be CRIed
		if(isCRIed){
			console.log("messageSplit[i]: " + messageSplit[i] + " " + i );
			var regIndGenChar = regionalIndicatorGenerator(messageSplit[i]);
		
			if(regIndGenChar === "    "){
				result = result + regIndGenChar + " ";
			}
			else if(regIndGenChar[regIndGenChar.length - 1] === ":"){
				result = result + "\:" + regIndGenChar + " ";
			}
			else{
				result = result + regIndGenChar + " ";
			}
		}
		else if(!isCRIed){
			if(messageSplit[i] !== undefined){
				result = result + messageSplit[i];
			}
		} 
	}
	if(result.length > 2000){
		message.channel.send("Message too Long! Working on fixing that soon!");
	}
	else{
		if(isEmbed){
			embedMessage(message, result);
		}
		else{
			console.log(isEmbed);
			message.channel.send(result);
		}
	}
}

//reminder
async function remind(message, isNoAuthor){
    var messageContent = message.content.substring(config.prefix.length);
    var messageSplit = messageContent.split(" ");
	
		console.log("remind function called!");

    let promise = new Promise((resolve, reject) => {
			if(isNoAuthor){
				setTimeout(() => resolve(messageContent.slice(messageSplit[0].length + messageSplit[1].length + messageSplit[2].length + 2)), messageSplit[2]*1000*60)
			}
			else{
				setTimeout(() => resolve(messageContent.slice(messageSplit[0].length + messageSplit[1].length + 1)), messageSplit[1]*1000*60)
			}
    });

		if(isNoAuthor){
			let result = await promise; 
			message.channel.send(result);
			console.log("success1");
		}
		else{
			let result = await promise;
			message.channel.send(message.author + result);
			console.log("success");
		}
  }
  
//time message
function time(message, isNoAuthor){
  var messageContent = message.content.substring(config.prefix.length);
	var messageSplit = messageContent.split(" ");

	console.log("Time function called!");

	if(!isNoAuthor){
		if(messageSplit[1] > 0){
			if(messageSplit[1]/60 < 1 && messageSplit[1]%60 == 1){
				message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + 2) + "\n[Reminder will be sent in 1 minute]```");
			}
			else if(messageSplit[1]/60 < 1 && messageSplit[1]%60 != 1){
				message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + 2) + "\n[Reminder will be sent in " + messageSplit[1] + " minutes]```");
			}
			else if(messageSplit[1]/60 == 1) {
				message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + 2) + "\n[Reminder will be sent in 1 hour]```");
			}
			else if(messageSplit[1]/60 > 1 && messageSplit[1]/60 < 2 && messageSplit[1]%60 == 1) {
				message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + 2) + "\n[Reminder will be sent in 1 hour and 1 minute]```");
			}
			else if(messageSplit[1]/60 > 1 && messageSplit[1]/60 < 2 && messageSplit[1]%60 != 1) {
				message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + 2) + "\n[Reminder will be sent in 1 hour and " + messageSplit[1]%60 + " minutes]```");
			}
			else if(messageSplit[1]/60 >= 2 && messageSplit[1]%60 == 0) {
				message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + 2) + "\n[Reminder will be sent in " + Math.floor(messageSplit[1]/60) + " hours]```");
			}
			else if(messageSplit[1]/60 > 2 && messageSplit[1]%60 == 1) {
				message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + 2) + "\n[Reminder will be sent in " + Math.floor(messageSplit[1]/60) + " hours and 1 minute]```");
			}
			else if(messageSplit[1]/60 > 2 && messageSplit[1]%60 != 1) {
				message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + 2) + "\n[Reminder will be sent in " + Math.floor(messageSplit[1]/60) + " hours and " + messageSplit[1]%60 + " minutes]```");
			}
		}
	}
	else{
		if(messageSplit[2] > 0){
			if(messageSplit[2]/60 < 1 && messageSplit[2]%60 == 1){
				message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + messageSplit[2].length + 3) + "\n[Reminder will be sent in 1 minute]```");
			}
			else if(messageSplit[2]/60 < 1 && messageSplit[2]%60 != 1){
				message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + messageSplit[2].length + 3) + "\n[Reminder will be sent in " + messageSplit[2] + " minutes]```");
			}
			else if(messageSplit[2]/60 == 1) {
				message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + messageSplit[2].length + 3) + "\n[Reminder will be sent in 1 hour]```");
			}
			else if(messageSplit[2]/60 > 1 && messageSplit[2]/60 < 2 && messageSplit[2]%60 == 1) {
				message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + messageSplit[2].length + 3) + "\n[Reminder will be sent in 1 hour and 1 minute]```");
			}
			else if(messageSplit[2]/60 > 1 && messageSplit[2]/60 < 2 && messageSplit[2]%60 != 1) {
				message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + messageSplit[2].length + 3) + "\n[Reminder will be sent in 1 hour and " + messageSplit[2]%60 + " minutes]```");
			}
			else if(messageSplit[2]/60 >= 2 && messageSplit[2]%60 == 0) {
				message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + messageSplit[2].length + 3) + "\n[Reminder will be sent in " + Math.floor(messageSplit[2]/60) + " hours]```");
			}
			else if(messageSplit[2]/60 > 2 && messageSplit[2]%60 == 1) {
				message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + messageSplit[2].length + 3) + "\n[Reminder will be sent in " + Math.floor(messageSplit[2]/60) + " hours and 1 minute]```");
			}
			else if(messageSplit[2]/60 > 2 && messageSplit[2]%60 != 1) {
				message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + messageSplit[2].length + 3) + "\n[Reminder will be sent in " + Math.floor(messageSplit[2]/60) + " hours and " + messageSplit[2]%60 + " minutes]```");
			}
		}
	}
	
}

function coin(message){
	var coin = (Math.floor((Math.random() * 2) + 1))
	
	console.log("coin function called!");
	if (coin == 1) {
		message.channel.send("Heads!")
	}
	else if (coin == 2) {
		message.channel.send("Tails!")
	}
}

function calculator(message, messageContent){
	var messageSplit = messageContent.split(" ");
	var validChar = "+-/*^%";
	var result;
	console.log("calculator function called!");
	
	if(isNaN(messageSplit[1]) || isNaN(messageSplit[3])){
		message.channel.send("Invalid number in argument 1 or 3");
		console.log("Invalid Num in argument 1/3");
		return;
	}

	switch(messageSplit[2]){
		case "+":
			result = additionFunc(messageSplit[1], messageSplit[3]);
			break;
		case "-":
			result = subtractFunc(messageSplit[1], messageSplit[3]);
			break;
		case "*":
			result = multiplyFunc(messageSplit[1], messageSplit[3]);
			break;
		case "/":
			result = divisionFunc(messageSplit[1], messageSplit[3]);
			break;
		case "^":
			result = powerToFunc(messageSplit[1], messageSplit[3]);
			break;
		case "%":
			result = moduloFunc(messageSplit[1], messageSplit[3]);
			break;
		default:
			message.channel.send("Invalid operand in argument 2");
			console.log("Invalid operand in argument 2");
			break;
	}
	message.channel.send(result);
}

function gatekeepingClap(message, isEmbed){
	var result = "";
	var clapStr = "clap:"

	//Check if embedded is required
	console.log(isEmbed);
	if(isEmbed){
		console.log("isembed");
		var messageContent = message.content.substring(config.prefix.length + "clap -embed ".length);
	}
	else{
		var messageContent = message.content.substring(config.prefix.length + "clap ".length);
	}
	console.log("gatekeepingClap function called");

	//generate clap string
	result += "\:" + clapStr; 
	for(i = 0; i < messageContent.length; i++){
		if(messageContent[i] === " "){
			result += "\:" + clapStr; 
		}
		else{
			result += messageContent[i];
		}
	}
	result += "\:" + clapStr; 
	
	//Send it
	if(isEmbed){
		embedMessage(message, result);
	}
	else{
		message.channel.send(result);
	}
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

function mainHelpDialog(message){

	console.log("mainHelpDialog function called!");
	message.channel.send({embed: {
		color: Math.floor(Math.random()*16777215),  //random colour
		author: {
		  name: client.user.username,
		  icon_url: client.user.avatarURL
		},
		title: "**__Command List__**",
		description: "Looks like your tiny brain couldn't remember all the commands. \nHere they are I guess:",
		fields: [
			{
				name: "- " + config.prefix + "clone [number] [message]",
				value: "Duplicates an inputted message by the number specified."
		  	},
		  	{
				name: "- " + config.prefix + "number [number]",
				value: "Creates a random number between 1 and the inputted value."
		  	},
			{
				name: "- " + config.prefix + "remind [number] [message]",
				value: "Sends a reminder message after the inputted time(minutes) has passed. \*\*Put \"-noAuthor\"\*\* between the command and the number of minutes to only print the message without pinging the person who called this command."
		  	},
			{
				name: "- " + config.prefix + "coin",
				value: "Flips a coin."
			},
			{
				name: "- " + config.prefix + "calc [number] [operator] [number]",
				value: "Calculates two numbers with an operator. See **$calchelp** for a list of operands."
			},
		  {	
				name: "- " + config.prefix + "cri [message]",
				value: "Converts \*English\* characters into Regional Indicator emojis. Type **$crihelp** for more information. If you want the message in an embed, \*\*please type \"-embed\"\*\* between the command and the message."
			},
			{
				name: "- " + config.prefix + "mshrg",
				value: "Prints ¯\\\_(ツ)_/¯. This is useful for mobile discord users."
			},
			{
				name: "- " + config.prefix + "clap [message]",
				value: "Prints a \:clap: for every space in the input string. If you want the message in an embed, \*\*please type \"-embed\"\*\* between the command and the message.(It does not include the space between the command and the message)"
			},
			{
				name: "- " + config.prefix + "mask [targetUser] [message]",
				value: "Masks your message as the target user's message by sending an embedded message with the target user's name on it"
			}
		]
	  }
	  });
}

function criHelp(message){

	console.log("criHelp function called!");
	message.channel.send({embed: {
				color: Math.floor(Math.random()*16777215),  //random colour
				author: {
					name: client.user.username,
					icon_url: client.user.avatarURL
				},
				title: "**__CRI Help__**",
				description: "More information on how to use $cri",
				fields: [
					{
						name: "- " + config.prefix + "cri {message} message2",
						value: "The output will be \"\:regional_indicator_m: \:regional_indicator_e: \:regional_indicator_s: \:regional_indicator_s: \:regional_indicator_a: \:regional_indicator_g: \:regional_indicator_e: message2\""
					},
					{
						name: "- " + config.prefix +  "cri {message1 message2",
						value: "The output will be \"\:regional_indicator_m: \:regional_indicator_e: \:regional_indicator_s: \:regional_indicator_s: \:regional_indicator_a: \:regional_indicator_g: \:regional_indicator_e: \:one:      \:regional_indicator_m: \:regional_indicator_e: \:regional_indicator_s: \:regional_indicator_s: \:regional_indicator_a: \:regional_indicator_g: \:regional_indicator_e: \:two:\""
					},
					{
						name: "- " + config.prefix + "cri message1 message2",
						value: "The output will be \"message1 message2\""
					}
				]
			}
	  });
}

function embedMessage(message, messageContent){
	console.log("embedMessage function called");
	message.channel.send({embed: {
			color: Math.floor(Math.random()*16777215),  //random colour
			author: {
				name: message.author.username,
				icon_url: message.author.avatarURL
			},
			title: "",
			description: messageContent
		}
	});
}

function uploadImgToImgur(file){
	var imageLink = "";

	//Check if the file is an image
	if (!file || !file.type.match(/image.*/)){
		return;
	} 

	var fd = new FormData();
    fd.append("image", file); // Append the file
	fd.append("key", config.imgurClientID);
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "https://api.imgur.com/3/upload");
	xhr.onload = function(){

	}

	xhr.send(fd);
}

function additionFunc(num1, num2){
	return Number(num1) + Number(num2);
}

function subtractFunc(num1, num2){
	return Number(num1) - Number(num2);
}

function multiplyFunc(num1, num2){
	return Number(num1) * Number(num2);
}

function divisionFunc(num1, num2){
	return Number(num1) / Number(num2);
}

function powerToFunc(num1, power){
	return Math.pow(Number(num1), Number(power));
}

function moduloFunc(num1, num2){
	return Number(num1) % Number(num2);
}
//refer to the JSON config file for the token
client.login(config.token);