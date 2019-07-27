module.exports = {
    name: 'debug',
    description: 'Conduct an RPG battle',
    execute(message, args) {
        console.log(args);
        message.channel.send("sent.");
    },
};