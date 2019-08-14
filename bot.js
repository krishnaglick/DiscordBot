//mandatory imports
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./auth.json');

//setup for discord client reference. Used as the basis for the bot.
const client = new Discord.Client();
//setup for commands collection.
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
//code which is done on bot's start up. As of now only logs that the bot is running and sets the activty.
client.once('ready', () => {
	console.log(`Bot is running on ${client.guilds.size} servers`);
	client.user.setActivity('Please Read Pokemon Special');
});

client.on('messageReactionAdd', (reaction, user) => {
    if(reaction.emoji.name === '🤝'){
        try{
            let role = reaction.message.guild.roles.get('606594867136823316');
            let member = reaction.message.guild.members.find(member =>(member.user.id === user.id));
            console.log(`CO-OP || ${user.username} has requested the Co-op Role.`);
            if(member !== null && role !== null) {
                if (!member.roles.has(role.id)) {
                    member.addRole(role).catch(console.error);
                }
            }
        }catch (e) {
            //ToDo: Figure somethin out.
        }
    }
});
client.on('messageReactionRemove', (reaction, user) => {
    if(reaction.emoji.name === '🤝'){
        try{
            let role = reaction.message.guild.roles.get('606594867136823316');
            let member = reaction.message.guild.members.find(member =>(member.user.id === user.id));
            console.log(`CO-OP || ${user.username} has un-requested the Co-op Role.`);
            if(member !== null && role !== null) {
                if (member.roles.has(role.id)) {
                    member.removeRole(role).catch(console.error);
                }
            }
        }catch (e) {
            //ToDo: Figure somethin out.
        }

    }
});
//Discord Raw event handler. Current impplementation takes in only raw events it detects are reaction events. this is done to get reacts from old messages.
client.on('raw', packet => {
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    const channel = client.channels.get(packet.d.channel_id);
    if (channel.messages.has(packet.d.message_id)) return;
    channel.fetchMessage(packet.d.message_id).then(message => {
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        const reaction = message.reactions.get(emoji);
        if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
        }
    });
});
var antnee = '115270563349528579';
//code which is done whenever a message is sent in a discord the bot exists in.
client.on('message', message => {
    if(message.channel.guild.id === '259802877269245952'){
        console.log("SNOOP || " + message.author.username + " => " + message.content);
    }
    if(message.content === ">based"){
        console.log('triggered');
        var based = client.guilds.array();
        for(x in based){
            console.log(based[x].name + " : " + based[x].id + " : " + based[x].owner.user.username)
        }
    }

    //if the message is sent by a bot, ignore it.
    if (message.author.bot) return;
    //checks the message's first character for the > prefix, if the prefix isnt found the function returns.
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    //if the prefix IS found, the command call is split with the word immediately following the prefix becoming command and everything after it becoming the space delimitted args array
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    //if the commaand is not found within the commands collection (ie. it doesnt exist) then the function returns. otherwise it will execute the function defined in the commands specific .js file in the commands folder
    if (!client.commands.has(command)) return;
    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Cannot run command!');
    }
});
client.login(token);
