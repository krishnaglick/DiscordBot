const BUILDER = require('./embedbuilders/pmEmbedBuilder');
const GENERAL = require("./embedbuilders/helpers/general");
const paginationEmbed = require('discord.js-pagination');
module.exports = {
    name: 'ms',
    display: 'Pokemon Masters New!',
    description: 'Try out the new redesigned masters search with `>ms [trainer or pokemon name]`',
    async execute(message, args, client) {
        GENERAL.startTypingAlert(message);
        //message.channel.send(await BUILDER.pairSearchEmbed(args[0], client));
        await paginationEmbed(message, await BUILDER.pairSearchEmbed(args[0], client), GENERAL.nextButtons, GENERAL.paginationTimeOut);
        GENERAL.stopTypingAlert(message);
    },
};

