const ADV_DATA = "https://dragalialost.gamepedia.com/index.php?title=Special:CargoExport&tables=Adventurers&&fields=_pageName%3DPage%2CId%3DId%2CName%3DName%2CFullName%3DFullName%2CNameJP%3DNameJP%2CNameTC%3DNameTC%2CTitle%3DTitle%2CTitleJP%3DTitleJP%2CTitleTC%3DTitleTC%2CWeaponType%3DWeaponType%2CWeaponTypeId%3DWeaponTypeId%2CRarity%3DRarity%2CElementalType%3DElementalType%2CElementalTypeId%3DElementalTypeId%2CCharaType%3DCharaType%2CVariationId%3DVariationId%2CMinHp3%3DMinHp3%2CMinHp4%3DMinHp4%2CMinHp5%3DMinHp5%2CMaxHp%3DMaxHp%2CPlusHp0%3DPlusHp0%2CPlusHp1%3DPlusHp1%2CPlusHp2%3DPlusHp2%2CPlusHp3%3DPlusHp3%2CPlusHp4%3DPlusHp4%2CMcFullBonusHp5%3DMcFullBonusHp5%2CMinAtk3%3DMinAtk3%2CMinAtk4%3DMinAtk4%2CMinAtk5%3DMinAtk5%2CMaxAtk%3DMaxAtk%2CPlusAtk0%3DPlusAtk0%2CPlusAtk1%3DPlusAtk1%2CPlusAtk2%3DPlusAtk2%2CPlusAtk3%3DPlusAtk3%2CPlusAtk4%3DPlusAtk4%2CMcFullBonusAtk5%3DMcFullBonusAtk5%2CMinDef%3DMinDef%2CDefCoef%3DDefCoef%2CSkill1Name%3DSkill1Name%2CSkill2Name%3DSkill2Name%2CAbilities11%3DAbilities11%2CAbilities12%3DAbilities12%2CAbilities13%3DAbilities13%2CAbilities14%3DAbilities14%2CAbilities21%3DAbilities21%2CAbilities22%3DAbilities22%2CAbilities23%3DAbilities23%2CAbilities24%3DAbilities24%2CAbilities31%3DAbilities31%2CAbilities32%3DAbilities32%2CAbilities33%3DAbilities33%2CAbilities34%3DAbilities34%2CExAbilityData1%3DExAbilityData1%2CExAbilityData2%3DExAbilityData2%2CExAbilityData3%3DExAbilityData3%2CExAbilityData4%3DExAbilityData4%2CExAbilityData5%3DExAbilityData5%2CManaCircleName%3DManaCircleName%2CJapaneseCV%3DJapaneseCV%2CEnglishCV%3DEnglishCV%2CDescription%3DDescription%2CIsPlayable%3DIsPlayable%2CMaxFriendshipPoint%3DMaxFriendshipPoint%2CObtain%3DObtain%2CAvailability%3DAvailability%2CReleaseDate%3DReleaseDate&&order+by=%60_pageName%60%2C%60Id%60%2C%60Name%60%2C%60FullName%60%2C%60NameJP%60&limit=5000&format=json";
const ABI_DATA = "https://dragalialost.gamepedia.com/index.php?title=Special:CargoExport&tables=Abilities&&fields=_pageName%3DPage%2CId%3DId%2CGenericName%3DGenericName%2CName%3DName%2CDetails%3DDetails%2CAbilityIconName%3DAbilityIconName%2CAbilityGroup%3DAbilityGroup%2CPartyPowerWeight%3DPartyPowerWeight%2CAbilityLimitedGroupId1%3DAbilityLimitedGroupId1%2CAbilityLimitedGroupId2%3DAbilityLimitedGroupId2%2CAbilityLimitedGroupId3%3DAbilityLimitedGroupId3&&order+by=%60_pageName%60%2C%60Id%60%2C%60GenericName%60%2C%60Name%60%2C%60Details%60&limit=5000&format=json";
const SK1_DATA = "https://gamepress.gg/sites/default/files/aggregatedjson/CharacterAbilitiesandSkills.json?949562298288612314";
const SK2_DATA = "https://dragalialost.gamepedia.com/index.php?title=Special:CargoExport&tables=Skills&&fields=_pageName%3DPage%2CSkillId%3DSkillId%2CName%3DName%2CSkillLv1IconName%3DSkillLv1IconName%2CSkillLv2IconName%3DSkillLv2IconName%2CSkillLv3IconName%3DSkillLv3IconName%2CDescription1%3DDescription1%2CDescription2%3DDescription2%2CDescription3%3DDescription3%2CHideLevel3%3DHideLevel3%2CSp%3DSp%2CSPLv2%3DSPLv2%2CSpRegen%3DSpRegen%2CIsAffectedByTension%3DIsAffectedByTension%2CCrisisModifier%3DCrisisModifier%2CIframeDuration%3DIframeDuration&&group+by=Skills.Name&order+by=%60_pageName%60%2C%60SkillId%60%2C%60Name%60%2C%60SkillLv1IconName%60%2C%60SkillLv2IconName%60&limit=5000&format=json";
const HELPER = require('./helpers/dragHelper');
const Discord = require('discord.js');
module.exports = {
    unitEmbed: async function (message, args) {
        let unit = await HELPER.searchCollectionSingle(args.join(" "), await HELPER.getData(ADV_DATA), message);
        let abilitiesFinal = await HELPER.generateAbilityOutput(await HELPER.searchCollectionMultiple([unit.Abilities11, unit.Abilities12, unit.Abilities21, unit.Abilities22, unit.Abilities31, unit.Abilities32], await HELPER.getData(ABI_DATA), message));
        let skillsFinal = await HELPER.generateSkillOutput(unit.Name, await HELPER.getData(SK1_DATA), await HELPER.getData(SK2_DATA));
        let nameFinal = unit.Name + ": " + unit.Title + " | " + await HELPER.generateStars(unit.Rarity);
        let iconFinal = await HELPER.getElementImage(unit.ElementalType);
        let colorFinal = await HELPER.getEmbedColor(unit.ElementalType);
        //console.log(abilities);
        return [
            new Discord.RichEmbed()
                .setAuthor(nameFinal, iconFinal)
                .addField("Weapon", unit.WeaponType, true)
                .addField("HP", unit.MinHp5 + " - " + unit.MaxHp, true)
                .addField("ATK", unit.MinAtk5 + " - " + unit.MaxAtk, true)
                .addField("Co-Ab", await HELPER.generateCoAb(unit, unit.WeaponType))
                .addField("Abilities", abilitiesFinal)
                .setColor(colorFinal),
            new Discord.RichEmbed()
                .setAuthor(nameFinal, iconFinal)
                .addField("VA", unit.EnglishCV + " | " + unit.JapaneseCV)
                .addField("Release", unit.Obtain.replace("[[","").replace("]]","") + " : " + unit.ReleaseDate)
                .addField("Description", unit.Description)
                .setImage(await HELPER.getImage(args))
                .setColor(colorFinal),
        ];
    },
};