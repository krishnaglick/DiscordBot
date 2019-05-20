module.exports = {
    name: 'name',
    description: 'Sends message with the command caller\'s name',
    execute(message) {
        message.reply(" <= your name");
    },
};