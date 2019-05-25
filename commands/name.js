module.exports = {
    name: 'name',
    description: 'Sends message with the command caller\'s name',
    execute(message, args) {
        var matchFound = false;
        message.guild.members.forEach(member => {
            if(args[0] == member.user.username){
                message.channel.send(`
                User: ${member.user.username}\nDate Joined: ${member.user.createdAt}\nTag: ${member.user.tag}`);
                //add in mutual channels
                matchFound = true;
            }
        });
        if(!matchFound){message.reply("User not found.")}
        if(args = null){message.reply("Mention a user to see their info. EX: >name Antnee");}
    },
};