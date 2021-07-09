const ytdl = require('ytdl-core');

module.exports = {
    play: function(message, ytLink, streamMeta){
        console.log("play function called!");
        console.log("ytlink: " + typeof(ytLink));

        const streamOptions = {
            seek: 0,
            volume: 0.5
        };
        var voiceChannel = message.member.voice.channel;
        //Check if the user is in a channel to play music (end function here if true)
        if(!voiceChannel){
            message.channel.send("You must be in a channel to play music!");
            return;
        }

        //if they are in the vc that the bot is already in, and they paused the stream, restart the stream by searching the 
        //metadata and resuming playback. (end function here if true)
        if(message.member.voice.channel === message.guild.me.voice.channel && typeof(ytLink) === 'undefined'){
            module.exports.resume(message, streamMeta);
            return;
        }

        //If person starts up a new stream in a separate vc while active in another vc, deny usage.
        if(message.guild.me.voice.channel && (message.member.voice.channel !== message.guild.me.voice.channel) ){
            message.channel.send("Sorry, someone is already using the bot for music! Perhaps add to the playlist in that channel?")
            return;
        }

        //if the bot is in the same voice channel as the user who initiated the command, add to current stream's youtubelink array.

        if(message.guild.me.voice.channel === message.member.voice.channel && (typeof(ytLink) === 'string')){
            var index = getMetadataIndex(streamMeta, message.guild);
            console.log(index);
            if(index !== -1){
                message.channel.send("Adding your song to the queue!");
                streamMeta[index].youtubeLinks.push(ytLink);
                return;
            }
            //somecases the bot is still in the chat but not playing anything. this covers that.
            else{
                
            }
            
        }

        //Setup for dispatcher to the Voice channel that the user is in.
        message.channel.send("Initiating music stream for " + message.member.nickname);
        if(message.guild.me.voice.channel !== message.member.voice.channel){
            message.channel.send("Joining: " + "<#" + voiceChannel + ">");
        }

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
            streamMeta[index].dispatcherStream.resume();
            streamMeta[index].dispatcherStream.pause();
            message.channel.send("Pausing playback in " + "<#" + streamMeta[index].vc + ">" );
            streamMeta[index].pause = true;
        }
        else{
            message.channel.send("There's nothing to pause right now!");
        }
    },
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
            //buggy shit is happening here. furthermore the API seems to speedup playback??
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
    skip: function(message, streamMeta){

    },
    stop: function(message, streamMeta){

    }
}

function getMetadataIndex(streamMeta, guild){
    for(var i = 0; i < streamMeta.length; i++){
        if(streamMeta[i].guild === guild){
            return i;
        }
    }
    return -1
}

function newStream(message, voiceChannel, ytLink, streamOptions, streamMeta){
    voiceChannel.join()
        .then(connection => {
            console.log("joined: " + voiceChannel);
            const stream = ytdl(ytLink, { filter: 'audioonly'});
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
                pause: false
            }
            streamMetadata.youtubeLinks.push(ytLink);
            streamMeta.push(streamMetadata);
            connection.on("disconnect", () => {
                console.log("client has been forcefully disconnected, destroy stream.");
                var index = getMetadataIndex(streamMeta, message.guild);
                streamMeta.splice(index, 1);
                console.log(streamMeta);
            })
        })
        .catch(err => console.log("Something went wrong: " + err));
}

//Callback after a song has ended.
function onStart(message, ytLink){
    console.log("on start called")
    message.channel.send("Now Playing: " + ytLink);
    console.log("playing: " + ytLink)
}

//Check list if more songs are needed to be played.
function onFinish(end, streamMeta, voiceChannel, message, connection, streamOptions){
    console.log("Audio ended, checking for more links to play in queue");
    var index = getMetadataIndex(streamMeta, message.guild);
    streamMeta[index].youtubeLinks.shift();
    if(streamMeta[index].youtubeLinks.length === 0){
        console.log("killing stream.")
        streamMeta.splice(index, 1);
        voiceChannel.leave();
    }
    else{
        const stream = ytdl(streamMeta[index].youtubeLinks[0], {filter : 'audioonly'});
        const newDispatcher = connection.play(stream, streamOptions);
        streamMeta[index].dispatcherStream = newDispatcher;

        //callback functions
        newDispatcher.on("start", () => onStart(message, streamMeta[index].youtubeLinks[0]));
        newDispatcher.on("finish", end => onFinish(end, streamMeta, voiceChannel, message, connection, streamOptions));
    }
}