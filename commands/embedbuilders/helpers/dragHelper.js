const fetch = require("node-fetch");
const cheerio = require('cheerio');
const request = require('request');
const Discord = require('discord.js');
const paginationEmbed = require('discord.js-pagination');
const {MessageEmbed} = require('discord.js');
const AsciiTable = require('ascii-table');
const helper = require('./general');
module.exports = {
    /**
     *
     * @returns {Promise<string>}
     */
    getEmbedType: async function (desired, units, dragons, weapons, prints) {
        if (await helper.isInCollection(desired, units)) {
            return "unit";
        }
        if (await helper.isInCollection(desired, dragons)) {
            return "dragon";
        }
        if (await helper.isInCollection(desired, weapons)) {
            return "weapon";
        }
        if (await helper.isInCollection(desired, prints)) {
            return "print";
        }
        return ('None')
    }
    ,
    /**
     *
     * @param desired
     * @param collection
     * @param message
     * @returns {Promise<*>}
     */
    searchCollectionSingle: async function (desired, collection, message) {
        try {
            for (const goal of collection) {
                if (goal.name.toUpperCase() === desired.toUpperCase()) {
                    return goal;
                }
            }
        } catch (e) {
            await helper.errorSend("You've entered the command without a unit/print/weapon/dragon name.",
                "Try redoing the command properly: `>drag [unit/dragon/weapon/print]`", message);
        }
    },
    /**
     *
     * @param args
     * @returns {Promise<unknown>}
     */
    getImage: async function (args) {
        let nameFinal = await helper.stringEdgeCase(args);
        let url = 'https://dragalialost.gamepedia.com/' + nameFinal.replace(" ", "_");
        let image = new Promise((resolve) => {
            request(url, async (error, response, html) => {
                if (!error && response.statusCode === 200) {
                    const $ = cheerio.load(html);
                    const body = $('body');
                    const image = body.find($('.adv-portrait')).children().find($('img')).attr('src');
                    resolve(image);
                }
            });
        });
        return await image;
    },
    /**
     *
     * @param elem
     * @returns {Promise<string>}
     */
    getElementImage: async function (elem) {
        switch (elem) {
            case "Flame":
                return 'https://gamepedia.cursecdn.com/dragalialost_gamepedia_en/thumb/5/57/Icon_Element_Flame.png/19px-Icon_Element_Flame.png?version=93869689432f028c9512a1ee3b10f615';
            case "Water":
                return 'https://gamepedia.cursecdn.com/dragalialost_gamepedia_en/thumb/8/80/Icon_Element_Water.png/19px-Icon_Element_Water.png?version=f3dd8ff8dc143d3c60d4b59a62bcf317';
            case "Wind":
                return 'https://gamepedia.cursecdn.com/dragalialost_gamepedia_en/thumb/6/62/Icon_Element_Wind.png/19px-Icon_Element_Wind.png?version=0b1d41ad1bd00a810f13e583622b34c0';
            case "Shadow":
                return 'https://gamepedia.cursecdn.com/dragalialost_gamepedia_en/thumb/0/0d/Icon_Element_Shadow.png/19px-Icon_Element_Shadow.png?version=84a3a06f13b0e4fd51006fdadd97f944';
            case "Light":
                return 'https://gamepedia.cursecdn.com/dragalialost_gamepedia_en/thumb/1/19/Icon_Element_Light.png/19px-Icon_Element_Light.png?version=e09c55012f71496a9234c49a37d02793';
        }
    },
    /**
     *
     * @param elem
     * @returns {Promise<string>}
     */
    getEmbedColor: async function (elem) {
        switch (elem) {
            case 'Flame':
                return "#ff0000";
            case 'Water':
                return "#3366cc";
            case 'Wind':
                return "#33cc33";
            case 'Shadow':
                return "#660066";
            case 'Light':
                return "#ffff66";
        }
    },
    /**
     *
     * @param rarity
     * @returns {Promise<string>}
     */
    getRarityColor: async function (rarity) {
        switch (parseInt(rarity)) {
            case 3:
                return "#cd7f32";
            case 4:
                return "#C0C0C0";
            case 5:
                return "#D4AF37";
            case 6:
                return "#ba00ba";
            default:
                return "#3e3e3e"
        }
    },
    /**
     *
     * @param skills
     * @returns {Promise<string>}
     */
    generateSkillsOutput: async function (skills) {
        let skillOut = "";
        for (const skill of skills) {
            skillOut += "**" + skill.name + "** ・ " + skill.cost + " SP ・ ";
            skillOut += (skill.regen !== "None")
                ? skill.regen + " ・ " + skill.iframe + " I-Frames"
                : skill.iframe + " I-Frames";
            skillOut += '\n';
            skillOut += skill.levels[skill.levels.length - 1].description;
            skillOut += '\n';
        }
        return skillOut
    },
    /**
     *
     * @param skill
     * @returns {Promise<string>}
     */
    generateSkillOutput: async function (skill) {
        let skillOut = "";
        skillOut += "**" + skill.name + "**\n";
        (skill.levels[skill.levels.levels - 1] === '')
            ? skillOut += '-'
            : skillOut += skill.levels[skill.levels.levels - 1];
        return skillOut;
    },
    /**
     *
     * @param skills
     * @returns {Promise<string>}
     */
    generateAbilityOutput: async function (abilities) {
        let abilitiesOut = "";
        for (const ability of abilities) {
            abilitiesOut += "**" + ability[ability.length - 1].name + "**\n";
            abilitiesOut += ability[ability.length - 1].effect + "\n";
        }
        return abilitiesOut;
    },
    /**
     *
     * @returns {Promise<string>}
     * @param coab
     */
    generateCoAb: async function (coab) {
        return (
            "**Base:** " + coab.baseEffect + "\n"
            + "**Max:** " + coab.upgrades[coab.upgrades.length - 1]
        )
    }
};

