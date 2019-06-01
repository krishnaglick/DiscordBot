const cheerio = require('cheerio')
const request = require('request')
const Discord = require('discord.js');
const cheerioTableparser = require('cheerio-tableparser')
module.exports = {
    name: 'drag',
    description: 'view the drag wiki',
    execute(message, args) {
        if(args[0] == null){
            url = 'https://dragalialost.gamepress.gg/';
            request(url, (error, response, html) => {
                if (!error && response.statusCode === 200) {
                    const $ = cheerio.load(html);
                    const body = $('body');
                    cheerioTableparser($);
                    const running = $('table').find($('.event-countdown-table'));
                    console.log(running);
                }
            });
        }
        else{
            var append = "";
            for(var x = 0; x < args.length; x++){
                if(x !== 0){
                    append += "_";
                }
                append += args[x].charAt(0).toUpperCase() + args[x].slice(1);
            }
            append = append.replace('\'','%27');
            var url = 'https://dragalialost.gamepedia.com/' + append.replace(" ","_");
            request(url, (error, response, html) => {
                if(!error && response.statusCode === 200) {
                    const $ = cheerio.load(html);
                    const body = $('body');
                    const infoArr = {};
                    const unitName = $('h1').html();
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
                    const info = body.find($('.dd-description')).each(function (i, elem) {
                        infoArr[i] = $(this).text()
                    });
                    //get unit type
                    const title = body.find($('.panel-heading div[style]')).text();
                    //get unit rarity
                    const rarity = body.find($('.dd-description div[style]')).find($('img')).last().attr('src');

                    cheerioTableparser($);
                    const unitTable = $('table')
                    const data = $(unitTable).parsetable(true,true,true);
                    var s1 = ["**" + data[0][0] + ": **", data[0][1].substring(data[0][1].indexOf('Lv. 3'),data[0][1].length).replace('Lv. 3','')];
                    var s2 = ["**" + data[0][2] + ": **", data[0][3].substring(data[0][3].indexOf('Lv. 2'),data[0][3].length).replace('Lv. 2','')];
                    var coab = ["**" + data[0][4] + "**", data[0][5].substring(data[0][5].lastIndexOf('\n')+1)];
                    var p1 = ["**" + data[0][6] + ": **", data[0][7].substring(data[0][7].lastIndexOf('\t')+1)];
                    var p2 = ["**" + data[0][8] + ": **", data[0][9].substring(data[0][9].lastIndexOf('\t')+1)];
                    var p3 = ["**" + data[0][10] + ": **", data[0][11].substring(data[0][11].lastIndexOf('\t')+1)];
                    const embed = new Discord.RichEmbed()
                        .setColor(elementColor)
                        .setAuthor(unitName + ": " + title, elem)
                        .setImage(image)
                        .setThumbnail(rarity)
                        .addField("ENG VA",infoArr[9],true)
                        .addField("JP VA",infoArr[10],true)
                        .addField("---Co-Ability:---", coab)
                        .addField("-----Skills:-----",s1[0]+s1[1]+"\n"+s2[0]+s2[1])
                        .addField("-----Ability:-----",p1[0]+p1[1]+"\n"+p2[0]+p2[1]+"\n"+p3[0]+p3[1]);
                    message.channel.send({embed})
                }
            });
        }
    },
};

