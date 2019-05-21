const cheerio = require('cheerio')
const request = require('request')
const cheerioTableparser = require('cheerio-tableparser')
module.exports = {
    name: 'drag',
    description: 'view the drag wiki',
    execute(message, args) {
        request('https://dragalialost.gamepedia.com/' + args[0], (error, response, html) => {
            if(!error && response.statusCode == 200) {
                const $ = cheerio.load(html);

                const unitName = $('h1').html()
                console.log(unitName)

            }
        })
    },
};