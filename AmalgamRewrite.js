//Node Libraries
const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const {Client, GatewayIntentBits} = require('discord.js');
const client = new Client(
	{
		intents:[
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildVoiceStates,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.MessageContent
		]
	});
const botConfig = require("./config.json");

//chat command imports
const mshrug = require('./chatCommands/mshrg.js');
const embedMessage = require('./chatCommands/embedMessage.js');
const {CRIfunction, criHelp} = require('./chatCommands/cri.js');
const coin = require('./chatCommands/coin.js');
const {calculator} = require('./chatCommands/calculator.js');
const {time, remind} = require('./chatCommands/remind.js');
const {gatekeepingClap} = require('./chatCommands/gatekeeping.js');
const {mainHelpDialog} = require('./chatCommands/mainHelp.js');
const {maskMessage} = require('./chatCommands/maskMessage.js');
const {uploadImg, deleteImg, listAllKeycodes, randomKeyword, retrieveImg} = require('./chatCommands/img.js');
const {play, pause, resume, skip, stop, getMetaIndex, queue} = require('./chatCommands/VCmusic.js');
const { furiganaize } = require('./chatCommands/furiganaWriter');

//AWS imports
const AWS = require('aws-sdk');

var streamMetadata = [];

//We build slash commands through here.
const commands = [
    new Discord.SlashCommandBuilder().setName('botcode').setDescription('Show bot developer information')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(botConfig.token);

rest.put(Discord.Routes.applicationCommands(botConfig.clientID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'botcode') {
        await interaction.reply("Here's how I work. It ain't perfect tho. https://github.com/Ethanol10/Amalgam");
    } else if (commandName === 'server') {
        await interaction.reply('Server info.');
    } else if (commandName === 'user') {
        await interaction.reply('User info.');
    }
});

client.login(botConfig.token);