const cheerio = require('cheerio')
const request = require('request')
const Discord = require('discord.js');
const cheerioTableparser = require('cheerio-tableparser')
var results =[]
module.exports = {
    name: 'drag',
    description: 'view the drag wiki',
    execute(message, args) {
        url = 'https://dragalialost.gamepedia.com/' + args[0]
        request(url, (error, response, html) => {
            if(!error && response.statusCode == 200) {
                const $ = cheerio.load(html);

                const unitName = $('h1').html();
                console.log(unitName);

                const imag = $('img').attr('src');
                console.log(imag);
                const embed = new Discord.RichEmbed()
                    .setAuthor(unitName, imag)
                message.channel.send({embed});
            }
        })
    },
};
