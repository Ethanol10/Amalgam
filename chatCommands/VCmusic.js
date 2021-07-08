const ytdl = require('ytdl-core');

module.exports = {
    play: function(message, ytLink, streamMeta){
        const streamOptions = {
            seek: 0,
            volume: 1
        };
        var voiceChannel = message.member.voice.channel;
        if(!voiceChannel){
            message.channel.send("You must be in a channel to play music!");
            return;
        }
        //check if something is already playing in the guild. if there is nothing, setup a new dispatcher.
        
        
        //check the contents of messageContent, if not a valid link, give up here.


        //Setup for dispatcher to the Voice channel that the user is in.
        message.channel.send("Initiating music stream for " + "@" + message.member.user.username)
        if(message.guild.me.voice.channel !== message.member.voice.channel){
            message.channel.send("Joining: " + "<#" + voiceChannel + ">");
        }

        //Join the vc, then play audio
        playAudio(message, voiceChannel, ytLink, streamOptions, streamMeta);
    },
    //pause the current stream in the same voice channel that the user is initiating the command.
    pause: function(message, streamMeta){
        var voiceChannel = message.member.voice.channel;
        if(!voiceChannel){
            message.channel.send("You aren't in a voice channel!");
            return;
        }

        //Search the array for the right dispatcher.
        var index = getMetadataIndex(streamMeta, voiceChannel);
        if(index !== -1){
            streamMeta[index].dispatcherStream.pause();
            streamMeta[index].pause = true;
        }
        else{
            message.channel.send("There's nothing to pause right now");
        }
    }
}

function getMetadataIndex(streamMeta, voiceChannel){
    for(var i = 0; i < streamMeta.length; i++){
        if(streamMeta[i].vc === voiceChannel){
            return i;
        }
        return -1;
    }
}

function playAudio(message, voiceChannel, ytLink, streamOptions, streamMeta){
    voiceChannel.join()
        .then(connection => {
            console.log("joined: " + voiceChannel);
            const stream = ytdl(ytLink, { filter: 'audioonly'});
            const dispatcher = connection.play(stream, streamOptions);

            //Events on start and finish of audio playback.
            dispatcher.on("start", () => {
                console.log("playing " + ytLink);
                message.channel.send("Now Playing: " + ytLink);
            });
            dispatcher.on("finish", 
                end => {
                    console.log("Audio ended, leave channel.");
                    voiceChannel.leave();
                    var index = getMetadataIndex(streamMeta, voiceChannel);
                    streamMeta.splice(index, 1);
                });
            
            //write metadata to global array
            var streamMetadata = {
                dispatcherStream: dispatcher,
                youtubeLink: ytLink,
                vc: voiceChannel,
                guild: message.guild,
                pause: false
            }
            streamMeta.push(streamMetadata);
        })
        .catch(err => console.log("Something went wrong: " + err));
}