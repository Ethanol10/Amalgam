const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
 
client.on("ready", () => {
  console.log("I am ready!");
});
 
client.on("message", message => {
  if (message.author.bot) return;
  // This is where we'll put our code.
  if (message.content.indexOf(config.prefix) !== 0) return;
 
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
 
  if(command === 'help') {
    message.channel.send(' - %squirtlesquad \n- %smile \n- %wtf @name \n- %meow \n- %hentai');
  } else
  if (command === 'squirtlesquad') {
    message.channel.send('<:Squirtle:505237828117069825><:Squirtle:505237828117069825><:Squirtle:505237828117069825><:Squirtle:505237828117069825><:Squirtle:505237828117069825>');
  }
  if (command === 'smile') {
	message.channel.send({files: ["./images/smile.png"]})
  }
  if (command === 'meow') {
	message.channel.send({files: ["./images/meow.jpg"]})
  }
  if (command === 'hentai') {
	message.channel.send({files: ["./images/hentai.jpg"]})
  }
  if (command === 'emote') {
	message.channel.send(message.content.slice(6).repeat(5))
  }
  
  //duplicator function
  var str = message.content;
  var split = str.split(" ");
  if (command === 'emoji') {
	message.channel.send(split[2].repeat(split[1]))
  }
  
  //random number generator
  if (command === 'number') {
	message.channel.send(Math.floor((Math.random() * split[1]) + 1))
  }
  
  //piece of shit
  if (command === 'rng') {
	message.channel.send(Math.floor((Math.random() * split[2]) + split[1]))
  }
  
  //sends meme to chosen person
  mention = message.mentions.users.first();
  if (command === 'wtf') {
	  if (mention == null) { return; }
	  mention.send (`What the fuck did you just fucking say about me, you little bitch? I'll have you know I graduated top of my class in the Navy Seals, and I've been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I'm the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You're fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that's just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little "clever" comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn't, you didn't, and now you're paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You're fucking dead, kiddo.`);
  }
});
 
client.login(config.token);