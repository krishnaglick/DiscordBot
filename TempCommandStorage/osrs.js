const osrs = require("osrs-wrapper");
module.exports = {
    name: 'rs',
    description: 'whatever you want',
    execute(message, args) {
        var player = getPlayer();
        console.log(player);
    },
};

async function getPlayer() {
    return await osrs.hiscores.getPlayer("Antneeee");
}