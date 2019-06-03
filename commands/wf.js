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
        /*
        function searchString (str, array1, array2) {
            for (var j=0; j<array1.length; j++) {
                if (array1[j].match(str)) {
                    return array1[j], array2[j];
                }
            }
            return j;
        }*/


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
        const gunName = $('h1').html()
        const body = $('body')
        const imageLocation = $('div.floatnone')
        const labelArr = {}
        const valueArr = {}
        const value = body.find($('.pi-data-value')).each(function (i, elem) {
            valueArr[i] = $(this).text()
        })
        const label = body.find($('.pi-data-label')).each(function (i, elem) {
            labelArr[i] = $(this).text()
        })
        console.log(searchString('Reload Time', 'labelArr[i]'));
        var image = imageLocation.find($('a.image.image-thumbnail')).attr('href');

        function searchString (str, array1, array2) {
            for (var j=0; j<array1.length; j++) {
                if (array1[j].match(str)) {
                    return array1[j], array2[j];
                }
            }
            return array1[j], array1[j];
        }

        const embed = new Discord.RichEmbed()
            .setImage(image)
            .addField(searchString("Disposition", labelArr, valueArr))
            //.addField("Label","MR"+"\n"+"Slot"+"\n"+"Type"+"\n"+labelArr[3]+"\n"+labelArr[4]+"\n"+labelArr[5]+"\n"+labelArr[6]+"\n"+labelArr[7]+"\n"+labelArr[8]+"\n"+labelArr[9]+"\n"+labelArr[10]+"\n"+labelArr[11]+"\n"+labelArr[12],true)
            //.addField("Value",valueArr[1]+"\n"+valueArr[2]+"\n"+valueArr[3]+"\n"+valueArr[4]+"\n"+valueArr[5]+"\n"+valueArr[6]+"\n"+valueArr[7]+"\n"+valueArr[8]+"\n"+valueArr[9]+"\n"+valueArr[10]+"\n"+valueArr[11]+"\n"+valueArr[12]+"\n",true)
        message.channel.send({embed})
        //console.log(image);
/*the first element (labelArr[0]) seems to be the image of the gun
* */

    }
})
},
};



