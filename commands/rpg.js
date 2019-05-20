module.exports = {
    name: 'rpg',
    description: 'Conduct an RPG battle',
    execute(message, args) {
        var comb1 = [args[0],args[1],args[2]];
        var comb2 = [args[3],args[4],args[5]];
        battle(comb1[0],comb2[0],comb1[1],comb1[2],comb2[1],comb2[2],100,100,message,1);
    },
};
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
        battle(defender,attacker, defATK, defDEF, atkATK, atkDEF, (defHP - (atkATK - defDEF)), atkHP, message, turnCount+1);
    }
}