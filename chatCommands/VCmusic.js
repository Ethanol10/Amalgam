const ytdl = require('ytdl-core');
const ytSearch = require('youtube-search');
const botConfig = require("../config.json");
const embedMessage = require('./embedMessage.js');
const {validateUrl} = require('youtube-validate');
const ytMetadataSearch = require('youtube-metadata-from-url');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    play: async function(message, ytquery, streamMeta){
        console.log("play function called!");
        console.log("ytquery: " + ytquery);
        console.log("typeofQuery: " + typeof(ytquery));

        var isURL = false;
        var linkMetadata;

        //check the query to see if it's a valid youtube link, otherwise treat like a search query.
        try{
            var result = await validateUrl(ytquery);
            console.log(result);
            isURL = true;
            try{
                linkMetadata = await ytMetadataSearch.metadata(ytquery);
                linkMetadata.link = ytquery;
                console.log(linkMetadata);
            }
            catch(err){
                console.log(err);
                message.channel.send("Something went wrong, try again later.");
                return;
            }
        }
        catch(error){
            console.log(error);
        }

        var rollingMessage = "";

        const streamOptions = {
            seek: 0,
            volume: 0.5
        };
        var voiceChannel = message.member.voice.channel;
        //Check if the user is in a channel to play music (end function here if true)
        if(!voiceChannel || !voiceChannel.isVoice){
            message.channel.send("You must be in a channel to play music!");
            return;
        }

        //if they are in the vc that the bot is already in, and they paused the stream, restart the stream by searching the 
        //metadata and resuming playback. (end function here if true)
        if(message.member.voice.channel === message.guild.me.voice.channel && (typeof(ytquery) === 'undefined' || ytquery === "")){
            module.exports.resume(message, streamMeta);
            return;
        }

        //If person starts up a new stream in a separate vc while active in another vc, deny usage.
        if(message.guild.me.voice.channel && (message.member.voice.channel !== message.guild.me.voice.channel) ){
            message.channel.send("Sorry, the bot is bound to <#" + voiceChannel + ">!" )
            return;
        }

        //if the bot is in the same voice channel as the user who initiated the command, add to current stream's youtubelink array.
        if(message.guild.me.voice.channel === message.member.voice.channel && (typeof(ytquery) === 'string')){
            var index = getMetadataIndex(streamMeta, message.guild);
            console.log(index);
            if(index !== -1){
                
                message.channel.send("Adding your song to the queue!");
                //If already a URL, just push into the list with premade metadata.
                if(isURL){
                    streamMeta[index].youtubeLinks.push(linkMetadata);
                    return;
                }

                //Otherwise perform a search
                var ytLink = await search(message, ytquery);

                if(ytLink === null){
                    console.log("Link could not be found, abandon.");
                    message.channel.send("Query inputted was invalid, try a different search parameter.");
                    return;
                }

                //Push valid link into playlist.
                streamMeta[index].youtubeLinks.push(ytLink);
                return;
            }
            //some cases the bot is still in the chat but not playing anything. this covers that.
            
        }

        //Setup for dispatcher to the Voice channel that the user is in. perform a search
        rollingMessage += "Initiating music stream for <@" + message.member.id + ">\n";

        if(message.guild.me.voice.channel !== message.member.voice.channel){
           rollingMessage += "Binding to: " + "<#" + voiceChannel + ">\n";
        }

        //Check if URL, identify what to do with it.
        if(isURL){ 
            ytLink = linkMetadata;
        }
        else{
            rollingMessage += "Searching for video with query: " + ytquery + "\n";

            var ytLink = await search(message, ytquery);
            console.log(ytLink);

            if(ytLink === null){
                console.log("Link could not be found, abandon.");
                message.channel.send("Query inputted was invalid, try a different search parameter.");
                return;
            }
            rollingMessage += "Found: " + ytLink.title;
        }

        //Send final message in one go. 
        message.channel.send(rollingMessage);
    
        console.log(voiceChannel);
        //Join the vc, then play audio
        newStream(message, voiceChannel, ytLink, streamOptions, streamMeta);
    },
    //pause the current stream in the same voice channel that the user is initiating the command.
    pause: function(message, streamMeta){
        console.log("pause function called!")
        var voiceChannel = message.member.voice.channel;
        if(!voiceChannel){
            message.channel.send("You aren't in a voice channel!");
            return;
        }

        //Search the array for the right dispatcher that matches the channel that the person is in.
        var index = getMetadataIndex(streamMeta, message.guild);
        if(index !== -1){
            //Buggy stuff, needs to do this when paused and resumed and paused all in that order.
            //Will fix when an update is pushed.
            streamMeta[index].dispatcherStream.resume();
            streamMeta[index].dispatcherStream.pause();
            message.channel.send("Pausing playback in " + "<#" + streamMeta[index].vc + ">" );
            streamMeta[index].pause = true;
        }
        else{
            message.channel.send("There's nothing to pause right now!");
        }
    },
    //Resumes a currently paused stream in the guild.
    resume: function(message, streamMeta){
        console.log("resume function called!");
        var voiceChannel = message.member.voice.channel;
        if(!voiceChannel){
            message.channel.send("You aren't in a voice channel!");
            return;
        }

        //search for the rright dispatcher that matches the channel that the person is in.
        var index = getMetadataIndex(streamMeta, message.guild);
        console.log(index);
        if(index !== -1){
            //buggy shit is happening here. This needs to repeat twice to trigger the resume function. 
            //Will replace if problem is fixed.
            streamMeta[index].dispatcherStream.pause();
            streamMeta[index].dispatcherStream.resume();
            streamMeta[index].dispatcherStream.pause();
            streamMeta[index].dispatcherStream.resume();
            message.channel.send("Resuming playback in " + "<#" + streamMeta[index].vc + ">" );
            streamMeta[index].pause = false;
            console.log(streamMeta[index]);
        }
        else{
            message.channel.send("There's nothing to resume right now!")
        }
    },
    //Skips the currents song playing in the stream, if nothing is next stream ends.
    skip: function(message, streamMeta){
        console.log("skip function called!")
        var voiceChannel = message.member.voice.channel;
        if(!voiceChannel){
            message.channel.send("You aren't in a voice channel!");
            return;
        }

        var index = getMetadataIndex(streamMeta, message.guild);
        console.log(index);
        if(index !== -1){
            console.log("skip performed")
            message.channel.send("Skipping current song");
            streamMeta[index].dispatcherStream.end();
        }
    },
    //Stop playing all songs, destroys playlist in current guild called.
    stop: function(message, streamMeta){
        console.log("stop function called!");
        var voiceChannel = message.member.voice.channel;
        if(!voiceChannel){
            message.channel.send("You aren't in a voice channel!");
            return;
        }

        var index = getMetadataIndex(streamMeta, message.guild);
        console.log(index);
        if(index !== -1){
            console.log("Killing stream: stop command");
            message.channel.send("Terminating Stream!");
            streamMeta.splice(index, 1);
            voiceChannel.leave();
        }
    },
    queue: function(message, streamMeta){
        console.log("listQueue function called!");
        var voiceChannel = message.member.voice.channel;
        if(!voiceChannel){
            message.channel.send("You aren't in a voice channel!");
            return;
        }

        var index = getMetadataIndex(streamMeta, message.guild);
        console.log(index);
        if(index !== -1){
            console.log("listing queue for requested guild.");
            var outputMessage = "";
            outputMessage += "Next 10 songs in queue for: <#" + streamMeta[index].vc + ">\n\n"
            if(streamMeta[index].youtubeLinks.length > 10){
                for(var i = 0; i < 10; i++){
                    outputMessage += (i + 1) + ": " + streamMeta[index].youtubeLinks[i].title + "\n";
                }    
            }
            else{
                for(var i = 0; i < streamMeta[index].youtubeLinks.length; i++){
                    outputMessage += (i + 1) + ": " + streamMeta[index].youtubeLinks[i].title + "\n";
                }    
            }
            
            embedMessage(message, outputMessage);
        }
    },
    getMetaIndex: function(streamMeta, guild){
        for(var i = 0; i < streamMeta.length; i++){
            if(streamMeta[i].guild === guild){
                return i;
            }
        }
        return -1
    }
}

function search(message, query){
    var options = {
        maxResults: 2,
        key: botConfig.ytAPIkey
    }

    return new Promise(resolve => {
        ytSearch(query, options, function(err, results){
            if(err){
                message.channel.send("Something went wrong, try again later.");
                console.log(err);
                return null;
            }
            resolve(results[0]);
        });
    });
}

//Gets the index inside the metadata global array
function getMetadataIndex(streamMeta, guild){
    for(var i = 0; i < streamMeta.length; i++){
        if(streamMeta[i].guild === guild){
            return i;
        }
    }
    return -1
}

//Sets up a new stream. Configures the disconnect event
function newStream(message, voiceChannel, ytLink, streamOptions, streamMeta, rollingMessage){
    var connection = joinVoiceChannel({
        channelId: voiceChannel,
        guildId: message.guildId
    });

    console.log("joined: " + voiceChannel);
    const stream = ytdl(ytLink.link, { filter: 'audioonly'});
    const dispatcher = connection.play(stream, streamOptions);

    //Events on start and finish of audio playback.
    dispatcher.on("start", () => onStart(message, ytLink));
    dispatcher.on("finish", end => onFinish(end, streamMeta, voiceChannel, message, connection, streamOptions));
    
    //write metadata to global array
    var streamMetadata = {
        dispatcherStream: dispatcher,
        youtubeLinks: [],
        vc: voiceChannel,
        guild: message.guild,
        pause: false,
        msg: message
    }
    streamMetadata.youtubeLinks.push(ytLink);
    streamMeta.push(streamMetadata);
    connection.on("disconnect", () => {
        console.log("client has been forcefully disconnected, destroy stream.");
        var index = getMetadataIndex(streamMeta, message.guild);
        streamMeta.splice(index, 1);
        console.log(streamMeta);
    })

}

//Callback after a song has ended.
function onStart(message, ytLink){
    console.log("on start called")
    message.channel.send("Now Playing: " + ytLink.link);
    console.log("playing: " + ytLink.link)
}

//On finish callback after song is finished or ended prematurely. checks if more songs 
//are in the queue and ends the stream if there are none left.
function onFinish(end, streamMeta, voiceChannel, message, connection, streamOptions){
    console.log("Audio ended, checking for more links to play in queue");
    var index = getMetadataIndex(streamMeta, message.guild);
    streamMeta[index].youtubeLinks.shift();
    if(streamMeta[index].youtubeLinks.length === 0){
        console.log("killing stream: end of playlist")
        streamMeta.splice(index, 1);
        message.channel.send("Finished playlist!");
        voiceChannel.leave();
    }
    else{
        const stream = ytdl(streamMeta[index].youtubeLinks[0].link, {filter : 'audioonly'});
        const newDispatcher = connection.play(stream, streamOptions);
        streamMeta[index].dispatcherStream = newDispatcher;

        //callback functions
        newDispatcher.on("start", () => onStart(message, streamMeta[index].youtubeLinks[0]));
        newDispatcher.on("finish", end => onFinish(end, streamMeta, voiceChannel, message, connection, streamOptions));
    }
}