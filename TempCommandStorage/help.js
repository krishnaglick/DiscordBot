const Discord = require('discord.js');
module.exports = {
    name: 'helpt',
    description: 'help',
    execute(message, args) {
        const embed = new Discord.RichEmbed()
            .setColor("BLUE")
            .setAuthor("Commands")
            .addField(">drag", "Returns information about any Dragalia Lost Unit, Weapon, or Dragon.")
            .addField(">pm", "Returns information about any Pokemon Masters sync pair (UNDER CONSTRUCTION).")
            .addField(">poke", "Returns information about any pokemon.")
            .addField(">flip", "Flip a coin.");
        message.channel.send({embed})
    },
};