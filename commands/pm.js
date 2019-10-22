const BUILDER = require('./embedbuilders/pmEmbedBuilder');
const GENERAL = require("./embedbuilders/helpers/general");
const paginationEmbed = require('discord.js-pagination');
module.exports = {
    name: 'ms',
    description: 'masters test',
    async execute(message, args, client) {
        GENERAL.startTypingAlert(message);
        //message.channel.send(await BUILDER.pairSearchEmbed(args[0], client));
        await paginationEmbed(message, await BUILDER.pairSearchEmbed(args[0], client), GENERAL.nextButtons, GENERAL.paginationTimeOut);
        GENERAL.stopTypingAlert(message);
    },
};
//Todo: known isses: pallosand.json is missing
