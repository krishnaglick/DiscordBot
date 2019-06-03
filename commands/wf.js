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
        const gunName = $('h1').html()
        const body = $('body')
        const imageLocation = $('div.floatnone')
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

        const ammoType = finalConvertedLabel.indexOf('Ammo Type');
        const critC = finalConvertedLabel.indexOf('Crit Chance');
        const critD = finalConvertedLabel.indexOf('Crit Multiplier')
        const statusC = finalConvertedLabel.indexOf('Status Chance');
        const fireRate = finalConvertedLabel.indexOf('Fire Rate');
        console.log(labelArr);

        //var image = imageLocation.find($('a.image.image-thumbnail')).attr('href');
        var image = imageLocation.find($('img.lzyPlcHld')).attr('data-src');

        //This is going to be for testing in case I fuck something up and need to check stuff
        /*
        console.log(finalConvertedLabel);
        console.log('==============================================' + '\n');
        console.log('==============================================' + '\n');
        console.log('==============================================' + '\n');
        console.log(finalConvertedValue);
        */
        const embed = new Discord.RichEmbed()
            .setImage(image)
            .addField(labelArr[ammoType], " " + valueArr[ammoType+1])
            .addField(labelArr[fireRate], " " + valueArr[fireRate+1])
            .addField(labelArr[critC], " " + valueArr[critC+1])
            .addField(labelArr[critD], " " + valueArr[critD+1])
            .addField(labelArr[statusC], " " + valueArr[statusC+1])
        message.channel.send({embed})


    }
})
},
};


//Trial and error lies below



/* function searchString (str, array1) {
        const x = array1.indexOf(str);
        return x;
       }*/

/*
       function searchString (str, array1) {
            for (var j = 0; j < array1.length; j++) {
                var k = 0;
                if (array1[j].match(str)) {
                    k = j;
                    return k;
                }
            }
            return k;
        }

*/

/*
        function searchString (str, array1) {
            for (var j = 0; j < array1.length; j++) {
                console.log(j);
                console.log(str);
                //uh wtf?
                console.log(array1[j]);
                if (array1[j].match(str)) {
                    return j;
                }
            }
            return j;
        }
*/


/*
        function searchString (str, array) {
            for (var j = 0; j < array.length; j++) {
                console.log(j);
                console.log(str);
                //uh wtf?
                console.log(array[j]);
                if (array[j].match(str)) {
                    return j;
                }
            }
            return j;
        }
*/