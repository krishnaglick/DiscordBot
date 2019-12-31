const axios = require('axios');
const cheerio = require('cheerio');

async function getDragaliaUnits() {
    let json = await axios.get(
        "https://gamepress.gg/sites/default/files/aggregatedjson/DragaliaLostCharacterList.json?1581181076155443736"
    );

    const unitList = json.data.map(async (unit) => {
        let html = await axios.get(
            "https://gamepress.gg" + unit.title.substring(9, unit.title.indexOf("\" hreflang=\"en\">"))
        );
        const $ = cheerio.load(html.data);
        const body = $('body');
        const name = $("h1").text();
        const image = "https://gamepress.gg" + $('#char-image > a > img').attr('src');
        const description = $('#stats-table > tbody > tr:nth-child(2) > td > p').text();
        const title = $('#overview-table > tbody > tr:nth-child(1) > th').text();

        const cvTemp = $('#stats-table > tbody > tr:nth-child(4)').text().split("\n");
        const cv = [cvTemp[1], cvTemp[2]];

        const abilities = [];
        $('.view.view-ability-on-character-page > div > div > div > span > table > tbody').each((i, abilityTable) => {
            const abilitiesTemp = [];
            $(abilityTable).find('.ability-info').each((i, ability) => {
                if ($(ability).find('> b > a').text() !== '')
                    abilitiesTemp.push({
                        name: $(ability).find('> b > a').text(),
                        effect: $(ability).find('> .ability-effect').text().replace("\n", ""),
                    })
            });
            abilities.push(abilitiesTemp);
        });

        //ToDo: figure out what's wrong with skill scraping
        const skills = [];
        $('.view.view-skills-on-character > div > div > div > span > table').each((i, skill) => {
            if (i === 0 || i % 2 === 0) {
                let cost = '';
                let regenCost = '';
                let iframe = '';
                $(body).find('.view.view-skills-on-character > div > div > div > span > table').each((j, extraData) => {
                    if (j % 2 === 1 && j <= (i + 1)) {
                        cost = $(extraData).find('.skill-extra-data > tbody > tr:nth-child(1) > td:nth-child(2)').text();
                        regenCost = $(extraData).find('.skill-extra-data > tbody > tr:nth-child(2) > td').text();
                        iframe = $(extraData).find('.skill-extra-data > tbody > tr > td:nth-child(4)').text();
                    }
                });
                const name = $(skill).find('.skill-main-title > td > b > a:nth-child(1)').text();
                const levels = [];
                $(skill).find('> tbody > tr').each((i, level) => {
                    if (i !== 0) {
                        if ($(level).find('> td:nth-child(2)').text().length > 3)
                            levels.push({
                                level: $(level).find('> th').text(),
                                description: $(level).find('> td:nth-child(2)').text(),
                            });
                    }
                });
                skills.push({
                    name: name,
                    levels: levels,
                    cost: cost,
                    regen: (regenCost === '') ? "None" : regenCost,
                    iframe: iframe
                });
            }

            /*

            const levels = [];
            $(skill).find('table').each((i, table) => {
                if (i !== 1) {
                    $(table).find('> tbody > tr').each((i, level) => {
                        if (i !== 0) {
                            levels.push(
                                {
                                    level: $(level).find('> th').text(),
                                    description: $(level).find('> td:nth-child(2)').text(),
                                }
                            );
                        }
                    });
                }
            });
            skills.push({
                name: name,
                levels: levels,
                cost: cost,
                regen: (regenCost === '') ? "None" : regenCost,
                iframe: iframe
            });
             */
        });

        const coabUpgrades = [];
        $('.view.view-co-ability-on-character-page > div > table > tbody > tr').each((i, upgrade) => {
            coabUpgrades.push($(upgrade).find('td > p').text());
        });
        const coability = {
            name: $('.co-ability-info > a').text(),
            baseEffect: $('.co-ability-effect').text().replace('\n', ''),
            upgrades: coabUpgrades,
        };

        const rarity = unit.rarity_num;
        const element = unit.char_element;
        const weapon = unit.weapon_type;
        const role = unit.char_type;
        const atk = unit.max_atk;
        const hp = unit.max_hp;

        const adventurer = {
            name: name,
            image: image,
            description: (description !== "") ? description : " - ",
            cv: cv,
            title: (title !== "") ? title : " - ",
            rarity: rarity,
            element: element,
            weapon: weapon,
            role: role,
            atk: atk,
            hp: hp,
            coability: coability,
            abilities: abilities,
            skills: skills
        };

        console.dir(adventurer, {depth: 5, colors: true});
        console.log(',')
    });
};

getDragaliaUnits().then(() => console.log("Starting."));
