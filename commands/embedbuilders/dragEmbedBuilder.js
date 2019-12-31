const HELPER = require('./helpers/dragHelper');
const Discord = require('discord.js');
const GENERAL = require("./helpers/general");
module.exports = {
    unitEmbed: async function (message, args, units) {
        let unit = await HELPER.searchCollectionSingle(args.join(" "), units, message);
        let abilitiesFinal = await HELPER.generateAbilityOutput(unit.abilities);
        let skillsFinal = await HELPER.generateSkillsOutput(unit.skills);
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
    dragonEmbed: async function (message, args, dragons) {
        let dragon = await HELPER.searchCollectionSingle(args.join(" "), dragons, message);
        let nameFinal = (dragon.name.includes('('))
            ? dragon.name.substring(0, dragon.name.indexOf('(')-1) + ": " + dragon.title + " | " + await GENERAL.generateStars(dragon.rarity)
            : dragon.name + ": " + dragon.title + " | " + await GENERAL.generateStars(dragon.rarity);
        let skillOutFinal = await HELPER.generateSkillOutput(dragon.skill);
        let auraOutFinal = await HELPER.generateDragonAuraOutput(dragon.abilities);
        let comboTable = await HELPER.generateComboTable(dragon.comboTable);
        let colorFinal = await HELPER.getEmbedColor(dragon.element);
        if (!dragon.isLocked) {
            return [
                new Discord.RichEmbed()
                    .setAuthor(nameFinal)
                    .addField('HP', dragon.hp, true)
                    .addField('ATK', dragon.str, true)
                    .addField('Skill', skillOutFinal)
                    .addField('Ability', auraOutFinal)
                    .addField('Combo', comboTable)
                    .setColor(colorFinal)
                    .setImage(dragon.image),
                new Discord.RichEmbed()
                    .setAuthor(nameFinal)
                    .setColor(colorFinal)
                    .setImage(dragon.image),
            ]
        } else {
            return [
                new Discord.RichEmbed()
                    .setAuthor(nameFinal)
                    .addField('HP', '-', true)
                    .addField('ATK', '-', true)
                    .addField('Skill', skillOutFinal)
                    .addField('Combo', comboTable)
                    .setColor(colorFinal)
                    .setImage(dragon.image),
                new Discord.RichEmbed()
                    .setAuthor(nameFinal)
                    .setColor(colorFinal)
                    .setImage(dragon.image),
            ]
        }

    },
    weaponEmbed: async function (message, args, weapons) {
        let weapon = await HELPER.searchCollectionSingle(args.join(" "), weapons, message);
        return new Discord.RichEmbed()
            .setAuthor(weapon.name)

    },
    printEmbed: async function (message, args, prints) {
        let print = await HELPER.searchCollectionSingle(args.join(" "), prints, message);
        return [
            new Discord.RichEmbed()
                .setAuthor(print.name)
        ]
    }
};
