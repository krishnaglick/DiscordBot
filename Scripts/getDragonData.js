const cheerio = require("cheerio");
const axios = require("axios");

module.exports = {
    key: 'dragalia-dragons',
    getDragonLinks: async function () {
        let html = await axios.get(
            "https://dragalialost.gamepedia.com/Category:Dragons"
        ).catch(error => console.log(error));
        const $ = cheerio.load(html.data);
        const links = [];
        $("#mw-pages > .mw-content-ltr > .mw-category").each((i, letter) => {
            $(letter).find('ul > li').each((i, link) => {
                links.push('https://dragalialost.gamepedia.com' + $(link).find('a').attr('href'));
            });
        });
        return links;
    },
    getDragonData: async function (links) {
        const dragons = [];
        for (const link of links) {
            let html = await axios.get(link).catch(error => console.log(error));
            const $ = cheerio.load(html.data);
            const name = $('h1').text();
            const title = $('.panel-heading > div:nth-child(1)').text();
            const isLocked = ((name.includes("(") && !name.includes("Dragon")) || name === "Rush");
            const image = $('#mw-content-text > div > div.panel > div.panel-body > div.portrait-container > div > div:nth-child(1) > p > a > img').attr("src");
            const str = $('#adv-str').text();
            const hp = $('#adv-hp').text();

            const maxMight = $('#mw-content-text > div > div.panel > div.panel-body > div:nth-child(2) > div:nth-child(5) > div:nth-child(2) > span').text().replace('Does not include external buffs (e.g. Halidom, Wyrmprints, etc.)Max HP + Max Str + Lv. 2 Skill Might + Lv. 2 Ability Might + Lv. 30 Bond (* Elemental Matching Bonus)', '');
            const rarityAlt = (isLocked) ? '5' : $('#mw-content-text > div > div.panel > div.panel-body > div:nth-child(2) > div:nth-child(6) > div:nth-child(2) > div > img').attr('alt');
            const rarity = rarityAlt.includes('5') ? 5 : (rarityAlt.includes('4') ? 4 : 3);
            const favoriteFood = $('#mw-content-text > div > div.panel > div.panel-body > div:nth-child(2) > div:nth-child(8) > div:nth-child(2) > span > a:nth-child(2)').text();

            const skillName = $('#mw-content-text > div > div.panel > div:nth-child(3) > div:nth-child(2) > table > tbody > tr > th > a').text();
            const skillLevels = [];
            $('#mw-content-text > div > div.panel > div:nth-child(3) > div:nth-child(2) > table > tbody > tr > td > div > div').each((i, div) => {
                skillLevels.push($(div).text().split('\n')[2].substring(0, $(div).text().split('\n')[2].indexOf(' (Might')))
            });

            const abilities = [];
            $('#mw-content-text > div > div.panel > div:nth-child(3) > div.skill-section > table').each((i, table) => {
                const abiName = $(table).find('tbody > tr > th > a').text();
                const abiLevels = [];
                $(table).find('tbody > tr > td > div > div').each((i, div) => {
                    abiLevels.push($(div).text().split('\n')[1].substring(0, $(div).text().split('\n')[1].indexOf(' (Might')).replace(/\t/g, ''))
                });
                abilities.push({
                    name: abiName,
                    levels: abiLevels
                })
            });

            const comboTable = [];
            $('.wikitable > tbody > tr').each((i, tr) => {
                let multiplier = "";
                let hitCount = "";
                if (i !== 0) {
                    $(tr).find('td').each((i, td) => {
                        switch (i) {
                            case 0:
                                break;
                            case 1:
                                multiplier = $(td).text();
                                break;
                            case 2:
                                hitCount = $(td).text();
                                break;
                        }
                    });
                    comboTable.push({
                        name: "Combo " + i,
                        multiplier: multiplier,
                        hitCount: hitCount.replace('\n', '')
                    });
                }
            });

            let element = "";
            switch ($('#mw-content-text > div > div.panel > div.panel-heading > div:nth-child(2) > span > img').attr('alt')) {
                case 'Icon Element Flame.png':
                    element = 'Flame';
                    break;
                case 'Icon Element Water.png':
                    element = 'Water';
                    break;
                case 'Icon Element Wind.png':
                    element = 'Wind';
                    break;
                case 'Icon Element Light.png':
                    element = 'Light';
                    break;
                case 'Icon Element Shadow.png':
                    element = 'Shadow';
                    break;
            }

            const skill = {
                name: skillName,
                levels: skillLevels
            };
            const dragon = {
                name: name,
                title: title,
                isLocked: isLocked,
                image: image,
                str: str,
                hp: hp,
                element: element,
                maxMight: maxMight,
                rarity: rarity,
                favoriteFood: favoriteFood,
                skill: skill,
                abilities: abilities,
                comboTable: comboTable
            };
            dragons.push(dragon)
        }
        return dragons;
    }
};





