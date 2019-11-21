//mandatory imports
const fs = require('fs');
const Discord = require('discord.js');
const {prefix, prodToken, stagingToken, environment} = require('./auth.json');

//setup for discord client reference. Used as the basis for the bot.
const client = new Discord.Client();
//setup for commands collection.
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
var timedMessage;
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
    if (reaction.message.id === "622649753121062912") {
        console.log('cool');
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
    /*
    if (message.channel.id === "626538160330899476" || message.channel.id === "620714509862174720" || message.channel.id === "453736163187097601") {
        if (message.content.startsWith('99')) {
            message.channel.send("100 suckers, yo shouts out to my boy blade for getting cucked.");
        }
    }
     */
    if (message.content === 'thanks bud') {
        message.reply("no problem fam")
        return;
    }
    if (message.content === '>debug') {
        var guilds = client.guilds.array();
        for (var guild of guilds) {
            if (guild.owner) {
                console.log(guild.name + " : " + guild.id + " : " + guild.owner.user.username)
            } else {
                console.log(guild.name + " : " + guild.id)
            }
        }
        return;
    }
    try {
        if (message.content === '>start alerts') {
            var channel = message.channel.guild.channels.get('597471505571381272');
            var messageToSend = '```md\nALERT\n===========\nPlease refrain from making general discussion in this channel. Individuals chatting in here are expected to either be posting gacha/scouting results or salt about these posts. Anyone who is caught utilizing #gacha-results as a second #pm-chat will receive a warning or mute with no verbal warning beforehand. Any selling or trading is strictly prohibited on the pokemon masters discord, and anyone suspected of trying to initiate an account exchange with other users will be immediately banned. Remember to spend your money wisely, gacha is gambling.```';
            channel.send(messageToSend);
            settime(messageToSend, channel);
        }
        if (message.content === ">stop alerts") {
            clearTimeout(timedMessage);
        }
    } catch (e) {
        //
    }
    try {
        if (message.guild.id === '583120259708616715') {
            if (message.channel.id === '603818219131764736' || message.channel.id === '604281012901511178') {
                return;
            }
        }
    } catch (e) {
        //
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
        client.commands.get(command).execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply('Cannot run command!');
    }
});

client.login(environment === "production" ? prodToken : stagingToken);

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

function settime(messageToSend, channel) {
    timedMessage = setTimeout(() => {
        channel.send(messageToSend);
        settime(messageToSend, channel)
    }, 10800000);
}

