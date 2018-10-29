const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const SimpleCommand = require("./SimpleCommand.json");

function parseCommand(command) {
	var i;
	for (i = 0; i < SimpleCommand.MasterCommandList.length; i++) { 
    	if(command.content.includes(SimpleCommand.MasterCommandList[i].command)){
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
					console.log("Mistyped command my dude");
					break;
			}
		}
	}
}

client.on("ready", () => {
  console.log("Ready to serve!");
  console.log("Please inform the developer if there are any bugs.");
});

client.on("message", (message) => {
  //Don't check the message if it does not start with the prefix or is from a bot.
	if (message.author.bot) return;
	
	parseCommand(message);	
});

function textOutput(inputText, message) {
	message.channel.send(inputText);
}

function imageOutput(imagePath, message) {
	message.channel.send({files:[imagePath]})
}

function emoticonOutput(emoteID, message) {
    message.channel.send("hmmmmmmm");
}

client.login(config.token);