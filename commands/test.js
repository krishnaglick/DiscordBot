module.exports = {
    name: 'test',
    description: 'whatever you want',
    execute(message, args) {
        console.log(message.channel.guild.roles);
    },
};