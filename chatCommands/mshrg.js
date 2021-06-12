const embedMessage = require("./embedMessage.js");

module.exports = function(message){
    console.log("mshrg command called!");
	embedMessage(message, "¯\\\_(ツ)_/¯");
}