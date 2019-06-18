const cheerio = require('cheerio');
const request = require('request');
const Discord = require('discord.js');
const cheerioTableparser = require('cheerio-tableparser');
module.exports = {
    name: 'poke',
    description: 'Parses Serebii.net',
    execute(message, args) {
        url = 'https://serebii.net/pokedex-sm/' + args[0] + '.shtml';
        request(url, (error, response, html) => {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(html);
                const body = $('body');
                var title = $("title").text();
                var name = title.split(" - ")[0];
                cheerioTableparser($);
                const dex = body.find($('.dextable'));
                const types = [];
                const type = body.find($('.cen')).find('img').each(function (i, elem) {
                    types[i] = $(this).attr('src');
                });
                var typesToPrint;
                var singletype = types[0].substring(types[0].lastIndexOf("/",types[0].lastIndexOf("."))).replace("/","").replace(".gif","");
                var secondtype = types[1].substring(types[1].lastIndexOf("/",types[1].lastIndexOf("."))).replace("/","").replace(".gif","");
                if(types[1].indexOf(".png") === -1){
                    typesToPrint = singletype[0].toLocaleUpperCase() + singletype.substring(1, singletype.length) + " / " + secondtype[0].toLocaleUpperCase() + secondtype.substring(1, secondtype.length);
                }
                else{
                    typesToPrint = singletype[0].toLocaleUpperCase() + singletype.substring(1, singletype.length);
                }
                if(singletype === secondtype){
                    typesToPrint = singletype[0].toLocaleUpperCase() + singletype.substring(1, singletype.length);
                }
                var elementColor;
                switch (types[0].substring(types[0].lastIndexOf("/",types[0].lastIndexOf("."))).replace("/","").replace(".gif","")) {
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
                const image = "https://serebii.net/" + body.find($('.dextab')).find('img').attr('src');
                const thumb = "https://pokemon-trainer.com/images/sprite/xyorasani/"+args[0]+".gif";
                const portrait = "https://serebii.net/sunmoon/pokemon/"+args[0]+".png";
                console.log(portrait);
                const data = $(dex).parsetable(true,true,true);
                for(var x in data[0]){
                    //console.log(x + " : " + data[0][x]);
                }
                var abilities;
                var dexnum = data[1][7];
                var classification = "";
                var stats = [];
                var weak = [];
                var strong = [];
                var immune = [];
                var bst = 0;
                var statAdded = false;
                var typesAdded = false;
                for(var z = 0; z < 18; z ++){
                    statAdded = false;
                    typesAdded = false;
                    for(var v = 0; v < data[0].length; v++){
                        if(!statAdded && (z > 1 && z < 8) && data[z][v] === "Stats"){
                            //console.log("(" + z + "," + v+2 + ") : " + data[z][v+2]);
                            var temp = data[z][parseInt(v)+2];
                            stats.push(temp);
                            bst += parseInt(temp);
                            statAdded = true;
                        }
                        if(data[z][v] === "Classification"){
                            classification = data[z][v+1];
                            abilities = data[z][v+2];
                        }
                        if(!typesAdded && data[z][v] === "Damage Taken"){
                            var temper = data[z][v+2];
                            if(temper === "*0.5"){
                                strong.push(idToType(z));
                                typesAdded = true;
                            }
                            if(temper === "*2"){
                                weak.push(idToType(z));
                                typesAdded = true;
                            }
                            if(temper === "*4"){
                                weak.push("**" + idToType(z) + "**");
                                typesAdded = true;
                            }
                            if(temper === "*0"){
                                immune.push(idToType(z));
                                typesAdded = true;
                            }
                        }
                    }
                }
                //console.log(abilities)
                var ability = abilities.split(": ");
                if(!weak.length){
                    weak.push("None");
                }
                if(!strong.length){
                    strong.push("None");
                }
                if(!immune.length){
                    immune.push("None");
                }
                /*
                console.log(dexnum + ": " + name + " the " + classification + "\n" +
                            "weak to: " + weak.join(", ") +"\n"+
                            "resists: " + strong.join(", ") +"\n"+
                            "immune: " + immune.join(", ") +"\n"+
                            "HP " + stats[0] +"\n"+
                            "ATK " + stats[1] +"\n"+
                            "DEF " + stats[2] +"\n"+
                            "SPATK " + stats[3] +"\n"+
                            "SPDEF " + stats[4] +"\n"+
                            "SPD " + stats[5] +"\n");
                */
                const embed = new Discord.RichEmbed()
                    .setColor(elementColor)
                    .setAuthor(dexnum + ": " + name + " the " + classification + "  |  " + typesToPrint, image)
                    .setImage(portrait)
                    //.setThumbnail(thumb)
                    .addField("Abilities:",ability[1].replace(" - ", ", "))
                    .addField("Weak to:",weak.join(", "))
                    .addField("Resists:",strong.join(", "))
                    .addField("Immune to:",immune.join(", "))
                    .addField("HP",stats[0],true)
                    .addField("ATK",stats[1],true)
                    .addField("DEF",stats[2],true)
                    .addField("SPATK",stats[3],true)
                    .addField("SPDEF",stats[4],true)
                    .addField("SPD",stats[5],true)
                    .setFooter("Powered by Serebii.net","https://www.serebii.net/pokedex-sm/icon/251.png");
                message.channel.send({embed})
            }
        });
    }
};
function idToType(id) {
    switch (id) {
        case 0: return "Normal";
        case 1: return "Fire";
        case 2: return "Water";
        case 3: return "Electric";
        case 4: return "Grass";
        case 5: return "Ice";
        case 6: return "Fighting";
        case 7: return "Poison";
        case 8: return "Ground";
        case 9: return "Flying";
        case 10: return "Psychic";
        case 11: return "Bug";
        case 12: return "Rock";
        case 13: return "Ghost";
        case 14: return "Dragon";
        case 15: return "Dark";
        case 16: return "Steel";
        case 17: return "Fairy";
    }
}