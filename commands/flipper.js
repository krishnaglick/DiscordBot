const fs = require('fs');
const fetch = require("node-fetch");
const AsciiTable = require('ascii-table');
const Discord = require('discord.js');
const paginationEmbed = require('discord.js-pagination');
const GENERAL = require('./embedbuilders/helpers/generalHelper');
const data = require('./embedbuilders/helpers/data/flipper/flipperData');

module.exports = {
    name: 'wf',
    display: 'World Flippers',
    description: '`>wf [unit name]` to see a unit\'s info. (UNDER CONSTRUCTION)',
    async execute(message, args, client) {
        for (const flipper of data.flippers) {
            if (args[0].toUpperCase() === flipper.name.toUpperCase()) {
                const embed = new Discord.RichEmbed()
                    .setColor(await getColor(flipper.element))
                    .setAuthor(flipper.name + " ・" + flipper.element + " ・" + flipper.type)
                    .addField(" ・Rarity ・", await GENERAL.generateStars(flipper.rarity), true)
                    .addField(" ・CV ・", flipper.cV, true)
                    .addField(" ・Skill ・", "**" + flipper.skill.name + "**\n" + flipper.skill.desc)
                    .addField(" ・Description ・", flipper.description)
                    .setThumbnail("https://worldflipper.jp/othermedia/web_other/official/" + flipper.imageUriTag + "/square_0.png")
                    .setImage("https://worldflipper.jp/othermedia/web_other/official/" + flipper.imageUriTag + "/full_shot_0.png");
                const embed2 = new Discord.RichEmbed()
                    .setColor(await getColor(flipper.element))
                    .setAuthor(flipper.name + " ・" + flipper.element + " ・" + flipper.type)
                    .addField(" ・Rarity ・", await GENERAL.generateStars(flipper.rarity), true)
                    .addField(" ・CV ・", flipper.cV, true)
                    .addField(" ・Skill ・", "**" + flipper.skill.name + "**\n" + flipper.skill.desc)
                    .addField(" ・Description ・", flipper.description)
                    .setThumbnail("https://worldflipper.jp/othermedia/web_other/official/" + flipper.imageUriTag + "/square_0.png")
                    .setImage("https://worldflipper.jp/othermedia/web_other/official/" + flipper.imageUriTag + "/pixelart/special.gif");
                await paginationEmbed(message, [embed, embed2], GENERAL.nextButtons, GENERAL.paginationTimeOut);
            }
        }
    }
};

async function getColor(element) {
    switch (element) {
        case "fire":
            return "#ff0000";
        case "water":
            return "#4286f4";
        case "wind":
            return "#1daf0f";
        case "thunder":
            return "#fffa00";
        case "light":
            return "#a2c1c1";
        case "dark":
            return "#23021e";
    }
}
