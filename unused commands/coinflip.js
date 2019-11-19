module.exports = {
    name: 'flipt',
    description: 'flip a coin.',
    execute(message, args) {
        var random = Math.random();
        if (random > 0.5) {
            message.channel.send("Heads.")
        } else {
            message.channel.send("Tails.")
        }
    },
};
