module.exports = function(message, messageContent){
	console.log("embedMessage function called");
	message.channel.send({embeds: [{
			color: Math.floor(Math.random()*16777215),  //random colour
			author: {
				name: message.author.username,
				icon_url: message.author.avatarURL()
			},
			title: "",
			description: messageContent
		}]
	});
}