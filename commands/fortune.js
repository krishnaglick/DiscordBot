module.exports = {
    name: 'fortune',
    description: 'Tell\'s the caller\'s fortune',
    execute(message) {
        var trigger = Math.floor(Math.random()*10);
        switch (trigger) {
            case 0: message.channel.send(`You will kill ${message.guild.members.random().user.username}`); break;
            case 1: message.channel.send(`You will marry ${message.guild.members.random().user.username}`); break;
            case 2: message.channel.send(`You will fuck ${message.guild.members.random().user.username}`); break;
            case 4: message.channel.send(`You get married to ${message.guild.members.random().user.username}`); break;
            case 5: message.channel.send(`You become a fresco, sorry.`); break;
            case 6: message.channel.send(`You become a neet. :^|`); break;
            case 7: message.channel.send(`${message.guild.members.random().user.username} destroys your pelvis`); break;
            case 8: message.channel.send(`Mario`); break;
            case 9: message.channel.send(`Try again`); break;
            default: message.channel.send(`You die a horrible death by the hands of ${message.guild.members.random().user.username}`); break;
        }
    },
};