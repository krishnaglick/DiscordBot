const Discord = require('discord.js');
module.exports = {
    name: 'help',
    description: 'help',
    execute(message, args) {
        const embed = new Discord.RichEmbed()
            .setColor("BLUE")
            .setAuthor("Commands")
            .addField(">drag", "Returns information about any Dragalia Lost Unit or Dragon")
            .addField(">pm", "Returns information about any Pokemon Masters sync pair (UNDER CONSTRUCTION)")
            .addField(">poke", "Returns information about any pokemon");
        message.channel.send({embed})
    },
};