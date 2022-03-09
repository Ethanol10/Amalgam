module.exports = {
    calculator: function(message, messageContent){
        var messageSplit = messageContent.split(" ");
        var validChar = "+-/*^%";
        var result;
        console.log("calculator function called!");
        
        if(isNaN(messageSplit[1]) || isNaN(messageSplit[3])){
            message.channel.send("Invalid number in argument 1 or 3");
            console.log("Invalid Num in argument 1/3");
            return;
        }

        switch(messageSplit[2]){
            case "+":
                result = additionFunc(messageSplit[1], messageSplit[3]);
                break;
            case "-":
                result = subtractFunc(messageSplit[1], messageSplit[3]);
                break;
            case "*":
                result = multiplyFunc(messageSplit[1], messageSplit[3]);
                break;
            case "/":
                result = divisionFunc(messageSplit[1], messageSplit[3]);
                break;
            case "^":
                result = powerToFunc(messageSplit[1], messageSplit[3]);
                break;
            case "%":
                result = moduloFunc(messageSplit[1], messageSplit[3]);
                break;
            default:
                message.channel.send("Invalid operand in argument 2");
                console.log("Invalid operand in argument 2");
                break;
        }
        message.channel.send(result + "");
    }
}

function additionFunc(num1, num2){
	return Number(num1) + Number(num2);
}

function subtractFunc(num1, num2){
	return Number(num1) - Number(num2);
}

function multiplyFunc(num1, num2){
	return Number(num1) * Number(num2);
}

function divisionFunc(num1, num2){
	return Number(num1) / Number(num2);
}

function powerToFunc(num1, power){
	return Math.pow(Number(num1), Number(power));
}

function moduloFunc(num1, num2){
	return Number(num1) % Number(num2);
}