const botConfig = require("../config.json");

module.exports = {
    //time message
    time: function(message, isNoAuthor){
        var messageContent = message.content.substring(botConfig.prefix.length);
        var messageSplit = messageContent.split(" ");
    
        console.log("Time function called!");
    
        if(!isNoAuthor){
            if(messageSplit[1] > 0){
                if(messageSplit[1]/60 < 1 && messageSplit[1]%60 == 1){
                    message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + 2) + "\n[Reminder will be sent in 1 minute]```");
                }
                else if(messageSplit[1]/60 < 1 && messageSplit[1]%60 != 1){
                    message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + 2) + "\n[Reminder will be sent in " + messageSplit[1] + " minutes]```");
                }
                else if(messageSplit[1]/60 == 1) {
                    message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + 2) + "\n[Reminder will be sent in 1 hour]```");
                }
                else if(messageSplit[1]/60 > 1 && messageSplit[1]/60 < 2 && messageSplit[1]%60 == 1) {
                    message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + 2) + "\n[Reminder will be sent in 1 hour and 1 minute]```");
                }
                else if(messageSplit[1]/60 > 1 && messageSplit[1]/60 < 2 && messageSplit[1]%60 != 1) {
                    message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + 2) + "\n[Reminder will be sent in 1 hour and " + messageSplit[1]%60 + " minutes]```");
                }
                else if(messageSplit[1]/60 >= 2 && messageSplit[1]%60 == 0) {
                    message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + 2) + "\n[Reminder will be sent in " + Math.floor(messageSplit[1]/60) + " hours]```");
                }
                else if(messageSplit[1]/60 > 2 && messageSplit[1]%60 == 1) {
                    message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + 2) + "\n[Reminder will be sent in " + Math.floor(messageSplit[1]/60) + " hours and 1 minute]```");
                }
                else if(messageSplit[1]/60 > 2 && messageSplit[1]%60 != 1) {
                    message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + 2) + "\n[Reminder will be sent in " + Math.floor(messageSplit[1]/60) + " hours and " + messageSplit[1]%60 + " minutes]```");
                }
            }
        }
        else{
            if(messageSplit[2] > 0){
                if(messageSplit[2]/60 < 1 && messageSplit[2]%60 == 1){
                    message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + messageSplit[2].length + 3) + "\n[Reminder will be sent in 1 minute]```");
                }
                else if(messageSplit[2]/60 < 1 && messageSplit[2]%60 != 1){
                    message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + messageSplit[2].length + 3) + "\n[Reminder will be sent in " + messageSplit[2] + " minutes]```");
                }
                else if(messageSplit[2]/60 == 1) {
                    message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + messageSplit[2].length + 3) + "\n[Reminder will be sent in 1 hour]```");
                }
                else if(messageSplit[2]/60 > 1 && messageSplit[2]/60 < 2 && messageSplit[2]%60 == 1) {
                    message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + messageSplit[2].length + 3) + "\n[Reminder will be sent in 1 hour and 1 minute]```");
                }
                else if(messageSplit[2]/60 > 1 && messageSplit[2]/60 < 2 && messageSplit[2]%60 != 1) {
                    message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + messageSplit[2].length + 3) + "\n[Reminder will be sent in 1 hour and " + messageSplit[2]%60 + " minutes]```");
                }
                else if(messageSplit[2]/60 >= 2 && messageSplit[2]%60 == 0) {
                    message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + messageSplit[2].length + 3) + "\n[Reminder will be sent in " + Math.floor(messageSplit[2]/60) + " hours]```");
                }
                else if(messageSplit[2]/60 > 2 && messageSplit[2]%60 == 1) {
                    message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + messageSplit[2].length + 3) + "\n[Reminder will be sent in " + Math.floor(messageSplit[2]/60) + " hours and 1 minute]```");
                }
                else if(messageSplit[2]/60 > 2 && messageSplit[2]%60 != 1) {
                    message.channel.send("```css\n" + messageContent.slice(messageSplit[0].length + messageSplit[1].length + messageSplit[2].length + 3) + "\n[Reminder will be sent in " + Math.floor(messageSplit[2]/60) + " hours and " + messageSplit[2]%60 + " minutes]```");
                }
            }
        }
    },
    remind: async function(message, isNoAuthor){
        var messageContent = message.content.substring(botConfig.prefix.length);
        var messageSplit = messageContent.split(" ");
        console.log("remind function called!");
    
        let promise = new Promise((resolve, reject) => {
            if(isNoAuthor){
                setTimeout(() => resolve(messageContent.slice(messageSplit[0].length + messageSplit[1].length + messageSplit[2].length + 2)), messageSplit[2]*1000*60)
            }
            else{
                setTimeout(() => resolve(messageContent.slice(messageSplit[0].length + messageSplit[1].length + 1)), messageSplit[1]*1000*60)
            }
        });
        if(isNoAuthor){
            let result = await promise; 
            message.channel.send(result);
            console.log("success1");
        }
        else{
            let result = await promise;
            message.channel.send("<@!" + message.author + ">"+ result);
            console.log("success");
        }
    }  
}