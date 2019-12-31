const BUILDER = require('./embedbuilders/dragEmbedBuilder');
const HELPER = require('./embedbuilders/helpers/dragHelper');
const GENERAL = require('./embedbuilders/helpers/generalHelper');
const ADV_DATA = require('./embedbuilders/helpers/data/dragalia/units');
const DRG_DATA = require('./embedbuilders/helpers/data/dragalia/dragons');
const PNT_DATA = require('./embedbuilders/helpers/data/dragalia/prints');
const WPN_DATA = require('./embedbuilders/helpers/data/dragalia/weapons');
module.exports = {
    name: 'dragt',
    display: 'Dragalia Lost',
    description: '`>drag [unit/dragon/weapon/print]` will return information on (mostly) anything in Dragalia Lost.',
    async execute(message, args) {
        await GENERAL.startTypingAlert(message);
        switch (await HELPER.getEmbedType(args.join(" "), ADV_DATA.units, DRG_DATA.dragons, WPN_DATA.weapons, PNT_DATA.prints)) {
            case "unit":
                await GENERAL.paginationEmbed(
                    message,
                    await BUILDER.unitEmbed(message, args, ADV_DATA.units),
                    GENERAL.nextButtons,
                    GENERAL.paginationTimeOut
                );
                break;
            case "dragon":
                await GENERAL.paginationEmbed(
                    message,
                    await BUILDER.dragonEmbed(message, args, DRG_DATA.dragons),
                    GENERAL.nextButtons,
                    GENERAL.paginationTimeOut
                );
                break;
            case "weapon":
                message.channel.send(await BUILDER.weaponEmbed(message, args, WPN_DATA.weapons));
                break;
            case "print":
                await GENERAL.paginationEmbed(
                    message,
                    await BUILDER.printEmbed(message, args, PNT_DATA.prints),
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
