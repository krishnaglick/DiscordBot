const HELPER = require('./helpers/dragHelper');
const GENERAL = require("./helpers/generalHelper");
const Discord = require('discord.js');
module.exports = {
    unitEmbed: async function (message, args, units) {
        let unit = await HELPER.searchCollectionSingle(args.join(" "), units, message);
        let abilitiesFinal = await HELPER.generateAbilityOutput(unit.abilities);
        let skillsFinal = await HELPER.generateSkillsOutput(unit.skills);
        let nameFinal = unit.name + ": " + unit.title + " | " + await GENERAL.generateStars(unit.rarity);
        let iconFinal = await HELPER.getElementImage(unit.element);
        let colorFinal = await HELPER.getEmbedColor(unit.element);
        const baseEmbed = new Discord.RichEmbed();
        baseEmbed
            .setAuthor(nameFinal, iconFinal)
            .addField("Weapon", unit.weapon, true)
            .addField("HP", unit.hp, true)
            .addField("ATK", unit.atk, true)
            .addField("Co-Ab", await HELPER.generateCoAb(unit.coability));
        for(const ability of abilitiesFinal){
            baseEmbed.addField("Abilities", ability, true);
        }
        baseEmbed
            .addField("Skills", skillsFinal)
            .setColor(colorFinal);
        return [
            baseEmbed,
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
        let iconFinal = await HELPER.getElementImage(dragon.element);
        let nameFinal = (dragon.name.includes('('))
            ? dragon.name.substring(0, dragon.name.indexOf('(') - 1) + ": " + dragon.title + " | " + await GENERAL.generateStars(dragon.rarity)
            : dragon.name + ": " + dragon.title + " | " + await GENERAL.generateStars(dragon.rarity);
        let skillOutFinal = await HELPER.generateSkillOutput(dragon.skill);
        let auraOutFinal = await HELPER.generateDragonAuraOutput(dragon.abilities);
        let comboTable = await HELPER.generateComboTable(dragon.comboTable);
        let colorFinal = await HELPER.getEmbedColor(dragon.element);
        if (!dragon.isLocked) {
            return [
                new Discord.RichEmbed()
                    .setAuthor(nameFinal, iconFinal)
                    .addField('HP', dragon.hp, true)
                    .addField('ATK', dragon.str, true)
                    .addField('Skill', skillOutFinal)
                    .addField('Ability', auraOutFinal)
                    .addField('Combo', comboTable)
                    .setColor(colorFinal)
                    .setImage(dragon.image),
                new Discord.RichEmbed()
                    .setAuthor(nameFinal, iconFinal)
                    .setColor(colorFinal)
                    .setImage(dragon.image),
            ]
        } else {
            return [
                new Discord.RichEmbed()
                    .setAuthor(nameFinal, iconFinal)
                    .addField('HP', '-', true)
                    .addField('ATK', '-', true)
                    .addField('Skill', skillOutFinal)
                    .addField('Combo', comboTable)
                    .setColor(colorFinal)
                    .setImage(dragon.image),
                new Discord.RichEmbed()
                    .setAuthor(nameFinal, iconFinal)
                    .setColor(colorFinal)
                    .setImage(dragon.image),
            ]
        }
    },
    weaponEmbed: async function (message, args, weapons) {
        let weapon = await HELPER.searchCollectionSingle(args.join(" "), weapons, message);
        const nameFinal = weapon.name + " | " + weapon.element + " " + weapon.type + ' | ' + await GENERAL.generateStars(weapon.rarity);
        const colorFinal = await HELPER.getRarityColor(weapon.rarity);
        const skillOut = await HELPER.generateSkillOutput(weapon.skill);
        const abilitiesOut = await HELPER.generateWeaponSkillOutput(weapon.abilities);
        return new Discord.RichEmbed()
            .setAuthor(nameFinal)
            .addField('ATK', weapon.atk, true)
            .addField('HP', weapon.hp, true)
            .addField('Skill', skillOut)
            .addField('Abilities', abilitiesOut)
            .setImage(weapon.image)
            .setColor(colorFinal)
    },
    printEmbed: async function (message, args, prints) {
        let print = await HELPER.searchCollectionSingle(args.join(" "), prints, message);
        const nameFinal = print.name + ' | ' + print.type + ' | ' + await GENERAL.generateStars(print.rarity);
        const storyOut = [];
        print.descriptions.map(elem => storyOut.push(elem + '\n'));
        const colorFinal = await HELPER.getRarityColor(print.rarity);
        return [
            new Discord.RichEmbed()
                .setAuthor(nameFinal)
                .addField('HP', print.hp, true)
                .addField('ATK', print.atk, true)
                .addField('Abilities', await HELPER.generatePrintSkillOutput(print.skills, false))
                .setColor(colorFinal)
                .setImage(print.images[0]),
            new Discord.RichEmbed()
                .setAuthor(nameFinal)
                .addField('HP', print.hp, true)
                .addField('ATK', print.atk, true)
                .addField('Abilities', await HELPER.generatePrintSkillOutput(print.skills, true))
                .setColor(colorFinal)
                .setImage(print.images[1]),
            new Discord.RichEmbed()
                .setAuthor(nameFinal)
                .addField('Story', storyOut)
                .setColor(colorFinal)
        ]
    }
};

