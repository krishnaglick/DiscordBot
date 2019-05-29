const cheerio = require('cheerio');
const request = require('request');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const cheerioTableparser = require('cheerio-tableparser')

//So the discord wrapper runs without problems which is nice. Nothing happens of course because I think it has to be ran on the server
/*module.exports = {
    name: 'debug',
    description: 'Conduct an RPG battle',
    execute(message, args) {*/

    const url = 'https://warframe.fandom.com/wiki/';

function warframeSite(pendingHTML) {
    return fetch(`${url}${pendingHTML}`)
        .then(response => response.text());
}

request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {


        warframeSite('Fulmin')
            .then(body => {
                const $ = cheerio.load(body);
                $('.portable-infobox').each(/*function */(i, element)=>  {
                    const $element = $(element)
                        //this was supposed to remove spaces, it kind of did
                        .text()
                        .replace(/\s\s+/);
                    //character limit reached, shit's broken til I break it up. I should honestly use the table parser
                    /*const embed = new Discord.RichEmbed()
                        .setDescription($element)
                    message.channel.send({embed});*/
                    console.log($element);
                });

            });
    }
})
//},
//};


/*
=================***********=================****************=================***********=================
=================***********=================Test Shit Ignore=================***********=================
=================***********=================****************=================***********=================
url = 'https://warframe.fandom.com/wiki/Boltor Prime'

request(url, (error, response, html) => {
    if(!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        const body = $('body')

    }
}*/



