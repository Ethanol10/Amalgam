const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const SimpleCommand = require("./SimpleCommand.json");

//Parses the message and figures out what command has been typed by the user
function parseCommand(message) {
	var i;
	//Get the message and split it
	var messageContent = message.content.substring(config.prefix.length);
	var messageSplit = messageContent.split(" ");

	//Check if the Convert Regional Indicator function should be called.
	if(messageSplit[0] === 'cri'){
		CRIfunction(message);
	}
	else if(messageSplit[0] === 'help'){
		message.channel.send("Format: $cri <input message here>");
	}
	else{ //Should be depreciated soon
		for (i = 0; i < SimpleCommand.MasterCommandList.length; i++) { 
			if(messageContent.includes(SimpleCommand.MasterCommandList[i].command)){
				switch(SimpleCommand.MasterCommandList[i].type){
					case "text":
						textOutput(SimpleCommand.MasterCommandList[i].info, command);
						return console.log("text outputted");
						break;
					case "image":
						imageOutput(SimpleCommand.MasterCommandList[i].info, command);
						return console.log("image outputted");
						break;
					case "emoticon":
						emoticonOutput(SimpleCommand.MasterCommandList[i].info, command);
						return console.log("emote outputted");
						break;
					default:
						console.log("Mistyped type in JSON my dude");
						break;
				}
			}
		}
	}
}

//Inital boot
client.on("ready", () => {
  console.log("Ready to serve!");
  console.log("Please inform the developer if there are any bugs.");
});

//Check for message and send it to the parser
client.on("message", (message) => {
  //Don't check the message if it does not start with the prefix or is from a bot.
	if (message.author.bot || message.content.indexOf(config.prefix) !== 0) return;

	parseCommand(message);	
});

//text output
function textOutput(inputText, message) {
	message.channel.send(inputText);
}

//image output
function imageOutput(imagePath, message) {
	message.channel.send({files:[imagePath]});
}

function regionalIndicatorGenerator(char){
	var regIndStdString = "regional_indicator_";
	var alphabet = "abcdefghijklmnopqrstuvwxyz";
	char = char.toLowerCase();

	if(char.length != 1){
		console.log("Hold up, that's illegal.");
		console.log("ERROR: MORE THAN ONE CHAR PASSED TO FUNCTION: regionalIndicatorGenerator");
		return;
	}

	if(alphabet.includes(char)){
		return regIndStdString + char + ":";
	}
	switch(char){
		case " ":
			return "    ";
			break;
		case "?":
			return "question:";
			break;
		case "!":
			return "exclamation:";
			break;
		case "1":
			return "one:";
			break;
		case "2":
			return "two:";
			break;
		case "3":
			return "three:";
			break;
		case "4":
			return "four:";
			break;
		case "5":
			return "five:";
			break;
		case "6":
			return "six:";
			break;
		case "7":
			return "seven:";
			break;
		case "8":
			return "eight:";
			break;
		case "9":
			return "nine:";
			break;
		case "*":
			return "asterisk:";
			break;
		case "$":
			return "heavy_dollar_sign:";
			break;
		default:
			return char;
			break;
	}
}

function CRIfunction(message){
	var messageContent = message.content.substring(config.prefix.length + "CRI ".length);
	var messageSplit = messageContent.split("");
	var result = "";

	for(i = 0; i < messageContent.length; i++){
		if(regionalIndicatorGenerator(messageSplit[i]) === "    "){
			result = result + regionalIndicatorGenerator(messageSplit[i]);
		}
		else if(regionalIndicatorGenerator(messageSplit[i])[regionalIndicatorGenerator(messageSplit[i]).length - 1] === ":"){
			result = result + "\:" + regionalIndicatorGenerator(messageSplit[i]);
		}
		else{
			result = result + regionalIndicatorGenerator(messageSplit[i]);
		}
	}
	if(result.length > 2000){
		message.channel.send("Message too Long! Working on fixing that soon!");
	}
	else{
		message.channel.send(result);
	}
}

//refer to the JSON config file for the token
client.login(config.token);