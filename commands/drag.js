const BUILDER = require('./embedbuilders/dragEmbedBuilder');
const HELPER = require('./embedbuilders/helpers/dragHelper');
const GENERAL = require('./embedbuilders/helpers/generalHelper');
module.exports = {
    name: 'drag',
    display: 'Dragalia Lost',
    description: '`>drag [unit/dragon/weapon/print]`\nWill return information on (mostly) anything in Dragalia Lost.',
    async execute(message, args, client, data) {
        const dataStore = data.dragalia;
        await GENERAL.startTypingAlert(message);
        switch (await HELPER.getEmbedType(args.join(" "), dataStore.units, dataStore.dragons, dataStore.weapons, dataStore.prints)) {
            case "unit":
                await GENERAL.paginationEmbed(
                    message,
                    await BUILDER.unitEmbed(message, args, dataStore.units),
                    GENERAL.nextButtons,
                    GENERAL.paginationTimeOut
                );
                break;
            case "dragon":
                await GENERAL.paginationEmbed(
                    message,
                    await BUILDER.dragonEmbed(message, args, dataStore.dragons),
                    GENERAL.nextButtons,
                    GENERAL.paginationTimeOut
                );
                break;
            case "weapon":
                message.channel.send(await BUILDER.weaponEmbed(message, args, dataStore.weapons));
                break;
            case "print":
                await GENERAL.paginationEmbed(
                    message,
                    await BUILDER.printEmbed(message, args, dataStore.prints),
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
