const cheerio = require('cheerio')
const request = require('request')
const Discord = require('discord.js');
const cheerioTableparser = require('cheerio-tableparser');

module.exports = {
    name: 'rs',
    description: 'Display information from the OSRS wiki.',
    execute(message, args) {
        var url;
        switch(args[0]){
            case "price":
                var append = "w/";
                for(var x = 1; x < args.length; x++){
                    console.log(args[x]);
                    if(x !== 1){
                        append += "_";
                    }
                    append += args[x];
                }
                url = 'https://oldschool.runescape.wiki/' + append;
                console.log(url);
                parsePrice(url, message);
                break;
        }
    },
};

function parsePrice(url, message){
    request(url, (error, response, html) => {
        if(!error && response.statusCode === 200) {
            const $ = cheerio.load(html);
            const body = $('body');
            const itemName = $('h1').text();
            const img = body.find($('img')).attr('src');
            const price = body.find($('.infobox-quantity')).text();
            console.log('https://oldschool.runescape.wiki' + img);
            const embed = new Discord.RichEmbed()
                .setColor('#b76400')
                .setAuthor(itemName + " price: " + price.substring(0, price.indexOf("(info")));
                //.setImage(img)
            message.channel.send({embed})
        }
    })
}