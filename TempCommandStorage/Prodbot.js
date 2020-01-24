const fs = require('fs');
const Discord = require('discord.js');
const {prefix, token} = require('./auth.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
//code which is done on bot's start up. As of now only logs that the bot is running and sets the activty.
client.once('ready', () => {
    console.log(`Bot is running on ${client.guilds.size} servers`);
    client.user.setActivity('>help');
});

client.on('messageReactionAdd', (reaction, user) => {
    if (reaction.emoji.name === '🤝' && reaction.message.id === "606589614123384843") {
        try {
            let role = reaction.message.guild.roles.get('606594867136823316');
            let member = reaction.message.guild.members.find(member => (member.user.id === user.id));
            console.log(`CO-OP || ${user.username} has requested the Co-op Role.`);
            if (member !== null && role !== null) {
                if (!member.roles.has(role.id)) {
                    member.addRole(role).catch(console.error);
                }
            }
        } catch (e) {
            //ToDo: Figure somethin out.
        }
    }
});
client.on('messageReactionRemove', (reaction, user) => {
    if (reaction.emoji.name === '🤝' && reaction.message.id === "606589614123384843") {
        try {
            let role = reaction.message.guild.roles.get('606594867136823316');
            let member = reaction.message.guild.members.find(member => (member.user.id === user.id));
            console.log(`CO-OP || ${user.username} has un-requested the Co-op Role.`);
            if (member !== null && role !== null) {
                if (member.roles.has(role.id)) {
                    member.removeRole(role).catch(console.error);
                }
            }
        } catch (e) {
            //ToDo: Figure somethin out.
        }
    }
});

client.on('message', message => {
    if (message.guild.id === '583120259708616715') {
        if (message.channel.id === '603818219131764736' || message.channel.id === '604281012901511178') {
            return;
        }
    }
    //handles >enter command
    try {
        if (message.channel.id === '611678630925565972') {
            if (message.channel.guild.id !== '583120259708616715') return;
            addTrainerRole(message);
        }
        if (message.channel.guild.id === '259802877269245952') {
            if (message.attachments != null) {
                var img = message.attachments.first().url;
                console.log("SNOOP || " + message.author.username + " => " + img);
            } else {
                console.log("SNOOP || " + message.author.username + " => " + message.content);
            }
        }
    } catch (e) {
        //
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

async function addTrainerRole(message) {
    if (message.content === ">enter") {
        try {
            let member = message.member;
            let trainerRole = message.guild.roles.get('611638752015679596');
            if (member !== null && trainerRole !== null) {
                if (!member.roles.has(trainerRole.id)) {
                    await member.addRole(trainerRole).catch(console.error);
                }
            }
            message.delete(2000).catch(console.error);
            message.channel.send(`Trainer role given to ${message.author.username}`)
        } catch (e) {
            //
        }
    } else {
        message.delete(10000).catch(console.error);
    }
};


