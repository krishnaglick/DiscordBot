const fs = require('fs');
const resourcePath = './commands/embedbuilders/helpers/data/';
const GENERAL = require('./general');
module.exports = {
    findJSON: async function(arg, seek){
        const trainerFiles = await fs.readdirSync(resourcePath + seek).filter(file => file.endsWith('.json'));
        for(const file of trainerFiles){
            let rawData = await fs.readFileSync(resourcePath + seek + "/" + file);
            let data = await JSON.parse(rawData);
            if(data.name.toUpperCase() === arg.toUpperCase()){
                return data;
            }
        }
    },
    getPKMNIcon: async function(name){
        if (name.includes('Mega ')) {
            return 'https://serebii.net//pokedex-sm/icon/' + await GENERAL.pokedexLookup(name.substring(5, name.length)) + '.png';
        } else {
            return'https://serebii.net//pokedex-sm/icon/' + await GENERAL.pokedexLookup(name.replace(" Shield", "").replace(" Sword", "")) + '.png';
        }
    },
    sortByStats: async function(a,b){
        let aBST = a.stats.max.attack + a.stats.max.defense + a.stats.max.speed + a.stats.max.sp_atk + a.stats.max.sp_def;
        let bBST = b.stats.max.attack + b.stats.max.defense + b.stats.max.speed + b.stats.max.sp_atk + b.stats.max.sp_def;
        if(aBST > bBST){
            return -1;
        }else if(a === b){
            return 0;
        }
        else{
            return 1;
        }
    }
};
