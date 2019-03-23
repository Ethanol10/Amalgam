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
	if(messageSplit[0] === 'cri'){
		message.delete(1000);
		CRIfunction(message);
	}
	else if(messageSplit[0] === 'help' || messageSplit[0] === 'command'){
		message.delete(1000);
		mainHelpDialog(message);
	}
	else if(messageSplit[0] === "crihelp"){
		message.delete(1000);
		criHelp(message);
	}
	else if(messageSplit[0] === 'number'){
		if(isNaN(messageSplit[1])){
			message.channel.send("Please input a number after the command.");
		}
		else{
			message.channel.send(Math.floor((Math.random() * messageSplit[1]) + 1));
		}
	}
	else if(messageSplit[0] === 'clone'){
		if(isNaN(messageSplit[1])){
			message.channel.send("Please input a number after the command.");
		}
		else{
			message.channel.send((messageContent.slice(messageSplit[0].length + messageSplit[1].length + 2) + " ").repeat(messageSplit[1]));
		}
	}
	else if(messageSplit[0] === 'remind'){
		remind(message);
		time(message);
	}
	else if(messageSplit[0] === 'coin'){
		coin(message);
	}
}

//Inital boot
client.on("ready", () => {
  console.log("Amalgam is ready to serve!");
});

//Check for message and send it to the parser
client.on("message", (message) => {
  //Don't check the message if it does not start with the prefix or is from a bot.
	if (message.author.bot || message.content.indexOf(config.prefix) !== 0) return;
	
	console.log("Message Recieved!");
	parseCommand(message);	
});

//text output
function textOutput(inputText, message){
	console.log("textOutput function called!");
	message.channel.send(inputText);
}

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

function CRIfunction(message){
	var messageContent = message.content.substring(config.prefix.length + "CRI ".length);
	var messageSplit = messageContent.split("");
	var result = "";
	var isCRIed = false;

	console.log("CRIfunction called!");
	console.log("Input message: " + messageContent);

	for(i = 0; i < messageContent.length; i++){
		//Check if the message should be CRI-ed
		if(messageSplit[i] === "<"){
			isCRIed = true;
			i++; //Increment past the character
		}
		else if(messageSplit[i] === ">"){
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
		embedMessage(message, result);
	}
}

//reminder
async function remind(message){
    var messageContent = message.content.substring(config.prefix.length);
    var messageSplit = messageContent.split(" ");
	
		console.log("remind function called!");

    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve(messageContent.slice(messageSplit[0].length + messageSplit[1].length + 1)), messageSplit[1]*1000*60)
    });

    let result = await promise; 

    message.channel.send(message.author + result);
  }
  
//time message
function time(message){
  var messageContent = message.content.substring(config.prefix.length);
	var messageSplit = messageContent.split(" ");

	console.log("Time function called!");

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
				name: " - $clone [number] [message]",
				value: "Duplicates an inputted message."
		  	},
		  	{
				name: " - $number [number]",
				value: "Creates a random number between 1 and the inputted value."
		  	},
			{
				name: " - $remind [number] [message]",
				value: "Sends a reminder message after the inputted time(minutes) has passed."
		  	},
			{
				name: " - $coin",
				value: "Flips a coin."
			},
		  	{
				name: "- $cri [message]",
				value: "Converts \*English\* characters into Regional Indicator emojis. Type $crihelp for more information."
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
						name: " - $cri <message> message2",
						value: "The output will be \"\:regional_indicator_m: \:regional_indicator_e: \:regional_indicator_s: \:regional_indicator_s: \:regional_indicator_a: \:regional_indicator_g: \:regional_indicator_e: message2\""
					},
					{
						name: "- $cri <message1 message2",
						value: "The output will be \"\:regional_indicator_m: \:regional_indicator_e: \:regional_indicator_s: \:regional_indicator_s: \:regional_indicator_a: \:regional_indicator_g: \:regional_indicator_e: \:one:      \:regional_indicator_m: \:regional_indicator_e: \:regional_indicator_s: \:regional_indicator_s: \:regional_indicator_a: \:regional_indicator_g: \:regional_indicator_e: \:two:\""
					},
					{
						name: "- $cri message1 message2",
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
//refer to the JSON config file for the token
client.login(config.token);