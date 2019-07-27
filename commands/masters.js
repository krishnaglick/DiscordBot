const cheerio = require('cheerio');
const request = require('request');
const Discord = require('discord.js');
const cheerioTableparser = require('cheerio-tableparser');
module.exports = {
    name: 'pm',
    description: 'Masters',
    execute(message, args) {
        console.log("PKMAS || " + message.author.username + " has requested " + args.join(" "));
        url = 'https://www.serebii.net/pokemonmasters/syncpairs/' + args[0] + '.shtml';
        request(url, (error, response, html) => {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(html);
                cheerioTableparser($);
                const body = $('body');
                const general = body.find($('.tab'));
                const data = $(general).parsetable(true,true,true);
                var name = data[0];
                var trainerImage = "https://www.serebii.net/pokemonmasters/syncpairs/" + general.find('img').attr('src');
                const pokeInfo = body.find($('.cen'));
                const pokeData = $(pokeInfo).parsetable(true,true,true);
                var typeImage = "https://www.serebii.net/" + pokeInfo.find('img').attr('src');
                //
                //code block to handle getting and formatting the unit passives
                //
                var passives = name[14];
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
                //
                //code block to handle getting move and sync move information
                //
                var isFirstNameElem = true;
                var isSync = true;
                var moves = [[],[],[],[]];
                var sync = [];
                for(x in name){
                    var index = parseInt(x);
                    if(name[x] === "Name" && isFirstNameElem){
                        var count = 1;
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
                    else if(name[x] === "Name" && isSync){
                        sync.push("**" + name[parseInt(x) + 1] + "**");
                        sync.push("Power: " + data[3][index + 1] + " **|** " + "Target: " + data[4][index + 1]);
                        sync.push(data[3][index + 2]);
                        isSync = false;
                    }
                }
                var movesOut = "";
                for(x in moves){
                    var movesTemp = moves[x].join("\n") + "\n";
                    movesOut = movesOut + movesTemp;
                }
                var syncOut = sync.join("\n");
                //
                //Stat initializers
                //
                var HP = data[0][17];
                var ATK = data[1][17];
                var DEF = data[2][17];
                var SPATK = data[3][17];
                var SPDEF = data[4][17];
                var SPD = data[5][17];
                /*
                var debugindex = 1;
                for(x in data[debugindex]) {
                    console.log(x + " : " + data[debugindex][x]);
                }
                console.log(moves);
                console.log(sync);
                */
                //
                //
                //
                const embed = new Discord.RichEmbed()
                    .setAuthor(data[1][5])
                    .setImage(trainerImage)
                    .setThumbnail(typeImage)
                    //.addField("Weakness","")
                    .addField("HP",HP,true)
                    .addField("ATK",ATK,true)
                    .addField("DEF",DEF,true)
                    .addField("SPATK",SPATK,true)
                    .addField("SPDEF",SPDEF,true)
                    .addField("SPD",SPD,true)
                    .addField("Passives", passives)
                    .addField("Moves", movesOut)
                    .addField("Sync Move", syncOut)
                    .setColor(getColor(typeImage))
                    .setFooter("Stats reflect their values at level 100 (UNDER CONSTRUCTION)");
                message.channel.send({embed})
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