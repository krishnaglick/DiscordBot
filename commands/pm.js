const BUILDER = require("./embedbuilders/pmEmbedBuilder");
const GENERAL = require("./embedbuilders/helpers/generalHelper");
module.exports = {
    name: "ms",
    display: "Pokemon Masters New!",
    description: "Try out the new redesigned masters search with `>ms [trainer or pokemon name]`",
    async execute(message, args, client) {
        if (message.content.startsWith(">ms pooldata")) {
            await GENERAL.startTypingAlert(message);
            if (message.content.includes("trainers")) {
                message.channel.send("Pooling trainer JSON data.");
                await BUILDER.joinJSON("trainers");
                message.channel.send("done.");
            } else {
                message.channel.send("Pooling pokemon JSON data.");
                await BUILDER.joinJSON("pokemon");
                message.channel.send("done.");
            }
            await GENERAL.stopTypingAlert(message);
        } else {
            await GENERAL.startTypingAlert(message);
            //message.channel.send(await BUILDER.pairSearchEmbed(args[0], client));
            try {
                await GENERAL.paginationEmbed(
                    message,
                    await BUILDER.pairSearchEmbed(args, client),
                    GENERAL.nextButtons,
                    GENERAL.paginationTimeOut,
                );
            } catch (err) {
                console.error(err);
            }
            await GENERAL.stopTypingAlert(message);
        }
    },
};
