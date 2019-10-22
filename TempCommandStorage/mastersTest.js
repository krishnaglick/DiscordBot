const Units = require("commands/embedbuilders/helpers/data/PKMSUnits");
const Moves = require("commands/embedbuilders/helpers/data/PKMSMoves");
const Passives = require("commands/embedbuilders/helpers/data/PKMSPassives");
const units = Units.Units;
const moves = Moves.Moves;
const passives = Passives.Passives;
const Discord = require('discord.js');
const paginationEmbed = require('discord.js-pagination');
module.exports = {
    name: 'adgshsth',
    description: 'whatever you want',
    execute(message, args) {
        var searchName = args[0].toLowerCase();
        var unit = [];
        for(var x in units){
            if(units[x].title.Trainer.toLowerCase() === searchName){
                unit.push(units[x].title);
            }
        }
        unit.sort((a,b)=>{
            if(a.EvolutionStage > b.EvolutionStage){
                return 1;
            }else{
                return -1;
            }
        });
        var embeds = unit.map((unit)=>objToEmbed(unit));
        paginationEmbed(message, embeds, ['⏪', '⏩'], 60000);
    },
};

function getColor(type){
    var elementColor;
    switch (type.toLowerCase()) {
        case 'normal':
            elementColor = "#ffffff"; break;
        case 'fire':
            elementColor = "#ff0000"; break;
        case 'water':
            elementColor = "#4286f4"; break;
        case 'electric':
            elementColor = "#fffa00"; break;
        case 'grass':
            elementColor = "#1daf0f"; break;
        case 'ice':
            elementColor = "#00ffe5"; break;
        case 'fighting':
            elementColor = "#7a3b3b"; break;
        case 'poison':
            elementColor = "#9a06aa"; break;
        case 'ground':
            elementColor = "#351818"; break;
        case 'flying':
            elementColor = "#a2c1c1"; break;
        case 'psychic':
            elementColor = "#b56cab"; break;
        case 'bug':
            elementColor = "#87c69f"; break;
        case 'rock':
            elementColor = "#9e7356"; break;
        case 'ghost':
            elementColor = "#65558c"; break;
        case 'dragon':
            elementColor = "#00487f"; break;
        case 'dark':
            elementColor = "#23021e"; break;
        case 'steel':
            elementColor = "#6b6b6b"; break;
        case 'fairy':
            elementColor = "#ffb7d7"; break;
    }
    return elementColor;
}

function objToEmbed(unit){
    var embed;
    var movesOut = getMoves([unit.Move1, unit.Move2, unit.Move3, unit.Move4]);
    var passivesOut = getPassives([unit.Passive1, unit.Passive2, unit.Passive3]);
    var syncOut = getSync(unit.SyncMove);
    var type;
    if(unit.Type2 !== ""){
        type = unit.Type2.toLowerCase()
    }else{
        type = unit.Type.toLowerCase()
    }
    embed = new Discord.RichEmbed()
        .setAuthor(unit.Trainer + " & " + unit.Name)
        .setImage('https://www.serebii.net/pokemonmasters/syncpairs/' + unit.Trainer.toLowerCase() + '.png')
        .setThumbnail('https://www.serebii.net/pokedex-bw/type/' + type + '.gif')
        .addField("Weakness", unit.Weakness)
        .addField("HP", unit.MaxHP,true)
        .addField("ATK", unit.MaxAttack,true)
        .addField("DEF", unit.MaxDefense,true)
        .addField("SPATK", unit.MaxSpAtk,true)
        .addField("SPDEF", unit.MaxSpDef,true)
        .addField("SPD", unit.MaxSpeed,true)
        .addField("---Passives---", passivesOut)
        .addField("---Moves---", movesOut)
        .addField("---Sync Move---", syncOut)
        .setColor(getColor(type))
        .setFooter("Stats reflect their values at max level (UNDER CONSTRUCTION)");
    return embed;
}

function getMoves(unitMoveArr){
    var movesList = [];
    for(var x in unitMoveArr){
        for(var y in moves){
            if(unitMoveArr[x] === moves[y].title.Name){
                var move = moves[y].title;
                movesList.push(generateMoveOut(move));
            }
        }
    }
    return movesList.join("\n");
}

function getPassives(unitPassiveArr){
    var passiveList = [];
    for(var x in unitPassiveArr){
        for(var y in passives){
            if(unitPassiveArr[x] === passives[y].title.Name){
                var passive = passives[y].title;
                var passiveOut = '**' + passive.Name + ':** ' + passive.Description + '\n';
                passiveList.push(passiveOut);
            }
        }
    }
    return passiveList;
}

function getSync(sync){
    var syncOut = "";
    for(var x in moves){
        if(moves[x].title.IsSyncMove === "1"){
            if(sync === moves[x].title.Name){
                var move = moves[x].title;
                syncOut = generateMoveOut(move);
            }
        }
    }
    return syncOut;
}

function generateMoveOut(move){
    var isTrainerMove = false;
    var moveOut = "**" + move.Name + "**\n";
    if(move.UsageLimit !== ""){
        moveOut += "Uses: " + move.UsageLimit + " | ";
        isTrainerMove = true;
    }else if(move.MoveGaugeCost !== ""){
        moveOut += "Cost: " + move.MoveGaugeCost + " | ";
    }
    if(move.Type !== ""){
        moveOut += 'Type: ' + move.Type + ' | ';
    }
    moveOut += 'Category: ' + move.Category + ' | Target: ' + move.Target + '\n';
    if(!isTrainerMove){
        moveOut += 'Power: ' + move.MaxPower;
        if(move.Accuracy !== ""){
            moveOut += ' | Accuracy: ' + move.Accuracy;
        }
        if(move.EffectTag !== ""){
            moveOut += ' | Effect: ' + move.EffectTag + '\n';
        }else{
            moveOut += '\n';
        }
    }
    moveOut += move.Description;
    return moveOut;
}

