const botConfig = require('../config.json');
const embedMessage = require('./embedMessage.js');

module.exports = {
    gatekeepingClap: function(message, isEmbed){
        var result = "";
        var clapStr = "clap:"
    
        //Check if embedded is required
        console.log(isEmbed);
        if(isEmbed){
            console.log("isembed");
            var messageContent = message.content.substring(botConfig.prefix.length + "clap -embed ".length);
        }
        else{
            var messageContent = message.content.substring(botConfig.prefix.length + "clap ".length);
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
}