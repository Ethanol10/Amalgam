module.exports = {
    maskMessage: function(message, messageContent){
        //Get the mentioned user from the message
        var memberUser = message.mentions.users.first();
        /*
            messageContent is sent with data
            mask <user> <message>
            we are going to remove mask and <user> and reconstruct the message.
        */
    
        if(memberUser === undefined){
            message.channel.send("You didn't specify a user! Please specify a user!\n(They must be in the same server as I am for this function to work)");
            return;
        }
    
        var messageSplit = messageContent.split(" ");
        var result = "";
        
        for(i = 2; i < messageSplit.length; i++){
            result += messageSplit[i] + " ";
        }
    
        console.log("user message= " + result);
        //send the message and mask the message with a user's chosen victim
        message.channel.send({embed: {
            color: Math.floor(Math.random()*16777215),  //random colour
            author: {
                name: memberUser.username,
                icon_url: memberUser.avatarURL()
            },
            title: "",
            description: result
        }
        });
    }
}