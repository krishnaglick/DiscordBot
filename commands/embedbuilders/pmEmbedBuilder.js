const HELPER = require('./helpers/pmHelper');
const GENERAL = require('./helpers/general');
const Discord = require('discord.js');
module.exports = {
    pairSearchEmbed: async function (arg, client) {
        let embedArr = [];

        const unit = await HELPER.findJSON(arg, "trainers");
        const rarity = await GENERAL.generateStars(unit.base_potential);
        const pokeList = unit.pokemon_list.map(async (name)=>{
            return await HELPER.findJSON(name, "pokemon")
        }).sort(async (a,b)=>{ await HELPER.sortByStats(a,b)});

        for(const PKMN of pokeList){
            embedArr.push(await generateIndividualPKMNEmbed(PKMN, unit, rarity));
        }

        const baseEmbed = new Discord.RichEmbed()
            .setAuthor(unit.name + " " + rarity)
            .addField("Background", unit.info);
        embedArr.push(baseEmbed);

        return embedArr;
    }
};

async function generateIndividualPKMNEmbed(PKMN, trainer, rarity){
    return new Discord.RichEmbed()
        .setAuthor(trainer.name + " & " + PKMN.name + " ・ " + PKMN.role + " " + rarity, await HELPER.getPKMNIcon(PKMN.name))
        .setColor(await GENERAL.getColor(PKMN.type1));
}

/*
unit.pokemon_list.
 */
