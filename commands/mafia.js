module.exports = {
    name: 'maf',
    description: 'Conduct a game of mafia.',
    execute(message, args) {
        var gameRunning = false;
        switch (args[0]) {
            case "start":
                gameRunning = true;
                gameInit();
                break;
        }
    },
};
function gameInit(){
    //game start stuff here
}