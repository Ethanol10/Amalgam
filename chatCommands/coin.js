module.exports = function(message){
	var coin = (Math.floor((Math.random() * 2) + 1))
	
	console.log("coin function called!");
	if (coin == 1) {
		message.channel.send("Heads!")
	}
	else if (coin == 2) {
		message.channel.send("Tails!")
	}
}
