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
        return data.cargoquery;
    },
    /**
     *
     * @param desired
     * @param collection
     * @param message
     * @returns {Promise<*>}
     */
    searchCollection: async function (desired, collection, message) {
        try {
            for (const goal of collection) {
                if (goal.title.Name.toUpperCase() === desired.toUpperCase()) {
                    return goal.title;
                }
            }
        } catch (e) {
            helper.errorSend("You've entered the command without a unit/print/weapon/dragon name.",
                "Try redoing the command properly: `>drag [unit/dragon/weapon/print]`", message);
        }
    },
    getImage: async function (args) {
        var nameFinal = await helper.stringEdgeCase(args);
        var url = 'https://dragalialost.gamepedia.com/' + nameFinal.replace(" ", "_");
        await request(url, (error, response, html) => {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(html);
                const body = $('body');
                return body.find($('.adv-portrait')).children().find($('img')).attr('src');
            }
        })
    }
};
