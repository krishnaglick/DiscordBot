const cheerio = require('cheerio');
const request = require('request');
const Discord = require('discord.js');
const cheerioTableparser = require('cheerio-tableparser');
const paginationEmbed = require('discord.js-pagination');
module.exports = {
    name: 'pm',
    description: 'Masters',
    execute(message, args) {
        console.log("PKMAS || " + message.author.username + " has requested " + args.join(" "));
        var url = 'https://www.serebii.net/pokemonmasters/syncpairs/' + args[0].toLowerCase() + '.shtml';
        request(url, (error, response, html) => {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(html);
                cheerioTableparser($);
                const body = $('body');
                const general = body.find($('.tab'));
                const data = $(general).parsetable(true,true,true);
                var name = data[0];
                var isSygna = false;
                if(name[33] && name[32]){
                    if(name[33].includes("Sygna") || name[32].includes("Sygna")){
                        isSygna = true;
                    }if(name[33].includes("Mega") || name[32].includes("Mega")){
                        isSygna = true;
                    }
                }
                var trainerImage = "https://www.serebii.net/pokemonmasters/syncpairs/" + general.find('img').attr('src');
                const pokeInfo = body.find($('.cen'));
                const pokeData = $(pokeInfo).parsetable(true,true,true);
                var typeImage = "https://www.serebii.net/" + pokeInfo.find('img').attr('src');
                //
                //code block to handle getting and formatting the unit passives
                //
                var passiveIndexes = findPassiveIndex(name);
                var passivesOut = [];
                for(var j in passiveIndexes){
                    var passives = name[passiveIndexes[j]];
                    var re = /[^A-Z\s]([A-Z])[^A-Z\s]/g;
                    while ((match = re.exec(passives)) !== null) {
                        passives = passives.substring(0,match.index+1) + "\n" + passives.substring(match.index+1,passives.length+1);
                    }
                    var passivearray = passives.split("\n");
                    for(x in passivearray){
                        var temper = passivearray[x].split(":");
                        passivearray[x] = "**" + temper[0] + ":**" + temper[1];
                    }
                    passives = passivearray.join("\n");
                    passivesOut.push(passives);
                }

                //
                //code block to handle getting move and sync move information
                //
                var isFirstNameElem = true;
                var isSecondNameElem = false;
                var isThirdNameElem = false;
                var moves = [[],[],[],[]];
                var moves2 = [[],[],[],[]];
                var moves3 = [[],[],[],[]];
                for(var x in name){
                    var count;
                    var index;
                    if(name[x] === "Name" && isFirstNameElem && name[parseInt(x)-1] !== "Sync Moves" && name[x]){
                        count = 1;
                        index = parseInt(x);
                        for(var i = 0; i < moves.length; i++){
                            moves[i].push("**" + name[index + count] + ":**");
                            if(data[3][index + count]){
                                moves[i].push("Power: " + data[3][index + count] + " **|** " + "Accuracy: " + data[4][index + count] + " **|** " + "Cost: " + data[5][index + count] + " **|** " + "Target: " + data[6][index + count]);
                            }else if(data[5][index + count]){
                                moves[i].push("Cost: " + data[5][index + count] + " **|** " + "Target: " + data[6][index + count]);
                            }else if(data[5][index + count] === ""){
                                moves[i].push("Target: " + data[6][index + count]);
                            }
                            moves[i].push(data[1][index + count + 1]);
                            count = count + 2;
                        }
                        isFirstNameElem = false;
                    }
                    if(name[x] === "Name" && isSecondNameElem && name[parseInt(x)-1] !== "Sync Moves" && name[x]) {
                        count = 1;
                        index = parseInt(x);
                        for(i = 0; i < moves.length; i++){
                            moves2[i].push("**" + name[index + count] + ":**");
                            if(data[3][index + count]){
                                moves2[i].push("Power: " + data[3][index + count] + " **|** " + "Accuracy: " + data[4][index + count] + " **|** " + "Cost: " + data[5][index + count] + " **|** " + "Target: " + data[6][index + count]);
                            }else if(data[5][index + count]){
                                moves2[i].push("Cost: " + data[5][index + count] + " **|** " + "Target: " + data[6][index + count]);
                            }else if(data[5][index + count] === ""){
                                moves2[i].push("Target: " + data[6][index + count]);
                            }
                            moves2[i].push(data[1][index + count + 1]);
                            count = count + 2;
                        }
                        isSecondNameElem = false;
                    }
                    if(name[x] === "Name" && isThirdNameElem && name[parseInt(x)-1] !== "Sync Moves" && name[x]) {
                        count = 1;
                        index = parseInt(x);
                        for(i = 0; i < moves.length; i++){
                            moves3[i].push("**" + name[index + count] + ":**");
                            if(data[3][index + count]){
                                moves3[i].push("Power: " + data[3][index + count] + " **|** " + "Accuracy: " + data[4][index + count] + " **|** " + "Cost: " + data[5][index + count] + " **|** " + "Target: " + data[6][index + count]);
                            }else if(data[5][index + count]){
                                moves3[i].push("Cost: " + data[5][index + count] + " **|** " + "Target: " + data[6][index + count]);
                            }else if(data[5][index + count] === ""){
                                moves3[i].push("Target: " + data[6][index + count]);
                            }
                            moves3[i].push(data[1][index + count + 1]);
                            count = count + 2;
                        }
                        isThirdNameElem = false;
                    }
                    if(!isFirstNameElem){
                        isSecondNameElem = true;
                        if(!isFirstNameElem && !isSecondNameElem){
                            isThirdNameElem = true;
                            if(!isFirstNameElem && !isSecondNameElem && !isThirdNameElem){
                               //eventual 4th case
                            }
                        }
                    }
                }
                var movesOut = "";
                for(x in moves){
                    var movesTemp = moves[x].join("\n") + "\n";
                    movesOut = movesOut + movesTemp;
                }
                var movesOut2 = "";
                for(x in moves2){
                    var movesTemp2 = moves2[x].join("\n") + "\n";
                    movesOut2 = movesOut2 + movesTemp2;
                }
                var movesOut3 = "";
                for(x in moves3){
                    var movesTemp3 = moves3[x].join("\n") + "\n";
                    movesOut3 = movesOut3 + movesTemp3;
                }

                if(!isSygna){
                    movesOut2 = movesOut;
                    movesOut3 = movesOut;
                }

                var sync = [];
                var syncOut;
                var syncLocations = [];
                var sync1 = [];
                var syncOut1;
                var sync2 = [];
                var syncOut2;
                for(x in name){
                    if(name[x] === "Sync Moves"){
                        syncLocations.push(parseInt(x)+2);
                    }
                }
                sync.push("**" + name[syncLocations[0] + 1] + "**");
                sync.push("Power: " + data[3][syncLocations[0]] + " **|** " + "Target: " + data[4][syncLocations[0]]);
                sync.push(data[3][syncLocations[0] + 1]);
                syncOut = sync.join("\n");
                sync1.push("**" + name[syncLocations[1] + 1] + "**");
                sync1.push("Power: " + data[3][syncLocations[1]] + " **|** " + "Target: " + data[4][syncLocations[1]]);
                sync1.push(data[3][syncLocations[1] + 1]);
                syncOut1 = sync1.join("\n");
                //console.log(sync1);
                sync2.push("**" + name[syncLocations[2] + 1] + "**");
                sync2.push("Power: " + data[3][syncLocations[2]] + " **|** " + "Target: " + data[4][syncLocations[2]]);
                sync2.push(data[3][syncLocations[2] + 1]);
                syncOut2 = sync2.join("\n");
                //console.log(sync2);
                //console.log(movesOut1);
                /*
                var debugindex = 0;
                for(var x in data[debugindex]) {
                    console.log(x + " : " + data[debugindex][x]);
                }
                */
                var namesArr = [];
                if(name[6] !== "Picture"){
                    namesArr.push(name[6]);
                    namesArr.push(name[33]);
                    namesArr.push(name[60]);
                }
                else{
                    namesArr.push(name[5]);
                    namesArr.push(name[32]);
                    namesArr.push(name[59]);
                }
                //
                //Get Stats
                //
                var HP = buildStatArray("HP", data[0]);
                var ATK = buildStatArray("Attack", data[1]);
                var DEF = buildStatArray("Defense", data[2]);
                var SPATK = buildStatArray("Sp. Atk", data[3]);
                var SPDEF = buildStatArray("Sp. Def", data[4]);
                var SPD = buildStatArray("Speed", data[5]);
                try{
                    var embed; var embed2; var embed3;
                    try{
                         embed = new Discord.RichEmbed()
                            .setAuthor(namesArr[0])
                            .setImage(trainerImage)
                            .setThumbnail(typeImage)
                            //.addField("Weakness","")
                            .addField("HP",HP[0],true)
                            .addField("ATK",ATK[0],true)
                            .addField("DEF",DEF[0],true)
                            .addField("SPATK",SPATK[0],true)
                            .addField("SPDEF",SPDEF[0],true)
                            .addField("SPD",SPD[0],true)
                            .addField("---Passives---", passivesOut[0])
                            .addField("---Moves---", movesOut)
                            .addField("---Sync Move---", syncOut)
                            .setColor(getColor(typeImage))
                            .setFooter("Stats reflect their values at max level (UNDER CONSTRUCTION)");
                    }catch (e) {

                    }
                    try{
                        embed2 = new Discord.RichEmbed()
                            .setAuthor(namesArr[1])
                            .setImage(trainerImage)
                            .setThumbnail(typeImage)
                            //.addField("Weakness","")
                            .addField("HP",HP[1],true)
                            .addField("ATK",ATK[1],true)
                            .addField("DEF",DEF[1],true)
                            .addField("SPATK",SPATK[1],true)
                            .addField("SPDEF",SPDEF[1],true)
                            .addField("SPD",SPD[1],true)
                            .addField("---Passives---", passivesOut[1])
                            .addField("---Moves---", movesOut2)
                            .addField("---Sync Move---", syncOut1)
                            .setColor(getColor(typeImage))
                            .setFooter("Stats reflect their values at max level (UNDER CONSTRUCTION)");
                    }catch (e) {

                    }
                    try{
                        embed3 = new Discord.RichEmbed()
                            .setAuthor(namesArr[2])
                            .setImage(trainerImage)
                            .setThumbnail(typeImage)
                            //.addField("Weakness","")
                            .addField("HP",HP[2],true)
                            .addField("ATK",ATK[2],true)
                            .addField("DEF",DEF[2],true)
                            .addField("SPATK",SPATK[2],true)
                            .addField("SPDEF",SPDEF[2],true)
                            .addField("SPD",SPD[2],true)
                            .addField("---Passives---", passivesOut[2])
                            .addField("---Moves---", movesOut3)
                            .addField("---Sync Move---", syncOut2)
                            .setColor(getColor(typeImage))
                            .setFooter("Stats reflect their values at max level (UNDER CONSTRUCTION)");
                    }catch (e) {

                    }
                    var pages = [];
                    if(sync2[0] !== "**undefined**"){
                        pages = [
                            embed,
                            embed2,
                            embed3
                        ];
                        paginationEmbed(message, pages, ['⏪', '⏩'], 60000);
                    }else if(sync1[0] !== "**undefined**"){
                        pages = [
                            embed,
                            embed2,
                        ];
                        paginationEmbed(message, pages, ['⏪', '⏩'], 60000);
                    }else{
                        message.channel.send({embed});
                    }
                }catch (e) {
                    message.channel.send(`Sorry ${message.author.username}, but that trainer isn't in the game yet.`)
                }
            }
        })
    },
};
function getColor(type){
    var elementColor;
    switch (type.substring(type.lastIndexOf("/",type.lastIndexOf("."))).replace("/","").replace(".gif","")) {
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
function buildStatArray(stat, data){
    var stats = [];
    for(var x in data){
        if(data[x] === stat){
            stats.push(data[parseInt(x)+1]);
        }
    }
    return stats;
}
function findPassiveIndex(data){
    var passiveIndexes = [];
    for(var x in data){
        if(data[x] === "Passive Skills"){
            passiveIndexes.push(parseInt(x) + 1);
        }
    }
    return passiveIndexes;
}
