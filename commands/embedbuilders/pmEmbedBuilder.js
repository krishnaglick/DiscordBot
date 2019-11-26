const HELPER = require('./helpers/pmHelper');
const GENERAL = require('./helpers/general');
const Discord = require('discord.js');
module.exports = {
    pairSearchEmbed: async function (args, client) {
        let embedArr = [];
        let PKMNList = [];

        const unit = await HELPER.findJSON(args.join(" "), "trainers");
        const rarity = await GENERAL.generateStars(unit.base_potential);
        const icon = await HELPER.getUnitIcon(unit);

        for (let PKMN of unit.pokemon_list) {
            PKMNList.push(await HELPER.findJSON(PKMN.replace(unit.name + " & ",""), "pokemon"))
        }
        const color = await GENERAL.getColor(PKMNList[0].type1);

        PKMNList.sort((a, b) => b.stats.max.hp - a.stats.max.hp);

        for (let PKMNJson of PKMNList) {
            embedArr.push(await generateIndividualPKMNEmbed(PKMNJson, unit, rarity, icon, client))
        }

        const baseEmbed = new Discord.RichEmbed()
            .setAuthor(unit.name + " " + rarity)
            .setThumbnail(icon)
            .addField("Obtain Method", unit.recruit_method === "" ? "TELL ANTNEE TO FIX THIS" : unit.recruit_method)
            .addField("Background", unit.info)
            .setImage('https://www.serebii.net/pokemonmasters/syncpairs/' + unit.name.replace("Synga Suit ", "").toLowerCase().replace(" ", "") + '.png')
            .setColor(color);
        embedArr.push(baseEmbed);
        return embedArr;
    },
    joinJSON: async function(seek){
        await HELPER.compileJson(seek);
    }
};

async function generateIndividualPKMNEmbed(PKMN, trainer, rarity, icon, client) {
    let isTwoTyped = PKMN.type2 === "";
    return new Discord.RichEmbed()
        .setAuthor(trainer.name + " & " + PKMN.name + " ・ " + PKMN.role + " " + rarity, await HELPER.getPKMNIcon(PKMN.name))
        .setThumbnail(icon)
        .addField("**〜 Typing 〜**", "**Type: ** " + await GENERAL.getEmoji(PKMN.type1.toLowerCase(), client)
            + (isTwoTyped ? " " : await GENERAL.getEmoji(PKMN.type2.toLowerCase(), client))
            + " ・ **Weakness:** " + await GENERAL.getEmoji(PKMN.weakness.toLowerCase(), client)
        )
        .addField("**〜 Stats 〜**", await HELPER.generateStatTable(PKMN.stats))
        .addField("**〜 Passives 〜**", await HELPER.generatePassivesOut(PKMN.passives))
        .addField("**〜 Moves 〜**", await HELPER.generateMovesOut(PKMN.moves, client) + await HELPER.generateSyncOut(PKMN.syncMove, client))
        .setColor(await GENERAL.getColor(PKMN.type1));
    //ToDo: move out and stats table, also passives, also type and weakness emoji
}
