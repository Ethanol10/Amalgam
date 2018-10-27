const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
  console.log("Ready to serve!");
  console.log("Please inform the developer if there are any bugs.");
});

client.on("message", (message) => {
  //Don't check the message if it does not start with the prefix or is from a bot.
    if (message.author.bot) return;
	if(message.content.includes("fuck") || message.content.includes("shit") || message.content.includes("faggot") || message.content.includes("cunt") ){
		message.channel.send("Watch yo profanity");
	}  
	
	if(message.content.includes("no u")){
		message.channel.send("no u first");
	}
	
	if(message.content.includes("あ")){
		message.channel.send("fucking weeb");
	}
	
	if (message.content.includes("ethan")){
		message.channel.send("some type of fuel that no one likes to use but everyone has to use it cause it's cheap and everyone is a poor little shit. Do you think I have enough money to pay for diesel? I don't think so motherfucker.");
	}
	
	if(message.content.includes("jack")){
		message.channel.send("asian vegetables");
	}
	
	if(message.content.includes("julian")){
		message.channel.send("a wobbly dessert");
	}
	
	if(message.content.includes("おまえはもう死んでいる")){
		message.channel.send("私はウェッブを話すことができません。");
	}
	
});

client.login(config.token);