const cheerio = require('cheerio');
const request = require('request');
const fetch = require('node-fetch');
const Discord = require('discord.js');
//const cheerioTableparser = require('cheerio-tableparser')

//So the discord wrapper runs without problems which is nice. Nothing happens of course because I think it has to be ran on the server
module.exports = {
    name: 'wf',
    description: 'Find weapons',
    execute(message, args) {
        //this is supposed to string match labels later so that I don't have to guess and check what position in an array a label is in
        //It's not working right now of course


        var append = "";
        for(var x = 0; x < args.length; x++){
            if(x !== 0){
                append += "_";
            }
            append += args[x].charAt(0).toUpperCase() + args[x].slice(1);
        }

        var url = 'https://warframe.fandom.com/wiki/'+ append.replace(" ","_");

request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {



        const $ = cheerio.load(html);
        const Name = $('h1').html()
        const body = $('body')
        const gunIcon = body.find($('a.image.image-thumbnail.link-internal')).children().find($('img')).attr('data-src');
        const imageLocation = $('div.floatnone')
        const imageLocationWarframe = $('figure.pi-item.pi-image')
        const labelArr = {}
        const valueArr = {}
        //div for the value to minimize links appearing in your scrape.
        const value = body.find($('div.pi-data-value')).each(function (i, elem) {
            valueArr[i] = $(this).text()
        })
        const label = body.find($('.pi-data-label')).each(function (i, elem) {
            labelArr[i] = $(this).text()
        })

        //This shit converts the object array into a normal 2 dimensional array.
        var convert2D = Object.keys(labelArr).map(function (key) {
            return[labelArr[key]];
        });

        var finalConvertedLabel = [];
        //This shit converts the 2 dimensional array into a 1 dimensional one. It took me 3 hours to figure out what I actually wanted to figure out
        //and like 10 minutes to find a solution because I didn't know WTF was going on because initially, I was trying to just loop through the
        //arrays like a normal human but not only do you not have to loop for anything because it's built into fucking javascript
        //I didn't realize until way later that cheerio was spitting out object arrays at me and that was why I could just fucking
        //index my way through.
        for(i = 0; i < convert2D.length; i++){
            finalConvertedLabel = finalConvertedLabel.concat(convert2D[i]);
        }

        var convert2D = Object.keys(valueArr).map(function (key) {
            return[valueArr[key]];
        });

        var finalConvertedValue = [];

        for(i = 0; i < convert2D.length; i++){
            finalConvertedValue = finalConvertedValue.concat(convert2D[i]);
        }


        var a = '';
        var b = '';
        var c =  '';
        var d = '';
        var e = '';
        var f = '';
        var g = '';

            if (finalConvertedValue.includes('Arch-Gun')){
                a = finalConvertedLabel.indexOf('Crit Chance');
                b = finalConvertedLabel.indexOf('Crit Multiplier');
                c = finalConvertedLabel.indexOf('Status Chance');
                d = finalConvertedLabel.indexOf('Fire Rate');
                f = finalConvertedLabel.indexOf('Disposition');
                e = finalConvertedLabel.indexOf('Reload Time');

            }else if (finalConvertedLabel.includes('Health')) {
                a = finalConvertedLabel.indexOf('Mastery Rank');
                b = finalConvertedLabel.indexOf('Health');
                c = finalConvertedLabel.indexOf('Energy');
                d = finalConvertedLabel.indexOf('Shield');
                e = finalConvertedLabel.indexOf('Armor');
                f = finalConvertedLabel.indexOf('Sprint Speed');
            }else if (finalConvertedLabel.includes('Attack Speed')) {
                a = finalConvertedLabel.indexOf('Attack Speed');
                b = finalConvertedLabel.indexOf('Crit Chance');
                c = finalConvertedLabel.indexOf('Crit Multiplier');
                d = finalConvertedLabel.indexOf('Status Chance');
                e = finalConvertedLabel.indexOf('Slide Attack');
                f = finalConvertedLabel.indexOf('Disposition');
                g = finalConvertedLabel.indexOf('Slam Attack');
            }else{
                a = finalConvertedLabel.indexOf('Ammo Type');
                b = finalConvertedLabel.indexOf('Crit Chance');
                c = finalConvertedLabel.indexOf('Crit Multiplier');
                d = finalConvertedLabel.indexOf('Status Chance');
                e = finalConvertedLabel.indexOf('Fire Rate');
                f = finalConvertedLabel.indexOf('Disposition');
            }

        //var image = imageLocation.find($('a.image.image-thumbnail')).attr('href');
        var imageGun = imageLocation.find($('img.lzyPlcHld')).attr('data-src');
        var imageWarframe = imageLocationWarframe.find($('img.pi-image-thumbnail')).attr('src');

        //This is going to be for testing in case I fuck something up and need to check stuff
/*
        console.log(finalConvertedLabel);
        console.log('==============================================' + '\n');
        console.log('==============================================' + '\n');
        console.log('==============================================' + '\n');
        console.log(finalConvertedValue);
*/

        var embed = new Discord.RichEmbed()
        if (finalConvertedLabel.includes('Health')) {
            embed = new Discord.RichEmbed()
                .setAuthor(Name)
                .setImage(imageWarframe)
                .addField("-----**Stats**-----",labelArr[a] + ":      " + valueArr[a] + "\n" +labelArr[b] + ":      " + valueArr[b]+ "\n" +labelArr[c] + ":       " + valueArr[c]+ "\n" +labelArr[d] + ":       " + valueArr[d]+ "\n" +labelArr[e] + ":       " + valueArr[e] )
                //.addField(labelArr[a], " " + valueArr[a])
                //.addField(labelArr[b], " " + valueArr[b])
                //.addField(labelArr[c], " " + valueArr[c])
                //.addField(labelArr[d], " " + valueArr[d])
                //.addField(labelArr[e], " " + valueArr[e])
        }else if (finalConvertedLabel.includes('Attack Speed')){
            embed = new Discord.RichEmbed()
                .setAuthor(Name + "    " + valueArr[f + 1], gunIcon)
                .setImage(imageGun)
                .addField(labelArr[a], " " + valueArr[a + 1])
                .addField(labelArr[b], " " + valueArr[b + 1])
                .addField(labelArr[c], " " + valueArr[c + 1])
                .addField(labelArr[d], " " + valueArr[d + 1])
                .addField(labelArr[e], " " + valueArr[e + 1])
                .addField(labelArr[g], " " + valueArr[g + 1])
        }else {
            embed = new Discord.RichEmbed()
                .setAuthor(Name + "    " + valueArr[f + 1], gunIcon)
                .setImage(imageGun)
                .addField(labelArr[a], " " + valueArr[a + 1])
                .addField(labelArr[b], " " + valueArr[b + 1])
                .addField(labelArr[c], " " + valueArr[c + 1])
                .addField(labelArr[d], " " + valueArr[d + 1])
                .addField(labelArr[e], " " + valueArr[e + 1])
        }
/*
        if (finalConvertedLabel.includes('Health')) {
            embed = new Discord.RichEmbed()
                .setAuthor(Name)
                .setImage(imageWarframe)
                .addField(labelArr[a], " " + valueArr[a])
                .addField(labelArr[b], " " + valueArr[b])
                .addField(labelArr[c], " " + valueArr[c])
                .addField(labelArr[d], " " + valueArr[d])
                .addField(labelArr[e], " " + valueArr[e])
        }else if (finalConvertedLabel.includes('Attack Speed')){
            embed = new Discord.RichEmbed()
                .setAuthor(Name + "    " + valueArr[f + 1], gunIcon)
                .setImage(imageGun)
                .addField(labelArr[a], " " + valueArr[a + 1])
                .addField(labelArr[b], " " + valueArr[b + 1])
                .addField(labelArr[c], " " + valueArr[c + 1])
                .addField(labelArr[d], " " + valueArr[d + 1])
                .addField(labelArr[e], " " + valueArr[e + 1])
                .addField(labelArr[g], " " + valueArr[g + 1])
        }else {
            embed = new Discord.RichEmbed()
                .setAuthor(Name + "    " + valueArr[f + 1], gunIcon)
                .setImage(imageGun)
                .addField(labelArr[a], " " + valueArr[a + 1])
                .addField(labelArr[b], " " + valueArr[b + 1])
                .addField(labelArr[c], " " + valueArr[c + 1])
                .addField(labelArr[d], " " + valueArr[d + 1])
                .addField(labelArr[e], " " + valueArr[e + 1])
        }*/
                message.channel.send({embed})


    }
})
},
};