module.exports = {
    name: 'poll',
    description: 'Conduct a poll.',
    execute(message, args) {
        var filter;// = (reaction) => reaction.emoji.name === '👌';
        switch (args.length) {
            case 0:
                message.channel.send("Can't take a poll off of nothing, idiot.");
                break;
            case 1:
                filter = (reaction, user) => {
                    return ['1️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
                };
                message.channel.send('1️⃣: ' + args[0]).then(message => {
                    message.react('1️⃣');
                });
                break;
            case 2:
                filter = (reaction, user) => {
                    return ['2️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
                };
                message.channel.send('1️⃣: ' + args[0] + '\n2️⃣: ' + args[1])
                    .then(message => {
                        message.react(':one:')
                            .then(() => {
                                message.react(':two:')
                            })
                            .catch(() => console.error('One of the emojis failed to react.'));
                    })
        }
    },
};
