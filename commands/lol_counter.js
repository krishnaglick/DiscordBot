const cheerio = require('cheerio')
const request = require('request')
const cheerioTableparser = require('cheerio-tableparser')

module.exports = {
    name: 'lol',
    description: 'Grabs Champion stats from champion.gg ',
    execute(message, args) {
            request(`https://champion.gg/champion/${args}/`, (error,
            response, html) => {
        if(!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            
            // Gets champion name
            const champName = $('h1').html()
            //console.log(champName)

            //Gets statistics table
            cheerioTableparser($);
            const champTable = $('table')
            const data = $(champTable).parsetable(true,true,true);
            const rowName = data[0]
            const rowAverage = data[1]
            data[0].forEach((element, index) => {
                console.log(rowName[index] + " " + rowAverage[index])
                message.channel.send({embed: {
                    color: 3447003,
                    description: `${champName + " Stats"}`,
                    fields: [{
                        name: rowName[index],
                        value: rowAverage[index]
                    }]
                }})
            });
        }
    })
      //  console.log(args);

    }

}