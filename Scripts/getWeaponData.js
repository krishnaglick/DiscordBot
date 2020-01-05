const cheerio = require("cheerio");
const axios = require("axios");

module.exports = {
    key: 'dragalia-weapons',
    getWeaponData: async function () {
        let json = await axios.get(
            "https://gamepress.gg/sites/default/files/aggregatedjson/DragaliaLostWeaponsList.json?10040605992016338578"
        ).catch(error => console.log(error));

        return await json.data.map(async (weapon) => {
            let html = await axios.get(
                "https://gamepress.gg" + weapon.title.substring(9, weapon.title.indexOf("\" hreflang=\"en\">"))
            );
            const $ = cheerio.load(html.data);
            const name = $('h1').text();
            const image = "https://gamepress.gg" + $('#weapon-image > img').attr('src');
            const atk = weapon.max_atk;
            const hp = weapon.max_hp;
            const rarity = weapon.rarity_num;
            const type = weapon.weapon_type;
            const element = weapon.element;
            let skillName = "";
            let skillLevels = [];
            let abilities = [];
            let hasSkill = false;
            let hasAbility = false;
            $('h2').each((i, h2) => {
                if ($(h2).text().includes('Skill')) {
                    hasSkill = true;
                }
                if ($(h2).text().includes('Abilities')) {
                    hasAbility = true;
                }
            });
            if (hasSkill) {
                $('div:nth-child(10).views-element-container > div > div > div > div > span > table > tbody > tr').each((i, tr) => {
                    if (i === 0) {
                        skillName = $(tr).find('b > a').text();
                    } else {
                        $(tr).find('td').each((i, tr) => {
                            if (i === 0) {
                                skillLevels.push($(tr).text())
                            }
                        })
                    }
                });
            } else {
                skillName = 'None';
                skillLevels = ['None.'];
            }
            if (hasAbility) {
                $('.ability-info').each((i, div) => {
                    abilities.push({
                        name: $(div).find('b > a').text(),
                        effect: $(div).find('p').text()
                    });
                });
            } else {
                abilities.push({
                    name: 'None',
                    effect: 'None.'
                });
            }
            return {
                name: name,
                image: image,
                atk: atk,
                hp: hp,
                rarity: rarity,
                type: type,
                element: element,
                skill: {
                    name: skillName,
                    levels: skillLevels
                },
                abilities: abilities
            };
        });
    }
};

