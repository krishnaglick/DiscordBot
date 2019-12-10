const BUILDER = require('./embedbuilders/dragEmbedBuilder');
const HELPER = require('./embedbuilders/helpers/dragHelper');
const Discord = require('discord.js');
const {MessageEmbed} = require('discord.js');
const paginationEmbed = require('discord.js-pagination');
const GENERAL = require('./embedbuilders/helpers/general');
const ADV_DATA = require('./embedbuilders/helpers/data/dragalia/units');
module.exports = {
    name: 'dragt',
    display: 'Dragalia Lost',
    description: '`>drag [unit/dragon/weapon/print]` will return information on (mostly) anything in Dragalia Lost.',
    async execute(message, args) {

        await GENERAL.startTypingAlert(message);

        switch (await HELPER.getEmbedType(args.join(" "), ADV_DATA.units)) {
            case "unit":
                await paginationEmbed(
                    message,
                    await BUILDER.unitEmbed(message, args),
                    GENERAL.nextButtons,
                    GENERAL.paginationTimeOut
                );
                break;
            default:
                await GENERAL.errorSend("Unit Not Found", "Try your search again.", message)
        }


        await GENERAL.stopTypingAlert(message);
    }
};
