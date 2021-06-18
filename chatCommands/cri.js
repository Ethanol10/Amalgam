const embedMessage = require("./embedMessage.js");
const botConfig = require("../config.json");

module.exports = {
    CRIfunction: function(message, isEmbed){
        if(isEmbed){
            var messageContent = message.content.substring(botConfig.prefix.length + "CRI -embed".length);
        }
        else{
            var messageContent = message.content.substring(botConfig.prefix.length + "CRI ".length);
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
    },
    criHelp: function(message, client){
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
                            name: "- " + botConfig.prefix + "cri {message} message2",
                            value: "The output will be \"\:regional_indicator_m: \:regional_indicator_e: \:regional_indicator_s: \:regional_indicator_s: \:regional_indicator_a: \:regional_indicator_g: \:regional_indicator_e: message2\""
                        },
                        {
                            name: "- " + botConfig.prefix +  "cri {message1 message2",
                            value: "The output will be \"\:regional_indicator_m: \:regional_indicator_e: \:regional_indicator_s: \:regional_indicator_s: \:regional_indicator_a: \:regional_indicator_g: \:regional_indicator_e: \:one:      \:regional_indicator_m: \:regional_indicator_e: \:regional_indicator_s: \:regional_indicator_s: \:regional_indicator_a: \:regional_indicator_g: \:regional_indicator_e: \:two:\""
                        },
                        {
                            name: "- " + botConfig.prefix + "cri message1 message2",
                            value: "The output will be \"message1 message2\""
                        }
                    ]
                }
        });
    }
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