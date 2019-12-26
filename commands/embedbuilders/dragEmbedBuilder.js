const HELPER = require('./helpers/dragHelper');
const Discord = require('discord.js');
const GENERAL = require("./helpers/general");
module.exports = {
    unitEmbed: async function (message, args, units) {
        let unit = await HELPER.searchCollectionSingle(args.join(" "), units, message);
        let abilitiesFinal = await HELPER.generateAbilityOutput(unit.abilities);
        let skillsFinal = await HELPER.generateSkillOutput(unit.skills);
        let nameFinal = unit.name + ": " + unit.title + " | " + await GENERAL.generateStars(unit.rarity);
        let iconFinal = await HELPER.getElementImage(unit.element);
        let colorFinal = await HELPER.getEmbedColor(unit.element);
        return [
            new Discord.RichEmbed()
                .setAuthor(nameFinal, iconFinal)
                .addField("Weapon", unit.weapon, true)
                .addField("HP", unit.hp, true)
                .addField("ATK", unit.atk, true)
                .addField("Co-Ab", await HELPER.generateCoAb(unit.coability))
                .addField("Abilities", abilitiesFinal)
                .addField("Skills", skillsFinal)
                .setColor(colorFinal),
            new Discord.RichEmbed()
                .setAuthor(nameFinal, iconFinal)
                .addField("VA", unit.cv[0] + " | " + unit.cv[1])
                .addField("Description", unit.description)
                .setColor(colorFinal)
                .setImage(unit.image),
        ];
    },
    dragonEmbed: async function (message, args, dragons){

    },
    weaponEmbed: async function (message, args, weapons){

    },
    printEmbed: async function (message, args, prints){

    }
};
