const webshot = require('webshot-node');
const botConfig = require('../config.json');

module.exports = {
    furiganaize: async function(message){
        //formatting for this message:
        //^furiganaize （僕＝ぼく）の（最弱＝さいきょう）を（以＝も）って、（君＝きみ）の（最強＝さいきょう）を（打＝う）ち（破＝やぶ）
        var prefix = botConfig.prefix + "furiganaize ";
        rawMessageContent = message.content.substring(prefix.length);
        //message.channel.send(rawMessageContent);

        //text parsing:
        var textObjects = [];
        var object = {
            rb: "",
            rt: ""
        }
        var rbWriting = false;
        var parenthesisFlag = false;
        var equalFlag = false;
        for(var i = 0; i < rawMessageContent.length; i++){
            if(rawMessageContent.charAt(i) === "(" || rawMessageContent.charAt(i) === "（"){
                if(object.rb !== ""){
                    textObjects.push({...object});
                    object.rb = "";
                    object.rt = "";
                }
                parenthesisFlag = true;
                rbWriting = true;
            }
            if(rawMessageContent.charAt(i) === "=" || rawMessageContent.charAt(i) === "＝"){
                equalFlag = true;
                rbWriting = false;
            }
            if(rawMessageContent.charAt(i) === ")" || rawMessageContent.charAt(i) === "）" ){
                rbWriting = true;
                parenthesisFlag = true;
                //Reset object
                textObjects.push({...object});
                object.rb = "";
                object.rt = "";
            }
            if(!parenthesisFlag && !equalFlag){
                if(rbWriting){
                    if(rawMessageContent.charAt(i) === "\n"){
                        console.log("linebreakrb!");
                        object.rb += "<br/>";
                    }
                    else{
                        object.rb += rawMessageContent.charAt(i);
                    }
                }
                else if(!rbWriting){
                    object.rt += rawMessageContent.charAt(i)
                }
            }

            parenthesisFlag = false;
            equalFlag = false;
        }
        if(object.rb !== ""){
            textObjects.push({...object});
        }
        
        var rbLength = 0;
        var rtLength = 0;
        var ruby = "<ruby>\n";

        //Following this format.
        /*
        <ruby>`+ 
            ruby +`<rp>(</rp><rt>` + rubyrt + `</rt><rp>)</rp>
        </ruby></br>
        <ruby>`+ 
            ruby +`<rp>(</rp><rt>` + rubyrt + `</rt><rp>)</rp>
        </ruby>
        */
        for(var i = 0; i < textObjects.length; i++){
            //message.channel.send("bottom: " + textObjects[i].rb + " top: " + textObjects[i].rt);
            ruby += textObjects[i].rb + "<rp>(</rp><rt>" + textObjects[i].rt + "</rt><rp>)</rp>\n"
            if(textObjects[i].rb.includes("<br/>")){
                ruby+= "</ruby><br/>\n<ruby>";
            }
            rbLength += textObjects[i].rb.length;
            rtLength += textObjects[i].rt.length;
        }

        ruby += "</ruby>"
        //calculate whether the maxwidth is exceeded
        var widthOp;
        var multiplier = 45;
        var maxWidth = 900;
        if(rbLength > rtLength){
            if(rbLength * multiplier > maxWidth){
                widthOp = maxWidth;
            }
            else {
                widthOp = rbLength * multiplier;
            }
        } else{
            if(rtLength * multiplier > maxWidth){
                widthOp = maxWidth;
            }
            else{
                widthOp = rtLength * multiplier;
            }
        }

        //gather up all options
        var options = {
            windowSize: {width: widthOp, height: 50},
            shotSize: {width: 'all', height: 'all'},
            quality: 100,
            streamType: 'png',
            siteType: 'html',
            defaultWhiteBackground: false
        };
        
        //message.channel.send(ruby);

        await setImg(ruby, options);        

        message.channel.send({files: ["./imgStore/furiganaImg.png"]}); 
    }
}

async function setImg(ruby, options){
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
                            `
                            + ruby +
                            `
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