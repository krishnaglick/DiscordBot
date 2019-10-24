const HELPER = require('./helpers/pmHelper');
const GENERAL = require('./helpers/general');
const Discord = require('discord.js');
module.exports = {
    pairSearchEmbed: async function (arg, client) {
        let embedArr = [];
        let PKMNList = [];

        const unit = await HELPER.findJSON(arg, "trainers");
        const rarity = await GENERAL.generateStars(unit.base_potential);
        const icon = await HELPER.getUnitIcon(unit);

        for(let PKMN of unit.pokemon_list){ PKMNList.push( await HELPER.findJSON(PKMN,"pokemon"))}
        const color = await GENERAL.getColor(PKMNList[0].type1);
        PKMNList.sort(async (a,b)=>{await HELPER.sortByStats(a,b)});

        for(let PKMNJson of PKMNList){ embedArr.push( await generateIndividualPKMNEmbed(PKMNJson, unit, rarity, icon, client))}

        const passives = HELPER.getPassives(unit.name, PKMNList[0].name);

        const baseEmbed = new Discord.RichEmbed()
            .setAuthor(unit.name + " " + rarity)
            .setThumbnail(icon)
            .addField("Obtain Method", unit.recruit_method === "" ? "TELL ANTNEE TO FIX THIS" : unit.recruit_method)
            .addField("Background", unit.info)
            .setImage('https://www.serebii.net/pokemonmasters/syncpairs/' + unit.name.replace("Synga Suit ", "").toLowerCase().replace(" ", "") + '.png')
            .setColor(color);
        embedArr.push(baseEmbed);
        return embedArr;
    }
};

async function generateIndividualPKMNEmbed(PKMN, trainer, rarity, icon, client){
    return new Discord.RichEmbed()
        .setAuthor(trainer.name + " & " + PKMN.name + " ・ " + PKMN.role + " " + rarity, await HELPER.getPKMNIcon(PKMN.name))
        .setThumbnail(icon)
        .addField("**〜 Stats 〜**", await HELPER.generateStatTable(PKMN.stats))
        //todo: sort out the passives issue
        .addField("**〜 Moves 〜**", await HELPER.generateMovesOut(PKMN.moves, client))
        .setColor(await GENERAL.getColor(PKMN.type1));
    //ToDo: move out and stats table, also passives, also type and weakness emoji
}
