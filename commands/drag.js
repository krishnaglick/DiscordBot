const cheerio = require('cheerio')
const request = require('request')
const Discord = require('discord.js');
module.exports = {
    name: 'drag',
    description: 'view the drag wiki',
    execute(message, args) {
        url = 'https://dragalialost.gamepedia.com/' + args[0]
        request(url, (error, response, html) => {
            if(!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                const body = $('body')
                const infoArr = {}
                const unitName = $('h1').html()
                var elementColor;
                //get unit element
                const elem = body.find($('.panel-heading')).children().find($('img')).attr('src');
                //set embed color
                switch (elem) {
                    case 'https://gamepedia.cursecdn.com/dragalialost_gamepedia_en/thumb/5/57/Icon_Element_Flame.png/19px-Icon_Element_Flame.png?version=93869689432f028c9512a1ee3b10f615':
                        elementColor = "#ff0000"; break;
                    case 'https://gamepedia.cursecdn.com/dragalialost_gamepedia_en/thumb/8/80/Icon_Element_Water.png/19px-Icon_Element_Water.png?version=f3dd8ff8dc143d3c60d4b59a62bcf317':
                        elementColor = "#3366cc"; break;
                    case 'https://gamepedia.cursecdn.com/dragalialost_gamepedia_en/thumb/6/62/Icon_Element_Wind.png/19px-Icon_Element_Wind.png?version=0b1d41ad1bd00a810f13e583622b34c0':
                        elementColor = "#33cc33"; break;
                    case 'https://gamepedia.cursecdn.com/dragalialost_gamepedia_en/thumb/0/0d/Icon_Element_Shadow.png/19px-Icon_Element_Shadow.png?version=84a3a06f13b0e4fd51006fdadd97f944':
                        elementColor = "#660066"; break;
                    case 'https://gamepedia.cursecdn.com/dragalialost_gamepedia_en/thumb/1/19/Icon_Element_Light.png/19px-Icon_Element_Light.png?version=e09c55012f71496a9234c49a37d02793':
                        elementColor = "#ffff66"; break;
                }
                //get unit portrait
                const image = body.find($('.adv-portrait')).children().find($('img')).attr('src');
                //get unit info array
                const strength = body.find($('.dd-description')).each(function (i, elem) {
                    infoArr[i] = $(this).text()
                })
                //get unit type
                const type = body.find($('.dd-description')).find($('img')).attr('src');
                //get unit rarity
                const rarity = body.find($('.dd-description div[style]')).find($('img')).last().attr('src');
                const embed = new Discord.RichEmbed()
                    .setColor(elementColor)
                    .setAuthor(unitName, elem)
                    .setImage(image)
                    .setThumbnail(rarity)
                    .addField("Base HP",infoArr[0],true)
                    .addField("Base STR",infoArr[1],true)
                    .addField("Base DEF",infoArr[2],true)
                    .addField("Availability",infoArr[13],true)
                    .addField("Showcase",infoArr[11])
                    .addField("ENG VA",infoArr[9],true)
                    .addField("JP VA",infoArr[10],true)
                message.channel.send({embed})
            }
        })
    },
};

