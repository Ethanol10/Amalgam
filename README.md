# Amalgam

A multi-function bot that runs with silly commands.
For the program to run, you need a config.json file with the fields 

~~~~
{
    "token": <Discord Bot token>,
    "prefix": <any prefix>,
    "ownerID": <Owner of the bot>,
    "imgurClientID": <imgur Client ID>,
    "imgurEmail": <imgur Email address to a public account>,
    "imgurPassword": <imgur Password>
}
~~~~

**$clone [number] [message]**
*Duplicates an inputted message by the number specified.*

**$number [number]**
*Creates a random number between 1 and the inputted value.*

**$remind [number] [message]**
*Sends a reminder message after the inputted time(minutes) has passed. Put **"-noAuthor"** between the command and the number of minutes to only print the message without pinging the person who called this command.*

**$coin**
*Flips a coin.*

**$cri [message]**
*Converts English characters into Regional Indicator emojis. Type $crihelp for more information. If you want the message in an embed, **please type "-embed"** between the command and the message.*

**$calc [number] [operator] [number]**
*Calculates two numbers with an operator. See $calchelp for a list of operands.*

**$mshrg**
*Prints ¯\\\_(ツ)_/¯. This is useful for mobile discord users.*

**$clap [message]**
*Prints a \:clap: for every space in the input string. (It does not include the space between the command and the message. If you want the message in an embed, **please type "-embed"** between the command and the message.*

**$upload [keyCode] !Image!**
*Upload an image to a public account on Imgur. If you don't want anyone else seeing the image, this is probably not the place to upload it.*

**$getimg [keyCode]**
*Retrieve an image stored on this database using a keycode. Keycode is case sensitive.*

**$deleteimg [keyCode]**
*Deletes an image associated with the keycode, provided that the image is owned by you. Will not delete the image if you are not the original poster.*

**$randomimg**
*Picks a random image from my database.*

**$mask [targetUser] [message]**
*Masks your message as the target user's message by sending an embedded message with the target user's name on it*