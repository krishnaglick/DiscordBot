const cheerio = require('cheerio');
const request = require('request');
const Discord = require('discord.js');
const cheerioTableparser = require('cheerio-tableparser');
module.exports = {
    name: 'sino',
    description: 'Parses the Yugioh Wiki',
    execute(message, args) {
        var append = "";
        for(var x = 0; x < args.length; x++){
            if(x !== 0){
                append += "_";
            }
            if(args[x] !== "of"){
                append += args[x].charAt(0).toUpperCase() + args[x].slice(1);
            }
            else{
                append += args[x]
            }
        }
        append = append.replace('\'','%27');
        console.log(`YGO: ${message.author.username} requested ${append}`);
        var url = 'https://sinoalice.wiki/' + append + '/Jobs';
        request(url, (error, response, html) => {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(html);
                cheerioTableparser($);
                const body = $('body');
                const wikitable = body.find($('.wikitable'));
                const data = $(cardtable).parsetable(true,true,true);
                const img = wikitable.find($('img')).attr('src');
                for(x in data){
                    for(var y in data[x]) {
                        if(x < 1){
                            //console.log(y + " : " + data[x][y]);
                        }
                    }
                }
                const embed = new Discord.RichEmbed()
                    .setImage(img);
                message.channel.send({embed});
            }
        });
    },
};