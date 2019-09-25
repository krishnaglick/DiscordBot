const ADV_DATA = "https://dragalialost.gamepedia.com/api.php?action=cargoquery&format=json&limit=500&tables=Adventurers&fields=Id,Name,FullName,NameJP,NameTC,Title,TitleJP,TitleTC,WeaponType,WeaponTypeId,Rarity,ElementalType,ElementalTypeId,CharaType,VariationId,MinHp3,MinHp4,MinHp5,MaxHp,PlusHp0,PlusHp1,PlusHp2,PlusHp3,PlusHp4,McFullBonusHp5,MinAtk3,MinAtk4,MinAtk5,MaxAtk,PlusAtk0,PlusAtk1,PlusAtk2,PlusAtk3,PlusAtk4,McFullBonusAtk5,MinDef,DefCoef,Skill1Name,Skill2Name,Abilities11,Abilities12,Abilities13,Abilities14,Abilities21,Abilities22,Abilities23,Abilities24,Abilities31,Abilities32,Abilities33,Abilities34,ExAbilityData1,ExAbilityData2,ExAbilityData3,ExAbilityData4,ExAbilityData5,ManaCircleName,JapaneseCV,EnglishCV,Description,IsPlayable,MaxFriendshipPoint,Obtain,Availability,ReleaseDate";
const ABI_DATA = "https://dragalialost.gamepedia.com/api.php?action=cargoquery&format=json&tables=Abilities&fields=_pageName=Page,Id=Id,GenericName=GenericName,Name=Name,Details=Details,AbilityIconName=AbilityIconName,AbilityGroup=AbilityGroup,PartyPowerWeight=PartyPowerWeight,AbilityLimitedGroupId1=AbilityLimitedGroupId1,AbilityLimitedGroupId2=AbilityLimitedGroupId2,AbilityLimitedGroupId3=AbilityLimitedGroupId3";
const HELPER = require('./helpers/dragHelper');
const GENERAL = require('./helpers/general');
const fetch = require("node-fetch");
const cheerio = require('cheerio');
const Discord = require('discord.js');
const paginationEmbed = require('discord.js-pagination');
const {MessageEmbed} = require('discord.js');
const AsciiTable = require('ascii-table');
const request = require('request');
module.exports = {
    unitEmbed: async function(message, args) {
        let unit = await HELPER.searchCollectionSingle(args.join(" "), await HELPER.getData(ADV_DATA), message);

        return new Discord.RichEmbed()
            .setAuthor(unit.Name + ": " + unit.Title + " | " + await HELPER.generateStars(unit.Rarity), await HELPER.getElementImage(unit.ElementalType))
            .addField("Weapon", unit.WeaponType, true)
            .addField("Role", unit.CharaType, true)
            .addField("Description", unit.Description)
            .addField("HP", unit.MinHp5 + " - " + unit.MaxHp, true)
            .addField("ATK", unit.MinAtk5 + " - " + unit.MaxAtk, true)
            .setColor(await HELPER.getEmbedColor(unit.ElementalType))
            .setImage(await HELPER.getImage(args));
    },
};