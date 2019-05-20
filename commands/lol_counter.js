const cheerio = require('cheerio')
const request = require('request')
const cheerioTableparser = require('cheerio-tableparser')


request('https://champion.gg/champion/Aatrox/Top?', (error,
response, html) => {
    if(!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        
        // Gets champion name
        const champName = $('h1').html()
        console.log(champName)

        //Gets statistics table
        cheerioTableparser($);
        const champTable = $('table')
        const data = $(champTable).parsetable(true,true,true);
        const rowName = data[0]
        const rowAverage = data[1]
        // console.log(data[1][1])
        // console.log(data[2][1])
        data[0].forEach((element, index) => {
            console.log(rowName[index] + " " + rowAverage[index])
        });
    }
})