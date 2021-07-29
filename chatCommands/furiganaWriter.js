const webshot = require('webshot-node');
const botConfig = require('../config.json');

module.exports = {
    furiganaize: async function(message){
        //formatting for this message:
        //$furiganaize (bottom text){top text}(bottom text){top text} 

        rawMessageContent = message.content.substring(botConfig.prefix + "furiganaize ");

        //text parsing:
        //check for a bracket, pool all rb text into rb field, then end on last bracket.
        //check for a curlybrace, pool all rt text into an rt field, then end on last curlybrace.
        var textObjects = [];
        var object = {
            rb: "",
            rt: ""
        }
        var rbWriting = false;
        var rtWriting = false;
        for(var i = 0; i < rawMessageContent.length; i++){
            if(rawMessageContent.charAt(i) === "(" || rawMessageContent.charAt(i) === "（" ){
                rbWriting = true;
                i++;
            }
            if(rawMessageContent.charAt(i) === ")" || rawMessageContent.charAt(i) === "）" ){
                rbWriting = false;
                i++
            }


            if(converting){
                if(!rbDone){
                    rb += rawMessageContent.charAt(i);
                }
                else{
                    rt += rawMessageContent.charAt(i);
                }
            }
        }
        
        console.log("rb: " + rb);
        console.log("rt: " + rt);

        var options = {
            windowSize: {width: (rb.length > rt.length) ? rb.length * 40 : rt.length * 40, height: 50},
            shotSize: {width: 'all', height: 'all'},
            quality: 100,
            streamType: 'png',
            siteType: 'html',
            defaultWhiteBackground: false
        };

        await setImg(rb, rt, options);        

        message.channel.send({files: ["./imgStore/furiganaImg.png"]}); 
    }
}

async function setImg(ruby, rubyrt, options){
    return new Promise( (resolve, reject) => {
        webshot(
            `<html>
                <style>
                    ruby{
                        font-size: 3em;
                        color: white; 
                    }
                </style>
                <head></head>
                <body>
                    <text>
                        <div id="container">
                            <ruby>`+ 
                                ruby +`<rp>(</rp><rt>` + rubyrt + `</rt><rp>)</rp>
                            </ruby>
                        </div>
                    </text>
                </body>
            </html>`, "./imgStore/furiganaImg.png", options, 
            function(err){
                console.log(err);
                (!err) ? resolve() : reject(err);
            })
    });
}