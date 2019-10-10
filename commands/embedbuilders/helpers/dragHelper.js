const fetch = require("node-fetch");
const cheerio = require('cheerio');
const Discord = require('discord.js');
const paginationEmbed = require('discord.js-pagination');
const {MessageEmbed} = require('discord.js');
const AsciiTable = require('ascii-table');
const request = require('request');
const helper = require('./general');
module.exports = {
    /**
     *
     * @param source - JSON url
     * @returns {Promise<*>}
     */
    getData: async function (source) {
        var data = await fetch(source)
            .then(response => response.json())
            .then(JSON => data = JSON);
        return data;
    },
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
                if (goal.FullName.toUpperCase() === desired.toUpperCase()) {
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
     * @param desired
     * @param collection
     * @param message
     * @returns {Promise<[]>}
     */
    searchCollectionMultiple: async function (desired, collection, message) {
        let out = [];
        try {
            for (const element of collection) {
                for (const any of desired) {
                    if (element.Id === any) {
                        out.push(element);
                    }
                }
            }
        } catch (e) {
            await helper.errorSend("You've entered the command without a unit/print/weapon/dragon name.",
                "Try redoing the command properly: `>drag [unit/dragon/weapon/print]`", message);
        }
        return out;
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
    generateStars: async function (rarity) {
        let stars = "";
        for (let i = 0; i < parseInt(rarity); i++) {
            stars += "⭐";
        }
        return stars;
    },
    generateSkillOutput: async function (unitName, matching, data) {
        let skillData = [[],[]];
        for(let unit of matching){
            if(unit.title.toUpperCase() === unitName.toUpperCase()){
                skillData[0].push(unit.skill1);
                skillData[1].push(unit.skill2);
            }
        }
        for(let skill of data){
            if(skill.Name.includes(skillData[0][0])){
                skillData[0].push(skill.description);
            }
            if(skill.Name.includes(skillData[1][0])){
                skillData[1].push(skill.description);
            }
        }
        console.log(skillData);
        return skillData;
    },
    /**
     *
     * @param skills
     * @returns {Promise<string>}
     */
    generateAbilityOutput: async function (skills) {
        let output = "";
        let formattedSkills = [
            {levels: []},
            {levels: []},
            {levels: []}
        ];
        for (let i = 0; i < formattedSkills.length; i++) {
            for (let j = i * 2; j < i * 2 + 2; j++) {
                if (skills[j] !== undefined) {
                    formattedSkills[i].levels.push(skills[j]);
                }
            }
        }
        for (let skill of formattedSkills) {
            let skillDesc = "";
            if (skill.levels.length > 1) {
                skill.levels.sort((a, b) => {
                        if (a.Id > b.Id) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                );
                skillDesc = skill.levels[1].Details.replace("\'\'\'", "").replace("\'\'\'", "");
            } else {
                skillDesc = skill.levels[0].Details.replace("\'\'\'", "").replace("\'\'\'", "");
            }
            let thisOutName = "**" + skill.levels[0].GenericName;
            for (let tier of skill.levels) {
                thisOutName += " " + tier.Name.replace(tier.GenericName, " ") + " /";
            }
            let nameFinal = thisOutName.substring(0, thisOutName.length - 1) + "**\n";
            output += nameFinal + skillDesc + "\n";
        }
        return output;
    },
    /**
     *
     * @param unit
     * @param weapon
     * @returns {Promise<string>}
     */
    generateCoAb: async function (unit, weapon) {
        switch (unit.Name) {
            case "Euden":
                return "Dragon Form = damage +6/7/8/9/10%, Shapeshift Time +10/15/20%";
            default:
                switch (weapon) {
                    case "Sword":
                        return "Dragon gauge fill rate +5/6/8/11/15%";
                    case "Dagger":
                        return "Crit Rate +5/6/7/8/10%";
                    case "Blade":
                        return "Strength +5/6/7/8/10%";
                    case "Axe":
                        return "Defense +9/10/11/12/15%";
                    case "Lance":
                        return "HP +7/8/9/12/15%";
                    case "Bow":
                        return "Skill gauge fill rate +8/9/11/12/15%";
                    case "Wand":
                        return "Skill Damage +8/9/11/12/15%";
                    case "Staff":
                        return "Recovery Potency +10/12/14/16/20%"
                }
        }
    }
};
