const Discord = require('discord.js');
module.exports = {
    name: 'rpg',
    description: 'Conduct an RPG battle',
    execute(message, args) {
        /*
        if(args[0] === "?"){
            message.channel.send("Syntax is: >rpg player1name player1ATK player1DEF player2Name player2ATK player2DEF");
            return;
        }
        var comb1 = [args[0],args[1],args[2]];
        var comb2 = [args[3],args[4],args[5]];
        battle(comb1[0],comb2[0],comb1[1],comb1[2],comb2[1],comb2[2],100,100,message,1);
    },*/
        var p1HPnum = 5;
        var p2HPnum = 9;
        var p1HP = "";
        var p2HP = "";
        var consoleLog = "                  ";
        for(var i = 0; i < 12; i++){
            if(i < p1HPnum){
                p1HP += "|";
            }
            else{
                p1HP += "-"
            }
            if(i < p2HPnum){
                p2HP += "|";
            }
            else{
                p2HP += "-"
            }
        }
        const embed = new Discord.RichEmbed()
            .addField("----------------turnx------------------", "```" +
                "╔════════════╦═════╗\n" +
                "║" + p1HP + "║ p1  ║\n" +
                "╚════════════╩═════╝"+
                "\n"+
                "╔═════╦════════════╗\n" +
                "║ p2  ║" + p2HP + "║\n" +
                "╚═════╩════════════╝"+
                "\n"+
                "╔══════════════════╗\n" +
                "║                  ║\n" +
                "╚══════════════════╝" +
                "```");
        message.channel.send({embed});
    },
};
/*
function battle(attacker, defender, atkATK, atkDEF, defATK, defDEF, atkHP, defHP, message, turnCount) {
    var damageDone;
    if(atkATK < defDEF){
        damageDone = 0;
    }else{
        damageDone = atkATK - defDEF;
    }
    var turnLabel = "===== " + turnCount + " =====";
    var hpdisp = attacker + ": " + atkHP + " || " + defender + ": " + defHP;
    var attackText = attacker + " attacks " + defender + " dealing " + (atkATK - defDEF) + " damage!";
    var resultText = defender + " now has " + (defHP - (atkATK - defDEF)) + " HP!";
    var turnEndText;
    if((defHP - (atkATK - defDEF)) <= 0){
        turnEndText = defender + " has lost! " + attacker + " has won!";
        return;
    }
    else{
        turnEndText = "Now it's " + defender +"\'s turn";
        message.channel.send(turnLabel +"\n"+ hpdisp +"\n"+ attackText +"\n"+ resultText +"\n"+ turnEndText);
        if(turnCount === 50){return;}
        battle(defender,attacker, defATK, defDEF, atkATK, atkDEF, (defHP - (atkATK - defDEF)), atkHP, message, turnCount+1);
    }
}*/