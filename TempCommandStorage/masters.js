const fetch = require("node-fetch");
const UnitUrl = 'https://pokemonmasters.miraheze.org/w/api.php?action=cargoquery&format=json&limit=500&tables=SyncPairsInfo&fields=TrainerName,Rarity,Obtain,PokemonName,Description,HpLevel1,HpLevelMax,AtkLevel1,AtkLevelMax,DefLevel1,DefLevelMax,SpAtkLevel1,SpAtkLevelMax,SpDefLevel1,SpDefLevelMax,SpeedLevel1,SpeedLevelMax,SPType,WeakType,Role,Move1,Move2,Move3,Move4,SyncMove,Passive1,Passive2,Passive3';
const MoveUrl = 'https://pokemonmasters.miraheze.org/w/api.php?action=cargoquery&format=json&limit=500&tables=MovesTable&fields=Name,Description,Category,User,MoveGroup,Type,Target,MoveGaugeCost,Power,MaxPower,Accuracy,UsageLimit';
const PassiveUrl = 'https://pokemonmasters.miraheze.org/w/api.php?action=cargoquery&format=json&limit=500&tables=Passives&fields=Name,Description';
const iconUrl = 'https://gamepress.gg/sites/default/files/aggregatedjson/TrainersList.json?15813222081239323912';
const bannerUrl = 'https://gamepress.gg/sites/default/files/aggregatedjson/PMGachSimEvents.json?907868779725397746';
const Discord = require('discord.js');
const AsciiTable = require('ascii-table');
const paginationEmbed = require('discord.js-pagination');
module.exports = {
    name: 'pm',
    display: 'Pokemon Masters',
    description: '`>pm summon [OPTIONAL - banner featured unit name]` will simulate a 10-summon on the latest Masters banner. ' + '\n' + '`>pm [character]` will return information on any character in Masters.',
    execute(message, args, client) {
        try {
            switch (args[0].toLowerCase()) {
                case "scouts":
                    checkBanners(message, args, client);
                    break;
                case "compare":
                    compare(message, args, client);
                    break;
                case "summon":
                    console.log("PKMAS || " + message.author.username + " has summoned.");
                    summonSim(message, args, client, 1, 3000, message.author.id, 0, 0, 0, 0, [], []);
                    break;
                default:
                    console.log("PKMAS || " + message.author.username + " has requested " + args.join(" "));
                    getUnit(message, args.join(" "), client);
            }
        } catch (e) {
            message.channel.send('<@!115270563349528579>, help this guy out please...')
        }
    },
};

async function checkBanners(message, args, client) {
    var banners = await fetch(bannerUrl)
        .then(response => response.json())
        .then(bannerJson => banners = bannerJson);
    var out = banners.map((banner) => {
        if (banner.featured_units !== "") {
            return "**" + banner.title + ":** featuring " + banner.featured_units.replace('&amp;', '&')
        } else {
            return ""
        }
    });
    for (var i = out.length - 1; i--;) {
        if (out[i] === '') out.splice(i, 1);
    }
    var count = 0;
    var trueOut = out.map((elem) => {
        count++;
        return (elem)
    });
    var embed = new Discord.RichEmbed().addField('Banners', trueOut.join("\n")).setColor("#ffdf43");
    message.channel.send({embed});
}

async function compare(message, args, client) {
    if (args.length !== 3) {
        message.channel.send("Try again with two pokemon.");
    } else {
        try {
            var units;
            var pokemon = [];
            await fetch(UnitUrl)
                .then(response => response.json())
                .then(trainers => units = trainers.cargoquery);
            if (units) {
                for (var unit of units) {
                    if (unit.title.PokemonName.toUpperCase() === args[1].toUpperCase() || unit.title.PokemonName.toUpperCase() === args[2].toUpperCase()) {
                        pokemon.push(unit.title);
                    }
                }
                var rarity1 = "";
                var rarity2 = "";
                var UnitRarity1 = pokemon[0].Rarity;
                var UnitRarity2 = pokemon[1].Rarity;
                for (var i = 0; i < UnitRarity1; i++) {
                    rarity1 += client.emojis.get(getEmoji['star']);
                }
                for (var x = 0; x < UnitRarity2; x++) {
                    rarity2 += client.emojis.get(getEmoji['star']);
                }
                var BST1 = parseInt(pokemon[0].HpLevelMax) + parseInt(pokemon[0].AtkLevelMax) + parseInt(pokemon[0].DefLevelMax) + parseInt(pokemon[0].SpAtkLevelMax) + parseInt(pokemon[0].SpDefLevelMax) + parseInt(pokemon[0].SpeedLevelMax);
                var BST2 = parseInt(pokemon[1].HpLevelMax) + parseInt(pokemon[1].AtkLevelMax) + parseInt(pokemon[1].DefLevelMax) + parseInt(pokemon[1].SpAtkLevelMax) + parseInt(pokemon[1].SpDefLevelMax) + parseInt(pokemon[1].SpeedLevelMax);
                var aBST = BST1 + "";
                var bBST = BST2 + "";
                var table = new AsciiTable();
                table
                    .setBorder('|', '-', '■', '■')
                    .setHeading(" - ", pokemon[0].PokemonName, pokemon[1].PokemonName)
                    .addRow("HP", pokemon[0].HpLevelMax, pokemon[1].HpLevelMax)
                    .addRow("ATK", pokemon[0].AtkLevelMax, pokemon[1].AtkLevelMax)
                    .addRow("DEF", pokemon[0].DefLevelMax, pokemon[1].DefLevelMax)
                    .addRow("SPATK", pokemon[0].SpAtkLevelMax, pokemon[1].SpAtkLevelMax)
                    .addRow("SPDEF", pokemon[0].SpDefLevelMax, pokemon[1].SpDefLevelMax)
                    .addRow("SPEED", pokemon[0].SpeedLevelMax, pokemon[1].SpeedLevelMax)
                    .addRow("BST", aBST, bBST);
                var embed = new Discord.RichEmbed()
                    .setAuthor(pokemon[0].PokemonName + " vs " + pokemon[1].PokemonName)
                    .setColor("BLUE")
                    .addField(client.emojis.get(getEmoji[pokemon[0].SPType.toLowerCase()]) + " " + pokemon[0].PokemonName + " info:", "Weakness: " + client.emojis.get(getEmoji[pokemon[0].WeakType.toLowerCase()]) + " ・Role: " + pokemon[0].Role + " ・Rarity: " + rarity1)
                    .addField(client.emojis.get(getEmoji[pokemon[1].SPType.toLowerCase()]) + " " + pokemon[1].PokemonName + " info:", "Weakness: " + client.emojis.get(getEmoji[pokemon[1].WeakType.toLowerCase()]) + " ・Role: " + pokemon[1].Role + " ・Rarity: " + rarity2)
                    .addField("Stat Comparison", "```" + table + "```");
                message.channel.send({embed});
            }

        } catch (e) {
            //ToDo: figure out an epic joke
        }
    }
}

async function summonSim(message, args, client, count, currency, user, threeCount, fourCount, fiveCount, featuredCount, embeds, finalFiveStars) {
    var banners;
    var threeStars = [];
    var fourStars = [];
    var fiveStars = [];
    var featured = [];
    var results = [];
    var author = message.author.username;
    try {
        await fetch(bannerUrl)
            .then(response => response.json())
            .then(bannerJson => banners = bannerJson);
        var banner;
        if (args[1] === undefined) {
            banner = banners[0];
        } else {
            for (var scout of banners) {
                if (scout.title.toLowerCase().includes(args[1])) {
                    banner = scout;
                }
            }
        }
        //Todo: come up with a better way to determine rarity, perhaps logic that looks at out[1] in a different way besides switchcase
        var pool = banner.units.split('<br />\r\n').map((unit) => {
            var out = unit.replace('&amp;', "/").replace('(Midnight Form)', "").replace(' (Shield Forme)', '').split('\t');
            switch (out[1]) {
                case '365':
                    return ([out[0], `3${client.emojis.get(getEmoji['star'])}`]);
                case '111':
                    return ([out[0], `4${client.emojis.get(getEmoji['star'])}`]);
                case '200':
                    return ([out[0], `5${client.emojis.get(getEmoji['star'])}**`]);
                default:
                    return ([out[0], `5${client.emojis.get(getEmoji['star'])}`]);
            }
        });
        for (var y in pool) {
            switch (pool[y][1]) {
                case `3${client.emojis.get(getEmoji['star'])}`:
                    threeStars.push(pool[y]);
                    break;
                case `4${client.emojis.get(getEmoji['star'])}`:
                    fourStars.push(pool[y]);
                    break;
                case `5${client.emojis.get(getEmoji['star'])}`:
                    fiveStars.push(pool[y]);
                    break;
                case `5${client.emojis.get(getEmoji['star'])}**`:
                    featured.push([pool[y][0] + "**", pool[y][1]]);
                    break;
            }
        }
        for (var i = 0; i < 10; i++) {
            var firstRoll = Math.round(Math.random() * 100);
            var secondRoll, thirdRoll, min, max;
            if (firstRoll > 93) {
                var featuredChance = 0.28;
                secondRoll = Math.random();
                if (secondRoll < featuredChance) {
                    results.push(featured[0]);
                    finalFiveStars.push(featured[0]);
                    featuredCount += 1;
                } else {
                    min = 0;
                    max = fiveStars.length - 1;
                    thirdRoll = Math.round(Math.random() * (+max - +min) + +min);
                    results.push(fiveStars[thirdRoll]);
                    finalFiveStars.push(fiveStars[thirdRoll]);
                    fiveCount += 1;
                }
            } else if (firstRoll > 73) {
                min = 0;
                max = fourStars.length - 1;
                secondRoll = Math.round(Math.random() * (+max - +min) + +min);
                results.push(fourStars[secondRoll]);
                fourCount += 1;
            } else {
                min = 0;
                max = threeStars.length - 1;
                secondRoll = Math.round(Math.random() * (+max - +min) + +min);
                results.push(threeStars[secondRoll]);
                threeCount += 1;
            }
        }
        results.sort((a, b) => {
            if (parseInt(a[1][0]) < parseInt(b[1][0])) {
                return 1;
            } else {
                return -1;
            }
        });
        var resultsOut = results.map((unit) => {
            return unit[1] + " ・" + unit[0]
        });
        let halfWayThough = Math.floor(resultsOut.length / 2);
        let arrayFirstHalf = resultsOut.slice(0, halfWayThough);
        let arraySecondHalf = resultsOut.slice(halfWayThough, resultsOut.length);
        var bannerImg = 'https://pokemonmasters.gamepress.gg' + banner.banner.substring(banner.banner.indexOf('<img src="') + 10, banner.banner.indexOf('" width'));
        var embed = new Discord.RichEmbed()
            .setAuthor(banner.title + " Summon Simulator ・ " + message.author.username + " summon #" + count)
            .setImage(bannerImg)
            .setColor("#ffdf43")
            .addField("Results", arrayFirstHalf, true)
            .addField(" - ", arraySecondHalf, true)
            .addField('Cost', '**# of Summons:** ' + count * 10 + " ・" + '**Cost:** ' + currency + " gems | " + gemsToUSD(currency) + " USD")
            .addField('Totals', '**Featured:** ' + featuredCount + " ・" + '**5 star:** ' + fiveCount + " ・" + '**4 star:** ' + fourCount + " ・" + '**3 star:** ' + threeCount)
            .setFooter('👌 => summon again ・ 👍 => summary ・ >pm scout => banners.');
        const filter = (reaction, user) => {
            return ['👍', '👌'].includes(reaction.emoji.name) && user.id === message.author.id;
        };
        embeds.push(embed);
        message.channel.send({embed}).then(async (reply) => {
            try {
                await reply.react('👌');
                await reply.react('👍');
            } catch (error) {
                console.error('One of the emojis failed to react.');
            }
            var collector = reply.createReactionCollector(filter, {time: 15000, max: 1});
            collector.on('collect', r => {
                if (r._emoji.name === '👌') {
                    reply.delete().catch(console.error);
                    summonSim(message, args, client, count + 1, currency + 3000, user, threeCount, fourCount, fiveCount, featuredCount, embeds, finalFiveStars)
                }
                if (r._emoji.name === '👍') {
                    reply.delete().catch(console.error);
                    genResults(message, args, client, embeds, finalFiveStars, count, currency, user, threeCount, fourCount, fiveCount, featuredCount, bannerImg, author);
                }
            });
            collector.on('end', collected => reply.clearReactions());
        })
    } catch (e) {
        //summonSim(message, args, client);
        //message.channel.send('<@!115270563349528579>, help this guy out please...')
        console.log(e);
        message.channel.send('Try again?');
    }
}

function genResults(message, args, client, embeds, finalFiveStars, count, currency, user, threeCount, fourCount, fiveCount, featuredCount, bannerImg, author) {
    if (finalFiveStars.length < 1) {
        finalFiveStars.push(["None", ":P"]);
    }
    var worth;
    if (featuredCount + fiveCount > count) {
        worth = "Worth it."
    } else {
        worth = "Not Worth it."
    }
    const embed = new Discord.RichEmbed()
        .setColor("#ffdf43")
        .setAuthor(author + "'s results")
        .setImage(bannerImg)
        .addField('Cost', '**# of Summons:** ' + count * 10 + " ・" + '**Cost:** ' + currency + " gems | " + gemsToUSD(currency) + " USD" + "\n" + worth)
        .addField('Totals', '**Featured:** ' + featuredCount + " ・" + '**5 star:** ' + fiveCount + " ・" + '**4 star:** ' + fourCount + " ・" + '**3 star:** ' + threeCount)
        .addField("Notable Units", finalFiveStars.map((elem) => {
            return elem[1] + " ・" + elem[0]
        }));
    embeds.unshift(embed);
    paginationEmbed(message, embeds, ['⏪', '⏩'], 60000);
}


async function getUnit(message, args, client) {
    var embeds = [];
    var units;
    var moves;
    var unit = [];
    var movesOut;
    var passives;
    var passivesOut;
    var icon;
    var rarity = "";
    var chibiTemp;
    await fetch(UnitUrl)
        .then(response => response.json())
        .then(trainers => units = trainers.cargoquery);
    if (units) {
        for (var x in units) {
            if (units[x].title.TrainerName.toUpperCase() === args.toUpperCase() || units[x].title.TrainerName.toUpperCase() === "SYGNA SUIT " + args.toUpperCase() || units[x].title.PokemonName.toUpperCase() === args.toUpperCase()) {
                unit.push(units[x].title);
            }
        }
    }
    var UnitRarity = unit[0].Rarity;
    for (var i = 0; i < UnitRarity; i++) {
        rarity += "⭐"
    }
    unit.sort((a, b) => {
        var aBST = a.HpLevelMax + a.AtkLevelMax + a.DefLevelMax + a.SpAtkLevelMax + a.SpDefLevelMax + a.SpeedLevelMax;
        var bBST = b.HpLevelMax + b.AtkLevelMax + b.DefLevelMax + b.SpAtkLevelMax + b.SpDefLevelMax + b.SpeedLevelMax;
        if (aBST < bBST) {
            return 1;
        } else {
            return -1;
        }
    });
    await fetch(MoveUrl)
        .then(response => response.json())
        .then(move => moves = move.cargoquery);
    await fetch(PassiveUrl)
        .then(response => response.json())
        .then(passive => passives = passive.cargoquery);
    if (unit[0].TrainerName === "Main Character") {
        await fetch(iconUrl)
            .then(response => response.json())
            .then(iconsUrl => icon = iconsUrl.find(function (curUnit) {
                return curUnit.title === "Player"
            }).icon);
    } else {
        await fetch(iconUrl)
            .then(response => response.json())
            .then(iconsUrl => icon = iconsUrl.find(function (curUnit) {
                return curUnit.title === unit[0].TrainerName
            }).icon);
    }
    var iconPruned = 'https://pokemonmasters.gamepress.gg' + icon.substring(icon.indexOf('<img src="') + 10, icon.indexOf('" width'));
    embeds = unit.map((unit) => {
            movesOut = getMoves([unit.Move1, unit.Move2, unit.Move3, unit.Move4], moves, client) + getSync(unit.SyncMove, moves, client);
            passivesOut = getPassives([unit.Passive1, unit.Passive2, unit.Passive3], passives);
            if (passivesOut.length < 1) {
                passivesOut = "Information Missing."
            }
            var chibi;
            if (unit.PokemonName.includes('Mega ')) {
                chibi = 'https://serebii.net//pokedex-sm/icon/' + dexnumMap[unit.PokemonName.substring(5, unit.PokemonName.length)] + '.png';
            } else {
                chibi = 'https://serebii.net//pokedex-sm/icon/' + dexnumMap[unit.PokemonName.replace(" Shield", "").replace(" Sword", "")] + '.png';
            }
            chibiTemp = chibi;
            var table = new AsciiTable();
            table
                .setBorder('|', '-', '■', '■')
                .setHeading('HP', 'ATK', 'DEF', 'SPATK', 'SPDEF', 'SPD')
                .addRow(unit.HpLevelMax, unit.AtkLevelMax, unit.DefLevelMax, unit.SpAtkLevelMax, unit.SpDefLevelMax, unit.SpeedLevelMax);
            return new Discord.RichEmbed()
                .setTitle('Wiki Link')
                .setAuthor(unit.TrainerName.replace("Synga Suit ", "") + " & " + unit.PokemonName + " ・ " + unit.Role + " " + rarity, chibi)
                .setThumbnail(iconPruned)
                .addField("Type", client.emojis.get(getEmoji[unit.SPType.toLowerCase()]), true)
                .addField("Weakness", client.emojis.get(getEmoji[unit.WeakType.toLowerCase()]), true)
                .addField('Stats', "```" + table.toString() + "```")
                .addField("---Passives---", passivesOut)
                .addField("---Moves---", movesOut)
                .setColor(getColor(unit.SPType))
                .setURL('https://pokemonmasters.miraheze.org/wiki/' + unit.TrainerName.split(" ").join("_"))
                .setFooter("Stats reflect their values at max level (UNDER CONSTRUCTION)");
        }
    );
    var description;
    if (unit[0].PokemonName.includes("Mega ")) {
        if (!unit[1]) {
            description = "Mega-evolved form of " + unit[0].PokemonName.replace("Mega ", "");
        } else {
            description = unit[1].Description;
        }

    } else {
        description = unit[0].Description;
    }
    var embedFinal = new Discord.RichEmbed()
        .setTitle('Wiki Link')
        .setAuthor(unit[0].TrainerName.replace("Synga Suit ", "") + " & " + unit[0].PokemonName + " ・" + unit[0].Role + " " + rarity)
        .setImage('https://www.serebii.net/pokemonmasters/syncpairs/' + unit[0].TrainerName.replace("Synga Suit ", "").toLowerCase().replace(" ", "") + '.png')
        .setThumbnail(iconPruned)
        .addField('Obtained From: ', unit[0].Obtain.replace('[', '').replace(']', '').replace('[', '').replace(']', '').replace('Main Story|', ""))
        .addField('Pokemon Description', description)
        .setURL('https://pokemonmasters.miraheze.org/wiki/' + unit[0].TrainerName.split(" ").join("_"))
        .setColor(getColor(unit[0].SPType));
    embeds.push(embedFinal);
    paginationEmbed(message, embeds, ['⏪', '⏩'], 60000);
}

function getMoves(unitMoveArr, moves, client) {
    var movesList = [];
    var count = 0;
    for (var x in unitMoveArr) {
        for (var y in moves) {
            if (unitMoveArr[x] === moves[y].title.Name.replace('&amp;#39;', "'")) {
                var move = moves[y].title;
                count++;
                movesList.push(generateMoveOut(move, client, count));
            }
        }
    }
    return movesList.join("\n");
}

function generateMoveOut(move, client, count) {
    var moveOut = "";
    var isTrainerMove = () => {
        return move.User === "Trainer";
    };
    moveOut += "**" + count + ": **" + client.emojis.get(getEmoji[move.Category.toLowerCase()]) + " **" + move.Name.replace('&amp;#39;', "'") + "** ";
    if (move.Type !== "NoType") {
        moveOut += client.emojis.get(getEmoji[move.Type.toLowerCase()])
    }
    if (move.MoveGaugeCost === '0') {
        if (move.MoveGroup === "Sync") {
        } else {
            moveOut += ' ・ Uses: ' + move.UsageLimit
        }
    } else {
        moveOut += ' ・ Cost: ' + move.MoveGaugeCost
    }
    if (!isTrainerMove() && move.Category !== 'Status' && move.MoveGroup !== 'sync') {
        if (move.MoveGroup === 'Sync') {
            moveOut += ' ・ Pow: ' + move.Power + " - " + move.MaxPower
        } else {
            moveOut += ' ・ Pow: ' + move.Power + " - " + move.MaxPower + ' ・ ' + 'Acc: ' + move.Accuracy
        }
    }
    if (move.Description.length > 250) {
        moveOut += '\n' + "Description too long. Check the wiki."
    } else {
        moveOut += '\n' + move.Description;
    }
    return moveOut;
}

function getPassives(unitPassiveArr, passives) {
    var passiveList = [];
    for (var x in unitPassiveArr) {
        for (var y in passives) {
            if (unitPassiveArr[x] === passives[y].title.Name.replace('&amp;#39;', "'")) {
                var passive = passives[y].title;
                var passiveOut = '**' + passive.Name + ':** ' + passive.Description;
                passiveList.push(passiveOut);
            }
        }
    }
    return passiveList;
}

function getSync(sync, moves, client) {
    var syncOut = "\n";
    for (var x in moves) {
        if (sync === moves[x].title.Name.replace('&amp;#39;', "'")) {
            var move = moves[x].title;
            syncOut += generateMoveOut(move, client, "S");
        }
    }
    return syncOut;
}

function gemsToUSD(currency) {
    return (currency / 100) * 0.99;
}

function getColor(type) {
    var elementColor;
    switch (type.toLowerCase()) {
        case 'normal':
            elementColor = "#ffffff";
            break;
        case 'fire':
            elementColor = "#ff0000";
            break;
        case 'water':
            elementColor = "#4286f4";
            break;
        case 'electric':
            elementColor = "#fffa00";
            break;
        case 'grass':
            elementColor = "#1daf0f";
            break;
        case 'ice':
            elementColor = "#00ffe5";
            break;
        case 'fighting':
            elementColor = "#7a3b3b";
            break;
        case 'poison':
            elementColor = "#9a06aa";
            break;
        case 'ground':
            elementColor = "#351818";
            break;
        case 'flying':
            elementColor = "#a2c1c1";
            break;
        case 'psychic':
            elementColor = "#b56cab";
            break;
        case 'bug':
            elementColor = "#87c69f";
            break;
        case 'rock':
            elementColor = "#9e7356";
            break;
        case 'ghost':
            elementColor = "#65558c";
            break;
        case 'dragon':
            elementColor = "#00487f";
            break;
        case 'dark':
            elementColor = "#23021e";
            break;
        case 'steel':
            elementColor = "#6b6b6b";
            break;
        case 'fairy':
            elementColor = "#ffb7d7";
            break;
    }
    return elementColor;
}

const getEmoji = {
    "bug": "617968167620313108",
    "dark": "617968229863784448",
    "dragon": "617968266383458314",
    "electric": "617968291218194432",
    "fairy": "617968315394162725",
    "fighting": "617968336495575050",
    "fire": "617968361787359243",
    "flying": "617968383744540675",
    "ghost": "617968404376322048",
    "grass": "617968425125412866",
    "ground": "617968451612311583",
    "ice": "617968478808309771",
    "normal": "617968506524401679",
    "poison": "617968534986686477",
    "psychic": "617968557766213633",
    "rock": "617968594982273024",
    "steel": "617968618399072266",
    "water": "617968638883790858",
    "physical": "617968661663186945",
    "special": "617968684534857734",
    "status": "617968708320624652",
    "star": "617978374614286360"
};

const dexnumMap = {
    "Bulbasaur": "001",
    "Ivysaur": "002",
    "Venusaur": "003",
    "Charmander": "004",
    "Charmeleon": "005",
    "Charizard": "006",
    "Squirtle": "007",
    "Wartortle": "008",
    "Blastoise": "009",
    "Caterpie": "010",
    "Metapod": "011",
    "Butterfree": "012",
    "Weedle": "013",
    "Kakuna": "014",
    "Beedrill": "015",
    "Pidgey": "016",
    "Pidgeotto": "017",
    "Pidgeot": "018",
    "Rattata": "019",
    "Raticate": "020",
    "Spearow": "021",
    "Fearow": "022",
    "Ekans": "023",
    "Arbok": "024",
    "Pikachu": "025",
    "Raichu": "026",
    "Sandshrew": "027",
    "Sandslash": "028",
    "Nidoran-F": "029",
    "Nidorina": "030",
    "Nidoqueen": "031",
    "Nidoran-M": "032",
    "Nidorino": "033",
    "Nidoking": "034",
    "Clefairy": "035",
    "Clefable": "036",
    "Vulpix": "037",
    "Ninetales": "038",
    "Jigglypuff": "039",
    "Wigglytuff": "040",
    "Zubat": "041",
    "Golbat": "042",
    "Oddish": "043",
    "Gloom": "044",
    "Vileplume": "045",
    "Paras": "046",
    "Parasect": "047",
    "Venonat": "048",
    "Venomoth": "049",
    "Diglett": "050",
    "Dugtrio": "051",
    "Meowth": "052",
    "Persian": "053",
    "Psyduck": "054",
    "Golduck": "055",
    "Mankey": "056",
    "Primeape": "057",
    "Growlithe": "058",
    "Arcanine": "059",
    "Poliwag": "060",
    "Poliwhirl": "061",
    "Poliwrath": "062",
    "Abra": "063",
    "Kadabra": "064",
    "Alakazam": "065",
    "Machop": "066",
    "Machoke": "067",
    "Machamp": "068",
    "Bellsprout": "069",
    "Weepinbell": "070",
    "Victreebel": "071",
    "Tentacool": "072",
    "Tentacruel": "073",
    "Geodude": "074",
    "Graveler": "075",
    "Golem": "076",
    "Ponyta": "077",
    "Rapidash": "078",
    "Slowpoke": "079",
    "Slowbro": "080",
    "Magnemite": "081",
    "Magneton": "082",
    "Farfetch'd": "083",
    "Doduo": "084",
    "Dodrio": "085",
    "Seel": "086",
    "Dewgong": "087",
    "Grimer": "088",
    "Muk": "089",
    "Shellder": "090",
    "Cloyster": "091",
    "Gastly": "092",
    "Haunter": "093",
    "Gengar": "094",
    "Onix": "095",
    "Drowzee": "096",
    "Hypno": "097",
    "Krabby": "098",
    "Kingler": "099",
    "Voltorb": "100",
    "Electrode": "101",
    "Exeggcute": "102",
    "Exeggutor": "103",
    "Cubone": "104",
    "Marowak": "105",
    "Hitmonlee": "106",
    "Hitmonchan": "107",
    "Lickitung": "108",
    "Koffing": "109",
    "Weezing": "110",
    "Rhyhorn": "111",
    "Rhydon": "112",
    "Chansey": "113",
    "Tangela": "114",
    "Kangaskhan": "115",
    "Horsea": "116",
    "Seadra": "117",
    "Goldeen": "118",
    "Seaking": "119",
    "Staryu": "120",
    "Starmie": "121",
    "Mr.Mime": "122",
    "Scyther": "123",
    "Jynx": "124",
    "Electabuzz": "125",
    "Magmar": "126",
    "Pinsir": "127",
    "Tauros": "128",
    "Magikarp": "129",
    "Gyarados": "130",
    "Lapras": "131",
    "Ditto": "132",
    "Eevee": "133",
    "Vaporeon": "134",
    "Jolteon": "135",
    "Flareon": "136",
    "Porygon": "137",
    "Omanyte": "138",
    "Omastar": "139",
    "Kabuto": "140",
    "Kabutops": "141",
    "Aerodactyl": "142",
    "Snorlax": "143",
    "Articuno": "144",
    "Zapdos": "145",
    "Moltres": "146",
    "Dratini": "147",
    "Dragonair": "148",
    "Dragonite": "149",
    "Mewtwo": "150",
    "Mew": "151",
    "Chikorita": "152",
    "Bayleef": "153",
    "Meganium": "154",
    "Cyndaquil": "155",
    "Quilava": "156",
    "Typhlosion": "157",
    "Totodile": "158",
    "Croconaw": "159",
    "Feraligatr": "160",
    "Sentret": "161",
    "Furret": "162",
    "Hoothoot": "163",
    "Noctowl": "164",
    "Ledyba": "165",
    "Ledian": "166",
    "Spinarak": "167",
    "Ariados": "168",
    "Crobat": "169",
    "Chinchou": "170",
    "Lanturn": "171",
    "Pichu": "172",
    "Cleffa": "173",
    "Igglybuff": "174",
    "Togepi": "175",
    "Togetic": "176",
    "Natu": "177",
    "Xatu": "178",
    "Mareep": "179",
    "Flaaffy": "180",
    "Ampharos": "181",
    "Bellossom": "182",
    "Marill": "183",
    "Azumarill": "184",
    "Sudowoodo": "185",
    "Politoed": "186",
    "Hoppip": "187",
    "Skiploom": "188",
    "Jumpluff": "189",
    "Aipom": "190",
    "Sunkern": "191",
    "Sunflora": "192",
    "Yanma": "193",
    "Wooper": "194",
    "Quagsire": "195",
    "Espeon": "196",
    "Umbreon": "197",
    "Murkrow": "198",
    "Slowking": "199",
    "Misdreavus": "200",
    "Unown": "201",
    "Wobbuffet": "202",
    "Girafarig": "203",
    "Pineco": "204",
    "Forretress": "205",
    "Dunsparce": "206",
    "Gligar": "207",
    "Steelix": "208",
    "Snubbull": "209",
    "Granbull": "210",
    "Qwilfish": "211",
    "Scizor": "212",
    "Shuckle": "213",
    "Heracross": "214",
    "Sneasel": "215",
    "Teddiursa": "216",
    "Ursaring": "217",
    "Slugma": "218",
    "Magcargo": "219",
    "Swinub": "220",
    "Piloswine": "221",
    "Corsola": "222",
    "Remoraid": "223",
    "Octillery": "224",
    "Delibird": "225",
    "Mantine": "226",
    "Skarmory": "227",
    "Houndour": "228",
    "Houndoom": "229",
    "Kingdra": "230",
    "Phanpy": "231",
    "Donphan": "232",
    "Porygon2": "233",
    "Stantler": "234",
    "Smeargle": "235",
    "Tyrogue": "236",
    "Hitmontop": "237",
    "Smoochum": "238",
    "Elekid": "239",
    "Magby": "240",
    "Miltank": "241",
    "Blissey": "242",
    "Raikou": "243",
    "Entei": "244",
    "Suicune": "245",
    "Larvitar": "246",
    "Pupitar": "247",
    "Tyranitar": "248",
    "Lugia": "249",
    "Ho-oh": "250",
    "Celebi": "251",
    "Treecko": "252",
    "Grovyle": "253",
    "Sceptile": "254",
    "Torchic": "255",
    "Combusken": "256",
    "Blaziken": "257",
    "Mudkip": "258",
    "Marshtomp": "259",
    "Swampert": "260",
    "Poochyena": "261",
    "Mightyena": "262",
    "Zigzagoon": "263",
    "Linoone": "264",
    "Wurmple": "265",
    "Silcoon": "266",
    "Beautifly": "267",
    "Cascoon": "268",
    "Dustox": "269",
    "Lotad": "270",
    "Lombre": "271",
    "Ludicolo": "272",
    "Seedot": "273",
    "Nuzleaf": "274",
    "Shiftry": "275",
    "Taillow": "276",
    "Swellow": "277",
    "Wingull": "278",
    "Pelipper": "279",
    "Ralts": "280",
    "Kirlia": "281",
    "Gardevoir": "282",
    "Surskit": "283",
    "Masquerain": "284",
    "Shroomish": "285",
    "Breloom": "286",
    "Slakoth": "287",
    "Vigoroth": "288",
    "Slaking": "289",
    "Nincada": "290",
    "Ninjask": "291",
    "Shedinja": "292",
    "Whismur": "293",
    "Loudred": "294",
    "Exploud": "295",
    "Makuhita": "296",
    "Hariyama": "297",
    "Azurill": "298",
    "Nosepass": "299",
    "Skitty": "300",
    "Delcatty": "301",
    "Sableye": "302",
    "Mawile": "303",
    "Aron": "304",
    "Lairon": "305",
    "Aggron": "306",
    "Meditite": "307",
    "Medicham": "308",
    "Electrike": "309",
    "Manectric": "310",
    "Plusle": "311",
    "Minun": "312",
    "Volbeat": "313",
    "Illumise": "314",
    "Roselia": "315",
    "Gulpin": "316",
    "Swalot": "317",
    "Carvanha": "318",
    "Sharpedo": "319",
    "Wailmer": "320",
    "Wailord": "321",
    "Numel": "322",
    "Camerupt": "323",
    "Torkoal": "324",
    "Spoink": "325",
    "Grumpig": "326",
    "Spinda": "327",
    "Trapinch": "328",
    "Vibrava": "329",
    "Flygon": "330",
    "Cacnea": "331",
    "Cacturne": "332",
    "Swablu": "333",
    "Altaria": "334",
    "Zangoose": "335",
    "Seviper": "336",
    "Lunatone": "337",
    "Solrock": "338",
    "Barboach": "339",
    "Whiscash": "340",
    "Corphish": "341",
    "Crawdaunt": "342",
    "Baltoy": "343",
    "Claydol": "344",
    "Lileep": "345",
    "Cradily": "346",
    "Anorith": "347",
    "Armaldo": "348",
    "Feebas": "349",
    "Milotic": "350",
    "Castform": "351",
    "Kecleon": "352",
    "Shuppet": "353",
    "Banette": "354",
    "Duskull": "355",
    "Dusclops": "356",
    "Tropius": "357",
    "Chimecho": "358",
    "Absol": "359",
    "Wynaut": "360",
    "Snorunt": "361",
    "Glalie": "362",
    "Spheal": "363",
    "Sealeo": "364",
    "Walrein": "365",
    "Clamperl": "366",
    "Huntail": "367",
    "Gorebyss": "368",
    "Relicanth": "369",
    "Luvdisc": "370",
    "Bagon": "371",
    "Shelgon": "372",
    "Salamence": "373",
    "Beldum": "374",
    "Metang": "375",
    "Metagross": "376",
    "Regirock": "377",
    "Regice": "378",
    "Registeel": "379",
    "Latias": "380",
    "Latios": "381",
    "Kyogre": "382",
    "Groudon": "383",
    "Rayquaza": "384",
    "Jirachi": "385",
    "Deoxys": "386",
    "Turtwig": "387",
    "Grotle": "388",
    "Torterra": "389",
    "Chimchar": "390",
    "Monferno": "391",
    "Infernape": "392",
    "Piplup": "393",
    "Prinplup": "394",
    "Empoleon": "395",
    "Starly": "396",
    "Staravia": "397",
    "Staraptor": "398",
    "Bidoof": "399",
    "Bibarel": "400",
    "Kricketot": "401",
    "Kricketune": "402",
    "Shinx": "403",
    "Luxio": "404",
    "Luxray": "405",
    "Budew": "406",
    "Roserade": "407",
    "Cranidos": "408",
    "Rampardos": "409",
    "Shieldon": "410",
    "Bastiodon": "411",
    "Burmy": "412",
    "Wormadam": "413",
    "Mothim": "414",
    "Combee": "415",
    "Vespiquen": "416",
    "Pachirisu": "417",
    "Buizel": "418",
    "Floatzel": "419",
    "Cherubi": "420",
    "Cherrim": "421",
    "Shellos": "422",
    "Gastrodon": "423",
    "Ambipom": "424",
    "Drifloon": "425",
    "Drifblim": "426",
    "Buneary": "427",
    "Lopunny": "428",
    "Mismagius": "429",
    "Honchkrow": "430",
    "Glameow": "431",
    "Purugly": "432",
    "Chingling": "433",
    "Stunky": "434",
    "Skuntank": "435",
    "Bronzor": "436",
    "Bronzong": "437",
    "Bonsly": "438",
    "MimeJr. ": "439",
    "Happiny": "440",
    "Chatot": "441",
    "Spiritomb": "442",
    "Gible": "443",
    "Gabite": "444",
    "Garchomp": "445",
    "Munchlax": "446",
    "Riolu": "447",
    "Lucario": "448",
    "Hippopotas": "449",
    "Hippowdon": "450",
    "Skorupi": "451",
    "Drapion": "452",
    "Croagunk": "453",
    "Toxicroak": "454",
    "Carnivine": "455",
    "Finneon": "456",
    "Lumineon": "457",
    "Mantyke": "458",
    "Snover": "459",
    "Abomasnow": "460",
    "Weavile": "461",
    "Magnezone": "462",
    "Lickilicky": "463",
    "Rhyperior": "464",
    "Tangrowth": "465",
    "Electivire": "466",
    "Magmortar": "467",
    "Togekiss": "468",
    "Yanmega": "469",
    "Leafeon": "470",
    "Glaceon": "471",
    "Gliscor": "472",
    "Mamoswine": "473",
    "Porygon-Z": "474",
    "Gallade": "475",
    "Probopass": "476",
    "Dusknoir": "477",
    "Froslass": "478",
    "Rotom": "479",
    "Uxie": "480",
    "Mesprit": "481",
    "Azelf": "482",
    "Dialga": "483",
    "Palkia": "484",
    "Heatran": "485",
    "Regigigas": "486",
    "Giratina": "487",
    "Cresselia": "488",
    "Phione": "489",
    "Manaphy": "490",
    "Darkrai": "491",
    "Shaymin": "492",
    "Arceus": "493",
    "Victini": "494",
    "Snivy": "495",
    "Servine": "496",
    "Serperior": "497",
    "Tepig": "498",
    "Pignite": "499",
    "Emboar": "500",
    "Oshawott": "501",
    "Dewott": "502",
    "Samurott": "503",
    "Patrat": "504",
    "Watchog": "505",
    "Lillipup": "506",
    "Herdier": "507",
    "Stoutland": "508",
    "Purrloin": "509",
    "Liepard": "510",
    "Pansage": "511",
    "Simisage": "512",
    "Pansear": "513",
    "Simisear": "514",
    "Panpour": "515",
    "Simipour": "516",
    "Munna": "517",
    "Musharna": "518",
    "Pidove": "519",
    "Tranquill": "520",
    "Unfezant": "521",
    "Blitzle": "522",
    "Zebstrika": "523",
    "Roggenrola": "524",
    "Boldore": "525",
    "Gigalith": "526",
    "Woobat": "527",
    "Swoobat": "528",
    "Drilbur": "529",
    "Excadrill": "530",
    "Audino": "531",
    "Timburr": "532",
    "Gurdurr": "533",
    "Conkeldurr": "534",
    "Tympole": "535",
    "Palpitoad": "536",
    "Seismitoad": "537",
    "Throh": "538",
    "Sawk": "539",
    "Sewaddle": "540",
    "Swadloon": "541",
    "Leavanny": "542",
    "Venipede": "543",
    "Whirlipede": "544",
    "Scolipede": "545",
    "Cottonee": "546",
    "Whimsicott": "547",
    "Petilil": "548",
    "Lilligant": "549",
    "Basculin": "550",
    "Sandile": "551",
    "Krokorok": "552",
    "Krookodile": "553",
    "Darumaka": "554",
    "Darmanitan": "555",
    "Maractus": "556",
    "Dwebble": "557",
    "Crustle": "558",
    "Scraggy": "559",
    "Scrafty": "560",
    "Sigilyph": "561",
    "Yamask": "562",
    "Cofagrigus": "563",
    "Tirtouga": "564",
    "Carracosta": "565",
    "Archen": "566",
    "Archeops": "567",
    "Trubbish": "568",
    "Garbodor": "569",
    "Zorua": "570",
    "Zoroark": "571",
    "Minccino": "572",
    "Cinccino": "573",
    "Gothita": "574",
    "Gothorita": "575",
    "Gothitelle": "576",
    "Solosis": "577",
    "Duosion": "578",
    "Reuniclus": "579",
    "Ducklett": "580",
    "Swanna": "581",
    "Vanillite": "582",
    "Vanillish": "583",
    "Vanilluxe": "584",
    "Deerling": "585",
    "Sawsbuck": "586",
    "Emolga": "587",
    "Karrablast": "588",
    "Escavalier": "589",
    "Foongus": "590",
    "Amoonguss": "591",
    "Frillish": "592",
    "Jellicent": "593",
    "Alomomola": "594",
    "Joltik": "595",
    "Galvantula": "596",
    "Ferroseed": "597",
    "Ferrothorn": "598",
    "Klink": "599",
    "Klang": "600",
    "Klinklang": "601",
    "Tynamo": "602",
    "Eelektrik": "603",
    "Eelektross": "604",
    "Elgyem": "605",
    "Beheeyem": "606",
    "Litwick": "607",
    "Lampent": "608",
    "Chandelure": "609",
    "Axew": "610",
    "Fraxure": "611",
    "Haxorus": "612",
    "Cubchoo": "613",
    "Beartic": "614",
    "Cryogonal": "615",
    "Shelmet": "616",
    "Accelgor": "617",
    "Stunfisk": "618",
    "Mienfoo": "619",
    "Mienshao": "620",
    "Druddigon": "621",
    "Golett": "622",
    "Golurk": "623",
    "Pawniard": "624",
    "Bisharp": "625",
    "Bouffalant": "626",
    "Rufflet": "627",
    "Braviary": "628",
    "Vullaby": "629",
    "Mandibuzz": "630",
    "Heatmor": "631",
    "Durant": "632",
    "Deino": "633",
    "Zweilous": "634",
    "Hydreigon": "635",
    "Larvesta": "636",
    "Volcarona": "637",
    "Cobalion": "638",
    "Terrakion": "639",
    "Virizion": "640",
    "Tornadus": "641",
    "Thundurus": "642",
    "Reshiram": "643",
    "Zekrom": "644",
    "Landorus": "645",
    "Kyurem": "646",
    "Keldeo": "647",
    "Meloetta": "648",
    "Genesect": "649",
    "s:650-721": "Kalo",
    "Chespin": "650",
    "Quilladin": "651",
    "Chesnaught": "652",
    "Fennekin": "653",
    "Braixen": "654",
    "Delphox": "655",
    "Froakie": "656",
    "Frogadier": "657",
    "Greninja": "658",
    "Bunnelby": "659",
    "Diggersby": "660",
    "Fletchling": "661",
    "Fletchinder": "662",
    "Talonflame": "663",
    "Scatterbug": "664",
    "Spewpa": "665",
    "Vivillon": "666",
    "Litleo": "667",
    "Pyroar": "668",
    "Flabebe": "669",
    "Floette": "670",
    "Florges": "671",
    "Skiddo": "672",
    "Gogoat": "673",
    "Pancham": "674",
    "Pangoro": "675",
    "Furfrou": "676",
    "Espurr": "677",
    "Meowstic": "678",
    "Honedge": "679",
    "Doublade": "680",
    "Aegislash": "681",
    "Spritzee": "682",
    "Aromatisse": "683",
    "Swirlix": "684",
    "Slurpuff": "685",
    "Inkay": "686",
    "Malamar": "687",
    "Binacle": "688",
    "Barbaracle": "689",
    "Skrelp": "690",
    "Dragalge": "691",
    "Clauncher": "692",
    "Clawitzer": "693",
    "Helioptile": "694",
    "Heliolisk": "695",
    "Tyrunt": "696",
    "Tyrantrum": "697",
    "Amaura": "698",
    "Aurorus": "699",
    "Sylveon": "700",
    "Hawlucha": "701",
    "Dedenne": "702",
    "Carbink": "703",
    "Goomy": "704",
    "Sliggoo": "705",
    "Goodra": "706",
    "Klefki": "707",
    "Phantump": "708",
    "Trevenant": "709",
    "Pumpkaboo": "710",
    "Gourgeist": "711",
    "Bergmite": "712",
    "Avalugg": "713",
    "Noibat": "714",
    "Noivern": "715",
    "Xerneas": "716",
    "Yveltal": "717",
    "Zygarde": "718",
    "Diancie": "719",
    "Hoopa": "720",
    "Volcanion": "721",
    "a:722-809": "Alol",
    "Rowlet": "722",
    "Dartrix": "723",
    "Decidueye": "724",
    "Litten": "725",
    "Torracat": "726",
    "Incineroar": "727",
    "Popplio": "728",
    "Brionne": "729",
    "Primarina": "730",
    "Pikipek": "731",
    "Trumbeak": "732",
    "Toucannon": "733",
    "Yungoos": "734",
    "Gumshoos": "735",
    "Grubbin": "736",
    "Charjabug": "737",
    "Vikavolt": "738",
    "Crabrawler": "739",
    "Crabominable": "740",
    "Oricorio": "741",
    "Cutiefly": "742",
    "Ribombee": "743",
    "Rockruff": "744",
    "Lycanroc": "745",
    "Wishiwashi": "746",
    "Mareanie": "747",
    "Toxapex": "748",
    "Mudbray": "749",
    "Mudsdale": "750",
    "Dewpider": "751",
    "Araquanid": "752",
    "Fomantis": "753",
    "Lurantis": "754",
    "Morelull": "755",
    "Shiinotic": "756",
    "Salandit": "757",
    "Salazzle": "758",
    "Stufful": "759",
    "Bewear": "760",
    "Bounsweet": "761",
    "Steenee": "762",
    "Tsareena": "763",
    "Comfey": "764",
    "Oranguru": "765",
    "Passimian": "766",
    "Wimpod": "767",
    "Golisopod": "768",
    "Sandygast": "769",
    "Palossand": "770",
    "Pyukumuku": "771",
    "Type: Null": "772",
    "Silvally": "773",
    "Minior": "774",
    "Komala": "775",
    "Turtonator": "776",
    "Togedemaru": "777",
    "Mimikyu": "778",
    "Bruxish": "779",
    "Drampa": "780",
    "Dhelmise": "781",
    "Jangmo-o": "782",
    "Hakamo-o": "783",
    "Kommo-o": "784",
    "Tapu Koko": "785",
    "Tapu Lele": "786",
    "Tapu Bulu": "787",
    "Tapu Fini": "788",
    "Cosmog": "789",
    "Cosmoem": "790",
    "Solgaleo": "791",
    "Lunala": "792",
    "Nihilego": "793",
    "Buzzwole": "794",
    "Pheromosa": "795",
    "Xurkitree": "796",
    "Celesteela": "797",
    "Kartana": "798",
    "Guzzlord": "799",
    "Necrozma": "800",
    "Magearna": "801",
    "Marshadow": "802",
    "Poipole": "803",
    "Naganadel": "804",
    "Stakataka": "805",
    "Blacephalon": "806",
    "Zeraora": "807",
    "Meltan": "808",
    "Melmetal": "809"
};
