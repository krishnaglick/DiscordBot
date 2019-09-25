const BUILDER = require('./embedbuilders/dragEmbedBuilder');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'dragt',
    display: 'Dragalia Lost',
    description: '`>drag [unit/dragon/weapon/print]` will return information on (mostly) anything in Dragalia Lost.',
    async execute(message, args) {
        message.channel.send(await BUILDER.unitEmbed(message,args));
    }
};