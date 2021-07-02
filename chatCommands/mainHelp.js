const botConfig = require('../config.json');

module.exports = {
    mainHelpDialog: function(message, client){
        console.log("mainHelpDialog function called!");
        message.channel.send({embed: {
            color: Math.floor(Math.random()*16777215),  //random colour
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: "**__Command List__**",
            description: "Looks like your tiny brain couldn't remember all the commands. \nHere they are I guess:",
            fields: [
                {
                    name: "- " + botConfig.prefix + "clone [number] [message]",
                    value: "Duplicates an inputted message by the number specified."
                  },
                  {
                    name: "- " + botConfig.prefix + "number [number]",
                    value: "Creates a random number between 1 and the inputted value."
                  },
                {
                    name: "- " + botConfig.prefix + "remind [number] [message]",
                    value: "Sends a reminder message after the inputted time(minutes) has passed. \*\*Put \"-noAuthor\"\*\* between the command and the number of minutes to only print the message without pinging the person who called this command."
                  },
                {
                    name: "- " + botConfig.prefix + "coin",
                    value: "Flips a coin."
                },
                {
                    name: "- " + botConfig.prefix + "calc [number] [operator] [number]",
                    value: "Calculates two numbers with an operator. See **$calchelp** for a list of operands."
                },
                {	
                    name: "- " + botConfig.prefix + "cri [message]",
                    value: "Converts \*English\* characters into Regional Indicator emojis. Type **$crihelp** for more information. If you want the message in an embed, \*\*please type \"-embed\"\*\* between the command and the message."
                },
                {
                    name: "- " + botConfig.prefix + "clap [message]",
                    value: "Prints a \:clap: for every space in the input string. If you want the message in an embed, \*\*please type \"-embed\"\*\* between the command and the message.(It does not include the space between the command and the message)"
                },
                {
                    name: "- " + botConfig.prefix + "upload [keyCode] !Image!",
                    value: "Upload an image to a public account on Imgur. If you don't want anyone else seeing the image, this is probably not the place to upload it."
                },
                {
                    name: "- " + botConfig.prefix + "getimg [keyCode]",
                    value: "Retrieve an image stored on this database using a keycode. Keycode is case sensitive."
                },
                {
                    name: "- " + botConfig.prefix + "deleteimg [keyCode]",
                    value: "Deletes an image associated with the keycode, provided that the image is owned by you. Will not delete the image if you are not the original poster."
                },
                {
                    name: "- " + botConfig.prefix + "listkey",
                    value: "Shows all available key codes in the database."
                },
                {
                    name: "- " + botConfig.prefix + "randomimg",
                    value: "Picks a random image from my database."
                },
                {
                    name: "- " + botConfig.prefix + "mask [targetUser] [message]",
                    value: "Masks your message as the target user's message by sending an embedded message with the target user's name on it"
                }
            ]
          }
        });
    }
}