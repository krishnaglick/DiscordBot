const fetch = require("node-fetch");
module.exports = {
    name: 'f',
    description: 'whatever you want',
    execute(message, args) {
        getUnit(message, args[0]);
    },
};

async function getUnit(message, args) {
    var data, unit;
    await fetch('https://gamepress.gg/sites/default/files/aggregatedjson/TrainersList.json?15813222081239323912')
        .then(response => response.json())
        .then(trainers => data = trainers);
    if(data){
        for (var x in data) {
            if (data[x].title.toUpperCase() === args.toUpperCase()) {
                unit = data[x];
            }
        }
    }
    getPokemon(unit)
}

async function getPokemon(unit){
    var data;
    var pokemon = [];
    await fetch('https://gamepress.gg/sites/default/files/aggregatedjson/PokemonMastersPokemonList.json?11374694561864648517')
        .then(response => response.json())
        .then(trainers => data = trainers);
    if(data){
        for (var x in data) {
            if (data[x].title_plain.toUpperCase().substring(0,data[x].title_plain.indexOf(" ")) === unit.title.toUpperCase()) {
                pokemon.push(data[x]);
            }
        }
    }

}