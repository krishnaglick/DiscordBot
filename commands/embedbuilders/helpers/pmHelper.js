const fs = require('fs');
const fetch = require("node-fetch");
const AsciiTable = require('ascii-table');
const resourcePath = './commands/embedbuilders/helpers/data/';
const GENERAL = require('./general');
const iconUrl = 'https://gamepress.gg/sites/default/files/aggregatedjson/TrainersList.json?15813222081239323912';
module.exports = {
    findJSON: async function (arg, seek) {
        const trainerFiles = await fs.readdirSync(resourcePath + seek).filter(file => file.endsWith('.json'));
        for (const file of trainerFiles) {
            let rawData = await fs.readFileSync(resourcePath + seek + "/" + file);
            let data = await JSON.parse(rawData);
            if (data.name.toUpperCase() === arg.toUpperCase()) {
                return data;
            }
        }
    },
    getPKMNIcon: async function (name) {
        if (name.includes('Mega ')) {
            return 'https://serebii.net//pokedex-sm/icon/' + await GENERAL.pokedexLookup(name.substring(5, name.length)) + '.png';
        } else {
            return 'https://serebii.net//pokedex-sm/icon/' + await GENERAL.pokedexLookup(name.replace(" Shield", "").replace(" Sword", "")) + '.png';
        }
    },
    sortByStats: async function (a, b) {
        let aBST = a.stats.max.attack + a.stats.max.defense + a.stats.max.speed + a.stats.max.sp_atk + a.stats.max.sp_def;
        let bBST = b.stats.max.attack + b.stats.max.defense + b.stats.max.speed + b.stats.max.sp_atk + b.stats.max.sp_def;
        if (aBST > bBST) {
            return -1;
        } else if (a === b) {
            return 0;
        } else {
            return 1;
        }
    },
    generateStatTable: async function (stats) {
        let table = new AsciiTable();
        table
            .setBorder('|', '-', '■', '■')
            .setHeading('HP', 'ATK', 'DEF', 'SPATK', 'SPDEF', 'SPD')
            .addRow(stats.base.hp,
                stats.base.attack,
                stats.base.defense,
                stats.base.sp_atk,
                stats.base.sp_def,
                stats.base.speed)
            .addRow(stats.max.hp,
                stats.max.attack,
                stats.max.defense,
                stats.max.sp_atk,
                stats.max.sp_def,
                stats.max.speed);
        return "```" + table.toString() + "```";
    },
    //ToDo: hard code this
    getUnitIcon: async function(unit){
        let icon;
        if (unit.name === "Main Character") {
            await fetch(iconUrl)
                .then(response => response.json())
                .then(iconsUrl => icon = iconsUrl.find(function (curUnit) {
                    return curUnit.title === "Player"
                }).icon);
        } else {
            await fetch(iconUrl)
                .then(response => response.json())
                .then(iconsUrl => icon = iconsUrl.find(function (curUnit) {
                    return curUnit.title === unit.name
                }).icon);
        }
        return 'https://pokemonmasters.gamepress.gg' + icon.substring(icon.indexOf('<img src="') + 10, icon.indexOf('" width'));
    },
    generateMovesOut: async function (moves, client){
        let count = 1;
        let out = "";
        for(const move of moves){
            let isStatus = move.category.toLowerCase() === "status effect";
            out += "**" + count + ". "
                + await GENERAL.getEmoji(move.category.toLowerCase(), client) + " "
                + move.name + " "
                + (isStatus
                    ? ""
                    : await GENERAL.getEmoji(move.type.toLowerCase(), client)
                )
                + " ・ **"
                + (isStatus
                    ? " **Uses:** " + move.uses + " **Target:** " + move.target
                    : " **Cost:** " + move.cost + " **PWR:** " + move.power.min_power + "→" + move.power.max_power + " **ACC:** " + move.accuracy + ((move.target === "All opponents")?" **AOE**":"")
                )
                + "\n"
                + move.effect
                + "\n";
            count++;
        }
        return out;
    }
};
