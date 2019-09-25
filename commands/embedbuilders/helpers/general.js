const Discord = require('discord.js');
const paginationEmbed = require('discord.js-pagination');
const { MessageEmbed } = require('discord.js');
const AsciiTable = require('ascii-table');
module.exports = {
    errorSend: async function (problem, solution, message) {
        var embed = new Discord.RichEmbed()
            .setColor('RED')
            .setAuthor('ERROR')
            .addField('Cause:', problem)
            .addField('Solution:', solution);
        message.channel.send({embed});
    },
    stringEdgeCase: async function (args) {
        var append = "";
        var capitalizationIgnoreDict = ['of', 'the'];
        for (var x = 0; x < args.length; x++) {
            if (x !== 0) {
                append += "_";
            }
            var match = false;
            for(var y in capitalizationIgnoreDict){
                if(args[x] === capitalizationIgnoreDict[y]){
                    match = true;
                }
            }
            if(match){
                append += args[x].charAt(0).toLowerCase() + args[x].slice(1);
            }else{
                append += args[x].charAt(0).toUpperCase() + args[x].slice(1);
            }
        }
        append = append.replace('\'', '%27');
        return append;
    }
};